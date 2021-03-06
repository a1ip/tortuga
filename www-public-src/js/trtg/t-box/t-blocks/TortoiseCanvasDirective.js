om.ns_run('trtg.tbox.tblocks', function(ns)
{
    /**
     * Displays Tortoise canvas that gets commands and can draw lines
     * and display tortoises. It works in math coordinate system, where OY 
     * goes from down to up.
     * @alias TortoiseCanvasDirective
     * @memberOf  trtg.tbox.ang.tblocks
     * @param {string} dispatcher_controller_name - name of controller that manages 
     * @param {string} dispatcher_controller_field - scope field name that controller will be attached to.
     * messages exchange.
     */
    ns.TortoiseCanvasDirective = function TortoiseCanvasDirective(dispatcher_controller_name, dispatcher_controller_field)
    {
        var link = function(scope, $element, attrs)
        {
            var slice = om.ns_get('Array.prototype.slice');
            var canvas;
            var div;
            var controller = scope[dispatcher_controller_field];

            (function init(){
                var $div = $element.find('div');
                div = $div[0];
                $div.css('height', div.offsetWidth / 2 + "px");

                var $canvas = $element.find('canvas');
                canvas = $canvas[0];
                $canvas.attr('width', canvas.offsetWidth).attr('height', canvas.offsetHeight);
                controller.mouse_service.subscribe_on_canvas(canvas);
                e = $element;
            })();

            var block = controller.tortuga_service.register_block(canvas, div);

            $element.on('$destroy', function()
            {
                controller.tortuga_service.unregister_block(block);
                controller.mouse_service.unsubscribe_from_canvas(canvas);
            });

            // // Example 1: 
            // var t = block.createTortoise();
            // block.placeTortoise(t, 0, 0, 45, false, '#f00');
            // var text = $element.text();

            // // Example 2:
            // var service = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoise_canvas_service');
            // var result = service.createTortoise();
            // service.placeTortoise(result, 0, 0, 45, false, '#f00');

            // // Example 3:
            // var runner = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_tortoise_runner');
            // // короткий доступ к библиотеке:
            // var Tr = runner.constructor

            // var t; // это будет черепаха.
            // // // создаём команду, создающую черепаху:
            // var command = Tr.constructCommand(Tr.commands.create, 0, 20, "green", 1, "round", function(tt){t = tt});

            // // // создаём команды опускания и поднимания хвоста:
            // var td = Tr.constructCommand(Tr.commands.tailDown, function(){return t})
            // var tu = Tr.constructCommand(Tr.commands.tailUp, function(){return t})

            // // // выполняем команду, черепаха создаётся:
            // runner.run(command)

            // // // создаём комадну, двигающую черепаху вперёд:
            // var goCommand = Tr.constructCommand(Tr.commands.go, function(){return t}, 10)

            // // выполняем движение черепахи.
            // runner.run(td)
            // runner.run(goCommand)
            // runner.run(tu)
            // runner.run(goCommand)
            // runner.run(td)
            // runner.run(goCommand)
            // runner.run(tu)
            // runner.run(goCommand)
            // runner.run(td)
            // runner.run(goCommand)



            // // Example 4.
            // var myJc = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_js-converter');
            // //Создаём черепаху
            // var t = myJc.parseNode(myJc.nodes.create, 0, 0, "green", 1, "round")
            // //Прём вперёд
            // myJc.parseNode(myJc.nodes.go, t, 100)

            // //Начинаем цепочку
            // myJc.parseNode(myJc.nodes.begin)
            // //Делаем три вызова, ничего не происходит
            // myJc.parseNode(myJc.nodes.go, t, 100)
            // myJc.parseNode(myJc.nodes.go, t, 100)
            // myJc.parseNode(myJc.nodes.go, t, 100)
            // //Обрываем цепочку, выполняются все три команды
            // myJc.parseNode(myJc.nodes.end)


            // // Example 5
            // var globals = angular.element(document.getElementById('t_box_module')).injector().get('tbox_tortoisevm_tortoise-globals');
            // var t = createTortoise();
            // t.rotate(45);
            // t.tailDown().go(10).tailUp().go(10).tailDown().go(10).rotate(-45);
            // repeat(30);
            //     t.go(2).rotate(90).go(2).rotate(-90);
            // end();
        };

        return {
            restrict : 'E',
            link : link,
            scope : {},
            controller : dispatcher_controller_name + ' as ' + dispatcher_controller_field,
            template: '<div class="tortuga-canvasContainer">'
                + '<div class="tortuga-canvasContainer-bg" ng-attr-style="background-image:url({{' +
                    dispatcher_controller_field + '.background_url}})"></div>'
                + '<canvas class="tortuga-canvasContainer-canvas"></canvas>'
                + '</div>'
        };
    };
});