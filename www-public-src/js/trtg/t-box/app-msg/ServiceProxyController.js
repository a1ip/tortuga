om.ns_run('trtg.tbox.app_msg', function(ns)
{

/**
 * Controller that proxies all methods of injected service to injected scope.
 * @memberOf trtg.tbox.app_msg
 * @param scope
 * @param service
 */
function ServiceProxyController(scope, service)
{
    for(var i in service)
    {
        if(angular.isFunction(service[i])) {
            scope[i] = service[i].bind(service);
        }
    }
};

ns.ServiceProxyController = ServiceProxyController;
});
