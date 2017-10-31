// Namespace deklarieren
var JafWeb = (JafWeb || {}); // aus base.js

JafWeb.isDocumentReady = function()
{
    return $(document).ready();
}

// Allgemeine aus base.js
/**
 * AJAX-Request ohne Library-Abhängigkeit.
 * @tparam cfg Konfiguration. Properties:
 * - url
 * - method ("GET"|"POST")
 * - async (Bool)
 * - params
 * - scope
 * - callerName (String)
 * - disableCaching (Bool)
 * - success (Function)
 * - failure (Function)
 * - dataType Erwartetes Antwortformat ('json'|'html'|'text', Standard: 'json')
 * - authToken
 */
JafWeb.ajaxRequest = function(cfg)
{
    if(false !== cfg.resetAutoLogout)
        UIApplication.resetAutoLogout();
	if(JafWeb.onAjaxRequest(cfg) === false)
	{
		if(!!cfg['failure'])
			cfg.failure();
		return;
	}
    var settings = {};
    settings.async = (false !== cfg.async);
    settings.cache = (false === cfg.disableCaching);
    if(cfg['scope'])
        settings.context = cfg.scope;
    var pars = (cfg.params || []);
    if(cfg['dataType'])
        pars.fmt = cfg['dataType'];
    var data = pars;
    data = jQuery.param(data);
    data = data.replace(/\+/g, '%20');
    settings.data = data;
    settings.dataType = (cfg.dataType || 'json');
    settings.error = (cfg.failure || function() {});
    //settings.headers = {}; TODO?
    settings.method = (cfg.method || 'GET');
    settings.processData = false;
    settings.success = (cfg.success || function() {});
    settings.url = cfg.url;
	if(cfg.authToken)
	{
		settings.headers = {
				Authorization: 'Session ' + cfg.authToken
			};
	}
    jQuery.ajax(cfg.url, settings);
}

JafWeb.isArray = jQuery.isArray;

/* test
JafWeb.onAjaxRequest = function(cfg)
	{
		console.log("### " + (cfg.callerName || cfg.url));
		return;
	} */
