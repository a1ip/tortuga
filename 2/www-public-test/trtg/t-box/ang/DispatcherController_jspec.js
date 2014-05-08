'use strict';

describe('DispatcherController', function()
{
    var scope;
    var service;

    beforeEach(module('t_box_module'));

    // injection du service $controller et du $rootScope, 
    // attention l'identification du service se fait sur son nom
    // il faut bien respecter $controller et pas écrire $controleur
    beforeEach(inject(['DispatcherService', '$controller', '$rootScope', function(serv, $controller, $rootScope) {
        // creation du controller avec le nouveau scope
        scope = $rootScope.$new();
        var controller = $controller("DispatcherController", {
            $scope: scope
        });
        service = serv;
    }]));

    it('test dispatches', function()
    {
        var str;
        var handler = function(value){str = value;};
        scope.add_handler(handler);
        scope.dispatch("hello");
        expect(str).toEqual("hello");
        service.dispatch("service says hello");
        expect(str).toEqual("service says hello");
        scope.remove_handler(handler);
        scope.dispatch("ololo");
        expect(str).not.toEqual("ololo");
        service.dispatch("service says ololo");
        expect(str).not.toEqual("service says ololo");
    });

    it('test unsubscribes on scope destroying', function()
    {
        var str;
        var handler = function(value){str = value;};
        scope.add_handler(handler);
        service.dispatch("hello");
        expect(str).toEqual("hello");
        scope.$destroy();
        service.dispatch("ololo");
        expect(str).not.toEqual("ololo");
    });
});