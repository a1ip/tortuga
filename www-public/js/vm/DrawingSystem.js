ns("Tortuga.Vm");

(function()
{
	//==== Context functions ==================================================
	var extractCtxFromCanvasAndConfigure = function(canvas)
	{
		var ctx = canvas.getContext("2d")
		ctx.lineJoin = "round"
		ctx.lineCap = "round"
		return ctx;		
	}

	var clearCtxOfCanvas = function(canvas, ctx)
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	var setColor = function(ctx, color)
	{
		ctx.strokeStyle = color;
	}

	var setWidth = function(ctx, width)
	{
		ctx.lineWidth = width;
	}

	var getColorAt = function(ctx, x, y, withAlpha)
	{
			y = ctx.canvas.height - y

			var data = ctx.getImageData(x, y, 1, 1).data
			var color = data[3]
				? {red: data[0], green: data[1], blue: data[2]}
				: {red: 255, green: 255, blue: 255}

			if(withAlpha)
			{
				color.alpha = data[3]
			}

			return color
	}

	//==== Tortoise functions ==================================================
	var createTortoiseDiv = function(container)
	{
		var ttd = document.createElement("DIV")
		ttd.className = "om-tortoise-div"
		container.appendChild(ttd)

		var pointer = document.createElement("DIV")
		pointer.className = "om-tortoise-pointer"
		ttd.appendChild(pointer)

		var color = document.createElement("DIV")
		color.className = "om-tortoise-color"
		ttd.appendChild(color)

		var image = document.createElement("DIV")
		image.className = "om-tortoise-image"
		ttd.appendChild(image)

		return {main:ttd, pointer:pointer, color:color}
	}

	//=== Math ===
	var degToRotation = function(deg)
	{
		return 90 - deg;
	}
	var degToRad = function(deg)
	{
		return deg / 180 * Math.PI;
	}


	var createTortoise = function(drawingSystem)
	{
		var id = drawingSystem.tortoiseCounter
		drawingSystem.tortoises[id] = 
			createTortoiseDiv(drawingSystem.tortoiseContainer)
		drawingSystem.tortoiseCounter++

		return id
	}

	var destroyTortoise = function(drawingSystem, dsTortoiseId)
	{
		var ttdi = drawingSystem.tortoises[dsTortoiseId]
		delete drawingSystem.tortoises[dsTortoiseId]
		drawingSystem.tortoiseContainer.removeChild(ttdi.main)
	}

	var placeTortoise = function(drawingSystem, dsTortoiseId, x, y, deg, 
		isDrawing, color)
	{
		var ttdi = drawingSystem.tortoises[dsTortoiseId]
		var ttd = ttdi.main;
		var rad = degToRad(deg);
		var rotation = degToRotation(deg);

		var dx = ttd.offsetWidth * (Math.cos(rad) - Math.sin(rad)/2);
		var dy = ttd.offsetWidth * (Math.cos(rad)/2 + Math.sin(rad) - 1);

		ttd.style.left = (x + dx) + "px";
		ttd.style.bottom =  (y + dy) + "px";
		var rotate = "rotate(" + rotation + "deg)"
		var rotateOrigin = "0% 0%"
		ttd.style["webkitTransform"] = rotate
		ttd.style["webkitTransformOrigin"] = rotateOrigin
		ttd.style["MozTransform"] = rotate
		ttd.style["MozTransformOrigin"] = rotateOrigin
		ttd.style["OTransform"] = rotate
		ttd.style["OTransformOrigin"] = rotateOrigin
		ttd.style["msTransform"] = rotate
		ttd.style["msTransformOrigin"] = rotateOrigin

		ttdi.pointer.style.background = isDrawing ? color : "none";
		ttdi.color.style["border-color"] = color;
		ttdi.color.style["borderColor"] = color;
	}

	//==== DrawingSystem =======================================================
	var DrawingSystem = function(canvas, tortoiseContainer)
	{
		var ctx = extractCtxFromCanvasAndConfigure(canvas)
		this.ctx = ctx
		this.ctx.setTransform(1, 0, 0, -1, 0, canvas.height)
		this.tortoiseContainer = tortoiseContainer
		this.tortoises = {}
		this.tortoiseCounter = 0;

		this.clearCanvas = function(){clearCtxOfCanvas(canvas, ctx)}
	}

	DrawingSystem.prototype = {
		setColor:     function(color){            setColor(this.ctx, color) },
		getColorAt:   function(x, y){             return getColorAt(this.ctx, x, y, false) },
		getColorWithAlphaAt: function(x, y){      return getColorAt(this.ctx, x, y, true) },
		setWidth:     function(width){            setWidth(this.ctx, width) },
		moveTo:       function(x, y){             this.ctx.moveTo(x, y) },
		lineTo:       function(x, y){             this.ctx.lineTo(x, y) },
		beginPath:    function(){                 this.ctx.beginPath() },
		stroke:       function(){                 this.ctx.stroke() },

		createTortoise: function(){ return createTortoise(this) },
		placeTortoise: function(dsTortoiseId, x, y, deg, isDrawing, color)
		{
			placeTortoise(this, dsTortoiseId, x, y, deg, isDrawing, color)
		},
		destroyTortoise: function(dsTortoiseId){ destroyTortoise(this, dsTortoiseId) },
	}

	Tortuga.Vm.DrawingSystem = DrawingSystem
})()