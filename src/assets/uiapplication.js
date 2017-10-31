/////////////////////////
// UIApplication
/////////////////////////
/**
@class UIApplication
Dieser Singleton stellt allgemeine Funktionen, u.a. zum Öffnen von
Dialogen bereit.
*/
var UIApplication = {

	/*
	 * Die werden von Wizard-JavaScripts benutzt:
	 */
	READONLY : 2, // UIRes.READONLY,
	LEFT : 4, // UIRes.LEFT,
	RIGHT : 8, // UIRes.RIGHT,
	CENTER : 16, // UIRes.CENTER,
	PASSWORD : 32, // UIRes.PASSWORD,
	BOLD : 64, // UIRes.BOLD,
	ITALIC : 128, // UIRes.ITALIC,
	NORMAL : 256, // UIRes.NORMAL,
	EDIT_ACTION: 16384, // UIRes.EDIT_ACTION,
	NEW_ACTION: 65536, // UIRes.NEW_ACTION,
	DELETE_ACTION: 262144, // UIRes.DELETE_ACTION,
	INVISIBLE: 1, // UIRes.NOFRAME,

	_urlRoot : '',
	_uploadUrl : '',
	_scriptDir : 'resExt/script',
	_downloadUrl : '',
	_logoutEvent : 'logout',
	_fileUploader : null,
	_soundManager : null,
	_soundManagerUrl : '',
	_userDataDOM: null, // fuer userData-behavior im IE
	_smInit: false,
	_updateDispatcher: null,
	_autoLogoutIv: null,
	_autoLogoutUrl: '',
	_autoLogoutMinutes: 0,
	_autoLogoutTime: 0,
	_autoLogoutCompOrFn: null,
	_keepAliveIv: 0,
	_authToken: '',
	_inOpenFormDialogHandler: false,

	SimulateTouchEvents: false,
	RedirectTouchEvents: false,
	AllowDialogPinchRescale: false,
	AllowListPinchRescale: false,
	RestoreDialogScale: false,
	ShowDialogsMaximized: false,
	// asynchrone OperationCalls
	/**
	@attr {number} OpCallRetryCount
	@desc Die Anzahl der auf der Server-Seite verfügbaren Threads für
	asynchrone [PDOperationCalls]{@link PDOperationCall} ist begrenzt,
	deshalb kann es in Extremfällen dazu kommen, dass das Starten einer
	asnychronen Operation im ersten Anlauf fehlschlägt.
	Wenn das Starten aus diesem Grund fehlschlägt, ist es i.d.R. erfolgreich,
	es nach kurzer Zeit erneut zu probieren.<br/>
	Mit dieser Einstellung wird festgelegt, wie oft der OperationCall das von
	sich aus versuchen soll. Die Wartezeit zwischen den Versuchen wird in
	[UIApplication.OpCallRetryInterval]{@link UIApplication.OpCallRetryInterval}
	festgelegt.<br/>
	Diese Einstellungen wirken als Vorgabewerte für alle Operationsaufrufe,
	können aber in jedem Einzelfall durch Aufruf von
	[setInitRetries()]{@link PDOperationCall#setInitRetries} überschrieben
	werden.
	*/
	OpCallRetryCount: 5,
	/**
	@attr {number} OpCallRetryInterval
	@desc Wartezeit für [PDOperationCalls]{@link PDOperationCall}, nach der
	der Start einer Server-asynchronen Operation erneut versucht werden soll.
	Siehe [UIApplication.OpCallRetryCount]{@link UIApplication.OpCallRetryCount}.
	*/
	OpCallRetryInterval: 2000,
	
	USE_COMPLEX_TRANSACTIONS: true,
	USE_PDOBJECT_CACHE: true,
	
	/**
	 * @attr {boolean} COPY_WIZARD_PARAMS_TO_DIALOGOBJECT
	 * @desc Bewirkt, dass die an den {@link PDWizard} übergebenen Parameter
	 * in das Dialog-{@link PDObject} kopiert werden, so dass sie auf diesem
	 * wie normale Properties abgefragt und gesetzt werden können.<br/>
	 * Standardmäßig wird das <em>nicht</em> gemacht, weil es die Gefahr birgt,
	 * namensgleiche Properties des Fachkonzeptobjekts zu überschreiben. In
	 * diesem Fall kann in Wizard-Skripten nur über
	 * [PDWizard.getProperty()]{@link PDWizard#getProperty} bzw.
	 * [PDWizard.addProperty()]{@link PDWizard#addProperty} auf die Parameter
	 * zugegriffen werden.<br/>
	 * Um in diesem Punkt Kompatibilität mit dem GUI Client herzustellen, kann
	 * diese Option auf <code>true</code> gesetzt werden.
	 */
	COPY_WIZARD_PARAMS_TO_DIALOGOBJECT: false,
	
	CountAjaxRequests: false,
	_reqCount: 0,
	
	_appConfig: { },

	validators: { },

	init : function()
	{
		this.OpCallRetryCount = 5;
		this.OpCallRetryInterval = 2000;

		if((typeof Ext != 'undefined') && Ext['Ajax'])
			Ext.Ajax.on('requestexception', this.handleNetworkError, this);

		// URL fuer BLANK_IMAGE auf eigenen Server lenken, damit das nicht durch 
		// Sicherheitseinstellungen fehlt. (In anderen Browsern wird das Image direkt
		// eingebettet.)
		if((typeof Ext != 'undefined') && (Ext.isIE6 || Ext.isIE7))
			Ext.BLANK_IMAGE_URL = UIApplication.getUrlRoot() + '/../' +
					UIApplication.getResourceDir() + 'script/ext-3.4.0/resources/images/default/s.gif';

		this.initSoundManager();
		
		//this.onInitApplication(); wird in JAFwebLayout.xsl aufgerufen!
	},
	
	/**
	 * Gibt Einstellungen aus der Konfiguration der Web-App zurück.
	 * @param {string} [name] Name der abzufragenden Konfigurationseinstellung.
	 * Fehlt dieser Parameter, wird das gesamte Konfigurationsobjekt
	 * zurückgegeben!
	 */
	getConfig: function(name)
	{
		if(arguments.length > 0)
		{
			if(typeof UIApplication._appConfig[name] != 'undefined')
				return UIApplication._appConfig[name];
			return undefined;
		}
		return UIApplication._appConfig;
	},
	
	/**
	 * Setzt Konfigurationseinstellungen für die Web-App.
	 * @param {string} [name] Name der zu setzenden Konfigurationseinstellung.
	 * Fehlt dieser Parameter, wird als zweiter Parameter ein
	 * Objekt erwartet, dessen Properties der Konfiguration hinzugefügt
	 * werden. Bereits bestehende Einstellungen gleichen Namens werden dabei
	 * überschreiben.
	 * @param {mixed} what Der zu setzende Wert.
	 * @see [getConfig()]{@link UIApplication#getConfig}
	 * @example <caption>Laden einer Client-Konfiguration:</caption>
UIApplication.addToConfig({
		isAdmin: false,
		isLite: false,
		...
	});
// gueltige Konfiguration vom Server laden:
function initSettings()
{
	var pars = new JParamPacker('global.config');
	var successFn = function(req, options) {
			var resp = new JResponse(req, options);
			if(resp.hasFatalError() || resp.hasError())
				UIDebug.log(UIDebug.ERROR, "Die CLient-Konfiguration konnte nicht geladen werden!");
			else
				UIApplication.addToConfig(resp.getData());
		};
	JafWeb.ajaxRequest({
			url: UIApplication.getUrlRoot(),
			method: "GET",
			async: false,
			params: pars.get(),
			callerName: pars.getEventName(),
			disableCaching: true,
			success: successFn,
			failure: function() {
					UIDebug.log(UIDebug.ERROR, "Die CLient-Konfiguration konnte nicht geladen werden!");
				}
		});
}
initSettings();
// Abfrage:
if(UIApplication.getConfig('isAdmin'))
	 */
	addToConfig: function(name, what)
	{
		if(arguments.length < 2)
			JafWeb.apply(UIApplication._appConfig, name);
		else
			UIApplication._appConfig[name] = what;
	},
	
	/**
	 * Ermittelt die Verbindungsgeschwindigkeit durch testweises
	 * Herunterladen eines Bildes.
	 * @param {Function} callbFn Callback-Funktion zur Ausgabe des
	 * Ergebnisses. Im Fehlerfall wird die Funktion mit einem Objektparameter
	 * aufgerufen, dessen Property "error" (Typ String) den Fehler angibt.
	 * Andernfalls wird die Funktion mit einem Objekt mit folgenden
	 * Properties aufgerufen:
	 * <ul>
	 * 	<li><code>duration</code>: Dauer des Vorgangs in Millisekunden</li>
	 * 	<li><code>bitsLoaded</code>: Anzahl der heruntergeladenen Bits</li>
	 * 	<li><code>speedBps</code>: Geschwindigkeit in Bits pro Sekunde</li>
	 * </ul>
	 * Beachten Sie, dass der Test-Request kürzer sein kann als die Auflösung
	 * der <code>getTime()</code>-Funktion, mit dem Resultat, dass die
	 * <code>duration</code> dan <code>0</code> ist! Sie können das auf dem
	 * zurückgegebenen Objekt abfragen und dann z.B. ausgeben, dass die
	 * Geschwindigkeit <em>größer als</em> X ist.
	 * @example
UIApplication.detectConnectionSpeed(function(res) {
        var speedKbps = (res.speedBps / 1024).toFixed(2);
		UIMessage.ok("Speed: " + JSON.stringify(speedKbps + " Kbit/s"));
	});
	 */
	detectConnectionSpeed: function(callbFn)
	{
		var imageAddr = UIApplication.getResourceDir() + "img/document_text.png";
		var downloadSize = 1458; //bytes
		var tmpCallb = function() {
				var startTime, endTime;
				var download = new Image();
				download.onload = function () {
						endTime = (new Date()).getTime();
						var duration = (endTime - startTime);
						var tmpDur = duration;
						if(!tmpDur)
							tmpDur = 1;
						var bitsLoaded = downloadSize * 8;
						//console.log("" + (endTime - startTime) + " msec, " + Math.floor((bitsLoaded / tmpDur) * 1000 / 1024) + " Kb/sec");
						if(callbFn)
							callbFn({
									duration: duration,
									bitsLoaded: bitsLoaded,
									speedBps: (bitsLoaded / tmpDur) * 1000
								});
					};
				download.onerror = function (err, msg) {
						if(callbFn)
							callbFn({
									error: "Invalid image, or error downloading"
								});
					};
				startTime = (new Date()).getTime();
				var cacheBuster = "?nnn=" + startTime;
				download.src = imageAddr + cacheBuster;
			};
		window.setTimeout(tmpCallb, 1);
	},
	
	/**
	 * 
	 */
	getAuthToken: function()
	{ return this._authToken; },

	/**
	 * 
	 */
	setAuthToken: function(token)
	{
		this._authToken = token;
		if(typeof Ext == 'object')
		{
			Ext.apply(Ext.Ajax.defaultHeaders, {
					'Authorization': 'Session ' + this._authToken
				});
		}
	},

	/**
	 * Feuert ein Event.
	 * @param {Object} win Das Fenster resp. der Frame/IFrame, in dem
	 * das Event gefeuert wird.
	 * @param {string} evtName Name des Ereignisses. Die Browser
	 * kennen folgende:
	 <ul>
		<li><code>click</code></li>
		<li><code>contextmenu</code></li>
		<li><code>dblclick</code></li>
		<li><code>DOMMouseScroll</code> (nur Firefox)</li>
		<li><code>drag</code> (nicht Opera)</li>
		<li><code>dragdrop</code> (nur Firefox)</li>
		<li><code>dragend</code> (nicht Opera)</li>
		<li><code>dragenter</code> (nicht Opera)</li>
		<li><code>dragexit</code> (nur Firefox)</li>
		<li><code>draggesture</code> (nur Firefox)</li>
		<li><code>dragleave</code> (nur Internet Explorer, Chrome und Safari)</li>
		<li><code>dragover</code> (nicht Opera)</li>
		<li><code>dragstart</code> (nur Internet Explorer, Chrome und Safari)</li>
		<li><code>drop</code> (nur Internet Explorer, Chrome und Safari)</li>
		<li><code>mousedown</code></li>
		<li><code>mousemove</code></li>
		<li><code>mouseout</code></li>
		<li><code>mouseover</code></li>
		<li><code>mouseup</code></li>
		<li><code>mousewheel</code> (nicht Firefox)</li>
	 </li>
	 * @param {UIComponent} target Die Komponente, auf die das Ereignis
	 * gefeuert werden soll.
	 * @param {number} relativeX Relative Position von der linken
	 * Ecke der Komponente in Pixel (optional).
	 * @param {number} relativeY Relative Position von der oberen
	 * Ecke der Komponente in Pixel (optional).<br>
	 
	 * <b>Beispiel:</b><br>
	 * Folgendes Beispiel feuert ein Klick-Event auf den "Home"-Knopf
	 * in der Hauptwerkzeugleiste der Anwendung:
<pre>
UIApplication.fireEvent(window, 'click', browserBtnHome.getDomNodeForEvents())</pre>
	 */
	fireEvent : function(win, evtName, target, relativeX, relativeY)
	{
		var _win = (win || window);
		var mouseEvent = document.createEvent("MouseEvent");
		mouseEvent.initMouseEvent(evtName, true, true, _win, 1 /* click count */,
				target.screenX + (relativeX || 0), target.screenY + (relativeY || 0),
				target.clientX + (relativeX || 0), target.clientY + (relativeY || 0),
				false /* ctrl key */,
				false /* alt key */, false /* shift key */,
				false /* meta key */, 0 /* button (left) */,
				null /* related target (mouseover etc.) */);
		target.dispatchEvent(mouseEvent);
	},
	
	// @ignore(true)
	initSoundManager : function()
	{
		//
		// ggf. SoundManager initialisieren
		//
		if(this._soundManager && !this._smInit)
		{
			this._soundManager.url = this._soundManagerUrl;
 			JDebug.log(JDebug.DEBUG, "Initialize SoundManager (Path: '"+this._soundManager.url+"')");
	  	this._soundManager.useHTML5Audio = true; // Beta! Noetig, um OGG abzuspielen!
	  	//this._soundManager.useFlashBlock = false;
	  	//this._soundManager.useFastPolling = true;
	  	//this._soundManager.stream = true;
	  	this._soundManager.allowScriptAccess = 'always'; // oder sameDomain
	  	this._soundManager.flashVersion = 9;
	  	
	  	this._soundManager.debugMode = true; // bewirkt, dass andere SWF-Datei benoetigt wird!
	  	this._soundManager.useConsole = true;
	  	this._soundManager.defaultOptions.volume = 90;
	  	
	  	// Debug:
	  	var sm = this._soundManager;
		  sm.onload = function() {
		  		//UIDebug.log(UIDebug.WARN, "SoundManager successfully loaded");

					/*
					sm.createSound({
							id: 'testSound',
							url: 'resExt/script/soundmanager/demo/_mp3/440hz.mp3',
							autoLoad: true,
							autoPlay: true,
							onload: function() {
									UIDebug.log(UIDebug.WARN, 'Test sound loaded');
								},
							volume: 90
						}); */
			  };
		  sm.onerror = function() {
		  		//UIDebug.log(UIDebug.WARN, "Could not start SoundManager");
			  };
			this._smInit = true;
		}
	},
	
	// allgemeiner Handler fuer Fehler bei Ajax-Requests
	handleNetworkError : function(conn, resp, opts)
	{
		if(this.onNetworkError(conn, resp, opts) === false)
			return;
		//alert('Request exception occurred. readyState: '+resp.readyState+', status: '+resp.status);
		/*var cbFn = function(btn) { top.location.href = UIApplication.getUrlRoot(); }
		if(resp.readyState == undefined)
			UIMessage.ok('Network error. Server connection lost. Request status: '+resp.status, cbFn);
		else
			UIMessage.ok('Server connection lost or session timed out. Request status: '+resp.status+', readyState: '+resp.readyState, cbFn);*/
	},
	
	/**
	 * Redefinierbare Funktion, die beim ersten Laden der
	 * Anwendung ausgeführt wird, also beim Laden des Workspace,
	 * nicht aber erneut beim Laden von untergeordneten Fenstern.
	 */
	onInitApplication : function()
	{ },
	
	/**
	 * Wird aufgerufen, wenn ein AJAX Request fehlschlägt, z.B. weil die
	 * Verbindung unterbrochen oder die Session abgelaufen ist. Die Standardimplementierung
	 * zeigt eine Meldungsbox an und ruft dann im obersten Frame die
	 * von <code>UIApplication.getUrlRoot()</code> gelieferte URL auf.<br>
	 * Redefinieren Sie diese Funktion, wenn Sie ein abweichendes Verhalten
	 * erreichen möchten.
	 * @param {Ext.data.Connection} conn Die aktuelle Verbindung.
	 * @param {Object} resp Das Response-Objekt. Dessen Property <code>status</code>
	 * enthält den HTTP-Status-Code. Falls die Verbindung nicht unterbrochen ist, enthält
	 * darüberhinaus das Property <code>readyState</code> den aktuellen Bearbeitungsstatus
	 * des Requests. Für weitere Details siehe
	 * <a href="http://www.w3c.org/Protocols/rfc2616/rfc2616-sec10.html">HTTP Status Codes</a>.
	 * @param {Object} opts Die an den Request übergebenen Optionen.
	 */
	onNetworkError : function(conn, resp, opts)
	{ },
	
	/**
	 * Wird ausgelöst, wenn die Netzwerkverbindung zum Server verloren geht.
	 * Damit das detektiert wird, muss mittels <code>setCheckAliveInterval()</code>
	 * eine periodische Kontrolle der Netzwerkverbindung angestoßen werden.
	 */
	handleConnectionLost : function()
	{
		if(this.onConnectionLost() === false)
			return;
		UIMessage.ok("Server-connection lost!", function() {
				UIApplication.getWorkspace().logout();
			}, this, 'ERROR', UIMessage.FATAL);
	},

	/**
	 *
	 */
	onConnectionLost : function()
	{ },
	
	// Auto-Logout
	/**
	 * Wird aufgerufen, sobald der Auto-Logout-Zähler abgelaufen ist.
	 * Die Funktion ruft standardmäßig <code>logout()</code> auf dem
	 * <code>UIWorkspace</code>-Objekt auf.<br>
	 * Redefinieren Sie diese Funktion, um ein abweichendes Verhalten
	 * zu implementieren.
	 */
	handleAutoLogout : function()
	{
		if(this.onAutoLogout() === false)
			return;
		this.getWorkspace()._suppressLogoutMessages = true;
		this.getWorkspace().logout(this._autoLogoutUrl);
	},

	/**
	 *
	 */
	onAutoLogout : function()
	{ },
	
	/*
	 * @ignore(true)
	 * Aktualisiert den Auto-Logout-Zähler und löst ggf. das
	 * Abmelden aus.
	 */
	countdownAutoLogout : function()
	{
		var now = new Date().getTime();
		var delta = new Date(this._autoLogoutTime - now);
		if(delta < 0)
		{
			this.setAutoLogout(0);
			this.handleAutoLogout();
			return;
		}
		var theHour = delta.getHours();
		var theMin = delta.getMinutes();
		if (theHour > 0)
			theMin += 60 * (theHour - 1);
		var theSec = delta.getSeconds();
		var theTime = "";
		/*if (theMin > 15)
			theTime = theMin;
		else*/
			theTime = theMin + ((theSec < 10) ? ":0" : ":") + theSec;
		if(typeof this._autoLogoutCompOrFn == 'function')
			this._autoLogoutCompOrFn(theTime);
		else if(typeof this._autoLogoutCompOrFn == 'object' && typeof this._autoLogoutCompOrFn['setText'] == 'function')
			this._autoLogoutCompOrFn.setText(theTime);
	},
	
	/**
	 * Aktiviert den Auto-Logout-Mechanismus.
	 * @param {number} minutes Gibt an, nach wie vielen Minuten Untätigkeit automatisch
	 * ausgeloggt werden soll. Wird der Parameter weggelassen oder <code>0</code>
	 * angegeben, so wird die Auto-Logout-Funktion deaktiviert.
	 * @param {mixed} comOrFn Diesen Parameter müssen Sie angeben, wenn Sie die
	 * verbleibende Zeit in der Benutzungsoberfläche anzeigen möchten. Dazu können
	 * Sie entweder eine <code>UIComponent</code> angeben, die über eine
	 * <code>setText()</code>-Funktion verfügt (beispielweise einen
	 * <code>UIToolBarTitle</code> zur Darstellung in der Werkzuegleiste des
	 * Hauptfensters) oder aber eine JavaScript-Funktion, die den Wert
	 * darstellt; der aktuelle Wert wird (als formatierter String) im ersten
	 * Parameter an diese Funktion übergeben.<br>
	 * @param {string} logoutUrl Optionale URL, die nach den automatischen Logout
	 * aufgerufen werden soll. Vgl. <code>UIWorkspace.logout()</code>.
	 
	 * <b>Beispiel:</b>
<pre>
UIApplication.setAutoLogout(10, tbAutoLogoutCountdown);
UIApplication.setAutoLogout(10, function(val) { UIDebug.log(UIDebug.WARN, val); });</pre>
	 */
	setAutoLogout : function(minutes, compOrFn, logoutUrl)
	{
		if(this._autoLogoutIv)
		{
			//window.cancelAnimationFrame(this._autoLogoutIv);
			window.clearInterval(this._autoLogoutIv);
			this._autoLogoutIv = null;
		}
		if(!minutes)
			return;
		this._autoLogoutMinutes = minutes;
		//this._autoLogoutIv = window.requestAnimationFrame(UIApplication.countdownAutoLogout, 500);
		this._autoLogoutIv = window.setInterval("UIApplication.countdownAutoLogout()", 500);
		this._autoLogoutCompOrFn = (compOrFn || null);
		this._autoLogoutUrl = (logoutUrl || '');
		this.resetAutoLogout();
	},
	
	/*
	 * @ignore(true)
	 * Setzt den Auto-Logout-Zähler zurück, d.h. es wird neu
	 * heruntergezählt. Diese Funktion muss bei <em>allen</em> Aktionen
	 * aufgerufen werden, wenn Auto Logout verwendet wird.
	 */
	resetAutoLogout : function()
	{
		if(!this._autoLogoutMinutes)
			return;
		var t_now = new Date().getTime();
		this._autoLogoutTime = new Date(t_now + (this._autoLogoutMinutes * 1000 * 60)).getTime();
	},
	
	/*
	 * @ignore(true)
	 */
	checkAlive : function(aliveCallback)
	{
		var pars = new JParamPacker("ClientInfo.ping");
		var successFn = function(req, options)
			{
				try
				{
					var resp = new JResponse(req, options);
					var res = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(res !== 1)
						crash();
				}
				catch(ex)
				{
					window.clearInterval(this._keepAliveIv);
					this._keepAliveIv = 0;
					UIApplication.handleConnectionLost();
				}
				if(aliveCallback)
					aliveCallback();
			};
		// synchroner Request!
		var req = JafWeb.ajaxRequest({
				url: UIApplication.getUrlRoot(),
				method: "GET",
				async: false,
				resetAutoLogout: false, // AutoLogout *nicht* zuruecksetzen!
				params: pars.get(),
				disableCaching: true,
				callerName: pars.getEventName(),
				scope: this,
				success: successFn,
				failure: function()
					{
						window.clearInterval(this._keepAliveIv);
						this._keepAliveIv = 0;
						UIApplication.handleConnectionLost();
					}
			});
	},
	
	/**
	 * Bestimmt, dass die Anwendung periodisch prüfen soll, ob die Verbindung
	 * zum Anwendungs-Server noch besteht.
	 * @param {number} ms Anzahl Millisekunden, nach denen geprüft werden soll.
	 * Wenn die Verbindung abreißt, wird
	 * [UIApplication.handleConnectionLost()]{@link UIApplication#handleConnectionLost}
	 * aufgerufen.
	 */
	setCheckAliveInterval : function(ms)
	{
		if(this._keepAliveIv)
		{
			window.clearInterval(this._keepAliveIv);
			this._keepAliveIv = 0;
		}
		if(ms !== 0)
			this._keepAliveIv = window.setInterval("UIApplication.checkAlive()", (ms || 5000));
	},
	
	/**
	 * Wird vor einem generischen <code>callOperation</code>-Aufruf
	 * ausgeführt.<br/>
	 * <b>Beispiel</b>:
	 <pre class="prettyprint"><code>UIApplication.onCallOperation = function(parent, viewname, opname, obj) {
		switch(viewname)
		{
			case 'Verfahren':
				switch(opname)
				{
					case 'Fragen_beantworten':
						showAntwortenWizard(obj, function() {
								UIApplication.getWorkspace().update();
							});
						return false; // keine Standardbehandlung!
					...
				}
		}
	};</code></pre>
	 * @param {UIWindow} parent Falls von einem untergeordneten Fenster
	 * aus auferufen wird, sollte dieses hier angegeben werden. Bei
	 * fehelender Angabe oder <code>null</code> wird der Workspace
	 * angenommen.
	 * @param {string} viewname Der Name der View, aus der aufgerufen
	 * diese Funktion wurde.
	 * @param {string} opname Der Name der auszuführenden Operation.
	 * @param {PDObject} obj Angabe eines Fachkonzeptobjekts,
	 * falls es sich um eine Objektmethode handelt.
	 * @return {boolean} Geben Sie <code>true</code> oder <code>false</code>
	 * (Bedeutung siehe [callOperation()]{@link UIApplication#callOperation}
	 * zurück, um die Standardbehandlung zu unterbinden; bei allen anderen
	 * Rückgabewerten wird fortgefahren.
	 */
	onCallOperation : function(parent, viewname, opname, obj)
	{ },

	/**
	 * Eine generische, GUI-relevante Operation aufrufen.
	 * @param {UIWindow} parent Falls von einem untergeordneten Fenster
	 * aus auferufen wird, sollte dieses hier angegeben werden. Bei
	 * fehelender Angabe oder <code>null</code> wird der Workspace
	 * angenommen.
	 * @param {string} viewname Der Name der View, aus der aufgerufen
	 * diese Funktion wurde.
	 * @param {string} opname Der Name der auszuführenden Operation.
	 * @param {PDObject} obj Angabe eines Fachkonzeptobjekts,
	 * falls es sich um eine Objektmethode handelt.
	 * @return {boolean} <code>true</code>, falls die Methode
	 * aufgerufen werden konnte, sonst <code>false</code>.
	 */
	callOperation : function(parent, viewname, opname, obj)
	{
		//UIDebug.log(UIDebug.DEBUG, "UIApplication.callOperation(parent, '"+viewname+"', '"+opname+"', "+obj+")");
		if(typeof UIApplication.onCallOperation == 'function')
		{
			var res = UIApplication.onCallOperation(parent, viewname, opname, obj);
			if(res === true || res === false)
				return res;
		}
		return UIApplication.doCallOperation(parent, viewname, opname, obj);
	},
	
	/**
	Formulardialog ohne Fachkonzeptbindung modal öffnen.
	@param {string} viewname Name des Views.
	@param {string} title Dialogtitel (optional).
	@param {Function} callback Funktion, die nach dem Schließen des Dialogs
	aufgerufen werden soll.<br>
	Diese Funktion wird nach dem Schließen des Dialogs auf jeden Fall aufgerufen,
	unabhängig davon, ob der Benutzer den Dialog mit "OK" oder "Abbrechen" resp.
	den X-Knopf in der Titelleiste geschlossen hat. Der Funktion werden dabei
	folgende Parameter übergeben:
<ol>
	<li>Ein mumerischer Wert, der anzeigt, wie der Dialog geschlossen wurde.
	Mögliche Werte sind <code>UIMessage.OK</code> und <code>UIMessage.CANCEL</code>.
	Soll mit der Bearbeitung nur fortgefahren werden, wenn der Benutzer den
	Dialog über "OK" verlassen hat, so kann man in der Callback-Funktion abfragen:
<pre>
	function(res, data) {
			if(res===UIMessage.OK)
				...
		}</pre>
	<li>Dieser Parameter enthält das von dem Dialog bearbeitete JavaScript-Objekt.
</ol>
	@param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	Funktion ausgeführt werden soll.
	@param {Object} initialData JavaScript-Objekt, mit dem der Dialog initialisiert
	werden soll. Die Werte von dessen Properties werden in die Eingabeelemente gesetzt,
	deren <code>PropRef</code>-Attribut den Namen des Propereties hat.
  @see <code>UIDialog</code>
	*/
	openUIDialog : function(viewname, title, callback, scope, initialData)
	{
		//UIDebug.log(UIDebug.L9, 'UIApplication.openUIDialog('+viewname+', '+title+')');
		var vn = "";
		var tit = '';
		var cb = null;
		var cbScope = null;
		var initial = null;
		var pos = 0;
		if(arguments.length > pos && typeof arguments[pos] == "string")
			vn = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			tit = arguments[pos++];
		if(arguments.length > pos && (typeof arguments[pos] == "function" || arguments[pos] === null))
		{
			cb = arguments[pos++];
			if(arguments.length > pos && typeof arguments[pos] == "object")
				cbScope = arguments[pos++];
		}
		if(arguments.length > pos && typeof arguments[pos] == 'object')
			initial = arguments[pos++];
		// eindeutigen Namen erzeugen
		var name = "uidlg"+vn;
		var cnt = 0;
		while(this.getWorkspace().hasRegisteredWindow(name))
			name = "uidlg"+vn+(++cnt);
		var dlg = new UIWindow(this.getWorkspace(), name, "", new UIRes(0,0,0,0, UIRes.MODAL), tit);
		dlg.show();
		dlg.loadUIDialog(vn, tit, cb, cbScope, initial);
	},
	
	/**
	 * Formular ohne direkte Fachkonzeptanbindung einbetten.
	 * @param {UIContainer} parent Container-Komponente, in die das Formular eingebettet
	 * werden soll.
	 * @param {string} viewname Name des Views.
	 * @param {string} title Dialogtitel (optional).
	 * @param {Function} callback Funktion, die nach dem Schließen des Dialogs
	 * aufgerufen werden soll.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	 * Funktion ausgeführt werden soll.
	 * @param {Object} initialData JavaScript-Objekt, mit dem der Dialog initialisiert
	 * werden soll. Die Werte von dessen Properties werden in die Eingabeelemente gesetzt,
	 * deren <code>PropRef</code>-Attribut den Namen des Propereties hat.
	 * @see <code>UIWorkspace.embedUIDialog()</code>
	 */
	embedUIDialog : function(parent, viewname, title, callback, scope, initialData)
	{
		//UIDebug.log(UIDebug.UI_EVENT, "UIApplication.embedUIDialog("+viewname+", "+title+")");
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			wsp.embedUIDialog(parent, viewname, title, callback, scope, initialData);
	},
	
	/**
	Objektformular einbetten.
	@param {UIContainer} parent Container-Komponente, in die das Formular eingebettet
	werden soll.
	@param {PDObject} pdObject Das im Dialog zu bearbeitende Fachkonzeptobjekt
	oder <code>null</code> bei Neuanlage.
	@param {string} classname Name des Views. Entspricht
	dem Namen der Fachkonzeptklasse des darzustellenden Objekts,
	oder, im Falle des Stereotyps View, dem Namen der View-Klasse.
	@param {string} title Dialogtitel (optional).
	@param {PDObject} rootObj Das Wurzelobjekt, wenn der Dialog über eine
	Beziehung geöffnet wird.
	@param {string} rootPath Name der Beziehung, wenn der Dialog über eine
	Beziehung geöffnet wird. Der Beziehungsname muss aus Sicht des 
	<code>rootObj</code> angegeben werden.
	@param {number} saveStrategy Bestimmt die von dem geöffneten Dialog zu
	verwendende Speicherstrategie. Hier muss eine der in <code>PDDialog</code>
	definierten Konstanten übergeben werden:
	<ul>
		<li><code>PDDialog.MASTER</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte in eigener Regie direkt auf dem Server.
		Objekte aus wiederum von diesem abhängigen, weiter untergeordneten
		Dialogen werden dabei mitgespeichert.
		<li><code>PDDialog.SLAVE</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte nicht selbst, sondern übergibt das
		geänderte Objekt an den aufrufenden Dialog. Dort sollte ein Dialog
		mit der Speicherstrategie MASTER dafür sorgen, dass das Objekt aus dem
		geöffneten Dialog mitgespeichert wird.
	</ul>
	@param {string} viewname Information über das zu verwendende Layout (optional).
	@param {Function} callback Funktion, die nach dem Schließen des Dialogs
	aufgerufen werden soll. Beim Aufruf erhält diese Funktion das Dialogobjekt
	als Parameter. Optional gibt es einen zweiten, booleschen Parameter, der anzeigt,
	ob das Dialogobjekt modifiziert wurde, so dass z.B. eine Aktualisierung der Liste
	nötig ist, aus der der Dialog geöffnet wurde.
	@param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	Funktion ausgeführt werden soll.
	@param {boolean} readOnly Der Dialog wird schreibgeschützt geöffnet, so dass der
	Benutzer das Objekt nicht verändern kann.
	@param {OID[]} oidList Array der OIDs in der Liste, aus der der Dialog geöffnet
	wurde. Diese Information wird für das Blättern durch die Objektmenge verwendet.
	@see <code>UIWorkspace.embedFormDialog()</code>
	*/
	embedFormDialog : function(parent, pdObject, classname, title, rootObj, rootPath, saveStrategy,
			viewname, callback, scope, readOnly, oidList)
	{
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			wsp.embedFormDialog(parent, pdObject, classname, title, rootObj, rootPath, saveStrategy,
					viewname, callback, scope, readOnly, oidList);
	},
	
	/**
	 * Bettet eine HTML-Vorschau auf das angegebene Fachkonzeptobjekt
	 * in einen Workspace-Bereich ein.
	 * @param {UIContainer} parent Container-Komponente, in die die HTML-Sicht
	 * eingebettet werden soll, typischerweise eine <code>UIRegion</code>.<br/>
	 * Falls in diesem Container bereits eine Sicht eingebettet ist und diese
	 * ungespeicherte Änderungen enthält (bei Dialogen), wird sie kontrolliert
	 * zu schließen versucht. Schlägt das fehl - z.B. weil nicht gespeichert
	 * werden kann oder der Benutzer auf Rückfrage <i>Abbrechen</i> drückt -, so
	 * wird die Aktion abgebrochen!
	 * @param {number} cid Klassen-Id des Objekts. Ersatzweise
	 * der Klassenname (String).
	 * @param {number} oid Der untere Teil der Objekt-Id.
	 * @param {string} templ Optionale Angabe des zu
	 * verwendenden HTML-Templates. Wenn der Parameter
	 * fehlt, wird das Standard-Template der Klasse
	 * verwendet.
	 * @see <code>UIWorkspace.setPreviewObject()</code>
	 * @see <code>PDPreview.setPreviewObject()</code>
	 */
	setPreviewObject : function(parent, cid, oid, templ)
	{
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			wsp.setPreviewObject(parent, cid, oid, templ);
	},
	
	/**
	 * Zeigt das Resultat einer Fachkonzeptoperation in einer eingebetteten HTML-Sicht
	 * an. Die Operation muss dazu mundestens einen Ausgabeparameter
	 * vom Typ String besitzen, in den der darzustellende HTML-Code
	 * geschrieben wird.
	 * @param {UIContainer} parent Container-Komponente, in die die HTML-Sicht
	 * eingebettet werden soll, typischerweise eine <code>UIRegion</code>.<br/>
	 * Falls in diesem Container bereits eine Sicht eingebettet ist und diese
	 * ungespeicherte Änderungen enthält (bei Dialogen), wird sie kontrolliert
	 * zu schließen versucht. Schlägt das fehl - z.B. weil nicht gespeichert
	 * werden kann oder der Benutzer auf Rückfrage <i>Abbrechen</i> drückt -, so
	 * wird die Aktion abgebrochen!
	 * @param {string} opname Der Operationsname. Wenn es sich um eine
	 * Klassenoperation handelt, muss diese in der Form Klasse::Operation
	 * angegeben werden. Bei Objektoperationen muss hier der Operationsname
	 * und in den folgenden beiden Parametern das <code>PDObject</code>
	 * angegeben werden.
	 * @param {number} cid Klassen-Id, wenn eine Objektoperation aufgerufen
	 * werden soll. Alternativ kann auch der Klassenname als String angegeben
	 * werden.
	 * @param {number} oid Objekt-Id, wenn eine Objektoperation aufgerufen
	 * werden soll.
	 * @param {string[]} inStr Array mit String-Eingabeparametern an die Operation.
	 * @param {PDObject[]} inPdo Array mit Objekt-Eingabeparametern an die Operation.
	 * Die Anzahl und Anordnung der Parameter in diesen Arrays muss zu den
	 * Eingabeparametern der generierten Operation passen. Bei Operationen
	 * ohne Eingabeparameter können diese Aufrufparameter auch weggelassen werden.
	 * @see <code>UIWorkspace.setPreviewFromOperation()</code>
	 * @see <code>PDPreview.setPreviewFromOperation()</code>
	 */
	setPreviewFromOperation : function(parent, opname, cid, oid, inStr, inPdo)
	{
 		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			wsp.setPreviewFromOperation(parent, opname, cid, oid, inStr, inPdo);
	},
	
	/**
	 * Bettet eine Html-Sicht in eine Region des Arbeitsbereiches ein.
	 * @param {string} url Die aufzurufende URL.
	 * @param {UIContainer} parent Container-Komponente, in die die HTML-Sicht
	 * eingebettet werden soll, typischerweise eine <code>UIRegion</code>.<br/>
	 * Falls in diesem Container bereits eine Sicht eingebettet ist und diese
	 * ungespeicherte Änderungen enthält (bei Dialogen), wird sie kontrolliert
	 * zu schließen versucht. Schlägt das fehl - z.B. weil nicht gespeichert
	 * werden kann oder der Benutzer auf Rückfrage <i>Abbrechen</i> drückt -, so
	 * wird die Aktion abgebrochen!
	 * @see <code>UIWorkspace.setPreviewFromOperation()</code>
	 * @see <code>UIHtmlView.setPreviewFromOperation()</code>
	 */
	navigatePreviewTo : function(parent, url)
	{
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			wsp.navigatePreviewTo(parent, url);
	},
	
	/**
	Gibt eine in eine Workspace-<code>Region</code> eingebettete HTML-Sicht zurück.
	Falls die HTML-Sichzt nicht bereits existiert, wird sie implizit erzeugt.<br/>
	Andere, ggf. bereits in den Container eingebetette Elemente werden ggf. geschlossen
	(Dialoge) und entfernt.<br/>
	<span class="important">Hinweis:</span> Diese Funktion prüft <em>nicht</em>, ob evtl. noch eine eingebettete Sicht
	mit ungespeicherten Änderungen vorhanden ist! Wenn Sie keine spezielleren Anforderungen
	haben, benutzen Sie stattdessen <code>setPreviewObject()</code>, <code>setPreviewFromOperation()</code>
	oder <code>navigatePreviewTo()</code>, die jeweils ihre Aktion nur ausführen, wenn ein
	in der selben Region eingebetetter Dialog kontrolliert geschlossen werden konnte.
	@param {UIContainer} parent Container-Komponente, in die die HTML-Sicht
	eingebettet werden soll.
	@param {string} title Hier sollte ein Titel angegeben werden, falls <code>parent</code>
	einen solchen anzeigen kann.
	@param {string} name Technischer Name der HTML-Sicht.
	@return {PDPreview} Die HTML-Sicht oder <code>null</code>, wenn weder eine vorhanden
	ist noch eine erzeugt werden konnte.
	@see <code>UIWorkspace.getEmbeddedHtmlView()</code>
	*/
	getEmbeddedHtmlView : function(parent, title, name)
	{
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			return wsp.getEmbeddedHtmlView(parent, title, name);
		return null;
	},

	/**
	Wird aufgerufen, wenn ein Formulardialog geöffnet werden soll.
	Redefinieren Sie diese Funktion, wenn Sie eine eigene Behandlung dieses
	Ereignisses (z.B: für bestimmte Fachkonzeptklassen) implementieren
	möchten. Geben Sie <code>false</code> zurück, wenn anschließend nicht
	mit der Standardbehandlung fortgefahren werden soll.
	@param {PDObject} pdObject Das im Dialog zu bearbeitende Fachkonzeptobjekt
	oder <code>null</code> bei Neuanlage.
	@param {string} classname Name des Views. Entspricht
	dem Namen der Fachkonzeptklasse des darzustellenden Objekts,
	oder, im Falle des Stereotyps View, dem Namen der View-Klasse.
	@param {string} title Dialogtitel (optional).
	@param {PDObject} rootObj Das Wurzelobjekt, wenn der Dialog über eine
	Beziehung geöffnet wird.
	@param {string} rootPath Name der Beziehung, wenn der Dialog über eine
	Beziehung geöffnet wird. Der Beziehungsname muss aus Sicht des 
	<code>rootObj</code> angegeben werden.
	@param {number} tid Transaktions-ID. Wenn keine Transaktion  offen ist: <code>0</code>.
	@param {number} saveStrategy Bestimmt die von dem geöffneten Dialog zu
	verwendende Speicherstrategie. Hier muss eine der in <code>PDDialog</code>
	definierten Konstanten übergeben werden:
	<ul>
		<li><code>PDDialog.MASTER</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte in eigener Regie direkt auf dem Server.
		Objekte aus wiederum von diesem abhängigen, weiter untergeordneten
		Dialogen werden dabei mitgespeichert.
		<li><code>PDDialog.SLAVE</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte nicht selbst, sondern übergibt das
		geänderte Objekt an den aufrufenden Dialog. Dort sollte ein Dialog
		mit der Speicherstrategie MASTER dafür sorgen, dass das Objekt aus dem
		geöffneten Dialog mitgespeichert wird.
	</ul>
	@param {string} viewname Information über das zu verwendende Layout (optional).
	@param {Function} callback Funktion, die nach dem Schließen des Dialogs
	aufgerufen werden soll. Beim Aufruf erhält diese Funktion das Dialogobjekt
	als Parameter. Optional gibt es einen zweiten, booleschen Parameter, der anzeigt,
	ob das Dialogobjekt modifiziert wurde, so dass z.B. eine Aktualisierung der Liste
	nötig ist, aus der der Dialog geöffnet wurde.
	@param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	Funktion ausgeführt werden soll.
	@param {boolean} readOnly Der Dialog wird schreibgeschützt geöffnet, so dass der
	Benutzer das Objekt nicht verändern kann.
	@param {OID[]} oidList Array der OIDs in der Liste, aus der der Dialog geöffnet
	wurde. Diese Information wird für das Blättern durch die Objektmenge verwendet.
	@see <code>openFormDialog()</code>
	*/
	onOpenFormDialog : function(pdObject, classname, title, rootObj, rootPath, tid, saveStrategy,
			viewname, callback, scope, readOnly, oidList)
	{ },
	
	/**
	Objektformular modal öffnen.
	@param {PDObject} pdObject Das im Dialog zu bearbeitende Fachkonzeptobjekt
	oder <code>null</code> bei Neuanlage.
	@param {string} classname Name des Views. Entspricht
	dem Namen der Fachkonzeptklasse des darzustellenden Objekts,
	oder, im Falle des Stereotyps View, dem Namen der View-Klasse.
	@param {string} title Dialogtitel (optional).
	@param {PDObject} rootObj Das Wurzelobjekt, wenn der Dialog über eine
	Beziehung geöffnet wird.
	@param {string} rootPath Name der Beziehung, wenn der Dialog über eine
	Beziehung geöffnet wird. Der Beziehungsname muss aus Sicht des 
	<code>rootObj</code> angegeben werden.
	@param {number} tid Transaktions-ID. Wenn keine Transaktion  offen ist: <code>0</code>.
	@param {number} saveStrategy Bestimmt die von dem geöffneten Dialog zu
	verwendende Speicherstrategie. Hier muss eine der in <code>PDDialog</code>
	definierten Konstanten übergeben werden:
	<ul>
		<li><code>PDDialog.MASTER</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte in eigener Regie direkt auf dem Server.
		Objekte aus wiederum von diesem abhängigen, weiter untergeordneten
		Dialogen werden dabei mitgespeichert.
		<li><code>PDDialog.SLAVE</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte nicht selbst, sondern übergibt das
		geänderte Objekt an den aufrufenden Dialog. Dort sollte ein Dialog
		mit der Speicherstrategie MASTER dafür sorgen, dass das Objekt aus dem
		geöffneten Dialog mitgespeichert wird.
	</ul>
	@param {string} viewname Information über das zu verwendende Layout (optional).
	@param {Function} callback Funktion, die nach dem Schließen des Dialogs
	aufgerufen werden soll. Beim Aufruf erhält diese Funktion das Dialogobjekt
	als Parameter. Optional gibt es einen zweiten, booleschen Parameter, der anzeigt,
	ob das Dialogobjekt modifiziert wurde, so dass z.B. eine Aktualisierung der Liste
	nötig ist, aus der der Dialog geöffnet wurde.
	@param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	Funktion ausgeführt werden soll.
	@param {boolean} readOnly Der Dialog wird schreibgeschützt geöffnet, so dass der
	Benutzer das Objekt nicht verändern kann.
	@param {OID[]} oidList Array der OIDs in der Liste, aus der der Dialog geöffnet
	wurde. Diese Information wird für das Blättern durch die Objektmenge verwendet.
	*/
	openFormDialog : function(pdObject, classname, title, rootObj, rootPath, tid, saveStrategy,
			viewname, callback, scope, readOnly, oidList)
	{
		if(!this._inOpenFormDialogHandler)
		{
			this._inOpenFormDialogHandler = true;
			if(this.onOpenFormDialog(pdObject, classname, title, rootObj, rootPath, tid, saveStrategy,
					viewname, callback, scope, readOnly, oidList) === false)
			{
				this._inOpenFormDialogHandler = false;
				return;
			}
		}
		var pdo = null;
		var cln = "";
		var viewn = "";
		var tit = '';
		var rootPdo = null;
		var rootP = "";
		var trID = 0;
		var saveStr = PDDialog.MASTER;
		var cb = null;
		var cbScope = null;
		var ro = false;
		var oidL = null;
		var pos = 0;
		if(arguments.length > pos && (arguments[pos] === null || (arguments[pos] instanceof PDObject)))
			pdo = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			cln = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			tit = arguments[pos++];
		if(arguments.length > pos && (arguments[pos] === null || (arguments[pos] instanceof PDObject)))
		{
			if(arguments.length > pos+1 && typeof arguments[pos+1] == "string")
			{
				rootPdo = arguments[pos];
				rootP = arguments[pos+1];
				pos += 2;
			}
		}
		else if(arguments.length > pos && arguments[pos] == null)
		{
			pos++;
			if(arguments.length > pos && typeof arguments[pos] == "string")
				pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
			trID = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "number")
			saveStr = arguments[pos++];
		else if(trID)
		{
			// wenn nur ein numerischer Param. angegeben ist (alte Signatur),
			// ist das die saveSatrategy
			saveStr = trID;
			trID = 0;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
			viewn = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "function")
		{
			cb = arguments[pos++];
			if(arguments.length > pos && typeof arguments[pos] == "object")
				cbScope = arguments[pos++];
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
			ro = arguments[pos++];
		if(arguments.length > pos && JafWeb.isArray(arguments[pos]))
			oidL = arguments[pos++];
		/*UIDebug.log(UIDebug.ERROR, "UIApplication.openFormDialog()"+
				"\npdObject: "+ (pdo ? "[object]" : "null") +
				"\nclassname: "+cln +
				"\ntitle: "+tit +
				"\nrootObj: "+ (rootPdo ? "[object]" : "null") +
				"\nrootPath: "+rootP +
				"\ntid: "+trID +
				"\nsaveStrategy: "+saveStr +
				"\nviewname: "+viewn +
				"\ncallback: "+(cb ? "[function]" : "null") +
				"\nscope: "+(cbScope ? "[object]" : "null") +
				"\nreadOnly: "+ro);*/
		// Im Neuanlage-Fall Create-Recht pruefen
		if(!pdo)
		{
			if(ClientInfo.getCreatePermission(cln) !== true)
			{
				UIMessage.ok((PDMeta ? PDMeta.getString("SC::NoCreatePermission") : "You have no permission to create new records of the class."));
				return;
			}
			// Der Dialog (-Konnektor) soll das Objekt selbt erzeugen und
			// ggf. die Transaktion starten
			if(!UIApplication.USE_COMPLEX_TRANSACTIONS)
			{
				trID = 0;
				// erst nach vollständiger Umstellung auf das Objekt-übergreifenden Transaktionen wieder aktivieren
				//if(_rootObj)
				//	tid = _rootObj._tid;
				pdo = PDClass.startNewTransaction(cln, trID);
				if(!pdo)
				{
					UIMessage.ok(PDClass.getLastMessage() ||
							"Starting new transaction failed"); // TODO: multilang
					return;
				}
			}
		}
		// eindeutigen Namen erzeugen
		var name = "dlg"+cln;
		var cnt = 0;
		while(this.getWorkspace().hasRegisteredWindow(name))
			name = "dlg"+cln+(++cnt);
		var dlg = new UIWindow(this.getWorkspace(), name, "", new UIRes(0,0,0,0, UIRes.MODAL), tit);
		dlg.show();
		dlg.loadPDDialog(pdo, cln, tit, rootPdo, rootP, trID, saveStr, viewn, cb, cbScope, ro, oidL);
	},
	
	/**
	 * Wird aufgerufen, wenn eine Objektliste geöffnet werden soll.
	 * Redefinieren Sie diese Funktion, wenn Sie eine eigene Behandlung dieses
	 * Ereignisses (z.B: für bestimmte Fachkonzeptklassen) implementieren
	 * möchten. Geben Sie <code>false</code> zurück, wenn anschließend nicht
	 * mit der Standardbehandlung fortgefahren werden soll.
	 * @param {string} listClass Name der Fachkonzeptklasse der in der Liste
	 * darzustellenden Objekte.
	 * @param {string} title Listentitel (optional).
	 * @param {string} filter JANUS-Filterausdruck, der die Menge der
	 * Objekte einschränkt. Dieser wirkt als Vorfilter, d.h. er wird
	 * dem vom Benutzer eingestellten Filter immer vorangestellt und
	 * kann nicht verändert werden.
	 * @param {string} sort Sortierausdruck. Es muss ein Spaltenname
	 * der Tabelle angegeben werden, nach dem die Liste nach dem
	 * Öffnen sortiert werden soll.
	 * @param {string} targetClass Technischer Name der Zielklasse, wenn die Liste
	 * die Neuanlage von Fachkonzeptobjekten erlaubt. Normalerweise wird das die
	 * Listenklasse sein, bei Vererbungshierarchien kann dies aber auch eine der
	 * Unterklassen sein.
	 * @param {boolean} fEdit Die Liste soll das Editieren der Listenobjekte erlauben.
	 * @param {boolean} fNew Die Liste soll die Neuanlage von Listenobjekten erlauben.
	 * @param {boolean} fDelete Die Liste soll das Löschen von Listenobjekten erlauben.
	 * @param {boolean} fFilter Die Liste soll filterbar sein.
	 * @param {boolean} fPrint Die Liste soll druckbar sein.
	 * @param {boolean} fConfig Die Liste soll konfigurierbar sein.
	 * @param {boolean} fExport Die Liste soll sich exportieren lassen.
	 * @param {boolean} fUpDown Die Listenobjekte sollen angeordnet werden können. Dies
	 * ist nur möglich, wenn der dargestellte Extent <code>orderable</code> (siehe JANUS-Doku)
	 * ist.
	 * @param {string} viewname Information über das zu verwendende Layout (optional).
	 * @param {number} listType Wird derzeit nicht benutzt.
	 * @param {string} configName Name, unter dem die Tabellenkonfiguration in den
	 * <code>PDProperties</code> gespeichert werden soll.
	 * @param {Function} callback Funktion, die nach dem Schließen der Liste
	 * aufgerufen werden soll.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	 * Funktion ausgeführt werden soll.
	 * @param {boolean} readOnly Zeigt an, dass die Liste schreibgeschützt geöffnet werden soll,
	 * d.h. die Elemente können zwar angsehen, aber nicht verändert werden.
	 * @see <code>openListDialog()</code>
	 */
	onOpenListDialog : function(listClass, title, filter, sort, targetClass,
			fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport, fUpDown,
			viewname, listType, configName, callback, scope, readOnly)
	{ },

	/**
	 * Objektliste modal öffnen.
	 * @param {string} listClass Name der Fachkonzeptklasse der in der Liste
	 * darzustellenden Objekte.
	 * @param {string} title Listentitel (optional).
	 * @param {string} filter JANUS-Filterausdruck, der die Menge der
	 * Objekte einschränkt. Dieser wirkt als Vorfilter, d.h. er wird
	 * dem vom Benutzer eingestellten Filter immer vorangestellt und
	 * kann nicht verändert werden.
	 * @param {string} sort Sortierausdruck. Es muss ein Spaltenname
	 * der Tabelle angegeben werden, nach dem die Liste nach dem
	 * Öffnen sortiert werden soll.
	 * @param {string} targetClass Technischer Name der Zielklasse, wenn die Liste
	 * die Neuanlage von Fachkonzeptobjekten erlaubt. Normalerweise wird das die
	 * Listenklasse sein, bei Vererbungshierarchien kann dies aber auch eine der
	 * Unterklassen sein.
	 * @param {boolean} fEdit Die Liste soll das Editieren der Listenobjekte erlauben.
	 * @param {boolean} fNew Die Liste soll die Neuanlage von Listenobjekten erlauben.
	 * @param {boolean} fDelete Die Liste soll das Löschen von Listenobjekten erlauben.
	 * @param {boolean} fFilter Die Liste soll filterbar sein.
	 * @param {boolean} fPrint Die Liste soll druckbar sein.
	 * @param {boolean} fConfig Die Liste soll konfigurierbar sein.
	 * @param {boolean} fExport Die Liste soll sich exportieren lassen.
	 * @param {boolean} fUpDown Die Listenobjekte sollen angeordnet werden können. Dies
	 * ist nur möglich, wenn der dargestellte Extent <code>orderable</code> (siehe JANUS-Doku)
	 * ist.
	 * @param {string} viewname Information über das zu verwendende Layout (optional).
	 * @param {number} listType Wird derzeit nicht benutzt.
	 * @param {string} configName Name, unter dem die Tabellenkonfiguration in den
	 * <code>PDProperties</code> gespeichert werden soll.
	 * @param {Function} callback Funktion, die nach dem Schließen der Liste
	 * aufgerufen werden soll.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	 * Funktion ausgeführt werden soll.
	 * @param {boolean} readOnly Zeigt an, dass die Liste schreibgeschützt geöffnet werden soll,
	 * d.h. die Elemente können zwar angsehen, aber nicht verändert werden.
	 */
	openListDialog : function(listClass, title, filter, sort, targetClass,
			fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport, fUpDown,
			viewname, listType, configName, callback, scope, readOnly)
	{
		//UIDebug.log(UIDebug.UI_EVENT, "UIApplication.openSelectDialog("+listClass+", "+title+")");
		if (!ClientInfo.getIteratePermission(listClass))
		{
			UIMessage.ok(PDMeta.getString('SC::NoViewPermission'));
			return false;
		}
		if(this.onOpenListDialog(listClass, title, filter, sort, targetClass,
				fEdit, fNew, fDelete, fFilter, fPrint, fExport, fUpDown,
				viewname, listType, configName, callback, scope, readOnly) === false)
			return;
		var cl = "";
		var tit = "";
		var filt = "";
		var sor = "";
		var trgt = "";
		var viewn = "";
		var lType = 0;
		var cfg = "";
		var cb = null;
		var cbScope = null;
		var uires = 0;
		var pos = 0;
		var ro = false;
		if(arguments.length > pos && (typeof arguments[pos] == "string" || typeof arguments[pos] == "number"))
			cl = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			tit = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			filt = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			sor = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			trgt = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.EDIT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.NEW_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.DELETE_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.FILTER_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.PRINT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.CONFIG_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.EXPORT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.UPDOWN_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "string")
			viewn = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "number")
			lType = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			cfg = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "function")
		{
			cb = arguments[pos++];
			if(arguments.length > pos && typeof arguments[pos] == "object")
				cbScope = arguments[pos++];
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
			ro = arguments[pos++];
		// eindeutigen Namen erzeugen
		var name = "lst"+cl;
		var cnt = 0;
		while(this.getWorkspace().hasRegisteredWindow(name))
			name = "lst"+cl+(++cnt);
		var dlg = new UIWindow(this.getWorkspace(), name, "", new UIRes(0,0,0,0, UIRes.MODAL), tit);
		dlg.show();
		dlg.loadPDList(cl, tit, filt, sor, trgt, uires, viewn, cb, cbScope, ro);
	},
	
	/**
	 * Die Elemente einer Zu-N-Beziehung in einer Objektliste darstellen.
	 * @param {PDObject} pdo Das Fachkonzeptobjekt, von dem die Beziehung ausgeht.
	 * @param {string} assoc Name der dargestellten Beziehung.
	 * @param {string} title Listentitel.
	 * @param {string} filter JANUS-Filterausdruck, der die Menge der
	 * Objekte einschränkt. Dieser wirkt als Vorfilter, d.h. er wird
	 * dem vom Benutzer eingestellten Filter immer vorangestellt und
	 * kann nicht verändert werden.
	 * @param {string} sort Sortierausdruck. Es muss ein Spaltenname
	 * der Tabelle angegeben werden, nach dem die Liste nach dem
	 * Öffnen sortiert werden soll.
	 * @param {string} targetClass Technischer Name der Zielklasse, wenn die Liste
	 * die Neuanlage von Fachkonzeptobjekten erlaubt. Normalerweise wird das die
	 * Zielklasse der Beziehung sein, bei Vererbungshierarchien kann dies aber auch
	 * eine von deren Unterklassen sein.
	 * @param {boolean} fEdit Die Liste soll das Editieren der Listenobjekte erlauben.
	 * @param {boolean} fNew Die Liste soll die Neuanlage von Listenobjekten erlauben.
	 * @param {boolean} fDelete Die Liste soll das Löschen von Listenobjekten erlauben.
	 * @param {boolean} fFilter Die Liste soll filterbar sein.
	 * @param {boolean} fPrint Die Liste soll druckbar sein.
	 * @param {boolean} fConfig Die Liste soll konfigurierbar sein.
	 * @param {boolean} fExport Die Liste soll sich exportieren lassen.
	 * @param {boolean} fUpDown Die Listenobjekte sollen angeordnet werden können. Dies
	 * ist nur möglich, wenn der dargestellte Extent <code>orderable</code> (siehe JANUS-Doku)
	 * ist.
	 * @param {boolean} fSelect Die Liste soll das Verbinden weiterer Objekt erlauben.
	 * @param {boolean} fDisconnect Die Liste soll das Trennen von Beziehungsobjekten erlauben.
	 * @param {string} viewname Information über das zu verwendende Layout (optional).
	 * @param {number} listType Wird derzeit nicht benutzt.
	 * @param {string} configName Name, unter dem die Tabellenkonfiguration in den
	 * <code>PDProperties</code> gespeichert werden soll.
	 * @param {string} selectionFilter Falls bei <code>fSelect</code> <code>true</code>
	 * angegeben wurde, kann hier ein Filterausdruck angegeben werden, der die Auswahl der
	 * möglichen Objkete zum Verbinden einschränkt.
	 * @param {PDObject} selectionThis Ein Fachkonzeptobjekt, das im bei <code>selectionFilter</code>
	 * angegebenen Ausdruck über das Schlüsselwort <code>this</code> referenziert werden kann.
	 * @param {Function} callback Funktion, die nach dem Schließen der Liste
	 * aufgerufen werden soll.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	 * Funktion ausgeführt werden soll.
	 * @param {JanusToManyRelationConnector} pdConnector Verbindung zum Fachkonzept. Statt des
	 * <code>JanusToManyRelationConnector</code>s kann auch eine <code>ViewElementSpec</code>
	 * angegeben werden.
	 * @param {boolean} readOnly Die List wird schreibgeschützt geöffnet. Dieses Flag wird an
	 * die aus der Liste geöffneten Dialoge weiterpropagiert.
	 */
	openRelationListDialog : function(pdo, assoc, title, filter, sort, targetClass,
				fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport, fUpDown, fSelect, fDisconnect,
				viewname, listType, configName, selectionFilter, selectionThis, callback, scope,
				pdConnector, readOnly)
	{
		//UIDebug.log(UIDebug.WARN, "UIApplication.openRelationListDialog("+assoc+", "+title+")");
		var rootObj = null;
		var rootPath = "";
		var tit = "";
		var filt = "";
		var sor = "";
		var trgt = "";
		var viewn = "";
		var lType = 0;
		var cfg = "";
		var selThis = null;
		var selFilter = "";
		var cb = null;
		var cbScope = null;
		var uires = 0;
		var pos = 0;
		var pdConn = null;
		var ro = false;
		if(arguments.length > pos && (arguments[pos] == null || (arguments[pos] instanceof PDObject)))
			rootObj = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			rootPath = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			tit = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			filt = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			sor = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			trgt = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.EDIT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.NEW_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.DELETE_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.FILTER_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.PRINT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.CONFIG_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.EXPORT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.UPDOWN_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.SELECT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.DISCONNECT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "string")
			viewn = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "number")
			lType = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			cfg = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			selFilter = arguments[pos++];
		if(arguments.length > pos && (arguments[pos] == null || (arguments[pos] instanceof PDObject)))
			selThis = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "function")
		{
			cb = arguments[pos++];
			if(arguments.length > pos && typeof arguments[pos] == "object")
				cbScope = arguments[pos++];
		}
		if(arguments.length > pos && typeof arguments[pos] == "object")
			pdConn = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
			ro = arguments[pos++];
		if(rootObj == null)
		{
			UIDebug.log(UIDebug.WARN, "UIApplication.openRelationListDialog(): rootObject missing!");
			return;
		}
		if(rootPath == "")
		{
			UIDebug.log(UIDebug.WARN, "UIApplication.openRelationListDialog(): rootPath missing!");
			return;
		}
		// eindeutigen Namen erzeugen
		var name = "rlst"+rootObj.classname+"_"+rootPath;
		var cnt = 0;
		while(this.getWorkspace().hasRegisteredWindow(name))
			name = "rlst"+rootObj.classname+"_"+rootPath+(++cnt);
		var dlg = new UIWindow(this.getWorkspace(), name, "", new UIRes(0,0,0,0, UIRes.MODAL), tit);
		dlg.show();
		dlg.loadPDRelationList(rootObj, rootPath, tit, filt, sor, trgt, uires, lType, cfg,
				selFilter, selThis, viewn, cb, cbScope, pdConn, ro);
	},

	// s. GUI: PDSelectDlg::selectObject()
	/**
	 * Öffnet eine Objektliste zur Auswahl eines oder mehrerer Fachkonzeptobjekte einer
	 * bestimmten Klasse.
	 * @param {string} listClass Technischer Name der Fachkonzeptklasse, deren Objekte zur Auswahl
	 * angeboten werden sollen.
	 * @param {string} title Listentitel (optional).
	 * @param {number} selectionMode Selektionsmodus der Tabelle: entweder Einfachauswahl
	 * (<code>PDTable.SINGLE_SELECT</code>) oder Mehrfachauswahl (<code>PDTable.MULTI_SELECT</code>).
	 * @param {string} filter JANUS-Filterausdruck, der die Objektauswahl der Liste einschränkt.
	 * @param {PDObject} thisObj Fachkonzeptobjekt, dass inerhalb des bei <code>filter</code>
	 * angegebenen Ausdrucks über das Schlüsselwort <code>this</code> referenziert werden kann.
	 * @param {string} sort Sortierausdruck. Es muss ein Spaltenname
	 * der Tabelle angegeben werden, nach dem die Liste nach dem
	 * Öffnen sortiert werden soll.
	 * @param {boolean} fEdit Die Liste soll das Editieren der Listenobjekte erlauben.
	 * @param {boolean} fNew Die Liste soll die Neuanlage von Listenobjekten erlauben.
	 * @param {boolean} fDelete Die Liste soll das Löschen von Listenobjekten erlauben.
	 * @param {boolean} fFilter Die Liste soll filterbar sein.
	 * @param {boolean} fPrint Die Liste soll druckbar sein.
	 * @param {boolean} fConfig Die Liste soll konfigurierbar sein.
	 * @param {boolean} fExport Die Liste soll sich exportieren lassen.
	 * @param {string} viewname Information über das zu verwendende Layout (optional).
	 * @param {string} configName Name, unter dem die Tabellenkonfiguration in den
	 * <code>PDProperties</code> gespeichert werden soll.
	 * @param {Function} callback Funktion, die nach dem Schließen der Liste
	 * aufgerufen werden soll.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	 * Funktion ausgeführt werden soll.
	*/
	openSelectList : function(listClass, title, selectionMode, filter, thisObj, sort,
			fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport,
			viewname, configName, callback, scope)
	{
		//UIDebug.log(UIDebug.L4, "UIApplication.openSelectList("+listClass+", "+title+")");
		// TODO: Doku der Aufrufparameter fuer die Callback-Funktion (ausgewaehlte(s)
		// Objekt(e)).
		var cl = "";
		var tit = "";
		var selMode = PDTable.SINGLE_SELECT;
		var filt = "";
		var thisObject = null;
		var sor = "";
		var trgt = "";
		var cfg = "";
		var viewn = "";
		var cb = null;
		var cbScope = null;
		var uires = 0;
		var pos = 0;
		if(arguments.length > pos && (typeof arguments[pos] == "string" || typeof arguments[pos] == "number"))
			cl = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			tit = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "number")
			selMode = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			filt = arguments[pos++];
		if(arguments.length > pos && (arguments[pos] == null || (arguments[pos] instanceof PDObject)))
			thisObject = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			sor = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.EDIT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.NEW_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.DELETE_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.FILTER_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.PRINT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.CONFIG_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{ if(arguments[pos]) uires |= UIRes.EXPORT_ACTION; pos++; }
		if(arguments.length > pos && typeof arguments[pos] == "string")
			viewn = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			cfg = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "function")
		{
			cb = arguments[pos++];
			if(arguments.length > pos && typeof arguments[pos] == "object")
				cbScope = arguments[pos++];
		}
		/*UIDebug.log(UIDebug.L4, "UIApplication.openSelectList()"+
				"\nlistClass: "+cl +
				"\ntitle: "+tit +
				"\nselectionMode: "+(selMode == PDTable.MULTI_SELECT ? "MULTI" : (selMode == PDTable.SINGLE_SELECT ? "SINGLE" : "?")) +
				"\nfilter: "+filt +
				"\nthisObj: "+(thisObject ? "[object]" : "null") +
				"\nsort: "+sor +
				"\nfEdit: "+((uires & UIRes.EDIT_ACTION)!=0) +
				"\nfNew: "+((uires & UIRes.NEW_ACTION)!=0) +
				"\nfDelete: "+((uires & UIRes.DELETE_ACTION)!=0) +
				"\nfFilter: "+((uires & UIRes.FILTER_ACTION)!=0) +
				"\nPrint: "+((uires & UIRes.PRINT_ACTION)!=0) +
				"\nConfig: "+((uires & UIRes.CONFIG_ACTION)!=0) +
				"\nExport: "+((uires & UIRes.EXPORT_ACTION)!=0) +
				"\nconfigName: "+cfg +
				"\ncallback: "+(cb ? "[function]" : "null") +
				"\nscope: "+(cbScope ? "[object]" : "null"));*/
		// eindeutigen Namen erzeugen
		var name = "slst"+cl;
		var cnt = 0;
		while(this.getWorkspace().hasRegisteredWindow(name))
			name = "slst"+cl+(++cnt);
		var dlg = new UIWindow(this.getWorkspace(), name, "", new UIRes(0,0,0,0, UIRes.MODAL), tit);
		dlg.show();
		dlg.loadPDSelectList(cl, tit, selMode, filt, thisObject, sor, uires, viewn, cb, cbScope);
	},
	
	/**
	 * Objektliste einbetten.
	 * @param {UIContainer} parent Container-Komponente, in die die Liste eingebettet
	 * werden soll.
	 * @param {string} listClass Name der Fachkonzeptklasse der in der Liste
	 * darzustellenden Objekte.
	 * @param {string} title Listentitel (optional).
	 * @param {string} filter JANUS-Filterausdruck, der die Menge der
	 * Objekte einschränkt. Dieser wirkt als Vorfilter, d.h. er wird
	 * dem vom Benutzer eingestellten Filter immer vorangestellt und
	 * kann nicht verändert werden.
	 * @param {string} sort Sortierausdruck. Es muss ein Spaltenname
	 * der Tabelle angegeben werden, nach dem die Liste nach dem
	 * Öffnen sortiert werden soll.
	 * @param {string} targetClass Technischer Name der Zielklasse, wenn die Liste
	 * die Neuanlage von Fachkonzeptobjekten erlaubt. Normalerweise wird das die
	 * Listenklasse sein, bei Vererbungshierarchien kann dies aber auch eine der
	 * Unterklassen sein.
	 * @param {boolean} fEdit Die Liste soll das Editieren der Listenobjekte erlauben.
	 * @param {boolean} fNew Die Liste soll die Neuanlage von Listenobjekten erlauben.
	 * @param {boolean} fDelete Die Liste soll das Löschen von Listenobjekten erlauben.
	 * @param {boolean} fFilter Die Liste soll filterbar sein.
	 * @param {boolean} fPrint Die Liste soll druckbar sein.
	 * @param {boolean} fConfig Die Liste soll konfigurierbar sein.
	 * @param {boolean} fExport Die Liste soll sich exportieren lassen.
	 * @param {boolean} fUpDown Die Listenobjekte sollen angeordnet werden können. Dies
	 * ist nur möglich, wenn der dargestellte Extent <code>orderable</code> (siehe JANUS-Doku)
	 * ist.
	 * @param {string} viewname Information über das zu verwendende Layout (optional).
	 * @param {number} listType Wird derzeit nicht benutzt.
	 * @param {string} configName Name, unter dem die Tabellenkonfiguration in den
	 * <code>PDProperties</code> gespeichert werden soll.
	 * @param {Function} callback Funktion, die nach dem Schließen der Liste
	 * aufgerufen werden soll.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	 * Funktion ausgeführt werden soll.
	 * @param {boolean} readOnly Zeigt an, dass die Liste schreibgeschützt geöffnet werden soll,
	 * d.h. die Elemente können zwar angsehen, aber nicht verändert werden.
	 * @see <code>UIWorkspace.embedList()</code>
	 */
	embedList : function(parent, listClass, title, filter, sort, targetClass,
			fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport, fUpDown,
			viewname, listType, configName, callback, scope, readOnly)
	{
		//UIDebug.log(UIDebug.DEBUG, "UIApplication.embedList("+listClass+", "+title+")");
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			wsp.embedList(parent, listClass, title, filter, sort, targetClass,
					fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport, fUpDown,
					viewname, listType, configName, callback, scope, readOnly);
	},
	
	/**
	 * Eine Liste der Elemente einer Zu-N-Beziehung einbetten.
	 * @param {UIContainer} parent Container-Komponente, in die die Liste eingebettet
	 * werden soll.
	 * @param {PDObject} pdo Das Fachkonzeptobjekt, von dem die Beziehung ausgeht.
	 * @param {string} assoc Name der dargestellten Beziehung.
	 * @param {string} title Listentitel.
	 * @param {string} filter JANUS-Filterausdruck, der die Menge der
	 * Objekte einschränkt. Dieser wirkt als Vorfilter, d.h. er wird
	 * dem vom Benutzer eingestellten Filter immer vorangestellt und
	 * kann nicht verändert werden.
	 * @param {string} sort Sortierausdruck. Es muss ein Spaltenname
	 * der Tabelle angegeben werden, nach dem die Liste nach dem
	 * Öffnen sortiert werden soll.
	 * @param {string} targetClass Technischer Name der Zielklasse, wenn die Liste
	 * die Neuanlage von Fachkonzeptobjekten erlaubt. Normalerweise wird das die
	 * Zielklasse der Beziehung sein, bei Vererbungshierarchien kann dies aber auch
	 * eine von deren Unterklassen sein.
	 * @param {boolean} fEdit Die Liste soll das Editieren der Listenobjekte erlauben.
	 * @param {boolean} fNew Die Liste soll die Neuanlage von Listenobjekten erlauben.
	 * @param {boolean} fDelete Die Liste soll das Löschen von Listenobjekten erlauben.
	 * @param {boolean} fFilter Die Liste soll filterbar sein.
	 * @param {boolean} fPrint Die Liste soll druckbar sein.
	 * @param {boolean} fConfig Die Liste soll konfigurierbar sein.
	 * @param {boolean} fExport Die Liste soll sich exportieren lassen.
	 * @param {boolean} fUpDown Die Listenobjekte sollen angeordnet werden können. Dies
	 * ist nur möglich, wenn der dargestellte Extent <code>orderable</code> (siehe JANUS-Doku)
	 * ist.
	 * @param {boolean} fSelect Die Liste soll das Verbinden weiterer Objekt erlauben.
	 * @param {boolean} fDisconnect Die Liste soll das Trennen von Beziehungsobjekten erlauben.
	 * @param {string} viewname Information über das zu verwendende Layout (optional).
	 * @param {number} listType Wird derzeit nicht benutzt.
	 * @param {string} configName Name, unter dem die Tabellenkonfiguration in den
	 * <code>PDProperties</code> gespeichert werden soll.
	 * @param {string} selectionFilter Falls bei <code>fSelect</code> <code>true</code>
	 * angegeben wurde, kann hier ein Filterausdruck angegeben werden, der die Auswahl der
	 * möglichen Objkete zum Verbinden einschränkt.
	 * @param {PDObject} selectionThis Ein Fachkonzeptobjekt, das im bei <code>selectionFilter</code>
	 * angegebenen Ausdruck über das Schlüsselwort <code>this</code> referenziert werden kann.
	 * @param {Function} callback Funktion, die nach dem Schließen der Liste
	 * aufgerufen werden soll.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	 * Funktion ausgeführt werden soll.
	 * @param {JanusToManyRelationConnector} pdConnector Verbindung zum Fachkonzept. Statt des
	 * <code>JanusToManyRelationConnector</code>s kann auch eine <code>ViewElementSpec</code>
	 * angegeben werden.
	 * @param {boolean} readOnly Die List wird schreibgeschützt geöffnet. Dieses Flag wird an
	 * die aus der Liste geöffneten Dialoge weiterpropagiert.
	 * @see <code>UIWorkspace.embedRelationList()</code>
	 */
	embedRelationList : function(parent, pdo, assoc, title, filter, sort, targetClass,
				fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport, fUpDown, fSelect, fDisconnect,
				viewname, listType, configName, selectionFilter, selectionThis, callback, scope,
				pdConnector, readOnly)
	{
		//UIDebug.log(UIDebug.UI_EVENT, "UIApplication.embedRelationList("+assoc+", "+title+")");
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			wsp.embedRelationList(parent, pdo, assoc, title, filter, sort, targetClass,
					fEdit, fNew, fDelete, fFilter, fPrint, fConfig, fExport, fUpDown, fSelect, fDisconnect,
					viewname, listType, configName, selectionFilter, selectionThis, callback, scope,
					pdConnector, readOnly);
	},
	
	/**
	 * Eingebettete Liste schließen.
	 * @param {UIContainer} parent Container-Komponente, die die Liste einbettet.
	 * @return {boolean} <code>true</code>, falls das Schließen geklappt hat,
	 * sonst <code>false</code>.
	 * @see <code>UIWorkspace.closeEmbeddedList()</code>
	 */
	closeEmbeddedList : function(parent)
	{
		//UIDebug.log(UIDebug.DEBUG, "UIApplication.closeEmbeddedList()");
		var wsp = (parent ?  parent.getWorkspace() : UIApplication.getWorkspace());
		if(wsp)
			return wsp.closeEmbeddedList(parent);
		return false;
	},
	
	/**
	Einen Assistentendialog aus einem Wizard-JavaScript starten.<br/>
	Erwartet wird ein JavaScript, wie es auch im JANUS-GUI-Client verwendet
	wird, um einen Wizard zu steuern. Zur Kompatibiliät zwischen JafWeb- und
	GUI-Client bei diesen Skripten vgl. die Bemerkungen im Konstrukror zu
	{@link PDWizard}.
	@param {string} script Name der JavaScript-Datei. Erwartet wird, dass die
	Datei im <code>script</code>-Verzeichnis der Web-Anwendung liegt.<br/>
	Wird hier stattdessen eine komplette URL übergeben (beginned mit "hhtp://",
	"https://" oder "/"), wird diese unverändert zum Ermitteln des Skriptinhalts
	übernommen.
	Auf diese Weise können Sie das Skript auch Server-seitig in einem eigenen
	Request Handler erzeugen. <b>Beispiel:</b><br>
<pre>
var pars = new JParamPacker('Report.wizardScript');
pars.add('name', paramScript);
var url = pars.getUrl();
UIApplication.runWizardFromJavaScriptFile(url, obj,
		'Report', dlgTit, null, '', PDDialog.MASTER, '', wizCallback, this, params);
</pre>
	Auf der Server-Seite würde dazu passend ein Handler in
	<code>JWebAppController::handleRequestReport()</code> implementiert, zum
	Beispiel das Einlesen der Skriptdatei:<br/>
<pre>
if (strcmp(evtn, "wizardScript") == 0)
{
	StringJ sScriptFile;
	request.getString("name", sScriptFile);
	StringJ sPath(PDMeta::getInstallDir());
	if (sPath.last() != DIR_SEP)
		sPath.append(DIR_SEP);
	sPath.append(sScriptFile);
	std::ifstream ifstr(sPath, std::ios::in | std::ios::binary);
	oStringJstream sXml;
	while (ifstr.good())
	{
		std::stringbuf line;
		if (ifstr.peek() != '\n')
			ifstr.get(line);
		ifstr.get(); // Zeilenumbruch
		sXml << line.str() << '\n';
	}
	ifstr.close();
	page = sXml.str(); // Inhalt direkt ausgeben
	return true;
}
</pre>
	@param {PDObject} pdObject Das im Wizard zu bearbeitende Fachkonzeptobjekt
	oder <code>null</code> bei Neuanlage.
	@param {string} classname Name des Views. Entspricht
	dem Namen der Fachkonzeptklasse des darzustellenden Objekts,
	oder, im Falle des Stereotyps View, dem Namen der View-Klasse.
	@param {string} title Dialogtitel (optional).
	@param {PDObject} rootObj Das Wurzelobjekt, wenn der Dialog über eine
	Beziehung geöffnet wird.
	@param {string} rootPath Name der Beziehung, wenn der Dialog über eine
	Beziehung geöffnet wird. Der Beziehungsname muss aus Sicht des 
	<code>rootObj</code> angegeben werden.
	@param {number} saveStrategy Bestimmt die von dem geöffneten Dialog zu
	verwendende Speicherstrategie. Hier muss eine der in <code>PDDialog</code>
	definierten Konstanten übergeben werden:
	<ul>
		<li><code>PDDialog.MASTER</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte in eigener Regie direkt auf dem Server.
		Objekte aus wiederum von diesem abhängigen, weiter untergeordneten
		Dialogen werden dabei mitgespeichert.
		<li><code>PDDialog.SLAVE</code>: der geöffnete Dialog speichert die
		von ihm bearbeiteten Objekte nicht selbst, sondern übergibt das
		geänderte Objekt an den aufrufenden Dialog. Dort sollte ein Dialog
		mit der Speicherstrategie MASTER dafür sorgen, dass das Objekt aus dem
		geöffneten Dialog mitgespeichert wird.
	</ul>
	@param {string} viewname Information über das zu verwendende Layout (optional).
	@param {Function} callback Funktion, die nach dem Schließen des Dialogs
	aufgerufen werden soll. Beim Aufruf erhält diese Funktion das Dialogobjekt
	als Parameter. Optional gibt es einen zweiten, booleschen Parameter, der anzeigt,
	ob das Dialogobjekt modifiziert wurde, so dass z.B. eine Aktualisierung der Liste
	nötig ist, aus der der Dialog geöffnet wurde.
	@param {Object} scope Objekt, in dessen Kontext die bei <code>callback</code> angegebene
	Funktion ausgeführt werden soll.
	@param {string[]} params An den Wizard zu übergebende Parameter.
	Das Array muss in folgenden Blöcken aufgebaut sein:
	<ol>
		<li><code>Name</code>: Als erstes kommt der Name für das folgende Element. Das
		Array-Element steht als Listname.Name im Skript zur Verfügung. Jeder Name darf nur
		einmal in der Liste vorkommen.</li>
		<li><code>Typ</code>: Als zweites Element muss ein Typ angegeben werden. Folgende
		Typen werden unterstützt: Int, Bool, String, Date, Time, Timestamp, DateF, TimeF,
		TimestampF, Float, FloatF. Die Gross- und Kleinschreibung des Typnamens spielt keine
		Rolle; unbekannte Typnamen werden als Strings interpertiert. Die Typenamen, die auf
		F enden, erwarten die Werte in einem festen Format. Datums- und Zeitwerte sind in
		diesem Fall in der Form "JJJJMMTTHHMMSS" anzugeben, Zahlen werden in der von C bekannten
		Notation (Punkt als Dezimaltrenner) erwartet.</li>
		<li>Als drittes Element kommt schließlich der Wert des Elements. Der Wert muss in der
		durch <code>ClientInfo</code> bestimmten Konvertierung/Format angegeben werden.</li>
	</ol>
	Dieser Block kann in der Liste beliebig oft vorkommen, so dass an der Stelle 0, 3, 6 usw.
	die Namen der Elemente, an den Positionen 1, 4, 7 usw. die Typen und an den Stellen
	2, 5, 8, ... die eigentlichen Werte stehen.<br/>
	Im Wizard-Skript können Sie diese Parameter auf dem Wizard mit [getProperty()]{@link PDWizard#getProperty}
	abfragen bzw. deren Vorhandensein mit [hasProperty()]{@link PDWizard#hasProperty} prüfen.
	*/
	runWizardFromJavaScriptFile : function(script, pdObject, classname, title, rootObj, rootPath,
			saveStrategy, viewname, callback, scope, params)
	{
		var pdo = null;
		var cln = "";
		var viewn = "";
		var tit = '';
		var rootPdo = null;
		var rootP = "";
		var saveStr = PDDialog.MASTER;
		var cb = null;
		var cbScope = null;
		var pos = 1;
		var pars = null;
		if(arguments.length > pos && (arguments[pos] == null || JafWeb.isPDObject(arguments[pos])))
			pdo = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			cln = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			tit = arguments[pos++];
		if(arguments.length > pos && (arguments[pos] == null || JafWeb.isPDObject(arguments[pos])))
		{
			if(arguments.length > pos+1 && typeof arguments[pos+1] == "string")
			{
				rootPdo = arguments[pos];
				rootP = arguments[pos+1];
				pos += 2;
			}
		}
		else if(arguments.length > pos && arguments[pos] == null)
		{
			pos++;
			if(arguments.length > pos && typeof arguments[pos] == "string")
				pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
			saveStr = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "string")
			viewn = arguments[pos++];
		if(arguments.length > pos && typeof arguments[pos] == "function")
		{
			cb = arguments[pos++];
			if(arguments.length > pos &&
					(typeof arguments[pos] == "object" && !JafWeb.isArray(arguments[pos])))
				cbScope = arguments[pos++];
		}
		if(arguments.length > pos && JafWeb.isArray(arguments[pos]))
			pars = arguments[pos++];
		/*UIDebug.log(UIDebug.DEBUG, "UIApplication.openFormDialog()"+
				"\npdObject: "+ (pdo ? "[object]" : "null") +
				"\nclassname: "+cln +
				"\ntitle: "+tit +
				"\nrootObj: "+ (rootPdo ? "[object]" : "null") +
				"\nrootPath: "+rootP +
				"\nsaveStrategy: "+saveStr +
				"\nviewname: "+viewn +
				"\ncallback: "+(cb ? "[function]" : "null") +
				"\nscope: "+(cbScope ? "[object]" : "null") +
				"\nreadOnly: "+ro);*/
		// Im Neuanlage-Fall Create-Recht pruefen
		if(cln && !pdo && ClientInfo.getCreatePermission(cln) !== true)
		{
			UIMessage.ok((PDMeta ? PDMeta.getString("SC::NoCreatePermission") : "You have no permission to create new records of the class."));
			return;
		}
		// eindeutigen Namen erzeugen
		var dlgname = "wiz"+cln;
		var cnt = 0;
		var wsp = this.getWorkspace();
		if(!wsp)
		{
			UIDebug.log(UIDebug.WARN, "runWizardFromJavaScriptFile(): Workspace not found!");
			return;
		}
		while(wsp.hasRegisteredWindow(dlgname))
			dlgname = "wiz"+cln+(++cnt);
		var dlg = new UIWindow(wsp, dlgname, "", new UIRes(0,0,0,0, UIRes.MODAL), tit);
		dlg.show();
		dlg.loadPDWizard(script, pdo, cln, tit, rootPdo, rootP, saveStr, viewn, cb, cbScope, pars);
	},
	
	/**
	 * Dialog zum Ändern des Benutzerpassworts anzeigen. Der Dialog wird
	 * modal angezeigt und erfragt vom Benutzer das alte Passwort und
	 * das neu zu setzende Passwort mit einer Wiederholung. Es kann nur
	 * das Passwort des aktuell angemeldeten Benutzers geändert werden.
	 * Die auch für den GUI-Client geltenden Restriktionen für das Passwort
	 * (Mindestlänge, Passwort-Skript usw.) werden berücksichtigt.<br>
	 * Das Layout des Passwortdialogs ist in <code>jafwebChangePassword</code>
	 * beschrieben.
	 * @param {mixed} uid Id des Benutzers, dessen Passwort geändert werden soll.
	 * Statt der numerischen Id können Sie auch den Loginnamen angeben.
	 * Lassen Sie diesen Parameter weg oder setzen Sie ihn auf <code>-1</code>,
	 * um das Passwort des aktuell angemeldeten Benutzers zu ändern. Beachten
	 * Sie bitte, dass Sie zum Ändern des Passworts von anderen als dem
	 * angemeldeten Benutzer administrative Rechte benötigen.
	 * @param {string} message Optionale Nachricht an den Benutzer (z.B. "Sie
	 * müssen ein Passwort festlegen...").
	 * @param {string} [title] Optionaler Dialogtitel.
	 * @param {Function} [callbFn]
	 * @param {Object} [callbScope] Scope für <code>callbFn</code>.
	 * @param {boolean} [verifyOldPassword=true]
	 */
	changePassword : function(uid, message, title, callbFn, callbScope, verifyOldPassword)
	{
		var userId = -1;
		if(typeof uid == 'number')
			userId = uid;
		else if(typeof uid == 'string')
			userId = PDClass.getUserId(uid);
		var tit = '';
		var msg = '';
		var cb = null;
		var scope = null;
		var verify = true;
		var pos = 1;
		if(arguments.length > pos && typeof arguments[pos] == 'string')
		{
			msg = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == 'string')
		{
			tit = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == 'function')
		{
			cb = arguments[pos];
			pos++;
			if(arguments.length > pos && typeof arguments[pos] == 'object')
			{
				scope = arguments[pos];
				pos++;
			}
		}
		if(arguments.length > pos && typeof arguments[pos] == 'boolean')
		{
			verify = arguments[pos];
			pos++;
		}
		UIApplication.openUIDialog('jafwebChangePassword', tit,
			(cb || function(res, data) { }), (scope || this), {
				userId: userId,
				message: msg,
				verifyOldPassword: verify,
				mandatory: true // TODO: konfigurierbar?
			});
	},
	
	/**
	 * Dialog zur Auswahl einer Fachkonzeptklasse anzeigen. Dieser Dialog
	 * wird typischerweise verwendet, um für die Neu-Aktion einer Beziehung
	 * zu einer abstrakten Klasse die konkrete Klasse zu bestimmen, von der
	 * das Objekt angelegt werden soll.
	 * @param {string} classname Der Name der Basisklasse, zu der die konkrete
	 * Unterklasse gesucht wird.
	 * @param {Function} callbackFn Callback-Funktion, die beim Schließen des
	 * Auswahldialogs ausgeführt wird. Hierin muss impelemntiert werden, was
	 * im Anschluss an die Auswahl der Klasse passieren soll.<br>
	 * Diese Funktion wird mit dem Namen der ausgwählten Klasse aufgerufen, wenn
	 * der Benutzer eine Klasse ausgewählt und den Dialog mit "OK" geschlossen
	 * hat.
	 * @param {Object} callbackScope Objekt, in dessen Kontext die bei <code>callbackFn</code>
	 * angegebene Funktion ausgeführt werden soll.
	 */
	selectClass : function(classname, callbackFn, callbackScope)
	{
		var opts = PDMeta.getAllSubClasses(classname);
		var cbFn = function(res, data) {
				if(res === UIMessage.OK && data && data.selClass && callbackFn)
					callbackFn.call((callbackScope || this), data.selClass);
			};
		UIApplication.openUIDialog('jafwebClassSelection',
					(PDMeta.getErgname(classname) || classname),
					cbFn, (callbackScope || this), { subclasses: opts, selClass: '' });
	},
	
	/**
	 * Zeigt einen schreibgeschützten Dialog mit dem übergebenen Textinhalt
	 * an.
	 * @param {string} content Der anzuzeigende Inhalt. Je nach Angabe im zweiten
	 * Parameter kann hier HTML übergeben werden, das dann unverändert angezeigt
	 * wird, oder aber Text, der nach HTML formatiert und dann angezeigt wird.
	 * @param {boolean} isHtml Gibt an, ob der übergebene Inhalt als HTML oder
	 * Reintext interpretiert werden soll.
	 * @param {string} title Titel für den Dialog.
	 * @param {Function} callbackFn Optionale Callback-Funktion, die nach dem
	 * Schließen des Dialogs aufgerufen werden soll.
	 * @param {Object} callbackScope Optionale Angabe eines Ausführungskontetxs
	 * für die bei <code>callbackFn</code> angegebene Funktion.
	 */
	showPreviewDialog : function(content, isHtml, title, callbackFn, callbackScope)
	{
		UIApplication.openUIDialog('jafwebPreviewDialog', (title || ''),
				(callbackFn || null), (callbackScope || this), {
					content: (content || ''),
					isHtml: (isHtml === true)
				});
	},
	
	/**
	 * Zeigt einen Dialog zum Bearbeiten der im Modell definierten Klassenattribute
	 * an.
	 * @param {Function} callbackFn Optionale Callback-Funktion, die nach dem
	 * Schließen des Dialogs aufgerufen werden soll.
	 * @param {Object} callbackScope Optionale Angabe eines Ausführungskontetxs
	 * für die bei <code>callbackFn</code> angegebene Funktion.
	 */
	editClassAttributes : function(callbackFn, callbackScope)
	{
		UIApplication.openUIDialog('jafwebClassAttribDialog', PDMeta.getString('SC::OptionsTitle'), { });
	},
	
	/**
	 * Dialog zum Bearbeiten der Benutzereinstellungen anzeigen. Dies
	 * ist nur möglich, wenn die Anwendung eine Klasse mit dem Stereotyp
	 * <code>User</code> modelliert wurde. Es wird der Formulardialog zu
	 * dieser Klasse angezeigt.
	 * @param {string} viewname Wenn Sie nicht das standardmäßig für die
	 * Benutzer-Klasse genberierte, sondern ein eigenes XML-Layout verwenden
	 * möchten, können Sie hier einen entsprecehnden Namen angeben.
	 * @param {Function} callbackFn Optionale Angabe einer Callback-Funktion, die
	 * nach dem Bearbeiten des Benutzerobjekts aufgerufen werden soll. Beim
	 * Aufruf erhält diese Funktion das editierte Benutzerobjekt als Parameter.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callbackFn</code>
	 * angegebene Funktion ausgeführt werden soll.
	 */
	editUserSettings : function(viewname, callbackFn, scope)
	{
		var pUser = ClientInfo.getUserObject();
		if(!pUser)
		{
			UIMessage.ok(PDMeta.getString('SC::ApplUserObjectNotFound'));
			return;
		}
		UIApplication.openFormDialog(pUser, pUser.classname, '',
					null, '', 0 /* tid */, PDDialog.MASTER,
					(viewname || ''), callbackFn);
	},
	
	/**
	 * Dialog zum Bearbeiten der Mandanteneinstellungen anzeigen. Dies
	 * ist nur möglich, wenn die Anwendung mandantenfähig ist und eine
	 * Klasse mit dem Stereotyp <code>Principal</code> modelliert wurde.
	 * Es wird der Formulardialog zu dieser Klasse angezeigt.
	 * @param {string} viewname Wenn Sie nicht das standardmäßig für die
	 * Mandanten-Klasse genberierte, sondern ein eigenes XML-Layout verwenden
	 * möchten, können Sie hier einen entsprecehnden Namen angeben.
	 * @param {Function} callbackFn Optionale Angabe einer Callback-Funktion, die
	 * nach dem Bearbeiten des Mandantenobjekts aufgerufen werden soll. Beim
	 * Aufruf erhält diese Funktion das editierte Mandantenobjekt als Parameter.
	 * @param {Object} scope Objekt, in dessen Kontext die bei <code>callbackFn</code>
	 * angegebene Funktion ausgeführt werden soll.
	 */
	editPrincipalSettings : function(viewname, callbackFn, scope)
	{
		var pPrinc = ClientInfo.getPrincipalObject();
		if(!pPrinc)
		{
			UIMessage.ok(PDMeta.getString('SC::ApplPrincObjectNotFound'));
			return;
		}
		UIApplication.openFormDialog(pPrinc, pPrinc.classname, '',
					null, '', 0 /* tid */, PDDialog.MASTER,
					(viewname || ''), callbackFn);
	},
	
	/**
	 * Zeigt den "About"-Dialog an. Der Dialog stellt den Text aus <code>PDMeta.getAbout()</code>
	 * ermittelten Wert in der aktuellen
	 * Anwendungssprache dar. Titel des Dialogs ist der des Hauptfensters.
	 * @param {string} icon Optionale Angabe einer Icon-Datei (bezogen auf das mit
	 * <code>UIApplication.getImageDir()</code> ermittelte Verzeichnis der Web-Anwendung.
	 * Das Icon wird links neben dem Text dargestellt.
	 */
	showAboutBox : function(icon)
	{
		var txt = PDMeta.getAbout();
		var titl = (PDMeta.getString('SC::JanusAboutT') || '');
		UIMessage.ok(txt, function() { }, titl, (icon || UIMessage.INFORMATION));
	},
	
	/*
	 \internal
	 * Zeigt den Tester an.
	 */
	showTester : function()
	{
		UIApplication.openUIDialog('jafwebTester', '', { });
	},
	
	/**
	Zeigt einen Dialog zum Hochladen einer Datei an.
	Dieser Dialog wird vom <code>UIDocumentField</code> benutzt, wenn
	das zugehörige Fachkonzept-Attribut das <code>BaseDirOnServer</code>-Property
	verwendet, also die Datei auf dem Server verwaltet.
	@param {number} tocid Id der Klasse, zu der das Objekt gehört, dem die Datei
	zugeordnet werden soll. Ersatzweise kann auch der Klassenname als String
	angegeben werden.
	@param {number} tooid Id des Objekts, dem die Datei zugeordnet werden soll.
	@param {string} attr Name des Attributs, zu dem die Datei gehört.
	@param {string} fileTypes Die Dateitypen, die der Benutzer auswählen können soll.
	@param {number} maxFileSize Maximal erlaubte Dateigröße, die der Benutzer hochladen
	kann.
	@param {boolean} closeAfterUpload Zeigt an, dass der Dialog nach erfolgtem Upload
	geschlossen werden soll. Fehlt der Parameter, bbleibt der Dialog geöffnet und der
	Benutzer kann einen weiteren Upload ausführen.
	@param {Function} callback JavaScript-Funktion, die nach erfolgreichem Hochladen
	und Schließen des Upload-Dialogs aufgerufen wird. Als einzigen Parameter erhält
	diese Funktion den Namen der hochgeladenen Datei, und zwar ohne den Pfad und
	in der nach dem Hochladen Server-seitig gültigen Form; letztere kann von dem
	Namen der lokal ausgewählten Datei abweichen, wenn es im Basisverzeichnis 
	auf dem Server bereits eine Datei gleichen Namens gibt.
	@param {Object} scope Der Kontext, in dem die Callback-Funktion augeführt werden
	soll.
	@todo Unterstützung des gleichzeitigen Uploads mehrerer Dateien.
	*/
	showFileUploader : function(tocid, tooid, attr, fileTypes, maxFileSize, closeAfterUpload, callback, scope)
	{
		//UIDebug.log(UIDebug.WARN, 'UIApplication.showFileUploader()');
		var pars = new JParamPacker('' /*this.getWorkspace().getUploadUrlRoot()*/);
		var _callb = null;
		var _scope = this;
		var _filetypes = "*";
		var _maxFileSize = 1048576;
		var _autoClose = false;
		var pos = 0;
		if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			if(arguments[pos] != 0)
				pars.add("tocid", arguments[pos]);
			pos++;
		}
		else if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				pars.add("toclass", arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			if(arguments[pos] != 0)
				pars.add("tooid", arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				pars.add("attr", arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				_filetypes = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			if(arguments[pos] > 0)
				_maxFileSize = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			if(arguments[pos] > 0)
				_autoClose = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "function")
			_callb = arguments[pos++];
		var url = UIApplication.getUploadURL() + "?janusFileOperation=uploadWebEvent&iid=" + PDMeta.getInstanceID() + 
				"&sessionId=" + UIApplication.getAuthToken() +
				"&janusWebEvent=PDClass.jexecUpload" + pars.getEventString();
		// TODO: fileTypes beruecksichtigen!
		var cfg = {
			url: url,
			base_params: {
					
				},
			post_var_name: 'jwv_file',
			reset_on_hide: true,
			allow_close_on_upload: true,
			upload_autostart: true,
			permitted_extensions: [  ], // TODO
			// Ext.Window-Parameter:
			id: '_globalUplDlg',
			modal: true,
			// Events
			listeners: {
					filetest: function(dialog, filename)
						{
							// TODO: Dateityp pruefen
							 
							//return false; // nicht in die Queue!
						},
					uploadsuccess: function(dialog, filename, data, record)
						{
							//UIDebug.log(UIDebug.WARN, "uploadsuccess - filename: '"+filename+"', returned filename: '"+data.filename+"'");
							if(_callb)
								_callb.call((_scope || this), data.filename);
							// wenn nur eine Datei hochgeladen werden soll (Document-Feld),
							// sofort schliessen
							if(_autoClose)
							{
								try
								{
									dialog.close();
								}
								catch(ex) { }
							}
						},
					uploaderror: function(dialog, filename, data, record)
						{
							UIMessage.ok("Upload error! File: '" + filename + "', data: "+inspect(data, true));
						},
					uploadfailed: function(dialog, filename, record)
						{
							UIMessage.ok("Upload failed! File: '" + filename + "', record: "+inspect(record, true));
						},
					uploadcanceled: function(dialog, filename, record)
						{
						},
					uploadstart: function(dialog)
						{
						},
					uploadstop: function(dialog)
						{
						},
					// alles hochgeladen:
					uploadcomplete: function(dialog)
						{
						}
				}
			};
		if(this.hasPDMeta() && PDMeta.getLangCode(PDMeta.getLang()) == 'de')
		{
			cfg.i18n = {
				  title: 'Datei-Upload',
				  state_col_title: 'Status',
				  state_col_width: 70,
				  filename_col_title: 'Dateiname',
				  filename_col_width: 230,  
				  note_col_title: 'Anmerkung',
				  note_col_width: 150,
				  add_btn_text: 'Neu',
				  add_btn_tip: 'Eine Datei an die Warteschlange hängen.',
				  remove_btn_text: 'Entfernen',
				  remove_btn_tip: 'Datei aus der Wartschlange entfernen.',
				  reset_btn_text: 'Zurücksetzen',
				  reset_btn_tip: 'Queue zurücksetzen.',
				  upload_btn_start_text: 'Upload',
				  upload_btn_stop_text: 'Abbrechen',
				  upload_btn_start_tip: 'Lädt die Dateien in der Wartschlange zum Server.',
				  upload_btn_stop_tip: 'Upload anhalten.',
				  close_btn_text: 'Schließen',
				  close_btn_tip: 'Dialog schließen.',
				  progress_waiting_text: 'Warte...',
				  progress_uploading_text: 'Upload: {0} of {1} Dateien fertig.',
				  error_msgbox_title: 'Fehler',
				  permitted_extensions_join_str: ',',
				  err_file_type_not_permitted: 'Ausgewählte Dateierweiterung ist nicht zulässig.<br/>Bitte wählen Sie eine aus folgenden Erweiterungen: {1}',
				  note_queued_to_upload: 'Zum Hochladen in die Warteschlange aufgenommen.',
				  note_processing: 'Lade hoch...',
				  note_upload_failed: 'Server ist nicht erreichbar oder interner Server-Fehler aufgetreten.',
				  note_upload_success: 'OK.',
				  note_upload_error: 'Fehler beim Hochladen.',
				  note_aborted: 'Abbruch durch Benutzer.'
				};
		}
		var fileUploader = new Ext.ux.UploadDialog.Dialog(cfg);
		fileUploader.show();
	},
	
	/**
	Einen Download ausführen.
	@param {Object} params Objekt mit Parametern.
	Derzeit werden untertzsützt:
	<ul>
		<li><code>filepath</code> (String): Vollständiger Pfad der herunterzuladenden Datei
		im Server-Dateisystem. Typischerweise wird dieser von einem direkt
		vorher ausgeführten Request ermittelt, z.B. nach Erzeugen einer
		Reportdatei. Alternativ kann auch Pfad und Name der Datei getrennt
		angegeben werden:</li>
		<li><code>path</code> (String): Pfad zur herunterzuladenden Datei
		im Server-Dateisystem. Typischerweise wird dieser von einem direkt
		vorher ausgeführten Request ermittelt, z.B. nach Erzeugen einer
		Reportdatei.</li>
		<li><code>file</code> (String): Name der Datei.</li>
		<li><code>del</code> (Boolean): Soll die Datei nach Download gelöscht werden?</li>
	</ul>
	*/
	download : function(params)
	{
		// Datei herunterladen
		var pars = new JParamPacker("PDClass.jexecDownload");
		if(params)
		{
			for(var p in params)
			{
				if(params.hasOwnProperty(p))
					pars.add(p, params[p]);
			}
		}
		//
		var url = UIApplication.getDownloadUrlRoot() +
					"?janusFileOperation=downloadWebEvent&iid=" + PDMeta.getInstanceID() +
					"&sessionId=" + UIApplication.getAuthToken() +
					"&janusWebEvent=" + pars.getEventString(true);
		window.open(url);
	},

	/**
	Gibt den Hauptarbeitsbereich der Anwendung zurück.
	@return {UIWorkspace} Das Workspace-Objekt.
	*/
	getWorkspace : function()
	{
		if(typeof window['getWorkspace'] == 'function')
			return window.getWorkspace();
		return null;
	},
	
	/**
	Blockierenden Wartedialog anzeigen.
	*/
	startWaiting : function()
	{
		if(window['UIProgressDialog'])
			UIProgressDialog.showWait(
					(PDMeta.getString('SC::OpCallPleaseWait') || 'Please wait...')
				);
	},
	
	/**
	Wartedialog ausblenden.
	*/
	endWaiting : function()
	{
		if(window['UIProgressDialog'])
			UIProgressDialog.hide();
	},
	
	/**
	Ein Fachkonzeptobjekt soll gelöscht werden.
	Für eine eigene Behandlung redefinieren Sie diese
	Funktion und geben, wenn die Standardbehandlung
	nicht ausgeführt werden soll, <code>false</code>
	zurück.
	@param {PDObject} pdo Das zu löschende Objekt. Statt
	des einzelnen Objekts kann auch ein Array von
	<code>PDObject</code> übergeben werden, wenn mehrere
	Objekte gelöscht werden sollen!
	@return {Boolean} Geben Sie <code>false</code> zurück,
	wenn die Standardbehandlung nach Ihrem Handler abgebrochen
	werden soll. In allen anderen Fällen wird das Löschen
	fortgesetzt.
	*/
	onDeleteObject : function(pdo)
	{ },
	
	/**
	Ein oder mehrere Fachkonzeptobjekte wurden gelöscht.
	*/
	onObjectsDeleted : function()
	{ },
	
	/**
	Führt das Löschen eines oder mehrerer Fachkonzeptobjekte
	aus. Diese Funktion stellt den zweiten Bearbeitungsschritt
	von <code>handleDeleteObject</code> dar und sollte deshalb
	niemals direkt, sondern nur in
	[UIApplication.onDeleteObject]{@link UIApplication#onDeleteObject}-Handlern
	ausfgerufen werden, wenn dort asynchron gearbeitet werden muss
	(z.B. durch Stellen einer Rückfrage an den Benutzer).
	@param {PDObject} pdo Das zu löschende Objekt. Statt
	des einzelnen Objekts kann auch ein Array von
	<code>PDObject</code> übergeben werden, wenn mehrere
	Objekte gelöscht werden sollen.
	@param {boolean} doNotAsk Nachfrage unterdrücken?
	@param {Function} callback Funktion, die aufgerufen wird,
	wenn das Objekt gelöscht wurde. Wird typischerweise
	zur Aktualisierung der Oberfläche verwendet.
	*/
	execDeleteObject : function(pdo, doNotAsk, callback)
	{
		if(!JafWeb.isArray(pdo))
			pdo = [ pdo ];
		if(pdo.length == 0) return;
		var appl = this;
		var asked = false;
		var pos = 1;
		var ask = false;
		var dontAsk = false;
		var callbFn = null;
		if(pos < arguments.length && typeof arguments[pos] == 'boolean')
		{
			dontAsk = arguments[pos];
			pos++;
		}
		if(pos < arguments.length && typeof arguments[pos] == 'function')
		{
			callbFn = arguments[pos];
			pos++;
		}
		if(!dontAsk)
		{
			for(var i=0; i<pdo.length; i++)
			{
				if(!ask && (PDMeta.getClassFlags() & PDMeta.AskDelete) == 0)
					ask = true;
				if(pdo[i]._allowDelete == false || pdo[i]._allowDelete == "false")
				{
					UIMessage.ok((PDMeta.getString("SC::NoDelPermission") || "You have no permission to delete this record."));
					return;
				}
			}
		}
		var loadMask = new Ext.LoadMask(Ext.getBody(),
				{ msg: PDMeta.getString('SC::DelCommitT') });
		loadMask.show();
		var prep = null;
		try
		{
			prep = PDClass.prepareDeletion(pdo);
		}
		catch(pdEx)
		{
			loadMask.hide();
			loadMask = undefined;
			loadMask = null;
			UIMessage.ok(pdEx.toString() || 'prepareDeletion failed!');
			return;
		}
		loadMask.hide();
		loadMask = undefined;
		loadMask = null;
		if(prep && prep.failedAt)
		{
			UIMessage.ok((PDClass.getLastMessage() || 'prepareDeletion failed!'));
			return;
		}
		var quest = "";
		if(prep && prep.count > pdo.length)
		{
			quest = (PDMeta.getString('SC::DelCommit') || "When you delete this record, %d records of the classes %l will be deleted.");
			quest = quest.replace(/%d/, prep.count);
			var cls = '';
			for(var i=0; i < prep.classes.length; i++)
			{
				/*if(i + 1 == prep.classes.length)
					cls += ' und ';
				else*/ if(i > 0)
					cls += ', ';
				var cl = prep.classes[i];
				if(typeof cl == 'number')
					cl = PDMeta.getClass(cl);
				cls += (PDMeta.getErgname(cl) || cl);
			}
			quest = quest.replace(/%l/, cls);
		}
		if(quest)
			quest += ' ';
		if(pdo.length > 1)
		{
			quest += (PDMeta.getString("SC::LstAskDeleteMulti") || "Do you really want to delete this %d records?");
			quest = quest.replace(/%d/, ""+pdo.length);
		}
		else
			quest += (PDMeta.getString("SC::LstAskDelete") || "Do you really want to delete this record?");
		// askDelete beruecksichtigen
		if(!ask)
		{
			var txt = (PDMeta.getString("SC::DelMaskMany") || "Deleting elements...");
			loadMask = new Ext.LoadMask(Ext.getBody(),
					{ msg: txt });
			loadMask.show();
			var delCount = 0;
			for(var i=0; i<pdo.length; i++)
			{
				var delRes = PDClass.deleteObject(pdo[i]);
				if(delRes != 0)
				{
					loadMask.hide();
					if(delCount > 0)
						appl.onObjectsDeleted();
					UIMessage.ok(PDMeta.getString(delRes));
					if(callbFn)
						callbFn();
					return;
				}
				delCount++;
			}
			loadMask.hide();
			if(delCount > 0 && appl.onObjectsDeleted() === false)
				return;
			if(callbFn)
				callbFn();
		}
		else
		{
			UIMessage.yesNo(quest,
					function(res) {
						if(res !== UIMessage.YES)
							return;
						var txt = (PDMeta.getString("SC::DelMaskMany") || "Deleting elements...");
						loadMask = new Ext.LoadMask(Ext.getBody(),
								{ msg: txt });
						loadMask.show();
						var delCount = 0;
						for(var i=0; i<pdo.length; i++)
						{
							if(PDClass.deleteObject(pdo[i]) != 0)
							{
								loadMask.hide();
								if(delCount > 0)
									appl.onObjectsDeleted();
								return;
							}
							delCount++;
						}
						loadMask.hide();
						if(delCount > 0 && appl.onObjectsDeleted() === false)
							return;
						if(callbFn)
							callbFn();
					}
				);
		}
	},
	
	/*
	Wird aufgerufen, wenn ein oder mhrere Fachkonzeptobjekte
	gelöscht werden sollen. Die Funktion stellt ggf.
	eine Rückfrage an den Benutzer.
	Löschen eines Fachkonzeptobjekts.
	@param {PDObject} pdos Das zu löschende Objekt. Statt
	des einzelnen Objekts kann auch ein Array von
	<code>PDObject</code> übergeben werden, wenn mehrere
	Objekte gelöscht werden sollen.
	@param {Function} callback Funktion, die aufgerufen wird,
	wenn das Objekt gelöscht wurde. Wird typischerweise
	zur Aktualisierung der Oberfläche verwendet.
	*/
	handleDeleteObject : function(pdos, callback)
	{
		//UIDebug.log(UIDebug.DEBUG, "UIApplication.handleDeleteObject()");
		if(!pdos) return;
		if(!JafWeb.isArray(pdos))
			pdos = [pdos];
		if(this.onDeleteObject(pdos, callback) === false)
			return;
		this.execDeleteObject(pdos, false, callback);
	},
	
	/*
	Wird aufgerufen, wenn eine Fachkonzeptoperation (z.B. im
	Baum) ausgelöst wird.
	@param {UIWindow} parent Elternfenster.
	@param {string} viewname Sichten- oder Klassenname.
	@param {string} opname Technischer Name der Fachkonzeptoperation.
	Handelt es sich um eine statische Operation, muss er in der Form
	Klassenname::Operationsname angegeben werden.
	@param {PDObject} obj Das <code>this</code>-Objekt, falls es sich
	um eine Objektoperation handelt.
	@return Boolean Geben Sie hier <code>false</code> zurück, wenn Sie
	den Operationsuafruf selbst behandelt haben und die Standardbehandlung
	unterbinden möchten.
	*/
	doCallOperation : function(parent, viewname, opname, obj)
	{ },

	/*
	 * Zeigt eine modale Warteanzeige an.<br/>
	 * <span class="important">Hinweis:</span> Bitte beachten Sie, dass die Anzeige mit <code>endWaiting()</code>
	 * wieder ausgeschaltet werden muss.
	 */
	startWaiting : function()
	{
		// TODO
	},
	
	/*
	 * Beendet die Warteanzeige.
	 * @see <code>startWaiting()</code>.
	 */
	endWaiting : function()
	{
		// TODO
	},
	
	/*
	 * Fragt ab, ob die Warteanzeige aktuell angezeiggt wird.
	 * @see <code>startWaiting()</code>.
	 */
	isWaiting : function()
	{
		// TODO
	},
	
	// FK-Unterstuetzung abfragen
	/**
	 * @deprecated
	 * @return {boolean}
	 */
	hasPDProperties : function()
	{ return (window['PDProperties'] ? true : false); },

	/**
	 * @deprecated
	 * @return {boolean}
	 */
	hasPDClass : function()
	{ return (window['PDClass'] ? true : false); },

	/**
	 * @deprecated
	 * @return {boolean}
	 */
	hasClientInfo : function()
	{ return (window['ClientInfo'] ? true : false); },

	/**
	 * @deprecated
	 * @return {boolean}
	 */
	hasPDMeta : function()
	{ return (window['PDMeta'] ? true : false); },
	
	/**
	 * Gibt den SoundManager zurück, falls einer zur Verfügung
	 * steht.
	 * @return {Object} Der SoundManager. Siehe
	 * <a href="http://schillmania.com/projects/soundmanager2/">SoundManager 2</a>.
	 */
	getSoundManager : function()
	{
		if(typeof SoundManager == 'undefined')
		{
			if(!loadJavaScript('resExt/script/soundmanager/script/soundmanager2-nodebug-jsmin.js'))
				return null;
		}
		if(!this._soundManager && (typeof SoundManager != 'undefined'))
		{
			if(window.soundManager)
				this._soundManager = window.soundManager;
			else
				this._soundManager = new SoundManager(this._soundManagerUrl, 'xyz');
			this.initSoundManager();
		}
		return this._soundManager;
	},

	/*
	 * @ignore(true)
	 * Gibt das UserData-Objekt im IE zurück, das für userData behavior
	 * erforderlich ist. Nötigenfalls wird das Objekt erzeugt. In
	 * anderen Browsern als IE wird <code>null</code> zurückgegeben.
	 * Nach erstmaliger Erzeugung wird automatisch <code>load()</code>
	 * ausgeführt.
	 */
	getIEUserDataObject : function()
	{
		if(Ext.isIE)
		{
			if(!this._userDataDOM)
			{
				this._userDataDOM = top.document.getElementById('wspBody');
				if(!this._userDataDOM)
					UIDebug.log(UIDebug.WARN, "UIApplication.getIEUserDataObject(): userData DOM element not found!");
				else
					this._userDataDOM.load('_1007'); // TODO!
			}
			return this._userDataDOM;
		}
		return null;
	},

	/**
	 * Gibt die Logout-URL der Anwendung zurück.<br/>
	 * <span class="important">Hinweis:</span> Bitte beachten Sie, dass es sich hier ausnahmsweise
	 * <em>nicht</em> um ein <code>janusWebEvent</code> handelt!
	 * @return {string} Die URL.
	 */
	getLogoutEvent : function()
	{ return UIApplication._logoutEvent; },
	
	/**
	 * Gibt die Aufruf-URL der Anwendung (ohne Event-Namen und
	 * Parameter) zurück.
	 * @return {string} Die URL.
	 */
	getUrlRoot : function()
	{ return UIApplication._urlRoot; },
	
	/**
	 * Gibt die URL der Anwendung für Downloads
	 * zurück.
	 * @return {string} Die URL.
	 */
	getDownloadURL : function()
	{ return UIApplication._downloadUrl; },
	
	/**
	 * Gibt die URL der Anwendung für Uploads
	 * zurück.
	 * @return {string} Die URL.
	 */
	getUploadURL : function()
	{ return UIApplication._uploadUrl; },
	
	/**
	@deprecated
	Ermittelt die Basis-URL für Uploads zum
	Anwendungs-Server.
	@return {string} Die URL.
	*/
	getUploadUrlRoot : function()
	{
		var tmp = UIApplication._urlRoot;
		var pos = tmp.lastIndexOf('/');
		if(pos > 0)
			return tmp.substr(0, pos) + "/upload";
		return "../upload";
	},
	
	/**
	@deprecated
	Ermittelt die Basis-URL für Downloads vom
	Anwendungs-Server.
	@return {string} Die URL.
	*/
	getDownloadUrlRoot : function()
	{
		var tmp = UIApplication._urlRoot;
		var pos = tmp.lastIndexOf('/');
		if(pos > 0)
			return tmp.substr(0, pos) + "/download";
		return "../download";
	},

	/**
	 * Gibt den relativen Pfad zum Ressourcen-Verzeichnis der
	 * Web-Anwendung zurück, bezogen auf die Root URL.
	 * @return {string} Relatives Verzeichnis, abgeschlossen
	 * mit "/".
	 */
	getResourceDir : function()
	{ return UIApplication._resDir; },

	/**
	 * Gibt den relativen Pfad zum Skript-Verzeichnis zurück,
	 * bezogen auf die Root URL der Web-Anwendung.
	 * @return {string} Relatives Verzeichnis, abgeschlossen
	 * mit "/".
	 */
	getScriptDir : function()
	{ return UIApplication._scriptDir; },

	/**
	 * Gibt den relativen Pfad zum Abbildungsverzeichnis zurück,
	 * bezogen auf die Root URL der Web-Anwendung.
	 * @return {string} Relatives Verzeichnis, abgeschlossen
	 * mit "/".
	 */
	getImageDir : function()
	{ return UIApplication._imgDir; },

	/**
	 * Gibt den relativen Pfad zum Icon-Verzeichnis zurück,
	 * bezogen auf die Root URL der Web-Anwendung.
	 * Standardmäßig ist das eines der Unterverzeichnisse
	 * <code>btns</code>, <code>icns</code> oder
	 * <code>old</code> des Abbildungsverzeichnisses (s.
	 * <code>getImageDir()</code>), je nachdem, welcher Icon-Satz
	 * benutzt wird.
	 * @return {string} Relatives Verzeichnis, abgeschlossen
	 * mit "/".
	 * @deprecated
	 */
	getButtonDir : function()
	{ return UIApplication._btnDir; },

	/**
	 * Gibt den relativen Pfad zum Verzeichnis mit den
	 * CSS-Stylesheets zurück,
	 * bezogen auf die Root URL der Web-Anwendung.
	 * Standardmäßig ist das das Unterverzeichnis
	 * <code>css</code>.
	 * @return {string} Relatives Verzeichnis, abgeschlossen
	 * mit "/".
	 */
	getStylesheetDir : function()
	{ return UIApplication._cssDir; },

	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt das aktuell eingestellte Datumsformat zurück.
	 * Alle Datumsattribute sind nach diesem formatiert.
	 * @return {string} Format-String, z.B. "%d.%m.%Y"
	 */
	getDateFormat : function()
	{ return ClientInfo.getDateFormat(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt das aktuell eingestellte Format für Zeitstempel
	 * zurück. Alle Zeitstempel sind nach diesem formatiert.
	 * @return {string} Format-String, z.B. "%d.%m.%Y %h:%M:%s"
	 */
	getTimestampFormat : function()
	{ return ClientInfo.getTimestampFormat(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt das aktuell eingestellte Zeitformat
	 * zurück. Alle Zeit-Attribute sind nach diesem formatiert.
	 * @return {string} Format-String, z.B. "%h:%M:%s"
	 */
	getTimeFormat : function()
	{ return ClientInfo.getTimeFormat(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt wie [getTimeFormat()]{@link UIApplication#getTimeFormat} das
	 * aktuell eingestellte Zeitformat zurück, jedoch bevorzugt in
	 * der um die Sekunden gekürzten Form.
	 * @return {string} Format-String, z.B. "%h:%M"
	 */
	getShortTimeFormat : function()
	{ return ClientInfo.getShortTimeFormat(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt das aktuell eingestellte Tausendertrennzeichen
	 * für Währungsattribute zurück.
	 * @return {string} Einzelnes Trennzeichen, z.B. ".",
	 * oder Leerstring.
	 */
	getCurrencygroupSign : function()
	{ return ClientInfo.getCurrencygroupSign(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt das aktuell eingestellte Dezimaltrennzeichen
	 * zurück.
	 * @return {string} Einzelnes Trennzeichen, z.B. ","
	 */
	getDecimalSign : function()
	{ return ClientInfo.getDecimalSign(); },

	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt den ergonomischen Bezeichner für den booleschen
	 * Wert true zurück.
	 * @return {string} Z.B. "true".
	 */
	getTrueValue : function()
	{ return ClientInfo.getTrueValue(); },

	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt den ergonomischen Bezeichner für den booleschen
	 * Wert false zurück.
	 * @return {string} Z.B. "false".
	 */
	getFalseValue : function()
	{ return ClientInfo.getFalseValue(); },

	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt ein Array mit Namen (gerade Stellen) und
	 * Umrechnungswerten (ungerade Stellen) der 
	 * Standardwährungen zurück.
	 * @return Array mit folgenden Elementen:
<pre>
"EUR", 1.0,
"DM", 1.95583,
"ITL", 1936.27,
"FRF", 6.55957,
"BEF", 40.3399,
"ESP", 166.386,
"IEP", 0.787564,
"LUF", 40.3399,
"NLG", 2.20371,
"ATS", 13.7603,
"PTE", 200.482,
"FIM", 5.94573</pre>
	 */
	getDefaultCurrencies : function()
	{ return ClientInfo.getDefaultCurrencies(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt ein assoziatives Array mit Namen und Umrechnungsfaktoren
	 * der Währungen zurück.
	 * @return {Object} Objekt mit Properties aus Währungsname und Umrechnungsfaktor.
	 */
	getCurrencies : function()
	{ return ClientInfo.getCurrencies(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Legt die in der Anwendungsoberfläche unterstützten
	 * Währungen fest.
	 * @param {Object} currencies Objekt mit den Währungsbezeichnungen
	 * als Properties und den zugehörigen Umrechnungsfaktoren als
	 * Werte. Beispiele:
<pre class="prettyprint"><code>
UIApplication.setCurrencies({
		"EUR": 1.0,
		"TEUR": 0.001
	});
</code></pre>
<pre class="prettyprint"><code>
PDClass.getCurrencies(function(res) {
		UIApplication.setCurrencies(res);
	});
</code></pre>
	 */
	setCurrencies : function(currencies)
	{ ClientInfo.setCurrencies(currencies); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt ein assoziatives Array mit Namen und Anzahl Nachkommastellen
	 * der Währungen zurück.
	 * @return {Object} Objekt mit Properties aus Währungsname und Anzahl Nachkommastellen.
	 */
	getCurrencyPrecisions : function()
	{ return ClientInfo.getCurrencyPrecisions(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt die Default-Währung zurück, die anwendungsweit als Basis für
	 * Währungsumrechnungen verwendet wird.
	 * @return {string} Der Währungsname.
	 */
	getDefaultCurrency : function()
	{ return ClientInfo.getDefaultCurrency(); },
	
	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt ein Array mit den Monatsnamen in der
	 * angegebenen Anwendungssprache zurück. Diese
	 * Funktion wird vom <code>UIDateField</code>
	 * benutzt.
	 * @param {boolean} shortForm <code>true</code>, wenn
	 * die Namen in Kurzform zurückgegeben werden
	 * sollen ("Jan" statt "Januar").
	 * @param {string} lang Kürzel - oder Index (int) - der 
	 * Anwendungssprache, in der die Namen zurückgegeben
	 * werden sollen. Wenn der Parameter fehlt, wird
	 * die aktive Anwendungssprache benutzt.
	 * @return {string[]} Array von String mit den 
	 * Monatsnamen. 
	 */
	getMonthnames : function(shortForm, lang)
	{ return ClientInfo.getMonthnames(shortForm, lang); },

	/**
	 * @deprecated Verwenden Sie statt dieser die gleichnamige
	 * Funktion von {@link ClientInfo}.
	 * @desc Gibt ein Array mit den Namen der Wochentage
	 * in der angegebenen Anwendungssprache zurück. Diese
	 * Funktion wird vom <code>UIDateField</code>
	 * benutzt.
	 * @param {boolean} shortForm <code>true</code>, wenn
	 * die Namen in Kurzform zurückgegeben werden
	 * sollen ("Mo" statt "Montag").
	 * @param {string} [lang] Kürzel - oder Index (int) - der 
	 * Anwendungssprache, in der die Namen zurückgegeben
	 * werden sollen. Wenn der Parameter fehlt, wird
	 * die aktive Anwendungssprache benutzt.
	 * @return {string[]} Array von String mit den 
	 * Wochentagsnamen, beginnend bei Montag.
	 */
	getWeekdays : function(shortForm, lang)
	{ return ClientInfo.getWeekdays(shortForm, lang); },

	/**
	 * Gibt den Namen der Bilddatei zu dem angegebenen Ressourcen-Namen
	 * zurück.
	 * Es können nur die Dateinamen zurückgegeben werden, die zuvor mit
	 * [addImageResource()]{@link UIApplication#addImageResource} registriert
	 * wurden.<br/>
	 * Folgende Icons sind vordefiniert:
	 <table class="props">
		<thead>
			<tr><th>Icon</th><th>Ressource-Id</th><th>Datei</th></tr>
		</thead>
		<tbody>
			<tr><td><img src="icons/open.gif"/></td><td>OPEN</td><td class="last">open.gif</td></tr>
			<tr><td><img src="icons/dialog_n.gif"/></td><td>DIALOG_N</td><td class="last">dialog_n.gif</td></tr>
			<tr><td><img src="icons/del_02.gif"/></td><td>DEL</td><td class="last">del_02.gif</td></tr>
			<tr><td><img src="icons/liste.gif"/></td><td>LISTE</td><td class="last">liste.gif</td></tr>
			<tr><td><img src="icons/discon.gif"/></td><td>DISCON</td><td class="last">discon.gif</td></tr>
			<tr><td><img src="icons/attrib.gif"/></td><td>ATTRIB</td><td class="last">attrib.gif</td></tr>
			<tr><td><img src="icons/filter.gif"/></td><td>FILT_USE</td><td class="last">filter.gif</td></tr>
			<tr><td><img src="icons/refresh.gif"/></td><td>REFRESH</td><td class="last">refresh.gif</td></tr>
			<tr><td><img src="icons/dialog.gif"/></td><td>DIALOG</td><td class="last">dialog.gif</td></tr>
			<tr><td><img src="icons/d_new.gif"/></td><td>D_NEW</td><td class="last">d_new.gif</td></tr>
			<tr><td><img src="icons/a_z.gif"/></td><td>A_Z</td><td class="last">a_z.gif</td></tr>
			<tr><td><img src="icons/a_down.gif"/></td><td>A_DOWN</td><td class="last">a_down.gif</td></tr>
			<tr><td><img src="icons/a_previous.gif"/></td><td>A_PREVIOUS</td><td class="last">a_previous.gif</td></tr>
			<tr><td><img src="icons/a_next.gif"/></td><td>A_NEXT</td><td class="last">a_next.gif</td></tr>
			<tr><td><img src="icons/a_up.gif"/></td><td>A_UP</td><td class="last">a_up.gif</td></tr>
			<tr><td><img src="icons/abort.gif"/></td><td>ABORT</td><td class="last">abort.gif</td></tr>
			<tr><td><img src="icons/boolTrue.gif"/></td><td>BOOL_TRUE</td><td class="last">boolTrue.gif</td></tr>
			<tr><td><img src="icons/boolFalse.gif"/></td><td>BOOL_FALSE</td><td class="last">boolFalse.gif</td></tr>
			<tr><td><img src="icons/businessman.gif"/></td><td>BUSINESSMAN</td><td class="last">businessman.gif</td></tr>
			<tr><td><img src="icons/businessmen.gif"/></td><td>BUSINESSMEN</td><td class="last">businessmen.gif</td></tr>
			<tr><td><img src="icons/connect.gif"/></td><td>CONNECT</td><td class="last">connect.gif</td></tr>
			<tr><td><img src="icons/copy.gif"/></td><td>COPY</td><td class="last">copy.gif</td></tr>
			<tr><td><img src="icons/cut.gif"/></td><td>CUT</td><td class="last">cut.gif</td></tr>
			<tr><td><img src="icons/delete.gif"/></td><td>DELETE</td><td class="last">delete.gif</td></tr>
			<tr><td><img src="icons/disk_blue.png"/></td><td>DISK_BLUE</td><td class="last">disk_blue.png</td></tr>
			<tr><td><img src="icons/disks.png"/></td><td>DISKS</td><td class="last">disks.png</td></tr>
			<tr><td><img src="icons/document_plain.gif"/></td><td>DOCUMENT_EDIT</td><td class="last">document_plain.gif</td></tr>
			<tr><td><img src="icons/document_view.gif"/></td><td>DOCUMENT_VIEW</td><td class="last">document_view.gif</td></tr>
			<tr><td><img src="icons/down.gif"/></td><td>DOWN</td><td class="last">down.gif</td></tr>
			<tr><td><img src="icons/down1.gif"/></td><td>DOWN1</td><td class="last">down1.gif</td></tr>
			<tr><td><img src="icons/earth.gif"/></td><td>EARTH</td><td class="last">earth.gif</td></tr>
			<tr><td><img src="icons/exit.gif"/></td><td>EXIT</td><td class="last">exit.gif</td></tr>
			<tr><td><img src="icons/favorites.gif"/></td><td>FAVORITES</td><td class="last">favorites.gif</td></tr>
			<tr><td><img src="icons/Folder.gif"/></td><td>FOLDER</td><td class="last">Folder.gif</td></tr>
			<tr><td><img src="icons/folder_closed.gif"/></td><td>FOLDER_CLOSED</td><td class="last">folder_closed.gif</td></tr>
			<tr><td><img src="icons/gear.gif"/></td><td>GEAR</td><td class="last">gear.gif</td></tr>
			<tr><td><img src="icons/hammer.gif"/></td><td>HAMMER</td><td class="last">hammer.gif</td></tr>
			<tr><td><img src="icons/home.gif"/></td><td>HOME</td><td class="last">home.gif</td></tr>
			<tr><td><img src="icons/info.gif"/></td><td>INFO</td><td class="last">info.gif</td></tr>
			<tr><td><img src="icons/letter.gif"/></td><td>LETTER</td><td class="last">letter.gif</td></tr>
			<tr><td><img src="icons/loading1.gif"/></td><td>LOADING1</td><td class="last">loading1.gif</td></tr>
			<tr><td><img src="icons/message.gif"/></td><td>MESSAGE</td><td class="last">message.gif</td></tr>
			<tr><td><img src="icons/messages.gif"/></td><td>MESSAGES</td><td class="last">messages.gif</td></tr>
			<tr><td><img src="icons/multilang.gif"/></td><td>MULTILANG</td><td class="last">multilang.gif</td></tr>
			<tr><td><img src="icons/next.gif"/></td><td>NEXT</td><td class="last">next.gif</td></tr>
			<tr><td><img src="icons/nodeColl.gif"/></td><td>NODE_COLL</td><td class="last">nodeColl.gif</td></tr>
			<tr><td><img src="icons/nodeExp.gif"/></td><td>NODE_EXP</td><td class="last">nodeExp.gif</td></tr>
			<tr><td><img src="icons/otris16x16.gif"/></td><td>OTRIS</td><td class="last">otris16x16.gif</td></tr>
			<tr><td><img src="icons/page.gif"/></td><td>PAGE</td><td class="last">page.gif</td></tr>
			<tr><td><img src="icons/paste.gif"/></td><td>PASTE</td><td class="last">paste.gif</td></tr>
			<tr><td><img src="icons/previous.gif"/></td><td>PREVIOUS</td><td class="last">previous.gif</td></tr>
			<tr><td><img src="icons/print.gif"/></td><td>PRINT</td><td class="last">print.gif</td></tr>
			<tr><td><img src="icons/prop.gif"/></td><td>PROP</td><td class="last">prop.gif</td></tr>
			<tr><td><img src="icons/save.gif"/></td><td>SAVE</td><td class="last">save.gif</td></tr>
			<tr><td><img src="icons/select.gif"/></td><td>SELECT</td><td class="last">select.gif</td></tr>
			<tr><td><img src="icons/switchToEdit.png"/></td><td>SWITCH_TO_EDIT</td><td class="last">switchToEdit.png</td></tr>
			<tr><td><img src="icons/cancelEdit.png"/></td><td>LEAVE_EDIT</td><td class="last">cancelEdit.png</td></tr>
			<tr><td><img src="icons/saveEdit.png"/></td><td>APPLY_EDIT</td><td class="last">saveEdit.png</td></tr>
			<tr><td><img src="icons/exit.gif"/></td><td>CANCEL_EDIT</td><td class="last">exit.gif</td></tr>
			<tr><td><img src="icons/gear_run.png"/></td><td>LIVE_VIEW</td><td class="last">gear_run.png</td></tr>
			<tr><td><img src="icons/gear_stop.png"/></td><td>LIVE_VIEW_RUNNING</td><td class="last">gear_stop.png</td></tr>
			<tr><td><img src="icons/gear_warning.png"/></td><td>LIVE_VIEW_ERROR</td><td class="last">gear_warning.png</td></tr>
			<tr><td><img src="icons/media_play_green.png"/></td><td>PLAY</td><td class="last">media_play_green.png</td></tr>
			<tr><td><img src="icons/media_pause.png"/></td><td>PAUSE</td><td class="last">media_pause.png</td></tr>
			<tr><td><img src="icons/media_stop_red.png"/></td><td>STOP</td><td class="last">media_stop_red.png</td></tr>
			<tr><td><img src="icons/media_beginning.png"/></td><td>TO_BEGINNING</td><td class="last">media_beginning.png</td></tr>
			<tr><td><img src="icons/zoom_in.png"/></td><td>ZOOM_IN</td><td class="last">zoom_in.png</td></tr>
			<tr><td><img src="icons/zoom_out.png"/></td><td>ZOOM_OUT</td><td class="last">zoom_out.png</td></tr>
			<tr><td><img src="icons/colwidth.gif"/></td><td>AUTOSIZE_COLS</td><td class="last">colwidth.gif</td></tr>
		</tbody>
	 </table>
	 * @param {string} resId Die Ressourcen-Kennung.
	 * @param {boolean} isSmall Gibt an, ob das Bild in der kleinen (ca. 16x16 Pixel)
	 * Variante ermittelt werden soll. Dies ist der Standardwert.
	 * @return {string} Der Dateiname, oder, falls unbekannt, ein leerer String.
	 */
	getImageByResId : function(resId, isSmall)
	{
		// falls ein Punkt im Key steht, scheint es sich bereits um
		// einen Dateinamen zu handeln; damit unterstuetzen wir
		// das alte Verhalten
		if(typeof resId == "string" && resId.indexOf('.') >= 0)
			return resId; 
		if(isSmall != undefined && isSmall === false)
		{
			if(this._bigIcons[resId])
				return this._bigIcons[resId];
		}
		if(this._smallIcons[resId])
			return this._smallIcons[resId];
		return PDMeta.getIcon(resId);
	},
	
	/**
	 * Ermittelt zu einer Fachkonzeptklasse das im Modell
	 * spezifizierte Icon.
	 * @param {string} classname Der Name der Fachkonzeptklasse.
	 * @param {boolean} objectImg Zeigt an, ob das Objekt- oder
	 * das Folder-/Klassen-Icon ermittelt werden soll.
	 * Standardwert ist <code>false</code>, d.h. es wird das
	 * Klassen-Icon ermittelt.
	 */
	getImageName : function(classname, objectImg)
	{
		var id = (true === objectImg ? "ICI_" : "IFI_");
		id += classname;
		return id;
	},
	
	/**
	 * Eine Abbildungsdatei registrieren.<br/>
	 * <span class="important">Hinweis:</span> Ein bereits unter der selben
	 * Kennung vorhandener Bildeintrag wird ggf. überschrieben.
	 * @param {string} filename Dateiname der Abbildung (ohne Pfad!).
	 * @param {string} resId Die Ressourcen-Kennung, unter der das Bild registriert
	 * werden soll. Unter dieser Kennung kann das Bild mit
	 * [getImageByResId()]{@link UIApplication#getImageByResId} wieder
	 * abgefragt werden.
	 * @param {boolean} isSmall Gibt an, ob das Bild in der kleinen (ca. 16x16 Pixel)
	 * Variante vorliegt.
	 */
	addImageResource : function(filename, resId, isSmall)
	{
		if(isSmall != undefined && isSmall === false)
			this._bigIcons[resId] = filename;
		else
			this._smallIcons[resId] = filename;
	},
	
	_bigIcons : {
		OTRIS: "otris32x32.gif"
	},
	
	/*
	 * @memberof UIApplication
	 * @desc Die vordefinierten Icons in der Größe 16 x 16 Pixel.
	 * @see [UIApplication.getImageByResId]{@link UIApplication#getImageByResId}
	 * und [UIApplication.addImageResource]{@link UIApplication#addImageResource}.
	 */
	_smallIcons : {
		OPEN: "open.gif",
		DIALOG_N: "dialog_n.gif",
		DEL: "del_02.gif",
		LISTE: "liste.gif",
		DISCON: "discon.gif",
		ATTRIB: "attrib.gif",
		FILT_USE: "filter.gif",
		REFRESH: "refresh.gif",
		DIALOG: "dialog.gif",
		D_NEW: "d_new.gif",
		A_Z: "a_z.gif",
		A_DOWN: "a_down.gif",
		A_PREVIOUS: "a_previous.gif",
		A_NEXT: "a_next.gif",
		A_UP: "a_up.gif",
		ABORT: "abort.gif",
		BOOL_TRUE: "boolTrue.gif",
		BOOL_FALSE: "boolFalse.gif",
		BUSINESSMAN: "businessman.gif",
		BUSINESSMEN: "businessmen.gif",
		CONNECT: "connect.gif",
		COPY: "copy.gif",
		CUT: "cut.gif",
		DELETE: "delete.gif",
		DISK_BLUE: "disk_blue.png",
		DISKS: "disks.png",
		DOCUMENT_EDIT: "document_edit.gif",
		DOCUMENT_EDIT: "document_plain.gif",
		DOCUMENT_VIEW: "document_view.gif",
		DOWN: "down.gif",
		DOWN1: "down1.gif",
		EARTH: "earth.gif",
		EXIT: "exit.gif",
		FAVORITES: "favorites.gif",
		FOLDER: "Folder.gif",
		FOLDER_CLOSED: "folder_closed.gif",
		GEAR: "gear.gif",
		HAMMER: "hammer.gif",
		HOME: "home.gif",
		INFO: "info.gif",
		LETTER: "letter.gif",
		LOADING1: "loading1.gif",
		MESSAGE: "message.gif",
		MESSAGES: "messages.gif",
		MULTILANG: "multilang.gif",
		NEXT: "next.gif",
		NODE_COLL: "nodeColl.gif",
		NODE_EXP: "nodeExp.gif",
		OTRIS: "otris16x16.gif",
		PAGE: "page.gif",
		PASTE: "paste.gif",
		PREVIOUS: "previous.gif",
		PRINT: "print.gif",
		PROP: "prop.gif",
		SAVE: "save.gif",
		SELECT: "select.gif",
		// fuer TwoState-Dialoge
		SWITCH_TO_EDIT: "switchToEdit.png",
		LEAVE_EDIT: "cancelEdit.png",
		APPLY_EDIT: "saveEdit.png",
		CANCEL_EDIT: "exit.gif",
		REFRESH: "refresh.gif",
		LIVE_VIEW: "gear_run.png",
		LIVE_VIEW_RUNNING: "gear_stop.png",
		LIVE_VIEW_ERROR: "gear_warning.png",
		PLAY: "media_play_green.png",
		PAUSE: "media_pause.png",
		STOP: "media_stop_red.png",
		TO_BEGINNING: "media_beginning.png",
		ZOOM_IN: "zoom_in.png",
		ZOOM_OUT: "zoom_out.png",
		AUTOSIZE_COLS: "colwidth.gif"
	},
	
	/*UserTransactionCache : {
		add : function(tr)
		{
			
		},
		
		Delete : function()
		{
		},
		
		remove : function(tr)
		{
		},
		
		get : function(transId)
		{
		},
		
		_transactions : { }
	},
	
	TransObjectCache : {

	},*/
	
	// Informationen ueber die Client-Umgebung abfragen
	/*
	 *
	 */
	isIE : function() {
			return Ext.isIE;
		},
	
	/*
	 *
	 */
	isGecko : function() {
			return Ext.isGecko;
		},
	
	/*
	 *
	 */
	isChrome : function() {
			return Ext.isChrome;
		},
	
	/*
	 *
	 */
	isWebKit : function() {
			return Ext.isWebKit;
		},
	
	/*
	 *
	 */
	isSafari : function() {
			return Ext.isSafari;
		},
	
	/*
	 *
	 */
	hasTouchEvents : function() {
			// Touch devices koennen aus dem Browser nicht
			// zuverlaessig detektiert werden, sondern nur
			// Touch events! - Siehe Diskussion in
			// http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
			return Modernizr.touchevents;
			//return ('ontouchstart' in window);
		}
};
