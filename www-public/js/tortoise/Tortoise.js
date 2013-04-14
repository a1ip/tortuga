ns("Tortuga");
var createTortoise;
(function(){
	var prependArgumentsByObject = Om.prependArgumentsByObject;

	//=== Graph and HTML =====
	var createTortoiseDiv = function(container)
	{
		var ttd = document.createElement("DIV");
		ttd.className = "om-tortoise-div";
		container.appendChild(ttd);

		var pointer = document.createElement("DIV");
		pointer.className = "om-tortoise-pointer";
		ttd.appendChild(pointer);

		var color = document.createElement("DIV");
		color.className = "om-tortoise-color";
		ttd.appendChild(color);

		var width = document.createElement("DIV");
		width.className = "om-tortoise-width";
		ttd.appendChild(width);

		var image = document.createElement("DIV");
		image.className = "om-tortoise-image";
		ttd.appendChild(image);

		return {main:ttd, pointer:pointer, color:color, width:width};
	}

	var updateDiv = function(t)
	{
		var ttdi = t.getDivObject();
		var ttd = ttdi.main;
		var rad = radRot(t);
		var dx = ttd.offsetWidth * (Math.cos(rad)/2 + Math.sin(rad));
		var dy = ttd.offsetHeight * (Math.cos(rad) - Math.sin(rad) / 2);
		ttd.style.left = (t.x + dx) + "px";
		ttd.style.top =  (t.y + dy) + "px";
		var rotate = "rotate(" + t.rotation + "deg)"
		var rotateOrigin = "0% 0%"
		ttd.style["webkitTransform"] = rotate
		ttd.style["webkitTransformOrigin"] = rotateOrigin
		ttd.style["MozTransform"] = rotate
		ttd.style["MozTransformOrigin"] = rotateOrigin
		ttd.style["OTransform"] = rotate
		ttd.style["OTransformOrigin"] = rotateOrigin
		ttd.style["msTransform"] = rotate
		ttd.style["msTransformOrigin"] = rotateOrigin

		ttdi.pointer.style.background = t.isDrawing ? t.color : "none";
		ttdi.pointer.style.width = t.isDrawing ? t.width : "none";            // ?
		ttdi.color.style["border-color"] = t.color;
		ttdi.color.style["borderColor"] = t.color;
		ttdi.width.style["border-width"] = t.width;
		ttdi.width.style["borderWidth"] = t.width;
	}


	//=== Math ===
	var degToRad = function(deg)
	{
		return deg / 180 * Math.PI;
	}

	var radRot = function(t)
	{
		return Math.PI - degToRad(t.rotation);
	}

	//==== Construction helpers ====
	var applyMethodsToProto = function (methods, proto, wrapMethod)
	{
		for(var key in methods)
		{
			proto[key] = wrapMethod(methods[key]);
		}
	}

	var wrapTortoisProtoMethod = function(fun)
	{
		return function()
		{
			var args = prependArgumentsByObject(this, arguments);
			fun.apply(null, args);
			updateDiv(this);
			return this;
		}
	}



	var proto = {
		go : function(t, length)
		{
			length = length || 0;
			var ox = t.x;
			var oy = t.y;

			var rad = radRot(t);
			t.x += length * Math.sin(rad);
			t.y += length * Math.cos(rad);

			if(t.isDrawing)
			{
				oldColor = setColor(t.color);
				oldWidth = setWidth(t.width);
				drawLine(ox, oy, t.x, t.y);
				setColor(oldColor);
				setWidth(oldWidth);
			}
		},

		rotate : function(t, deg){t.rotation -= (deg || 0)},
		tailUp : function(t){t.isDrawing = false},
		tailDown : function(t){t.isDrawing = true},
		setColor : function(t, c){t.color = c || t.color},
		setWidth : function(t, w){t.width = w || t.width}
	}
	proto.fw = proto.go;
	proto.forward = proto.go;
	proto.lt = proto.rotate;
	proto.rt = function(t, deg){t.rotate(deg ? -deg : 0)}
	proto.up = proto.tailUp;
	proto.dw = proto.tailDown;

	var Tortoise = function(xx, yy, color, width, tortoiseContainer)
	{		
		var ttdi = createTortoiseDiv(tortoiseContainer);
		var ttd = ttdi.main;

		this.x = xx || tortoiseContainer.offsetWidth / 2;
		this.y = yy || tortoiseContainer.offsetHeight / 2;
		this.color = color || "#0a0";
		this.width = width || 1;
		this.rotation = 180;
		this.isDrawing = false;

		this.getDivObject = function(){return ttdi}

		updateDiv(this);
	}
	applyMethodsToProto(proto, Tortoise.prototype,
		wrapTortoisProtoMethod);
	Tortoise.prototype.repeat = function(count)
	{
		return new Tortuga.RepeatTortoise(this, count);
	}

	Tortuga.Tortoise = Tortoise;
	Tortuga.initTortoise = function(tortoiseContainer)
	{
		createTortoise = function(xx, yy, color, width)
		{
			return new Tortoise(xx, yy, color, width, tortoiseContainer);
		}
	}
})()