/**
Объект объединяющий в себе интерфейс конкретного рисования 
(нарисуй такую-то линию такого-то цвета) и интерфейс размещения черепашки.

Интерфейс размещения черепашки абстрагируется от того, что это какой-то DIV,
как-то сдвинутый, повёрнутый и ещё чуть-чуть сдвинутый.
Команда просто принимает на вход координаты черепашки, угол поворота,
её цвет и то, опущен ли её хвост.

Интерфейс рисования абстрагируется от Canvas, 2d-контекста и пересчёта координат
(которые у нас перевёрнуты вдоль Y)
Рисует на каком-то задарее заданном холсте.

Методы TortoiseCanvasBlock вызываются из TortoiseRunner.
*/

om.ns_run('trtg.tbox.tblocks', function(ns)
{
    //==== Context functions ==================================================
    var extractCtxFromCanvasAndConfigure = function(canvas)
    {
        var ctx = canvas.getContext('2d');
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        return ctx;
    };

    var convertCoordsTortugaToCanvas = function(ctx, tortugaX, tortugaY)
    {
        return {
            x : tortugaX,
            y : (ctx.canvas.height - tortugaY)
        };
    };

    var convertCoordsCanvasToTortuga = function(ctx, canvasX, canvasY)
    {
        return {
            x : canvasX, 
            y : (ctx.canvas.height - canvasY)
        };
    };


    var clearCtx = function(ctx)
    {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    var setColor = function(ctx, color)
    {
        ctx.strokeStyle = color;
    };

    var setWidth = function(ctx, width)
    {
        ctx.lineWidth = width;
    };

    var setCapsStyle = function(ctx, style_caps)
    {
        ctx.lineCap = style_caps;
    };

    var getColorAt = function(ctx, x, y, withAlpha)
    {
        y = ctx.canvas.height - y;

        var data = ctx.getImageData(x, y, 1, 1).data;
        var color = data[3]
            ? {red: data[0], green: data[1], blue: data[2]}
            : {red: 255, green: 255, blue: 255};

        if(withAlpha)
        {
            color.alpha = data[3];
        }

        return color;
    };

    //==== Tortoise functions ==================================================
    var createTortoiseDiv = function(container)
    {
        var ttd = document.createElement('DIV');
        ttd.className = 'om-tortoise-div';
        container.appendChild(ttd);

        var pointer = document.createElement('DIV');
        pointer.className = 'om-tortoise-pointer';
        ttd.appendChild(pointer);

        var color = document.createElement('DIV');
        color.className = 'om-tortoise-color';
        ttd.appendChild(color);

        var image = document.createElement('DIV');
        image.className = 'om-tortoise-image';
        ttd.appendChild(image);

        return {
            main:ttd,
            pointer:pointer,
            color:color
        };
    };

    //=== Math ===
    var degToRotation = function(deg)
    {
        return 90 - deg;
    };
    var degToRad = function(deg)
    {
        return deg / 180 * Math.PI;
    };


    var createTortoise = function(drawingSystem)
    {
        var id = drawingSystem.tortoiseCounter;
        drawingSystem.tortoises[id] = createTortoiseDiv(drawingSystem.tortoiseContainer);
        drawingSystem.tortoiseCounter++;

        return id;
    };

    var destroyTortoise = function(drawingSystem, dsTortoiseId)
    {
        var ttdi = drawingSystem.tortoises[dsTortoiseId];
        delete drawingSystem.tortoises[dsTortoiseId];
        drawingSystem.tortoiseContainer.removeChild(ttdi.main);
    };

    var placeTortoise = function(drawingSystem, dsTortoiseId, x, y, deg, 
        isDrawing, color)
    {
        var ttdi = drawingSystem.tortoises[dsTortoiseId];
        var ttd = ttdi.main;
        var rad = degToRad(deg);
        var rotation = degToRotation(deg);

        var dx = ttd.offsetWidth * (Math.cos(rad) - Math.sin(rad)/2);
        var dy = ttd.offsetWidth * (Math.cos(rad)/2 + Math.sin(rad) - 1);

        ttd.style.left = (x + dx) + 'px';
        ttd.style.bottom =  (y + dy) + 'px';
        var rotate = 'rotate(' + rotation + 'deg)';
        var rotateOrigin = '0% 0%';
        ttd.style['webkitTransform'] = rotate;
        ttd.style['webkitTransformOrigin'] = rotateOrigin;
        ttd.style['MozTransform'] = rotate;
        ttd.style['MozTransformOrigin'] = rotateOrigin;
        ttd.style['OTransform'] = rotate;
        ttd.style['OTransformOrigin'] = rotateOrigin;
        ttd.style['msTransform'] = rotate;
        ttd.style['msTransformOrigin'] = rotateOrigin;

        ttdi.pointer.style.background = isDrawing ? color : 'none';
        ttdi.color.style['border-color'] = color;
        ttdi.color.style['borderColor'] = color;
    };

    //==== DrawingSystem =======================================================
    var TortoiseCanvasBlock = function(canvas, tortoiseContainer)
    {
        var ctx = extractCtxFromCanvasAndConfigure(canvas);
        this.ctx = ctx;
        this.ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
        this.tortoiseContainer = tortoiseContainer;
        this.tortoises = {};
        this.tortoiseCounter = 0;
    };

    TortoiseCanvasBlock.prototype = {
        setColor:     function(color){            setColor(this.ctx, color) },
        getColorAt:   function(x, y){             return getColorAt(this.ctx, x, y, false) },
        getColorWithAlphaAt: function(x, y){      return getColorAt(this.ctx, x, y, true) },
        setWidth:     function(width){            setWidth(this.ctx, width) },
        moveTo:       function(x, y){             this.ctx.moveTo(x, y) },
        lineTo:       function(x, y){             this.ctx.lineTo(x, y) },
        beginPath:    function(){                 this.ctx.beginPath() },
        stroke:       function(){                 this.ctx.stroke() },
        clearCanvas:  function(){                 clearCtx(this.ctx) },
        setCapsStyle: function(style_caps){       setCapsStyle(this.ctx, style_caps) },
        getCanvas: function(){					  return this.ctx.canvas},
        convertCoordsTortugaToCanvas: function(x, y)
        {
            return convertCoordsTortugaToCanvas(this.ctx, x, y);
        },
        convertCoordsCanvasToTortuga: function(x, y)
        {
            return convertCoordsCanvasToTortuga(this.ctx, x, y);
        },

        createTortoise: function(){ return createTortoise(this); },
        placeTortoise: function(dsTortoiseId, x, y, deg, isDrawing, color)
        {
            placeTortoise(this, dsTortoiseId, x, y, deg, isDrawing, color);
        },
        destroyTortoise: function(dsTortoiseId){ destroyTortoise(this, dsTortoiseId); },
    };

    ns.TortoiseCanvasBlock = TortoiseCanvasBlock;
});