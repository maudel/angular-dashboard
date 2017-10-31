//> PDProperties in separate Datei, weil sie - falls lokal gespeichert werden soll - auch ohne PD nutzbar sind.

// globale Funktionen:
/**
 * Wandelt einen OID-String in den numerischen Wert
 * des unteren OID-Teils, also in den des Objekt-Anteils,
 * um.
 * @param {string} oidstr Die String-Repräsentation der
 * vollständigen OID in der Form <code>xxx:yyyy</code>
 * oder <code>xxx_yyyy</code>, also oberer und unterer 
 * Teil durch Doppelpunkt oder Unterstrich getrennt.
 * @return {number} Die Objekt-ID. Falls ein Fehler auftritt,
 * wird <code>0</code> zurückgegeben. Falls kein OID-Trenner
 * in dem übergebenen String vorkommt, wird der Wert als
 * der untere Teil der OID angenommen und numerisch 
 * zurückgegeben.
 */
function OID_LO(oidstr)
{
	if(typeof oidstr == "number")
		return oidstr;
	oidstr = (oidstr || '');
	var pos = oidstr.search(/[:_]/);
	if(pos >= 0)
		oidstr = oidstr.substr(pos+1);
	var tmp = parseInt(oidstr, 10);
	if(isNaN(tmp))
		return 0;
	return tmp;
}

/**
 * Wandelt einen OID-String in den numerischen Wert
 * des oberen OID-Teils, also in die Klassen-ID um.
 * @param {string} oidstr Die String-Repräsentation der
 * vollständigen OID in der Form <code>xxx:yyyy</code>
 * oder <code>xxx_yyyy</code>, also oberer und unterer 
 * Teil durch Doppelpunkt oder Unterstrich getrennt.
 * @return {number} Die Klassen-ID. Falls ein Fehler auftritt,
 * wird <code>0</code> zurückgegeben.
 */
function OID_HI(oidstr)
{
	if(/[:_]/.test(oidstr)==false)
		return 0;
	var tmp = parseInt(oidstr, 10);
	if(isNaN(tmp))
		return 0;
	return tmp;
}

/**
 * Wandelt den oberen und den unteren Teil der
 * Objekt-ID (OID) in eine Zeichenkette um.
 * Dabei wird der Doppelpunkt als Trenner zwischen
 * den Teilen benutzt.<br>
 * Die Parameter können auch als Zeichenketten
 * übergeben werden. In dem Fall wird versucht, sie 
 * in Zahlen zu konvertieren.
 * @param {number} cid Der obere Teil der OID, also die
 * Klassen-ID.
 * @param {number} oid Der untere Teil der OID, also die
 * eigentliche Objekt-ID.
 * @return {string} OID-String in der Form 
 * <code>xxx:yyyy</code>. Im Fehlerfall wird eine 
 * leere Zeichenkette zurückgegeben.
 */
function OID_STRING(cid, oid)
{
	if(!oid)
		return "";
	if(typeof cid == "string")
		cid = parseInt(cid, 10);
	if(isNaN(cid)==true)
		return "";
	if(typeof oid == "string")
		oid = parseInt(oid, 10);
	if(isNaN(oid)==true)
		return "";
	return ""+cid+":"+oid;
}

var PDException = Class.create();
/**
 * @class PDException
 * @desc Kapselt eine Ausnahme in der Kommunikation mit dem Fachkonzept.
 * Die Klasse redefiniert <code>toString</code>, so dass sich die
 * Fehlerbeschreibung einfach an einen String anhängen lässt.
 * @author Frank Fiolka
 */
PDException.prototype =
{
	// Kennungen für den Level
	/**
	@memberof PDException
	@const {number} Level.
	 */
	UNKNOWN: 0,
	/**
	@memberof PDException
	@const {number} Level.
	 */
	INFO: 1,
	/**
	@memberof PDException
	@const {number} Level.
	 */
	WARN: 2,
	/**
	@memberof PDException
	@const {number} Level.
	 */
	ERROR: 3,
	/**
	@memberof PDException
	@const {number} Level.
	 */
	FATAL: 4,
	
	// Konstanten für den Ausnahmetyp
	/**
	@memberof PDException
	@const {number} Ausnahmetyp.
	 */
	UNSPECIFIED_ERROR: 10,
	/**
	@memberof PDException
	@const {number} Ausnahmetyp.
	 */
	SYSTEM_ERROR: 11,
	/**
	@memberof PDException
	@const {number} Ausnahmetyp.
	 */
	NETWORK_ERROR: 12,
	/**
	@memberof PDException
	@const {number} Ausnahmetyp.
	 */
	NOT_IMPLEMENTED_EXCEPTION: 13,

	_level: 0,
	_type: 0,
	_msg: '',
	_details: '',
	
	/**
	@constructs PDException
	@desc Erzeugt das Ausnahmeobjekt.
	@param {number} [level=PDException.UNKNOWN] Wichtigkeit der Ausnahme.
	Erwartet wird eine der in dieser Klasse definierten Konstanten.
	@param {number} [type=0] Typ der Ausnahme. Eine der
	in dieser Klasse definierten Konstanten.
	@param {string} message Meldung oder Kurzbeschreibung.
	@param {string} [details] Details, ausführliche Beschreibung.
	 */
	initialize : function(level, type, message, details)
	{
		this._level = 0;
		this._type = 0;
		this._msg = '';
		this._details = '';
		var pos = 0;
		if(arguments.length > pos && (typeof arguments[pos] == 'number'))
			this._level = arguments[pos++];
		if(arguments.length > pos && (typeof arguments[pos] == 'number'))
			this._type = arguments[pos++];
		if(arguments.length > pos)
			this._msg = arguments[pos++];
		if(arguments.length > pos && arguments[pos])
			this._details = arguments[pos++];
	},
	
	/**
	@memberof PDException
	@function toString
	@desc Gibt die Exception nach String aus.
	@return {string}
	 */
	toString : function()
	{
		// TODO: Sprache beruecksichtigen
		var s = '';
		switch(this._type)
		{
			case PDException.SYSTEM_ERROR:
				s += "System error";
				break;
			case PDException.NETWORK_ERROR:
				s += "Network error";
				break;
			case PDException.NOT_IMPLEMENTED_EXCEPTION:
				s += "Not implemented";
				break;
			default:
			{
				switch(this._level)
				{
					case PDException.INFO:
						s += "Info";
						break;
					case PDException.WARN:
						s += "Warning";
						break;
					case PDException.ERROR:
						s += "Error";
						break;
					case PDException.Fatal:
						s += "Fatal";
						break;
				}
			}
		}
		if(s)
			s += ": ";
		s += this._msg;
		// TODO: nur in Debug-Version ausgeben:
		if(this._details)
			s += '\n' + this._details;
		return s;
	}
}
PDException.UNSPECIFIED_ERROR = 10;
PDException.SYSTEM_ERROR = 11;
PDException.NETWORK_ERROR = 12;
PDException.NOT_IMPLEMENTED_EXCEPTION = 13;
PDException.UNKNOWN = 0;
PDException.INFO = 1;
PDException.WARN = 2;
PDException.ERROR = 3;
PDException.FATAL = 4;


/**
 * @enum PDObjectFlags
 * @desc Flags für Zugriff auf {@link PDObject}-Attribute.
 */
var PDObjectFlags =
{
	// zu den Werten der folgenden Konstanten vgl. JANUS/include/pdo_remt.h
	/**
	@desc Das Attribut existiert. Das Flag ist immer gesetzt,
	sofern ein gültiges Attribut gelesen wurde.
	@const {number}
	 */
	Available : 0x0001,
	/**
	@desc Es handelt sich um ein Schlüsselattribut.
	@const {number}
	 */
	Key : 0x0002,
	/**
	@desc Es handelt sich um ein Muss-Attribut.
	@const {number}
	 */
	Mandatory : 0x0004,
	/**
	@desc Das Attribut darf nur gelesen werden. Grundsätzlich 
	sind Schreibzugriffe aber erlaubt, wenn zusätzlich noch 
	<code>GUIReadOnly</code> zurückgegeben wird.
	@const {number}
	 */
	ReadOnly : 0x0008,
	/**
	@desc Der aktuelle Benutzer hat keine Leserechte.
	@const {number}
	 */
	NoReadPermission : 0x0010,
	/**
	@desc Der aktuelle Benutzer hat keine Schreibrechte.
	@const {number}
	 */
	NoWritePermission : 0x0020,  
	/**
	@desc Gibt es für dieses Attribut einen Standardwert, der 
	sich ändern kann, z.B. weil er der Wert eines anderen 
	Attributes ist?
	@const {number}
	 */
	DynamicDefault : 0x0080,
	/**
	@desc Das Objekt zu diesem Attribut ist neu erzeugt.
	@const {number}
	 */
	NewObject : 0x0100,
	/**
	@desc Das Attribut kann für verschiedene Sprachen unterschiedliche Werte haben.
	@const {number}
	 */
	Multilingual : 0x0200,
	/**
	@desc Das Attribut ist ein Fremdschlüssel zu einer anderen Klasse.
	@const {number}
	 */
	ForeignKey : 0x0400,
	/**
	@desc Es sollte ein Attribut über eine Beziehung gelesen werden, der 
	kein Objekt zugeordnet ist.
	@const {number}
	 */
	RelationNotSet : 0x0800,
	/**
	@desc Das Attribut ist abgeleitet und überschreibbar. Der zurückgegebene 
	Wert ist manuell eingegeben und nicht berechnet.
	@const {number}
	 */
	Overwritten : 0x1000,
	/**
	@desc Das Attribut ist abgeleitet und überschreibbar. Der zurückgegebene 
	Wert ist berechnet.
	@const {number}
	 */
	NotOverwritten : 0x2000,
	/**
	@desc Der Attributwert ist UTF-8-kodiert.
	@const {number}
	 */
	Utf8Encoded : 0x4000,
	/**
	@desc Das Attribut ist als GUI-ReadOnly (nur lesbar auf der Benutzungsoberfläche) 
	modelliert. Schreibzugriffe sind aber grundsätzlich möglich.<br>
	Wenn dieses Flag gesetzt ist, ist immer auch ReadOnly gesetzt.
	@const {number}
	 */
	GUIReadOnly : 0x8000
}

var PDObject = Class.create();
/**
 * @class PDObject
 * @desc Browser-seitige Repräsentation der Klasse
 * <code>PDObject</code> (Basisklasse aller generierten
 * Fachkonzeptklassen). Im Unterschied zum JANUS-Server
 * arbeitet das JafWeb nicht mit generierten Klassen,
 * sondern - wie der GUI-Client - mit der Basisklasse
 * <code>PDObject</code>. Die Zugriffe auf das Fachkonzept
 * müssen daher immer die generischen Funktionen verwenden:
 * [getAttribute()]{@link PDObject#getAttribute},
 * [setAttribute()]{@link PDObject#setAttribute},
 * [connect()]{@link PDObject#connect},
 * [disconnect()]{@link PDObject#disconnect},
 * [getFirstLink()]{@link PDObject#getFirstLink} und
 * [callOperation()]{@link PDObject#callOperation}.
 * @author Frank Fiolka
 */
PDObject.prototype = 
{
	// Benoetigt ein konkretes PDObject Informationen aus
	// der generierten konkreten Klasse??? - Wie werden
	// z.B. Attribute und Beziehungen unterschieden?
	// Woher kommt die Information ?ie Attributtypen? 
	
	// ACHTUNG: hier nicht unbedacht irgendwelche Member
	// einbauen! Die tauchen sonst, wenn sie nicht ausdruecklich
	// ausgenommen werden, auch in dem an den Server geposteten
	// PDObject auf!
	
	// Fehler-Code der zuletzt aufgerufenen Funktion
	/**
	@desc Rückgabe-Code der zuletzt aufgerufenen Funktion.
	@const {number}
	 */
	retcode : 1,
	/*
	Rückgabemeldung der zuletzt aufgerufenen Funktion.
	@tattr String
	 */
	_lastMsg : "",
		
	// spezielle oeffentliche Member (wie in Teil 2 dokumentiert)
	oid : "",
	oidLow : 0,
	oidHi : 0,
	cid : 0,
	pid: undefined, // nur, wenn PrincipalCapability
	classname : "",
	// neu, wenn keine MD5 angegeben?
	_isnew : true,
	_modified : false,
	_isTrans : false,
	_tid : 0, // Transaktions-ID
	_realOidLow : 0,
	_lockid : -1,
	_md5 : "",
	_allowEdit : true,
	_allowDelete : true,
	_deleted : false,
	_depDelete : [ ],
	_connected : false,
	_disconnected : false,
	_statusCache : { },
	_evtHandler : null,
			
	/*
	@ignore(true)
	@constructs PDObject
	@desc <span class="important">Hinweis:</span> Diesen Konstruktor
	sollten Sie nie direkt aufrufen! Die <code>PDObject</code>s
	werden stattdessen immer über die Funktionen der Fachkonzeptschicht
	geholt (z.B. {@link PDClass#ptr}).
	@param {string} clname Der Name der Fachkonzeptklasse.
	@param {number} oid Falls es sich nicht um eine Neuanlage
	handelt, muss hier der untere Teil der OID
	übergeben werden (des <i>Real Object</i>).
	Statt der Parameter kann auch ein assoziatives Array
	mit Attributname-Wert-Paaren und Beziehungsname-Objekt-Paaren
	übergeben werden. Das <code>PDObject</code> wird dann aus
	den übergebenen Daten initialisiert. Diese Variante wird
	hauptsächlich intern benutzt.
	 */
	initialize : function(pdClass, clname, oid)
	{
		this.PDClass = pdClass;
		// das PDObject aus JSON-Daten erstellen
		this._statusCache = {};
		if(typeof clname == "object")
		{
			this._setValues(clname);
		}
		else
		{
			if(typeof clname == "string")
			{
				this.cid = this.PDClass.PDMeta.getId(clname);
				this.classname = clname;
			}
			else if(typeof clname == "number")
			{
				this.cid = clname;
				this.classname = this.PDClass.PDMeta.getClass(clname);
			}
			if(oid && typeof oid == "string")
			{
				this.oid = oid;
				this.oidHi = OID_HI(oid);
				this.oidLow = OID_LO(oid);
			}
			else if(oid && typeof oid == number)
			{
				this.oidHi = this.cid;
				this.oidLow = oid;
				this.oid = OID_STRING(this.oidHi, this.oidLow);
			}
		}
	},
	
	// Events zur Aenderungsueberwachung
	/**
	 * @memberof PDObject
	 * @function addEventHandler
	 * @desc Eine Handler-Funktion an das Objekt binden, um über
	 * Änderungen benachrichtigt zu werden. Damit lässt sich auf einfache
	 * Weise eine Änderungsüberwachung einzelner oder auch aller
	 * Fachkonzept-Objekte herstellen.
	 * Beispielsweise können Sie beim Start Ihres Web Clients
	 * das Objekt des angemeldeten Benutzer holen und diesem einen
	 * Handler für Änderungen hinzufügen. Sobald nun von irgendeiner
	 * Stelle im Web Client aus das fachliche Objekt (nicht nur die
	 * lokale Instanz) geändert wird, erfolgt automatisch die
	 * Ausführung der Handler-Funktion.<br/>
	 * Beachten Sie bitte, dass die Handler-Funktion nicht unmittelbar bei
	 * einer Änderung des Server-seitigen Objekts (z.B. durch einen konkurrierenden
	 * Benutzer) aufgerufen wird, sondern erst bei der nächsten Aktualisierung des
	 * Objekts auf dem Client bzw. bei direkten Änderungen im Client. Um auch die
	 * Server-seitigen Änderungen zu überwachen und unmittelbar zu melden, würde
	 * ein Rückkanal vom Server (z.B. via "Slow load" oder WebSocket) benötigt, der
	 * aber derzeit von der SoapWebApp noch nicht unterstützt wird.<br/>
	 * Mit [unregisterOnChangeHandler()]{@link PDObject#unregisterOnChangeHandler}
	 * lassen sich hinzugefügte Handler wieder entfernen.
	 * @param {string} type Art des Ereignisses. Folgende Werte sind
	 * möglich:
	 * <ul>
	 *  <li>"changed": Ein {@link PDObject} wurde geändert.</li>
	 *  <li>"created": Ein {@link PDObject} wurde fachlich neu
	 *  angelegt (vgl. [PDClass.newObject()]{@link PDClass#newObject}).</li>
	 *  <li>"delete": Ein {@link PDObject} soll fachlich gelöscht werden
	 *  (vgl. [PDClass.deleteObject()]{@link PDClass#deleteObject}).</li>
	 * </ul>
	 * @param {Function} handler Die Handler-Funktion. Je nach Ereignistyp enthält
	 * das beim Aufruf an diese Funktion übergebene JavaScript-Objekt unterschiedliche
	 * Properties:
	 * <ul>
	 *  <li>"changed":
	 * 		<ul>
	 * 			<li><code>object</code>: Das geänderte {@link PDObject}.</li>
	 * 			<li><code>member</code>: Das geänderte Element (Attribut oder Beziehung).</li>
	 * 			<li><code>oldValue</code>: Der alte Wert (optional).</li>
	 * 			<li><code>newValue</code>: Der neue Wert (optional).</li>
	 * 		</ul>
	 *  </li>
	 *  <li>"created":
	 * 		<ul>
	 * 			<li><code>object</code>: Das neu angelegte {@link PDObject}.</li>
	 * 		</ul>
	 *  </li>
	 *  <li>"delete":
	 * 		<ul>
	 * 			<li><code>object</code>: Das zu löschende {@link PDObject}.</li>
	 * 		</ul>
	 *  </li>
	 * </ul>
	 * @example
var userObject = ClientInfo.getUserObject();
if(userObject)
{
	userObject.addEventHandler('changed', function(data) {
			UIMessage.ok("Attr. " + data.elem + " of user object changed!");
		});
}
	 */
	addEventHandler : function(type, handler) {
		if(!this._evtHandler)
			this._evtHandler = {};
		if(!this._evtHandler[type])
			this._evtHandler[type] = [];
		this._evtHandler[type].push(handler);
	},
	
	/**
	 * @memberof PDObject
	 * @function removeEventHandler
	 * @desc Eine registrierte Handler-Funktion entfernen.
	 * @param {string} type Art des Ereignisses. Zu den
	 * möglichen Werten vgl.
	 * [addObjectEventHandler()]{@link PDClass#addObjectEventHandler}.
	 * @param {Function} [handler] Die zu entfernende
	 * Handler-Funktion. Wird diese nicht angegeben,
	 * werden alle registrierten Handler des angegebenen
	 * Typs entfernt!
	 */
	removeEventHandler : function(type, handler) {
		if(!this._evtHandler || !this._evtHandler[type])
			return;
		if(!handler)
		{
			this._evtHandler[type] = [];
			return;
		}
		var i = 0;
		while(i < this._evtHandler[type].length)
		{
			if(this._evtHandler[type][i] == handler)
				this._evtHandler[type].splice(i, 1);
			else
				i++;
		}
	},
	
	/**
	 * @memberof PDObject
	 * @function dispatchEvent
	 * @desc Verteilt Ereignisse an registrierte Handler.
	 * @param {string} type Art des Ereignisses. Zu den
	 * möglichen Werten vgl.
	 * [addObjectEventHandler()]{@link PDClass#addObjectEventHandler}.
	 * @param {Object} data An das Event zu übegebende Daten
	 * (ereignistyp-abhängig).
	 */
	dispatchEvent : function(type, data)
	{
		if(this._evtHandler && this._evtHandler[type])
		{
			for(var i = 0; i < this._evtHandler[type].length; i++)
			{
				try
				{
					this._evtHandler[type][i](data);
				}
				catch(ex)
				{
					JDebug.log(JDebug.WARN, "" + type + " event handler of PDObject " +
							this.classname + ":" + this.GetPDObjectIdLow() +
							" throwed an exception: " + ex);
				}
			}
		}
	},
	
	/*
	 * @ignore(true)
	 */
	handleChanged : function(member, oldValue, newValue) {
		//console.log("##1# PDObject[" + this.classname + ":" + this.GetPDObjectIdLow() +
		//		"].handleChanged('" + member + "')");
		var data = {
				'object': this,
				'member': member,
				'oldValue': oldValue,
				'newValue': newValue
			};
		this.dispatchEvent('changed', data);
		if(!!this.PDClass)
			this.PDClass.dispatchEvent('changed', data);
		else
			JDebug.log(JDebug.WARN, "PDObject.handleChanged(): PDClass not set!");
	},
	
	/**
	@memberof PDObject
	@function Delete
	@desc Destruktorfunktion.
	 */
	Delete : function()
	{
		if(!!this.PDClass)
			this.PDClass.handleObjectDelete(this.cid, this.oidLow);
		// Properties loeschen
		for(var sProp in this)
			this[sProp] = null;
	},
	
	/**
	@memberof PDObject
	@function editAllowed
	@desc Gibt zurück, ob der Benutzer das Objekt bearbeiten
	darf.<br/>
	<span class="important">Hinweis:</span> Beachten Sie bitte, dass das hier zurückgegebene Flag
	den Zustand beim Holen des Objekts vom Server widerspiegelt.
	Es ist möglich, dass der Server (dessen Berechtigungsprüfung
	immer gewinnt) das Recht verweigert, obwohl hier noch
	<code>true</code> zurückgegeben wird.
	@return {boolean} <code>true</code>, falls er das Recht zum
	Bearbeiten hat, sonst <code>false</code>.
	 */
	editAllowed : function()
	{ return (this._allowEdit === true); },
	
	/**
	@memberof PDObject
	@function deleteAllowed
	@desc Gibt zurück, ob der Benutzer das Objekt löschen darf.
	<span class="important">Hinweis:</span> Beachten Sie bitte, dass das hier zurückgegebene Flag
	den Zustand beim Holen des Objekts vom Server widerspiegelt.
	Es ist möglich, dass der Server (dessen Berechtigungsprüfung
	immer gewinnt) das Recht verweigert, obwohl hier noch
	<code>true</code> zurückgegeben wird.
	@return {boolean} <code>true</code>, falls er das Recht zum
	Löschen hat, sonst <code>false</code>.
	 */
	deleteAllowed : function()
	{ return (this._allowDelete === true); },
	
	/**
	@memberof PDObject
	@function getReturnCode
	@desc Gibt den Rückgabe-Code der zuletzt aufgerufenen Funktion
	zurück.
	@return {number} Der Code.
	*/
	getReturnCode : function()
	{ return this.retcode; },
	
	/**
	@memberof PDObject
	@function getLastMessage
	@desc Gibt die zuletzt gespeicherte Fehlermeldung zurück.
	@return {string} Der Fehlertext.
	*/
	getLastMessage : function()
	{ return this._lastMsg; },
	
	/**
	@memberof PDObject
	@function toString
	@desc String-Repräsentation des Objekts ausgeben.
	@return {string}
	 */
	toString : function()
	{ return this.objectToString(false); },

	/**
	@memberof PDObject
	@function objectToString
	@desc Gibt das Objekt mit seinen Attributen und Werten als
	String zurück. Auf diese Weise können vollständige,
	Client-seitige Fachkonzeptobjekte an oder auch durch 
	den Server gereicht werden.<br>
	Nützlich ist diese Funktion auch für Debug-Zwecke.
	@param {boolean} [recursive=false] Zeigt an, ob das Objekt rekursiv,
	d.h. mit den über seine Beziehungen verbundenen Objekten
	ausgegeben werden soll.
	@return {string} JSON-String, der das Objekt mit
	allen seinen Attributen wiedergibt.
	 */
	objectToString : function(recursive)
	{
		this.retcode = 0;
		return this._getValues(false, [], (true === recursive));
	},

	/**
	@memberof PDObject
	@function isNewTrans
	@desc Gibt zurück, ob sich das Objekt im Neuanlagemodus
	befindet, es also noch keine Entsprechung auf der
	Server-Seite und in der Datenbank hat.
	@return {boolean} Neu oder nicht.
	 */
	isNewTrans : function()
	{
		this.retcode = 0;
		return this._isnew;
	},
	
	/**
	@memberof PDObject
	@function isTrans
	@desc Fragt ab, ob das Objekt ein Transaktionsobjekt ist.
	@return {boolean} <code>true</code>, wenn es sich um ein
	Transaktionsobjekt handelt, <code>false</code> bei einem
	Datenbankobjekt.
	 */
	isTrans : function()
	{
		this.retcode = 0;
		return this._isTrans;
	},
	
	/**
	@memberof PDObject
	@function getTransactionId
	@desc Die Transaktions-ID abfragen.
	@return {number} Die Id.
	 */
	getTransactionId : function()
	{
		this.retcode = 0;
		return this._tid;
	},
	
	/**
	@memberof PDObject
	@function isModified
	@desc Gibt zurück, ob das Objekt lokal modifiziert wurde.
	@return {boolean} Das Objekt wurde modifiziert (<code>true</code>)
	oder nicht.
	 */
	isModified : function()
	{
		this.retcode = 0;
		return this._modified;
	},
	
	/**
	@memberof PDObject
	@function GetClass
	@desc Den Namen der Fachkonzeptklasse zurückgeben.
	@return {string} Technischer Name der Klasse.
	 */
	GetClass : function()
	{
		this.retcode = 0;
		return this.classname;
	},

	/**
	@memberof PDObject
	@function GetId
	@desc Kennung der Fachkonzeptklasse zurückgeben.
	@return {number} Id der Fachkonzeptklasse.
	 */
	GetId : function()
	{
		this.retcode = 0;
		return this.cid;
	},

	/**
	@memberof PDObject
	@function GetBaseId
	@desc Kennung der Basisklasse zurückgeben.
	@return {number} Id der Basisklasse.
	 */
	GetBaseId : function()
	{
		this.retcode = 0;
		return this.getSuperClass(this.classname);
	},

	/**
	@memberof PDObject
	@function GetPDObjectId
	@desc Kennung des Objekts zurückgeben.
	@return {string} OID des Objekts.
	 */
	GetPDObjectId : function()
	{
		this.retcode = 0;
		return this.oid;
	},

	/**
	@memberof PDObject
	@function GetPDObjectIdLow
	@desc Unteren Teil der Objekt-Id zurückgeben.<br/>
	<span class="important">Hinweis:</span> Statt dieser Funktion können Sie auch das Property
	<code>oidLow</code> abfragen.
	@return {number} Objektteil der OID.
	 */
	GetPDObjectIdLow : function()
	{
		this.retcode = 0;
		return this.oidLow;
	},

	/**
	@memberof PDObject
	@function GetPDObjectIdHi
	@desc Oberen Teil der Objekt-Id zurückgeben, das ist die
	Klassenkennung.<br/>
	<span class="important">Hinweis:</span> Statt dieser Funktion können Sie auch das Property
	<code>oidHi</code> abfragen.
	@return {number} Klassenteil der OID.
	 */
	GetPDObjectIdHi : function()
	{
		this.retcode = 0;
		return this.oidHi;
	},

	/**
	@memberof PDObject
	@function getRealObject
	@desc Gibt, wenn es sich bei dem aktuellen Objekt um ein
	Transaktionsobjekt handelt, das zugehörige Datenbankobjekt
	zurück. Falls es sich um eine Neuanlage handelt, existiert
	das nicht und es wird <code>null</code> zurückgegeben.
	@return {PDObject} Das Datenbankobjekt oder <code>null</code>.
	 */
	getRealObject : function()
	{
		this.retcode = 0;
		if(this._isTrans == false)
			return this;
		if(this._isnew == true)
			return null;
		return this.PDClass.ptr(this.classname, this._realOidLow);
	},

	/**
	@memberof PDObject
	@function GetRealObjectIdLow
	@desc Unteren Teil der Objekt-Id des Datenbankobjekts zu
	einem Transaktionsobjekt zurückgeben.
	@return {number} Objektteil der OID. Falls es sich bei dem
	aktuellen nicht um ein Transaktionsobjekt handelt oder
	dieses im ZUstand Neuanlage ist (also noch kein Datenbankobjekt
	dazu existiert), wird 0 zurückgegeben.
	 */
	GetRealObjectIdLow : function()
	{
		this.retcode = 0;
		return this._realOidLow;
	},
	
	/**
	@memberof PDObject
	@function getPrincipalUid
	@desc Die Mandantenkennung des Objekts zurückgeben, falls die
	Anwendung mandantenfähig ist.
	@return {number} Die Mandanten-Id.
	 */
	getPrincipalUid : function()
	{
		this.retcode = 0;
		return this.pid;
	},
	
	/**
	@memberof PDObject
	@function hasProperty
	@desc Fragt ab, ob das Property mit dem angegebenen Namen
	in diesem Objekt existiert.
	@param {string} name Der Property-Name.
	@return {boolean} <code>true</code>, falls es existiert,
	sonst <code>false</code>.
	 */
	hasProperty : function(name)
	{
		return (typeof this[name] !== 'undefined');
	},

	/// Vergleichsfunktionen
	/**
	@memberof PDObject
	@function isEqual
	@desc Vergleicht das aktuelle mit dem übergebenen
	Fachkonzeptobjekt bezüglich der Schlüsselattribute.
	@param {PDObject} pdo Objekt, mit dem das aktuelle Objekt
	verglichen werden soll.
	@return {boolean} <code>true</code>, wenn die beiden Objekte
	in ihren Schlüsselattributen übereinstimmen. Wenn <code>null</code>
	übergeben wurde, lautet das Ergebnis <code>false</code>.
	*/
	isEqual : function(pdo)
	{
		this.retcode = -1;
		if(!pdo)
			return false;
		// TODO: es fehlt noch die Info, welche die Keys sind (PDMeta)
	},
	
	/**
	@memberof PDObject
	@function isIdentical
	@desc Vergleicht das aktuelle mit dem übergebenen
	Fachkonzeptobjekt bezüglich der OID. Falls es sich bei einem
	der Vergleichsobjekte oder beiden um Transaktionobjekte handelt,
	werden deren Datenbankobjekte für den Vergleich herangezogen.
	@param {PDObject} pdo Objekt, mit dem das aktuelle Objekt
	verglichen werden soll.
	@return {boolean} <code>true</code>, wenn die beiden
	Objekte in ihrer OID übereinstimmen. Wenn <code>null</code>
	übergeben wurde, lautet das Ergebnis <code>false</code>.
	 */
	isIdentical : function(pdo)
	{
		this.retcode = 0;
		if(!pdo)
			return false;
		var obj1 = this;
		var obj2 = pdo;
		if(obj1.isTrans())
			obj1 = obj1.getRealObject();
		if(obj2.isTrans())
			obj2 = obj2.getRealObject();
		return (obj1 && obj2 && obj1.oid == obj2.oid);
	},
	
	/**
	@memberof PDObject
	@function isValid
	@desc Gibt zurück, ob das lokal vorliegende Objekt noch gültig,
	das heißt insbesondere: nicht als gelöscht markiert ist.
	@return {boolean} <code>true</code>, wenn an dem Objekt
	das Gelöscht-Flag gesetzt ist.
	 */
	isValid : function()
	{
		this.retcode = 0;
		return this._deleted;
	},
	
	/**
	@memberof PDObject
	@function isUptodate
	@desc Gibt zurück, ob das Server-seitige Objekt seit der
	Erstellung des lokalen verändert wurde. Das wird
	über den Vergleich der MD5-Summen ermittelt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return Wenn der MD5-Summe des Server-Objekts mit der
	lokal gespeicherten MD5-Summe übereinstimmt, wird
	<code>0</code> zurückgegeben; ebenso, wenn es sich
	um ein neues Objekt handelt, es also noch keine
	Server-seitige Entsprechung besitzt.
	Anderenfalls werden Codes mit folgender Bedeutung
	zurückgegeben:
	 <ul>
		<li><code>1</code>: Das Server-Objekt konnte nicht gefunden werden,
		möglicherweise wurde es zwischenzeitlich gelöscht.</li>
		<li><code>2</code>: Die MD5-Summen weichen voneinader ab, d.h. das
		Objekt ist Server-seitig verändert worden.</li>
		<li><code>-1</code>: Bei der Überprüfung ist ein Fehler aufgetreten.</li>
	 </ul>
	 @throws {PDException}
	 */
	isUptodate : function(callback)
	{
		this.retcode = 0;
		if(this.isNew() == true)
			return 0;
		var pars = new JParamPacker(JafWebAPI.PDObject.isUptodate.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.isUptodate.PAR_md5, this._md5);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.isUptodate(): Params: "+pars.toString());
		var result = -1;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.isUptodate():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.isUptodate()");
					result = resp.getInt(JafWebAPI.PDObject.isUptodate.PROP_res, -1);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDObject
	@function reload
	@desc Lädt das <code>PDObject</code> neu vom Server.
	@param {Mixed} [attrs] Die zu ermittelnden Attribute - entweder eine Liste der
	technischen Attributnamen oder ein boolescher Typ, der anzeigt, ob alle Attribute
	laut Modell (<code>true</code>) oder gar keine Attribute (<code>false</code>)
	ermittelt werden sollen.
	@param {Mixed} [rels] Die zu ermittelnden Beziehungen. Wenn ein boolescher Typ
	angegeben wird, zeigt <code>false</code> an, dass keine Beziehungen geholt werden
	sollen, <code>true</code> dagegen, dass alle Zu-1-Beziehungen laut Modell geholt
	werden sollen. Dabei wird für jede Zu-1-Beziehung das ggf. verknüpfte {@link PDObject}
	mit lediglich dem im Modell spezifizierten Object Ident, jedoch ohne die übrigen
	Attribute geholt. Statt des booleschen Typs kann eine Liste der zu ermittelnden
	Beziehungen angegeben werden. Darin kann jedem technischen Beziehungsnamen, getrennt
	durch Komma, der Template-Ausdruck für die RelationInfo angehängt werden. Das ist
	wichtig, um spätere, vereinzelte [getStatus()]{@link PDObject#getStatus}-Aufrufe
	zu vermeiden.
	@return {PDObject} Gibt das neu geladene Objekt wieder zurück.
	 */
	reload : function(attrs, rels)
	{
		//JDebug.log(JDebug.DEBUG, "PDObject.reload() - PRE: "+inspect(this, true));
		this.retcode = 0;
		var tmpObj = this.PDClass.ptr(this.classname, this.oidLow, /* noCache */ true, attrs, rels);
		if(tmpObj)
			JafWeb.apply(this, tmpObj);
		return this;
	},

	////////////////////////////////////////////////////////////
	/// Funktionen zum Datenabgleich (intern)
	// Initialisiert das PDObject aus dem vom Server geholten
	// und an die Funktion uebergebenen JSON-Objekt.
	_setValues : function(jsonObject)
	{
		if(jsonObject === null)
			return null;
		if(this._inSetValues) // Endlosrekursion verhindern!
			return this;
		this._inSetValues = true;
		if(jsonObject && typeof jsonObject == "object")
		{
			if(!JafWeb.isPDObject(jsonObject))
			{
				this.cid = 0;
				this.oidHi = 0;
				this.oidLow = 0;
				this.classname = "";
				this.oid = "";
				this.pid = undefined;
				this._realOidLow = 0;
			}
			for(var sProperty in jsonObject)
			{
				if(typeof jsonObject[sProperty] == "function")
					continue;
				if(sProperty == "PDClass")
					continue;
				if(sProperty == "_evtHandler" || sProperty == "_inSetValues")
					continue;
				if(sProperty == "oid")
				{
					if(typeof jsonObject.oid == "string")
					{
						this.oid = jsonObject.oid;
						this.oidHi = OID_HI(jsonObject.oid);
						this.oidLow = OID_LO(jsonObject.oid);
					}
					else
						this.oidLow = jsonObject.oid;
				}
				else if(sProperty == "oidHi")
					this.oidHi = jsonObject.oidHi;
				else if(sProperty == "oidLow")
					this.oidLow = jsonObject.oidLow;
				else if(sProperty == "_realOidLow")
					this._realOidLow = jsonObject._realOidLow;
				else if(sProperty == "pid")
					this.pid = jsonObject.pid;
				else if(sProperty == "_tid")
					this._tid = jsonObject._tid;
				else if(sProperty == "classname")
					this.classname = jsonObject.classname;
				else if(sProperty == "cid" && typeof jsonObject.cid == "number")
					this.cid = jsonObject.cid;
				else if(sProperty == "_isnew"
						|| sProperty == "_modified"
						|| sProperty == "_isTrans"
						|| sProperty == "_allowEdit"
						|| sProperty == "_allowDelete"
						|| sProperty == "_deleted"
						|| sProperty == "_connected"
						|| sProperty == "_disconnected")
					//this[sProperty] = (true === jsonObject[sProperty]);
					this[sProperty] = (jsonObject[sProperty] != undefined ? jsonObject[sProperty] : false);
				else if(sProperty == "_statusCache")
				{
					JafWeb.apply(this._statusCache, jsonObject[sProperty]);
					//console.log("### deserialized statusCache: ", this._statusCache);
				}
				else if(jsonObject[sProperty] && typeof jsonObject[sProperty] == "object")
				{
					// Beziehung
					// Zu-1- und Zu-N-Beziehung unterscheiden.
					if(JafWeb.isArray(jsonObject[sProperty]))
					{
						var oldVal = this[sProperty];
						this[sProperty] = new Array();
						for(var i=0; i < jsonObject[sProperty].length; i++)
						{
							var tmpToNObj = new PDObject(this.PDClass, jsonObject[sProperty][i]);
							tmpToNObj._setValues(jsonObject[sProperty][i]);
							this[sProperty].push(tmpToNObj);
						}
						if(oldVal !== undefined &&
								sProperty.substr(0, 4) != '__f_' && sProperty != "_depDelete" &&
								old !== undefined)
							this.handleChanged(sProperty);
					}
					else
					{
						var oldVal = this[sProperty];
						var oldOidLow = (this[sProperty] ? this[sProperty].oidLow : 0);
						this[sProperty] = this.PDClass.toPDObject(jsonObject[sProperty]);
						/*var tmpTo1Obj = new PDObject(this.PDClass, jsonObject[sProperty]);
						tmpTo1Obj._setValues(jsonObject[sProperty]);
						this[sProperty] = tmpTo1Obj;*/
						if(!JafWeb.isPDObject(this[sProperty]))
							JDebug.log(JDebug.WARN, 'PDClass.toPDObject['+sProperty+']: result is not instance of PDObject');
						if(sProperty.substr(0, 4) != '__f_' && sProperty != "_depDelete")
						{
							if(oldVal !== undefined &&
									((this[sProperty] && this[sProperty].oidLow != oldOidLow) ||
									(!this[sProperty] && oldOidLow != 0)))
							{
								//console.log("#### oldVal:", oldVal, "newVal:", this[sProperty]);
								this.handleChanged(sProperty, oldVal, this[sProperty]);
							}
						}
					}
				}
				else
				{
					var old = this[sProperty];
					this[sProperty] = jsonObject[sProperty];
					if(sProperty.substr(0, 4) != '__f_' && sProperty != "_depDelete" &&
							sProperty != "_md5" && sProperty != "_modified" && sProperty != "_ismodified" &&
							old !== undefined && this[sProperty] != old)
						this.handleChanged(sProperty, old, this[sProperty]);
				}
			}
			if(this.cid == 0)
				this.cid = this.PDClass.PDMeta.getId(this.classname);
			else if(this.cid == 0)
				this.classname = this.PDClass.PDMeta.getClass(this.cid);
			this._modified = false;
		}
		else
			JDebug.log(JDebug.WARN, "_setValues(): first Parameter is not a JSON object: "+jsonObject);
		this._inSetValues = false;
		return this;
	},
	
	/**
	@memberof PDObject
	@function getElementFlags
	@desc Gibt die für ein Element des Objekts gesetzten Flags zurück.
	@param {string} elem Der Name des Klassenelements, dessen Flags
	ermittelt werden sollen.
	@return {number} Ein oder mehrere, miteinander durch binäres ODER
	verkettte Werte aus {@link PDObjectsFlags}.
	@example
// Folgender Code ermittelt, ob es sich um ein auf der GUI
// schreibgechütztes Attribut handelt:
if((obj.getElementFlags(attribut) & PDObjectFlags.GUIReadOnly) != 0)
{
...
}
	 */
	getElementFlags : function(elem)
	{
		return (this['__f_'+elem] || 0);
	},
	
	/*
	@ignore(true)
	@memberof PDObject
	@function printFlags
	@desc Gibt die aktuell gesetzten Element-Flags als String aus
	(zu Debug-Zwecken).
	*/
	printFlags : function(attr, flags)
	{
		var fl = (flags || this['__f_'+attr]);
		if(!fl)
			return '0';
		var str = '';
		if(fl & PDObjectFlags.Available)
		{
			if(str) str += '|';
			str += 'Available';
		}
		if(fl & PDObjectFlags.Key)
		{
			if(str) str += '|';
			str += 'Key';
		}
		if(fl & PDObjectFlags.Mandatory)
		{
			if(str) str += '|';
			str += 'Mandatory';
		}
		if(fl & PDObjectFlags.ReadOnly)
		{
			if(str) str += '|';
			str += 'ReadOnly';
		}
		if(fl & PDObjectFlags.NoReadPermission)
		{
			if(str) str += '|';
			str += 'NoReadPermission';
		}
		if(fl & PDObjectFlags.NoWritePermission)
		{
			if(str) str += '|';
			str += 'NoWritePermission';
		}
		if(fl & PDObjectFlags.DynamicDefault)
		{
			if(str) str += '|';
			str += 'DynamicDefault';
		}
		if(fl & PDObjectFlags.NewObject)
		{
			if(str) str += '|';
			str += 'NewObject';
		}
		if(fl & PDObjectFlags.Multilingual)
		{
			if(str) str += '|';
			str += 'Multilingual';
		}
		if(fl & PDObjectFlags.ForeignKey)
		{
			if(str) str += '|';
			str += 'ForeignKey';
		}
		if(fl & PDObjectFlags.RelationNotSet)
		{
			if(str) str += '|';
			str += 'RelationNotSet';
		}
		if(fl & PDObjectFlags.Overwritten)
		{
			if(str) str += '|';
			str += 'Overwritten';
		}
		if(fl & PDObjectFlags.NotOverwritten)
		{
			if(str) str += '|';
			str += 'NotOverwritten';
		}
		if(fl & PDObjectFlags.Utf8Encoded)
		{
			if(str) str += '|';
			str += 'Utf8Encoded';
		}
		if(fl & PDObjectFlags.GUIReadOnly)
		{
			if(str) str += '|';
			str += 'GUIReadOnly';
		}
		return str;
	},
	
	/*
	@ignore(true)
	@desc Zur Übertragung an den Server in ein JSON-Objekt
	serialisieren.
	@param {boolean} [inclImpl=false] Implizite Attribute mit ausgeben?
	@param {number[]} [added] Array von Oids (unterer Teil) der Objekte,
	die bereits hinzugefügt wurden. Dient der Rekursionsverhinderung!
	@param {boolean} [recursive=false] Gibt an, ob alle lokal verbundenen
	Objekte rekursiv mit rausgeschrieben werden sollen. Wenn das
	Ursprungsobjekt ein Transaktionsobjekt ist, werden auch nur die
	verbundenen Transaktionsobjekte vollständig mit rausgeschrieben.
	 */
	_getValues : function(inclImpl, added, recursive)
	{
		//DEBJ("PDObject._getValues()["+this._cid+":"+this._oid+"]");
		var noRelAttrs = true; // keine Attribute ueber Beziehungen
		var rec = (recursive === true);
		if(!added)
			added = new Array();
		var jsonStr = "{";
		// TODO: wenn das Objekt als gelöscht markiert ist (this._deleted),
		// muessen ausser cid, oid und dem deleted-Flag keine Werte mehr
		// uebertragen werden.
		// OID zuerst
		jsonStr += "cid:" + this.cid;
		jsonStr += ",classname:\"" + this.classname +"\"";
		jsonStr += ",oidHi:" + this.oidHi;
		jsonStr += ",oidLow:" + this.oidLow;
		jsonStr += ",oid:\"" + this.oid + "\"";
		if(typeof this.pid != 'undefined')
			jsonStr += ",pid:" + this.pid;
		if(this.isTrans())
		{
			jsonStr += ",_realOidLow:" + this._realOidLow;
			jsonStr += ",_tid:" + this._tid;
		}
		// wurde das Objekt bereits rausgeschrieben?
		var exist = false;
		if(added.indexOf(this.oid) >= 0)
			exist = true;
		added.push(this.oid);
		var attr;
		for(attr in this)
		{
			if(typeof attr != 'string')
				continue;
			//implizite weglassen:
			if(!inclImpl || inclImpl == false)
			{
				if(attr == "PDClass" ||
						attr == "_allowDelete" ||
						attr == "_allowEdit" ||
						attr == "_lastMsg" ||
						attr == "retcode" ||
						attr == "_evtHandler")
					continue;
			}
			if((typeof this[attr]) == "function")
				continue;
			if(attr == "classname" || attr == "IDENT" || attr == "_statusCache")
				continue;
			if(attr == "cid" || attr == "oid" || attr == "_tid" || attr == "pid"
					|| attr == "oidHi" || attr == "oidLow" || attr == "_realOidLow")
				continue;
			if(attr.substr(0, 4) == '__f_')
				continue;
			// falls Objekt bereits ausgegeben wurde, nicht erneut 
			// ausgeben (Rekursionsgefahr!)
			if(exist == true)
				continue;
			// abgeleitet-ueberschreibbare und schreibgeschuetzte Attribute
			// gar nicht ausgeben
			if((this['__f_'+attr] & PDObjectFlags.NotOverwritten) != 0
					// || (this['__f_'+attr] & PDObjectFlags.NoWritePermission) != 0 ???
					|| (this['__f_'+attr] & PDObjectFlags.ReadOnly) != 0)
				continue;
			// Ueber Beziehungen referenzierte Attribute nicht ausgeben
			if(noRelAttrs && attr.indexOf('->') >= 0)
				continue;
			// Trenner
			jsonStr += ",";
			if(attr == "_lockid" || attr == "_realOidLow")
				jsonStr += attr + ":" + this[attr];
			else if(attr == "_isnew" ||
					attr == "_modified" ||
					attr == "_ismodified" ||
					attr == "_isTrans" ||
					attr == "_allowEdit" ||
					attr == "_allowDelete" ||
					attr == "_deleted" ||
					attr == "_connected" ||
					attr == "_disconnected")
				jsonStr += attr + ":" + (this[attr] != undefined ? this[attr] : false);
			else if(attr == "_depDelete")
			{
				jsonStr += attr + ":[";
				for(var i=0; i<this._depDelete.length; i++)
				{
					if(i>0) jsonStr += ",";
					jsonStr += "\""+this._depDelete[i]+"\"";
				}
				jsonStr += "]";
			}
			else
			{
				jsonStr += "\"" + attr + "\":" + this._toJson(this[attr], inclImpl, 
											added, rec);
			}
		}
		jsonStr += "}";
		//JDebug.log(JDebug.DEBUG, "PDObject._getValues() - Result: "+jsonStr);
		return jsonStr;
	},

	/*
	@ignore(true)
	@param {mixed} val
	@param {boolean} inclImpl Implizite Attribute mit ausgeben?
	@param {number[]} [added] Array von Oids (unterer Teil) der Objekte,
	die bereits hinzugefügt wurden. Dient der Rekursionsverhinderung!
	@param {boolean} [deep=false] Gibt an, ob alle lokal verbundenen
	Objekte rekursiv mit rausgeschrieben werden sollen. Wenn das
	Ursprungsobjekt ein Transaktionsobjekt ist, werden auch nur die
	verbundenen Transaktionsobjekte vollständig mit rausgeschrieben.
	 */
	_toJson : function(val, inclImpl, added, deep)
	{
		// alle als Strings ausgeben!? Fuer get- und setAttribute() reicht das!
		var jsonStr = "";
		switch(typeof val)
		{
			case "string":
				val = val.replace(/\\/g,'\\\\');
				val = val.replace(/"/g,'\\"');
				val = val.replace(/\n/g,'\\n');
				val = val.replace(/\r/g,'');
				jsonStr += "\"" + val + "\"";
				break;
			case "number":
				jsonStr += "\"" + val + "\"";
				break;
			case "boolean":
				jsonStr += "\"" + (val ? "true" : "false") + "\"";
				break;
			case "object":
				if(val == null)
					jsonStr += "null";
				else if(val instanceof Array)
				{
					// Zu-N-Bez.
					jsonStr += "[";
					for(var i=0; i < val.length; i++)
					{
						//if(!(val[i] instanceof PDObject))
						//	alert("_toJson(): "+val[i]+" is not a PDObject");
						if(i)
							jsonStr += ",";
						if(deep === true && val[i].isTrans && val[i].isTrans()) // nur Transaktionsobjekte komplett!
							jsonStr += val[i]._getValues(inclImpl, added);
						else
						{
							jsonStr += "{";
							jsonStr += "cid:" + val[i].cid;
							jsonStr += ",classname:\"" + val[i].classname + "\"";
							jsonStr += ",oidHi:" + val[i].oidHi;
							jsonStr += ",oidLow:" + val[i].oidLow;
							if(typeof val[i].pid != 'undefined')
								jsonStr += ",pid:" + val[i].pid;
							if(val.isTrans && val[i].isTrans())
							{
								jsonStr += ",_realOidLow:" + val[i]._realOidLow;
								jsonStr += ",_tid:" + val[i]._tid;
							}
							jsonStr += ",_deleted:" + val[i]._deleted;
							jsonStr += ",_connected:" + val[i]._connected;
							jsonStr += ",_disconnected:" + val[i]._disconnected;
							jsonStr += "}";
						}
					}
					jsonStr += "]";
				}
				else
				{
					//if(!(val instanceof PDObject))
					//	alert("_toJson(): "+val+" is not a PDObject");
					// Zu-1-Bez.
					if(deep === true && val.isTrans && val.isTrans()) // nur Transaktionsobjekte komplett!
						jsonStr += val._getValues(inclImpl, added);
					else
					{
						jsonStr += "{";
						jsonStr += "cid:" + val.cid;
						jsonStr += ",classname:\"" + val.classname + "\"";
						jsonStr += ",oidHi:" + val.oidHi;
						jsonStr += ",oidLow:" + val.oidLow;
						if(typeof val.pid != 'undefined')
							jsonStr += ",pid:" + val.pid;
						if(val.isTrans && val.isTrans())
						{
							jsonStr += ",_realOidLow:" + val._realOidLow;
							jsonStr += ",_tid:" + val._tid;
						}
						jsonStr += ",_deleted:" + val._deleted;
						jsonStr += ",_connected:" + val._connected;
						jsonStr += ",_disconnected:" + val._disconnected;
						jsonStr += "}";
					}
				}
				break;
			default:
				jsonStr += "undefined";
		}
		return jsonStr;
	},
	////////////////////////////////////////////////////////////

	/**
	@memberof PDObject
	@function sync
	@desc Die Synchronisierung dieses Objekts mit seiner Entsprechung auf
	der Server-Seite anstoßen.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} <code>true</code>, wenn synchronisiert werden
	konnte, sonst <code>false</code>.
	@throws {PDException}
	 */
	sync : function(callback)
	{
		// TODO: MD5-Kontrolle?
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDObject.sync.eventName, this.PDClass);
		//pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.sync.PAR_clName, this.classname); // sonst klappt MO-Weiche nicht!
		pars.add(JafWebAPI.PDObject.sync.PAR_object, this);
		//JDebug.log(JDebug.DEBUG, "PDObject.sync(): Params: "+pars.toString());
		var result = {};
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.sync():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.sync()");
					//result.transObj = resp.getPDObject('object');
					result.retCode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					this.retcode = result.retCode;
					var tid = resp.getInt(JafWebAPI.PDObject.sync.PROP_tid, -1);
					if(result && tid >= 0)
						result._tid = tid;
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback(result);
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: 'POST',
				async: (!!callback),
				params: pars.getPostParams(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return (result.retCode == 0);
	},
	
	/**
	@memberof PDObject
	@function abortTransaction
	@desc Bricht eine mit [PDClass.startNewTransaction()]{@link PDClass#startNewTransaction} oder
	[PDClass.startTransaction()]{@link PDClass#startTransaction} gestartete Transaktion ab.
	Das erzeugte Transaktionsobjekt wird ohne Änderung des Datenbankobjekts
	verworfen.
	@param {boolean} [newTrans=false] Gibt an, ob die Transaktion erneut gestartet
	werden soll. Dadurch ergibt sich im Dialog die Bedeutung "Zurücksetzen",
	wonach der Dialog geöffnet bleiben und weiter bearbeitet werden kann.
	@param {boolean} [recursive=false] Bestimmt, ob etwaige mit diesem
	verbundene Transaktionsobjekte mitbehandelt werden sollen.
	@param {boolean} [transactionMaster=true] Zeigt an, ob es sich um das Wurzelobjekt einer
	- potentiell mehrere Objekte umfassenden - Transaktion handelt. Wenn solch ein
	Transaktionskonzept unterstützt wird, kann hierüber unterscheiden werden, ob
	der gesamte Objektzusammenhang committed werden muss. Alle an der
	Transaktion beteiligten Objekte werden dann ebenfalls committed.
	@return {Object} Objekt mit folgenden Properties:
	<ul>
		<li><code>retcode Number</code> Fehlercode.
		Wenn alles geklappt hat, wird hier <code>0</code> zurückgegeben.</li>
		<li><code>transObj PDObject</code> Wird bei <code>holdTrans</code>
		<code>true</code> angegeben, so steht hier
		das Transaktionsobjekt zur weiteren Bearbeitung drin.</li>
	</ul>
	@throws {PDException}
	 */
	abortTransaction : function(newTrans, recursive, transactionMaster)
	{
		this.retcode = 0;
		if(UIApplication.USE_COMPLEX_TRANSACTIONS) // transactionMaster wird hier nicht ausgewertet u. sollte hier immer false sein!
		{
			//JDebug.log(JDebug.PD_TRANS, "PDObject.abortTransaction()");
			if(newTrans)
			{
				this.reload();
				return {
					retcode: 0,
					transObj: this
				};
			}
			else
				return ClientInfo.removeFromTransaction(this._tid, this);
		}
		return {
				retcode: -1 // veraltet!
			};
		/*var pars = new JParamPacker(JafWebAPI.PDObject.abortTransaction.eventName, this.PDClass);
		pars.add("holdTrans", (newTrans && newTrans === true));
		pars.add("clName", this.classname);
		pars.add("object", this, (true === recursive));
		if(this._lockId != -1)
			pars.add("lockId", this._lockid);
		pars.add("tid", this._tid);
		pars.add("strat", (transactionMaster === false ? "S" : "M"));
		if(recursive && recursive === true)
			pars.add("rec", recursive);
		//JDebug.log(JDebug.DEBUG, "PDObject.abortTransaction(): Params: "+pars.toString());
		var result = null;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.abortTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.abortTransaction()");
					result = {};
					result.transObj = resp.getPDObject('transObj');
					result.retCode = resp.getInt('retCode', -1);
					this.retcode = result.retCode;
					var tid = resp.getInt('tid', -1);
					if(result && tid >= 0)
						result._tid = tid;
				};
		//
		// synchroner Request!
		//
		JafWeb.ajaxRequest({
				url: pars.getPostUrl(),
				method: 'POST',
				async: false,
				params: pars.getPostParams(),
				scope: this,
				callerName: 'PDObject.abortTransaction',
				disableCaching: true,
				success: successFn,
				failure: function() { }
			});
		return result;*/
	},

	/**
	@memberof PDObject
	@function checkConstraints
	@desc Lokale Änderungen zum Server übertragen und speichern.
	Das lokale Objekt wird anschließend wieder vom Server
	aktualisiert, um Änderungen infolge des Speicherns
	mitzubekommen.
	@param {boolean} [recursive=false] Bestimmt, ob etwaige mit diesem
	verbundene Transaktionsobjekte mitbehandelt werden sollen.
	@param {boolean} [stopOnError=true] Wird hier <code>false</code> angegeben,
	werden alle auftretenden Fehlermeldungen zurückgegeben, sonst
	(Standardfall) nur der zuerst auftretende.
	@param {boolean} [andCommit=false] Gibt an, ob das Transaktionsobjekt auch in das
	Datenbankobjekt gespeichert werden soll.
	@param {boolean} [holdTrans=false] Gibt an, ob das übergebene Transaktionsobjekt
	für die weitere Bearbeitung behalten werden soll. Typischerweise ist das
	der Fall, wenn diese Funktion im Rahmen der "Übernehmen"-Funktion des
	Dialogs aufgerufen wird, wogegen beim Auslösen von "OK" das Transaktionsobjekt
	freigegeben werden kann, weil der Dialog geschlossen wird.
	@param {boolean} [transactionMaster=true] Zeigt an, ob es sich um das Wurzelobjekt einer
	- potentiell mehrere Objekte umfassenden - Transaktion handelt. Wenn solch ein
	Transaktionskonzept unterstützt wird, kann hierüber unterscheiden werden, ob
	der gesamte Objektzusammenhang committed werden muss. Alle an der
	Transaktion beteiligten Objekte werden dann ebenfalls committed.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} JavaScript-Objekt mit folgenden Properties:
	<ul>
		<li><code>retCode Number</code> Der Fehlercode von <code>checkConstraints()</code>.
			Wenn alles geklappt hat, wird hier <code>0</code> zurückgegeben.
		<li><code>errors String[]</code> String-Array mit Fehlermeldungen. Falls
			<code>stopOnError</code> <code>true</code> angegeben wurde, enthält
			das Array nur ein Element.
		<li><code>warnings String[]</code> String-Array mit Meldungen, die nicht
			zum Abbruch führen.
		<li><code>pdobject PDObject</code> Wenn bei <code>andCommit</code> der
			Wert <code>true</code> und bei <code>holdTrans</code> <code>false</code>
			angegeben wurde, steht hier das gespeicherte und ggf. aktualisierte
			Originalobjekt drin.
		<li><code>transObj PDObject</code> Wird bei <code>andCommit</code> und
			bei <code>holdTrans</code> <code>true</code> angegeben, so steht hier
			das Transaktionsobjekt zur weiteren Bearbeitung drin.
	</ul>
	@throws {PDException}
	 */
	checkConstraints : function(recursive, stopOnError, andCommit, holdTrans, transactionMaster, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDObject.checkConstraints("+recursive+", "+stopOnError+", "+andCommit+", "+holdTrans+")");
		if(UIApplication.USE_COMPLEX_TRANSACTIONS && andCommit === true)
		{
			//JDebug.log(JDebug.PD_TRANS, "PDObject.checkConstraints("+recursive+", "+stopOnError+", "+andCommit+", "+holdTrans+
			//		", "+transactionMaster+")");
			this.retcode = -1;
			var res = {
					retCode: -1,
					errors: ["checkConstraints(): Cannot commit single PDObject while using complex transactions. Use ClientInfo.commitTransaction() instead."],
					pdobject: (this.isTrans() ? this.getRealObject() : null),
					transObj: (this.isTrans() ? this : null)
				};
			if(typeof callback == 'function')
			{
				callback(res);
				return;
			}
			return res;
		}
		this.retcode = 0;
		//if(this.isNew() == true)
		//	return 0;
		var pars = new JParamPacker(JafWebAPI.PDObject.checkConstraints.eventName, this.PDClass);
		if(recursive && recursive === true)
			pars.add(JafWebAPI.PDObject.checkConstraints.PAR_rec, recursive);
		if(stopOnError && stopOnError === false)
			pars.add(JafWebAPI.PDObject.checkConstraints.PAR_stopOnError, false);
		pars.add(JafWebAPI.PDObject.checkConstraints.PAR_andCommit, (andCommit === true));
		pars.add(JafWebAPI.PDObject.checkConstraints.PAR_holdTrans, (holdTrans !== false));
		//pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.checkConstraints.PAR_clName, this.classname); // sonst klappt MO-Weiche nicht!
		pars.add(JafWebAPI.PDObject.checkConstraints.PAR_object, this, (true === recursive));
		pars.add(JafWebAPI.PDObject.checkConstraints.PAR_strat, (transactionMaster === false ? "S" : "M"));
		if(this._tid)
			pars.add(JafWebAPI.PDObject.checkConstraints.PAR_tid, this._tid);
		//JDebug.log(JDebug.WARN, "PDObject.checkConstraints(): Params: "+pars.toString());
		var result = new Object();
		result.retCode = -1;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.checkConstraints():\n"+resp.getResponseText());
					result.retCode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					result.retmsg = resp.getString(JafWebAPI.PDObject.checkConstraints.PROP_retMsg);
					result.transObj = resp.getPDObject(JafWebAPI.PDObject.checkConstraints.PROP_transObj);
					result.tid = resp.getInt(JafWebAPI.PDObject.checkConstraints.PROP_tid, -1);
					if(result.transObj && result.tid >= 0)
						result.transObj._tid = result.tid;
					result.pdobject = resp.getPDObject(JafWebAPI.PDObject.checkConstraints.PROP_realObj);
					result.errors = resp.getArray(JafWebAPI.PDObject.checkConstraints.PROP_errMsgs, [], 'string', '');
					result.warnings = resp.getArray(JafWebAPI.PDObject.checkConstraints.PROP_warnMsgs, [], 'string', '');
					if(!result.pdobject && andCommit && holdTrans)
						throw new PDException(PDException.FATAL, 'No PDObject found in result', 'PDObject.checkConstraints()');
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback(result);
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: 'POST',
				async: (!!callback),
				params: pars.getPostParams(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	@memberof PDObject
	@function checkConstraintsAndCommit
	@desc Lokale Änderungen zum Server übertragen und speichern.
	Das lokale Objekt wird anschließend wieder vom Server
	aktualisiert, um Änderungen infolge des Speicherns
	mitzubekommen.
	@param {boolean} [recursive=false] Bestimmt, ob etwaige mit diesem
	verbundene Objekte mitbehandelt werden sollen.
	@param {boolean} [stopOnError=true] Wird hier <code>false</code> angegeben,
	werden alle auftretenden Fehlermeldungen zurückgegeben, sonst
	(Standardfall) nur der zuerst auftretende.
	@param {boolean} [holdTrans=false] Gibt an, ob das übergebene Transaktionsobjekt
	für weitere Bearbeitung behalten werden soll. Typischerweise ist das
	der Fall, wenn diese Funktion im Rahmen der "Übernehmen"-Funktion des
	Dialogs aufgerufen wird, wogegen beim Auslösen von "OK" das Transaktionsobjekt
	freigegeben werden kann, weil der Dialog geschlossen wird.
	@param {boolean} [transactionMaster=true] Zeigt an, ob es sich um das Wurzelobjekt einer
	- potentiell mehrere Objekte umfassenden - Transaktion handelt. Wenn solch ein
	Transaktionskonzept unterstützt wird, kann hierüber unterscheiden werden, ob
	der gesamte Objektzusammenhang committed werden muss. Alle an der
	Transaktion beteiligten Objekte werden dann ebenfalls committed.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} JavaScript-Objekt mit folgenden Properties:
	<ul>
		<li><code>retCode Number</code> Der Fehlercode von <code>checkConstraints()</code>.
			Wenn alles geklappt hat, wird hier <code>0</code> zurückgegeben.
		<li><code>errors String[]</code> String-Array mit Fehlermeldungen. Falls für
			<code>stopOnError</code> <code>true</code> angegeben wurde, enthält
	  	das Array nur ein Element.
		<li><code>pdobject PDObject</code> Wenn bei <code>andCommit</code> der
			Wert <code>true</code> und bei <code>holdTrans</code> <code>false</code>
			angegeben wurde, steht hier das gespeicherte und ggf. aktualisierte
			Originalobjekt drin.
		<li><code>transObj PDObject</code> Wird bei <code>andCommit</code> und
			bei <code>holdTrans</code> <code>true</code> angegeben, so steht hier
			das Transaktionsobjekt zur weiteren Bearbeitung drin.
	</ul>
	@throws {PDException}
	 */
	checkConstraintsAndCommit : function(recursive, stopOnError, holdTrans, transactionMaster, callback)
	{
		return this.checkConstraints(recursive, stopOnError, true, false, transactionMaster, callback);
	},

	/**
	@memberof PDObject
	@function callOperation
	@desc Ruft eine Operation fuer dieses Objekt auf 
	dem Server auf.<br/>
	<span class="important">Hinweis:</span> Hinweis zur Implementierung auf seiten des JANUS-Servers: Der
	JafWeb-Client ruft, unabhängig von der Anzahl der Ein-/Ausgabeparameter
	der modellierten Methode, immer die <code>callOperation()</code>-Variante
	mit allen Ein-/Ausgabeparametern auf, weil anhand des Requests nicht erkannt
	werden kann, ob es Ausgabeparameter gibt. Der GUI-Client hingegen ruft für
	parameterlose Methoden direkt die <code>callOperation()</code>-Variante ohne
	Parameter auf. Das müssen Sie berücksichtigen, wenn Sie in letzterer User Code
	einfügen.
	@param {string} op Name der Objektoperation.
	@param {boolean} [async=false] Bestimmt asynchrone (<code>true</code>) oder
	synchrone (<code>false</code>) Ausführung der Operation.
	Bei der asynchronen kann während der Ausführung auf der
	Seite weitergearbeitet werden, die synchrone dagegen
	blockiert alle Eingaben, bis die Operation zurückkommt.
	@param {Array} [inStr] String oder String-Array mit Eingabeparametern.
	@param {Array} [inPdo] OID-String oder Liste von OID-Strings mit 
	Eingabeparametern für Objekte.
	@param {Function} [callback] Hier kann eine JavaScript-Funktion angegeben
	oder definiert werden, die bei der Rückkehr der Operation
	ausgeführt werden soll (z.B. Meldung, Update einer Liste).
	Bei asynchroner Ausführung wird diese Callback-Funktion mit
	folgenden Parametern aufgerufen:
	<ul>
		<li><code>outStrs</code> String oder Array von Strings mit den Ausgabeparametern
		der Operation.
		<li><code>outPdos</code> Ein einzelnes <code>PDObject</code> (oder <code>null</code>)
		oder ein Array von <code>PDObject</code>s mit den Ausgabeobjekten der
		Operation.
		<li><code>result</code> Numerischer Rückgabewert der Operation.
	</ul>
	@param {Object} [scope] JavaScript-Objekt, in dessen Kontext die bei <code>callback</code>
	übergebene Funktion ausgeführt werden soll. Falls nicht angegeben, wird
	die Funktion im Kontext des aktuellen <code>PDObject</code>s ausgeführt.
	@return {Object} Bei synchroner Ausführung wird ein JavaScript-Objekt
	mit diesen Properties zurückgegeben:
	<ul>
		<li><code>outStrs</code> Array mit den Ausgabe-Strings.
		<li><code>outPdos</code> Array mit den Ausgabe-<code>PDObject</code>s.
		<li><code>result</code> Rückgabewert der ausfgerufenen Operation (Number).
	</ul>
	@see [PDClass.callOperation()]{@link PDClass#callOperation}
	@see Zu fortgeschrittenen Server-Operationsaufrufen siehe
	auch {@tutorial tut_calloperaton} und die Klasse
	{@link PDOperationCall}.
	@throws {PDException}
	@example
// auf einem PDObject equipment wird eine Operation mit einer Objektliste
// als Ausgabeparameter synchron aufgerufen, die die Rollen ermitteln soll:
var outPdos = eq.callOperation('getAvailableUserRoles').outPdos;
console.log('Rollen:');
for(var i=0; i < outPdos.length; i++)
  console.log('  ' + outPdos[i].getAttribute('RoleErgName'), true);
	*/
	callOperation : function(op, async, inStr, inPdo, callback, scope)
	{
		//JDebug.log(JDebug.WARN, "PDObject.callOperation(): inPdos: "+inspect(inPdo, true));
		this.retcode = 0;
		// aktuelles Objekt mitschicken!
		// TODO
		// this-Objekt anschliessend auch aktualisieren!
		var aInStr = null;
		var aInPdo = null;
		var bAsync = false;
		var fCallback = null;
		var oScope = null;
		var pos = 1;
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			bAsync = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (typeof arguments[pos] != "function"))
		{
			aInStr = arguments[pos];
			if(!JafWeb.isArray(aInStr))
				aInStr = [aInStr];
			pos++;
		}
		else
			aInStr = [ ];
		if(arguments.length > pos && (typeof arguments[pos] != "function"))
		{
			aInPdo = arguments[pos];
			if(!JafWeb.isArray(aInPdo))
				aInPdo = [aInPdo];
			pos++;
		}
		else
			aInPdo = [ ];
		if(arguments.length > pos && (typeof arguments[pos] == "function" || arguments[pos] == null))
		{
			fCallback = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "object")
		{
			oScope = arguments[pos];
			pos++;
		}
		var pars = new JParamPacker(JafWebAPI.PDObject.callOperation.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		//pars.add("object", this); TODO???
		pars.add(JafWebAPI.PDObject.callOperation.PAR_op, op);
		pars.add(JafWebAPI.PDObject.callOperation.PAR_async, bAsync);
		if(typeof this._lockId == 'number' && this._lockId != -1)
			pars.add(JafWebAPI.PDObject.callOperation.PAR_lockId, this._lockid);
		for(var i=0; i < aInStr.length; i++)
			pars.add(JafWebAPI.PDObject.callOperation.PAR_inStr + i, aInStr[i]);
		//JDebug.log(JDebug.WARN, "PDObject.callOperation(): sInPdos: "+inspect(aInPdo, true));
		for(var i=0; i < aInPdo.length; i++)
		{
			if(!aInPdo[i])
				pars.add(JafWebAPI.PDObject.callOperation.PAR_inPdo + i, "0");
			else if(typeof aInPdo[i] == 'object' && aInPdo[i].oid)
				pars.add(JafWebAPI.PDObject.callOperation.PAR_inPdo + i, aInPdo[i].oid);
			else if(typeof aInPdo[i] == 'string' && aInPdo[i].match(/[0-9]:[0-9]/))
				pars.add(JafWebAPI.PDObject.callOperation.PAR_inPdo + i, aInPdo[i]);
			else
				pars.add(JafWebAPI.PDObject.callOperation.PAR_inPdo + i, "0");
		}
		//JDebug.log(JDebug.WARN, "PDObject.callOperation(): Params: "+pars.toString());
		var res = new Object();
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					//JDebug.log(JDebug.L6, "PDObject.callOperation(): response: "+resp.getResponseText());
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.callOperation():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.callOperation()");
					var lockInfo = resp.get(JafWebAPI.PDObject.callOperation.PROP_lockInfo);
					if(lockInfo)
					{
						var msg = (PDMeta.getString('SC::FormTitleLocked') || "Locked by %u, logged in from %c. Locked since %t.");
						msg = msg.replace(/%c/, lockInfo[JafWebAPI.PDObject.callOperation.PROP_client]);
						msg = msg.replace(/%u/, lockInfo[JafWebAPI.PDObject.callOperation.PROP_user]);
						var dur = new UIDuration(lockInfo[JafWebAPI.PDObject.callOperation.PROP_locktime]);
						msg = msg.replace(/%t/, dur.toString());
						msg = msg.replace(/%i/, lockInfo[JafWebAPI.PDObject.callOperation.PROP_uid]);
						UIMessage.ok(msg);
						return;
					}
					res.result = resp.getInt(JafWebAPI.PROP_retCode, -1);
					res.outStrs = resp.getArray(JafWebAPI.PDObject.callOperation.PROP_OUTSTR, [], 'string', '');
					res.outPdos = resp.getArray(JafWebAPI.PDObject.callOperation.PROP_OUTPDO, [], 'PDObject', null);
					var thisObj = resp.getPDObject(JafWebAPI.PDObject.callOperation.PROP_obj);
					if(thisObj)
						JafWeb.apply(this, thisObj);
					if(typeof fCallback == "function")
					{
						//fCallback(outStr, outPdo, this.retcode);
						fCallback.call((oScope || this), res.outStrs, res.outPdos, res.result);
					}
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof fCallback == 'function')
					fCallback.call((oScope || this));
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: 'POST',
				async: bAsync,
				params: pars.getPostParams(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		if(bAsync === false)
			return res;
	},

	/**
	@memberof PDObject
	@function connect
	@desc Stellt eine Verbindung zwischen diesem und dem übergebenen
	Objekt in einer Zu-N-Beziehung her. Für das Setzen einer
	Zu-1-Beziehung verwenden Sie bitte die Funktion <code>setFirstLink()</code>.
	@param {string} rolename Rollenname aus Sicht des Objektes, auf dem die
	Funktion aufgerufen wird.
	@param {PDObject} pdo Fachkonzeptobjekt, das über die Beziehung verbunden
	werden soll. Statt eines einzelnen kann auch ein Array mit den zu
	verbindenden {@link PDObject}s angegeben werden.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@see [setFirstLink()]{@link PDObject#setFirstLink}
	@throws {PDException}
	 */
	connect : function(rolename, pdo, callback)
	{
		if(!pdo)
			return;
		// TODO: alle in einem Request (in geordneter Reihenfolge)!
		if(JafWeb.isArray(pdo))
		{
			for(var i = 0; i < pdo.length; i++)
			{
				var res = this.connect(rolename, pdo[i]);
				if(res < 0)
				{
					if(typeof callback == 'function')
					{
						callback(res);
						return;
					}
					return res;
				}
			}
			if(typeof callback == 'function')
			{
				callback(0);
				return;
			}
			return 0;
		}
		// TODO: auch verbinden mehrerer Objekte in einem Serveraufruf unterstuetzen!
		//JDebug.log(JDebug.L4, 'PDObject.connect('+rolename+', '+pdo+')');
		this.retcode = -1;
		if(!pdo || !(pdo instanceof PDObject))
			return;
		// direkt Server-seitig verbinden
		var pars = new JParamPacker(JafWebAPI.PDObject.connect.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.connect.PAR_relname, rolename);
		pars.add(JafWebAPI.PDObject.connect.PAR_relOid, pdo.oid);
		pars.add(JafWebAPI.PDObject.connect.PAR_lockId, (this._lockid || -1));
		var pdClass = this.PDClass;
		var thisObj = this;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDObject.connect():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.connect()");
				this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
				// Beziehungen werden jetzt generell nicht mehr Client-seitig vorgehalten,
				// muessen aber trotzdem eingetragen werden!
				if(this.retcode >= 0)
				{
					var card = resp.getInt(JafWebAPI.PDObject.setFirstLink.PROP_card, 0);
					if(card == 1)
					{
						//if(JafWeb.isArray(this[rolename]))
						//	console.log("PDObject.setFirstLink() - unexpected type of relation property for this cardinality!");
						this[rolename] = pdo;
						thisObj.handleChanged(rolename);
					}
				}
				if(typeof callback == 'function')
					callback(this.retcode);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		return this.retcode;
	},
	
	/**
	@memberof PDObject
	@function setFirstLink
	@desc Stellt eine Verbindung zwischen diesem und dem übergebenen
	Objekt in einer Zu-1-Beziehung her. Falls bereits ein Objekt
	verbunden war, wird dieses vorher getrennt.<br>
	Für Zu-N-Beziehungen verwenden Sie stattdessen die Funktion
	<code>connect()</code>.
	@param {string} rolename Rollenname aus Sicht des Objektes, auf dem die
	Funktion aufgerufen wird.
	@param {PDObject} pdo Fachkonzeptobjekt, das über die Beziehung verbunden
	werden soll.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@see [connect()]{@link PDObject#connect}
	@throws {PDException}
	 */
	setFirstLink : function(rolename, pdo, callback)
	{
		//JDebug.log(JDebug.WARN, "PDObject.setFirstLink('"+rolename+"', "+inspect(pdo)+")");
		this.retcode = -1;
		// direkt Server-seitig trennen
		var pars = new JParamPacker(JafWebAPI.PDObject.setFirstLink.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.setFirstLink.PAR_relname, rolename);
		pars.add(JafWebAPI.PDObject.setFirstLink.PAR_relOid, (pdo ? pdo.oid : 0));
		pars.add(JafWebAPI.PDObject.setFirstLink.PAR_lockId, (this._lockid || -1));
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDObject.setFirstLink():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.setFirstLink()");
				this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
				if(this.retcode >= 0)
				{
					var card = resp.getInt(JafWebAPI.PDObject.setFirstLink.PROP_card, 0);
					if(card == 1)
					{
						//if(JafWeb.isArray(this[rolename]))
						//	console.log("PDObject.setFirstLink() - unexpected type of relation property for this cardinality!");
						this[rolename] = pdo;
						this.handleChanged(rolename);
					}
				}
				// Beziehungen werden jetzt generell nicht mehr Client-seitig vorgehalten!
				// Zu-1-Beziehungen aber schon!
				if(typeof callback == 'function')
					callback(this.retcode);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return this.retcode;
	},
	
	/**
	@memberof PDObject
	@function deleteConnected
	@desc Löscht ein Objekt aus einer Beziehung.
	@param {string} rolename Rollenname aus Sicht des Objektes, auf dem die
	Funktion aufgerufen wird.
	@param {PDObject} pdo Fachkonzeptobjekt, das gelöscht werden soll.
	@param {number} [transId=0] ID der aktuellen Transaktion. Vgl.
	[ClientInfo.startTransaction()]{@link ClientInfo#startTransaction}.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	 */
	deleteConnected : function(rolename, pdo, transId, callback)
	{
		this.retcode = -1;
		if(!pdo || (!JafWeb.isPDObject(pdo) && !JafWeb.isArray(pdo)))
		{
			if(typeof callback == 'function')
				callback();
			return;
		}
		// TODO: alle in einem Request (in geordneter Reihenfolge)!
		if(JafWeb.isArray(pdo))
		{
			for(var i = 0; i < pdo.length; i++)
			{
				var res = this.deleteConnected(rolename, pdo[i], transId);
				if(res != 0)
				{
					if(typeof callback == 'function')
					{
						callback(res);
						return;
					}
					return res;
				}
			}
			if(typeof callback == 'function')
			{
				callback(0);
				return;
			}
			return 0;
		}
		if(this.isTrans())
		{
			if(!pdo.isTrans())
			{
				JDebug.log(JDebug.WARN, "PDObject.deleteConnected() - The object to be deleted should be a transaction object!");
				return -1;
			}
			var pars = new JParamPacker(JafWebAPI.PDObject.deleteConnected.eventName, this.PDClass);
			pars.addPDObjectByIds(this);
			pars.add(JafWebAPI.PDObject.deleteConnected.PAR_relname, rolename);
			pars.add(JafWebAPI.PDObject.deleteConnected.PAR_relOid, (pdo ? pdo.oid : 0));
			pars.add(JafWebAPI.PDObject.deleteConnected.PAR_lockId, (this._lockid || -1));
			if(transId)
				pars.add(JafWebAPI.PDObject.deleteConnected.PAR_tid, transId);
			else
				pars.add(JafWebAPI.PDObject.deleteConnected.PAR_tid, (this._tid || 0));
			var pdClass = this.PDClass;
			var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.deleteConnected():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.deleteConnected()");
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(!this.retcode)
						this.handleChanged(rolename);
					if(typeof callback == 'function')
						callback(this.retcode);
				};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
					if(typeof callback == 'function')
						callback();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "GET",
					async: (!!callback),
					params: pars.get(),
					disableCaching: true,
					scope: this,
					callerName: pars.getEventName(),
					success: successFn,
					failure: failureFn
				});
			if(!callback)
				return this.retcode;
		}
	},
			
	/**
	@memberof PDObject
	@function deleteRelatedObject
	@deprecated
	@desc Löscht ein Objekt aus einer Beziehung.
	@param {string} rolename Rollenname aus Sicht des Objektes, auf dem die
	Funktion aufgerufen wird.
	@param {PDObject} pdo Fachkonzeptobjekt, das gelöscht werden soll.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	 */
	deleteRelatedObject : function(rolename, pdo, callback)
	{
		if(JafWeb.isArray(pdo))
		{
			// TODO: alle mit einem einzigen Request loeschen
			for(var i=0; i < pdo.length; i++)
			{
				//this.disconnect(rolename, pdo[i]);
				this.PDClass.deleteObject(pdo[i]);
			}
		}
		else
		{
			//this.disconnect(rolename, pdo);
			this.PDClass.deleteObject(pdo, callback);
		}
	},

	/**
	@memberof PDObject
	@function disconnect
	@desc Die Beziehung zu dem übergebenen Objekt auflösen.
	@param {string} rolename Rollenname aus Sicht des Objektes, auf dem die
	Funktion aufgerufen wird.
	@param {PDObject} pdo Fachkonzeptobjekt, zu dem die Verbindung getrennt
	werden soll.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	 */
	disconnect : function(rolename, pdo, callback)
	{
		this.retcode = -1;
		if(!pdo)
			return -1;
		//JDebug.log(JDebug.WARN, 'PDObject.disconnect('+rolename+', '+inspect(pdo)+')');
		// TODO: alle in einem Request (in geordneter Reihenfolge)!
		if(JafWeb.isArray(pdo))
		{
			for(var i = 0; i < pdo.length; i++)
			{
				var res = this.disconnect(rolename, pdo[i]);
				if(res < 0)
				{
					if(typeof callback == 'function')
					{
						callback(res);
						return;
					}
					return res;
				}
			}
			if(typeof callback == 'function')
			{
				callback(0);
				return;
			}
			return 0;
		}
		if(!pdo || !(pdo instanceof PDObject))
			return -1;
		// direkt Server-seitig trennen
		var pars = new JParamPacker(JafWebAPI.PDObject.disconnect.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.disconnect.PAR_relname, rolename);
		pars.add(JafWebAPI.PDObject.disconnect.PAR_relOid, pdo.oid);
		pars.add(JafWebAPI.PDObject.disconnect.PAR_lockId, (this._lockid || -1));
		var pdClass = this.PDClass;
		//JDebug.log(JDebug.WARN, "PDObject.disconnect(): Params: "+pars.toString());
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDObject.disconnect():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.disconnect()");
				this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
				// Beziehungen werden jetzt generell nicht mehr Client-seitig vorgehalten!
				if(typeof callback == 'function')
					callback(this.retcode);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		if(typeof callback != 'function')
			return this.retcode;
	},
	
	/**
	@memberof PDObject
	@function countObjects
	@desc Ermittelt die Anzahl der über eine Zu-N-Beziehung verbundenen 
	Objekte.
	@param {string} rolename Name der Beziehung aus Sicht des Objekts,
	auf dem die Funktion aufgerufen wird.
	@param {string} sel Optionales Filterkriterium, um die Menge der
	gezeigten Objekte einzuschränken.
	@param {PDObject} [thisPdo] PDObject, das im Filter als this-Objekt
	verwendet werden kann.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Anzahl der über die Beziehung verbundenen Objekte.
	@see [PDClass.countObjects()]{@link PDClass#countObjects}
	@throws {PDException}
	 */
	countObjects : function(rolename, sel, thisPdo, callback)
	{
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDObject.countObjects.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.countObjects.PAR_relname, rolename);
		if(sel)
		{
			pars.add(JafWebAPI.PDObject.countObjects.PAR_filter, sel);
			if(thisPdo)
			{
				if(thisPdo instanceof PDObject)
					pars.add(JafWebAPI.PDObject.countObjects.PAR_thisPdo, thisPdo.oid);
				else
					pars.add(JafWebAPI.PDObject.countObjects.PAR_thisPdo, thisPdo);
			}
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.countObjects(): Params: "+pars.toString());
		var res = -1; // TODO: Fehler-Code fuer PDMeta.getString()
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDObject.countObjects():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.countObjects()");
				res = resp.getInt(JafWebAPI.PDObject.countObjects.PROP_count, -1);
				if(typeof callback == 'function')
					callback(res);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: (!!callback),
				params: pars.getPostParams(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return res;
	},
	
	/**
	@memberof PDObject
	@function countObjectsMulti
	@desc Ermittelt die Anzahlen der über Zu-N-Beziehungen verbundenen 
	Objekte für mehrere Beziehungen in einem Aufruf.
	@param {string[]} rolenames Namen der Beziehungen aus Sicht des Objekts,
	auf dem die Funktion aufgerufen wird.
	@param {string[]} sels Filterkriterien zum Einschränken der Objektmenge
	für die jeweilige Beziehung. Für nicht zu filternde Beziehungen muss ein
	Leerstring in das Array eingefügt werden.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number[]} Anzahlen der über die Beziehung verbundenen Objekte.
	@see [PDObject.countObjects()]{@link PDObject#countObjects}
	@throws {PDException}
	 */
	countObjectsMulti : function(rolenames, sels, callback)
	{
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDObject.countObjectsMulti.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		for(var i = 0; i < rolenames.length; i++)
		{
			pars.add(JafWebAPI.PDObject.countObjectsMulti.PAR_relname + i, rolenames[i]);
			pars.add(JafWebAPI.PDObject.countObjectsMulti.PAR_filter + i, (sels[i] || ''));
		}
		var res = null;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDObject.countObjectsMulti():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.countObjectsMulti()");
				res = resp.getArray(JafWebAPI.PDObject.countObjectsMulti.PROP_count, [], 'number', -1);
				if(typeof callback == 'function')
					callback(res);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: (!!callback),
				params: pars.getPostParams(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return res;
	},
	
	/**
	@memberof PDObject
	@function invalidate
	@desc Dieses Fachkonzeptobjekt ungültig setzen, damit alle
	Attribute beim nächsten Zugriff neu geholt werden.
	 */
	invalidate : function()
	{
		//JDebug.log(JDebug.DEBUG, 'PDObject.invalidate()');
		this._statusCache = {};
		for(var attr in this)
		{
			if(typeof attr != 'string' || !attr || attr == 'IDENT')
				continue;
			if(attr.length < 4 || attr.substr(0, 4) != '__f_')
				continue;
			if((this[attr] & PDObjectFlags.Available) != 0)
				this[attr] &= ~PDObjectFlags.Available;
		}
	},
	
	/**
	@memberof PDObject
	@function getAttribute
	@desc Den Wert eines Attributes lesen.
	@param {string} attr Der technische Name des Fachkonzeptattributs.
	@param {boolean} [request=false] Wird hier <code>true</code> angegeben, wird
	der Attributwert auf jeden Fall vom Server aktualisiert. Ansonsten
	erfolgt ein Server-Request nur, falls das Attribut noch nicht lokal
	gespeichert ist.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Der Wert des Attributs. Unabhängig vom 
	modellierten Datentyp handelt es sich hier immer um einen String.
	Bei Enumeration Types mit Mehrfachauswahl enthält der String
	alle selektierten Ausprägungen, miteinander verkettet durch
	Pipe-Zeichen ("|").
	@see [getAttributes()]{@link PDObject#getAttributes} zum Lesen mehrerer
	Attribute in einem Aufruf.
	@see [PDClass.getAttribute()]{@link PDClass#getAttribute}
	@throws {PDException}
	 */
	getAttribute : function(attr, request, callback)
	{
		//JDebug.log(JDebug.DEBUG, 'PDObject.getAttribute('+attr+')');
		this.retcode = 0;
		if(!attr || attr == "")
			attr = "IDENT";
		// falls kein Available-Flag, unbedingt neu holen (ausser ObjectIdent)!
		if(attr != "IDENT" && (this['__f_'+attr] == undefined ||
				((this['__f_'+attr] & PDObjectFlags.Available) == 0) &&
				this['__f_'+attr] != PDObjectFlags.RelationNotSet)) // bei Abfragen auf Beziehungen kann das gen. getAttribute() RelationNotSet liefern!
			request = true;
		// TODO: Beziehungen ggf. aufloesen und
		// Beziehungsobjekt(e) noetigenfalls nachladen! 
		// Siehe getFirstLink()
		//attr = attr.replace(/[-\.>]/g, "_");
		var res = "";
		var self = this;
		var retFn = function() {
				if(self[attr] != undefined)
					self.retcode = PDObjectFlags.Available;
				
				// es kann eine Beziehung angegeben sein!
				if(self[attr] != undefined && typeof self[attr] == "object")
				{
					self.retcode |= PDObjectFlags.NoWritePermission;
					if(self[attr] == null)
						return; // Leerstring
					if(self[attr] instanceof PDObject)
					{
						res = self[attr].getAttribute("");
						return;
					}
					else
						JDebug.log(JDebug.WARN, 'PDObject['+self.classname+'].getAttribute('+attr+
									'): Attr. has typeof object but is not instanceof PDObject!');
				}
				else if(self[attr] != undefined)
					res = self[attr];
				
				if(self['__f_'+attr] !== undefined)
					self.retcode = self['__f_'+attr];
				else
				{
					if(self["_perm_"+attr] == "no_write")
						self.retcode |= PDObjectFlags.NoWritePermission;
					// TODO: weitere Flags, z.B. overwritten!
			
					if(self[attr] == undefined)
						// kein Leserecht oder unbekanntes Attribut
						self.retcode |= PDObjectFlags.NoReadPermission;
				}
				return res;
			};
		
		if(true === request || (this[attr] === undefined &&
				attr != "_allowEdit" &&
				attr != "_allowDelete" &&
				attr != "_lastMsg" &&
				attr != "retcode" &&
				attr != "function" &&
				attr != "classname" &&
				attr != "cid" && attr != "oid" &&
				attr != "oidHi" && attr != "oidLow" && attr != "pid" &&
				attr != "_lockid" && attr != "_realOidLow" &&
				attr != "_isnew" &&
				attr != "_modified" &&
				attr != "_isTrans" &&
				attr != "_deleted" &&
				attr != "_depDelete" &&
				attr != "_connected" &&
				attr != "_disconnected" &&
				attr != "_trav" && attr != "_del" && attr != "_ldd" && attr != "_disc" // interne von PDTable
			))
		{
			var pars = new JParamPacker(JafWebAPI.PDObject.getAttribute.eventName, this.PDClass);
			pars.addPDObjectByIds(this);
			pars.add(JafWebAPI.PDObject.getAttribute.PAR_attr, (attr == 'IDENT' ? '' : attr));
			//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.getAttribute(): Params: "+pars.toString());
			var pdClass = this.PDClass;
			var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.getAttribute():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.getAttribute()");
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					var v = resp.getString(JafWebAPI.PDObject.getAttribute.PROP_value);
					if(typeof v == 'string')
					{
						this[attr] = v;
						this['__f_'+attr] = resp.getInt(JafWebAPI.PDObject.getAttribute.PROP_flags, 0);
					}
					if(this['__f_'+attr] !== undefined)
						this.retcode = self['__f_'+attr];
					else
					{
						if(this["_perm_"+attr] == "no_write")
							this.retcode |= PDObjectFlags.NoWritePermission;
						// TODO: weitere Flags, z.B. overwritten!
					
						if(this[attr] == undefined)
							// kein Leserecht oder unbekanntes Attribut
							this.retcode |= PDObjectFlags.NoReadPermission;
					}
					res = retFn();
					if(typeof callback == 'function')
						callback(v);
				};
			var failureFn = function(response, opts) {
					this.retcode = 0;
					if(typeof callback == 'function')
						callback();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "GET",
					async: (!!callback),
					params: pars.get(),
					disableCaching: true,
					scope: this,
					callerName: pars.getEventName(),
					success: successFn,
					failure: failureFn
				});
			if(!callback)
				return this[attr];
			return;
		}
		retFn();
		if(callback)
			callback(res);
		else
			return res;
	},
	
	/**
	@memberof PDObject
	@function getAttributes
	@desc Die Werte mehrerer Attribute in einem Aufruf lesen.
	@param {string[]} attrs Die technischen Name der Fachkonzeptattribute.
	@param {boolean} [request=false] Wird hier <code>true</code> angegeben, werden
	die Attributwerte auf jeden Fall vom Server aktualisiert. Ansonsten
	erfolgt ein Server-Request nur, falls eines der Attribute noch nicht lokal
	gespeichert ist.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} JavaScript-Objekt folgender Form:
	 <ul>
	 	<li><code>values</code>: JavaScript-Objekt mit Properties entsprechend den abgefragten
	 		Attributnamen. Der ObjectIdent (der über einen leeren Attributnamen abgefragt
	 		werden kann), ist über den Property-Namen <code>IDENT</code> zugreifbar.
	 	<li><code>flags</code>: JavaScript-Objekt mit den gleichen Properties, die die
	 		entsprechenden Attribut-Flags (vom Typ Number) enthalten. Siehe
	 		<code>PDObjectFlags</code>.
	 </ul>
	@see [getAttribute()]{@link PDObject#getAttribute}
	@throws {PDException}
	 */
	getAttributes : function(attrs, request, callback)
	{
		//JDebug.log(JDebug.L3, 'PDObject.getAttributes('+inspect(attrs, true)+')');
		this.retcode = 0;
		// TODO: Beziehungen ggf. aufloesen und
		// Beziehungsobjekt(e) noetigenfalls nachladen! 
		// Siehe getFirstLink()
		//attr = attr.replace(/[-\.>]/g, "_");
		var result = {
				values: { },
				flags: { }
			};
		var doRequest = (true === request);
		var self = this;
		for(var i=0; i < attrs.length; i++)
		{
			if(!attrs[i])
				attrs[i] = 'IDENT';
			if(attrs[i] != 'IDENT' && (self[attrs[i]] == undefined || self['__f_'+attrs[i]] == undefined))
				doRequest = true;
			if(doRequest === true)
				continue;
			// es kann eine Beziehung angegeben sein!
			if(self[attrs[i]] != undefined && typeof self[attrs[i]] == "object")
			{
				result.flags[attrs[i]] = PDObjectFlags.NoWritePermission;
				if(self[attrs[i]] === null)
					result.values[attrs[i]] = ''; // Leerstring
				else if(self[attrs[i]] instanceof PDObject)
					result.values[attrs[i]] = self[attrs[i]].getAttribute("");
				else
					JDebug.log(JDebug.WARN, 'PDObject['+self.classname+'].getAttributes('+attrs[i]+
								'): Attr. has typeof object but is not instanceof PDObject!');
			}
			else
			{
				result.values[attrs[i]] = (self[attrs[i]] || '');
				result.flags[attrs[i]] = self['__f_'+attrs[i]];
			}
		}
		if(doRequest)
		{
			var pars = new JParamPacker(JafWebAPI.PDObject.getAttributes.eventName, this.PDClass);
			pars.addPDObjectByIds(this);
			var cnt = 0;
			for(var i=0; i < attrs.length; i++)
			{
				if(attrs[i] != "_allowEdit" &&
						attrs[i] != "_allowDelete" &&
						attrs[i] != "_lastMsg" &&
						attrs[i] != "retcode" &&
						attrs[i] != "function" &&
						attrs[i] != "classname" &&
						attrs[i] != "cid" && attrs[i] != "oid" &&
						attrs[i] != "oidHi" && attrs[i] != "oidLow" && attrs[i] != "pid" &&
						attrs[i] != "_lockid" && attrs[i] != "_realOidLow" &&
						attrs[i] != "_isnew" &&
						attrs[i] != "_modified" &&
						attrs[i] != "_isTrans" &&
						attrs[i] != "_deleted" &&
						attrs[i] != "_depDelete" &&
						attrs[i] != "_connected" &&
						attrs[i] != "_disconnected" &&
						attrs[i] != "_trav" && attrs[i] != "_del" && attrs[i]!= "_ldd" && attrs[i] != "_disc") // interne von PDTable
				{
					pars.add(JafWebAPI.PDObject.getAttributes.PAR_attr + cnt, (attrs[i]=='IDENT' ? '' : attrs[i]));
					cnt++;
				}
			}
			//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.getAttributes(): Params: "+pars.toString());
			var pdClass = this.PDClass;
			var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.getAttributes():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.getAttributes()");
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					result.values = resp.get(JafWebAPI.PDObject.getAttributes.PROP_values);
					result.flags = resp.get(JafWebAPI.PDObject.getAttributes.PROP_flags);
					for(var attr in result.values)
					{
						if(attr === '')
							self['IDENT'] = result.values[attr];
						else
							self[attr] = result.values[attr];
						self['__f_'+attr] = result.flags[attr];
					}
					if(result.values[''] && !result.values['IDENT'])
						result.values['IDENT'] = result.values[''];
					if(typeof callback == 'function')
						callback(result);
				};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
					if(typeof callback == 'function')
						callback();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "POST",
					async: (!!callback),
					params: pars.getPostParams(),
					disableCaching: true,
					scope: this,
					callerName: pars.getEventName(),
					success: successFn,
					failure: failureFn
				});
		}
		else if(callback)
		{
			callback(result);
			return;
		}
		return result;
	},
	
	/**
	@memberof PDObject
	@function setAttribute
	@desc Den Wert eines Fachkonzeptattributes setzen.
	@param {string} attr Der technische Name des Attributs.
	@param {string} val Der Wert, auf den das Attribut
	gesetzt werden soll.
	@param {boolean} [onServer=false] Falls hier <code>true</code> angegeben wird, erfolgt
	eine unmittelbare Synchronisierung des Objekts auf der Server-Seite. Das kann
	z.B. wichtig sein, wenn der Überschreiben-Status eines abgeleitet-überschreibbaren
	Attributes geändert und anschließend der neu berechnete Wert geholt werden soll.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@see [PDClass.setAttribute()]{@link PDClass#setAttribute}
	@throws {PDException}
	 */
	setAttribute : function(attr, val, onServer, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDObject.setAttribute('"+attr+"', '"+val+"', "+onServer+")");
		this.retcode = 0;
		var onS = false;
		var fCallb = null;
		var pos = 2;
		if(pos < arguments.length && (typeof arguments[pos] == 'boolean'))
		{
			onS = (arguments[pos] === true);
			pos++;
		}
		if(pos < arguments.length && (typeof arguments[pos] == 'function'))
		{
			fCallb = arguments[pos];
			pos++;
		}
		// ist das Attribut ueberschreibbar? Dann muessen wir bei Wegnahme
		// des Ueberschriebenstatus den Wert auf dem Server setzen und
		// neu holen
		if(!onS && this['__f_'+attr])
		{
			// wenn Ueberschrieben und Wert leer: Status auf dem Server wegnehmen
			if(this['__f_'+attr] & PDObjectFlags.Overwritten && (val ? false : true))
				onS = true;
			// wenn nicht Ueberschriebn und Wert nicht leer: Status setzen
			else if(this['__f_'+attr] & PDObjectFlags.NotOverwritten && (val ? true : false))
			{
				this['__f_'+attr] &= ~PDObjectFlags.NotOverwritten;
				this['__f_'+attr] |= PDObjectFlags.Overwritten;
			}
		}
		var oldVal = this[attr];
		if(attr)
		{
			// TODO: Beziehungen ggf. aufloesen und
			// Beziehungsobjekt(e) noetigenfalls suchen/anlegen!
			// Siehe getFirstLink()
			//attr = attr.replace(/[-\.>]/g, "_");
			this[attr] = val;
			this._modified = true;
		}
		if(!this.isTrans() || onS)
		{
			var pars = new JParamPacker(JafWebAPI.PDObject.setAttribute.eventName, this.PDClass);
			pars.addPDObjectByIds(this);
			pars.add(JafWebAPI.PDObject.setAttribute.PAR_attr, attr);
			pars.add(JafWebAPI.PDObject.setAttribute.PAR_value, val);
			//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.setAttribute(): Params: "+pars.toString());
			var res = -1; // TODO: Fehler-Code fuer PDMeta.getString()
			var pdClass = this.PDClass;
			var successFn = function(req, options)
				{
					if(!attr || attr == "")
						attr = "IDENT";
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.setAttribute():\n"+resp.getResponseText());
					if(resp.hasError())
					{
						// bei unbekannten Attributen schreibt der Server nur "unknown attribute" in die Fehleremeldung
						var msg = (resp.getErrorMessage() || '');
						msg = msg.replace('unknown attribute', attr);
						throw new PDException(PDException.ERROR, msg, "PDObject.setAttribute()");
					}
					res = resp.getInt(JafWebAPI.PROP_retCode, -1);
					// der tatsaechliche neue Wert wird zurueckgegeben,
					// weil er von dem gesetzten abweichen kann, z.B. bei
					// abgeleitet ueberschreibbaren Attributen!
					this[attr] = resp.getString(JafWebAPI.PDObject.setAttribute.PROP_value);
					this['__f_'+attr] = resp.getInt(JafWebAPI.PDObject.setAttribute.PROP_flags, 0);
					if(oldVal != this[attr])
						this.handleChanged(attr);
					if(typeof fCallb == 'function')
						fCallb();
					//JDebug.log(JDebug.WARN, "PDObject.setAttribute() - Result, Value: '"+this[attr]+"', flags: " + this.printFlags(attr));
				};
			var failureFn = function(response, opts) {
					if(typeof fCallb == 'function')
						fCallb();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "POST",
					async: (!!fCallb),
					params: pars.getPostParams(),
					disableCaching: true,
					scope: this,
					callerName: pars.getEventName(),
					success: successFn,
					failure: failureFn
				});
			return res;
		}
	},
	
	/**
	@memberof PDObject
	@function setAttributes
	@desc Die Attribute des Objekts mit den Werten des übergebenen
	Objekts belegen.
	@param {PDObject} pdo Objekt, dessen Werte übernommen werden
	sollen. Beide Objekte müssen von der selben Klasse sein!
	@throws {PDException}
	*/
	setAttributes : function(pdo)
	{
		if(!pdo || !JafWeb.isPDObject(pdo)
				|| pdo.classname != this.classname)
			return;
		for(var attr in this)
		{
			// diese duerfen nicht kopiert werden
			if(attr == "_allowEdit"
					|| attr == "_allowDelete"
					|| attr == "_lastMsg"
					|| attr == "retcode"
					|| attr == "function"
					|| attr == "classname"
					|| attr == "cid" || attr == "oid"
					|| attr == "oidHi" || attr == "oidLow" || attr == "pid"
					|| attr == "_lockid" || attr == "_realOidLow"
					|| attr == "_tid"
					|| attr == "_statusCache"
					|| attr == "_md5"
					|| attr == "_isnew"
					|| attr == "_modified" || attr == "_ismodified"
					|| attr == "_isTrans"
					|| attr == "_deleted"
					|| attr == "_depDelete"
					|| attr == "_connected"
					|| attr == "_disconnected"
					|| attr == "PDClass")
				continue;
			if(!this.hasOwnProperty(attr) ||
					(typeof this[attr] == 'function') ||
					attr.substr(0, 4) == '__f_')
				continue;
			var tmp = pdo.getAttribute(attr);
			var flags = pdo.retcode;
			// TODO: Serials ausnehmen
			var tmpRetcode = 0;
			if((flags & PDObjectFlags.Available)
					&& !(flags & PDObjectFlags.Key)
					&& !(flags & PDObjectFlags.ReadOnly))
			{
				var f = this.setAttribute(attr, tmp);
				this._modified = true;
				if(f != 0)
					tmpRetcode = f;
			}
			this.retcode = tmpRetcode;
		}
		return this.retcode;
	},

	/**
	@memberof PDObject
	@function copy
	@desc Ein {@link PDObject} in dieses {@link PDObject} kopieren. Es werden
	die Attributwerte des übergebenen Objekts in dieses übertragen.
	@param {PDObject} pdo Objekt, das kopiert werden soll.
	Beide Objekte müssen von der selben Klasse sein!
	@throws {PDException}
	*/
	copy : function(pdo)
	{
		this.setAttributes(pdo);
	},
	
	/**
	@memberof PDObject
	@function getFirstLink
	@desc Gibt ein über die angegebene Zu-1-Beziehung verbundenes
	<code>PDObject</code> zurück.
	@param {string} rolename Name der Beziehung.
	@param {boolean} [request=false] Wird hier <code>true</code> angegeben, wird
	das Beziehungsobjekt auf jeden Fall vom Server aktualisiert. Ansonsten
	erfolgt ein Server-Request nur, falls die Beziehung noch nicht lokal
	vorliegt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Objekt oder <code>null</code>, wenn
	keins verbunden ist.
	@throws {PDException}
	 */
	getFirstLink : function(rolename, request, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDObject.getFirstLink('"+rolename+"')");
		var self = this;
		this.retcode = 0;
		if(true === request || (typeof self[rolename] !== 'object'))
		{
			// vom Server PDObject holen
			var pars = new JParamPacker(JafWebAPI.PDObject.getFirstLink.eventName, this.PDClass);
			pars.addPDObjectByIds(self);
			pars.add(JafWebAPI.PDObject.getFirstLink.PAR_relname, rolename);
			var result = { };
			//JDebug.log(JDebug.DEBUG, "PDObject.getFirstLink(): Params: "+pars.toString());
			var pdClass = this.PDClass;
			var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.getFirstLink():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.getFirstLink()");
					result.obj = resp.getPDObject(JafWebAPI.PDObject.getFirstLink.PROP_relObj);
					result.flags = resp.getInt(JafWebAPI.PDObject.getFirstLink.PROP_flags);
					self[rolename] = result.obj;
					self['__f_'+rolename] = (result['flags'] || 0);
					if(typeof callback == 'function')
						callback((self[rolename] || null));
				};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
					if(typeof callback == 'function')
						callback();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "GET",
					async: (!!callback),
					params: pars.get(),
					disableCaching: true,
					scope: self,
					callerName: pars.getEventName(),
					success: successFn,
					failure: failureFn
				});
		}
		if(!callback)
			return (self[rolename] || null);
	},

	/**
	@memberof PDObject
	@function getConnectedObjects
	@desc Holt die über eine Beziehung verbundenen Fachkonzeptobjekte.
	@param {string} rolename Rollenname der Beziehung.
	@param {boolean} [infoOnly=false] <code>true</code> zeigt an, dass
	statt der PDObjects nur die <i>Object Idents</i> geholt werden sollen.
	@param {string[]} [attrs] Wird dieser Parameter angegeben, werden
	statt der PDObjects nur die angegebenen Attributwerte geholt.
	@param {Function} [callback] JavaScript-Funktion, die aufgerufen wird,
	wenn der Request zurückkommt. Die Funktion
	wird mit dem aktuellen <code>PDObject</code> als <code>this</code> und dem
	Ergebnis-Array als Parameter aufgerufen.
	@return {PDObject[]} Falls keine <code>callback</code>-Funktion angegeben wurde,
	wird ein Array mit den Beziehungsobjekten zurückgegeben. Ist ein Fehler
	aufgetreten, z.B. weil die Beziehung nicht existiert, so wird <code>null</code>
	zurückgegeben.
	@see [getExtent()]{@link PDObject#getExtent}.
	@throws {PDException}
	 */
	getConnectedObjects : function(rolename, infoOnly, attrs, callback)
	{
		var callb1 = callback;
		var callb2 = null;
		if(typeof callb1 == 'function')
			callb2 = function(res) { if(res && res.rows) callb1(res.rows); else callb1(null); };
		var result = this.getExtent(rolename, '', '', null, 0, -1, callb2, infoOnly, attrs);
		// wenn die PDObjects geholt wurden, Beziehung auch lokal fuellen
		if(!result || !result.rows)
			return null;
		if(!infoOnly && attrs == null)
			this[rolename] = result.rows;
		if(!callb2)
			return result.rows;
	},

	// Test:
	// PDClass.ptr("Customer",192).getConnectedObjects("to_Offer")
	/**
	@memberof PDObject
	@function getExtent
	@desc Gibt ein Array der über die angegebene Zu-N-Beziehung
	verbundenen PDObjects zurück.
	@param {string} rolename Rollenname der Beziehung.
	@param {string} [filter] Filter, der die Ergebnismenge einschränkt.
	@param {string} [sort] Sortierkriterium, nach dem die Ergebnismenge 
	ausgegeben werden soll.
	@param {PDObject} [thisPdo] <code>PDObject</code>, das als <code>this</code>-Objekt
	in dem Filterausdruck referenziert werden kann.
	@param {number} [blockSize=0] Blockgröße für virtualisierte Darstellung. Es werden
	dann immer nur der mit der <code>blockNo</code> angegebene Objektbereich
	geholt.
	@param {number} [blockNo=0] Nummer (0-basiert) des Blocks der geholt werden soll.
	@param {Function} [callbackFn] Hier kann eine JavaScript-Funktion angegeben
	werden, die ausgeführt werden soll, wenn der Request zurückkommt.
	In diesem Fall wird der Request asynchron ausgeführt und anschließend die
	hier übergebene Funktion mit dem als Rückgabe beschriebenen Objekt sowie dem
	aktuellen {@link PDObject} als <code>this</code> aufgerufen.
	Ist dieser Parameter dagegen nicht angegeben, wird der Request dagegen synchron
	ausgeführt und das Ergebnis direkt zurückgegeben.
	@param {boolean} [infoOnly=false] <code>true</code> zeigt an, dass
	statt der PDObjects nur die Object Idents geholt werden sollen.
	@param {string[]} [attrs] Wird dieser Parameter angegeben, werden
	statt der PDObjects nur die angegebenen Attributwerte geholt.
	@return {Object} Bei synchroner Ausführung ein Objekt mit folgenden Properties:
	 <ul>
	 	<li><code>blockSize</code> (number): Gibt die aktuelle Blockgröße an, wenn das Ergebnis
	 		virtualisiert, d.h. blockweise ausgegeben wird. Falls nicht blockweise ausgegeben wird,
	 		lautet der Wert <code>0</code>.
	 	<li><code>blockNo</code> (number): Gibt in der virtualisierten Ausgabe den (0-basierten)
	 		Index des aktuellen Blocks an.
	 	<li><code>total</code> (number): Gibt die Gesamtzahl der verbundenen Objekte an. Durch die
	 		Virtualisierung kann diese Zahl von der Anzahl der hier dargestellten Objekte
	 		(<code>rows.length</code>) abweichen.
	 	<li><code>rows</code> ([PDObject[]]{@link PDObject}): Die in diesem Block dargestellten
			Fachkonzeptobjekte.
	 		Falls kein Objekt verbunden ist, ist das Array leer.
		<li><code>retCode</code> (number): Fehler-Code.
		<li><code>errorMessage</code> (string): Fehlertext, falls <code>retCode</code> ungleich 0 ist.
	 </ul>
	@throws {PDException}
	 */
	getExtent : function(rolename, filter, sort, thisPdo, blockSize, blockNo, callback, infoOnly, attrs)
	{
		this.retcode = 0;
		var sFilter = "";
		var sSort = "";
		var thisObject = null;
		var bInfoOnly = false;
		var fCallback = null;
		var aAttrs = null;
		var blSize = 0;
		var blNo = 0;
		var pos = 1;
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			sFilter = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			sSort = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (arguments[pos] === null || (arguments[pos] instanceof PDObject)))
		{
			if(arguments[pos] > 0)
				thisObject = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			blSize = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			if(blSize > 0)
				blNo = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (arguments[pos] == null || typeof arguments[pos] == "function"))
		{
			fCallback = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			bInfoOnly = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && arguments[pos] && (typeof arguments[pos] == "object" ||
				typeof arguments[pos] == "string"))
			aAttrs = arguments[pos];
		// wenn die PDObjects noch nicht lokal vorliegen, diese 
		// erst holen!
		var pars = new JParamPacker(JafWebAPI.PDObject.getExtent.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.getExtent.PAR_relname, rolename);
		pars.add(JafWebAPI.PDObject.getExtent.PAR_filter, sFilter);
		pars.add(JafWebAPI.PDObject.getExtent.PAR_sort, sSort);
		if(blSize > 0)
		{
			pars.add(JafWebAPI.PDObject.getExtent.PAR_blockSize, blSize);
			pars.add(JafWebAPI.PDObject.getExtent.PAR_blockNo, blNo);
		}
		// TODO: thisObject
		if(bInfoOnly == true)
		{
			pars.add(JafWebAPI.PDObject.getExtent.PAR_infoOnly, true);
			if(aAttrs && typeof aAttrs == "string")
				pars.add(JafWebAPI.PDObject.getExtent.PAR_info, aAttrs);
		}
		else if(aAttrs)
		{
			for(var i=0; i<aAttrs.length; i++)
				pars.add(JafWebAPI.PDObject.getExtent.PAR_attr + i, aAttrs[i]);
		}
		// TODO: Menge (Blockgroesse) begrenzen?
		//JDebug.log(JDebug.DEBUG, "PDObject.getExtent(): Params: "+pars.toString());
		var result = new Object();
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
					{
						result.retCode = -1;
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.getExtent():\n"+resp.getResponseText());
					}
					result.retCode = resp.getInt('retCode', -1);
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.getExtent()");
					// out-Array fuellen
					/*if(bInfoOnly == true || aAttrs != null)
						result.rows = resp.getArray(JafWebAPI.PDObject.getExtent.PROP_rows,
							[], 'object', []); // TODO: das sollte in JEDEM Fall als PDObject zurueckgegeben werden!
					else*/
					{
						result.rows = resp.getArray(JafWebAPI.PDObject.getExtent.PROP_rows,
							[], 'PDObject', null);
					}
					result.blockSize = resp.getInt(JafWebAPI.PDObject.getExtent.PROP_blockSize, -1);
					result.blockNo = resp.getInt(JafWebAPI.PDObject.getExtent.PROP_blockNo, 0);
					result.total = resp.getInt(JafWebAPI.PDObject.getExtent.PROP_total, -1);
					if(!bInfoOnly && aAttrs == null)
						this[rolename] = result.rows;
					if(typeof fCallback == "function")
					{
						//fCallback(outStr, outPdo, this.retcode);
						fCallback.call(this, result);
					}
				};
		var failureFn = function(response, opts) {
				if(typeof fCallback == 'function')
					fCallback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST", // weil der Filter extrem lang werden kann!
				async: (!!fCallback),
				params: pars.getPostParams(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		// wenn die PDObjects geholt wurden, Beziehung auch lokal fuellen
		if(!bInfoOnly && aAttrs == null)
			this[rolename] = result.rows;
		if(!fCallback)
			return result;
	},

	/**
	@memberof PDObject
	@function getConnectedOids
	@desc Gibt ein Array der über die angegebene Zu-N-Beziehung
	verbundenen Objekt-Ids zurück.
	@param {string} rolename Rollenname der Beziehung.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Array} Array von OIDs (String) aller Objekte, die 
	über die Beziehung mit dem aktuellen Objekt verbunden sind. 
	Falls kein Objekt verbunden ist, wird ein leeres Array 
	zurückgegeben.
	@throws {PDException}
	 */
	getConnectedOids : function(rolename, callback)
	{
		this.retcode = 0;
		var res = new Array();
		// nur die OIDs vom Server holen:
		// PDObject holen, falls noch nicht lokal
		var pars = new JParamPacker(JafWebAPI.PDObject.getConnectedOids.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.getConnectedOids.PAR_relname, rolename);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.getConnectedOids(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var res = null;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.getConnectedOids():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.getConnectedOids()");
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					res = resp.getArray(JafWebAPI.PDObject.getConnectedOids.PROP_oids, [], 'string', '');
					if(typeof callback == 'function')
						callback(res);
				};
		var failureFn = function(response, opts) {
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				disableCaching: true,
				callerName: pars.getEventName(),
				scope: this,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return res;
	},
	
	/**
	@memberof PDObject
	@function setDeleted
	@deprecated Bitte nicht mehr verwenden!
	@desc Das Objekt als gelöscht markieren. Beim nächsten
	Speichervorgang wird das Objekt auf dem Server
	gelöscht.
	@see [registerDependentDeletion()]{@link PDObject#registerDependentDeletion}
	 */
	setDeleted : function()
	{
		this.retcode = 0;
		this._deleted = true;
	},

	/**
	@memberof PDObject
	@function setDisconnected
	@deprecated Bitte nicht mehr verwenden!
	@desc Das Objekt in einer Beziehung als getrennt markieren.
	Beim nächsten Speichervorgang wird das Objekt auf dem Server
	aus der Beziehung entfernt.
	 */
	setDisconnected : function()
	{
		this.retcode = 0;
		this._deleted = true;
		this._disconnected = true;
	},

	/**
	@memberof PDObject
	@function registerDependentDeletion
	@deprecated Bitte nicht mehr verwenden!
	@desc Ein Objekt als zu löschen registrieren, sobald ein verbundenes
	Objekt gespeichert oder gelöscht wird. Das tritt z.B.
	auf, wenn von diesem Objekt ausgehend eines seiner
	Beziehungsobjekt gelöscht wird. Dann kann das erst
	Server-seitig gelöscht werden, wenn dieses Objekt
	entweder selbst ebenfalls gelöscht oder aber die Trennung
	der Beziehung zum gelöschten Objekt durch Speichern
	bestätigt wird. Andernfalls würde es möglich, dass eine 
	Beziehung zu einem bereits gelöschten Objekt bestehen
	bleibt.
	@param {PDObject} obj Das Objekt, das als zu löschen
	registriert werden soll.
	 */
	registerDependentDeletion : function(obj)
	{
		this.retcode = 0;
		if(!obj)
			return;
		obj._deleted = true;
		if(obj.isNew())
			return;
		this._depDelete[this._depDelete.length] = obj.getPDObjectId();
		// die Attribute koennten hier auch raus
	},
	
	/**
	@memberof PDObject
	@function getEnumConst
	@desc Die möglichen Werte für ein Attribut vom Typ <code>enum</code> ermitteln.<br/>
	<span class="important">Hinweis:</span> Da im JANUS-Umfeld die Werte von Enum-Attributen über den ergonomischen
	Bezeichner der Ausprägung in der ersten Sprache gesetzt wird, enthalten hier
	die Properties <code>code</code> und <code>text</code> den gleichen Wert.
	@param {string} attr Name des Attributs, das den Aufzählungstypen verwendet.
	@param {boolean} [withIcons=false] Legt fest, ob auch die den Ausprägungen zugewiesenen
	Icons ermittelt werden sollen. Standardwert ist <code>false</code>. Beachten Sie,
	dass, falls hier <code>true</code> angegeben wird, die Rückgabe eine andere
	Struktur hat.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Array} Array mit den Objekten für die Ausprägungen. Diese haben folgende
	Properties:
 		<ul>
 			<li><code>code</code> Technischer Name der Enum-Ausprägung.
 			<li><code>icon</code> Optionale Angabe eines Web-Icons, das für die
 				Ausprägung angezeigt werden soll. Image-Pfad und Name,
 				relativ ab dem Image-Verzeichnis der Web-Anwendung.
 			<li><code>text</code> Der für die Enum-Konstante auf der Oberfläche
 				anzuzeigende Text.
 		</ul>
	@throws {PDException}
	 */
	getEnumConst : function(attr, withIcons, callback)
	{
		var clName = this.GetClass();
		var enumName = this.PDClass.PDMeta.getType(clName, attr);
		if(this.PDClass.PDMeta['_enumCache'])
		{
			var consts = this.PDClass.PDMeta['_enumCache'][enumName];
			if(consts)
			{
				var result = [];
				for(var i = 0; i < consts.length; i++)
				{
					result.push({
							code: consts[i]['text'], // Workaround - s. redmine #14317!
							tech: consts[i]['tech'],
							icon: (consts[i]['icon'] || ''),
							text: consts[i]['text']
						});
				}
				if(typeof callback == 'function')
				{
					callback(result);
					return;
				}
				return result;
			}
		}
		var pars = new JParamPacker(JafWebAPI.PDObject.getEnumConst.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.getEnumConst.PAR_attr, (attr || ''));
		pars.add(JafWebAPI.PDObject.getEnumConst.PAR_icns, (withIcons === true));
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.getEnumConst(): Params: "+pars.toString());
		var res = null;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDObject.getEnumConst():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.getEnumConst()");
				var vals = resp.getArray(JafWebAPI.PDObject.getEnumConst.PROP_res, [], 'string', '');
				var icns = resp.getArray(JafWebAPI.PDObject.getEnumConst.PROP_icons, [], 'string', '');
				var extensible = resp.getBool(JafWebAPI.PDObject.getEnumConst.PROP_extensible, false);
				res = new Array();
				for(var i = 0; i < vals.length; i++)
				{
					res.push({
							'code': vals[i],
							'text': vals[i],
							'icon': (icns[i] || '')
						});
				}
				if(typeof callback == 'function')
					callback(res);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		/*if(result.length != res.length)
			console.error("PDObject.getEnumConst() - cached result differs from that one got from the server", result, res);
		else for(var j=0; j < result.length && j < res.length; j++)
		{
			if(result[j].code != res[j].code || result[j].value != res[j].value || result[j].icon != res[j].icon)
			{
				console.error("PDObject.getEnumConst() - cached result differs from that one got from the server", result, res);
				break;
			}
		}*/
		if(!callback)
			return res;
	},
	
	/**
	@memberof PDObject
	@function getStatus
	@desc Statuszeile zusammenstellen. Mit dieser Funktion kann eine
	Zeichenkette zusammengestellt werden, die beliebige Attributwerte
	beinhalten kann. Hiermit kann z.B. eine Statuszeile gefüllt werden.<br/>
	<span class="important">Hinweis:</span> Die Ersetzung erfolgt immer auf dem Server.
	@param {string} pattern Hier wird eine Zeichenkette angegeben, die
	das Format des Rückgabe-Strings beschreibt.
	Es können beliebige der folgenden Platzhalter enthalten sein, die
	durch entsprechende Werte ersetzt werden. Der übrige Text wird
	unverändert zurückgegeben.
	Ein Prozentzeichen leitet einen Platzhalter ein. Nach dem
	Prozentzeichen kann ein Kennbuchstabe mit direkt angefügtem Attributnamen
	folgen. Das Ende des Attributnamens muss durch ein weiteres Prozentzeichen
	angekündigt werden.<br/>
	Folgende Steuersequenzen zur Bezugnahme auf Attribute werden
	derzeit unterstützt, wobei "Attr" dem technischen Attributnamen
	entspricht:
	<ul>
		<li><code>\%aAttr\%</code> Der Wert des Attributs. Hierbei können auch
		Attribute anderer Klassen, die über eine zu-1-Beziehung
		erreichbar sind, referenziert werden.</li>
		<li><code>\%eAttr\%</code> Der ergonomische Name des Attributs, siehe
		[PDMeta.getErgname()]{@link PDMeta#getErgname}. Es
		kann auch ein qualifizierter Name in der Form "Klasse::Attribut"
		angegeben werden.</li>
		<li><code>\%EAttr\%</code> Der ergonomische Name des Attributs (Listenversion),
		siehe [PDMeta.getListErgname()]{@link PDMeta#getListErgname}. Es
		kann auch ein qualifizierter Name in der Form "Klasse::Attribut"
		angegeben werden.</li>
		<li><code>\%dAttr\%</code> Eine Beschreibung des Attributs, siehe
		[PDMeta.getDescription()]{@link PDMeta#getDescription}. Es
		kann auch ein qualifizierter Name in der Form "Klasse::Attribut"
		angegeben werden.</li>
		<li><code>\%sAttr\%</code> Eine Kurzbeschreibung des Attributs,
		siehe [PDMeta.getDescription()]{@link PDMeta#getDescription}. Es
		kann auch ein qualifizierter Name in der Form "Klasse::Attribut"
		angegeben werden.</li>
		<li><code>\%SString\%</code> Ein Attribut einer Textklasse (Stereotyp <code>Text</code>) oder
		eine mehrsprachige Zeichenkette aus <code>strings.txt</code>.
		Über <code>\%SText::Text1\%</code> kann z.B. der
		Bezeichner "Text1" aus der Textklasse
		"Text" in der aktuellen Sprache referenziert werden.</li>
	</ul>
	Darüber hinaus existieren einige spezielle Steuersequenzen,
	die direkt nach einem Prozentzeichen folgen können. Hier
	muss kein zweites Prozentzeichen angegeben werden:
	<ul>
		<li><code>\%U</code>: Name des Benutzers, der das Objekt angelegt hat.</li>
		<li><code>\%u</code>: Name des Benutzers, der das Objekt zuletzt geändert hat.</li>
		<li><code>p</code>: Name des Mandanten, dem das Objekt zugeordnet ist.
		Ist die Anwendung nicht mandantenfähig oder
		gehört das Objekt zu keinem Mandanten, ist der Name
		eine leere Zeichenkette.</li>
		<li><code>\%m</code>: Ist der aktuelle Mandant nicht gleich dem Mandanten,
		von dem das Objekt erzeugt wurde, wird dies durch
		den Mandantennamen gefolgt von ": " ersetzt.</li>
		<li><code>\%CD</code>: Datum, an dem das Objekt erzeugt wurde.</li>
		<li><code>\%cd</code>: Datum, an dem das Objekt zuletzt geändert wurde.</li>
		<li><code>\%CT</code>: Uhrzeit der Objekterzeugung.</li>
		<li><code>\%ct</code>: Uhrzeit der letzten Änderung.</li>
		<li><code>\%cl</code>: Der ergonomische Name der Klasse, zu der das Objekt gehört.</li>
		<li><code>\%i</code>: Das Ergebnis des Aufrufs der Operation <code>getIdentifier()</code>
		wird hier eingesetzt. Das entspricht normalerweise dem
		Titel des Dialogs, der für die Anzeige im GUI-Client
		verwendet wird.</li>
		<li><code>\%date</code>: Das aktuelle Datum wird eingesetzt.</li>
		<li><code>\%time</code>: Die aktuelle Uhrzeit wird eingesetzt.</li>
		<li><code>\%timestamp</code>: Der aktuelle Zeitstempel wird eingesetzt.</li>
	</ul>
	Ist der Parameter leer oder nicht angegeben, wird der
	<i>Object Identifier</i> wie im UML-Modell
	spezifiziert zurückgegeben (was einem Aufruf von
	[getAttribute('')]{@link PDObject#getAttribute} - mit
	leerem ersten Parameter - entspricht).
	@param {boolean} [request=false] Wird hier <code>true</code> angegeben, wird
	der Wert auf jeden Fall vom Server aktualisiert. Ansonsten wird versucht,
	einen bereits ermittelten Wert aus einem objektinternen Zwischenspeicher zu
	holen und nur ein Request abgesetzt, wenn das nicht möglich ist.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Das Ergebnis der Ersetzung.
	@see Die gleichnamiger Methode der JANUS Server Library.
	@throws {PDException}
	 */
	getStatus : function(pattern, request, callback)
	{
		if(!pattern)
		{
			var ident = this.getAttribute(''); // TODO: asynchron
			if(typeof callback == 'function')
			{
				callback(ident);
				return;
			}
			return ident;
		}
		var cachedRes = '';
		if(!request)
		{
			cachedRes = (this._statusCache[pattern] || '');
			if(cachedRes)
			{
				//console.log("### got status string from cache: ", cachedRes);
				if(typeof callback == 'function')
				{
					callback(cachedRes);
					return;
				}
				return cachedRes;
			}
		}
		//JDebug.log(JDebug.WARN, 'PDObject.getStatus('+pattern+')');
		var res = '';
		var pars = new JParamPacker(JafWebAPI.PDObject.getStatus.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.getStatus.PAR_patt, pattern);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.getAttribute(): Params: "+pars.toString());
		this.retcode = 0;
		res = '';
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDObject.getStatus():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.getStatus()");
				res = resp.getString(JafWebAPI.PDObject.getStatus.PROP_value);
				this._statusCache[pattern] = res;
				//console.log("### added status string to cache: ", res);
				if(typeof callback == 'function')
					callback(res);
			};
		var failureFn = function(response, opts) {
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: (!!callback),
				params: pars.getPostParams(),
				disableCaching: true,
				scope: this,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		/*if(cachedRes)
		{
			if(cachedRes !== res)
				console.error("PDObject.getStatus() - cached result differs from that on got from the server", cachedRes, res);
		}*/
		if(!callback)
			return res;
	},
	
	/**
	@memberof PDObject
	@function moveInRelation
	@desc Bewegen von einem oder mehreren Fachkonzeptobjekten in einer <i>Orderable</i>-Beziehung.
	@param {string} relname Name der Beziehung, in der die Elemente verschoben werden sollen.
	@param {mixed} objs Array von <code>PDObject</code>s oder Objekt-IDs (unterer Teil).
	Alternativ kann auch ein <code>PDObject</code> oder eine Objekt-ID angegeben werden.
	@param {number} idx Der 0-basiert Index im gesamten Extent, an den das bzw. die
	Objekte verschoben werden sollen.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {mixed} Im Fehlerfall wird ein Fehlertext zurückgegeben, sonst <code>0</code>.
	@throws {PDException}
	 */
	moveInRelation : function(relname, objs, idx, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDObject.moveInRelation.eventName, this.PDClass);
		pars.addPDObjectByIds(this);
		pars.add(JafWebAPI.PDObject.moveInRelation.PAR_relname, relname);
		var _objs = [ ];
		if(JafWeb.isArray(objs))
		{
			for(var i=0; i < objs.length; i++)
			{
				if(!objs[i])
					continue;
				if(typeof objs[i] == 'number')
					_objs.push(objs[i]);
				else if(typeof objs[i] == 'object' && objs[i].oidLow)
					_objs.push(objs[i].oidLow);
			}
		}
		else if(typeof objs == 'number')
			_objs.push(objs);
		else if(typeof objs == 'object' && objs.oidLow)
			_objs.push(objs.oidLow);
		pars.add(JafWebAPI.PDObject.moveInRelation.PAR_oids, _objs.join(','));
		pars.add(JafWebAPI.PDObject.moveInRelation.PAR_idx, idx);
		//pars.add("relname", relName);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDObject.moveInRelation(): Params: "+pars.toString());
		var result = -1;
		var pdClass = this.PDClass;
		var thisObj = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDObject.moveInRelation():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDObject.moveInRelation()");
					result = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(result > 0)
						result = resp.getString(JafWebAPI.PDObject.moveInRelation.PROP_retMsg);
					else
						thisObj.handleChanged(relname);
					if(typeof callback == 'function')
						callback();
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: (!!callback),
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		return result;
	},
	
	/**
	@memberof PDObject
	@function downloadDocument
	@desc Die Datei zu einem Attribut vom Typ <code>Document</code> herunterladen.
	@param {string} attr Der Name des Attributs.
	 */
	downloadDocument : function(attr)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.jexecDownload.eventName);
		var obj = this;
		if(obj)
		{
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_cid, obj.cid);
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_clName, obj.classname);
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_oid, obj.GetPDObjectIdLow());
		}
		pars.add(JafWebAPI.PDClass.jexecDownload.PAR_attr, attr);
		var url = this.PDClass.getDownloadURL() +
					"?janusFileOperation=downloadWebEvent&iid=" + this.PDClass.PDMeta.getInstanceID() +
					"&sessionId=" + this.PDClass.getAuthToken() +
					"&janusWebEvent=" + pars.getEventString(true);
		window.open(url);
	}

	/// weitere?:
	// isUnique() - fuer Beziehungen, vgl. PDClass.isUnique()
	// isConnected()
	// getMD5()
	// markModified()
	// isModified()
	// 
};


var PDGroupInfo = Class.create();
/**
 * @class PDGroupInfo
 * @desc Browser-seitige Repräsentation der Klasse <code>PDGroupInfo</code>
 * zur Verwaltung von Gruppierungsinformationen für Extent- und
 * Beziehungstabellen.
 * @author Frank Fiolka
 */
PDGroupInfo.prototype = 
{
	/**
	@constructs PDGroupInfo
	@desc Erzeugt das Gruppierungsobjekt.<br/>
	Objekte dieser Klasse sollten normalerweise nicht manuell
	angelegt werden, sondern entstehen beim Aufruf von
	[PDObject.getExtentGroups()]{@link PDObject#getExtentGroups} bzw.
	[PDClass.getExtentGroups()]{@link PDClass#getExtentGroups}.
	@param {string} filter Vollständiger JANUS-Filterausdruck, mit dem
	der Gruppeninhalt angefordert werden kann. Ein ggf. für die gesamte
	Tabelle eingestellter Filter ist hier bereits enthalten.
	@param {string} value Wert des gruppierten Attributs in dieser Gruppe. Falls
	nach mehreren Attributen gruppiert wurde, sind die Werte durch Kommata
	verkettet.
	@param {number} count Anzahl der in der Gruppe enthaltenen Elemente.
	 */
	initialize : function(filter, value, count)
	{
		this._filter = filter||"";
		this._value = value||"";
		this._count = count||0;
		this.PDClass = null;
	},
	
	/**
	@memberof PDGroupInfo
	@function getValue
	@desc Gibt den in dieser Gruppe vorliegenden Wert der 
	Gruppierungsattribute zurück. Falls nach mehreren
	Attributen gruppiert wurde, sind die Werte der einzelnen
	Attribute durch Kommata verkettet.
	@return {string} Zeichenkette mit den Attributwerten
	der Gruppe.
	 */
	getValue : function()
	{
		return this._value;
	},
	
	/**
	@memberof PDGroupInfo
	@function getFilter
	@desc Gibt den vollständigen Filterausdruck zurück, mit dem
	die zu dieser Gruppe gehörenden Objekte geholt werden 
	können. Filter, die bereits bei der Gruppierungsabfrage
	angegeben wurden, sind hierin bereits enthalten.
	@return {string} Fertig zusammengesetzter Filter zur
	Übergabe an den JANUS-Server.
	 */
	getFilter : function()
	{
		return this._filter;
	},
	
	/**
	@memberof PDGroupInfo
	@function getCount
	@desc Gibt die Anzahl der in der Gruppe enthaltenen Fachkonzeptobjekte
	zurück.<br/>
	<span class="important">Hinweis:</span> Da die Abfrage der Gruppierung und das Laden der Fachkonzeptobjekte
	entkoppelt sind, kann es passieren, dass die hier gespeicherte Anzahl
	der Objekte von der dann tatsächlich mit dem Filterausdruck geladenen
	Anzahl abweicht.
	@return {number} Anzahl der Fachkonzeptobjekte in der Gruppe. Diese
	können mit dem über <code>getFilter()</code> abfragbaren Selektionsausdruck
	geholt werden.
	 */
	getCount : function()
	{
		return this._count;
	},
	
	/*
	@memberof PDGroupInfo
	@function update
	@desc Aktualisiert die Anzahl der in dieser Gruppe enthaltenen
	Fachkonzeptobjekte.
	@return {number} Die neue Anzahl. Falls die Gruppe leer ist,
	wird 0 zurückgegeben, womit die Gruppierungsinformation
	eigentlich überflüssig ist. Bei erneuter Gruppierung würde
	sie dann nicht mehr auftauchen.
	@todo Implementierung
	 */
	update : function()
	{
		// TODO
	}
};



var PDClassClass = Class.create();
/**
 * @class PDClass
 * @desc Browser-seitige Repräsentation der JANUS-Laufzeit-Klasse
 * <code>PDClass</code>.
 * Diese Klasse ist über eine globale Variable ihres Namens zugänglich.
 * Es kann damit von überall her darauf zugegriffen werden,
 * beispielsweise um ein neues Objekt anzulegen.
 * @author Frank Fiolka
 @example
var myObject = PDClass.newObject("MyClass");
 */
PDClassClass.prototype =
{
	/// Erzeugt die Instanz. (Kein oeffentlicher Konstruktor!)
	/*
	@ignore(true)
	@constructs PDClass
	@desc Dieser Konstruktor sollte niemals aufgerufen werden.
	Eine Instanz dieser Klasse steht unter deren Namen global
	zur Verfügung.
	*/
	initialize : function(url, downloadUrl, uploadUrl, authToken, logoutEvt, useCache)
	{
		// vgl. include/jlimit.h
		this.NON_INT = -2147483647;
		this.NON_UINT = 4294967295;
		this.NON_SHORT = -32768;
		this.NON_USHORT = 65535;
		//this.NON_FLOAT = DBL_MAX; // ??? TODO
		
		this.isClientServer = true;

		// speichert den jeweils letzten Rueckgabecode
		// einer Operation
		this.retcode = 0;
		// letzter Meldungstext
		this._lastMsg = '';

		// Server-Verbindung dieser PDClass-Instanz:
		this._url = (url || '');
		this._dwnlUrl = (downloadUrl || '');
		this._uplUrl = (uploadUrl || '');
		this._authToken = (authToken || '');
		this._logoutEvt = (logoutEvt || '');
		this._usePDObjectCache = (useCache !== false);
	},
	
	/**
	@memberof PDClass
	@desc Speichert den Rückgabe-Code der jeweils zuletzt
	aufgerufenen Funktion.
	@member {number}
	 */
	retcode : 0,
	/*
	@ignore(true)
	Rückgabemeldung der zuletzt aufgerufenen Funktion.
	@member {string}
	 */
	_lastMsg : "",
	
	// Arrays fuer Aufnahme der Handler zur Aenderungsueberwachung
	_evtHandler : null,
	
	// Member zur Unterstuetzung mehrerer PD-Instanzen
	// (eine pro Verbindung)
	_url: '',
	_dwnlUrl: '',
	_uplUrl: '',
	_authToken: '',
	_logoutEvt: '',
	_usePDObjectCache: false,
	
	/**
	@memberof PDClass
	@function createIterator
	@desc Erzeugt ein {@link PDIterator}-Objekt. Wenn Sie das JafWeb in mehreren
	Instanzen benutzen, müssen Sie, um einen gültigen Iterator zu bekommen, diesen
	nicht mit <code>new</code> direkt erzeugen, sondern über diese Funktion!<br/>
	Baechten Sie aber, das es im Web normalerweise nicht sinnvoll ist, Iteratoren
	zu benutzen; damit werden unnötig viele Requests ausgelöst. Benutzen Sie
	stattdessen [PDClass.getExtent()]{@link PDClass#getExtent} (für Klassen-Extents)
	bzw. [PDObject.getExtent()]{@link PDObject#getExtent} (für Zu-N-Beziehungen), um
	blockweise Objekte aus der Ergebnismenge zu holen.
	@param {PDObject} rootObj (optional) Fachkonzeptobjekt, von dem aus über eine
	Beziehung iteriert werden soll. Falls stattdessen über einen
	Extent iteriert werden soll, entfällt dieser Parameter.
	@param {string} name Der Name der Fachkonzeptklasse, wenn es sich
	um einen Extent-Iterator handelt. Wenn stattdessen über eine Beziehung
	iteriert werden soll (Fachkonzeptobjekt als erster Paremter), handelt
	es sich hier um den Namen der Beziehung, über die iteriert werden
	soll.
	@param {string} filter (optional) JANUS-Filterausdruck, um die
	von dem Iterator gelieferte Ergebnismenge einzuschränken.
	@param {string} sort JANUS-Sortierausdruck.
	@param {PDObject} thisObj (optional) Fachkonzeptobjekt, das im Filterausdruck
	über das Schlüsselwort <code>this</code> referenziert werden kann.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Der Iterator.
	@throws {PDException}
	 */
	createIterator : function(rootObj, name, filter, sort, thisObj, callback)
	{
		return new PDIterator(rootObj, name, filter, sort, thisObj, callback, this);
	},
	
	/**
	@memberof PDClass
	@function getUrl
	@desc Gibt die AJAX-Request-URL zum mit dieser PD-Instanz
	verbundenen Server zurück.
	@return {string} Die URL.
	 */
	getURL : function()
	{ return this._url; },
	
	/**
	@memberof PDClass
	@function getDownloadURL
	@desc Gibt die Download-URL zum mit dieser PD-Instanz
	verbundenen Server zurück.
	@return {string} Die URL.
	 */
	getDownloadURL : function()
	{ return this._dwnlUrl; },

	/**
	@memberof PDClass
	@function getUploadURL
	@desc Gibt die Datei-Upload-URL zum mit dieser PD-Instanz
	verbundenen Server zurück.
	@return {string} Die URL.
	 */
	getUploadURL : function()
	{ return this._uplUrl; },
	
	/**
	@memberof PDClass
	@function getAuthToken
	@desc Gibt das Authentifizierungs-Token für die von der aktuellen
	Instanz benutzte Server-Verbindung zurück.
	@return {string} Das Token.
	 */
	getAuthToken : function()
	{ return this._authToken; },
	
	/**
	@memberof PDClass
	@function getLogoutEvent
	@desc Den Logout-Event-Namen abfragen.
	@return {string} Der Name.
	 */
	getLogoutEvent : function()
	{ return this._logoutEvt; },
	
	/**
	@memberof PDClass
	@function usePDObjectCache
	@desc Fragt ab, ob diese PD-Instanz einen zentralen Cache
	für die [PDObjects]{@link PDObject} beuutzt.
	@return {boolean}
	*/
	usePDObjectCache : function()
	{ return this._usePDObjectCache; },
	
	/**
	@memberof PDClass
	@function getReturnCode
	@desc Gibt den Rückgabe-Code der zuletzt aufgerufenen Funktion
	zurück.
	@return {number} Der Code.
	 */
	getReturnCode : function()
	{ return this.retcode; },
	/**
	@memberof PDClass
	@function getLastMessage
	@desc Gibt die zuletzt gespeicherte Fehlermeldung zurück.
	@return {string} Der Fehlertext.
	 */
	getLastMessage : function()
	{ return this._lastMsg; },

	/**
	 * @memberof PDClass
	 * @function toPDObject
	 * @desc Ein <code>PDObject</code> aus einem JSON-String
	 * wiederherstellen (deserialisieren und instantiieren).
	 * @param {string} json Der JSON-String, der das
	 * <code>PDObject</code> beschreibt.
	 * @return {PDObject} Das aus der Zeichenkette 
	 * erzeugte {@link PDObject}.
	 */
	toPDObject : function(json)
	{
		//JDebug.log(JDebug.DEBUG, "PDClass.toPDObject("+json+")");
		var jsonObj = null;
		if(typeof json == "string")
		{
			try
			{
				eval("var jsonObj = "+json+";");
				if(typeof jsonObj != "object")
					return null; 
			}
			catch(ex)
			{
				JDebug.log(JDebug.WARN, "PDClass.toPDObject(): jsonStr not valid:\n"+json);
				return null;
			}
		}
		else
			jsonObj = json;
		if(!jsonObj)
			return null;
		//return new PDObject(jsonObj);
		var tmpOidHi = 0;
		var tmpOidLo = 0;
		if(typeof jsonObj['oidHi'] == 'number' && typeof jsonObj['oidLow'] == 'number')
		{
			tmpOidHi = jsonObj.oidHi;
			tmpOidLo = jsonObj.oidLow;
		}
		else
		{
			tmpOidHi = OID_HI(jsonObj.oid);
			tmpOidLo = OID_LO(jsonObj.oid);
		}
		var rootObj = null;
		var inCache = false;
		if(this.usePDObjectCache() && tmpOidHi && tmpOidLo)
			rootObj = this.PDObjectCache.get(tmpOidHi, tmpOidLo);
		if(rootObj)
			inCache = true;
		else
			rootObj = new PDObject(this);
		rootObj = rootObj._setValues(jsonObj);
		// PDObject-Cache-Verwaltung
		if(!inCache || !this.usePDObjectCache())
		{
			// mit den fachlichen Funktionen "dekorieren"
			if(jsonObj && JafWeb.PD[jsonObj.classname + '__mem'])
				JafWeb.apply(rootObj, JafWeb.PD[jsonObj.classname + '__mem']); // nur die Member-Funktionen einhaengen
			if(this.usePDObjectCache())
				this.PDObjectCache.add(rootObj);
		}
		return rootObj;
	},

	/// Redefinierbare Funktionen, mit denen sich PDClass-Abfragen manipulieren lassen.
	/**
	@memberof PDClass
	@function onGetGlobalEnumConst
	@desc Redefinieren Sie diese Funktion, wenn Sie die Ermittlung der Enum-Konstanten
	manipulieren möchten. Es werden die möglichen Werte und deren Codes eines
	global erweiterbaren oder eines nicht erweiterbaren Aufzählungstyps ermittelt.<br/>
	Global erweiterbare Aufzählungstypen zeichnen sich dadurch aus, dass 
	die von einem beliebigen Benutzer bei einer beliebigen Klasse oder einem 
	beliebigen Objekt eingetragenen Erweiterungen allen anderen Benutzern 
	überall zur Verfügung stehen.<br/>
	<span class="important">Hinweis:</span> Bitte beachten Sie, dass bei
	einem in mehreren Sprachen spezifizierten 
	Aufzählungstyp in der Liste <code>vals</code> pro Sprache und 
	Selektionsmöglichkeit ein Wert eingetragen wird, während in <code>codes</code> 
	und <code>active</code> nur ein Wert pro Selektionsmöglichkeit geschrieben 
	wird.
	@param {string} ename Name des auszulesenden Aufzählungstyps.
	@param {boolean} [icons=false] Zeigt an, dass auch die für die Enum-Ausprägungen
	definierten Icons ermittelt werden sollen (Standardwert <code>false</code>).
	@return {Object} JavaScript-Objekt mit folgenden Properties:
	<ul>
		<li><code>vals</code> Array von <code>String</code>, das die ausgelesenen
		Werte - ggf. in allen Sprachen - aufnimmt.</li>
		<li><code>codes</code> Array von <code>Number</code> mit den numerischen Codes
		der Ausprägungen.</li>
		<li><code>active</code> Array von <code>boolean</code>, in dem für die
		Ausprägung angezeigt wird, ob sie noch aktiv, d.h. nicht gelöscht ist.
		Bei einem nicht erweiterbaren Aufzählungstyp enthält die Liste nur
		<code>true</code>-Werte.</li>
		<li><code>icons</code> Array Falls der Parameter <code>icons</code> mit
		<code>true</code> angegeben wurde, ist dieses Array definiert und enthält
		für jede Enum-Ausprägung den Namen der Icon-Datei. Stellen Sie diesen
		Werten den von [UIApplication.getImageDir()]{@link UIApplication#getImageDir}
		gelieferten Pfad voran, um die Icons anzuzeigen. Die Icon-Dateien müssen
		im Web-Ressourcen-Verzeichnis zugänglich sein, um angezeigt werden zu können.</li>
		<li><code>result</code> number Wenn die Werte geholt werden konnten, steht hier <code>0</code>,
		ansonsten kann der Fehlercode mit <code>PDMeta.getString()</code> in 
		einen Text umgewandelt werden.</li>
	</ul>
	Wenn mit der Standardbehandlung fortgefahren werden soll, geben Sie
	<code>null</code> oder nichts zurück.
	@see [getGlobalEnumConst()]{@link PDClass#getGlobalEnumConst}
	*/
	onGetGlobalEnumConst : function(ename, icons)
	{ },

	// TODO: komplettieren


	/// Objekte anlegen und loeschen
	/**
	@memberof PDClass
	@function prepareDeletion
	@desc Löschen vorbereiten. Diese Funktion kann verwendet werden, um vor dem
	Löschen Informationen darüber anzuzeigen, wie viele abhängige Objekte
	mit gelöscht würden.<br/>
	<span class="important">Hinweis:</span> Wenn Sie diese Funktion für mehrere zu
	löschende Objekte aufrufen, kann
	es bei den abhägig zu löschenden Objekten zu Überschneidungen kommen, sodass
	eine zu hohe Anzahl ermittelt wird. Insofern ist die hier ermittelte Anzahl
	im Sinne von "bis zu X Objekten" zu verstehen.<br/>
	<span class="important">Hinweis:</span> Im Unterschied zur gleichnamigen
	Operation der JANUS-Server-Library
	erstellt diese Funktion keine Sperre für die zu löschenden Objekte!
	@param {mixed} objs Das zu löschende <code>PDObject</code> oder ein Array
	der zu löschenden <code>PDObject</code>s.
	@param {boolean} [transObj=false]
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} Die Funktion gibt ein Objekt mit folgenden Properties
	zurück:
	<ul>
		<li><code>failedAt</code>: Falls das Löschen voraussichtlich fehlschlägt,
			enthält dieses Property die OID des ersten Objekts, das nicht gelöscht
			werden kann.
		<li><code>classes</code>: Array der Klassen-Ids, von denen Objekte
			gelöscht würden. Die Klassen-Ids können über
			[PDMeta.getErgname()]{@link PDMeta#getErgname}
			in die entspr. ergonomischen Bezeichner umgewandelt werden.
		<li><code>count</code>: Anzahl der Objekte, die insgesamt gelöscht würden.
	</ul>
	@throws {PDException}
	*/
	prepareDeletion : function(objs, transObj, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDClass.prepareDeletion()");
		if(!objs)
			return null;
		var oids = [ ];
		if(JafWeb.isArray(objs))
		{
			for(var i=0; i < objs.length; i++)
				oids.push(objs[i].oid);
		}
		else if(typeof objs == 'object' && typeof objs.oidLow == "number")
			oids.push(objs.oid);
		var pars = new JParamPacker(JafWebAPI.PDClass.prepareDeletion.eventName, this);
		pars.add(JafWebAPI.PDClass.prepareDeletion.PAR_oids, oids.join(','));
		if(transObj && transObj.oid)
			pars.add(JafWebAPI.PDClass.prepareDeletion.PAR_transObj, transObj.oid);
		else if(typeof transobj == 'string')
			pars.add(JafWebAPI.PDClass.prepareDeletion.PAR_transObj, transObj);
		//JDebug.log(JDebug.DEBUG, "prepareDeletion(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var res = { };
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.prepareDeletion():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.prepareDeletion()");
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					res.failedAt = resp.getString(JafWebAPI.PDClass.prepareDeletion.PROP_failedAt, "");
					res.classes = resp.getArray(JafWebAPI.PDClass.prepareDeletion.PROP_classes, []);
					res.count = resp.getInt(JafWebAPI.PDClass.prepareDeletion.PROP_count, -1);
					if(typeof callback == 'function')
						callback(res);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				scope: this,
				callerName: pars.getEventName(),
				params: pars.get(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		//JDebug.log(JDebug.DEBUG, "PDClass.prepareDeletion() - returns: "+inspect(res, true));
		if(!callback)
			return res;
	},
	
	/**
	@memberof PDClass
	@function deleteObject
	@desc Ein Fachkonzeptobjekt löschen. 
	@param {PDObject} obj Das zu löschende lokale <code>PDObject</code>.
	@param {number} transactionId Optionale Angabe einer Transaktionsnummer. Diese kann
	auf der Server-Seite zur Realisierung eines komplexen Transaktionskonzept
	verwendet werden.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Wenn das Löschen des Objekts (und eventuell der davon
	abhängigen Objekte) geklappt hat, wird <code>0</code> zurückgegeben.
	Ansonsten wird ein Fehlercode zurückgegegeben, der mit
	[PDMeta.getString()]{@link PDMeta#getString} in einen Text umgewandelt werden kann.
	@throws {PDException}
	*/
	deleteObject : function(obj, transactionId, callback)
	{
		// TODO:
		//Ebenfalls moeglich ist die Uebergabe eines Arrays mit mehreren
		//zu loeschenden Objekten. Aber besser in deleteObjects()!
		if(!obj)
			return 0;
		var pars = new JParamPacker(JafWebAPI.PDClass.deleteObject.eventName, this);
		pars.addPDObjectByIds(obj);
		// Loesch-Event erzeugen
		if(!this._usePDObjectCache) // wird in PDObject.Delete() aufgerufen, das
			this.handleObjectDelete(obj); // wiederum beim Entfernen aus dem Cache aufger. wird
		pars.add(JafWebAPI.PDClass.deleteObject.PAR_md5, obj._md5);
		var tid = 0;
		if(typeof transactionId == 'number')
			tid = transactionId;
		pars.add(JafWebAPI.PDClass.deleteObject.PAR_tid, tid);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "deleteObject(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var pdClass = this;
		var _cid = obj.cid;
		var _oidLow = obj.oidLow;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.deleteObject():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.deleteObject()");
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					// aus dem PDObjectCache entfernen
					if(this._usePDObjectCache)
						this.PDObjectCache.removeObject(_cid, _oidLow);
					if(typeof callback == 'function')
						callback(PDClass.retcode);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				scope: this,
				params: pars.get(),
				disableCaching: true,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return this.retcode;
	},
	
	/**
	@memberof PDClass
	@function startTransaction
	@desc Für ein bestimmtes Datenbankobjekt eine neue Transaktion starten. Es wird
	Server-seitig ein neues Transaktionsobjekt angelegt und mit den Daten aus
	dem Datenbankobjekt belegt. Dieses Transaktionsobjekt wird in der Server-Session
	vorgehalten, bis die Transaktion wieder beendet wird (mit
	[PDObject.checkConstraintsAndCommit()]{@link PDObject#checkConstraintsAndCommit}
	oder [PDObject.abortTransaction()]{@link PDObject#abortTransaction}).
	@param {mixed} pdclass Name oder numerische Id der Fachkonzeptklasse oder das
	Datenbankobjekt selbst.
	@param {number} oid Objekt-Id (unterer Teil) des Datenbankobjekts. Statt dieser
	beiden Parameter kann auch die Objekt-Id als String angegeben werden.
	@param {number} [transactionId=0] Optionale Angabe einer Transaktionsnummer. Diese kann
	auf der Server-Seite zur Realisierung eines komplexen Transaktionskonzept
	verwendet werden.
	@param {Mixed} [attrs=true] Die zu ermittelnden Attribute - entweder eine Liste der
	technischen Attributnamen oder ein boolescher Typ, der anzeigt, ob alle Attribute
	laut Modell (<code>true</code>) oder gar keine Attribute (<code>false</code>)
	ermittelt werden sollen.
	@param {Mixed} [rels=false] Die zu ermittelnden Beziehungen. Wenn ein boolescher Typ
	angegeben wird, zeigt <code>false</code> an, dass keine Beziehungen geholt werden
	sollen, <code>true</code> dagegen, dass alle Zu-1-Beziehungen laut Modell geholt
	werden sollen. Dabei wird für jede Zu-1-Beziehung das ggf. verknüpfte {@link PDObject}
	mit lediglich dem im Modell spezifizierten Object Ident, jedoch ohne die übrigen
	Attribute geholt. Statt des booleschen Typs kann eine Liste der zu ermittelnden
	Beziehungen angegeben werden. Darin kann jedem technischen Beziehungsnamen, getrennt
	durch Komma, der Template-Ausdruck für die RelationInfo angehängt werden. Das ist
	wichtig, um spätere, vereinzelte [getStatus()]{@link PDObject#getStatus}-Aufrufe
	zu vermeiden.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Transaktionsobjekt oder im Fehlerfall <code>null</code>.
	@throws {PDException}
	*/
	startTransaction : function(pdclass, oid, transactionId, attrs, rels, callback)
	{
		//JDebug.log(JDebug.PD_TRANS, "PDClass.startTransaction("+pdclass+", "+oid+", "+transactionId+")");
		this.retcode = -1;
		var pars = new JParamPacker(JafWebAPI.PDClass.startTransaction.eventName, this);
		var tid = 0;
		var pos = 0;
		var callbFn = null;
		if(arguments.length > pos && (arguments[pos] instanceof PDObject))
		{
			pars.add(JafWebAPI.PDClass.startTransaction.PAR_clName, pdclass.GetClass());
			pars.add(JafWebAPI.PDClass.startTransaction.PAR_cid, pdclass.GetId());
			pars.add(JafWebAPI.PDClass.startTransaction.PAR_oidLow, pdclass.GetPDObjectIdLow());
			pos++;
			if(arguments.length > pos && (typeof arguments[pos] == "number"))
			{
				tid = arguments[pos];
				pos++;
			}
		}
		else if(arguments.length > pos && /[0-9]+:[0-9]+/.test(arguments[pos]))
		{
			pars.add(JafWebAPI.PDClass.startTransaction.PAR_oid, arguments[pos]);
			pos++;
			if(arguments.length > pos && (typeof arguments[pos] == "number"))
			{
				tid = arguments[pos];
				pos++;
			}
		}
		else
		{
			if(pdclass && typeof pdclass == "string")
				pars.add(JafWebAPI.PDClass.startTransaction.PAR_clName, pdclass);
			else if(pdclass && typeof pdclass == "number")
				pars.add(JafWebAPI.PDClass.startTransaction.PAR_cid, pdclass);
			else
			{
				this._lastMsg = "startTransaction: Class-Id or Name missing!";
				throw new PDException(PDException.ERROR, "Class-Id or Name missing!", "PDClass.startTransaction()");
			}
			pos++;
			if(oid && typeof oid == "number")
				pars.add(JafWebAPI.PDClass.startTransaction.PAR_oidLow, oid);
			else if(oid && typeof oid == "string" && /[0-9]+:[0-9]+/.test(oid))
				pars.add(JafWebAPI.PDClass.startTransaction.PAR_oid, oid);
			else
			{
				var iOid = parseInt(oid, 10);
				if(iOid != Number.NaN)
					pars.add(JafWebAPI.PDClass.startTransaction.PAR_oidLow, oid);
				else
				{
					this._lastMsg = "Oid missing!";
					throw new PDException(PDException.ERROR, "Oid missing!", "PDClass.startTransaction()");
				}
			}
			pos++;
			if(typeof transactionId == 'number')
			{
				tid = transactionId;
				pos++;
			}
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.startTransaction.PAR_allAttrs, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.startTransaction.PAR_attrs, arguments[pos][i]);
				pos++;
			}
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.startTransaction.PAR_allTo1Rels, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.startTransaction.PAR_rels, arguments[pos][i]);
				pos++;
			}
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'function')
			{
				callbFn = arguments[pos];
				pos++;
			}
		}
		// Neues Transaktionskonzept: die transactionId muss
		// unbedingt angegeben sein!
		if(UIApplication.USE_COMPLEX_TRANSACTIONS && !tid)
		{
			throw new PDException(PDException.ERROR, "Cannot start without current transaction-ID", 
					"PDClass.startTransaction()");
		}
		pars.add(JafWebAPI.PDClass.startTransaction.PAR_tid, tid);
		//JDebug.log(JDebug.DEBUG, "PDClass.startTransaction(): Params: "+pars.toString());
		this._lastMsg = '';
		var result = null;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.startTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.startTransaction()");
					var lockInfo = resp.get(JafWebAPI.PDClass.startTransaction.PROP_lockInfo);
					if(lockInfo)
					{
						var msg = (PDMeta.getString('SC::FormTitleLocked') || "Locked by %u, logged in from %c. Locked since %t.");
						msg = msg.replace(/%c/, lockInfo[JafWebAPI.PDClass.lockInfo.PROP_client]);
						msg = msg.replace(/%u/, lockInfo[JafWebAPI.PDClass.lockInfo.PROP_user]);
						var dur = new UIDuration(lockInfo[JafWebAPI.PDClass.lockInfo.PROP_locktime]);
						msg = msg.replace(/%t/, dur.toString());
						msg = msg.replace(/%i/, lockInfo[JafWebAPI.PDClass.lockInfo.PROP_uid]);
						throw new PDException(PDException.INFO, msg);
						//UIMessage.ok(msg);
					}
					else
					{
						result = resp.getPDObject(JafWebAPI.PDClass.startTransaction.PROP_transObj);
						var lockId = resp.getInt(JafWebAPI.PDClass.startTransaction.PROP_lockId, -1);
						if(result && lockId >= 0)
							result._lockid = lockId;
						var tid = resp.getInt(JafWebAPI.PDClass.startTransaction.PROP_tid, -1);
						if(result && tid >= 0)
							result._tid = tid;
					}
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callbFn == 'function')
						callbFn(result);
				};
		var failureFn = function(response, opts) {
				if(typeof callbFn == 'function')
					callbFn(result);
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!callbFn),
				scope: this,
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDClass
	@function startNewTransaction
	@desc Eine neue Transaktion starten. Es wird Server-seitig ein neues Transaktionsobjekt
	angelegt, mit den Default-Werten belegt und in der Server-Session vorgehalten.
	@param {mixed} pdclass Name oder numerische Id der Fachkonzeptklasse, von der das 
	Objekt erzeugt werden soll.
	@param {number} [transactionId=0] Optionale Angabe einer Transaktionsnummer. Diese kann
	auf der Server-Seite zur Realisierung eines komplexen Transaktionskonzepts
	verwendet werden.
	@param {Mixed} [attrs=true] Die zu ermittelnden Attribute - entweder eine Liste der
	technischen Attributnamen oder ein boolescher Typ, der anzeigt, ob alle Attribute
	laut Modell (<code>true</code>) oder gar keine Attribute (<code>false</code>)
	ermittelt werden sollen.
	@param {Mixed} [rels=false] Die zu ermittelnden Beziehungen. Wenn ein boolescher Typ
	angegeben wird, zeigt <code>false</code> an, dass keine Beziehungen geholt werden
	sollen, <code>true</code> dagegen, dass alle Zu-1-Beziehungen laut Modell geholt
	werden sollen. Dabei wird für jede Zu-1-Beziehung das ggf. verknüpfte {@link PDObject}
	mit lediglich dem im Modell spezifizierten Object Ident, jedoch ohne die übrigen
	Attribute geholt. Statt des booleschen Typs kann eine Liste der zu ermittelnden
	Beziehungen angegeben werden. Darin kann jedem technischen Beziehungsnamen, getrennt
	durch Komma, der Template-Ausdruck für die RelationInfo angehängt werden. Das ist
	wichtig, um spätere, vereinzelte [getStatus()]{@link PDObject#getStatus}-Aufrufe
	zu vermeiden.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das neue Transaktionsobjekt oder im Fehlerfall <code>null</code>.
	@throws {PDException}
	*/
	startNewTransaction : function(pdclass, transactionId, attrs, rels, callback)
	{
		//JDebug.log(JDebug.PD_TRANS, "PDClass.startNewTransaction("+pdclass+", "+transactionId+")");
		this.retcode = -1;
		var pars = new JParamPacker(JafWebAPI.PDClass.startNewTransaction.eventName, this);
		if(pdclass && typeof pdclass == "string")
			pars.add(JafWebAPI.PDClass.startNewTransaction.PAR_clName, pdclass);
		else if(pdclass && typeof pdclass == "number")
			pars.add(JafWebAPI.PDClass.startNewTransaction.PAR_cid, pdclass);
		else
		{
			this._lastMsg = "startNewTransaction: Class-Id or Name missing!";
			throw new PDException(PDException.ERROR, "Class-Id or Name missing!", "PDClass.startNewTransaction()");
		}
		if(typeof transactionId == 'number')
			pars.add(JafWebAPI.PDClass.startNewTransaction.PAR_tid, transactionId);
		// Neues Transaktionskonzept: die transactionId muss
		// unbedingt angegeben sein!
		else if(UIApplication.USE_COMPLEX_TRANSACTIONS)
		{
			throw new PDException(PDException.ERROR, "Cannot start without current transaction-ID",
					"PDClass.startNewTransaction()");
		}
		var pos = 2;
		var callbFn = null;
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.startNewTransaction.PAR_allAttrs, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.startNewTransaction.PAR_attrs, arguments[pos][i]);
				pos++;
			}
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.startNewTransaction.PAR_allTo1Rels, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.startNewTransaction.PAR_rels, arguments[pos][i]);
				pos++;
			}
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'function')
			{
				callbFn = arguments[pos];
				pos++;
			}
		}
		//JDebug.log(JDebug.DEBUG, "PDClass.startNewTransaction(): Params: "+pars.toString());
		this._lastMsg = '';
		var result = null;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.startNewTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.startNewTransaction()");
					var lockInfo = resp.get(JafWebAPI.PDClass.startNewTransaction.PROP_lockInfo); // wird vom mms benoetigt
					if(lockInfo)
					{
						var msg = (PDMeta.getString('SC::FormTitleLocked') || "Locked by %u, logged in from %c. Locked since %t.");
						msg = msg.replace(/%c/, lockInfo[JafWebAPI.PDClass.lockInfo.PROP_client]);
						msg = msg.replace(/%u/, lockInfo[JafWebAPI.PDClass.lockInfo.PROP_user]);
						var dur = new UIDuration(lockInfo[JafWebAPI.PDClass.lockInfo.PROP_locktime]);
						msg = msg.replace(/%t/, dur.toString());
						msg = msg.replace(/%i/, lockInfo[JafWebAPI.PDClass.lockInfo.PROP_uid]);
						throw new PDException(PDException.INFO, msg);
						//UIMessage.ok(msg);
					}
					else
					{
						result = resp.getPDObject(JafWebAPI.PDClass.startNewTransaction.PROP_transObj);
						var lockId = resp.getInt(JafWebAPI.PDClass.startNewTransaction.PROP_lockId, -1);
						if(result && lockId >= 0)
							result._lockid = lockId;
						var tid = resp.getInt(JafWebAPI.PDClass.startNewTransaction.PROP_tid, -1);
						if(result && tid >= 0)
							result._tid = tid;
					}
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callbFn == 'function')
						callbFn(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!callbFn),
				scope: this,
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callbFn)
			return result;
	},
	
	/**
	@memberof PDClass
	@function newObject
	@desc Ein neues Datenbankobjekt anlegen. Das Objekt wird Server-seitig
	erzeugt und mit den Default-Werten belegt. Die Funktion gibt das Client-seitig
	erzeugte {@link PDObject} zurück.<br/>
	<span class="important">Hinweis:</span> Normalerweise sollte statt dieser Funktion
	[startNewTransaction()]{@link PDClass#startNewTransaction} benutzt werden, das mit
	einem Transaktionsobjekt arbeitet.
	@param {mixed} pdclass Name oder numerische Id der Fachkonzeptklasse, von der das 
	Objekt erzeugt werden soll.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das neue Objekt oder im Fehlerfall <code>null</code>.
	@throws {PDException}
	*/
	newObject : function(pdclass, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.newObject.eventName, this);
		if(pdclass && typeof pdclass == "string")
			pars.add(JafWebAPI.PDClass.newObject.PAR_clName, pdclass);
		else if(pdclass && typeof pdclass == "number")
			pars.add(JafWebAPI.PDClass.newObject.PAR_cid, pdclass);
		else
		{
			this._lastMsg = "newObject: Class-Id or Name missing!";
			throw new PDException(PDException.ERROR, "Class-Id or Name missing!", "PDClass.newObject()");
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.newObject(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = null;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.newObject():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.newObject()");
					result = resp.getPDObject(JafWebAPI.PDClass.newObject.PROP_obj);
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					pdClass.handleObjectCreated(result);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				scope: this,
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/// Objekte holen
	/**
	@memberof PDClass
	@function getExtent
	@desc Liste von Objekten holen.
	@param {mixed} pdclass Name oder numerische Id der Fachkonzeptklasse.
	@param {string} [filter] Filter, der die Ergebnismenge einschränkt.
	@param {string} [sort] Sortierkriterium, nach dem die Ergebnismenge 
	ausgegeben werden soll.
	@param {PDObject} [thisPdo] PDObject (oder dessen OID), das als this-Objekt
	in dem Filterausdruck referenziert werden kann.
	@param {number} [blockSize=0] Größe des auf einmal zu holenden Ausschnitts aus der
	Ergebnismenge. Zusammen mit <code>blockNo</code> kann damit die
	Ergebnismenge nach und nach, blockweise abgefragt werden. Soll 
	nicht blockweise, sondern die gesamte Ergebnismenge auf einmal
	zurückgegeben werden, muss hier 0 angegeben werden. Beachten Sie jedoch, dass
	dies bei großen Datenmengen das Risiko birgt, dass dadurch der Browser "hängt".
	@param {number} [blockNo=0] Gibt in Kombination mit <code>blockSize</code> die
	Nummer (0-basiert) des auszugebenden Blocks an.
	@param {Function} [callbackFn] Hier kann eine JavaScript-Funktion angegeben
	werden, die ausgeführt werden soll, wenn der Request zurückkommt.
	In diesem Fall wird der Request asynchron ausgeführt und anschließend die
	hier übergebene Funktion mit dem als Rückgabe beschriebenen Objekt aufgerufen.
	Ist dieser Parameter dagegen nicht angegeben, wird der Request dagegen synchron
	ausgeführt und das Ergebnis direkt zurückgegeben.
	@param {boolean} [asArray=false] Gibt an, dass statt der {@link PDObject}s nur Arrays
	zurückgegeben werden sollen.
	@param {Array} [attrs] Statt <code>infoOnly</code> kann dieses Array angegeben werden,
	um die einzelnen zu ermittelnden Attributwerte (in der angegebenen Reihenfolge)
	zu ermitteln. Auch in diesem Fall werden statt der <code>PDObject</code>s Arrays
	mit den gewünschten Werten ermittelt.
	@return {Mixed} Wenn der Parameter <code>callbackFn</code> angegeben und der Request also asynchron
	ausgeführt wird, wird mit <code>true</code> oder <code>false</code> zurückgegeben, ob der
	Request abgesetzt werden konnte. Fehlt die Callback-Funktion,
	wird das Ergebnis des Requests als JavaScript-Objekt mit folgenden Properties
	zurückgegeben:
	<ul>
	 	<li><code>rows</code> Array mit den zurückgelieferten {@link PDObject}s.</li>
		<li><code>blockNo</code> Nummer des aktuellen Blocks.</li>
		<li><code>total</code> Gesamtzahl der in dem Extent enthaltenen Objekte (kann 
		von <code>rows.length</code> abweichen).</li>
		<li><code>retCode</code> (Number): Fehler-Code.</li>
		<li><code>errorMessage</code> (String): Fehlertext, falls <code>retCode</code> ungleich 0 ist.</li>
		<li><code>hasMore</code> Zeigt an, ob in der Ergebnismenge noch weitergeblättert
		werden kann.</li>
	</ul>
	@throws {PDException}
	@example
var filter = "to_EquipmentSite-&gt;Path!=''";
var sort = 'Number+';
var attrs = ['Number', 'Keyword', 'UnitActivation', 'to_EquipmentSite-&gt;Path'];
var blockSize = 50;
var blockNo = 4;
var handleExtentLoaded = function(result) {
    log('Extent geladen: ' + result.total + ' Objekte insgesamt.', true);
    log('  Block ' + blockNo + ':', true);
    for(var i=0; i &lt; result.rows.length; i++)
       log('    ' + (blockNo * blockSize + i) + '. ' + result.rows[i].getAttribute('to_EquipmentSite-&gt;Path'), true);
  };
PDClass.getExtent('Equipment', filter, sort, null, blockSize, blockNo, handleExtentLoaded, attrs);
console.log('Warte auf Extent...');
	 */
	getExtent : function(pdclass, filter, sort, thisPdo, blockSize, blockNo, callbackFn, callbackScope, asArray, attrs)
	{
		//JDebug.log(JDebug.DEBUG, "PDClass.getExtent("+pdclass+", "+filter+", "+sort+", "+thisPdo+", "+blockSize+", "+blockNo+", callbackFn, "+asArray+", "+attrs+")");
		var pars = new JParamPacker(JafWebAPI.PDClass.getExtent.eventName, this);
		if(typeof pdclass == "string" && pdclass != "")
			pars.add(JafWebAPI.PDClass.getExtent.PAR_clName, pdclass);
		else if(typeof pdclass == "number")
			pars.add(JafWebAPI.PDClass.getExtent.PAR_cid, pdclass);
		else
		{
			throw new PDException(PDException.ERROR, "First parameter (pdclass) missing or empty!", "PDClass.getExtent()");
		}
		var pos = 1;
		var thisObj = null;
		var iBlockSize = 0;
		var iBlockNo = 0;
		var fCallback = null;
		var oScope = null;
		var bAsArray = false;
		var aAttrs = null;
		var bAsArray = false;
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				pars.add(JafWebAPI.PDClass.getExtent.PAR_filter, arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				pars.add(JafWebAPI.PDClass.getExtent.PAR_sort, arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && (arguments[pos] === null || (typeof arguments[pos] == 'object' && arguments[pos].oid)))
		{
			thisObj = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			if(arguments[pos] > 0)
				iBlockSize = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			if(iBlockSize > 0)
				iBlockNo = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (arguments[pos] === null || typeof arguments[pos] == "function"))
		{
			fCallback = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (arguments[pos] === null || typeof arguments[pos] == "object"))
		{
			oScope = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			bAsArray = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (JafWeb.isArray(arguments[pos]) || typeof arguments[pos] == "string"))
		{
			aAttrs = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			bAsArray = arguments[pos];
			pos++;
		}
		// zum Request
		if(blockSize > 0)
		{
			pars.add(JafWebAPI.PDClass.getExtent.PAR_blockSize, iBlockSize);
			pars.add(JafWebAPI.PDClass.getExtent.PAR_blockNo, iBlockNo);
		}
		if(bAsArray == true)
			pars.add(JafWebAPI.PDClass.getExtent.PAR_asArr, true);
		if(aAttrs && typeof aAttrs == "string")
			pars.add(JafWebAPI.PDClass.getExtent.PAR_info, aAttrs);
		else if(aAttrs && JafWeb.isArray(aAttrs))
		{
			for(var i=0; i < aAttrs.length; i++)
				pars.add(JafWebAPI.PDClass.getExtent.PAR_attr + i, aAttrs[i]);
		}
		if(bAsArray === true)
			pars.add(JafWebAPI.PDClass.getExtent.PAR_arr, true);
		if(thisObj)
			pars.add(JafWebAPI.PDClass.getExtent.PAR_thisPdo, thisObj.oid);
		//JDebug.log(JDebug.WARN, "PDClass.getExtent(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = new Object();
		var pdClass = this;
		var successFn = function(req, options)
				{
					//JDebug.log(JDebug.WARN, "PDClass.getExtent(): Response: "+resp.getResponseText());
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
					{
						result.retCode = -1;
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getExtent():\n"+resp.getResponseText());
					}
					if(resp.hasError())
					{
						result.retCode = resp.getInt('retCode', -1);
						pdClass._lastMsg = resp.getErrorMessage();
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getExtent()");
					}
					// out-Array fuellen
					/*if(bAsArray)
						result.rows = resp.getArray(JafWebAPI.PDClass.getExtent.PROP_rows, [], 'object', []); // TODO: das sollte in JEDEM Fall als PDObject zurueckgegeben werden!
					else*/
						result.rows = resp.getArray(JafWebAPI.PDClass.getExtent.PROP_rows, [], 'PDObject', null);
					result.blockSize = resp.getInt(JafWebAPI.PDClass.getExtent.PROP_blockSize, -1);
					result.blockNo = resp.getInt(JafWebAPI.PDClass.getExtent.PROP_blockNo, 0);
					result.total = resp.getInt(JafWebAPI.PDClass.getExtent.PROP_total, -1);
					result.retCode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					result.hasMore = resp.getBool("hasMore", undefined);
					pdClass.retcode = result.retCode;
					if(typeof fCallback == "function")
					{
						//fCallback(outStr, outPdo, this.retcode);
						try
						{
							fCallback.call((oScope || this), result);
						}
						catch(ex)
						{
							JDebug.log(JDebug.WARN, "Callback of PDClass.getExtent('" + pdclass + "', '" + filter +
									"', '" + sort + "', " + thisPdo + ", " + blockSize + ", " + blockNo + ", callbackFn, " +
									asArray + ", " + (JafWeb.isArray(attrs) ? "[" + attrs + "]" : attrs) +
									") throwed an exception: " + ex);
						}
					}
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof fCallback == 'function')
					fCallback.call((oScope || this));
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!fCallback),
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
				/*failure: function(response, errorThrown) {
						//console.error(response.responseText);
						// hotfix!
						try
						{
							var data = null;
							eval("data = " + response.responseText);
							response.responseText = JSON.stringify(data);
							successFn(response);
						}
						catch(ex)
						{
							JDebug.log(JDebug.ERROR, "PDClass.getExtent() request failed! " +
									", error: " + errorThrown + ", Response: " + response);
						}
					}*/
			});
		if(!fCallback)
			return result;
	},

	/**
	@memberof PDClass
	@function exportExtent
	@desc Liste von {@link PDObject}s exportieren. Die Funktion startet unmittelbar
	den Download der Export-Datei bzw. (je nach gewünschtem Format) zeigt die
	Ergebnisseite in einem neuen Browser-Fenster an.<br/>
	<span class="important">Hinweis:</span> Bitte beachten Sie, dass die Parameter
	für diesen Request per GET übergeben werden müssen und deshalb die Gesamtlänge
	der resultierenden URL begrenzt ist!
	Die Grenze liegt bei mindestens 2000 Zeichen (die genaue Länge ist Browser-abhängig),
	sodass diese Begrenzung normalerweise kein Problem darstellen wird. Kritisch könnte
	höchstens der Parameter <code>filter</code> werden, wenn Sie z.B. einen sehr langen
	OID-Filter angeben.
	@param {mixed} pdclass Name oder numerische Id der Fachkonzeptklasse.
	@param {string} [filter] Filter, der die Ergebnismenge einschränkt.
	@param {string} [sort] Kriterium, nach dem die Ergebnismenge 
	sortiert werden soll.
	@param {PDObject} [thisPdo] PDObject (oder dessen OID), das als <code>this</code>-Objekt
	in dem Filterausdruck referenziert werden kann.
	@param {string} [exportFormat='csv'] Bestimmt, was für ein Export ausgegeben werden soll.
	Mögliche Werte sind:<br/>
	<ul>
		<li>"xml": Es wird ein Export über das JANUS-XML Interface erzeugt.</li>
		<li>"csv": Die Objekte werden als kommaseparierte Werte exportiert, d.h. jede
		Zeile enthält ein Objekt, dessen Attributwerte in doppelte Anführungszeichen
		eingeschlossen und durch Semikolons voneinander getrennt sind.</li>
		<li>"excel": Wie "csv", jedoch wird zum Maskieren innerhalb der Attributwerte
		statt "\" ein weiteres doppeltes Anführungszeichen verwendet. Dies ist die
		Variante, die von <i>Microsoft Excel</i> erwartet wird.</li>
		<li>"print": Die Objekte der Liste werden in einer tabellarisch formatierten HTML-Seite
		angezeigt. Auf die Gestaltung dieser Seite kann durch das CSS-Stylesheet
		<code>printuser.css</code> Einfluss genommen werden.</li>
	</ul>
	@param {string} [xsl] Falls bei <code>exportFormat</code> "xml" angegeben wurde,
	kann hier der Dateiname eines XSL-Stylesheets angegeben werden, das zum Transformieren
	der erzeugten XML-Datei verwendet werden soll. Die XSL-Datei muss, wie die anderen
	XSL-Dateien, im Transformationsverzeichnis der Web-Anwendung liegen.
	@param {string[]} [attrs] Liste mit den technischen Attributnamen, die exportiert
	werden sollen. Falls die Liste leer bleibt oder der Parameter weggelassen wird,
	werden automatisch alle Attribute der Klasse exportiert.
	@param {boolean} [useGuiLabels] Falls das CSV-Exportformat benutzt wird, kann hier
	festgelegt werden, ob für Spaltenüberschriften die technischen (<code>false</code>)
	oder die ergonomischen Attributnamen (<code>true</code>) verwendet werden sollen.
	Standardwert ist <code>true</code>.
	@param {string} viewname Optionale Angabe.
	@return {number} <code>0</code>, wenn der Download gestartet werden konnte, sonst
	ein Fehler-Code.
	 */
	exportExtent : function(pdclass, filter, sort, thisPdo, exportFormat, xsl, attrs, useGuiLabels, viewname)
	{
		//JDebug.log(JDebug.DEBUG, "PDClass.exportExtent() - viewname: '"+viewname+"'");
		var pars = new JParamPacker(JafWebAPI.PDClass.exportExtent.eventName, this);
		if(typeof pdclass == "string" && pdclass != "")
			pars.add(JafWebAPI.PDClass.exportExtent.PAR_clName, pdclass);
		else if(typeof pdclass == "number")
			pars.add(JafWebAPI.PDClass.exportExtent.PAR_cid, pdclass);
		else
		{
			alert("PDClass.exportExtent(): first parameter (pdclass) missing or empty!");
			return -1;
		}
		var pos = 1;
		var thisObject = null;
		var aAttrs = null;
		var filt = '';
		var format = "csv";
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				filt = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				pars.add(JafWebAPI.PDClass.exportExtent.PAR_sort, arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && (arguments[pos] === null || (arguments[pos] instanceof PDObject)))
		{
			thisObj = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
			{
				pars.add(JafWebAPI.PDClass.exportExtent.PAR_exportFormat, arguments[pos]);
				format = arguments[pos];
			}
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				pars.add(JafWebAPI.PDClass.exportExtent.PAR_xsl, arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && arguments[pos] && (typeof arguments[pos] == "object" ||
				typeof arguments[pos] == "string"))
			aAttrs = arguments[pos];
		if(aAttrs)
		{
			for(var i=0; i < aAttrs.length; i++)
				pars.add(JafWebAPI.PDClass.exportExtent.PAR_attr + i, aAttrs[i]);
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			if(arguments[pos] == true)
				pars.add(JafWebAPI.PDClass.exportExtent.PAR_guiLabels, true);
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos])
				pars.add(JafWebAPI.PDClass.exportExtent.PAR_viewname, arguments[pos]);
			pos++;
		}
		if(filt != '')
			pars.add(JafWebAPI.PDClass.exportExtent.PAR_filter, filt);
		//JDebug.log(JDebug.L8, "Params: "+pars.toString());
		var resDir = UIApplication.getResourceDir();
		if(resDir.charAt(resDir.length - 1) == '/')
			resDir = resDir.substr(0, resDir.length - 1);
		pars.add(JafWebAPI.PDClass.exportExtent.PAR_resDir, resDir);
		this._lastMsg = '';
		this.retcode = -1;
		// falls CSV-Format, Datei-Download verwenden
		var url = "";
		if(format === "csv" || format === "excel")
			url = this.getDownloadURL() + // UIApplication.getDownloadUrlRoot()
					"?janusFileOperation=downloadWebEvent&iid=" + this.PDMeta.getInstanceID() +
					"&sessionId=" + this.getAuthToken() +
					"&janusWebEvent=" + pars.getEventString(true);
		else
			url = this.getURL() +
					"?JanusApplicationName=GenericJanusApplication&iid=" + this.PDMeta.getInstanceID() +
					"&sessionId=" + this.getAuthToken() +
					"&oid=&janusWebEvent=" + pars.getEventString(true);
		// Achtung: URLs ueber 2000 Zeichen Laenge (die genaue Grenze ist Browser-
		// abhaengig) - z.B. durch extrem lange Filterausdruecke - koennen
		// den Download scheitern lassen!
		if(url.length > 2000)
		{
			JDebug.log(JDebug.WARN, "Export extent: the download URL is probably too long (" +
					url.length + " characters) : '"+url+"'");
			return -2;
		}
		window.open(url);
	},

	/**
	@memberof PDClass
	@function getExtentGroups
	@desc Holt Gruppierungsinformationen über den angegebenen Extent.
	@param {string} pdclass Name oder numerische Id der Fachkonzeptklasse.
	@param {string} groupBy Attribut, nach dem gruppiert werden soll. Typischerweise
	handelt es sich hierbei um ein Enum-Atribut der Klasse, so dass für jede
	Ausprägung des Aufzählungstypen eine Gruppierung erzeugt wird.
	@param {string} [filter] Filter, der die Ergebnismenge einschränkt.
	@param {PDObject} [thisPdo] PDObject (oder dessen OID), das als <code>this</code>-Objekt
	in dem Filterausdruck referenziert werden kann.
	@param {Function} [callbackFn] Hier kann eine JavaScript-Funktion angegeben
	werden, die ausgeführt werden soll, wenn der Request zurückkommt.
	In diesem Fall wird der Request asynchron ausgeführt. Ist dieser
	Parameter dagegen nicht angegeben, wird der Request synchron
	ausgeführt und das Ergebnis als Array von {@link PDObject}s zurückgegeben.
	@return {boolean} Wenn der Parameter callbackFn angegeben und also asynchron
	ausgeführt wird, wird mit <code>true</code> oder <code>false</code> zurückgegeben, ob der
	Request abgesetzt werden konnte. Fehlt die Callback-Funktion,
	wird das Ergebnis des Requests als Array von {@link PDGroupInfo} zurückgegeben.
	@throws {PDException}
	 */
	getExtentGroups : function(pdclass, groupBy, filter, thisPdo, callbackFn)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.getExtentGroups.eventName, this);
		if(typeof pdclass == "string" && pdclass != "")
			pars.add(JafWebAPI.PDClass.getExtentGroups.PAR_clName, pdclass);
		else if(typeof pdclass == "number")
			pars.add(JafWebAPI.PDClass.getExtentGroups.PAR_cid, pdclass);
		else
		{
			throw new PDException(PDException.ERROR, "First parameter (pdclass) missing or empty!", "PDClass.getExtentGroups()");
		}
		var pos = 1;
		if(arguments.length <= pos || typeof arguments[pos] !== "string" || arguments[pos] == '')
		{
			throw new PDException(PDException.ERROR, "group-by criteria missing!", "PDClass.getExtentGroups()");
		}
		var fCallback = null;
		pars.add(JafWebAPI.PDClass.getExtentGroups.PAR_groupBy, arguments[pos++]);
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			if(arguments[pos] != "")
				pars.add(JafWebAPI.PDClass.getExtentGroups.PAR_filter, arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && (arguments[pos] == null || (arguments[pos] instanceof PDObject)))
		{
			if(arguments[pos] != null)
				pars.add(JafWebAPI.PDClass.getExtentGroups.PAR_thisObj, arguments[pos]);
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "function")
			fCallback = arguments[pos++];
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.getExtentGroups(): Params: "+pars.toString());
		var result = new Array();
		this._lastMsg = '';
		this.retcode = -1;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getExtentGroups():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getExtentGroups()");
					var infos = resp.getArray(JafWebAPI.PDClass.getExtentGroups.PROP_infos, [], 'object', null);
					for(var i=0; i < infos.length; i++)
						result.push(new PDGroupInfo(infos[i].filter, infos[i].value, infos[i].count));
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof fCallback == "function")
						fCallback.call(this, result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof fCallback == 'function')
					fCallback(null);
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!fCallback),
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!fCallback)
			return result;
	},

	/**
	@memberof PDClass
	@function moveInExtent
	@desc Bewegen von einem oder mehreren Fachkonzeptobjekten in einem <i>Orderable Extent</i>.
	@param {mixed} pdclass Name oder numerische Id der Fachkonzeptklasse.
	@param {mixed} objs Array von {@link PDObject}s oder Objekt-IDs (unterer Teil).
	Alternativ kann auch ein {@link PDObject} oder eine Objekt-ID angegeben werden.
	@param {number} idx Der 0-basiert Index im gesamten Extent, an den das bzw. die
	Objekte verschoben werden sollen.
	@param {Function} [callbackFn] Hier kann eine JavaScript-Funktion angegeben
	werden, die ausgeführt werden soll, wenn der Request zurückkommt.
	In diesem Fall wird der Request asynchron ausgeführt. Ist dieser
	Parameter dagegen nicht angegeben, wird der Request synchron
	ausgeführt und das Ergebnis als Array von {@link PDObject}s zurückgegeben.
	@return {mixed} Im Fehlerfall wird ein Fehlertext zurückgegeben, sonst <code>0</code>.
	@throws {PDException}
	 */
	moveInExtent : function(pdclass, objs, idx, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.moveInExtent.eventName, this);
		var _cid = 0;
		if(pdclass && typeof pdclass == "string")
		{
			pars.add(JafWebAPI.PDClass.moveInExtent.PAR_clName, pdclass);
			_cid = this.PDMeta.getId(pdclass);
		}
		else if(pdclass && typeof pdclass == "number")
		{
			pars.add(JafWebAPI.PDClass.moveInExtent.PAR_cid, pdclass);
			_cid = pdclass;
		}
		else
		{
			this._lastMsg = "moveInExtent: Class-Id or Name missing!";
			return null;
		}
		var _objs = [ ];
		if(JafWeb.isArray(objs))
		{
			for(var i=0; i < objs.length; i++)
			{
				if(!objs[i])
					continue;
				if(typeof objs[i] == 'number')
					_objs.push(objs[i]);
				else if(typeof objs[i] == 'object' && objs[i].oidLow)
					_objs.push(objs[i].oidLow);
			}
		}
		else if(typeof objs == 'number')
			_objs.push(objs);
		else if(typeof objs == 'object' && objs.oidLow)
			_objs.push(objs.oidLow);
		pars.add(JafWebAPI.PDClass.moveInExtent.PAR_oids, _objs.join(','));
		pars.add(JafWebAPI.PDClass.moveInExtent.PAR_idx, idx);
		//pars.add("relname", relName);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.moveInExtent(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = -1;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.moveInExtent():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.moveInExtent()");
					result = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(result > 0)
						result = resp.getString(JafWebAPI.PDClass.moveInExtent.PROP_retMsg);
					pdClass.retcode = result;
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!callback),
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		return result;
	},

	/**
	@memberof PDClass
	@function ptr
	@desc Client-seitige Repräsentation eines Fachkonzeptobjekts holen.
	@param {mixed} pdclass Name oder numerische Id der Fachkonzeptklasse. Kann auch
	weggelassen werden, wenn der verbleibende Parameter einen
	vollständigen OID-String darstellt.
	@param {mixed} oid OID (String) oder, wenn der pdclass-Parameter
	belegt ist, deren unterer, numerischer Teil.
	@param {boolean} [noCache=false] <code>true</code> zeigt an, dass das Objekt nicht
	aus dem Cache, sondern auf jeden Fall neu vom Server geholt werden soll.
	@param {Mixed} [attrs=true] Die zu ermittelnden Attribute - entweder eine Liste der
	technischen Attributnamen oder ein boolescher Typ, der anzeigt, ob alle Attribute
	laut Modell (<code>true</code>) oder gar keine Attribute (<code>false</code>)
	ermittelt werden sollen.
	@param {Mixed} [rels=false] Die zu ermittelnden Beziehungen. Wenn ein boolescher Typ
	angegeben wird, zeigt <code>false</code> an, dass keine Beziehungen geholt werden
	sollen, <code>true</code> dagegen, dass alle Zu-1-Beziehungen laut Modell geholt
	werden sollen. Dabei wird für jede Zu-1-Beziehung das ggf. verknüpfte {@link PDObject}
	mit lediglich dem im Modell spezifizierten Object Ident, jedoch ohne die übrigen
	Attribute geholt. Statt des booleschen Typs kann eine Liste der zu ermittelnden
	Beziehungen angegeben werden. Darin kann jedem technischen Beziehungsnamen, getrennt
	durch Komma, der Template-Ausdruck für die RelationInfo angehängt werden. Das ist
	wichtig, um spätere, vereinzelte [getStatus()]{@link PDObject#getStatus}-Aufrufe
	zu vermeiden.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Objekt oder im Fehlerfall <code>null</code>.
	@throws {PDException}
	 */
	ptr : function(pdclass, oid, noCache, attrs, rels, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDClass.ptr('"+pdclass+"', "+oid+", "+noCache+")");
		var pars = new JParamPacker(JafWebAPI.PDClass.ptr.eventName, this);
		var _cid = 0;
		var _oid = 0;
		var _noCache = false;
		var callbFn = null;
		var pos = 0;
		if(arguments.length > pos && typeof arguments[pos] == 'string' &&
				arguments[pos].match(/[0-9]+:[0-9]+/))
		{
			// zerlegen
			var tmp = arguments[pos].split(':');
			if(tmp.length == 2)
			{
				_cid = parseInt(tmp[0], 10);
				_oid = parseInt(tmp[1], 10);
			}
			pars.add(JafWebAPI.PDClass.ptr.PAR_cid, _cid);
			pars.add(JafWebAPI.PDClass.ptr.PAR_oidLow, _oid);
			pos++;
		}
		else if(arguments.length > pos)
		{
			if(pdclass && typeof pdclass == "string")
			{
				pars.add(JafWebAPI.PDClass.ptr.PAR_clName, pdclass);
				_cid = this.PDMeta.getId(pdclass);
				pos++;
			}
			else if(pdclass && typeof pdclass == "number")
			{
				pars.add(JafWebAPI.PDClass.ptr.PAR_cid, pdclass);
				_cid = pdclass;
				pos++;
			}
			else
			{
				throw new PDException(PDException.ERROR, "Class-Id or Name missing!", "PDClass.ptr()");
			}
			if(oid && typeof oid == "number")
			{
				pars.add(JafWebAPI.PDClass.ptr.PAR_oidLow, oid);
				_oid = oid;
				pos++;
			}
			else
			{
				var iOid = parseInt(oid, 10);
				if(iOid != Number.NaN)
				{
					pars.add(JafWebAPI.PDClass.ptr.PAR_oidLow, oid);
					_oid = iOid;
					pos++;
				}
				else
				{
					throw new PDException(PDException.ERROR, "Oid missing!", "PDClass.ptr()");
				}
			}
		}
		// Im Cache?
		if(arguments.length > pos && typeof arguments[pos] == 'boolean')
		{
			_noCache = arguments[pos];
			pos++;
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.ptr.PAR_allAttrs, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.ptr.PAR_attrs, arguments[pos][i]);
				pos++;
			}
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.ptr.PAR_allTo1Rels, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.ptr.PAR_rels, arguments[pos][i]);
				pos++;
			}
		}
		if(typeof arguments[pos] == 'function')
		{
			callbFn = arguments[pos];
			pos++;
		}
		if(!_noCache && this._usePDObjectCache)
		{
			var obj = this.PDObjectCache.get(_cid, _oid);
			if(obj != null)
			{
				if(typeof callbFn == 'function')
					callbFn(obj);
				else
					return obj;
			}
		}
		//JDebug.log(JDebug.DEBUG, "PDClass.ptr(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = null;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.ptr():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.ptr()");
					result = resp.getPDObject(JafWebAPI.PDClass.ptr.PROP_obj);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callbFn == 'function')
						callbFn(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn(result);
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!callbFn),
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDClass
	@function ptrs
	@desc Mehrere Client-seitige Objekt-Repräsentationen in einem Rutsch
	holen.
	@param {mixed} [pdclass] Name oder numerische Id der Fachkonzeptklasse. Kann auch
	weggelassen werden, wenn der verbleibende Parameter
	vollständige OID-Strings von Objekten (auch verschiedener) Klassen enthält.
	@param {string[]} oids  Array der OIDs.
	@param {Mixed} [attrs=true] Die zu ermittelnden Attribute - entweder eine Liste der
	technischen Attributnamen oder ein boolescher Typ, der anzeigt, ob alle Attribute
	laut Modell (<code>true</code>) oder gar keine Attribute (<code>false</code>)
	ermittelt werden sollen. <em>Das geht jedoch nur, wenn die zu holenden Objekte der
	selben Klasse angehören!</em>
	@param {Mixed} [rels=false] Die zu ermittelnden Beziehungen. Wenn ein boolescher Typ
	angegeben wird, zeigt <code>false</code> an, dass keine Beziehungen geholt werden
	sollen, <code>true</code> dagegen, dass alle Zu-1-Beziehungen laut Modell geholt
	werden sollen. Dabei wird für jede Zu-1-Beziehung das ggf. verknüpfte {@link PDObject}
	mit lediglich dem im Modell spezifizierten Object Ident, jedoch ohne die übrigen
	Attribute geholt. Statt des booleschen Typs kann eine Liste der zu ermittelnden
	Beziehungen angegeben werden. Darin kann jedem technischen Beziehungsnamen, getrennt
	durch Komma, der Template-Ausdruck für die RelationInfo angehängt werden. Das ist
	wichtig, um spätere, vereinzelte [getStatus()]{@link PDObject#getStatus}-Aufrufe
	zu vermeiden. <em>Das geht jedoch nur, wenn die zu holenden Objekte der
	selben Klasse angehören!</em>
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject[]} Array mit den {@link PDObject}s in der Reihenfolge
	der OIDs im <code>oids</code>-Parameter. Für Objekte, die nicht gefunden wurden,
	stehten <code>null</code>-Elemente in dem Array.
	@throws {PDException}
	 */
	ptrs : function(pdclass, oids, attrs, rels, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.ptrs.eventName, this);
		var pos = 0;
		var result = new Array();
		var callbFn = null;
		if(pdclass && typeof pdclass == "string")
		{
			pars.add(JafWebAPI.PDClass.ptrs.PAR_clName, pdclass);
			pos++;
		}
		else if(pdclass && typeof pdclass == "number")
		{
			pars.add(JafWebAPI.PDClass.ptrs.PAR_cid, pdclass);
			pos++;
		}
		if(arguments.length <= pos || typeof arguments[pos] != "object" ||
				!arguments[pos].length)
		{
			throw new PDException(PDException.ERROR, "Oid list missing!", "PDClass.ptrs()");
		}
		for(var i=0; i < arguments[pos].length; i++)
			pars.add(JafWebAPI.PDClass.ptrs.PAR_oid + i, arguments[pos][i]);
		pos++;
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.ptrs.PAR_allAttrs, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.ptrs.PAR_attrs, arguments[pos][i]);
				pos++;
			}
		}
		if(arguments.length > pos)
		{
			if(typeof arguments[pos] == 'boolean')
			{
				pars.add(JafWebAPI.PDClass.ptrs.PAR_allTo1Rels, arguments[pos]);
				pos++;
			}
			else if(JafWeb.isArray(arguments[pos]))
			{
				for(var i=0; i < arguments[pos].length; i++)
					pars.add(JafWebAPI.PDClass.ptrs.PAR_rels, arguments[pos][i]);
				pos++;
			}
		}
		if(typeof arguments[pos] == 'function')
		{
			callbFn = arguments[pos];
			pos++;
		}
		this._lastMsg = '';
		this.retcode = -1;
		var result = [ ];
		var pdClass = this;
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.ptrs(): Params: "+pars.toString());
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.ptrs():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.ptrs()");
					result = resp.getArray(JafWebAPI.PDClass.ptrs.PROP_objs, [], 'PDObject', null);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callbFn == 'function')
						callbFn(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callFn == 'function')
					callbFn(null);
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callbFn),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/// Arbeiten mit Benutzern
	/**
	@memberof PDClass
	@function changePassword
	@desc Passwort ändern.
	@param {string} passw Passwort des aktuellen Benutzers.
	@param {number} [uid=-1] Id des Benutzers, dessen Passwort geändert werden soll.
	Wird dieser Parameter nicht oder mit <code>-1</code> angegeben, wird das
	Passwort des aktuellen Benutzers geändert.
	@param {string} newPassw Das neue Passwort.
	@param {string} [passwConfirm=false] Passwortwiederholung (optional). Wird diese
	angegeben, wird die Übereinstimmung von Passwort und Wiederholung Server-seitig
	geprüft.
	@param {boolean} [crypt=false] Zeigt an, ob das Passwort vor Übertragung verschlüsselt
	werden soll. Standardwert ist <code>false</code>.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Falls das Passwort nicht gesetzt werden konnte, wird
	ein Fehlertext zurückgegeben.
	@throws {PDException}
	 */
	changePassword : function(passw, uid, newPassw, passwConfirm, crypt, callback)
	{
		/* @param {boolean} crypted Legt fest, ob das Passwort verschlüsselt übertragen 
		werden soll. Fehlt der Parameter, wird <code>false</code> angenommen.*/
		// crypt: mittels Ext.ux.Crypto?
		// Der Benutzer muss ueber das Recht ClientInfo::changePassword verfuegen!
		// Wenn crypted==true, muss das Passwort bereits verschluesselt uebergeben
		// werden. Die Verschluesselung kann mit Javacrypt.crypt() gemacht werden, 
		// wenn crypt.js eingebunden ist.
		var pars = new JParamPacker(JafWebAPI.PDClass.changePassword.eventName, this);
		var callbFn = null;
		var myPw;
		var pos = 0;
		if(arguments.length > pos + 1 && typeof arguments[pos] == 'string' &&
				typeof arguments[pos + 1] == 'number')
		{
			myPw = arguments[pos];
			pos++;
		}
		else if(arguments.length > pos && arguments[pos] === undefined)
			pos++;
		if(arguments.length > pos && typeof arguments[pos] == 'number')
		{
			if(arguments[pos] >= 0)
				pars.add('uid', arguments[pos]);
			pos++;
		}
		var newPw = '', newPwConfirm = '';
		if(arguments.length > pos && typeof arguments[pos] == 'string')
		{
			newPw = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == 'string')
		{
			newPwConfirm = arguments[pos];
			pos++;
		}
		var crypt = false;
		if(arguments.length > pos && typeof arguments[pos] == 'boolean')
		{
			crypt = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == 'function')
		{
			callbFn = arguments[pos];
			pos++;
		}
		if(newPwConfirm && newPwConfirm !== newPw)
		{
			this._lastMsg = PDMeta.getString('SC::UMIncorrectPasswordConfirmation');
			this.retcode = -1;
			if(callbFn)
				callbFn(this._lastMsg);
			else
				return this._lastMsg;
		}
		if(crypt)
		{
			if(myPw !== undefined)
				pars.add(JafWebAPI.PDClass.changePassword.PAR_passw, (myPw ? PDTools.md5sum(myPw) : ''));
			pars.add(JafWebAPI.PDClass.changePassword.PAR_newPassw, PDTools.md5sum(newPw));
			//pars.add(JafWebAPI.PDClass.changePassword.PAR_passwRetype, newPwConfirm);
			pars.add(JafWebAPI.PDClass.changePassword.PAR_crypted, crypt);
		}
		else
		{
			if(myPw !== undefined)
				pars.add(JafWebAPI.PDClass.changePassword.PAR_passw, (myPw || ''));
			pars.add(JafWebAPI.PDClass.changePassword.PAR_newPassw, newPw);
			//pars.add(JafWebAPI.PDClass.changePassword.PAR_passwRetype, newPwConfirm);
		}
		this._lastMsg = '';
		this.retcode = -1;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.changePassword():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.changePassword()");
					if(pdClass.PDMeta)
					{
						this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
						if(this.retcode && !this._lastMsg)
							pdClass._lastMsg = pdClass.PDMeta.getString(this.retcode);
					}
					if(typeof callbFn == 'function')
						callbFn(pdClass._lastMsg);
					// TODO: ggf. focus-Rueckgabe auswerten
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callbFn),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return this._lastMsg;
	},
	
	/**
	@memberof PDClass
	@function changeUser
	@desc Den Benutzer wechseln.<br/>
	<span class="important">Hinweis:</span> Im standardmäßigen JafWeb-Client muss diese Funktion
	normalerweise nicht aufgerufen werden, weil die Anmeldung
	über die vorgeschaltete Login-Seite erfolgt. Falls diese
	Funktion benutzt wird - z.B. in einer eigenständigen HTML-Seite,
	die nur die PD-Schicht des JafWeb benutzt -, muss die Verbindung
	mit [ClientInfo.disconnectClient()]{@link ClientInfo#disconnectClient} wieder
	abgebaut werden! Für ein Beispiel vgl. a. {@tutorial tut_jafwebPD}.
	@param {string} login Login-Kennung des neuen
	Benutzers.
	@param {string} passw Passwort des neuen Benutzers.
	@param {string} [principal] Optionaler Mandantenname, falls Sie
	sich mit einer mandantenfähigen Anmwendung verbinden.
	@param {string} [clientType] Optionale Angabe über die Anwendung. Diese wird,
	falls angegeben, auf der Server-Seite in das <code>ClientInfo</code>-Objekt
	geschrieben und ermöglicht es so, verschiedene JafWeb-Clients am selben
	Server zu betreiben. Bei der Anmeldung (in <code>PDClass::changeUser()</code>
	auf der Server-Seite) kann diese Information zum Beispiel (mittels
	<code>cInfoP-&gt;getClientType()</code>) abgefragt werden, um festzustellen,
	ob der sich anmeldende Benutzer für die angegebene Art des Clients
	freigeschaltet ist. <span class="important">Hinweis</span>: Beachten Sie bitte,
	dass der <code>clientType</code> nur auf dem Server gesetzt wird, wenn die
	Kommunikation via FCGI-Service benutzt wird; die SoapWebApp unterstützt diese
	Angabe leider nicht.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	 */
	changeUser : function(login, passw, principal, language, clientType, callback)
	{
		// TODO:
		//@param {string} [language] Optionale Angabe des Codes einer Anwenudngssprache.
		//Falls angegeben, wird direkt in dieser Sprache angemeldet. Etwaige
		//Fehlermeldungen dieser Funktion werden in dieser Sprache ausgegeben.
		var pars = new JParamPacker("PDClass.changeUser" /*JafWebAPI.PDClass.changeUser.eventName*/, this);
		var callbFn = null;
		var pos = 1;
		if(arguments.length < 2)
			throw new PDException(PDException.ERROR, "At least 2 parameters needed.", "PDClass.changeUser()");
		while(pos < arguments.length)
		{
			if(typeof arguments[pos] == 'function')
			{
				callbFn = arguments[pos];
				break;
			}
			pos++;
		}
		this._lastMsg = '';
		this.retcode = -1;
		var pdClass = this;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDClass.changeUser():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.changeUser()");
				if(typeof pdClass.PDMeta != 'undefined')
				{
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(pdClass.retcode && !pdClass._lastMsg)
						pdClass._lastMsg = pdClass.PDMeta.getString(pdClass.retcode);
					if(pdClass.retcode <= 0)
					{
						var authToken = resp.getString('sessionId');
						if(authToken)
							UIApplication.setAuthToken(authToken);
					}
				}
				if(typeof callbFn == 'function')
					callbFn();
			};
		var errorFn = function(req, options)
			{
				throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
					"PDClass.changeUser():\n"+req);
				var resp = new JResponse(req, options);
				/*if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
						"PDClass.changeUser():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.changeUser()");*/
				if(this.PDMeta)
				{
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(this.retcode && !this._lastMsg)
						this._lastMsg = this.PDMeta.getString(this.retcode);
				}
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callbFn),
				params: {
						janusWebEvent: pars.getEventString(false),
						JanusApplicationName: "GenericJanusApplication",
						iid: PDMeta.getInstanceID(),
						oid: "",
						fmt: "json", // statt der Login-Seite JSON zurueckgeben (benoetigt soapwebapp2)!
						JanusLogin: login,
						JanusPasswd: passw,
						JanusPrinc: (principal || ''),
						JanusLang: (language || ''),
						ClientType: (clientType || '')
					},
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			} );
		return this._lastMsg;
	},
	
	/**
	@memberof PDClass
	@function deleteUser
	@desc Einen Benutzer löschen.
	@param {string} loginName Login-Kennung des zu
	löschenden Benutzers.
	@todo Implementierung
	 */
	deleteUser : function(loginName)
	{ },
	
	/**
	@memberof PDClass
	@function getUserId
	@desc Zu einer Login-Kennung die numerische
	Benutzer-Id ermitteln.
	@param {string} [name] Login-Kennung. Fehlt dieser Parameter oder
	wird er leer angegeben, so wird die Kennung des aktuell
	angemeldeten Benutzers ermittelt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Die zugehörige User-Id.
	@throws {PDException}
	 */
	getUserId : function(name, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.getUserId.eventName, this);
		if(name)
			pars.add(JafWebAPI.PDClass.getUserId.PAR_name, name);
		this._lastMsg = '';
		this.retcode = -1;
		var uid = -1;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getUserId():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getUserId()");
					uid = resp.getInt(JafWebAPI.PDClass.getUserId.PROP_id);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(uid);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return uid;
	},
	
	/**
	@memberof PDClass
	@function getUserName
	@desc Zu einer gegebenen User-Id die Login-Kennung
	ermitteln.
	@param {number} [uid=-1] Numerische Benutzer-Id. Fehlt die oder wird <code>-1</code>
	angegeben, so wird der Name des aktuell angemeldeten Benutzers ermittelt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Der Login-Name zu der User-Id.
	@throws {PDException}
	 */
	getUserName : function(uid, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.getUserName.eventName, this);
		var userId = -1;
		if(uid !== undefined)
			userId = -1;
		pars.add(JafWebAPI.PDClass.getUserName.PAR_uid, userId);
		this._lastMsg = '';
		this.retcode = -1;
		var loginName = '';
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getUsername():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getUserName()");
					loginName = resp.getString(JafWebAPI.PDClass.getUserName.PROP_name);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(loginName);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return loginName;
	},

	/**
	@memberof PDClass
	@function userSettings
	@desc Daten eines Benutzers auslesen. Jeder Benutzer kann seine
	eigenen Daten auslesen. Für das Auslesen der Daten anderer 
	Benutzer sind Administratorrechte erforderlich.
	@param {string} [login] Loginname des Benutzers, dessen Daten
	ausgelesen werden sollen. Wird der Parameter weggelassen, werden
	die Daten des aktuellen Benutzers geholt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} Wenn die Benutzerdaten geholt werden konnten,
	wird ein JavaScript-Objekt mit folgenden Properties zurückgegeben:
	<ul>
		<li><code>String login</code> Login-Name des Benutzers.
		<li><code>String fullname</code> Der Langname des Benutzers.
		<li><code>Number passExpire</code> Anzahl der Tage, die das Passwort
			insgesamt gültig ist.
		<li><code>String accountExpire</code> An diesem Tage wird das Benutzerkonto
			ungültig wird.
	</ul>
	Falls die Benutzerdaten nicht geholt werden konnten, wird
	<code>null</code> zurückgegeben.
	@throws {PDException}
	*/
	userSettings : function(login, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.userSettings.eventName, this);
		if(login && typeof login == "string")
			pars.add(JafWebAPI.PDClass.userSettings.PAR_login, login);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.userSettings(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = null;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.userSettings():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.userSettings()");
					result = new Object();
					result.login = resp.getString(JafWebAPI.PDClass.userSettings.PROP_login);
					result.fullname = resp.getString(JafWebAPI.PDClass.userSettings.PROP_fullname);
					result.passExpire = resp.getInt(JafWebAPI.PDClass.userSettings.PROP_passExp);
					result.accountExpire = resp.getString(JafWebAPI.PDClass.userSettings.PROP_accExp); // TODO: in Datum konvertieren?
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback(result);
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDClass
	@function motd
	@desc Gibt das "Motto des Tages" zurück. Zum "Motto des Tages" vgl.
	die entspr. Operation in der Dokumentation der JANUS-Server-Bibliotheken.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Den Text des aktuellen Mottos des Tages.
	@throws {PDException}
	 */
	motd : function(callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.motd.eventName, this);
		this._lastMsg = '';
		this.retcode = -1;
		var result = "";
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.motd():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.motd()");
					result = resp.getString(JafWebAPI.PDClass.motd.PROP_motd);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/// Klassenoperationen
	/**
	@memberof PDClass
	@function callOperation
	@desc Ruft eine Klassenoperation auf dem Server auf.
	Zum Vorgehen, wie Sie einen Knopf zum synchronen bzw. asynchronen
	Aufruf einer Klassenoperation definieren, vgl. 
	das {@tutorial tut_buttonClassOp}.<br/>
	<span class="important">Hinweis</span> zur Implementierung auf seiten des JANUS-Servers: Der
	JafWeb-Client ruft, unabhängig von der Anzahl der Ein-/Ausgabeparameter
	der modellierten Methode, immer die <code>callOperation()</code>-Variante
	mit allen Ein-/Ausgabeparametern auf, weil anhand des Requests nicht erkannt
	werden kann, ob es Ausgabeparameter gibt. Der GUI-Client hingegen ruft für
	parameterlose Methoden direkt die <code>callOperation()</code>-Variante ohne
	Parameter auf. Das müssen Sie berücksichtigen, wenn Sie in letzterer User Code
	einfügen.
	@param {string} op Name der Klassenoperation. Der Name muss mit der
	Klasse in der Form "Klasse::Operation" oder "Klasse.Operation"
	angegeben werden.
	@param {boolean} [async=false] Bestimmt asynchrone (<code>true</code>) oder
	synchrone (<code>false</code>) Ausführung der Operation.
	Bei der asynchronen kann während der Ausführung auf der
	Seite weitergearbeitet werden, die synchrone dagegen
	blockiert alle Eingaben, bis die Operation zurückkommt.
	@param {string[]} [inStr] String oder String-Array mit Eingabeparametern.
	@param {PDObject[]} [inPdo] OID-String oder Liste von OID-Strings mit 
	Eingabeparametern für Objekte.
	@param {Function} [callback] Hier kann eine JavaScript-Funktion angegeben
	werden, die bei der Rückkehr der Operation
	ausgeführt werden soll (z.B. Meldung, Update einer Liste).
	Bei asynchroner Ausführung wird diese Callback-Funktion mit
	folgenden Parametern aufgerufen:
	<ul>
		<li><code>outStrs</code> String oder Array von Strings mit den Ausgabeparametern
		der Operation.</li>
		<li><code>outPdos</code> Ein einzelnes <code>PDObject</code> (oder <code>null</code>)
		oder ein Array von <code>PDObject</code>s mit den Ausgabeobjekten der
		Operation.</li>
		<li><code>result</code> Numerischer Rückgabewert der Operation.</li>
	</ul>
	@param {Object} [scope] JavaScript-Objekt, in dessen Kontext die bei <code>callback</code>
	übergebene Funktion ausgeführt werden soll. Falls nicht angegeben, wird
	die Funktion im <code>PDClass</code>-Kontext ausgeführt.
	@return {Object} Bei synchroner Ausführung wird ein JavaScript-Objekt
	mit diesen Properties zurückgegeben:
	<ul>
		<li><code>outStrs</code> Array mit den Ausgabe-Strings.</li>
		<li><code>outPdos</code> Array mit den Ausgabe-PDObjects.</li>
		<li><code>result</code> Numerischer Rückgabewert der aufgerufenen Operation.</li>
	</ul>
	@throws {PDException}
	@see [PDObject.callOperation()]{@link PDObject#callOperation}
	@see Zu fortgeschrittenen Server-Operationsaufrufen siehe
	auch {@tutorial tut_calloperaton} und die Klasse {@link PDOperationCall}.
	*/
	callOperation : function(op, async, inStr, inPdo, callback, scope)
	{
		var aInStr = null;
		var aInPdo = null;
		var bAsync = false;
		var fCallback = null;
		var oScope = null;
		var pos = 1;
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			bAsync = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (typeof arguments[pos] != "function"))
		{
			aInStr = arguments[pos];
			if(!JafWeb.isArray(aInStr))
				aInStr = [aInStr];
			pos++;
		}
		else
			aInStr = [ ];
		if(arguments.length > pos && (typeof arguments[pos] != "function"))
		{
			aInPdo = arguments[pos];
			if(!JafWeb.isArray(aInPdo))
				aInPdo = [aInPdo];
			pos++;
		}
		else
			aInPdo = [ ];
		if(arguments.length > pos && (typeof arguments[pos] == "function" || arguments[pos] == null))
		{
			fCallback = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "object")
		{
			fCallback = arguments[pos];
			pos++;
		}
		var pars = new JParamPacker(JafWebAPI.PDClass.callOperation.eventName, this);
		pars.add(JafWebAPI.PDClass.callOperation.PAR_op, op);
		pars.add(JafWebAPI.PDClass.callOperation.PAR_async, bAsync);
		for(var i=0; i<aInStr.length; i++)
			pars.add(JafWebAPI.PDClass.callOperation.PAR_inStr + i, aInStr[i]);
		var aInOids = [ ];
		for(var i=0; i < aInPdo.length; i++)
		{
			if(!aInPdo[i])
				pars.add(JafWebAPI.PDClass.callOperation.PAR_inPdo + i, "0");
			else if(typeof aInPdo[i] == 'object' && aInPdo[i].oid)
				pars.add(JafWebAPI.PDClass.callOperation.PAR_inPdo + i, aInPdo[i].oid);
			else if(typeof aInPdo[i] == 'string' && aInPdo[i].match(/[0-9]:[0-9]/))
				pars.add(JafWebAPI.PDClass.callOperation.PAR_inPdo + i, aInPdo[i]);
			else
				pars.add(JafWebAPI.PDClass.callOperation.PAR_inPdo + i, "0");
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.callOperation(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var res = new Object();
		var result = -1;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.callOperation():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.callOperation()");
					res.result = resp.getInt('retCode', -1);
					res.outStrs = resp.getArray(JafWebAPI.PDClass.callOperation.PROP_OUTSTR, [], 'string', '');
					res.outPdos = resp.getArray(JafWebAPI.PDClass.callOperation.PROP_OUTPDO, [], 'PDObject', null);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof fCallback == "function")
					{
						fCallback.call((oScope || this), res.outStrs, res.outPdos, res.result);
					}
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof fCallback == 'function')
					fCallback(null);
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: bAsync,
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(bAsync === false)
			return res;
	},

	/// Arbeiten mit Mandanten
	/**
	@memberof PDClass
	@function changePrincipal
	@desc Zu einem anderen Mandanten wechseln.
	@param {string} princ Die Mandanten-Kennung.
	@return {number} Wenn alles geklappt hat, wird
	<code>0</code> zurückgegeben, ansonsten ein
	Fehlercode, der mit <code>PDMeta.getString()</code>
	in einen Text umgewandelt werden kann.
	@todo Implementierung
	 */
	changePrincipal : function(princ)
	{
		// TODO
	},
	
	/**
	@memberof PDClass
	@function getPrincipalFullname
	@desc Zu einer gegebenen Mandanten-Id den
	Langnamen des Mandanten ermitteln.
	@param {number} pid Numerische Mandanten-Id.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Mandantenname.
	 */
	getPrincipalFullname : function(pid, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.getPrincipalFullname.eventName, this);
		pars.add(JafWebAPI.PDClass.getPrincipalFullname.PAR_pid, pid);
		this._lastMsg = '';
		this.retcode = -1;
		var name = '';
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getPrincipalFullname():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getPrincipalFullname()");
					name = resp.getString(JafWebAPI.PDClass.getPrincipalFullname.PROP_name);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(name);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return name;
	},
	
	/**
	@memberof PDClass
	@function getPrincipalId
	@desc Zu einem gegebenen Mandantennamen die
	numerische Id ermitteln.
	@param {string} [name] Der Mandantenname. Fehlt diese
	Angabe, wird die Id des aktuell angemeldeten Mandanten ermittelt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Die Mandanten-Id. Wenn die nicht ermittelt
	werden konnte, wird <code>-1</code> zurückgegeben.
	@throws {PDException}
	 */
	getPrincipalId : function(name, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.getPrincipalId.eventName, this);
		if(name)
			pars.add(JafWebAPI.PDClass.getPrincipalId.PAR_name, name);
		this._lastMsg = '';
		this.retcode = -1;
		var pid = -1;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getPrincipalId():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getPrincipalId()");
					pid = resp.getInt(JafWebAPI.PDClass.getPrincipalId.PROP_pid);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(pid);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return pid;
	},
	
	/**
	@memberof PDClass
	@function getPrincipalName
	@desc Zu einer gegebenen Id die Mandantenkennung
	ermitteln.
	@param {number} [pid=-1] Die Mandanten-Id. Falls dieser Parameter fehlt
	oder mit <code>-1</code> angegeben wurde, wird der Name der aktuell
	angemeldeten Mandanten ermittelt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Der Name (Kennung) des 
	Mandanten.
	@throws {PDException}
	 */
	getPrincipalName : function(pid, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.getPrincipalName.eventName, this);
		var princId = -1;
		if(pid !== undefined)
			princId = -1;
		pars.add(JafWebAPI.PDClass.getPrincipalName.PAR_pid, princId);
		this._lastMsg = '';
		this.retcode = -1;
		var pname = '';
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getPrincipalName():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getPrincipalName()");
					pname = resp.getString(JafWebAPI.PDClass.getPrincipalName.PROP_name);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(pname);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return pname;
	},

	/**
	@memberof PDClass
	@function getPrincipalsForUser
	@desc Alle Mandanten zurückgeben, denen
	der angegebene Benutzer zugeordnet ist.
	@param {string} [user] Benutzerkennung. Falls der Parameter
	leer ist oder fehlt, werden alle Mandanten
	zurückgegeben.
	@return {string[]} String-Array mit den
	Kennungen der Mandanten, denen der
	Benutzer zugeordnet ist.
	@todo Implementierung
	 */
	getPrincipalsForUser : function(user)
	{
		// TODO
	},

	/**
	@memberof PDClass
	@function getUsersForPrincipal
	@desc Alle Benutzer ermitteln, die sich für den
	angegebenen Mandanten anmelden können.
	@param {string} princ Kennung des Mandanten.
	@return {string[]} String-Array mit den Kennungen
	der zu dem Mandanten gehörenden Benutzer.
	@todo Implementierung
	 */
	getUsersForPrincipal : function(princ)
	{
		// TODO
	},
	
	/**
	@memberof PDClass
	@function setPrincipalName
	@desc Einen Mandanten umbenennen.<br/>
	Diese Funktion darf nur von Benutzern mit
	Administratorrechten benutzt werden.
	@param {number} pid Die numerische Id des
	Mandanten.
	@param {string} name Der neue Name.
	@return {number} Wenn alles geklappt hat, wird
	<code>0</code> zurückgegeben, ansonsten ein
	Fehlercode, der mit [PDMeta.getString()]{@link PDMeta#getString}
	in einen Text umgewandelt werden kann.
	@todo Implementierung
	 */
	setPrincipalName : function(pid, name)
	{
		// TODO
	},
	
	/**
	@memberof PDClass
	@function setPrincipalsForUser
	@desc Legt die zu dem angegebenen Benutzer gehörenden
	Mandanten neu fest.
	@param {string} user Benutzername.
	@param {string[]} princs String-Array mit den Namen der
	Mandanten, für die sich der Benutzer anmelden
	können soll.
	@return {number} Wenn alles geklappt hat, wird
	<code>0</code> zurückgegeben, ansonsten ein
	Fehlercode, der mit [PDMeta.getString()]{@link PDMeta#getString}
	in einen Text umgewandelt werden kann.
	@todo Implementierung
	 */
	setPrincipalsForUser : function(user, princs)
	{
		// TODO
	},
	
	/**
	@memberof PDClass
	@function setUsersForPrincipal
	@desc Legt die zu einem Mandanten gehörenden Benutzer 
	neu fest.
	@param {string} princ Mandantenname.
	@param {string[]} users Array mit den
	Benutzer-Loginnamen, die dem Mandanten zugewiesen
	werden sollen.
	@return {number} Wenn alles geklappt hat, wird
	<code>0</code> zurückgegeben, ansonsten ein
	Fehlercode, der mit [PDMeta.getString()]{@link PDMeta#getString}
	in einen Text umgewandelt werden kann.
	@todo Implementierung
	 */
	setUsersForPrincipal : function(princ, users)
	{
		// TODO
	},
	
	/// Locks abfragen
	/**
	@memberof PDClass
	@function checkLock
	@desc Die Sperre eines Objekts testen.
	@param {string} oid OID des zu testenden Objekts.
	@param {number} mode
	@todo Implementierung
	 */
	checkLock : function(oid, mode)
	{
		// TODO
	},
	
	/**
	@memberof PDClass
	@function lockInfo
	@desc Informationen über ein gesperrtes Objekt ermitteln.
	@param {mixed} cid Klassen-Id des zu prüfenden Objekts. Statt
	der numerischen Id kann auch der Klassenname (String)
	angegeben werden.
	@param {number} oid Objekt-Id (unterer Teil) des zu prüfenden Objekts.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} Wenn das Objekt gesperrt ist und die Informationen
	ermittelt werden konnten, wird ein JavaScript-Objekt mit folgenden
	Properties zurückgegeben:
	<ul>
		<li><code>client</code> Name oder IP-Adresse des Clients, der das
			Objekt gesperrt hat.</li>
		<li><code>user</code> Name des Benutzers, der die Sperre verursacht hat.</li>
		<li><code>locktime</code> (int) Zeit in Sekunden, seit der die Sperre besteht.</li>
		<li><code>uid</code> (int) User-ID des sperrenden Benutzers.</li>
	</ul>
	Andernfalls wird <code>null</code> zurückgegeben.
	@throws {PDException}
	@example
// Vor dem Bearbeiten einer Anlage equipmentObj soll
// geprüft werden, ob eine Sperre besteht:
var li = PDClass.lockInfo(equipmentObj.oidHi, equipmentObj.oidLow);
if(li)
{
	var msg = PDMeta.getString('SC::FormTitleLocked');
	msg = msg.replace(/%c/, li['client']);
	msg = msg.replace(/%u/, li['user']);
	var dur = new UIDuration(li['locktime']);
	msg = msg.replace(/%t/, dur.toString());
	msg = msg.replace(/%i/, li['uid']);
	UIMessage.ok(msg);
	return false;
}
	*/
	lockInfo : function(cid, oid, callback)
	{
		if(arguments.length < 2)
			throw new PDException(PDException.ERROR, "Class- and/or object-Id missing!", "PDClass.lockInfo()");
		var pars = new JParamPacker(JafWebAPI.PDClass.lockInfo.eventName, this);
		if(cid && typeof cid == "string")
			pars.add(JafWebAPI.PDClass.lockInfo.PAR_clName, cid);
		else if(cid && typeof cid == "number" &&
				oid && typeof oid == "number")
			pars.add(JafWebAPI.PDClass.lockInfo.PAR_cid, cid);
		pars.add(JafWebAPI.PDClass.lockInfo.PAR_oidLow, oid);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.lockInfo(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = null;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.lockInfo():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.lockInfo()");
					var retCode = pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(retCode > 0)
					{
						result = new Object();
						result.client = resp.getString(JafWebAPI.PDClass.lockInfo.PROP_client);
						result.user = resp.getString(JafWebAPI.PDClass.lockInfo.PROP_user);
						result.locktime = resp.getInt(JafWebAPI.PDClass.lockInfo.PROP_locktime, -1);
						result.uid = resp.getInt(JafWebAPI.PDClass.lockInfo.PROP_uid, -1);
					}
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/// Finden von Objekten
	/**
	@memberof PDClass
	@function findObjects
	@desc Objekt-Suche über mehrere Klassen. Vgl. die <i>Quick Search</i>-Funktion
	im GUI-Client. Die Namen der Fachkonzeptklassen, in denen gesucht
	werden soll, stehen auf der Server-Seite in
	<code>PDClassWebProxy::QuickSearchClasses</code>, die maximale Trefferanzahl in
	<code>PDClassWebProxy::QuickSearchMaxRes</code> und die maximale Länge von
	Text-Attributen in <code>PDClassWebProxy::QuickSearchMaxLen</code>.
	@param {string} value Das Suchmuster.
	@param {number} [startRes=0] Start-Offset für die auszugebende Treffermenge.
	@param {boolean} [asOidList=false] Legt fest, ob die Rückgabe als OID-Liste (<code>true</code>)
	oder als HTML-Seite des Suchergebnisses erfolgen soll. Standard ist <code>false</code>.
	@param {string} [previewId=''] Wenn bei <code>asOidList</code> <code>false</code>
	angegeben wurde und das Suchergebnis in einem {@link PDPreview} dargestellt
	werden soll, muss hier der Name der Preview-Komponente
	([PDPreview.getName()]{@link PDPreview#getName}) angegeben werden, damit die
	Links in der Ergebnisseite entsprechend angepasst werden können.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} HTML-Seite mit dem Suchergebnis. Falls <code>asOidList</code>
	mit <code>true</code> angegeben wurde, wird stattdessen ein Array mit OID-Strings
	zurückgegeben.
	@throws {PDException}
	*/
	findObjects : function(value, startRes, asOidList, previewId, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.findObjects.eventName, this);
		pars.add(JafWebAPI.PDClass.findObjects.PAR_value, value);
		var fOidList = false;
		var iStartRes = 0;
		var sPrevId = '';
		var callb = null;
		var pos = 1;
		if(arguments.length > pos && (typeof arguments[pos] == 'number'))
		{
			iStartRes = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (typeof arguments[pos] == 'boolean'))
		{
			fOidList = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (typeof arguments[pos] == 'string'))
		{
			sPrevId = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && (typeof arguments[pos] == 'function'))
		{
			callb = arguments[pos];
			pos++;
		}
		pars.add(JafWebAPI.PDClass.findObjects.PAR_startRes, iStartRes);
		pars.add(JafWebAPI.PDClass.findObjects.PAR_asOidList, fOidList);
		pars.add(JafWebAPI.PDClass.findObjects.PAR_imgPath, UIApplication.getImageDir());
		pars.add(JafWebAPI.PDClass.findObjects.PAR_pid, sPrevId);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.findObjects(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = (fOidList==true ? [] : "");
		var pdClass = this;
		var successFn = function(req, options)
				{
					if(fOidList == true)
					{
						var resp = new JResponse(req, options, pdClass);
						if(resp.hasFatalError())
						{
							pdClass.retcode = (result && typeof result == 'string' && result != '' ? 0 : -1);
							throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
									"PDClass.findObjects():\n"+resp.getResponseText());
						}
						if(resp.hasError())
						{
							this.retcode = resp.getInt('retCode', -1);
							throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.findObjects()");
						}
						result = resp.getArray(JafWebAPI.PDClass.findObjects.PROP_oids, [], 'string', '');
					}
					else
						result = req.responseText;
					if(typeof callb == 'function')
						callb(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callb == 'function')
					callb();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callb),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDClass
	@function getSingleton
	@desc Das Singleton-Objekt einer mit dem Stereotyp <code>Singleton</code>
	modellierten Klasse holen.
	@param {mixed} cid Name der Singleton-Klasse oder deren Klassen-Id.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Singleton-Objekt.
	@throws {PDException}
	*/
	getSingleton : function(cid, callback)
	{
		this.retcode = -1;
		var pars = new JParamPacker(JafWebAPI.PDClass.getSingleton.eventName, this);
		if(cid && typeof cid == "string")
			pars.add(JafWebAPI.PDClass.getSingleton.PAR_clName, cid);
		else if(cid && typeof cid == "number")
			pars.add(JafWebAPI.PDClass.getSingleton.PAR_cid, cid);
		else
		{
			this._lastMsg = "getSingleton: Class-Id or Name missing!";
			throw new PDException(PDException.ERROR, "Class-Id or Name missing!", "PDClass.getSingleton()");
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.getSingleton(): Params: "+pars.toString());
		this._lastMsg = '';
		var result = null;
		var pdClass = this;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDClass.getSingleton():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getSingleton()");
				result = resp.getPDObject(JafWebAPI.PDClass.getSingleton.PROP_obj);
				pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	/*
	getSingletonPromise: function(cid){
		var self = this;
		return new Promise(function(resolve, reject){
			try {
				self.getSingleton(cid, function (obj) {
					resolve(obj);
				});
			} catch (e) {
				reject(e);
			}
		});
	},*/
		
	/**
	@memberof PDClass
	@function findObject
	@desc Ein Fachkonzeptobjekt einer bestimmten Klasse anhand eines Filters finden.<br/>
	@example
var filt = "Number=";
filt += PDTools.makeFilter(currentEquipmentNumber);
var eq = PDClass.findObject("Equipment", filt);
	@param {mixed} cid Name der Fachkonzeptklasse oder deren Klassen-Id.
	@param {string} filter Der JANUS-Filterausdruck zum Selektieren des Objekts.
	Der Ausdruck sollte typischerweise das oder die Schlüsselattribute der Klasse
	beinhalten, sodass genau ein Objekt gefunden wird.
	@param {Mixed} [attrs=true] Die zu ermittelnden Attribute - entweder eine Liste der
	technischen Attributnamen oder ein boolescher Typ, der anzeigt, ob alle Attribute
	laut Modell (<code>true</code>) oder gar keine Attribute (<code>false</code>)
	ermittelt werden sollen.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Objekt oder <code>null</code>, falls keines gefunden
	wurde. Falls der Filter auf mehrere Objekte passt, wird trotzdem nur das
	erste Objekt zurückgegeben!
	@throws {PDException}
	*/
	findObject : function(cid, filter, attrs, callback)
	{
		if(typeof callback == 'function')
		{
			var tmpCallb = function(extentRes) {
					if(extentRes && extentRes['rows'] && extentRes['rows'].length > 0)
						callback(extentRes['rows'][0]);
					else
						callback(null);
				};
			this.getExtent(cid, filter, '', null, 0, 1, tmpCallb, false, attrs);
			return;
		}
		var extnt = this.getExtent(cid, filter, '', null, 0, 1, null, false, attrs);
		if(!extnt || !extnt.rows || extnt.rows.length == 0)
			return null;
		return extnt.rows[0];
	},

	/**
	@memberof PDClass
	@function isUnique
	@desc Stellt fest, ob es bereits ein Objekt außer dem übergebenen
	gibt, das in dem angegebenen Attribut den selben Wert
	besitzt.
	@param {number} cid Klassen-Id. Es werden auch Objekte berücksichtigt,
	für die die angegebene Klasse Basisklasse ist.
	@param {number} [oid] Id des Objekts, dessen Eindeutigkeit geprüft
	werden soll. Dieser Parameter kann auch weggelassen werden.
	@param {string} attr Name des zu prüfenden Attributs.
	@param {string} attrVal Wert des Attributs.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} <code>true</code> falls eindeutig, sonst
	<code>false</code>.
	@throws {PDException}
	 */
	isUnique : function(cid, oid, attr, attrVal, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.isUnique.eventName, this);
		// cid ist optional
		if(arguments.length < 3)
		{
			throw new PDException(PDException.FATAL, "needs at least 3 parameters!", "PDClass.isUnique()");
		}
		var callbFn = null;
		var pos = 0;
		if(arguments.length == 3)
		{
			if(typeof cid == 'number')
			{
				throw new PDException(PDException.FATAL, "if classname not given the first Parameter has to be a complete OID-String!",
						"PDClass.isUnique()");
			}
			pars.add(JafWebAPI.PDClass.isUnique.PAR_oid, cid);
			pos = 1;
		}
		else
		{
			if(typeof cid == "string")
				pars.add(JafWebAPI.PDClass.isUnique.PAR_clName, cid);
			else if(typeof cid == "number")
				pars.add(JafWebAPI.PDClass.isUnique.PAR_cid, cid);
			pars.add(JafWebAPI.PDClass.isUnique.PAR_oidLow, oid);
			pos = 2;
		}
		while(pos < arguments.length)
		{
			if(typeof arguments[pos] == 'function')
			{
				callbFn = arguments[pos];
				break;
			}
			pos++;
		}
		pars.add(JafWebAPI.PDClass.isUnique.PAR_attr, arguments[pos]);
		pos++;
		pars.add(JafWebAPI.PDClass.isUnique.PAR_val, arguments[pos]);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.isUnique(): Params: "+pars.toString());
		this._lastMsg = '';
		this.retcode = -1;
		var result = false;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.isUnique():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.isUnique()");
					result.vals = resp.getBool(JafWebAPI.PDClass.isUnique.PROP_result, false);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callbFn == 'function')
						callbFn(result.vals);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callbFn),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callbFn)
			return result;
	},
	
	/// Zaehlen von Objekten
	/**
	@memberof PDClass
	@function countObjects
	@desc Dient zum Zählen der Objekte einer bestimmten Klasse.
	Die zu zählende Menge kann über ein Selektionskriterium
	eingeschränkt werden. 
	@param {mixed} cid Klassen-ID. Statt der numerischen ID kann auch 
	der Klassenname angegeben werden.
	@param {string} [sel] Selektionskriterium, mit dem die Menge
	der Objekte eingeschränkt werden soll.
	@param {string} [thisOid] OID eines Objekts, das in dem
	Selektionskriterium mit dem Schlüsselwort "this" referenziert 
	werden kann. So lässt sich das Kriterium von diesem Objekt
	oder seinen Attributen abhängig machen.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number}eger Anzahl der gefundenen Objekte. Im Fehlerfall
	wird <code>-1</code> zurückgegeben.
	@throws {PDException}
	*/
	countObjects : function(cid, sel, thisOid, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.countObjects.eventName, this);
		if(typeof cid == "string")
			pars.add(JafWebAPI.PDClass.countObjects.PAR_clName, cid);
		else if(typeof cid == "number")
			pars.add(JafWebAPI.PDClass.countObjects.PAR_cid, cid);
		var callbFn = null;
		var pos = 1;
		if(pos < arguments.length && typeof arguments[pos] == "string")
		{
			pars.add(JafWebAPI.PDClass.countObjects.PAR_sel, (sel||""));
			pos++;
			if(pos < arguments.length)
			{
				if(JafWeb.isPDObject(arguments[pos]))
					pars.add(JafWebAPI.PDClass.countObjects.PAR_thisOid, arguments[pos].oid);
				else if(typeof arguments[pos] == 'string')
					pars.add(JafWebAPI.PDClass.countObjects.PAR_thisOid, arguments[pos]);
				pos++;
			}
		}
		if(pos < arguments.length && typeof arguments[pos] == 'function')
		{
			callbFn = arguments[pos];
			pos++;
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.countObjects(): Params: "+pars.toString());
		this.retcode = -1;
		this._lastMsg = '';
		var result = -1;
		var pdClass = this;
		var successFn = function(req, options)
				{
					//JDebug.log(JDebug.DEBUG, "Response: "+resp.getResponseText());
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.countObjects():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.countObjects()");
					result = resp.getInt(JafWebAPI.PDClass.countObjects.PROP_count, -1);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callbFn == 'function')
						callbFn(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!callbFn),
				params: pars.getPostParams(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callbFn)
			return result;
	},
	
	/// Arbeiten mit Aufzaehlungen
	/**
	@memberof PDClass
	@function getEnumCode
	@desc Für nicht erweiterbare Aufzählungstypen oder erweiterbare 
	Aufzählungstypen mit globaler Sichtbarkeit der Erweiterungen 
	kann mit Hilfe dieser Funktion aus einem Aufzählungswert (in 
	Form einer Zeichenkette) der entsprechende numerische Code 
	ermittelt werden.
	@param {mixed} cid ID der Klasse, zu der das Attribut <code>attr</code>
	gehört. Statt der numerischen ID kann auch der Klassenname angegeben werden.
	@param {string} attrName Name des Attributs mit dem Aufzählungstypen.
	@param {string} enumVal Der abzufragende Wert des Aufzählungstypen.
	@param {number} [lang] Wenn der Aufzählungstyp mehrsprachig spezifiziert ist, 
	muss hier die Sprache angegeben werden, in der der in <code>enumVal</code>
	angegebene Wert übergeben wurde.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Der numerische Code des Aufzählungswertes. Dieser kann z.B.
	direkt in Filtern verwendet werden, die sich dadurch sprachunabhängig
	formulieren lassen.
	@throws {PDException}
	*/
	getEnumCode : function(cid, attrName, enumVal, lang, callback)
	{
		if(arguments.length < 3)
		{
			throw new PDException(PDException.FATAL, "needs at least 3 parameters!",
					"PDClass.getEnumCode()");
		}
		var clName = cid;
		if(typeof clName != 'string')
			clName = this.PDMeta.getClass(cid);
		var enumName = this.PDMeta.getType(clName, attrName);
		var actLang = this.PDMeta.getLang();
		if(PDMeta['_enumCache'])
		{
			var consts = PDMeta['_enumCache'][enumName];
			if(consts)
			{
				for(var i = 0; i < consts.length; i++)
				{
					if(consts[i]['tech'] == enumVal)
					{
						if(typeof callback == 'function')
						{
							callback(consts[i]['code']);
							return;
						}
						return consts[i]['code'];
					}
					if(consts[i]['vals'][actLang] == enumVal) // auch ergon. abfragen
					{
						if(typeof callback == 'function')
						{
							callback(consts[i]['code']);
							return;
						}
						return consts[i]['code'];
					}
				}
			}
		}
		var pars = new JParamPacker(JafWebAPI.PDClass.getEnumCode.eventName, this);
		if(typeof cid == "string")
			pars.add(JafWebAPI.PDClass.getEnumCode.PAR_clName, cid);
		else if(typeof cid == "number")
			pars.add(JafWebAPI.PDClass.getEnumCode.PAR_cid, cid);
		pars.add(JafWebAPI.PDClass.getEnumCode.PAR_attr, attrName);
		pars.add(JafWebAPI.PDClass.getEnumCode.PAR_enumVal, enumVal);
		if(arguments.length > 3 && typeof lang == "number")
			pars.add(JafWebAPI.PDClass.getEnumCode.PAR_lang, lang);
		//JDebug.log(JDebug.WARN, "PDClass.getEnumCode(): Params: "+pars.toString());
		this.retcode = -1;
		this._lastMsg = '';
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getEnumCode():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getEnumCode()");
					result = resp.getInt(JafWebAPI.PDClass.getEnumCode.PROP_code, -1);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: false, // das Ergebnis aendert sich nicht, deshalb cachen lassen!
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDClass
	@function getEnumConst
	@desc Die möglichen Werte eines als <b>Klassen</b>attribut definierten Aufzählungstyps 
	einer beliebigen Klasse lesen.
	@param {string} cls Name der Klasse, die das Enum-Attribut enthält.
	Statt der Klasse kann hier auch das Attribut in der Form "Klasse.Attribut"
	angegeben werden. Der zweite Parameter muss dann entfallen.
	@param {string} attr Name des Enum-Attributs.
	@param {boolean} [withIcons=false] Legt fest, ob auch die den Ausprägungen zugewiesenen
	Icons ermittelt werden sollen. Standardwert ist <code>false</code>. Beachten Sie,
	dass, falls hier <code>true</code> angegeben wird, die Rückgabe eine andere
	Struktur hat.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Array} Array mit den Objekten für die Ausprägungen. Diese haben folgende
	Properties:
 	<ul>
 		<li><code>code</code> Technischer Name der Enum-Ausprägung.</li>
 		<li><code>icon</code> Optionale Angabe eines Web-Icons, das für die
 			Ausprägung angezeigt werden soll. Image-Pfad und Name,
 			relativ ab dem Image-Verzeichnis der Web-Anwendung.</li>
 		<li><code>text</code> Der für die Enum-Konstante auf der Oberfläche
 			anzuzeigende Text.</li>
 	</ul>
 	<span class="important">Hinweis:</span> Da im JANUS-Umfeld die Werte von Enum-Attributen über den ergonomischen
 	Bezeichner der Ausprägung in der ersten Sprache gesetzt wird, enthalten hier
 	die Properties <code>code</code> und <code>text</code> den gleichen Wert.
	@throws {PDException}
	*/
	getEnumConst : function(cls, attr, withIcons, callback)
	{
		this.retcode = -1;
		if(arguments.length < 1 || typeof cls != "string")
			throw new PDException(PDException.ERROR, "Needs at least one string parameter!", 
				"PDClass.getEnumConst()");
		var clName = cls;
		var attrName = '';
		var pars = new JParamPacker(JafWebAPI.PDClass.getEnumConst.eventName, this);
		var icns = false;
		var callbFn = null;
		var pos = 1;
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			attrName = arguments[pos];
			pos++;
		}
		else
		{
			var tmp = clName.replace(/::/g, '.').split('.');
			clName = tmp[0];
			attrName = tmp[1];
		}
		if(arguments.length > pos && typeof arguments[pos] == "boolean")
		{
			icns = arguments[pos];
			pos++;
		}
		if(arguments.length > pos && typeof arguments[pos] == "function")
		{
			callbFn = arguments[pos];
			pos++;
		}
		var enumName = this.PDMeta.getType(clName, attrName);
		if(PDMeta['_enumCache'])
		{
			var consts = this.PDMeta['_enumCache'][enumName];
			if(consts)
			{
				var result = [];
				for(var i = 0; i < consts.length; i++)
				{
					result.push({
							code: consts[i]['text'], // Workaround - s. redmine #14317!
							tech: consts[i]['tech'],
							icon: (consts[i]['icon'] || ''),
							text: consts[i]['text']
						});
				}
				if(typeof callbFn == 'function')
				{
					callbFn(result);
					return;
				}
				return result;
			}
		}
		pars.add(JafWebAPI.PDClass.getEnumConst.PAR_attr, clName + '.' + attrName);
		pars.add(JafWebAPI.PDClass.getEnumConst.PAR_icns, (withIcons === true));
		//JDebug.log(JDebug.DEBUG, "PDClass.getEnumConst(): Params: "+pars.toString());
		this._lastMsg = '';
		var res = null;
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getEnumConst():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getEnumConst()");
					var vals = resp.getArray(JafWebAPI.PDClass.getEnumConst.PROP_values, [], 'string', '');
					var icns = resp.getArray(JafWebAPI.PDClass.getEnumConst.PROP_icons, [], 'string', '');
					var extensible = resp.getBool(JafWebAPI.PDClass.getEnumConst.PROP_extensible, false);
					res = new Array();
					for(var i = 0; i < vals.length; i++)
					{
						res.push({
								'code': vals[i],
								'value': vals[i],
								'icon': (icns ? (icns[i] || '') : '')
							});
					}
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callbFn == 'function')
						callbFn(res);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callbFn),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: false, // das Ergebnis aendert sich nicht, deshalb cachen lassen!
				success: successFn,
				failure: failureFn
			});
		/*if(result.length != res.length)
			console.error("PDClass.getEnumConst() - cached result differs from that one got from the server", result, res);
		else for(var j=0; j < result.length && j < res.length; j++)
		{
			if(result[j].code != res[j].code || result[j].value != res[j].value || result[j].icon != res[j].icon)
			{
				console.error("PDClass.getEnumConst() - cached result differs from that one got from the server", result, res);
				break;
			}
		}*/
		if(!callbFn)
			return res;
	},
	
	/**
	@memberof PDClass
	@function getGlobalEnumConst
	@desc Die möglichen Werte und deren Codes eines global erweiterbaren oder eines 
	nicht erweiterbaren Aufzählungstyps ermitteln.<br/>
	Global erweiterbare Aufzählungstypen zeichnen sich dadurch aus, dass 
	die von einem beliebigen Benutzer bei einer beliebigen Klasse oder einem 
	beliebigen Objekt eingetragenen Erweiterungen allen anderen Benutzern 
	überall zur Verfügung stehen.<br/>
	<span class="important">Hinweis:</span> Bitte beachten Sie, dass bei
	einem in mehreren Sprachen spezifizierten 
	Aufzählungstyp in der Liste <code>vals</code> pro Sprache und 
	Selektionsmöglichkeit ein Wert eingetragen wird, während in <code>codes</code> 
	und <code>active</code> nur ein Wert pro Selektionsmöglichkeit geschrieben 
	wird.
	@param {string} ename Name des auszulesenden Aufzählungstyps.
	@param {boolean} icons Zeigt an, dass auch die für die Enum-Ausprägungen
	definierten Icons ermittelt werden sollen (Standardwert <code>false</code>).
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} JavaScript-Objekt mit folgenden Properties:
	<ul>
		<li><code>vals</code> Array von <code>String</code>, das die ausgelesenen
		Werte - ggf. in allen Sprachen - aufnimmt.</li>
		<li><code>codes</code> Array von <code>Number</code> mit den numerischen Codes
		der Ausprägungen.</li>
		<li><code>active</code> Array von <code>boolean</code>, in dem für die
		Ausprägung angezeigt wird, ob sie noch aktiv, d.h. nicht gelöscht ist.
		Bei einem nicht erweiterbaren Aufzählungstyp enthält die Liste nur
		<code>true</code>-Werte.</li>
		<li><code>tech</code> Bei nicht erweiterbaren Enums enthält dieses
		Property ein Array von <code>String</code> mit den technischen Namen der
		Ausprägungen.</li>
		<li><code>icons</code> Array Falls der Parameter <code>icons</code> mit
		<code>true</code> angegeben wurde, ist dieses Array definiert und enthält
		für jede Enum-Ausprägung den Namen der Icon-Datei. Stellen Sie diesen
		Werten den von [UIApplication.getImageDir()]{@link UIApplication#getImageDir}
		gelieferten Pfad voran, um die Icons anzuzeigen.
		Die Icon-Dateien müssen im Web-Ressourcen-Verzeichnis
		zugänglich sein, um angezeigt werden zu können.</li>
		<li><code>result</code> number Wenn die Werte geholt werden konnten, steht hier <code>0</code>,
		ansonsten kann der Fehlercode mit [PDMeta.getString()]{@link PDMeta#getString} in 
		einen Text umgewandelt werden.</li>
	</ul>
	@throws {PDException}
	*/
	getGlobalEnumConst : function(ename, icons, callback)
	{
		this.retcode = -1;
		var tmp = this.onGetGlobalEnumConst(ename, icons);
		if(tmp)
		{
			if(typeof callback == 'function')
			{
				callback(tmp);
				return;
			}
			return tmp;
		}
		var result = {};
		if(arguments.length < 1 || typeof ename != "string")
		{
			throw new PDException(PDException.ERROR, "Needs at least one string parameter!",
					"PDClass.getGlobalEnumConst()");
		}
		var res = null;
		if(this.PDMeta['_enumCache'])
		{
			var consts = this.PDMeta['_enumCache'][ename];
			if(consts)
			{
				var vals = [];
				var tech = [];
				var codes = [];
				var active = [];
				var icons = [];
				for(var i = 0; i < consts.length; i++)
				{
					vals = vals.concat(consts[i]['vals']);
					tech.push(consts[i]['tech']);
					codes.push(consts[i]['code']);
					active.push(consts[i]['active']);
					icons.push(PDMeta['_iconCache'] ? (this.PDMeta['_iconCache']['E_' + ename + '_val_' + consts[i]['code']] || '') : '');
				}
				res = {
						vals: vals,
						codes: codes,
						active: active,
						tech: tech,
						icons: icons,
						result: 0
					};
				if(typeof callback == 'function')
				{
					callback(res);
					return;
				}
				return res;
			}
		}
		var pars = new JParamPacker(JafWebAPI.PDClass.getGlobalEnumConst.eventName, this);
		pars.add(JafWebAPI.PDClass.getGlobalEnumConst.PAR_ename, ename);
		pars.add(JafWebAPI.PDClass.getGlobalEnumConst.PAR_icns, true);
		pars.add(JafWebAPI.PDClass.getGlobalEnumConst.PAR_tech, true);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.getGlobalEnumConst(): Params: "+pars.toString());
		this._lastMsg = '';
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getGlobalEnumConst():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getGlobalEnumConst()");
					result.tech = resp.getArray(JafWebAPI.PDClass.getGlobalEnumConst.PROP_tech, [], 'string', '');
					/*if(PDMeta.hasMultilang2Support())
					{
						result.vals = [];
						var numLangs = PDMeta.getNumLanguages();
						// bei Multilang2 muessen die Label unbedingt gui-seitig ermittelt werden!
						for(var i=0; i < result.tech.length; i++)
						{
							for(var l = 0; l < numLangs; l++)
								result.vals.push(PDMeta.getErgname(ename, result.tech[i], l) || result.tech[i]);
						}
					}
					else*/
						result.vals = resp.getArray(JafWebAPI.PDClass.getGlobalEnumConst.PROP_values, [], 'string', '');
					result.codes = resp.getArray(JafWebAPI.PDClass.getGlobalEnumConst.PROP_codes, [], 'number', '');
					result.active = resp.getArray(JafWebAPI.PDClass.getGlobalEnumConst.PROP_active, [], 'boolean', -1);
					result.icons = resp.getArray(JafWebAPI.PDClass.getGlobalEnumConst.PROP_icons, [], 'string', '');
					//var extensible = resp.getBool(JafWebAPI.PDClass.getGlobalEnumConst.PROP_extensible, false);
					result.result = resp.getInt(JafWebAPI.PROP_retCode, -1);
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		/*for(var p in {vals: 1, codes: 1, active: 1, tech: 1, icons: 1})
		{
			if(result[p].length != res[p].length)
				console.error("PDClass.getGlobalEnumConst() - cached result differs from that one got from the server", result, res);
			else for(var j=0; j < result[p].length && j < res[p].length; j++)
			{
				if(result[p][j] != res[p][j])
				{
					console.error("PDClass.getGlobalEnumConst() - cached result differs from that one got from the server", result, res);
					break;
				}
			}
		}*/
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDClass
	@function getCurrencies
	@desc Die für die Anwendung definierten Währungen mit zugehörigen
	Umrechnungskursen ermitteln.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} JavaScript-Objekt mit den Währungsnamen als Properties
	und den Umrechnungskursen als Werte.
	@throws {PDException}
	*/
	getCurrencies : function(callback)
	{
		this.retcode = -1;
		var pars = new JParamPacker(JafWebAPI.PDClass.getCurrencies.eventName, this);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.getCurrencies(): Params: "+pars.toString());
		this._lastMsg = '';
		var result = {};
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getCurrencies():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getCurrencies()");
					var names = resp.getArray(JafWebAPI.PDClass.getCurrencies.PROP_names, [], 'string', '');
					var values = resp.getArray(JafWebAPI.PDClass.getCurrencies.PROP_values, [], 'number', '');
					//var precisions = resp.getArray(JafWebAPI.PDClass.getCurrencies.PROP_prec, [], 'number', '');
					for(var i=0; i < names.length && i < values.length; i++)
						result[names[i]] = values[i];
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/// Klassenattribute:
	/**
	@memberof PDClass
	@function getAttribute
	@desc Den Wert eines Klassenattributs lesen.
	@param {string} classAttr Name des zu lesenden Klassenattributs in
	der Form "Klasse.Attribut" oder "Klasse::Attribut". Wird auch der 
	Parameter <code>attr</code> mit dem Attributnamen angegeben, muss 
	hier der Klassenname angegeben werden.
	@param {string} attr Name des zu lesenden Klassenattributs, wenn es nicht
	bereits mit dem ersten Parameter angegeben wurde.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Wert des Attributs.
	Wenn das Attribut erfolgreich gelesen
	werden konnte, enthält [PDClass.retcode]{@link PDClass#retcode} unmittelbar nach dem
	Aufruf dieser Funktion das Flag [PDObjectFlags.Available]{@link PDObjectFlags#Available}.
	Das kann wie folgt abgefragt werden:
	@example
var value = PDClass.getAttribute('Klasse.Attribut');
if(PDClass.retcode &amp; PDObjectFlags.Available == 0)
		alert('Attribut konnte nicht gelesen werden.');
	@throws {PDException}
	*/
	getAttribute : function(classAttr, attr, callback)
	{
		if(!classAttr || typeof classAttr != "string" || classAttr == "" || (attr && attr == ""))
		{
			throw new PDException(PDException.ERROR, "Needs at least one string parameter!",
					"PDClass.getAttribute()");
		}
		var pos = 0;
		var attrName = "";
		var fCallb = null;
		if(arguments.length >= 2 && (typeof arguments[1] == 'string'))
		{
			attrName = classAttr + "::" + attr;
			pos = 2;
		}
		else
		{
			var sep = classAttr.search(/\./);
			if(sep >= 0)
				attrName = classAttr.substring(0, sep) + "::" + classAttr.substr(sep+1);
			else
				attrName = classAttr;
			pos = 1;
		}
		if(arguments.length > pos && (typeof arguments[pos] == 'function'))
		{
			fCallb = arguments[pos];
			pos++;
		}
		var pars = new JParamPacker(JafWebAPI.PDClass.getAttribute.eventName, this);
		pars.add(JafWebAPI.PDClass.getAttribute.PAR_cattr, attrName);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.getAttribute(): Params: "+pars.toString());
		this.retcode = -1;
		this._lastMsg = '';
		var result = '';
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.getAttribute():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.getAttribute()");
					result = resp.getString(JafWebAPI.PDClass.getAttribute.PROP_value, '');
					pdClass.retcode = resp.getInt(JafWebAPI.PDClass.getAttribute.PROP_flags, -1);
					// TODO: flags?
					if(typeof fCallb == 'function')
						fCallb(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof fCallb == 'function')
					fCallb();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!fCallb),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!fCallb)
			return result;
	},
	
	/**
	@memberof PDClass
	@function setAttribute
	@desc Den Wert eines Klassenattributs setzen.<br/>
	<span class="important">Hinweis:</span> Im Unterschied zu
	[PDObject.setAttribute()]{@link PDObject#setAttribute} wird
	der Wert hier sofort per Request an den Server zu setzen versucht.
	@param {string} classAttr Name des zu setzenden Klassenattributs in
	der Form "Klasse.Attribut" oder "Klasse::Attribut". Wird auch der 
	Parameter <code>attr</code> mit dem Attributnamen angegeben, muss 
	hier der Klassenname angegeben werden.
	@param {string} [attr] Name des zu setzenden Klassenattributs, wenn es nicht
	bereits mit dem ersten Parameter angegeben wurde.
	@param {string} value Wert, auf den das Attribut gesetzt werden soll.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Wenn der Wert gesetzt werden konnte, wird 0 zurückgegeben,
	ansonsten kann der Fehlercode mit [PDMeta.getString()]{@link PDMeta#getString}
	in einen Text umgewandelt werden.
	@throws {PDException}
	*/
	setAttribute : function(classAttr, attr, value, callback)
	{
		if(!classAttr || classAttr == "" || arguments.length < 2)
		{
			throw new PDException(PDException.ERROR, "Needs at least two parameters!",
					"PDClass.setAttribute()");
		}
		var attrName = "";
		var val = "";
		if(arguments.length == 3)
		{
			attrName = classAttr + "::" + attr;
			val = value;
		}
		else
		{
			var pos = classAttr.search(/\./);
			if(pos >= 0)
				attrName = classAttr.substring(0, pos) + "::" + classAttr.substr(pos+1);
			else
				attrName = classAttr;
			val = arguments[1];
		}
		var pars = new JParamPacker(JafWebAPI.PDClass.setAttribute.eventName, this);
		pars.add(JafWebAPI.PDClass.setAttribute.PAR_cattr, attrName);
		pars.add(JafWebAPI.PDClass.setAttribute.PAR_value, val);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDClass.setAttribute(): Params: "+pars.toString());
		this.retcode = -1;
		this._lastMsg = '';
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.setAttribute():\n"+resp.getResponseText());
					if(resp.hasError())
					{
						// bei unbekannten Attributen schreibt der Server nur "unknown attribute" in die Fehleremeldung
						var msg = (resp.getErrorMessage() || '');
						msg = msg.replace('unknown attribute', attr);
						throw new PDException(PDException.ERROR, msg, "PDClass.setAttribute()");
					}
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(pdClass.retcode);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "POST",
				async: (!!callback),
				params: pars.getPostParams(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return this.retcode;
	},

	/**
	@memberof PDClass
	@function downloadDocument
	@desc Die Datei zu einem Attribut vom Typ <code>Document</code> herunterladen.
	@param {Mixed} [classOrObj] Wenn es sich um ein Objektattribut handelt, kann
	hier das {@link PDObject} oder dessen Klassenname oder Klassen-ID angegeben
	werden. In den letzten beiden Fällen muss dann beim folgenden Parameter die
	Objekt-ID angegeben werden.
	@param {number} [oidLow] Unterer Teil der Objekt-ID.
	@param {string} attr Der Name des Attributs. Im Falle eines Klassenattributs
	in der Form "Klassename::Attributname", im Falle eines Objektattributs nur
	der Attributname.
	 */
	downloadDocument : function(classOrObj, oidLow, attr)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.jexecDownload.eventName);
		if(arguments.length == 1)
		{
			// bisher einziger Fall: nur Klassenattribut
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_attr, attr);
		}
		else if(arguments.length > 0 && JafWeb.isPDObject(arguments[0]))
		{
			var obj = arguments[0];
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_cid, obj.cid);
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_clName, obj.classname);
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_oid, obj.GetPDObjectIdLow());
			if(arguments.length >= 2)
				pars.add(JafWebAPI.PDClass.jexecDownload.PAR_attr, arguments[1]);
			else
				throw new PDException(PDException.ERROR, "Second parameter (attribute) has unexpected type",
					"PDClass.downloadDocument()");
		}
		else if(arguments.length >= 3)
		{
			if(typeof arguments[0] == 'string')
				pars.add(JafWebAPI.PDClass.jexecDownload.PAR_clName, arguments[0]);
			else if(typeof arguments[0] == 'number')
				pars.add(JafWebAPI.PDClass.jexecDownload.PAR_cid, arguments[0]);
			else
				throw new PDException(PDException.ERROR, "First parameter (class name or id) has unexpected type",
					"PDClass.downloadDocument()");
			if(typeof arguments[1] == 'number')
				pars.add(JafWebAPI.PDClass.jexecDownload.PAR_oid, arguments[1]);
			else
				throw new PDException(PDException.ERROR, "Second parameter (object id) has unexpected type",
					"PDClass.downloadDocument()");
			pars.add(JafWebAPI.PDClass.jexecDownload.PAR_attr, arguments[2]);
		}
		var url = this.getDownloadURL() +
					"?janusFileOperation=downloadWebEvent&iid=" + this.PDMeta.getInstanceID() +
					"&sessionId=" + this.getAuthToken() +
					"&janusWebEvent=" + pars.getEventString(true);
		window.open(url);
	},

	// Zu Debugging-Zwecken:
	/*
	@ignore(true)
	@memberof PDClass
	@function checkTransaction
	@desc Informationen zu einer offenen Transaktion ermitteln.
	@param {number} tid Die Transaktions-Id.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} Ein JavaScript-Objekt mit den Informationen.
	@throws {PDException}
	 */
	checkTransaction : function(tid, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.checkTransaction.eventName, this);
		pars.add('tid', tid);
		this._lastMsg = '';
		this.retcode = -1;
		var res = { };
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.checTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.checkTransaction()");
					res = resp.getData();
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(res);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return res;
	},
	
	/*
	@ignore(true)
	@memberof PDClass
	@function checkTransactions
	@desc Informationen zu den offenen Transaktionen ermitteln.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} Ein JavaScript-Objekt mit den Informationen.
	@throws {PDException}
	 */
	checkTransactions : function(callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDClass.checkTransactions.eventName, this);
		this._lastMsg = '';
		this.retcode = -1;
		var res = { };
		var pdClass = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDClass.checkTransactions():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDClass.checkTransactions()");
					res = resp.getData();
					pdClass.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(res);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.getURL(),
				authToken: this.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return res;
	},
	
	// Events zur Aenderungsueberwachung
	/**
	 * @memberof PDClass
	 * @function addObjectEventHandler
	 * @desc Eine Handler-Funktion hinzufügen, um über
	 * Änderungen an Fachkonzeptobjekten benachrichtigt zu werden.<br/>
	 * Es können beliebig viele Handler-Funktionen registriert
	 * werden. Mit
	 * [removeObjectEventHandler()]{@link PDObject#removeObjectEventHandler}
	 * lassen sie sich wieder entfernen.
	 * @param {string} type Art des Ereignisses. Folgende Werte sind
	 * möglich:
	 * <ul>
	 *  <li>"changed": Ein {@link PDObject} wurde geändert.</li>
	 *  <li>"created": Ein {@link PDObject} wurde fachlich neu
	 *  angelegt (vgl. [PDClass.newObject()]{@link PDClass#newObject}).</li>
	 *  <li>"delete": Ein {@link PDObject} soll fachlich gelöscht werden
	 *  (vgl. [PDClass.deleteObject()]{@link PDClass#deleteObject}).</li>
	 * </ul>
	 * @param {Function} handler Die Handler-Funktion. Je nach Ereignistyp enthält
	 * das beim Aufruf an diese Funktion übergebene JavaScript-Objekt unterschiedliche
	 * Properties:
	 * <ul>
	 *  <li>"changed":
	 * 		<ul>
	 * 			<li><code>object</code>: Das geänderte {@link PDObject}.</li>
	 * 			<li><code>member</code>: Das geänderte Element (Attribut oder Beziehung).</li>
	 * 			<li><code>oldValue</code>: Der alte Wert (optional).</li>
	 * 			<li><code>newValue</code>: Der neue Wert (optional).</li>
	 * 		</ul>
	 *  </li>
	 *  <li>"created":
	 * 		<ul>
	 * 			<li><code>object</code>: Das neu angelegte {@link PDObject}.</li>
	 * 		</ul>
	 *  </li>
	 *  <li>"delete":
	 * 		<ul>
	 * 			<li><code>object</code>: Das zu löschende {@link PDObject}.</li>
	 * 		</ul>
	 *  </li>
	 * </ul>
	 */
	addObjectEventHandler : function(type, handler) {
		if(!this._evtHandler)
			this._evtHandler = {};
		if(!this._evtHandler[type])
			this._evtHandler[type] = [];
		this._evtHandler[type].push(handler);
	},
	
	/**
	 * @memberof PDClass
	 * @function removeObjectEventHandler
	 * @desc Eine registrierte Handler-Funktion entfernen.
	 * @param {string} type Art des Ereignisses. Zu den
	 * möglichen Werten vgl.
	 * [addObjectEventHandler()]{@link PDClass#addObjectEventHandler}.
	 * @param {Function} [handler] Die zu entfernende
	 * Handler-Funktion. Wird diese nicht angegeben,
	 * werden alle registrierten Handler des angegeben
	 * Typs entfernt!
	 */
	removeObjectEventHandler : function(type, handler) {
		if(!this._evtHandler || !this._evtHandler[type])
			return;
		if(!handler)
		{
			this._evtHandler[type] = [];
			return;
		}
		var i = 0;
		while(i < this._evtHandler[type].length)
		{
			if(this._evtHandler[type][i] == handler)
				this._evtHandler[type].splice(i, 1);
			else
				i++;
		}
	},
	
	/**
	 * @memberof PDClass
	 * @function dispatchEvent
	 * @desc Verteilt Ereignisse an registrierte Handler.
	 * @param {string} type Art des Ereignisses. Zu den
	 * möglichen Werten vgl.
	 * [addObjectEventHandler()]{@link PDClass#addObjectEventHandler}.
	 * @param {Object} data An das Event zu übegebende Daten
	 * (ereignistyp-abhängig).
	 */
	dispatchEvent : function(type, data)
	{
		if(this._evtHandler && this._evtHandler[type])
		{
			for(var i = 0; i < this._evtHandler[type].length; i++)
			{
				try
				{
					this._evtHandler[type][i](data);
				}
				catch(ex)
				{
					JDebug.log(JDebug.WARN, "PDClass " + type + "-event handler" +
							" throwed an exception: " + ex);
				}
			}
		}
	},
	
	/*
	 * Handler für Änderungsereignisse aufrufen.
	 */
	handleObjectChanged : function(obj, member, oldVal, newVal)
	{
		//console.log("### PDClass.handleObjectChanged(" +
		//		obj.classname + ":" + obj.GetPDObjectIdLow() + ", '" +
		//		member + "')");
		this.dispatchEvent('changed', {
				'object': obj,
				'member': member,
				'oldValue': oldVal,
				'newValue': newVal
			});
	},

	/*
	 * Handler für Neuanlageereignisse aufrufen.
	 */
	handleObjectCreated : function(obj)
	{
		//console.log("### PDClass.handleObjectCreated(" +
		//		obj.classname + ":" + obj.GetPDObjectIdLow() + ")");
		this.dispatchEvent('created', {
				'object': obj
			});
	},

	/*
	 * Handler für Löschereignisse aufrufen.
	 */
	handleObjectDelete : function(obj)
	{
		//console.log("### PDClass.handleObjectDelete(" +
		//		obj.classname + ":" + obj.GetPDObjectIdLow() + ")");
		this.dispatchEvent('delete', {
				'object': obj
			});
	},

	PDObjectCache : {
		add : function(obj)
		{
			if(obj && obj.oidHi && obj.oidLow)
			{
				var key = ""+obj.oidHi+":"+obj.oidLow;
				if(this._objects[key])
					return true; // ist bereits drin
				this._objects[key] = obj;
				return true;
			}
			return false;
		},
		
		Delete : function()
		{
			for(var sProp in this._objects)
			{
				this._objects[sProp].Delete();
				delete this._objects[sProp];
			}
			this._objects = null;
		},
		
		_getKey : function(oidHi, oidLow)
		{
			var key = "";
			if(arguments.length == 2)
				key = ""+oidHi+":"+oidLow;
			else if(oidHi && typeof oidHi == "string")
				key = oidHi.replace(/_/,":");
			return key;
		},
		
		removeObject : function(oidHi, oidLow)
		{
			var key = this._getKey(oidHi, oidLow);
			if(key != "" && this._objects[key])
			{
				this._objects[key].Delete();
				delete this._objects[key];
				this._objects[key] = undefined;
				return true;
			}
			return false;
		},
		
		get : function(oidHi, oidLow)
		{
			var key = this._getKey(oidHi, oidLow);
			if(key != "" && this._objects[key])
			{
				//console.log("PDObjectCache: object "+oidHi+":"+oidLow+" found");
				if(!JafWeb.isPDObject(this._objects[key]))
				{
					JDebug.log(JDebug.ERROR, "Object from cache is NOT a valid PDObject!");
					this._objects[key] = undefined;
					return null;
				}
				return this._objects[key];
			}
			//console.log("PDObjectCache: object "+oidHi+":"+oidLow+" not found");
			return null;
		},

		_objects : { }
	}
};
// Objekt erzeugen im Workspace-Frameset!


var PDMetaClass = Class.create();
/**
 * @class PDMeta
 * @desc Client-seitige Repräsentation der JANUS-Laufzeit-Klasse 
 * <code>PDMeta</code>. Diese stellt im wesentlichen Informationen
 * aus dem UML-Modell zur Verfügung.<br/>
 * Es gibt von dieser Klasse genau ein Objekt, das unter seinem
 * Namen als globale Variable zugänglich ist. Zum Beispiel
 * zum Ermitteln des ergonomischen Namens eines Attributs:
 * Das globale <code>PDMeta</code>-Objekt wird beim Laden des
 * Workspace automatisch per Server-Aufruf initialisiert.
 * @author Frank Fiolka
 * @example
var ergName = PDMeta.getErgname("MyClass", "MyAttr");
 */
PDMetaClass.prototype =
{
	_iconCache : { },
	_loadCompleted : false,
	PDClass : null,
	
	/// kein oeffentlicher Konstruktor!
	initialize : function(pdClass)
	{
		this.PDClass = (pdClass || null);
	},
	
	/// Konstanten zum Umgang mit <code>PDMeta.getTypeId()</code>.
	/// TypeIds und Flags
	/**
	@memberof PDMeta
	@desc Kein Typ definiert.
	@const {number}
	 */
	TIdNone : 0,
	/**
	@memberof PDMeta
	@desc Ein ganzzahliges Attribut.
	@const {number}
	 */  
	TIdInt : 1,
	/**
	@memberof PDMeta
	@desc Eine Fließkommazahl.
	@const {number}
	 */
	TIdFloat : 2,
	/**
	@memberof PDMeta
	@desc Eine Zeichenkette.
	@const {number}
	 */
	TIdString : 3,
	/**
	@memberof PDMeta
	@desc Ein Datum.
	@const {number}
	 */
	TIdDate : 4,
	/**
	@memberof PDMeta
	@desc Eine Uhrzeit.
	@const {number}
	 */  
	TIdTime : 5,
	/**
	@memberof PDMeta
	@desc Ein Zeitstempel.
	@const {number}
	 */ 
	TIdTimestamp : 6,
	/**
	@memberof PDMeta
	@desc Eine Seriennummer.
	@const {number}
	 */
	TIdSerial : 7,
	/**
	@memberof PDMeta
	@desc Eine E-Mail-Adresse.
	@const {number}
	 */
	TIdEmail : 8,
	/**
	@memberof PDMeta
	@desc Eine URL.
	@const {number}
	 */
	TIdURL : 9,
	/**
	@memberof PDMeta
	@desc Ein allgemeines Datenfeld (Dateiname).
	@const {number}
	 */
	TIdFilename : 10,
	/**
	@memberof PDMeta
	@desc Eine Währung.
	@const {number}
	 */
	TIdCurrency : 11,
	/**
	@memberof PDMeta
	@desc Ein boolescher Datentyp.
	@const {number}
	 */
	TIdBool : 12,
	/**
	@memberof PDMeta
	@desc Ein Aufzählungstyp.
	@const {number}
	 */
	TIdEnum : 13,
	/**
	@memberof PDMeta
	@desc Ein (verschlüsseltes) Passwort.
	@const {number}
	 */
	TIdPassword : 14,
	/**
	@memberof PDMeta
	@desc Abstraktes Attribut.
	@const {number}
	 */
	TIdAbstract : 15,
	/**
	@memberof PDMeta
	@desc C-Zeitstempel (Sekunden seit 1.1.1970).
	@const {number}
	 */
	TIdCTime : 17,
	/**
	@memberof PDMeta
	@desc Benutzer-Kennung.
	@const {number}
	 */
	TIdUser : 18,
	/**
	@memberof PDMeta
	@desc Währungstyp mit variablem Kurs.
	@const {number}
	 */
	TIdVarCurrency : 19,
	/**
	@memberof PDMeta
	@desc N-Seite einer N-zu-N Beziehung.
	@const {number}
	 */
	TIdRelNN : 20,
	/**
	@memberof PDMeta
	@desc N-Seite einer 1-zu-N Beziehung.
	@const {number}
	 */
	TIdRel1N : 21,
	/**
	@memberof PDMeta
	@desc 1-Seite einer 1-zu-N Beziehung.
	@const {number}
	 */
	TIdRelN1 : 22,
	/**
	@memberof PDMeta
	@desc 1-Seite einer 1-zu-1 Beziehung.
	@const {number}
	 */
	TIdRel11 : 23,
	/**
	@memberof PDMeta
	@desc Attribut, das als Beziehung verwendet wird.
	@const {number}
	 */
	TIdRef : 24,
	/**
	@memberof PDMeta
	@desc Eine allgemeine OID. Kann zur Implementierung 
	einseitiger Beziehungen verwendet werden.
	@const {number}
	 */
	TIdOID : 25,
	/**
	@memberof PDMeta
	@desc Bitmaske zum Ausfiltern der Typkennung aus der TypeId.
	@const {number}
	 */
	TIdMask : 255,
	/**
	@memberof PDMeta
	@desc Attribut dient als Fremdschlüssel.
	@const {number}
	 */
	TFlagForeignKey : 0x0100,
	/**
	@memberof PDMeta
	@desc Attribut belegt keinen Speicher in der Datenbank.
	@const {number}
	 */
	TFlagNoStorage : 0x0200,
	/**
	@memberof PDMeta
	@desc Ein erweiterbarer Aufzählungstyp mit global sichtbaren 
	Erweiterungen.
	@const {number}
	 */
	TFlagGlobalEnum : 0x0400,
	/**
	@memberof PDMeta
	@desc Ein erweiterbaren Aufzählungstyp mit lokal sichtbaren 
	Erweiterungen.
	@const {number}
	 */
	TFlagLocalEnum : 0x0800,
	/**
	@memberof PDMeta
	@desc Das Attribut ist mehrsprachig gespeichert.
	@const {number}
	 */
	TFlagMultiLang : 0x1000,
	/**
	@memberof PDMeta
	@desc Es handelt sich um einen (fachlichen) Schlüssel.
	@const {number}
	 */
	TFlagKey : 0x2000,
	/**
	@memberof PDMeta
	@desc Es handelt sich um ein Muss-Attribut oder eine Muss-Beziehung.
	@see <code>TFlagMandatoryWhen</code>.
	@const {number}
	 */
	TFlagMandatory : 0x4000,
	/**
	@memberof PDMeta
	@desc Das Attribut kann nur verändert werden, wenn das Objekt neu 
	angelegt wurde.
	@const {number}
	 */
	TFlagNonMutable : 0x8000,
	/**
	@memberof PDMeta
	@desc Es handelt sich um ein implizites Attribut, das nicht im 
	OOA-Modell spezifiziert wurde.
	@const {number}
	 */
	TFlagImplicit : 0x10000,
	/**
	@memberof PDMeta
	@desc Auf das Attribut kann nur lesend zugegriffen werden.
	@const {number}
	 */
	TFlagReadOnly : 0x20000,
	/**
	@memberof PDMeta
	@desc Auf das Attribut kann über die Benutzungsoberfläche nur 
	lesend zugegriffen werden.
	@const {number}
	 */
	TFlagGUIReadOnly : 0x40000,
	/**
	@memberof PDMeta
	@desc Das Attribut ist abgeleitet. Der abgeleitete Wert kann 
	durch einen manuell angegebenen Wert gesetzt werden.<br>
	Wird <code>PDObject.setAttribute()</code> mit einem gültigen Wert 
	aufgerufen, ist dieser Wert fortan wirksam. Auf den berechneten 
	Wert kann "umgeschaltet" werden, indem <code>PDObject::setAttribute()</code> 
	mit einer leeren Zeichenkette als Attributwert aufgerufen wird.
	@tattr int
	 */
	TFlagOverruleable : 0x80000,
	/**
	@memberof PDMeta
	@desc Ein Aufzählungstyp, der die Selektion von mehreren Werten erlaubt.
	@const {number}
	 */
	TFlagMultiEnum : 0x100000,
	/**
	@memberof PDMeta
	@desc Die Währungsinformationen für diesen Währungstyp stammen von einem 
	anderen Währungsattribut.<br>
	Der Wert ist nur für Währungs-Attribute gültig.
	@const {number}
	 */
	TFlagDerivedCurrency : 0x200000,
	/**
	@memberof PDMeta
	@desc Das Serial-Attribut soll Lücken, die durch das Löschen von Objekten 
	oder andere Ereignisse entstanden sind, nicht wieder füllen.<br>
	Die Implementierung des Attributs wird damit einfacher und effizienter, 
	jedoch gelten dann starke Restriktionen für Definition eines 
	solchen Datentyps.<br/>
	<span class="important">Hinweis:</span> Der Wert ist gleich dem Wert der Konstanten <code>TFlagDerivedCurrency</code>, 
	d.h. bei der Prüfung auf dieses Flag muss zunächst der Datentyp 
	abgefragt werden.
	@const {number}
	 */
	TFlagFastSerial : 0x200000, // this.TFlagDerivedCurrency
	/**
	@memberof PDMeta
	@desc Das String-Attribut wird in UTF-8 Kodierung (Unicode) gespeichert.<br/>
	<span class="important">Hinweis:</span> Der Wert ist gleich dem Wert der Konstanten <code>TFlagDerivedCurrency</code>, 
	d.h. bei der Prüfung auf dieses Flag muss zunächst der Datentyp abgefragt werden.
	@const {number}
	 */
	TFlagUnicode : 0x200000, // this.TFlagDerivedCurrency
	/**
	@memberof PDMeta
	@desc Ein abgeleitetes Attribut, dessen Wert aus Gründen besserer Performanz 
	in der (relationalen) Datenbank gespeichert wird.
	@const {number}
	 */
	TFlagAutoCache : 0x400000,
	/**
	@memberof PDMeta
	@desc Beziehung ist im Baum darstellbar.
	@const {number}
	 */
	TFlagRelTree : 0x800000,
	/**
	@memberof PDMeta
	@desc Beziehung bildet einen eigenständigen Knoten.
	@const {number}
	 */
	TFlagRelNode : 0x1000000,
	/**
	@memberof PDMeta
	@desc In den Selektionslisten zur Herstellung dieser Beziehung werden 
	die bereits konnektierten Objekte nicht mehr angezeigt.<br>
	Das Flag ist gesetzt, wenn das Property <code>FilterConnected</code> für
	die entsprechende Beziehung gesetzt ist.<br/>
	<span class="important">Hinweis:</span> Der Wert ist gleich <code>TFlagMultiLang</code>.
	@const {number}
	 */
	TFlagRelFilterConnected : 0x1000, // this.TFlagMultiLang
	/**
	@memberof PDMeta
	@desc Für Beziehung ist das Property <code>MandatoryWhen</code> gesetzt, d. h. 
	ob die Beziehung eine Muss-Beziehung ist, entscheidet sich 
	anhand eines User Codes, der im Wert des Properties <code>MandatoryWhen</code> 
	angegeben werden muss.<br/>
	<span class="important">Hinweis:</span> Das Property <code>MandatoryWhen</code> kann auch für Attribute spezifiziert 
	werden, jedoch ist bei Attributen dieses Flag niemals gesetzt.
	Der Wert ist gleich dem Wert der Konstanten <code>TFlagIsArrayIndex</code>. 
	@const {number}
	 */
	TFlagMandatoryWhen : 0x40000000,
	/**
	@memberof PDMeta
	@desc Die Beziehung soll im Baum per Drag & Drop herstellbar sein.
	@tattr int
	 */
	TFlagRelDragDrop : 0x0800, // this.TFlagLocalEnum
	/**
	@memberof PDMeta
	@desc Wenn die Beziehung über Drag & Drop hergestellt wird, soll 
	eine Rückfrage beim Benutzer gestellt werden.
	@const {number}
	 */
	TFlagRelDragDropAsk : 0x0800, // this.TFlagGlobalEnum
	/**
	@memberof PDMeta
	@desc Es handelt sich um ein manuelles Cache-Attribut.
	@const {number}
	 */
	TFlagCache : 0x2000000,
	/**
	@memberof PDMeta
	@desc Das Attribut/die Beziehung darf für Mehrfachänderungen 
	verwendet werden.
	@const {number}
	 */
	TFlagMultiChange : 0x4000000,
	/**
	@memberof PDMeta
	@desc Die Beziehung ist manuell sortierbar. Neue Elemente werden am Ende 
	der Liste eingefügt.
	@const {number}
	 */
	TFlagOrderable : 0x400000,
	/**
	@memberof PDMeta
	@desc Die Beziehung ist manuell sortierbar. Neue Elemente werden am 
	Anfang der Liste eingefügt.
	@const {number}
	 */
	TFlagOrderableInverse : 0x2000000,
	/**
	@memberof PDMeta
	@desc Die Beziehung ist manuell sortierbar. Wo neue Werte eingefügt.
	werden, entscheidet sich dynamisch.
	@const {number}
	 */
	TFlagOrderableDynamic : 0x100000,
	/**
	@memberof PDMeta
	@desc Dieses Flag ist bei einer Beziehung gesetzt, wenn (im Falle 
	einer Mussbeziehung) die abhängigen Objekte automatisch gelöscht 
	werden sollen, wenn ein Objekt der Klasse gelöscht wird, von der 
	die Beziehung ausgeht.<br/>
	<span class="important">Hinweis:</span> Der Wert ist gleich dem Wert der Konstanten 
	<code>TFlagDerivedCurrency</code>.
	@const {number}
	 */
	TFlagAutoDelete : 0x200000, // this.TFlagDerivedCurrency
	/**
	@memberof PDMeta
	@desc Das Attribut/die Beziehung ist ein eindeutiger Schlüssel.
	@const {number}
	 */
	TFlagUniqueKey : 0x8000000,
	/**
	@memberof PDMeta
	@desc Das Attribut/die Beziehung ist ein Klassenattribut.<br>
	Das Flag ist auch bei Klassenoperationen gesetzt.
	@const {number}
	 */
	TFlagClassGlobal : 0x10000000,
	/**
	@memberof PDMeta
	@desc Attribut Ist Teil eines Arrays.
	@const {number}
	 */
	TFlagIsArrayPart : 0x20000000,
	/**
	@memberof PDMeta
	@desc Attribut Ist Index eines Arrays.
	@const {number}
	 */
	TFlagIsArrayIndex : 0x40000000,
	/**
	@memberof PDMeta
	@desc Das Attribut ist nicht relevant für das Fachkonzept.<br/>
	<span class="important">Hinweis:</span> Der Wert ist gleich dem Wert von <code>TRelTree</code>, 
	der nur für Beziehungen gesetzt werden kann.
	@const {number}
	 */
	TFlagNotPDRelevant : 0x800000,
	/**
	@memberof PDMeta
	@desc Nach dem Attribut kann nicht sortiert werden.<br/>
	<span class="important">Hinweis:</span> Dieser Wert ist gleich <code>TFlagRelNode</code>, der 
	nur füe Beziehungen gesetzt sein kann. Das Sortieren nach einem 
	Attribut, bei dem dieses Flag gesetzt ist, wird durch die 
	Benutzungsoberfläche verhindert. In Iteratoren etc. kann trotzdem 
	nach diesem Attribut sortiert werden.
	@const {number}
	 */
	TFlagNotSortable : 0x1000000,
	/**
	@memberof PDMeta
	@desc Bitmaske zum Ausfiltern der Flags aus der TypeId.
	@const {number}
	 */
	TFlagMask : 0x7FFFFF00,
	
	/// ClassFlags
	/**
	@memberof PDMeta
	@desc Wenn dieses Flag gesetzt ist, sind mandantenlose Objekte in
	einer mandantenfähigen Anwendung nicht sichtbar. Das
	Flag ist natürlich nur sinnvoll, wenn die Anwendung
	mandantenfähig generiert wurde.
	@const {number}
	 */
	FreeObjectsInvisible : 1,
	/**
	@memberof PDMeta
	@desc Wenn dieses Flag gesetzt ist, können keine Objekte dieser
	Klasse erzeugt werden, die zu keinem Mandanten gehören. Das
	Flag ist natürlich nur sinnvoll, wenn die Anwendung
	mandantenfähig generiert wurde.
	@const {number}
	 */
	NoFreeObjects : 2,
	/**
	@memberof PDMeta
	@desc Gesetzt bei abstrakten Klassen.
	@const {number}
	 */
	AbstractClass : 4,
	/**
	@memberof PDMeta
	@desc Gesetzt bei mandantenfähigen Klassen. Dieses Flag muss nicht
	konstant sein! Das Flag ist natürlich nur sinnvoll, wenn die
	Anwendung mandantenfähig generiert wurde. Wenn das Flag
	veränderlich ist, wenn also die Mandantenfähigkeit dieser
	Klasse sich zur Laufzeit ändern kann, ist das Flag
	<code>MultiClientDynamic</code> zusätzlich gesetzt.
	@const {number}
	 */
	MultiClient : 8,
	/**
	@memberof PDMeta
	@desc Gesetzt, wenn in Listen die Anzahl der Objekte angezeigt
	werden soll.
	@const {number}
	 */
	ShowObjectCount : 128,
	/**
	@memberof PDMeta
	@desc Gesetzt bei Klassen mit vielen Attributen. Bewirkt, dass ein
	weniger speicherintensives SQL-Kommando verwendet wird, das
	bei größeren Datenmengen wesentlich schneller arbeitet.
	@const {number}
	 */
	HugeClass : 16,
	/**
	@memberof PDMeta
	@desc Die Objekte sollen nur lesbar sein, wenn der aktuelle Mandant
	nicht mit dem Besitzer des Objektes übereinstimmt. Das
	Flag ist natürlich nur sinnvoll, wenn die Anwendung
	mandantenfähig generiert wurde.
	@const {number}
	 */
	ReadOnlyForOtherPrincipals : 32,
	/**
	@memberof PDMeta
	@desc Wenn dieses Flag gesetzt ist, dann kann sich die
	Mandantenfähigkeit dieser Klasse zur Laufzeit ändern. Das
	Flag ist natürlich nur sinnvoll, wenn die Anwendung
	mandantenfähig generiert wurde.
	@const {number}
	 */
	MultiClientDynamic : 64,
	/**
	@memberof PDMeta
	@desc Dieses Flag ist bei Klassen gesetzt, deren Objekte nur
	von den Benutzern geändert und gelöscht werden können, die
	sie erzeugt haben (sowie vom Administrator). Das Flag
	ist natürlich nur sinnvoll, wenn die Anwendung
	mehrbenutzerfähig generiert wurde.
	@const {number}
	 */
	ChangeableByCreatorOnly : 256,
	/**
	@memberof PDMeta
	@desc Dieses Flag ist bei Klassen gesetzt, deren Zugriffsrecht
	für das selbe Objekt bei allen Attributen gleich ist. Dies
	wird vom JANUS-Laufzeitsystem genutzt, um die Abfrage der
	Zugriffsrechte zu optimieren. Das Flag kann durch Setzen
	des <i>Properties</i> <code>ClassLevelAccessRights</code>
	beeinflusst werden. Das Flag ist gesetzt, wenn das
	<i>Property</i> den Wert <code>True</code> hat.
	@const {number}
	 */
	ClassLevelAccessRights : 512,
	/**
	@memberof PDMeta
	@desc Ist dieses Flag gesetzt, soll vor dem Erzeugen eines Objekts
	der betreffenden Klasse der Benutzer gefragt werden. Das
	Flag kann durch das Setzen des <i>Properties</i>
	<code>AskNew</code> beeinflusst werden. Standardwert
	für dieses <i>Property</i> ist <code>False</code>.
	@const {number}
	 */
	AskNew : 1024,
	/**
	@memberof PDMeta
	@desc Ist dieses Flag gesetzt, soll vor dem Löschen eines Objekts
	der betreffenden Klasse der Benutzer gefragt werden. Das
	Flag kann durch das Setzen des <i>Properties</i>
	<code>AskDelete</code> beeinflusst werden. Standardwert
	für dieses <i>Property</i> ist <code>True</code>, so dass vor
	dem Löschen eines Objekts eine Rückfrage erfolgt.
	@const {number}
	 */
	AskDelete : 2048,
	/**
	@memberof PDMeta
	@desc Dieses Flag ist bei Klassen gesetzt, deren Leserecht
	(nicht zwangsläufig auch das Schreibrecht)
	für das selbe Objekt bei allen Attributen gleich ist. Dies
	wird vom JANUS-Laufzeitsystem genutzt, um die Abfrage der
	Zugriffsrechte zu optimieren. Das Flag kann durch Setzen
	des <i>Properties</i> <code>ClassLevelAccessRightsRO</code>
	eeinflusst werden. Das Flag ist gesetzt, wenn das
	<i>Property</i> den Wert <code>True</code> hat. Das <i>Property</i>
	kann nur im Zusammenhang mit
	<code>ClientInfo::noAccessRights()</code> und dynamisch
	implementierten Zugriffsrechten sinnvoll verwendet werden.
	@const {number}
	 */
	ClassLevelAccessRightsRO : 4096,
	/**
	@memberof PDMeta
	@desc Dieses Flag kennzeichnet Klassen, deren Objekte in
	Listenansichten mit verschiedenen, von einem Attributwert
	abhängigen Icons angezeigt werden sollen.
	@const {number}
	 */
	VariableListIcons : 8192,
	/**
	@memberof PDMeta
	@desc Dieses Flag kennzeichnet Klassen, deren Objekte im
	Baum mit verschiedenen, von einem Attributwert
	abhängigen Icons angezeigt werden sollen.
	@const {number}
	 */
	VariableTreeIcons : 16384,
	/**
	@memberof PDMeta
	@desc Objekte von Klassen, bei denen dieses Flag gesetzt ist,
	werden nicht komplett auf <code>ReadOnly</code> gesetzt,
	wenn der Erfassungsdialog desselben Objekts zweimal
	geöffnet wird.
	@const {number}
	 */
	LockAttributesOnly : 32768,
	/**
	@memberof PDMeta
	@desc Dieses Flag kann über das Property
	<code>NoCreatePermissionCache</code> gesetzt werden. Ist
	das Flag gesetzt, wird das Ergebnis von
	<code>ClientInfo::getCreatePermission()</code> Client-seitig
	nicht gespeichert, sondern immer wieder neu vom Server
	erfragt.
	@const {number}
	 */
	NoCreatePermissionCache : 65536,
	/**
	@memberof PDMeta
	@desc Dieses Flag kann über das Property
	<code>NoDelPermissionCache</code> gesetzt werden. Ist
	das Flag gesetzt, wird das Ergebnis von
	<code>ClientInfo::getDelPermission()</code> Client-seitig
	nicht gespeichert, sondern immer wieder neu vom Server
	erfragt.
	@const {number}
	 */
	NoDelPermissionCache : 131072,
	/**
	@memberof PDMeta
	@desc Titel im Infobereich des GUI-Clients (weiße
	Schrift auf grauem Hintergrund)
	des Outlook-Look-And-Feels darstellen.
	@const {number}
	 */
	ShowListTitleInInfoBar : 262144,
	/**
	@memberof PDMeta
	@desc Der Klassen-<i>Extent</i> ist manuell sortierbar.
	Neue Elemente werden am Ende der Liste eingefügt.
	@const {number}
	 */
	Orderable : 0x80000,
	/**
	@memberof PDMeta
	@desc Der Klassen-<i>Extent</i> ist manuell sortierbar.
	Neue Elemente werden am Anfang der Liste eingefügt.
	@const {number}
	 */
	OrderableInverse : 0x100000,
	/**
	@memberof PDMeta
	@desc Löschen von Objekten dieser Klasse soll im Baum
	über das Kontextmenü möglich sein.
	@const {number}
	 */
	TreeDelete : 0x200000,
	/**
	@memberof PDMeta
	@desc Erzeugen von Objekten dieser Klasse soll im Baum
	über das Kontextmen möglich sein.
	@const {number}
	 */
	TreeNew : 0x400000,
	/**
	@memberof PDMeta
	@desc Das Filtern nach "allen Textspalten" im GUI-Client soll
	möglich sein. Dieses Flag lässt sich durch den Wert des
	<i>Properties</i> <code>AllTextColumnsSearch</code>
	beeinflussen.
	@const {number}
	 */
	AllTextColumnsSearch : 0x800000,
	/**
	@memberof PDMeta
	@desc Die Objekte der Klasse werden nicht in der Datenbank
	gespeichert. Das Feature wird zurzeit nur von JANUS/Embedded
	unterstützt.
	@const {number}
	 */
	TransientClass : 0x1000000,
	/**
	@memberof PDMeta
	@desc Die Objekte dieser Klasse sollen immer im Speicher gehalten
	werden.
	@const {number}
	 */
	Preload : 0x2000000,
	/**
	@memberof PDMeta
	@desc Die Objekte dieser Klasse sollen mit Hilfe von
	<code>PDObject::submit()</code> an einen Web-Server
	geschickt werden, wenn der Anwender ein Objekt bearbeitet.
	@const {number}
	 */
	Submit : 0x4000000,
	/**
	@memberof PDMeta
	@desc Das <i>Flag</i> ist gesetzt, wenn die Klasse relevant für
	den Baum sein soll, d.h. wenn im GUI-Client ein Baum-Knoten
	(Objekt der Klasse <code>PDExtensionItem</code>) für diese
	Klasse vorhanden ist.
	@const {number}
	 */
	TreeRelevant : 0x8000000,
	/**
	@memberof PDMeta
	@desc Die Daten von Objekten dieser Klasse können asynchron
	geschrieben werden. Asynchrones Schreiben ist nur möglich,
	wenn die Anwendung mit einem Datenbank-Cluster betrieben wird.
	@const {number}
	 */
	WriteAsync : 0x10000000,
	/**
	@memberof PDMeta
	@desc Dieses Flag ist gesetzt, wenn im UML-Modell angegeben wurde,
	dass die Klasse im Stammdaten-Menue erscheinen soll.
	@const {number}
	 */
	InMainMenu : 0x20000000,
	/**
	@memberof PDMeta
	@desc Dieses Flag ist gesetzt, wenn die Klasse für die
	Benutzungsoberfläche relevant ist, d.h. wenn ein
	Dialog für die Klasse existiert.
	@const {number}
	 */
	UIRelevantClass : 0x40000000,
	/**
	@memberof PDMeta
	@desc Dieses <i>Flag</i> ist gesetzt um anzuzeigen, dass der
	<i>Object-Identifier</i> Unicode-Zeichen enthält. Das
	<i>Flag</i> wird automatisch auf <code>true</code> gesetzt,
	wenn die UILabel in der Anwendung auf Unicode umgestellt
	wurden. Über das <i>Property</i>
	<code>UnicodeObjectIdent</code> kann der
	<i>Object-Identifier</i> klassenweise auf Unicode umgeschaltet
	oder auf einen Ein-Byte-Zeichensatz zurückgeschaltet
	werden.
	@const {number}
	 */
	UnicodeObjectIdent : 0x80000000,

	//// Widget-Flags, die von getWidget() zurückgegeben werden können.
	/**
	@memberof PDMeta
	@desc Unbekanntes Widget, sollte nicht auftreten.
	@const {number}
	 */
	UnknownWidget : 0,
	/**
	@memberof PDMeta
	@desc Eine Gruppe (bei eingebetteten Typen).
	@const {number}
	 */
	EmbeddedGroup : 25,
	/**
	@memberof PDMeta
	@desc Gruppe mit Check-Boxen (Aufzählung)
	@const {number}
	 */
	CheckBoxGroup : 2,
	/**
	@memberof PDMeta
	@desc Gruppe mit Check-Boxen (Aufzählung).
	@const {number}
	 */
	MultiSelectListBox : 3,
	/**
	@memberof PDMeta
	@desc List-Box mit Eingabefeld.
	@const {number}
	 */
	ComboBox : 4,
	/**
	@memberof PDMeta
	@desc Klappliste mit Eingabefeld.
	@const {number}
	 */
	DropDownComboBox : 5,
	/**
	@memberof PDMeta
	@desc Klappliste.
	@const {number}
	 */
	DropDownListBox : 6,
	/**
	@memberof PDMeta
	@desc List-Box mit Einfachauswahl.
	@const {number}
	 */
	ListBox : 7,
	/**
	@memberof PDMeta
	@desc Menüknopf.
	@const {number}
	 */
	MenuButton : 8,
	/**
	@memberof PDMeta
	@desc Gruppe mit Radio-Knöpfen.
	@const {number}
	 */
	RadioButtonGroup : 9,
	/**
	@memberof PDMeta
	@desc Eingabefeld mit Verstellknöpfen.
	@const {number}
	 */
	SpinField : 10,
	/**
	@memberof PDMeta
	@desc Einfache Check-Box.
	@const {number}
	 */
	CheckBox : 11,
	/**
	@memberof PDMeta
	@desc Einzeiliges Textfeld.
	@const {number}
	 */
	TextField : 12,
	/**
	@memberof PDMeta
	@desc Mehrzeiliges Textfeld.
	@const {number}
	 */
	TextArea : 13,
	/**
	@memberof PDMeta
	@desc Mehrzeiliges Textfeld HTML.
	@const {number}
	 */
	TextAreaHTML : 14,
	/**
	@memberof PDMeta
	@desc Mehrzeiliges Textfeld RTF.
	@const {number}
	 */
	TextAreaRTF : 15,
	/**
	@memberof PDMeta
	@desc Benutzerdefiniertes Widget.
	@const {number}
	 */
	UserControl : 16,
	/**
	@memberof PDMeta
	@desc Menüeintrag.
	@const {number}
	 */
	MenuItem : 17,
	/**
	@memberof PDMeta
	@desc Druckknopf.
	@const {number}
	 */
	Button : 18,
	/**
	@memberof PDMeta
	@desc Beziehung mit Objektauswahl über den Fremdschlüssel.
	@const {number}
	 */
	KeyedObjectReference : 19,
	/**
	@memberof PDMeta
	@desc Beziehung als Klappliste.
	@const {number}
	 */
	DropDownListReference : 20,
	/**
	@memberof PDMeta
	@desc Beziehung mit Auswahl.
	@const {number}
	 */
	ObjectReference : 21,
	/**
	@memberof PDMeta
	@desc Liste für Mehrfachauswahl bei Enums.
	@const {number}
	 */
	DoubleList : 22,
	/**
	@memberof PDMeta
	@desc Liste für erweiterbare Mehrfachauswahl.
	@const {number}
	 */
	ExtDoubleList : 23,
	/**
	@memberof PDMeta
	@desc Beziehung in Tabellenform.
	@const {number}
	 */
	RelationTable : 24,
	/**
	@memberof PDMeta
	@desc Nicht relevant für Oberfläche.
	@const {number}
	 */
	NotUIRelevant : 1,
	/**
	@memberof PDMeta
	@desc Eingabefeld für IP-Adressen.
	@const {number}
	 */
	IPAddress : 26,
	/**
	@memberof PDMeta
	@desc Schieberegler.
	@const {number}
	 */
	Slider : 27,
	/**
	@memberof PDMeta
	@desc Darstellung eines Icons.
	@const {number}
	 */
	IconWidget : 28,
	/**
	@memberof PDMeta
	@desc Beziehung als Radio- und Checkbox-Gruppe darstellen.
	@const {number}
	 */
	RelationGroupWidget : 29,
	/**
	@memberof PDMeta
	@desc Operation als Button.
	@const {number}
	 */
	OpButton : 64,
	/**
	@memberof PDMeta
	@desc Operation als Popup.
	@const {number}
	 */
	OpPopup : 128,
	/**
	@memberof PDMeta
	@desc Operation als Knopf in der Toolbar.
	@const {number}
	 */
	OpToolbar : 256,
	/**
	@memberof PDMeta
	@desc Operation als Popup im Baum.
	@const {number}
	 */
	OpTreePopup : 32,
	/**
	@memberof PDMeta
	@desc Operation im Pulldown-Menü des Dialogs.
	@const {number}
	 */
	OpPulldown : 16,
	/**
	@memberof PDMeta
	@desc Operation als Popup in der Extent-Liste.
	@const {number}
	 */
	OpListPopup : 8,
	/**
	@memberof PDMeta
	@desc Operation als Popup in Beziehungslisten.
	@const {number}
	 */
	OpRelationPopup : 4,
	/**
	@memberof PDMeta
	@desc Maske für Zugriff.
	@const {number}
	 */
	WidgetMask : 0x1ff,
	//
	WidgetFlagsMask : 0x0ffe00,
	// Die restlichen Bits werden von getLeftNeighbour() genutzt
	WidgetNeighbourbits : 20,

	/// Redefinierbare Funktionen, mit denen sich die PDMeta-Abfragen manipulieren lassen.
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Abfrage
	von mehrsprachigen Texten manipulieren wollen.
	@param {string} code Technische ID des Textes.
	@param {number} lang Sprachindex.
	@return {string} Der Text in der angegebenen Sprachausprägung.
	Wenn das Standardverhalten benutzt werden
	soll, geben Sie hier <code>null</code> oder nichts zurück.
	 */
	onGetString : function(code, lang)
	{ },
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Abfrage
	von ergonomischen Bezeichnern manipulieren wollen.
	@param {string} clname Name der Klasse.
	@param {string} elem Element.
	@param {number} lang Sprachindex.
	@return {string} Ergonomischer Bezeichner.
	Wenn das Standardverhalten benutzt werden
	soll, geben Sie hier <code>null</code> oder nichts zurück.
	 */
	onGetErgname : function(clname, elem, lang)
	{ },
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Abfrage
	von ergonomischen Listenbezeichnern manipulieren wollen.
	@param {string} clname Name der Klasse.
	@param {string} elem Element.
	@param {number} lang Sprachindex.
	@return {string} Ergonomischer Bezeichner für die Verwendung
	in Listen.
	Wenn das Standardverhalten benutzt werden
	soll, geben Sie hier <code>null</code> oder nichts zurück.
	 */
	onGetListErgname : function(clname, elem, lang)
	{ },
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Abfrage
	von Elementbeschreibungen (Tooltipps) manipulieren wollen.
	@param {string} clname Name der Klasse.
	@param {string} elem Element.
	@param {number} lang Sprachindex.
	@return {string} Der Hinweistext.
	Wenn das Standardverhalten benutzt werden
	soll, geben Sie hier <code>null</code> oder nichts zurück.
	 */
	onGetDescription : function(clname, elem, lang)
	{ },
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Abfrage
	des Namens der Zielklasse einer Beziehung manipulieren wollen.<br/>
	@param {string} clname Name der Klasse.
	@param {string} rel Name des Beziehung.
	@return {string} Name der Klasse, die der angegebenen
	gegenüberliegt. Wenn das Standardverhalten benutzt werden
	soll, geben Sie hier <code>null</code> oder nichts zurück.
	@example
// Spezielle Klassen, erkennbar am Namenspräfix "MO", sollen
// ebenfalls über PDMeta abfragbar sein. Dazu
// wird ein eigener Request Handler aufgerufen.
PDMeta.onGetAssocClass = function(clname, rel)
	{
		if(clname.substr(0, 2) != 'MO')
			return null;
		// Request
		var res = '';
		var pars = new JParamPacker("MyPDMeta.getAssocClass");
		pars.add("clName", clname);
		pars.add("relname", rel);
		var successFn = function(req)
			{
				var resp = new JResponse(req);
				if(!resp.hasFatalError())
				{
					if(resp.hasError())
						JDebug.log(JDebug.WARN, 'PDMeta.onGetAssocClass failed!');
					else
						res = resp.getString('clName');
				}
			};
		// synchroner Request!
		JafWeb.ajaxRequest({
				url: getWorkspace().getUrlRoot(),
				method: "GET",
				async: false,
				params: pars.get(),
				disableCaching: true,
				scope: this,
				success: successFn,
				failure: function() { }
			});
		return res;
	};
	 */
	onGetAssocClass : function(clname, rel)
	{ },
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Abfrage
	des inversen Namens einer Beziehung manipulieren wollen.
	Vgl. das Beispiel zu [onGetAssocClass()]{@link PDMeta#onGetAssocClass}.
	@param {string} clname Name der Klasse.
	@param {string} rel Name des Beziehung.
	@return {string} Name der Klasse, die der angegebenen
	gegenüberliegt. Wenn das Standardverhalten benutzt werden
	soll, geben Sie hier <code>null</code> oder nichts zurück.
	 */
	onGetInverseRelation : function(clname, rel)
	{ },
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Datentypermittlung
	manipulieren wollen.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {number} Wenn es sich um einen benutzerdefinierten 
	Datentyp handelt, wird ein Wert &lt; 0 zurückggeeben,
	dessen Absolutwert die Id des Typen darstellt.
	Bei den anderen Datentypen wird eine Kombination
	aus Datentyp-Konstante und Flags. Vgl. dazu die
	entsprechenden Konstanten <code>TId...</code> 
	bzw. <code>TFlag...</code> in <code>PDMeta</code>.
	Um mit der Standardbehandlung fortzufahren, geben Sie
	<code>0</code> zurück.
	@see [getTypeId()]{@link PDMeta#getTypeId}, [getType()]{@link PDMeta#getType}
	zum Ermitteln der Namen von Aufzählungstypen.
	@example
PDMeta.onGetTypeId = function(clname, elem) {
		if(clname == 'MOEvent')
		{
			if(elem == 'Type' || elem == 'Level')
				return PDMeta.TIdEnum & PDMeta.TIdMask;
		}
		return 0;
	};
	 */
	onGetTypeId : function(clname, elem)
	{ return 0; },
	/**
	@memberof PDMeta
	@desc Redefinieren Sie diese Funktion, wenn Sie die Ermittlung von
	Datentypnamen aus den Metainformationen manipulieren möchten.
	@param {mixed} clname Name oder numerische Id der Fachkonzeptklasse.
	@param {string} elem Name des Klassenelements, dessen Typ ermittelt
	werden soll.
	@return {string} Der Typbezeichner. Geben Sie einen Leerstring oder
	nichts zurück, wenn mit der Standardbehandlung fortgefahren werden
	soll.
	@see [getType()]{@link PDMeta#getType}, [getTypeId()]{@link PDMeta#getTypeId}
	@example
PDMeta.onGetType = function(clname, elem) {
		if(clname == 'MOEvent')
		{
			if(elem == 'Type')
				return 'MOEventTypeET';
			if(elem == 'Level')
				return 'MOEventLevelET';
		}
	};
	 */
	onGetType : function(clname, elem)
	{ },

	/**
	@memberof PDMeta
	@desc Wird bei der Abfrage von [PDMeta.isAbstract()]{@link PDMeta#isAbstract}
	aufgerufen. Sie können diese Funktion reimplementieren,
	um das Standardverhalten zu übersteuern. Alle Rückgaben
	mit booleschem Typ bewirken, dass das Standardverhalten
	unterdrückt wird.
	@param {string} clname Name der Fachkonzeptklasse.
	 */
	onIsAbstract : function(clname)
	{ },
	
	/**
	@memberof PDMeta
	@desc Wird beim Aufruf von [PDMeta.getSubClasses()]{@link PDMeta#getSubClasses}
	ausgelöst.
	@param {string} clname Name der Fachkonzeptklasse.
	@return {string[]} Die Namen der Unterklassen. Geben Sie
	keinen oder einen nach <code>false</code> auflösbaren
	Wert zurück, um das Standardverhalten beizubehalten, oder
	ein Array mit den Namen der Unterklassen.
	 */
	onGetAllSubClasses : function(clname)
	{ },
	// TODO: komplettieren

	/**
	@memberof PDMeta
	@desc Gibt Informationen über das spezifizierte 
	GUI-Oberflächenelement zurück.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {number} Eine Kombination aus Widget-Flags,
	deren Konstanten in {@link PDMeta} definiert sind.
	 */
	getWidget : function(clname, elem)
	{
		if(this["_"+clname+"_w"] && this["_"+clname+"_w"][elem])
			return this["_"+clname+"_w"][elem];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getWidget(baseCls, elem);
		return 0;
	},
	
	/**
	@memberof PDMeta
	@desc Gibt Meta-Informationen über eine Fachkonzeptklasse
	zurück.
	@param {string} clname Name der Klasse.
	@return {number} Kombination aus einem oder mehreren Flags.
	Die Werte der Flags sind als Konstanten in {@link PDMeta}
	definiert.
	 */
	getClassFlags : function(clname)
	{
		if(!clname || !this._classes_f || !this._classes_f[clname])
			return 0;
		return this._classes_f[clname];
	},

	/**
	@memberof PDMeta
	@desc Stellt für ein Attribut fest, ob es als Zeichenkette 
	gespeichert wird.
	@param {string} clname Name der Klasse.
	@param {string} attr Name des Elements.
	@return {boolean} Es wird <code>true</code> zurückgegeben, 
	wenn es sich um ein als String gespeichertes Attribut 
	handelt.
	 */
	isString : function(clname, attr)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(attr)==true)
		{
			var trav = attr.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isString(trgtCl, trav.join('->'));
		}
		var t = this.getTypeId(clname, attr) & this.TIdMask;
		return (t == this.TIdString || t == this.TIdSerial || t == this.TIdEmail ||
			t == this.TIdURL || t == this.TIdFilename);
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob es sich bei dem angegebenen Element
	um ein Klassenattribut bzw. eine 
	Klassenoperation handelt.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	eine Klassenoperation resp. ein Klassenattribut
	handelt, sonst <code>false</code>.
	 */
	isClassGlobal : function(clname, elem)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isClassGlobal(trgtCl, trav.join('->'));
		}
		return (this.getTypeId(clname, elem) & this.TFlagClassGlobal) != 0;
	},
	

	/**
	@memberof PDMeta
	@desc Stellt fest, ob es sich um ein abgeleitetes
	Attribut handelt.
	@param {string} clname Name der Klasse.
	@param {string} attr Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein abgeleitetes Attribut handelt, sonst <code>false</code>.
	 */
	isDerived : function(clname, attr)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(attr)==true)
		{
			var trav = attr.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isDerived(trgtCl, trav.join('->'));
		}
		if(!this["_"+clname+"_derAttrs"])
			return false;
		for(var i=0; i < this["_"+clname+"_derAttrs"].length; i++)
		{
			if(this["_"+clname+"_derAttrs"][i] == attr)
				return true;
		}
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.isDerived(baseCls, attr);
		return false;
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob es sich bei dem angegebenen 
	Attribut um einen fachlichen Schlüssel handelt.
	@param {string} clname Name der Klasse.
	@param {string} attr Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein Schlüsselattribut handelt, sonst <code>false</code>.
	 */
	isKey : function(clname, attr)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(attr)==true)
		{
			var trav = attr.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isKey(trgtCl, trav.join('->'));
		}
		return (this.getTypeId(clname, attr) &
				this.TFlagKey) != 0;
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob das Element zwingend eine
	Eingabe erfordert.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein Mussattribut handelt, sonst <code>false</code>.
	 */
	isMandatory : function(clname, elem)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isMandatory(trgtCl, trav.join('->'));
		}
		return (this.getTypeId(clname, elem) &
				this.TFlagMandatory) != 0;
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob es sich bei dem angegebenen 
	Attribut um ein nur lesbares handelt.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein nur lesbares Attribut handelt, sonst <code>false</code>.
	 */
	isReadOnly : function(clname, elem)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isReadOnly(trgtCl, trav.join('->'));
		}
		return (this.getTypeId(clname, elem) &
				 this.TFlagReadOnly) != 0; // und TFlagGUIReadOnly?
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob das Element nach seiner Ersterfassung
	änderbar ist.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein änderbares Attribut handelt, sonst <code>false</code>.
	 */
	isChangeable : function(clname, elem)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isChangeable(trgtCl, trav.join('->'));
		}
		return (this.getTypeId(clname, elem) & 
				this.TFlagNonMutable) == 0;
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob das angegebene Element als relevant 
	für die Benutzungsoberfläche modelliert ist.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein UI-relevantes Element handelt, sonst <code>false</code>.
	 */
	isUIRelevant : function(clname, elem)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isUIRelevant(trgtCl, trav.join('->'));
		}
		if((this.getClassFlags(clname) & this.UIRelevantClass) == 0)
			return false;
		return (this.getWidget(clname, elem) & this.NotUIRelevant) == 0;
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob das angegebene Element als relevant 
	für das Fachkonzept modelliert ist, d.h. persistent
	gespeichert wird.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein Fachkonzept-relevantes Element handelt, sonst <code>false</code>.
	 */
	isPDRelevant : function(clname, elem)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isPDRelevant(trgtCl, trav.join('->'));
		}
		if((this.getClassFlags(clname) & this.TransientClass) != 0)
			return false;
		return (this.getTypeId(clname, elem) &
				this.TFlagNotPDRelevant) == 0;
	},

	/**
	@memberof PDMeta
	@desc Stellt fest, ob es sich bei dem angegebenen Element
	um ein Attribut handelt.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	ein Attribut handelt, sonst <code>false</code>.
	 */
	isAttribute : function(clname, elem)
	{
		if(!clname || clname=="" || !this["_"+clname+"_attrs"])
			return false;
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isAttribute(trgtCl, trav.join('->'));
		}
		for(var i=0; i < this["_"+clname+"_attrs"].length; i++)
		{
			if(this["_"+clname+"_attrs"][i] == elem)
				return true;
		}
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.isAttribute(baseCls, elem);
		return false;
	},
	
	/**
	@memberof PDMeta
	@desc Stellt fest, ob es sich bei dem angegebenen Element
	um eine Beziehung handelt.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	eine Beziehung handelt, sonst <code>false</code>.
	 */
	isRelation : function(clname, elem)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.isRelation(trgtCl, trav.join('->'));
		}
		if(!clname || clname=="" || !this["_"+clname+"_rels"])
			return false;
		for(var i=0; i<this["_"+clname+"_rels"].length; i++)
		{
			if(this["_"+clname+"_rels"][i] == elem)
				return true;
		}
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.isRelation(baseCls, elem);
		return false;
	},
	
	/**
	@memberof PDMeta
	@desc Stellt fest, ob es sich bei dem angegebenen Element
	um eine Operation handelt.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {boolean} <code>true</code>, wenn es sich um
	eine Operation handelt, sonst <code>false</code>.
	 */
	isOperation : function(clname, elem)
	{
		if(!clname || clname=="" || !this["_"+clname+"_ops"])
			return false;
		for(var i=0; i<this["_"+clname+"_ops"].length; i++)
		{
			if(this["_"+clname+"_ops"][i] == elem)
				return true;
		}
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.isOperation(baseCls, elem);
		return false;
	},
	
	/**
	@memberof PDMeta
	@desc Den ergonomischen Namen der Anwendung, einer Klasse
	oder eines Klassenelements zurückgeben.<br/>
	Wenn <code>elem</code> nicht angegeben
	ist, wird der ergonomische Name der Klasse, wenn auch 
	dieser nicht angegeben ist, derjenige der
	Anwendung zurückgegeben.
	@param {string} [clname] Name der Klasse.
	@param {string} [elem] Name des Elements (Attribut,
	Beziehung oder Operation).
	@param {number} [lang] Nummer der Anwendungssprache.
	Bei fehlendem <code>lang</code> wird für die aktuelle
	Sprache abgefragt.
	@return {string} Der ergonomische Name.
	*/
	getErgname : function(clname, elem, lang)
	{
		var cl = '';
		var el = '';
		var lng = this._actLang;
		for(var p = 0; p < arguments.length; p++)
		{
			/* kollidiert mit Sprachparameter, wenn Par. 1 u. 2 fehlen!
			if(p == 0 && typeof arguments[p] == 'number')
			{
				cl = this.getClass(arguments[p]);
				continue;
			}*/
			if(typeof arguments[p] == 'number')
			{
				lng = arguments[p];
				break;
			}
			if(typeof arguments[p] != 'string')
				break;
			if(p == 0)
				cl = arguments[p];
			else if(p == 1)
				el = arguments[p];
		}
		var tmp = this.onGetErgname(cl, el, lng);
		if(tmp)
			return tmp;
		if(this.hasMultilang2Support() && this._erg)
		{
			if(cl && cl.substr(0, 6) == '@FORM:')
				cl = cl.substr(6);
			if(this._erg[(cl || '')])
			{
				if(!cl)
					return this._erg['']['e'];
				if(!el)
					return this._erg[cl]['']['e'];
				if(this._erg[cl][el])
					return (this._erg[cl][el]['e'] || '');
			}
			return ''; //"[Ergname for " + cl + "::" + elem + " not found with multilang2 support]";
		}
		if(!cl)
			return (this._eModel && this._eModel.length > lng ? this._eModel[lng] : ''); // Anwendungsname
		if(!this._classes_s)
			return (el && el!=='' ? el : cl);
		if(!el)
		{
			if(!this._classes_s[cl])
				return cl;
			return this._classes_s[cl][lng]; // Klassenname
		}
		// Traversierungspfade aufloesen
		if(/->/.test(el)==true)
		{
			var trav = el.split("->");
			var trgtCl = this.getAssocClass(cl, trav.shift());
			return this.getErgname(trgtCl, trav.join('->'));
		}
		if(this["_"+cl+"_attrs_s"] && this["_"+cl+"_attrs_s"][el])
			return this["_"+cl+"_attrs_s"][el][lng];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getErgname(baseCls, elem, lang);
		return '';
	},

	/**
	@memberof PDMeta
	@desc Den ergonomischen Namen für eine Klasse
	oder ein Klassenelement zurückgeben, der
	in der Listendarstellung benutzt wird.<br/>
	Wenn <code>elem</code> nicht angegeben
	ist, wird der ergonomische Name der Klasse, wenn auch 
	dieser nicht angegeben ist, derjenige der
	Anwendung zurückgegeben.
	@param {string} [clname] Name der Klasse.
	@param {string} [elem] Name des Elements (Attribut,
	Beziehung oder Operation).
	@param {number} [lang] Nummer der Anwendungssprache.
	@return {string} Bei fehlendem Parameter <code>lang</code> 
	wird für die aktuelle Sprache abgefragt.
	 */
	getListErgname : function(clname, elem, lang)
	{
		var cl = '';
		var el = '';
		var lng = this._actLang;
		for(var p = 0; p < arguments.length; p++)
		{
			if(typeof arguments[p] == 'number')
			{
				lng = arguments[p];
				break;
			}
			if(typeof arguments[p] != 'string')
				break;
			if(p == 0)
				cl = arguments[p];
			else if(p == 1)
				el = arguments[p];
		}
		var tmp = this.onGetListErgname(cl, el, lng);
		if(tmp)
			return tmp;
		if(this.hasMultilang2Support())
		{
			if(clname && clname.substr(0, 6) == '@LIST:')
				clname = clname.subtr(6);
			if(this._erg[(clname || '')])
			{
				if(!elem)
					return (this._erg[(clname || '')]['l'] || this._erg[(clname || '')]['e']);
				if(this._erg[(clname || '')][(elem || '')])
					return (this._erg[(clname || '')][(elem || '')]['l'] || this._erg[(clname || '')][(elem || '')]['e'] || '');
			}
			return ''; //"[ListErgname '"+code+"' not found with multilang2 support]";
		}
		if(!this._classes_l)
			return (elem && el!=='' ? el : cl);
		if(!cl)
			return "";
		if(!el)
		{
			if(!this._classes_l[cl])
				return '';
			return this._classes_l[cl][lng]; // Klassenname
		}
		// Traversierungspfade aufloesen
		if(/->/.test(el)==true)
		{
			var trav = el.split("->");
			var trgtCl = this.getAssocClass(cl, trav.shift());
			return this.getListErgname(trgtCl, trav.join('->'));
		}
		if(this["_"+cl+"_attrs_l"] && this["_"+cl+"_attrs_l"][el])
			return this["_"+cl+"_attrs_l"][el][lng];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getListErgname(baseCls, elem, lang);
		return '';
	},

	/**
	@memberof PDMeta
	@desc Die Beschreibung für eine Klasse
	oder ein Klassenelement zurückgeben, die
	normalerweise als Tooltip verwendet wird.<br/>
	Wenn <code>elem</code> nicht angegeben
	ist, wird der ergonomische Name der Klasse zurückgegeben.
	@param {string} [clname] Name der Klasse.
	@param {string} [elem] Name des Elements (Attribut,
	Beziehung oder Operation).
	@param {number} [lang] Nummer der Anwendungssprache.
	@return {string} Bei fehlendem Parameter <code>lang</code> 
	wird für die aktuelle Sprache abgefragt.
	 */
	getDescription : function(clname, elem, lang)
	{
		var cl = '';
		var el = '';
		var lng = this._actLang;
		for(var p = 0; p < arguments.length; p++)
		{
			if(typeof arguments[p] == 'number')
			{
				lng = arguments[p];
				break;
			}
			if(typeof arguments[p] != 'string')
				break;
			if(p == 0)
				cl = arguments[p];
			else if(p == 1)
				el = arguments[p];
		}
		var tmp = this.onGetDescription(cl, el, lng);
		if(tmp)
			return tmp;
		if(this.hasMultilang2Support())
		{
			if(this._erg[(clname || '')])
			{
				if(!elem)
					return this._erg[(clname || '')]['s'];
				if(this._erg[(clname || '')][(elem || '')])
					return (this._erg[(clname || '')][(elem || '')]['s'] || '');
			}
			return ''; //"[Description '"+code+"' not found with multilang2 support]";
		}
		if(!this._classes_d)
			return '';
		if(!cl)
			return "";
		if(!el)
			return this._classes_d[cl][lng]; // Klassenbeschr.
		// Traversierungspfade aufloesen
		if(/->/.test(el)==true)
		{
			var trav = el.split("->");
			var trgtCl = this.getAssocClass(cl, trav.shift());
			return this.getDescription(trgtCl, trav.join('->'));
		}
		else if(/->/.test(el)==true)
		{
			// TODO: Ein Punkt wurde gefunden.
			// wenn ein Punkt im Klassennamen steht, dann in
			// dem eingebetteten Typ suchen
			
			// wenn ueber eine Beziehung gesucht wird ("->"),
			// das Zielattribut in der Zielklasse der Beziehung 
			// suchen
			var trav = elem.split("->");
			for(var i=0; i<trav.length-1; i++)
			{
				if(cl == "")
					return "";
				cl = this.getAssocClass(cl, trav[i]);
			}
			return this.getDescription(cl, trav[trav.length-1], lng);
		}
		if(this["_"+cl+"_attrs_d"] && this["_"+cl+"_attrs_d"][el])
			return this["_"+cl+"_attrs_d"][el][lng];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getDescription(baseCls, elem, lang);
		return '';
	},

	/**
	@memberof PDMeta
	@desc Gibt, wenn kein Parameter angegeben wird, die
	aktuell eingestellte Sprache zurück. Andernfalls
	wird der Sprach-Code des mit dem Parameter
	angegebenen Sprachkürzels zurückgegeben.
	@param {string} langCode Zweibuchstabiges Sprachenkürzel,
	für das der Code ermittelt werden soll.
	@return {number} Der Sprach-Code, falls nicht gefunden -1;
	 */
	getLang : function(langCode)
	{
		if(typeof langCode == 'undefined')
			return this._actLang;
		for(var i=0; i<this._shortLang.length; i++)
		{
			if(langCode == this._shortLang[i])
				return i;
		}
		return -1;
	},
	
	/**
	@memberof PDMeta
	@desc Gibt die Anzahl der Modellsprachen zurück.
	@return {number} Anzahl der im UML-Modell definierten
	Sprachen.
	 */
	getNumLanguages : function()
	{ return this._numLanguages; },

	/**
	@memberof PDMeta
	@desc Gibt für den Index der Anwendungssprache
	deren zweibuchstabiges Sprachkürzel zurück.
	@param {string} langIdx Index der Anwendungssprache.
	@return {string} Das Sprachkürzel. Falls nicht gefunden
	oder Fehler aufgetreten, wird ein Leerstring 
	zurückgegeben.
	 */
	getLangCode : function(langIdx)
	{
		if(isNaN(langIdx))
			langIdx = this._actLang; 
		if(langIdx < 0 || langIdx >= this._shortLang.length)
			return "";
		return this._shortLang[langIdx];
	},
	
	/**
	@memberof PDMeta
	@desc Ermittelt die Standardsprache der Anwendung.
	@return {string} Das Kürzel der Standardsprache. Im Falle
	der erweiterten Mehrsprachigkeitsunterstützung (siehe
	[PDMeta.hasMultilang2Support]{@link PDMeta#hasMultilang2Support})
	ist das die in <code>langs/default</code> festgelegte, sonst immer
	die erste im Modell festgelegte Sprache.
	 */
	getDefaultLanguageCode : function()
	{
		if(this.hasMultilang2Support())
			return this._defaultLang;
		return this.getLangCode(0); // immer die erste
	},

	/**
	@memberof PDMeta
	@desc Ermittelt die Länge eines Attributs, mit der es auf
	der Benutzungsoberfläche dargestellt wird.
	@param {string} clname Name der Klasse.
	@param {string} attr Name des Attributs.
	@return {number} Länge, im Fehlerfall <code>-1</code>.
	@see [getStringLength]{@link PDMeta#getStringLength},
	mit dem die maximal mögliche Eingabelänge bei
	String-Attributen ermittelt wird.
	 */
	getLength : function(clname, attr)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(attr)==true)
		{
			var trav = attr.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.getLength(trgtCl, trav.join('->'));
		}
		if(this["_"+clname+"_attrs_len"] && this["_"+clname+"_attrs_len"][attr])
			return this["_"+clname+"_attrs_len"][attr];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getLength(baseCls, attr);
		return -1;
	},

	/**
	@memberof PDMeta
	@desc Gibt die spezifizierte Maßinheit des 
	angegebenen Attributs zurück.
	@param {string} clname Name der Klasse.
	@param {string} attr Name des Attributs.
	@return {string} Die Einheit (String).
	 */
	getUnit : function(clname, attr)
	{
		// Traversierungspfade aufloesen
		if(/->/.test(attr)==true)
		{
			var trav = attr.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.getUnit(trgtCl, trav.join('->'));
		}
		if(this["_"+clname+"_unit"] && this["_"+clname+"_unit"][attr])
			return this["_"+clname+"_unit"][attr];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getUnit(baseCls, attr);
		return '';
	},

	/**
	@memberof PDMeta
	@desc Den numerischen Code einer String-Konstante ermitteln.
	@param {string} id Identifizierer des Textes in der Form
	"&lt;Textklasse&gt;::&lt;Attribut&gt;", bzw.
	"SC::&lt;Attribut&gt;" für JANUS-eigene Texte.
	@return {number} der numerische Code des Textes.
	 */
	getStringCode : function(id, lang)
	{
		if(this.hasMultilang2Support())
		{
			if(id.substr(0, 3) == "SC.")
				id = "SC::" + id.substr(3);
			if(!this._stringIdentMap)
				return -1;
			return (this._stringIdentMap[id] || -1);
		}
		if(id.substr(0, 3) != "SC." && id.substr(0, 4) != "SC::")
		{
			// Konstanten aus Text-Klassen
			try
			{
				var sep = id.indexOf("::");
				var sepW = 2;
				if(sep < 0)
				{
					sep < id.indexOf(".");
					sepW = 1;
				}
				if(sep > 0)
					return this.getStringCode(window[id.substr(0, sep)][id.substr(sep+sepW)]);
			}
			catch(ex)
			{
				JDebug.log(JDebug.DEBUG, "PDMeta.getStringCode() - Text const '"+id+"' not found");
			}
		}
		// Prefix "SC::" oder "SC." ueberlesen
		if(id.substr(0, 3) == "SC.")
			id = id.substr(3);
		else if(id.substr(0, 4) == "SC::")
			id = id.substr(4);
		// Code raussuchen
		if(this._stringsIdent)
		{
			for(var i=0; i<this._stringsIdent.length; i++)
			{
				if(this._stringsIdent[i] == id)
				{
					if(i >= this._stringsIndex.length)
					{
						JDebug.log(JDebug.DEBUG, "PDMeta.getStringCode() - Invalid index of stringsIdent: "+
								i+", searched for code: '"+id+"'");
						return;
					}
					return this._stringsIndex[i];
				}
			}
		}
	},
	
	/**
	@memberof PDMeta
	@desc Die String-Konstante für den angegebenen Code
	ermitteln. Damit können z.B. Fehler-Codes aus
	Operationen in Texte umgewandelt werden. Außerdem können
	Sie hiermit auf die in JANUS vordefinierten Meldungstexte
	(vgl. <code>strings.txt</code>) sowie eigene, im Modell in
	Klassen mit dem Stereotypen <code>&lt;&lt;Text&gt;&gt;</code>
	definierte, mehrsprachige Texte zugreifen.<br/>
	@param {mixed} code Code des Textes. Dieser kann entweder als
	String in der Form "&lt;Textklasse&gt;::&lt;Attribut&gt;" bzw.
	"SC::&lt;Attribut&gt;" für JANUS-eigene Texte angegeben werden
	oder aber direkt über den numerischen Code. Letzteren können Sie
	z.B. in Operationen vom Server zurückgeben, um dann mit dieser
	Funktion die Nummer in den zugehörigen mehrsprachigen Text
	aufzulösen.
	@param {number} [lang] Numerischer Code der Sprache, in der
	der Text ermittelt werden soll. Wird der Parameter
	nicht angegeben, wird die aktuelle Anwendungssprache
	benutzt.
	@return {string} Der Text. Falls zu dem angegebenen Code kein
	Text gefunden werden kann, wird ein Leerstring zurückgegeben,
	sodass Sie z.B. kodieren können:
	@example
var meinText = (PDMeta.getString('Klasse::Text') || 'Mein text');
	*/
	getString : function(code, lang)
	{
		//JDebug.log(JDebug.DEBUG, "PDMeta.getString('"+code+"')");
		if(isNaN(lang))
			lang = this._actLang;
		var tmp = this.onGetString(code, lang);
		if(tmp)
			return tmp;
		if(!this['_strings'])
		{
			JDebug.log(JDebug.WARN, "PDMeta.getString('" + code + "', " + lang + ") used before PDMeta.load is completed!");
			//alert("PDMeta.getString('" + code + "', " + lang + ") used before PDMeta.load is completed!");
			return '' + code;
		}
		if(this.hasMultilang2Support())
		{
			if(typeof code == 'number' && code >= 0 && code < this._strings.length)
				return this._strings[code];
			var id = this.getStringCode(code);
			if(id >= 0 && id < this._strings.length)
				return this._strings[id];
			JDebug.log(JDebug.DEBUG, "PDMeta.getString('"+code+"') - Text const not found with multilang2 support");
			return ""; // "[Text const '"+code+"' not found with multilang2 support]";
		}
		try
		{
			if(typeof code == "string")
				code = this.getStringCode(code);
			//JDebug.log(JDebug.DEBUG, "PDMeta.getString('"+code+"') - Num. code: "+code+" ["+(typeof code)+"]");
			if(typeof code == "number" && code < 0)
				code *= -1;
			if(typeof code != "number" 
					|| code >= this._strings.length * this._numLanguages)
				return ''; //"[this.getString(): INVALID CODE: "+code+"]";
			if(code < this._numStrings && this._strings)
				return this._strings[code * this._numLanguages + lang].unescapeHTML();
			if(this._errorMessages)
				return this._errorMessages[(code - this._numStrings) * this._numLanguages + lang];
			return '' + code;
		}
		catch(ex)
		{ return '' + (code || ''); }
	},
	
	/**
	@memberof PDMeta
	@desc Gibt die technischen Namen aller im Modell
	spezifizierten Fachkonzeptklassen zurück.
	@return {string[]} Array von Strings, das die technischen Namen
	der Klassen enthält.
	 */
	getClasses : function()
	{ return (this._classes || []); },
	
	/**
	@memberof PDMeta
	@desc Ermittelt, ob eine Fachkonzeptklasse als abstrakte 
	Klasse modelliert ist.
	@param {string} clname Technischer Name der Klasse.
	@return {boolean} <code>true</code>, falls abstrakt.
	 */
	isAbstract : function(clname)
	{
		var tmp = this.onIsAbstract(clname);
		if(typeof tmp == 'boolean')
			return tmp;
		return ((this.getClassFlags(clname) & this.AbstractClass) != 0);
	},
	
	/**
	@memberof PDMeta
	@desc Ermittelt für eine Fachkonzeptklasse den 
	Stereotypen.
	@param {string} clname Stereotyp der Klasse.
	@return {string} Der Name des Stereotypen.
	 */
	getStereotype : function(clname)
	{ return (this._classes_stereo ? this._classes_stereo[clname] : ''); },
	
	/**
	@memberof PDMeta
	@desc Direkte Oberklasse ermitteln.
	@param {string} clname Klasse, deren Oberklasse ermittelt
	werden soll.
	@return {string} clname Name der Oberklasse.
	 */
	getSuperClass : function(clname)
	{
		if(this._superClasses && this._superClasses[clname])
			return this._superClasses[clname];
		return "";
	},
	
	/**
	@memberof PDMeta
	@desc Alle Oberklassen ermitteln.
	@param {string} clname Klasse, deren Oberklassen
	ermittelt werden sollen.
	@return {string[]} Array mit den Namen der
	Oberklassen.
	 */
	getAllSuperClasses : function(clname)
	{
		var superclasses = new Array();
		var sclass = this.getSuperClass(clname);
		while(sclass != "")
		{
			superclasses.push(sclass);
			sclass = this.getSuperClass(sclass);
		}
		return superclasses;
	},
	
	/**
	@memberof PDMeta
	@desc Direkte Unterklassen ermitteln. 
	@param {string} clname Klasse, deren Unterklassen
	ermittelt werden sollen.
	@return {string[]} Array, das die Namen der
	direkten Unterklassen enthält.
	 */
	getSubClasses : function(clname)
	{
		var subclasses = new Array();
		if(!this._subClasses || !this._subClasses[clname])
			return null;
		for(var i=0; i < this._subClasses[clname].length; i++)
			subclasses.push(this._subClasses[clname][i]);
		return subclasses;
	},
	
	/**
	@memberof PDMeta
	@desc Alle Unterklassen ermitteln. 
	@param {string} clname Klasse, deren Unterklassen
	ermittelt werden sollen.
	@return {string[]} Array, das die Namen der
	Unterklassen enthält.
	 */
	getAllSubClasses : function(clname)
	{
		var tmp = this.onGetAllSubClasses(clname);
		if(tmp)
			return tmp;
		var subclasses = new Array();
		if(!this._subClasses || !this._subClasses[clname])
			return [];
		for(var i=0; i < this._subClasses[clname].length; i++)
		{
			var subClname = this._subClasses[clname][i];
			subclasses.push(subClname);
			subclasses = subclasses.concat(this.getAllSubClasses(subClname));
		}
		return subclasses;
	},
	
	/**
	@memberof PDMeta
	@desc Zu einem Klassennamen die numerische Id
	der Fachkonzeptklasse ermitteln.<br/>
	<span class="important">Hinweis:</span> Die Ids der Fachkonzeptklassen sind auch als Konstanten
	in <code>PDMeta</code> definiert in der Form "Id<Klasse>",
	also z.B. für Klasse Offer als <code>PDMeta.IdOffer</code>.
	@param {string} clname Technischer Name der Fachkonzeptklasse.
	@return {number} Id der Klasse oder 0, falls die Klasse
	nicht gefunden wurde.
	 */
	getId : function(clname)
	{
		if(!clname || clname == "")
			return 0;
		if(this._classIds && this._classIds[""+clname])
			return this._classIds[""+clname];
		return 0;
	},
	
	/**
	@memberof PDMeta
	@desc Zu einer numerischen Klassen-Id den technischen
	Namen der Klasse ermitteln.
	@param {number} cid Id der Fachkonzeptklasse.
	@return {string} Name der Fachkonzeptklasse mit der angebenen
	Id. Falls die nicht gefunden werden kann, wird ein
	leerer String zurückgegeben.
	 */
	getClass : function(cid)
	{
		if(!cid)
			return "";
		if(!this._classes)
			return '';
		for(var cl in this._classIds)
		{
			if(this._classIds[cl] == cid)
				return cl;
		}
		return '';
	},
	
	/**
	@memberof PDMeta
	@desc Zu einer Klassen-Id, die möglicherweise zu einer
	Transaktionsklasse gehört, die Id der echten,
	persistenten Klasse ermitteln.<br/>
	<span class="important">Hinweis:</span> Die Ids der Fachkonzeptklassen sind auch als Konstanten
	in <code>PDMeta</code> definiert in der Form "Id<Klasse>",
	also z.B. für Klasse Offer als <code>PDMeta.IdOffer</code>.
	Die Ids der Transaktionsklassen besitzen die Form
	"IdBACKUP_<Klasse>", also z.B. <code>PDMeta.IdBACKUP_Offer</code>
	@param {number} cid Id einer persistenten oder Transaktionsklasse.
	@return {number} Id der persistenten Klasse oder 0, falls die Klasse
	nicht gefunden wurde.
	 */
	getPDId : function(cid)
	{
		var cl = cid;
		if(typeof cid == 'number')
			cl = this.getClass(cid);
		if(cl.substr(0, 7) == 'BACKUP_')
			cl = cl.substr(7);
		return this.getId(cl);
	},
	
	/**
	@memberof PDMeta
	@desc Den im UML-Modell spezifizierten String für die
	die About-Meldung zurückgeben.
	@param {number} [lang] Nummer der Anwendungssprache.
	Falls dieser Parameter fehlt, wird der Text
	in der aktuellen Sprache abgefragt.
	@return {string} Der Meldungstext.
	 */
	getAbout : function(lang)
	{
		if(!lang || lang < 0)
			lang = this._actLang;
		if(this.hasMultilang2Support())
			return (this._about ? this.getString(this._about, lang) : '');
		return (this._about && this._about.length > lang ? this._about[lang] : '');
	},
	
	/**
	@memberof PDMeta
	@desc Den im UML-Modell spezifizierten Copyright-Hinweis
	zurückgeben.
	@param {number} [lang] Nummer der Anwendungssprache.
	Falls dieser Parameter fehlt, wird der Text
	in der aktuellen Sprache abgefragt.
	@return {string} Der Text.
	 */
	getCopyright : function(lang)
	{
		if(!lang || lang < 0)
			lang = this._actLang;
		if(this.hasMultilang2Support())
			return (this._copyright ? this.getString(this._copyright, lang) : '');
		return (this._copyright && this._copyright.length > lang ? this._copyright[lang] : '');
	},
	
	/**
	@memberof PDMeta
	@desc Den im UML-Modell spezifizierten Text
	für die Info-Leiste zurückgeben.
	@param {number} [lang] Nummer der Anwendungssprache.
	Falls dieser Parameter fehlt, wird der Text
	in der aktuellen Sprache abgefragt.
	@return {string} Der Text.
	 */
	getInfobarText : function(lang)
	{
		if(!lang || lang < 0)
			lang = this._actLang;
		if(this.hasMultilang2Support())
			return (this._copyright ? this.getString(this._infobarText, lang) : '');
		return (this._infobarText && this._infobarText.length > lang ? this._infobarText[lang] : '');
	},
	
	/**
	@memberof PDMeta
	@desc Den im UML-Modell spezifizierten 
	Versions-String zurückgeben.
	@return {string} Versionsbezeichnung.
	 */
	getVersion : function()
	{ return (this._version !== undefined ? this._version : -1); },
	
	/**
	@memberof PDMeta
	@desc Die technischen Namen der Attribute einer Klasse
	ermitteln.
	@param {string} clname Name der Fachkonzeptklasse, deren
	Attribute ermittelt werden sollen.
	@return {string[]} Array mit den Namen.
	 */
	getAttributes : function(clname)
	{
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this["_"+clname+"_attrs"].concat(this["_"+clname+"_derAttrs"]).concat(this.getAttributes(baseCls));
		return this["_"+clname+"_attrs"].concat(this["_"+clname+"_derAttrs"]);
	},

	/**
	@memberof PDMeta
	@desc Die technischen Namen der Beziehungen einer Klasse
	ermitteln.
	@param {string} clname Name der Fachkonzeptklasse, deren
	Beziehungen ermittelt werden sollen.
	@return {string[]} Array mit den Namen.
	 */
	getAssocs : function(clname)
	{
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this["_"+clname+"_rels"].concat(this.getAssocs(baseCls));
		return this["_"+clname+"_rels"];
	},

	/**
	@memberof PDMeta
	@desc Die technischen Namen der modellierten
	Operationen einer Klasse ermitteln. Es werden nur die GUI-relevanten
	Operationen ermittelt, inklusive aller geerbten Operationen.
	@param {string} clname Name der Fachkonzeptklasse, deren
	Operationen ermittelt werden sollen.
	@return {string[]} Array mit den Namen.
	 */
	getOperations : function(clname)
	{
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this["_"+clname+"_ops"].concat(this.getOperations(baseCls));
		return this["_"+clname+"_ops"];
	}, // TODO: sind nur die GUI-relevanten!

	/**
	@memberof PDMeta
	@desc Gibt die Datentypbezeichnung zurück. Das ist insbesondere nützlich,
	um, in Ergänzung zu [getTypeId()]{@link PDMeta#getTypeId}, die Namen von
	Aufzählungstypen zu ermitteln.
	@param {mixed} clname Name oder numerische Id der Fachkonzeptklasse.
	@param {string} elem Name des Klassenelements, dessen Typ ermittelt
	werden soll.
	@return {string} Der Typbezeichner.
	@see [getTypeId()]{@link PDMeta#getTypeId}
	 */
	getType : function(clname, elem)
	{
		var tmp = this.onGetType(clname, elem);
		if(tmp)
			return tmp;
		// die Typnamen fuer Enums stehen in this["_"+clname+"_ten"][elem],
		// alle anderen rekonstruieren wir aus der TypeId
		if(!clname || !elem)
			return "";
		// Traversierungspfade aufloesen
		if(/->/.test(elem)==true)
		{
			var trav = elem.split("->");
			var trgtCl = this.getAssocClass(clname, trav.shift());
			return this.getType(trgtCl, trav.join('->'));
		}
		else if(/\./.test(elem)==true)
		{
			// TODO: Ein Punkt wurde gefunden.
			// wenn ein Punkt im Klassennamen steht, dann in
			// dem eingebetteten Typ suchen
			
			// wenn ueber eine Beziehung gesucht wird ("->"),
			// das Zielattribut in der Zielklasse der Beziehung 
			// suchen
			var trav = elem.split(".");
			for(var i=0; i<trav.length-1; i++)
			{
				if(clname == "")
					return "";
				clname = this.getAssocClass(clname, trav[i]);
			}
			return this.getType(clname, trav[trav.length-1]);
		}
		var tid = (this.getTypeId(clname, elem) & this.TIdMask);
		switch(tid)
		{
			case this.TIdEnum:
			case this.TIdUser:
				// in der konktreten Klasse?
				if(this["_"+clname+"_ten"] && this["_"+clname+"_ten"][elem])
					return this["_"+clname+"_ten"][elem];
				// Basisklasse?
				var baseCls = this.getSuperClass(clname);
				if(baseCls)
					return this.getType(baseCls, elem);
				return "";
			// TODO: Schreibweise der Bezeichner kontrollieren!
			case this.TIdNone:
				return "None";
			case this.TIdInt:
				return "Int";
			case this.TIdFloat:
				return "Float";
			case this.TIdString:
				return "String";
			case this.TIdDate:
				return "Date";
			case this.TIdTime:
				return "Time";
			case this.TIdTimestamp:
				return "Timestamp";
			case this.TIdSerial:
				return "Serial";
			case this.TIdEmail:
				return "Email";
			case this.TIdURL:
				return "URL";
			case this.TIdFilename:
				return "Filename";
			case this.TIdCurrency:
				return "Currency";
			case this.TIdBool:
				return "Bool";
			case this.TIdPassword:
				return "Password";
			case this.TIdAbstract:
				return "Abstract";
			case this.TIdCTime:
				return "Time";
			case this.TIdVarCurrency:
				return "VarCurrency";
			case this.TIdRelNN:
				return "RelNN";
			case this.TIdRel1N:
				return "Rel1N";
			case this.TIdRelN1:
				return "RelN1";
			case this.TIdRel11:
				return "Rel11";
			case this.TIdRef:
				return "Ref";
			case this.TIdOID:
				return "OID";
			default:
				return "";
		}
	},

	/**
	@memberof PDMeta
	@desc Den Datentyp eines Klassenelements ermitteln. Falls
	eine Beziehung angegeben wird, wird die Typ-Id immer
	nur für den ersten Teil des Traversierungspfads ermittelt,
	auch wenn ein Zielattribut angegeben ist. Im Unterschied
	dazu vgl. [getTypeIdViaAssoc()]{@link PDMeta#getTypeIdViaAssoc}.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements.
	@return {number} Wenn es sich um einen benutzerdefinierten 
	Datentyp handelt, wird ein Wert < 0 zurückggeeben,
	dessen Absolutwert die Id des Typen darstellt.
	Bei den anderen Datentypen wird eine Kombination
	aus Datentyp-Konstante und Flags. Vgl. dazu die
	entsprechenden Konstanten <code>TId...</code> 
	bzw. <code>TFlag...</code> in {@link PDMeta}.<br/>
	<span class="important">Hinweis:</span> Um den Typen auch
	über Traversierungspfade hinweg zu
	ermitteln, verwenden Sie statt dieser die Funktion
	[getTypeIdViaAssoc()]{@link PDMeta#getTypeIdViaAssoc}.
	@see [getType()]{@link PDMeta#getType} zum Ermitteln der Namen von
	Aufzählungstypen sowie [getTypeIdViaAssoc()]{@link PDMeta#getTypeIdViaAssoc}.
	@example <caption>Abfrage des Datentyps:</caption>
var typeId = (PDMeta.getTypeId(classname, attr) & PDMeta.TIdMask);
if(typeId == PDMeta.TIdEnum)
{
	var enumName = PDMeta.getType(classname, attr);
	...
}
	@example <caption>Abfrage der Typ-Flags:</caption>
var tflags = PDMeta.getTypeId(classname, attr);
if((tflags & PDMeta.TFlagClassGlobal) != 0)
	...
	 */
	getTypeId : function(clname, elem)
	{
		var tmp = this.onGetTypeId(clname, elem);
		if(tmp !== 0)
			return tmp;
		// TODO: bei benutzerdefinierten Typen
		// (Structs!) wird Wert < 0 zurueckgegeben,
		// dessen Absolutwert die Klassen-Id des
		// Typs darstellt
		if(!clname || !elem)
			return 0;
		if(typeof clname == 'number')
			clname = this.getClass(clname);
		if(/\./.test(elem)==true)
		{
			// TODO: Ein Punkt wurde gefunden.
			// wenn ein Punkt im Klassennamen steht, dann in
			// dem eingebetteten Typ suchen
			
			// wenn ueber eine Beziehung gesucht wird ("->"),
			// das Zielattribut in der Zielklasse der Beziehung 
			// suchen
			var trav = elem.split(".");
			for(var i=0; i<trav.length-1; i++)
			{
				if(clname == "")
					return "";
				clname = this.getAssocClass(clname, trav[i]); // ???
			}
			return this.getTypeId(clname, trav[trav.length-1]);
		}
		// in der konktreten Klasse?
		if(this["_"+clname+"_t"] && this["_"+clname+"_t"][elem])
			return this["_"+clname+"_t"][elem];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getTypeId(baseCls, elem);
		return 0;
	},
	
	/**
	@memberof PDMeta
	@desc Den Datentyp eines Klassenelements auch über
	Beziehungen hinweg ermitteln.
	@param {string} clname Name der Klasse.
	@param {string} elem Name des Elements. Hier kann
	ein beliebig langer Traversierungspfad angegeben werden
	in der Form <code>to_A->to_B->attr</code>.
	@return {number} Zurückgegeben wird eine Kombination
	aus Datentyp-Konstante und Flags. Vgl. dazu die
	entsprechenden Konstanten <code>TId...</code> 
	bzw. <code>TFlag...</code> in <code>PDMeta</code>.
	@see [getTypeId()]{@link PDMeta#getTypeId}.
	 */
	getTypeIdViaAssoc : function(clname, elem)
	{
		if(/->/.test(elem)==false)
			return this.getTypeId(clname, elem);
		var trav = elem.split("->");
		if(trav.length <= 1)
			return 0;
		for(var i=0; i<trav.length-1; i++)
			clname = this.getAssocClass(clname, trav[i]);
		return this.getTypeId(clname, trav[trav.length-1]);
	},

	/**
	@memberof PDMeta
	@desc Die maximale Längee eines textuellen Attributs
	bestimmen (Type String oder Text).
	@param {string} clname Name der Klasse.
	@param {string} attr Name des Attributs.
	@return {number} Spezifizierte maximale Länge des
	Attributwerts. Falls das Attributs nicht gefunden
	wird, wird <code>-1</code>, falls es einen anderen
	Datentyp hat, <code>0</code> zurückgeben.
	@see [getLength()]{@link PDMeta#getLength}, mit dem die
	Darstellungslänge auf der Benutzungsoberfläche
	ermittelt wird.
	 */
	getStringLength : function(clname, attr)
	{
		if(!clname || !attr)
			return -1;
		if(this["_"+clname+"_attrs_strlen"] && this["_"+clname+"_attrs_strlen"][attr])
			return this["_"+clname+"_attrs_strlen"][attr];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getStringLength(baseCls, attr);
		return 0;
	},

	/**
	@memberof PDMeta
	@desc Die minimale Kardinalität einer Beziehung 
	ermitteln.
	@param {string} clname Name der Klasse.
	@param {string} rel Name der Beziehung.
	@return {number} Minimale Kardinalität der Beziehung 
	aus Sicht der angegebenen Klasse.
	 */
	getMinCard : function(clname, rel)
	{
		if(this["_"+clname+"_rels_min"] && this["_"+clname+"_rels_min"][rel])
			return this["_"+clname+"_rels_min"][rel];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getMinCard(baseCls, rel);
		return undefined;
	},
	
	/**
	@memberof PDMeta
	@desc Die maximale Kardinalität einer Beziehung 
	ermitteln.
	@param {string} clname Name der Klasse.
	@param {string} rel Name des Beziehung.
	@return {number} Maximale Kardinalität der Beziehung 
	aus Sicht der angegebenen Klasse; wenn die
	Kardinalität nicht nach oben begrenzt ist, ist der 
	Rückgabewert <code>-1</code>.
	 */
	getMaxCard : function(clname, rel)
	{
		if(this["_"+clname+"_rels_max"] && this["_"+clname+"_rels_max"][rel])
			return this["_"+clname+"_rels_max"][rel];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getMaxCard(baseCls, rel);
		return undefined;
	},
	
	/**
	@memberof PDMeta
	@desc Den Namen der Zielklasse einer Beziehung bestimmen.
	@param {string} clname Name der Klasse.
	@param {string} rel Name des Beziehung.
	@return {string} Name der Klasse, die der angegebenen
	gegenüberliegt.
	 */
	getAssocClass : function(clname, rel)
	{
		if(typeof clname == 'number')
			clname = this.getClass(clname);
		var tmp = this.onGetAssocClass(clname, rel);
		if(tmp)
			return tmp;
		if(this["_"+clname+"_rels_trgt"] && this["_"+clname+"_rels_trgt"][rel])
			return this["_"+clname+"_rels_trgt"][rel];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getAssocClass(baseCls, rel);
		return '';
	},
	
	/**
	@memberof PDMeta
	@desc Den inversen Namen einer Beziehung bestimmen.
	@param {string} clname Name der Klasse.
	@param {string} rel Name des Beziehung.
	@return {string} Name der Klasse, die der angegebenen
	gegenüberliegt.
	 */
	getInverseRelation : function(clname, rel)
	{
		var tmp = this.onGetInverseRelation(clname, rel);
		if(tmp)
			return tmp;
		if(this["_"+clname+"_rels_inv"] && this["_"+clname+"_rels_inv"][rel])
			return this["_"+clname+"_rels_inv"][rel];
		// Basisklasse?
		var baseCls = this.getSuperClass(clname);
		if(baseCls)
			return this.getInverseRelation(baseCls, rel);
		return '';
	},
	
	/**
	@memberof PDMeta
	@desc Gibt den Dateinamen des zu der angegebenen Id gehörenden
	Icons zurück.
	@param {string} iconId Die Id des zu ermittelnden
	Icons. Die Ids sind nach folgendem Schema definiert:
	<ul>
		<li>Icon für die Fachkonzeptklasse (Extent- oder Ordner-
		Icon): <code>IFI_&lt;Klassenname&gt;</code></li>
		<li>Icon für ein einzelnes Objekt einer Fachkonzeptklasse:
		<code>ICI_&lt;Klassenname&gt;</code></li>
		<li>Icons für Enum-Ausprägungen:
	 	<code>E_&lt;Enum-Name&gt;_val_&lt;Index&gt;</code></li>
		<li>Icon für eine Fachkonzeptmethode in der Toolbar:
		<code>IOPT_&lt;Klasse&gt;_&lt;Methode&gt;</code></li>
		<li>Icon für eine Fachkonzeptmethode im Baum:
		<code>IOP_&lt;Klasse&gt;_&lt;Methode&gt;</code></li>
		<li>Icon für eine Fachkonzeptmethode in der SideBar:
		<code>IOPO_&lt;Klasse&gt;_&lt;Methode&gt;</code></li>
	</ul>
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	 */
	getIcon : function(iconId, callback)
	{
		// Cache benutzen
		var result = this._iconCache[iconId];
		if(typeof result == 'undefined')
		{
			result = '';
			var pars = new JParamPacker(JafWebAPI.PDMeta.getIcon.eventName, this.PDClass);
			pars.add(JafWebAPI.PDMeta.getIcon.PAR_iconId, (iconId||""));
			var pdClass = this.PDClass;
			var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDMeta.getIcon():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDMeta.getIcon()");
					result = resp.getString(JafWebAPI.PDMeta.getIcon.PROP_icon, '');
					this._iconCache[iconId] = result;
					if(typeof callback == 'function')
						callback(result);
				};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
					if(typeof callback == 'function')
						callback();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "GET",
					async: (!!callback),
					params: pars.get(),
					scope: this,
					callerName: pars.getEventName(),
					disableCaching: false, // das Ergebnis aendert sich nicht, deshalb cachen lassen!
					success: successFn,
					failure: failureFn
				});
		}
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDMeta
	@desc Ist das erweiterte Mehrsprachigkeitskonzept für den JafWeb-Client
	aktiviert? Dieses Konzept erlaubt die Unterstützung weiterer
	Sprachen (über die in JANUS vordefinierten 4 Sprachen hinaus)
	und ist wesentlich flexibler.<br/>
	Diese Einstellung wird durch das Modell-<i>Property</i>
	<code>XMultilang2</code> gesteuert.
	@return {boolean} <code>true</code>, falls das erweiterte
	Mehrsprachigkeitskonzept unterstützt wird.
	 */
	hasMultilang2Support : function()
	{
		return this._multilang2;
	},
	
	/*
	@ignore(true)
	@memberof PDMeta
	@desc Laden der Metainformationen.
	@param {number} instanceId Instanz-Id, wenn das Feature zum Detektieren
	von Mehrfachanmeldungen aktiviert ist.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	 */
	load : function(instanceId, callback)
	{
		if(typeof instanceId == 'number')
			this._instanceID = instanceId;
		var pars = new JParamPacker(JafWebAPI.PDMeta.load2.eventName, this.PDClass);
		//var pars = new JParamPacker(JafWebAPI.PDMeta.load.eventName, this.PDClass);
		//pars.add("lang", this._actLang);
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				try
				{
					var resp = new JResponse(req, options, pdClass);
					var tmpMeta = resp.getResponseText();
					if(typeof tmpMeta == 'string')
						eval('tmpMeta = ' + resp.getResponseText());
					JafWeb.apply(this, tmpMeta);
					// Datumsklasse initialisieren
					var days = ClientInfo.getWeekdays(); // beginnend bei Sonntag!
					days.unshift(days.pop());
					var monthNos = {};
					var monthShortNames = ClientInfo.getMonthnames(true);
					for(var i = 0; i < monthShortNames.length; i++)
						monthNos[monthShortNames[i]] = i;
					JafWeb.apply(Date, {
							dayNames : days,
							monthNames : ClientInfo.getMonthnames(false),
							monthNumbers : monthNos
						});
					this._loadCompleted = true;
				}
				catch(ex)
				{
					JDebug.log(JDebug.WARN, "Loading PDMeta failed!");
				}

				// Auf richtige API-Version testen:
				if(!JafWebAPI || !JafWebAPI.API_version || JafWebAPI.API_version !== this._apiVersion)
					throw new PDException(PDException.FATAL, "Request API version mismatch!" +
					" Client uses " + JafWebAPI.API_version + ", but server uses " + this._apiVersion);
				
				if(typeof callback == 'function')
					callback();
				
				/*var res = 0;
				var resp = new JResponse(req, options);
				try
				{
					eval(resp.getResponseText());
					// falls multilang2, nun die Sprachen laden
					if(this.hasMultilang2Support())
					{
						ClientInfo.setLanguage(this._actLang); // fuehrt auch PDMeta.loadLanguage() aus!
						//this.loadLanguage();
					}
				}
				catch(ex)
				{
					JDebug.log(JDebug.WARN, "Loading PDMeta failed!");
				}*/
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() +
						"! - Response text: " + (response['responseText'] ? response.responseText : '<empty>'));
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
	},
	
	/*
	@ignore(true)
	@memberof PDMeta
	@desc Laden der Sprachkonstanten für die aktuelle Sprache, wenn erweiterte
	Mehrsprachigkeit unterstützt wird.
	@param {string} Code der zu ladenden Sprache.
	 */
	loadLanguage : function(lang)
	{
		loadJavaScript(UIApplication.getResourceDir() + "jaf/" +
				"lang." + (lang || this.getLangCode(this._actLang)) + ".js", window);
		//loadJavaScript(UIApplication.getResourceDir() + "script/" +
		//		"lang." + (lang || this.getLangCode(this._actLang)) + ".js", window);
	},
	
	/**
	@memberof PDMeta
	@desc Gibt die Instanz-ID für die aktuelle Anwendungssitzung zurück.
	Diese wird verwendet, um zwischen Instanzen innerhalt einer
	HTTP-Session unterscheiden zu können und so Doppelanmeldungen
	zu vermeiden bzw. Mehrfachanmeldungen im selben Browser zu
	ermöglichen.<br/>
	Damit das funktioniert, muss die hier zurückgegebene ID in jedem
	Request mitgegeben werden. Bei JafWeb-internen AJAX-Requests wird
	das (vom {@link JParamPacker}) automatisch gemacht; wenn
	Sie selbst Requests erstellen, müssen
	Sie dafür sorgen, wenn Sie diese Funktionalität nutzen wollen.
	Desweiteren müssen diese IDs auf seiten der Web Application ausgewertet
	und die Sub-Sessions entsprechend verwaltet werden. Bei der
	SoapWebapp ist dies der Fall.
	@return {number} Die ID: eine Ganzzahl größer oder gleich <code>0</code>.
	Falls keine ID gesetzt wurde, wird <code>-1</code> zurückgegeben.
	 */
	getInstanceID : function()
	{ return this._instanceID; },
	
	/**
	@memberof PDMeta
	@desc Prüft, ob die Client- und die Server-seitige Version
	der Web-API zusammenpassen. Es werden die Versionsnummern
	verglichen, um zu validieren, ob sie aus der identischen
	Schnittstellenbeschreibung erzeugt wurde.<br/>
	Diese Funktion wird beim Laden der Metainformationen
	automatisch ausgeführt.
	@return {boolean} <code>true</code>, wenn die Versionsnummern genau
	übereinstimmen, sonst <code>false</code>.
	@throws {PDException}
	 */
	checkRequestAPI : function(iconId, callback)
	{
		if(!JafWebAPI || !JafWebAPI.API_version)
			return false;
		var clientVers = JafWebAPI.API_version;
		if(typeof this._apiVersion == 'number')
			return (this._apiVersion === clientVers);
		var rest = 'false';
		var pars = new JParamPacker(JafWebAPI.PDMeta.checkRequestAPI.eventName, this.PDClass);
		pars.add(JafWebAPI.PDMeta.checkRequestAPI.PAR_clientVersion, clientVers);
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDMeta.checkRequestAPI():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDMeta.checkRequestAPI()");
					res = resp.getBool(JafWebAPI.PDMeta.checkRequestAPI.PROP_result, false);
					if(typeof callback == 'function')
						callback();
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: false, // das Ergebnis aendert sich nicht, deshalb cachen lassen!
				success: successFn,
				failure: failureFn
			});
		return res;
	},
	
	/**
	@memberof PDMeta
	@desc Gibt das "Installationsverzeichnis" zurück.
	@return {string} Im JafWeb-Client liefert diese Funktion
	das Ergebnis von [UIApplication.getScriptDir()]{@link UIApplication#getScriptDir}
	*/
	getInstallDir : function()
	{
		return UIApplication.getScriptDir();
	},
	
	/**
	@memberof PDMeta
	@desc Gibt den Pfadtrenner auf der aktuellen Plattform zurück.
	@return {string} Es wird immer "/" zurückgegeben!
	*/
	getDirSep : function()
	{
		return '/';
	},
	
	/// Modellierte GUI-Eigenschaften
	/**
	@memberof PDMeta
	@desc Diese Funktion gibt <code>true</code> zurück, wenn die GUI-Label von
	Muss-Attributen im Normalfall fett dargestellt werden sollen (und damit
	die Eingabefelder nicht mit gelber Hintergrundfarbe).
	@return {boolean} Gibt im JafWeb-Client derzeit immer <code>true</code>
	zurück.
	*/
	getMandatoryBold : function()
	{
		return true; // TODO
	},

	// die folgenden Attribute werden beim Laden des Workspace
	// durch ein vom Server angefordertes JavaScript belegt
	_actLang : -1,
	_shortLang : null,
	_languages : null,
	_numLanguages : -1,
	_defaultLang: '',
	
	_strings : null,
	_numStrings : -1,
	_stringsIdent : null,
	_stringsIndex : null,
	_stringIdentMap : null,
	_errorMessages : null,
	_numErrorMessages : null,
	
	_copyright : null,
	_about : null,
	_version : null,
	_infobarText : null,

	_appName : "",
	_ergAppName : "",
	_classes : null,
	_abstractClass : null,
	_superClass : null,
	_subClasses : null,
	_ergClasses : null,
	
	_multilang2 : false,
	
	_instanceID : -1
};


var PDPropertiesClass = Class.create();
/**
 * @class PDProperties
 * @desc Client-seitige Repräsentation der gleichnamigen Klasse aus
 * der JANUS-Laufzeitbibliothek. Damit können auf JavaScript-Ebene
 * Benutzereinstellungen gespeichert und gelesen werden, ohne dass
 * man sich um die Kommunikation mit dem Server kümmern muss.<br/>
 * Wie bei {@link PDMeta} und {@link PDClass} wird
 * auch von dieser Klasse automatisch eine globale Instanz in 
 * einer gleichnamigen Variablen erzeugt.<br/>
 * Die vom Server angeforderten Werte werden ge-cached, so dass
 * sie nicht erneut geholt werden müssen. Beim Setzen werden
 * die neuen Werte erst in den Cache geschrieben und beim
 * Beenden der Anwendung an den Server übertragen (es sei denn,
 * beim <code>set()</code>-Aufruf wird mit dem Parameter
 * <code>immediately=true</code> die sofortige Übetrtragung veranlasst.
 * Mit [storeCachedProperties()]{@link PDProperties#storeCachedProperties}
 * können Sie diesen Vorgang auch jederzeit manuell anstoßen.<br/>
 * Falls die Benutzereinstellungen nicht Server-seitig gespeichert werden
 * sollen, kann diese Klasse mit
 * [setStoreMode('local')]{@link PDProperties#setStoreMode} auf
 * lokale Speicherung umgeschaltet werden.
 * In diesem Fall werden die Werte in Browser-Cookies oder Browser-eigener
 * Datenhaltung abgelegt.
 * @author Frank Fiolka
 */
PDPropertiesClass.prototype =
{
	_storeMode: 'remote',
	_preloaded: false,
	PDClass: null,

	/*
	@ignore(true)
	@constructs PDProperties
	@desc Dieser Konstruktor sollte niemals aufgerufen werden.
	Eine Instanz dieser Klasse steht unter deren Namen global
	zur Verfügung.
	*/
	initialize : function(preload, pdClass)
	{
		this._cache = new Object();
		this._cache._noclass = new Object();
		this._needsSync = false;
		this.retcode = 0;
		this._storeMode = 'remote';
		this._preloaded = false;
		if(false !== preload)
			this.load();
		if(arguments[arguments.length - 1] instanceof PDClassClass)
			this.PDClass = arguments[arguments.length - 1];
		else
			this.PDClass = null;
	},
	
	/**
	@memberof PDProperties
	@function setStoreMode
	@desc Legt den Speicherort der durch diese Klasse verwalteten
	benutzerspezifischen Informationen fest.
	@param {string} mode Der Speicherort. Mögliche Werte sind:
	 <ul>
	 	<li><code>remote</code>: Die Werte werden auf dem Server
		 	gespeichert, so sie dem Benutzer unabhängig vom Client
		 	überall zur Verfügung stehen. Der JANUS-Server benutzt
		 	dafür die Klasse <code>PDProperties</code> der
		 	JANUS-Laufzeitumgebung. Diese Einstellung entspricht
		 	auch dem Standcardwert.</li>
	 	<li><code>cookie</code>: Die Werte werden in den Cookies des
	 		Browsers gespeichert. Damit stehen die Benutzereinstellungen
	 		nicht mehr überall zur Verfügung. Andererseits wird der
	 		Server dadurch von der Speicherung dieser Informationen
	 		entlastet. Nachteile dieser Methode sind die enge Begrenzung des
	 		Speicherplatzes (auf ca. 4 KB) sowie die Tatsache, dass die
	 		gespeicherten Werte immer mit zum Server übertragen werden,
	 		obwohl wir sie in diesem Fall dort gar nicht benötigen.</li>
	 	<li><code>localStorage</code>: <em>Noch nicht implemntiert!</em><br/>
	 		Der Werte werden mit Browser-Mitteln lokal gespeichert. Je
	 		nach Browser kommt dabei <code>localStorage</code> (aus HTML 5)
	 		oder <code>userData</code>-Behavior (IE) zum Einsatz.
	 		Beachten Sie, dass diese Techniken nicht von allen Browsern
	 		unterstützt werden; Browser mit <code>localStorage</code>
	 		sind zumindest:
	 		<ul>
	 			<li>Firefox ab 3.5</li>
	 			<li>Safari (WebKit) ab 4.0</li>
	 			<li>Internet Explorer ab 8.0</li>
	 			<li>Opera ab 10.5</li>
	 		</ul>
	 		Vgl. <a href="http://www.quirksmode.org/dom/html5.html" target="_blank">
				http://www.quirksmode.org/dom/html5.html</a>.</li>
	 	<li><code>local</code>: <em>Veraltet.</em></li>
	 </ul>
	 */
	setStoreMode : function(mode)
	{
		if('remote' === mode)
			this._storeMode = mode;
		else if(mode == 'cookie' || mode == 'local') // 'local': veraltet
		{
			if(typeof Ext == 'object')
			{
				Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
						expires: new Date(new Date().getTime()+(1000*60*60*24*30)), // 30 Tage
						secure: Ext.isSecure
					}));
				// Testen, ob Cookies akzeptiert werden
				var tmp1 = Ext.id();
				Ext.state.Manager.set('._cookieTest', tmp1);
				var tmp2 = Ext.state.Manager.get('._cookieTest', '');
				if(tmp1 !== tmp2)
				{
					var msg = 'Your browser does not accept cookies. No user configurations will be restored on next login.';
					if(Ext.isReady && UIMessage)
						UIMessage.ok(msg, 'Cannot set cookies', UIMessage.INFORMATION);
					else
						alert(msg);
				}
				Ext.state.Manager.clear('._cookieTest');
				this._storeMode = mode;
			}
		}
		else if(mode == 'localStorage')
		{
			if(Ext.isIE && typeof window['localStorage'] == 'undefined')
			{
				// Fuer IE:
				// Benoetigt wird ein HTML-Element mit einer ID und folgender
				// CSS-Angabe:
				// behavior:url(#default#userdata);
				// Vor dem Lesen muss einmal geladen werden durch Aufruf
				// von load(<eindeutige ID>) auf dem HTML-Element-Objekt.
				// Nach dem Setzen der Werte muss entsprechend gespeichert
				// werden mit save(<eindeutige ID>).
				// Gesetzt werden die Werte mit setAttribute(<name>, <value>),
				// gelesen mit getAttribute(<name>). Gelesen werden immer
				// Strings. Falls ein Wert nicht existiert, kommt null
				// zurueck.
				var userData = UIApplication.getIEUserDataObject();
				if(userData)
					this._storeMode = mode + 'IE';
			}
			else if(typeof window['localStorage'] == 'undefined')
			{
				JDebug.log(JDebug.WARN, "PDProperties.setStoreMode('localStorage'): Sorry, your browser doesn't support localStorage.");
			}
			else
			{
				// localStorage:
				// Setzen mit setItem(<name>, <value>), lesen mit
				// getItem(<name>). Auch hier ergibt ein fehlender
				// Wert die Rueckgabe null.
				this._storeMode = mode;
			}
		}
		else
			JDebug.log(JDebug.WARN, "PDProperties.setStoreMode(): unknown mode: '"+mode+"'");
	},
	
	/**
	@memberof PDProperties
	@function load
	@desc Lädt alle gespeicherten Properties des Benutzers in den
	Client-seitigen Cache. Dadurch wird vermieden, später jede Einstellung
	einzeln vom Server abfragen zu müssen, wenn sie benötigt wird.
	@param {Function} [callback] Wenn der Request asynchron ausgeführt
	werden soll, geben Sie hier eine Callback-Funktion an, die anschließend
	ausgeführt werden soll. Wird hier keine Funktion angegeben, erfolgt der
	Aufruf synchron.
	@throws {PDException}
	 */
	load : function(callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDProperties.load()");
		var pars = new JParamPacker(JafWebAPI.PDProperties.load.eventName, this.PDClass);
		this.retcode = -1;
		var props = this;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var res = 0;
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDProperties.load():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDProperties.load()");
				var data = resp.getData();
				for(var prop in data)
				{
					if(!data.hasOwnProperty(prop))
						continue;
					//console.log("Loaded properties: ", data);
					var clName = '';
					var key = prop;
					var clId = 0;
					var sep = key.indexOf('.');
					if(sep >= 0)
					{
						clName = key.substr(0, sep);
						key = key.substr(sep + 1);
					}
					var cacheClName = (clName == '0' ? '_noclass' : (clName || '_noclass'));
					if(!props._cache[cacheClName])
						props._cache[cacheClName] = { };
					props._cache[cacheClName][key] = data[prop];
				}
				props._preloaded = true;
				if(typeof callback == 'function')
					callback();
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
	},

	/**
	@memberof PDProperties
	@function get
	@desc Ein oder mehrere Einstellungen lesen.
	@param {string} clname Name der Fachkonzeptklasse, zu der die
	Eigenschaften gehören. Der Schlüssel der Eigenschaft setzt
	sich aus der numerischen Id dieser Klasse und dem als
	<code>key</code> anzugebenden Namen zusammen. Erlaubt ist
	auch die Angabe eines Leerstrings.
	@param {string} keys Schlüssel, unter dem die zu lesende
	Eigenschaft gespeichert ist. Statt des Strings kann hier auch
	ein Array angegeben werden. In dem Fall muss auch der folgende
	Parameter <code>vals</code> ein Array sein und es werden dann
	die Werte für die Schlüssel des ersten Arrays in dem zweiten 
	Array abgelegt.
	@return {Array} Falls bei <code>keys</code> ein Array zur
	Abfrage mehrerer Eigenschaften angegeben wurde, wird auch ein
	String-Array mit den Ergebnissen zurückgegeben. Ansonsten
	ist die Rückgabe der Wert des abgefragten PDProperties als
	String.
	@param {Function} [callback] Wenn der Request asynchron ausgeführt
	werden soll, geben Sie hier eine Callback-Funktion an, die anschließend
	ausgeführt werden soll. Wird hier keine Funktion angegeben, erfolgt der
	Aufruf synchron.
	@throws {PDException}
	 */
	get : function(clname, keys, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDProperties["+this._storeMode+"].get("+clname+", "+inspect(keys)+")");
		var clName = (clname || '');
		var cacheClName = (clname || '_noclass');
		if(this._storeMode == 'cookie' || this._storeMode == 'local')
		{
			if(keys && JafWeb.isArray(keys))
			{
				var v = [ ];
				for(var i=0; i<keys.length; i++)
					v.push(Ext.state.Manager.get(clName+'.'+keys[i], ''));
				//JDebug.log(JDebug.WARN, "PDProperties[cookie].get('"+clname+"', "+inspect(keys)+"): returns "+inspect(v));
				if(typeof callback == 'function')
				{
					callback(v);
					return;
				}
				return v;
			}
			else if(keys)
			{
				var v = Ext.state.Manager.get(clName+'.'+keys, '');
				//JDebug.log(JDebug.WARN, "PDProperties[cookie].get('"+clname+"', '"+keys+"'): returns "+inspect(v));
				if(typeof callback == 'function')
				{
					callback(v);
					return;
				}
				return v;
			}
			if(typeof callback == 'function')
			{
				callback('');
				return;
			}
			return '';
		}
		else if(this._storeMode == 'localStorageIE')
		{
			var userData = UIApplication.getIEUserDataObject();
			if(keys && JafWeb.isArray(keys))
			{
				var vals = [ ];
				if(userData)
				{
					for(var i=0; i<keys.length; i++)
					{
						var tmpKey = clname + '_' + keys[i];
						// Key muss C++-konform sein
						var reg = /^\w/;
						if(!reg.test(tmpKey))
							tmpKey = '_' + tmpKey;
						vals.push(userData.getAttribute(tmpKey) || '');
					}
				}
				if(typeof callback == 'function')
				{
					callback(vals);
					return;
				}
				return vals;
			}
			else if(keys)
			{
				if(userData)
				{
					var tmpKey = clname + '_' + keys;
					// Key muss C++-konform sein
					var reg = /^\w/;
					if(!reg.test(tmpKey))
						tmpKey = '_' + tmpKey;
					var v = (userData.getAttribute(tmpKey) || '');
					if(typeof callback == 'function')
					{
						callback(v);
						return;
					}
					return v;
				}
				if(typeof callback == 'function')
				{
					callback('');
					return;
				}
				return '';
			}
		}
		else if(this._storeMode == 'localStorage')
		{
			if(keys && JafWeb.isArray(keys))
			{
				var vals = [ ];
				for(var i=0; i<keys.length; i++)
				{
					var tmpKey = clname + '_' + keys[i];
					// Key muss C++-konform sein
					var reg = /^\w/;
					if(!reg.test(tmpKey))
						tmpKey = '_' + tmpKey;
					vals.push(localStorage.getItem(tmpKey) || '');
				}
				if(typeof callback == 'function')
				{
					callback(vals);
					return;
				}
				return vals;
			}
			else if(keys)
			{
				var tmpKey = clname + '_' + keys;
				// Key muss C++-konform sein
				var reg = /^\w/;
				if(!reg.test(tmpKey))
					tmpKey = '_' + tmpKey;
				var v = (localStorage.getItem(tmpKey) || '');
				if(typeof callback == 'function')
				{
					callback(v);
					return;
				}
				return v;
			}
		}
		if(this._preloaded)
		{
			if(keys && JafWeb.isArray(keys))
			{
				var vals = [];
				for(var i=0; i<keys.length; i++)
				{
					//JDebug.log(JDebug.DEBUG, 'PDProperties[preloaded].get(): key '+i+': '+keys[i]);
					if(!this._cache[cacheClName] || this._cache[cacheClName][keys[i]] === undefined)
						vals.push('');
					else
						vals.push(this._cache[cacheClName][keys[i]]);
				}
				if(typeof callback == 'function')
				{
					callback(vals);
					return;
				}
				return vals;
			}
			else
			{
				var v = '';
				if(this._cache[cacheClName] && this._cache[cacheClName][keys] !== undefined)
					v = (this._cache[cacheClName][keys] || '');
				if(typeof callback == 'function')
				{
					callback(v);
					return;
				}
				return v;
			}
		}
		// remote
		var needsRequest = false;
		if(!this._cache[cacheClName])
			this._cache[cacheClName] = new Object();
		var pars = new JParamPacker(JafWebAPI.PDProperties.get.eventName, this.PDClass);
		//pars.add("clName", (clname||""));
		var vals = (JafWeb.isArray(keys) ? [ ] : '');
		if(keys && JafWeb.isArray(keys))
		{
			for(var i=0; i<keys.length; i++)
			{
				//JDebug.log(JDebug.DEBUG, 'PDProperties[remote].get(): key '+i+': '+keys[i]);
				if(this._cache[cacheClName][keys[i]] === undefined)
				{
					pars.add("key"+i, clName+'.'+keys[i]);
					needsRequest = true;
				}
				else
				{
					var v = this._cache[cacheClName][keys[i]];
					vals.push(v);
				}
			}
		}
		else
		{
			if(this._cache[cacheClName][keys] === undefined)
			{
				pars.add("key0", clName+'.'+keys);
				needsRequest = true;
			}
			else
			{
				var v = (this._cache[cacheClName][keys] || '');
				if(typeof callback == 'function')
				{
					callback(v);
					return;
				}
				return v;
			}
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDProperties[remote].get(): Params: "+pars.toString());
		var props = this;
		if(needsRequest == true)
		{
			this.retcode = -1;
			var pdClass = this.PDClass;
			var successFn = function(req, options)
					{
						var res = 0;
						var resp = new JResponse(req, options, pdClass);
						if(resp.hasFatalError())
							throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
									"PDProperties.get():\n"+resp.getResponseText());
						if(resp.hasError())
							throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDProperties.get()");
						if(!props._cache[cacheClName])
							props._cache[cacheClName] = {};
						if(JafWeb.isArray(keys))
						{
							for(var i=0; i<keys.length; i++)
							{
								var v = resp.getString(clName+'.'+keys[i]);
								if(typeof v == 'string')
								{
									props._cache[cacheClName][keys[i]] = v;
									vals[i] = v;
								}
								else if(props._cache[cacheClName] && props._cache[cacheClName][keys[i]])
									vals[i] = props._cache[cacheClName][keys[i]];
								else
									vals[i] = "";
							}
						}
						else
						{
							var v = resp.getString(clName+'.'+keys);
							if(typeof v == 'string')
								props._cache[cacheClName][keys] = v;
							if(props._cache[cacheClName][keys])
								vals = props._cache[cacheClName][keys];
						}
						this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
						if(typeof callback == 'function')
							callback(vals);
					};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
					if(typeof callback == 'function')
						callback();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "GET",
					async: (!!callback),
					params: pars.get(),
					scope: this,
					callerName: pars.getEventName(),
					disableCaching: true,
					success: successFn,
					failure: failureFn
				});
		}
		//JDebug.log(JDebug.DEBUG, "PDProperties[remote].get('"+clname+"', "+inspect(keys)+"): returns "+inspect(vals));
		if(!callback)
			return vals;
	},
	
	/**
	@memberof PDProperties
	@function findKeys
	@desc Gespeicherte Schlüssel anhand eines Suchmusters ermitteln.
	Es werden nicht die Werte, sondern nur die Schlüssel ermittelt.<br/>
	<span class="important">Hinweis:</span> Wird derzeit nur für den
	StoreMode 'localStorage' unterstützt!
	@param {Function} [callback] Wenn der Request asynchron ausgeführt
	werden soll, geben Sie hier eine Callback-Funktion an, die anschließend
	ausgeführt werden soll. Wird hier keine Funktion angegeben, erfolgt der
	Aufruf synchron.
	@return {string[]} Array mit den Schlüsseln.
	@example
var keys = PDProperties.findKeys('', 'XDlgScale');
for(var i=0; i < keys.length; i++)
{
	var key = keys[i];
	console.log("" + (i + 1) + ". " +
			keys[i] + ": " +
			PDProperties.get('', keys[i]));
}
	*/
	findKeys : function(clname, keyPattern, callback)
	{
		// Test:
		// alert(PDProperties.findKeys('', 'XDlgScale'))
		//
		//JDebug.log(JDebug.DEBUG, "PDProperties["+this._storeMode+"].find("+clname+", "+keyPattern+")");
		var clName = (clname || '');
		var cacheClName = (clname || '_noclass');
		var tmpKey = clName + '_' + keyPattern;
		// Key muss C++-konform sein
		var prefixed = false;
		if(!tmpKey.search(/^\w/))
		{
			tmpKey = '_' + keyPattern;
			prefixed = true;
		}
		var keys = [];
		var regex = new RegExp('^' + tmpKey);
		if(this._storeMode == 'localStorage')
		{
			for(var i=0; i < localStorage.length; i++)
			{
				var key = localStorage.key(i);
				if(regex.test(key))
					keys.push(prefixed && key.length > 1 ? key.substr(1) : key);
			}
		}
		if(typeof callback == 'function')
			callback(keys);
		else
			return keys;
	},

	/**
	@memberof PDProperties
	@function set
	@desc Einstellungen speichern.
	@param {string} clname Name der Fachkonzeptklasse, zu der die
	Eigenschaften gehören. Der Schlüssel der Eigenschaft setzt
	sich aus der numerischen Id dieser Klasse und dem als
	<code>key</code> anzugebenden Namen zusammen. Erlaubt ist
	auch die Angabe eines Leerstrings.
	@param {string} keys Schlüssel, unter dem die zu lesende
	Eigenschaft gespeichert ist. Statt des Strings kann hier auch
	ein Array angegeben werden. In dem Fall muss der folgende
	Parameter <code>vals</code> ein Array der gleichen Länge mit
	den zu speichernden Werten sein.
	@param {string} vals Der in der Eigenschaft zu speichernde Wert.
	Falls bei <code>keys</code> ein Array angegeben wurde, muss hier 
	ebenfalls ein Array angegeben werden.
	@param {boolean} asynchron Wird hier <code>true</code> angegeben,
	erfolgt der Request asynchron, d.h. es kann unmittelbar mit der
	lokalen Bearbeitung fortgefahren werden, während die Properties
	zum Server übertragen werden. Sie können die Properties trotzdem
	sofort nach Aufruf dieser Funktion wieder <code>PDProperties.get()</code>
	lesen, weil sie lokal zwischengespeichert werden.
	@param {boolean} immediately Standardmäßig werden die Einstellungen erst
	lokal zwischengespeichert und erst beim Abmelden bzw. bei explizitem
	Aufruf von [storeCachedProperties()]{@link PDProperties#storeCachedProperties}
	an den Server übermittelt.
	Wenn die Einstellungen jedoch unmittelbar übermittelt werden sollen, muss
	hier <code>true</code> angegeben werden.
	@throws {PDException}
	 */
	set : function(clname, keys, vals, asynchron, immediately)
	{
		//JDebug.log(JDebug.DEBUG, "PDProperties.set('"+clname+"', "+inspect(keys)+", "+inspect(vals)+")");
		var clName = (clname || '');
		var cacheClName = (clname || '_noclass');
		if(this._storeMode == 'cookie' || this._storeMode == 'local')
		{
			//JDebug.log(JDebug.DEBUG, "PDProperties[cookie].set('"+clname+"', "+inspect(keys)+", "+inspect(vals)+")");
			if(keys && vals && JafWeb.isArray(keys) && JafWeb.isArray(vals))
			{
				var v = [ ];
				for(var i=0; i<keys.length && i<vals.length; i++)
					Ext.state.Manager.set(clName+'.'+keys[i], '', (vals[i]||''));
				return v;
			}
			else if(keys)
				Ext.state.Manager.set(clName+'.'+keys, (vals||''));
			return;
		}
		else if(this._storeMode == 'localStorageIE')
		{
			var userData = UIApplication.getIEUserDataObject();
			if(userData)
			{
				if(JafWeb.isArray(keys) && JafWeb.isArray(vals))
				{
					for(var i=0; i<keys.length && i<vals.length; i++)
					{
						var tmpKey = clname + '_' + keys[i];
						// Key muss C++-konform sein
						var reg = /^\w/;
						if(!reg.test(tmpKey))
							tmpKey = '_' + tmpKey;
						userData.setAttribute(tmpKey, vals[i]);
					}
				}
				else if(keys)
				{
					var tmpKey = clname + '_' + keys;
					// Key muss C++-konform sein
					var reg = /^\w/;
					if(!reg.test(tmpKey))
						tmpKey = '_' + tmpKey;
					userData.setAttribute(tmpKey, vals);
					
					var testVal = userData.getAttribute(tmpKey);
					//JDebug.log(JDebug.DEBUG, "PDProperties[localStorageIE].set('"+clname+"', "+inspect(keys)+", "+inspect(vals)+") - stored value: '"+testVal+"'");
				}
			}
			return;
		}
		else if(this._storeMode == 'localStorage')
		{
			if(JafWeb.isArray(keys) && JafWeb.isArray(vals))
			{
				for(var i=0; i<keys.length && i<vals.length; i++)
				{
					var tmpKey = clname + '_' + keys[i];
					// Key muss C++-konform sein
					var reg = /^\w/;
					if(!reg.test(tmpKey))
						tmpKey = '_' + tmpKey;
					try
					{
						localStorage.setItem(tmpKey, vals[i]);
					}
					catch(e)
					{
						if(e == QUOTA_EXCEEDED_ERROR)
							JDebug.log(JDebug.WARN, "PDProperties[localStorage].set(): Quota exeeded!");
						else
							JDebug.log(JDebug.WARN, "PDProperties[localStorage].set(): An exception occurred: "+e+"!");
					}
				}
			}
			else if(keys)
			{
				var tmpKey = clname + '_' + keys;
				// Key muss C++-konform sein
				var reg = /^\w/;
				if(!reg.test(tmpKey))
					tmpKey = '_' + tmpKey;
				try
				{
					localStorage.setItem(tmpKey, vals);
				}
				catch(e)
				{
					if(e == QUOTA_EXCEEDED_ERROR)
						JDebug.log(JDebug.WARN, "PDProperties[localStorage].set(): Quota exeeded!");
					else
						JDebug.log(JDebug.WARN, "PDProperties[localStorage].set(): An exception occurred: "+e+"!");
				}
				//var testVal = localStorage.getItem(tmpKey);
				//JDebug.log(JDebug.DEBUG, "PDProperties[localStorageIE].set('"+clname+"', "+inspect(keys)+", "+inspect(vals)+") - stored value: '"+testVal+"'");
			}
			return;
		}
		// remote
		//JDebug.log(JDebug.DEBUG, "PDProperties[remote].set("+clname+", "+inspect(keys)+", "+inspect(vals)+")");
		var async = (asynchron !== false);
		if(!this._cache[cacheClName])
			this._cache[cacheClName] = new Object();
		if(JafWeb.isArray(keys) && JafWeb.isArray(vals))
		{
			for(var i=0; i<keys.length && i<vals.length; i++)
			{
				if(this._cache[cacheClName][keys[i]] != vals[i])
				{
					this._cache[cacheClName][keys[i]] = vals[i];
					if(immediately !== true)
						this._needsSync = true;
				}
			}
		}
		else
		{
			if(this._cache[cacheClName][keys] != vals)
			{
				this._cache[cacheClName][keys] = vals;
				if(immediately !== true)
					this._needsSync = true;
			}
		}
		if(immediately === true)
		{
			var pars = new JParamPacker(JafWebAPI.PDProperties.set.eventName, this.PDClass);
			if(JafWeb.isArray(keys) && JafWeb.isArray(vals))
			{
				for(var i=0; i < keys.length && i < vals.length; i++)
					pars.add((clName ? clName+'.'+keys[i] : keys[i]), vals[i]); // immer den Klassennamen dem Key voranstellen!
			}
			else if(keys && typeof keys == "string")
				pars.add((clName ? clName+'.'+keys : keys), (vals||''));
			//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDProperties.set(): Params: "+pars.toString());
			this.retcode = -1;
			var pdClass = this.PDClass;
			var successFn = function(req, options)
					{
						var resp = new JResponse(req, options, pdClass);
						if(resp.hasFatalError())
							throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
									"PDProperties.set():\n"+resp.getResponseText());
						if(resp.hasError())
							throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDProperties.set()");
						this.retcode = resp.getInt(JafWebAPI.PROP_retCode);
					};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "POST",
					async: async,
					params: pars.getPostParams(),
					scope: this,
					callerName: pars.getEventName(),
					disableCaching: true,
					success: successFn,
					failure: failureFn
				});
			return this.retcode;
		}
	},
	
	/**
	@memberof PDProperties
	@function contains
	@desc Fragt für einen angegebenen Namen ab, ob ein Wert gespeichert ist.
	@param {string} clname Name der Fachkonzeptklasse, zu der die
	Eigenschaft gehört. Der Schlüssel der Eigenschaft setzt
	sich aus der numerischen Id dieser Klasse und dem als
	<code>key</code> anzugebenden Namen zusammen. Erlaubt ist
	auch die Angabe eines Leerstrings.
	@param {string} key Schlüssel, unter dem die zu lesende
	Eigenschaft gespeichert ist.
	@param {Function} [callback] Wenn der Request asynchron ausgeführt
	werden soll, geben Sie hier eine Callback-Funktion an, die anschließend
	ausgeführt werden soll. Wird hier keine Funktion angegeben, erfolgt der
	Aufruf synchron.
	@return {boolean} <code>true</code>, falls ein Wert gespeichert ist,
	sonst <code>false</code>.
	@throws {PDException}
	 */
	contains : function(clname, key, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDProperties["+this._storeMode+"].contains("+clname+", "+inspect(keys)+")");
		var clName = (clname || '');
		var cacheClName = (clname || '_noclass');
		if(!key) return false;
		if(this._storeMode == 'cookie' || this._storeMode == 'local')
			return (Ext.state.Manager.get(clName+'.'+key, null) !== null);
		else if(this._storeMode == 'localStorageIE')
		{
			var userData = UIApplication.getIEUserDataObject();
			if(userData)
			{
				var tmpKey = clname + '_' + key;
				// Key muss C++-konform sein
				if(!tmpKey.search(/^\w/))
					tmpKey = '_' + tmpKey;
				var res = (userData.getAttribute(tmpKey) !== null);
				if(typeof callback == 'function')
				{
					callback(res);
					return;
				}
				return res;
			}
			else
			{
				if(typeof callback == 'function')
				{
					callback(false);
					return;
				}
				return false;
			}
		}
		else if(this._storeMode == 'localStorage')
		{
			var tmpKey = clname + '_' + key;
			// Key muss C++-konform sein
			if(!tmpKey.search(/^\w/))
				tmpKey = '_' + tmpKey;
			var res = (localStorage.getItem(tmpKey) !== null);
			if(typeof callback == 'function')
			{
				callback(res);
				return;
			}
			return res;
		}
		// remote
		var props = this;
		var needsRequest = false;
		if(this._cache[cacheClName])
		{
			if(props._cache[cacheClName][key] !== undefined)
			{
				if(typeof callback == 'function')
				{
					callback(true);
					return;
				}
				return true;
			}
		}
		var pars = new JParamPacker(JafWebAPI.PDProperties.contains.eventName, this.PDClass);
		pars.add("key", clName+'.'+keys);
		this.retcode = -1;
		var res = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDProperties.contains():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDProperties.contains()");
				res = resp.getBool(JafWebAPI.PDProperties.contains.PROP_result, false);
				this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
				if(typeof callback == 'function')
					callback(res);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return res;
	},
	
	/**
	@memberof PDProperties
	@function remove
	@desc Einstellung löschen.
	@param {string} clname Name der Fachkonzeptklasse, zu der die
	Eigenschaft gehört. Der Schlüssel einer Eigenschaft setzt
	sich aus der numerischen Id dieser Klasse und dem als
	<code>key</code> anzugebenden Namen zusammen. Erlaubt ist
	auch die Angabe eines Leerstrings.
	@param {string} keys Schlüssel, unter dem die zu lesende
	Eigenschaft gespeichert ist. Statt des Strings kann hier auch
	ein Array angegeben werden, um mehrere Einstellungen in einem
	Aufruf zu löschen.
	@throws {PDException}
	 */
	remove : function(clname, keys)
	{
		//JDebug.log(JDebug.DEBUG, "PDProperties["+this._storeMode+"].remove("+clname+", "+inspect(keys)+")");
		var clName = (clname || '');
		var cacheClName = (clname || '_noclass');
		if(this._storeMode == 'cookie' || this._storeMode == 'local')
		{
			if(keys && JafWeb.isArray(keys))
			{
				for(var i=0; i<keys.length; i++)
					Ext.state.Manager.clear(clName+'.'+keys[i]);
			}
			else if(keys)
				Ext.state.Manager.clear(clName+'.'+keys, '');
		}
		else if(this._storeMode == 'localStorageIE')
		{
			var userData = UIApplication.getIEUserDataObject();
			if(keys && JafWeb.isArray(keys))
			{
				if(userData)
				{
					for(var i=0; i<keys.length; i++)
					{
						var tmpKey = clname + '_' + keys[i];
						// Key muss C++-konform sein
						if(!tmpKey.search(/^\w/))
							tmpKey = '_' + tmpKey;
						userData.removeAttribute(tmpKey);
					}
				}
			}
			else if(keys)
			{
				if(userData)
				{
					var tmpKey = clname + '_' + keys;
					// Key muss C++-konform sein
					if(!tmpKey.search(/^\w/))
						tmpKey = '_' + tmpKey;
					userData.removeAttribute(tmpKey);
				}
			}
		}
		else if(this._storeMode == 'localStorage')
		{
			if(keys && JafWeb.isArray(keys))
			{
				for(var i=0; i<keys.length; i++)
				{
					var tmpKey = clname + '_' + keys[i];
					// Key muss C++-konform sein
					if(!tmpKey.search(/^\w/))
						tmpKey = '_' + tmpKey;
					localStorage.removeItem(tmpKey);
				}
			}
			else if(keys)
			{
				var tmpKey = clname + '_' + keys;
				// Key muss C++-konform sein
				if(!tmpKey.search(/^\w/))
					tmpKey = '_' + tmpKey;
				localStorage.removeItem(tmpKey);
			}
		}
		else
		{
			// remote
			var pars = new JParamPacker(JafWebAPI.PDProperties.remove.eventName, this.PDClass);
			var vals = (JafWeb.isArray(keys) ? [ ] : '');
			if(keys && JafWeb.isArray(keys))
			{
				for(var i=0; i<keys.length; i++)
					pars.add(JafWebAPI.PDProperties.remove.PAR_key+i, clName+'.'+keys[i]);
			}
			else
				pars.add(JafWebAPI.PDProperties.remove.PAR_key+"0", clName+'.'+keys);
			// auch aus dem Cache entfernen
			var props = this;
			if(props._cache[cacheClName])
			{
				if(JafWeb.isArray(keys))
				{
					for(var i=0; i<keys.length; i++)
					{
						if(props._cache[cacheClName][keys[i]] !== undefined)
							props._cache[cacheClName][keys[i]] = undefined;
					}
				}
				else
				{
					if(props._cache[cacheClName][keys] !== undefined)
						props._cache[cacheClName][keys] = undefined;
				}
			}
			this.retcode = -1;
			var pdClass = this.PDClass;
			var successFn = function(req, options)
					{
						var resp = new JResponse(req, options, pdClass);
						if(resp.hasFatalError())
							throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
									"PDProperties.remove():\n"+resp.getResponseText());
						if(resp.hasError())
							throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDProperties.remove()");
						this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "GET",
					async: false,
					params: pars.get(),
					scope: this,
					callerName: pars.getEventName(),
					disableCaching: true,
					success: successFn,
					failure: failureFn
				});
		}
	},
	
	/**
	@memberof PDProperties
	@function clearProperties
	@desc Die Properties für einen bestimmten Benutzer löschen.
	@param {mixed} uid Benutzerkennung. Falls nicht angegeben, wird
	die des aktuell angemeldeten Benutzers verwendet.<br/>
	<span class="important">Hinweis:</span> Properties anderer Benutzer können nur gelöscht
	werden, wenn die <code>PDProperties</code> Server-seitig gespeichert
	werden (siehe <code>setStoreMode()</code>). In diesem Fall
	benötigen Sie zum Löschen der Properties anderer Benutzer
	normalerweise administrative Rechte. Sie können auf der
	Server-Seite aber in eigenem Code in
	<code>ClientInfo::getAdminPermissionUser()</code>
	für das Recht <code>ClientInfo::resetProperties</code> abweichende
	Berechtigungen bestimmen.<br/>
	In den anderen Modi werden nur die für den Browser lokalen
	Properties gelöscht.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	 */
	clearProperties : function(uid, callback)
	{
		//JDebug.log(JDebug.DEBUG, "PDProperties["+this._storeMode+"].clearProperties("+clname+", "+inspect(keys)+")");
		if(this._storeMode == 'cookie' || this._storeMode == 'local')
		{
			// TODO
			if(typeof callback == 'function')
				callback();
		}
		else if(this._storeMode == 'localStorageIE')
		{
			// TODO
			if(typeof callback == 'function')
				callback();
		}
		else if(this._storeMode == 'localStorage')
		{
			localStorage.clear();
			if(typeof callback == 'function')
				callback();
		}
		else
		{
			// remote
			var props = this;
			var pars = new JParamPacker(JafWebAPI.PDProperties.clear.eventName, this.PDClass);
			if(uid)
				pars.add(JafWebAPI.PDProperties.clear.PAR_uid, uid);
			// auch aus dem Cache entfernen
			if(props._cache)
				delete props._cache;
			props._cache = { };
			this.retcode = -1;
			var pdClass = this.PDClass;
			var successFn = function(req, options)
					{
						var resp = new JResponse(req, options, pdClass);
						if(resp.hasFatalError())
							throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
									"PDProperties.clearProperties():\n"+resp.getResponseText());
						if(resp.hasError())
							throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDProperties.clearProperties()");
						this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
						if(typeof callback == 'function')
							callback();
					};
			var failureFn = function(response, opts) {
					JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
					if(typeof callback == 'function')
						callback();
				};
			JafWeb.ajaxRequest({
					url: this.PDClass.getURL(),
					authToken: this.PDClass.getAuthToken(),
					method: "GET",
					async: (!!callback),
					params: pars.get(),
					scope: this,
					callerName: pars.getEventName(),
					disableCaching: true,
					success: successFn,
					failure: failureFn
				});
		}
	},
	
	/**
	@memberof PDProperties
	@function clear
	@desc Alias für [clearProperties]{@link PDProperties#clearProperties}.
	@param {mixed} uid Benutzerkennung. Falls nicht angegeben, wird
	die des aktuell angemeldeten Benutzers verwendet.<br/>
	<span class="important">Hinweis:</span> Properties anderer Benutzer können nur gelöscht
	werden, wenn die <code>PDProperties</code> Server-seitig gespeichert
	werden (siehe <code>setStoreMode()</code>). In diesem Fall
	benötigen Sie zum Löschen der Properties anderer Benutzer
	normalerweise administrative Rechte. Sie können auf der
	Server-Seite aber in eigenem Code in
	<code>ClientInfo::getAdminPermissionUser()</code>
	für das Recht <code>ClientInfo::resetProperties</code> abweichende
	Berechtigungen bestimmen.<br/>
	In den anderen Modi werden nur die für den Browser lokalen
	Properties gelöscht.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	*/
	clear : function(uid, callback)
	{
		this.clearProperties(uid, callback);
	},
	
	/**
	@memberof PDProperties
	@function storeCachedProperties
	@desc Die im Cache stehenden Properties zum Server
	übertragen. Diese Funktion wird automatisch beim Beenden
	der Sitzung aufgerufen, so dass manuelle Aufrufe normalerweise
	nicht erforderlich sind. Der Request wird asynchron ausgeführt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	 */
	storeCachedProperties : function(callback)
	{
		if(this._needsSync === false)
		{
			if(typeof callback == 'function')
				callback();
			return;
		}
		if(this._storeMode == 'cookie' || this._storeMode == 'local')
		{
			if(typeof callback == 'function')
				callback();
			return; // nothing to do
		}
		else if(this._storeMode == 'localStorageIE')
		{
			// TODO: im Falle des IE (userData behavior) speichern
			var userData = UIApplication.getIEUserDataObject();
			if(userData)
				userData.save('_1007'); // TODO!
			if(typeof callback == 'function')
				callback();
			return;
		}
		else if(this._storeMode == 'localStorage')
		{
			if(typeof callback == 'function')
				callback();
			return; // nothing to do
		}
		//JDebug.log(JDebug.DEBUG, "PDProperties.storeCachedProperties()");
		var pars = new JParamPacker(JafWebAPI.PDProperties.set.eventName, this.PDClass);
		for(var clName in this._cache)
		{
			var keyPrefix = (clName == '_noclass' ? '' : clName);
			for(var key in this._cache[clName])
				pars.add(keyPrefix+'.'+key, this._cache[clName][key]); // immer den Klassennamen dem Key voranstellen!
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "PDProperties.set(): Params: "+pars.toString());
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDProperties.storeCachedProperties():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDProperties.storeCachedProperties()");
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode);
					if(this.retcode == 0)
						this._needsSync = false;
					if(typeof callback == 'function')
						callback();
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: true,
				params: pars.getPostParams(),
				scope: this,
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
	}
};
// Objekt erzeugen im Workspace-Frameset!


var ClientInfoClass = Class.create();
/**
 * @class ClientInfo
 * @desc Browser-seitige Repräsentation der Klasse <code>ClientInfo</code>
 * der JANUS-Laufzeitumgebung.<br/>
 * Wie für die Klassen {@link PDMeta}, {@link PDClass}
 * und {@link PDProperties} wird auch für diese automatisch eine
 * globale Instanz erzeugt, die unter ihrem Namen abfragbar ist.
 * Von Bedeutung ist diese Klasse insbesondere im Zusammenhang mit
 * Berechtigungen.
 * @author Frank Fiolka
 */
ClientInfoClass.prototype =
{
	_userCid : 0,
	_userOis : 0,
	_princCid : 0,
	_princOid : 0,
	_userId : -1,
	_principalId : -1,
	_loginName : '',
	_principalName : '',
	_iteratePerm : null,
	_dateformat : '',
	_timeformat : '',
	_timestampformat : '',
	_floatgroupsign : '',
	_currencygroupsign : '',
	_decimalsign : '',
	_truevalue : '',
	_falsevalue : '',
	_currencies: null,
	
	PDClass : null,
	
	/**
	@memberof ClientInfo
	@desc Konstante für den Rückgabewert von
	[commitTransaction()]{@link ClientInfo#commitTransaction}:
	Commit erfolgreich ausgeführt.
	@const {number}
	 */
	COMMIT_OK : 0,
	/**
	@memberof ClientInfo
	@desc Konstante für den Rückgabewert von
	[commitTransaction()]{@link ClientInfo#commitTransaction}:
	Commit konnte wegen Fehler nicht ausgeführt
	werden.
	@const {number}
	 */
	COMMIT_ERRORS : 1,
	/**
	@memberof ClientInfo
	@desc Konstante für den Rückgabewert von
	[commitTransaction()]{@link ClientInfo#commitTransaction}:
	Commit ausgeführt, aber es gibt
	Warnungen.
	@const {number}
	 */
	COMMIT_WARNINGS : 2,
	/**
	@memberof ClientInfo
	@desc Konstante für den Rückgabewert von
	[commitTransaction()]{@link ClientInfo#commitTransaction}:
	Commit-Versuch ergab Fehler, die aber vom
	Benutzer nach Rückfrage ignoriert werden
	können. Beispiel: Überschreiben eines
	konkurrierend geänderten Objekts.
	@const {number}
	 */
	COMMIT_NEEDS_CONFIRMATION : 4,
	
	/*
	@ignore(true)
	@constructs ClientInfo
	@desc Dieser Konstruktor sollte niemals aufgerufen werden.
	Eine Instanz dieser Klasse steht unter deren Namen global
	zur Verfügung.
	*/
	initialize : function(pdClass)
	{
		this._userCid = 0;
		this._userOis = 0;
		this._princCid = 0;
		this._princOid = 0;
		this._userId = -1;
		this._principalId = -1;
		this._loginName = '';
		this._principalName = '';
		this._iteratePerm = {};
		this.COMMIT_OK = 0;
		this.COMMIT_ERRORS = 1;
		this.COMMIT_WARNINGS = 2;
		this.COMMIT_NEEDS_CONFIRMATION = 4;
		this.PDClass = (pdClass || null);
		this._currencies = null;
	},
	
	/*
	@ignore(true)
	@memberof ClientInfo
	@desc Datums- und Zeitformate laden.
	*/
	loadFormats : function()
	{
		var pars = new JParamPacker("ClientInfo.load", this.PDClass);
		var self = this;
		var successFn = function(req, options) {
				var resp = new JResponse(req, options);
				if(!resp.hasFatalError() && !resp.hasError())
				{
					self._dateformat = resp.getString(JafWebAPI.ClientInfo.load.PROP__dateformat);
					self._timeformat = resp.getString(JafWebAPI.ClientInfo.load.PROP__timeformat);
					self._timestampformat = resp.getString(JafWebAPI.ClientInfo.load.PROP__timestampformat);
					self._floatgroupsign = resp.getString(JafWebAPI.ClientInfo.load.PROP__floatgroupsign);
					self._currencygroupsign = resp.getString(JafWebAPI.ClientInfo.load.PROP__currencygroupsign);
					self._decimalsign = resp.getString(JafWebAPI.ClientInfo.load.PROP__decimalsign);
					self._truevalue = resp.getString(JafWebAPI.ClientInfo.load.PROP__truevalue);
					self._falsevalue = resp.getString(JafWebAPI.ClientInfo.load.PROP__falsevalue);
				}
			};
		// synchroner Request!
		var req = JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: false,
				params: pars.get(),
				scope: this,
				disableCaching: true,
				success: successFn,
					failure: function() { }
				} );
	},
	
	// Flags fuer Berechtigungen
	/**
	@memberof ClientInfo
	@desc Attribut darf gelesen werden.
	@const {number}
	 */
	AttrRead : 1,
	/**
	@memberof ClientInfo
	@desc Attribut darf geschrieben werden.
	@const {number}
	 */
	AttrWrite : 2,
	/**
	@memberof ClientInfo
	@desc Attribut darf geschrieben werden, wenn es
	sich um eine Neuanlage handelt.
	@const {number}
	 */
	AttrNewWrite : 4,
	/**
	@memberof ClientInfo
	@desc Die Operation darf aufgerufen werden.
	@const {number}
	 */
	OpCall : 8,
	/**
	@memberof ClientInfo
	@desc Über die Beziehung darf navigiert werden.
	@const {number}
	 */
	RelTraverse : 16,
	/**
	@memberof ClientInfo
	@desc Aus der Beziehung dürfen Objekte entfernt werden.
	@const {number}
	 */
	RelRemove : 32,
	/**
	@memberof ClientInfo
	@desc In die Beziehung dürfen Objekte eingefügt werden.
	@const {number}
	 */
	RelInsert : 64,
	/**
	@memberof ClientInfo
	@desc Über die Beziehung dürfen Objekte neu angelegt und
	in die Beziehung eingefügt werden.
	@const {number}
	 */
	RelNewInsert : 128,
	/**
	@memberof ClientInfo
	@desc Die Objekte in der Beziehung dürfen neu angeordnet
	werden.
	@const {number}
	 */
	RelOrder : 256,
	
	// Wg. einhetil. API fuer Wizard-Skripte benoetigt:
	/**
	@memberof ClientInfo
	@desc Ist hier immer <code>false</code>.
	@member {boolean}
	 */
	isGUIClient : false,
	/**
	@memberof ClientInfo
	@desc Ist hier immer <code>true</code>.
	@member {boolean}
	 */
	isWebClient : true,
	/**
	@memberof ClientInfo
	@desc Ist hier immer <code>true</code>.
	@member {boolean}
	 */
	isJafWebClient : true,
	
	/**
	@memberof ClientInfo
	@function getWindowsClient
	@desc Fragt ab, ob es sich um einen GUI-Client unter
	Windows handelt.
	@return {boolean} Gibt hier immer <code>false</code> zurück.
	 */
	getWindowsClient : function()
	{ return false; },

	/**
	@memberof ClientInfo
	@function getDecimal
	@desc Das als Dezimaltrenner festgelegte Zeichen zurückgeben.
	@return {string} Das Trennzeichen.
	*/
	getDecimal : function()
	{
		if(!this._decimalsign)
			this.loadFormats();
		return this._decimalsign;
	},
	
	/**
	@memberof ClientInfo
	@function getFloatGroup
	@desc Das Zeichen zurückgeben, das als Tausendertrenner
	verwendet wird.
	@return {string} Das Trennzeichen.
	*/
	getFloatGroup : function()
	{
		if(!this._decimalsign) // _currencygroupsign kann auch leer sein!
			this.loadFormats();
		return this._currencygroupsign;
	},
	
	/**
	@memberof ClientInfo
	@function getFloatGroup
	@desc Gibt das aktuell eingestellte Tausendertrennzeichen
	für Währungsattribute zurück.
	@return {string} Einzelnes Trennzeichen, z.B. ".",
	oder Leerstring.
	*/
	getCurrencygroupSign : function()
	{
		if(!this._decimalsign) // _currencygroupsign kann auch leer sein!
			this.loadFormats();
		return this._currencygroupsign;
	},

	/**
	@memberof ClientInfo
	@function getDateFormat
	@desc Gibt das aktuell eingestellte Datumsformat zurück.
	Alle Datumsattribute sind nach diesem formatiert.
	@return {string} Format-String, z.B. "%d.%m.%Y"
	 */
	getDateFormat : function()
	{
		if(!this._dateformat)
			this.loadFormats();
		return this._dateformat;
	},
	
	/**
	@memberof ClientInfo
	@function getTimestampFormat
	@desc Gibt das aktuell eingestellte Format für Zeitstempel
	zurück. Alle Zeitstempel sind nach diesem formatiert.
	@return {string} Format-String, z.B. "%d.%m.%Y %h:%M:%s"
	 */
	getTimestampFormat : function()
	{
		if(!this._timestampformat)
			this.loadFormats();
		return this._timestampformat;
	},
	
	/**
	@memberof ClientInfo
	@function getTimeFormat
	@desc Gibt das aktuell eingestellte Zeitformat
	zurück. Alle Zeit-Attribute sind nach diesem formatiert.
	@return {string} Format-String, z.B. "%h:%M:%s"
	 */
	getTimeFormat : function()
	{
		if(!this._timeformat)
			this.loadFormats();
		return this._timeformat;
	},
	
	/**
	@memberof ClientInfo
	@function getShortTimeFormat
	@desc Gibt wie [getTimeFormat()]{@link ClientInfo#getTimeFormat} das
	aktuell eingestellte Zeitformat zurück, jedoch bevorzugt in
	der um die Sekunden gekürzten Form.
	@return {string} Format-String, z.B. "%h:%M"
	 */
	getShortTimeFormat : function()
	{
		var tf = this.getTimeFormat();
		var tmp = tf.split(':');
		if(tmp.length == 3)
			tf = tmp[0] + ':' + tmp[1];
		return tf;
	},

	/**
	@memberof ClientInfo
	@function getTrueValue
	@desc Gibt den ergonomischen Bezeichner für den booleschen
	Wert true zurück.
	@return {string} Z.B. "true".
	 */
	getTrueValue : function()
	{
		if(!this._truevalue)
			this.loadFormats();
		return this._truevalue;
	},

	/**
	@memberof ClientInfo
	@function getFalseValue
	@desc Gibt den ergonomischen Bezeichner für den booleschen
	Wert false zurück.
	@return {string} Z.B. "false".
	 */
	getFalseValue : function()
	{
		if(!this._falsevalue)
			this.loadFormats();
		return this._falsevalue;
	},

	/**
	 * Gibt ein Array mit Namen (gerade Stellen) und
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
	{
		return new Array(
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
				"FIM", 5.94573);
	},
	
	/**
	 * Gibt ein assoziatives Array mit Namen und Umrechnungsfaktoren
	 * der Währungen zurück.
	 * @return {Object} Objekt mit Properties aus Währungsname und Umrechnungsfaktor.
	 */
	getCurrencies : function()
	{
		if(this._currencies)
			return this._currencies;
		var defCurrs = this.getDefaultCurrencies();
		var tmp = new Object();
		for(var i=0; i < defCurrs.length - 1; i+=2)
			tmp[defCurrs[i]] = defCurrs[i+1];
		return tmp;
	},
	
	/**
	 * Legt die in der Anwendungsoberfläche unterstützten
	 * Währungen fest.
	 * @param {Object} currencies Objekt mit den Währungsbezeichnungen
	 * als Properties und den zugehörigen Umrechnungsfaktoren als
	 * Werte.
	 * @example
UIApplication.setCurrencies({
		"EUR": 1.0,
		"TEUR": 0.001
	});
	 * @example
PDClass.getCurrencies(function(res) {
		UIApplication.setCurrencies(res);
	});
	 */
	setCurrencies : function(currencies)
	{
		this._currencies = currencies;
	},
	
	/**
	 * Gibt ein assoziatives Array mit Namen und Anzahl
	 * Nachkommastellen der Währungen zurück.
	 * @return {Object} Objekt mit Properties aus Währungsname
	 * und Anzahl Nachkommastellen.
	 */
	getCurrencyPrecisions : function()
	{
		// TODO: via this.PDMeta vom Server holen
		return {
					"EUR": 2,
					"DM": 2,
					"ITL": 0,
					"FRF": 2,
					"BEF": 2,
					"ESP": 0,
					"IEP": 2,
					"LUF": 2,
					"NLG": 2,
					"ATS": 2,
					"PTE": 0,
					"FIM": 2
				};
	},
	
	/**
	 * Gibt die Default-Währung zurück, die anwendungsweit als Basis für
	 * Währungsumrechnungen verwendet wird.
	 * @return {string} Der Währungsname.
	 */
	getDefaultCurrency : function()
	{
		if(!this.PDMeta)
			return "EUR";
		// TODO: via this.PDMeta vom Server holen
		return "EUR";
	},
	
	/**
	 * Gibt ein Array mit den Monatsnamen in der
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
	{
		if(!lang && this.PDMeta)
			lang = this.PDMeta.getLang();
		if(typeof lang == "number" && this.PDMeta)
			lang = this.PDMeta.getLangCode(lang);
		switch(lang)
		{
		case "de":
			if(shortForm==true)
				return new Array('Jan','Feb','Mär','Apr','Mai','Jun',
					'Jul','Aug','Sep','Okt','Nov','Dez');
			return new Array('Januar','Februar','März','April','Mai','Juni',
				'Juli','August','September','Oktober','November','Dezember');
			break;
		case "fr":
			if(shortForm==true)
				return new Array('Jan','Feb','Mar','Apr','May','Jun',
					'Jul','Aug','Sep','Oct','Nov','Dec');
			return new Array('Janvier','F´evrier','Mars','Avril','Mai','Juin',
				'Juillet','Ao^ut','Septembre','Octobre','Novembre','D´ecembre');
			break;
		default: // uk
			if(shortForm==true)
				return new Array('Jan','Feb','Mar','Apr','May','Jun',
					'Jul','Aug','Sep','Oct','Nov','Dec');
			return new Array('January','February','March','April','May','June',
				'July','August','September','October','November','December');
		}
	},

	/**
	 * Gibt ein Array mit den Namen der Wochentage
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
	{
		if(!lang && this.PDMeta)
			lang = this.PDMeta.getLang();
		if(typeof lang == "number" && this.PDMeta)
			lang = this.PDMeta.getLangCode(lang);
		switch(lang)
		{
		case "de":
			if(shortForm==true)
				return new Array('Mo','Di','Mi','Do','Fr','Sa','So');
			return new Array('Montag','Dienstag','Mittwoch','Donnerstag',
				'Freitag','Samstag','Sonntag');
			break;
		case "fr":
			if(shortForm==true)
				return new Array('Lun','Mar','Mer','Jeu','Ven','Sam','Dim');
			return new Array('Lundi','Mardi','Mercredi','Jeudi',
				'Vendredi','Samedi','Dimanche');
			break;
		default: // uk
			if(shortForm==true)
				return new Array('Mo','Tu','We','Th','Fr','Sa','Su');
			return new Array('Monday','Tuesday','Wednesday','Thursday',
				'Friday','Saturday','Sunday');
		}
	},

	/**
	@memberof ClientInfo
	@function getLoginName
	@desc Den Loginnamen des angemeldeten Benutzers ermitteln.
	@return {string} Der Loginname.
	*/
	getLoginName : function()
	{
		if(!this._loginName)
			this._loginName = this.PDClass.getUserName();
		return this._loginName;
	},
	
	/**
	@memberof ClientInfo
	@function getUserId
	@desc Die Kennung des angemeldeten Benutzers zurückgeben.
	@return {number} Die Benutzer-Id. Ist kein Benutzer,
	sondern der technische admin angemeldet, ist der Rückgabewert
	<code>0</code>.
	*/
	getUserId : function()
	{
		if(this._userId == -1)
			this._userId = this.PDClass.getUserId();
		return this._userId;
	},
	
	/**
	@memberof ClientInfo
	@function getPrincipalId
	@desc Die Kennung des angemeldeten Mandanten zurückgeben.
	@return {number} Die Mandanten-Id. Ist kein Mandant
	angemeldet, ist der Rückgabewert <code>0</code>.
	*/
	getPrincipalId : function()
	{
		if(this._principalId == -1)
			this._principalId = this.PDClass.getPrincipalId();
		return this._principalId;
	},
	
	/**
	@memberof ClientInfo
	@function getPrincipalName
	@desc Den Loginnamen des aktuellen Mandanten zurückgeben.
	@return {string} Der Loginname des Mandanten.
	*/
	getPrincipalName : function()
	{
		if(!this._principalName)
			this._principalName = this.PDClass.getPrincipalName();
		return this._principalName;
	},
	
	/**
	@memberof ClientInfo
	@function getPrincipalObject
	@desc Das Fachkonzeptobjekt zurückgeben, das den aktuell
	angemeldeten Mandanten repräsentiert. Ein solches
	Objekt gibt es nur, wenn im OOA-Modell eine Klasse mit
	dem Stereotyp <code>Principal</code> definiert ist.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Mandantenobjekt oder <code>null</code>,
	wenn keine entspr. Klasse definiert oder kein Mandant
	angemeldet ist.
	@throws {PDException}
	*/
	getPrincipalObject : function(callback)
	{
		// Falls schon einmal geholt, om PDObject-Cache nachsehen
		if(this._princCid && this._princOid && this.PDClass.usePDObjectCache())
		{
			var obj = this.PDClass.PDObjectCache.get(this._princCid, this._princOid);
			if(obj != null)
			{
				if(typeof callback == 'function')
				{
					callback(obj);
					return;
				}
				return obj;
			}
		}
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getPrincipalObject.eventName, this.PDClass);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getPrincipalObject(): Params: "+pars.toString());
		var result = null;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"ClientInfo.getPrincipalObject():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getPrincipalObject()");
					result = resp.getPDObject(JafWebAPI.ClientInfo.getPrincipalObject.PROP_obj);
					if(result)
					{
						this._princCid = result.cid;
						this._princOid = result.oidLow;
					}
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof ClientInfo
	@function getUserObject
	@desc Das Fachkonzeptobjekt zurückgeben, das den aktuellen Benutzer
	repräsentiert. Dieses gibt es nur, wenn im OOA-Modell eine
	Klasse mit dem Stereotyp <code>User</code> definiert wurde.
	@param {Mixed} [attrs=true] Die zu ermittelnden Attribute - entweder eine Liste der
	technischen Attributnamen oder ein boolescher Typ, der anzeigt, ob alle Attribute
	laut Modell (<code>true</code>) oder gar keine Attribute (<code>false</code>)
	ermittelt werden sollen.
	@param {Mixed} [rels=false] Die zu ermittelnden Beziehungen. Wenn ein boolescher Typ
	angegeben wird, zeigt <code>false</code> an, dass keine Beziehungen geholt werden
	sollen, <code>true</code> dagegen, dass alle Zu-1-Beziehungen laut Modell geholt
	werden sollen. Dabei wird für jede Zu-1-Beziehung das ggf. verknüpfte {@link PDObject}
	mit lediglich dem im Modell spezifizierten Object Ident, jedoch ohne die übrigen
	Attribute geholt. Statt des booleschen Typs kann eine Liste der zu ermittelnden
	Beziehungen angegeben werden. Darin kann jedem technischen Beziehungsnamen, getrennt
	durch Komma, der Template-Ausdruck für die RelationInfo angehängt werden. Das ist
	wichtig, um spätere, vereinzelte [getStatus()]{@link PDObject#getStatus}-Aufrufe
	zu vermeiden.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Benutzerobjekt oder <code>null</code>,
	wenn keine entspr. Klasse definiert oder kein Benutzer, sondern
	der technische <code>admin</code> angemeldet ist.
	@throws {PDException}
	*/
	getUserObject : function(attrs, rels, callback)
	{
		var pos = 0;
		var callbFn = null;
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getUserObject.eventName, this.PDClass);
		if(attrs)
		{
			if(typeof attrs == 'boolean')
				pars.add(JafWebAPI.ClientInfo.getUserObject.PAR_allAttrs, attrs);
			else if(JafWeb.isArray(attrs))
			{
				for(var i=0; i < attrs.length; i++)
					pars.add(JafWebAPI.ClientInfo.getUserObject.PAR_attrs, attrs[i]);
			}
			pos++;
		}
		if(rels)
		{
			if(typeof rels == 'boolean')
				pars.add(JafWebAPI.ClientInfo.getUserObject.PAR_allTo1Rels, rels);
			else if(JafWeb.isArray(rels))
			{
				for(var i=0; i < rels.length; i++)
					pars.add(JafWebAPI.ClientInfo.getUserObject.PAR_rels, rels[i]);
			}
			pos++;
		}
		if(pos < arguments.length && typeof arguments[pos] == 'function')
		{
			callbFn = arguments[pos];
			pos++;
		}
		// Falls schon einmal geholt, im PDObject-Cache nachsehen
		if(this._userCid && this._userOid && this.PDClass.usePDObjectCache())
		{
			var obj = this.PDClass.PDObjectCache.get(this._userCid, this._userOid);
			if(obj != null)
			{
				if(typeof callbFn == 'function')
				{
					callbFn(obj);
					return;
				}
				return obj;
			}
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getUserObject(): Params: "+pars.toString());
		var result = null;
		var pdClass = this.PDClass;
		var ci = this;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"ClientInfo.getUserObject():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getUserObject()");
					result = resp.getPDObject(JafWebAPI.ClientInfo.getUserObject.PROP_obj);
					if(result)
					{
						ci._userCid = result.cid;
						ci._userOid = result.oidLow;
					}
					if(typeof callbFn == 'function')
						callbFn(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callbFn),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callbFn)
			return result;
	},
	
	// Dynamische Berechtigungen ermitteln
	/**
	@memberof ClientInfo
	@function getAttrPermission
	@desc Die möglichen Rechte für Attributzugriffe ermitteln.
	@param {string} clname Name der Fachkonzeptklasse.
	@param {string} attrName Name des Attributs.
	@param {PDObject} obj Das <code>this</code>-Objekt. Bei
	 	statischen Attributen wird dieser Parameter weggelassen.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Ein oder mehrere, miteinander "ver-oderte"
	Flags:
	<ul>
		<li>[ClientInfo.AttrRead]{@link ClientInfo#AttrRead}</li>
		<li>[ClientInfo.AttrWrite]{@link ClientInfo#AttrWrite}</li>
		<li>[ClientInfo.AttrNewWrite]{@link ClientInfo#AttrNewWrite}</li>
		<li>[ClientInfo.OpCall]{@link ClientInfo#OpCall}</li>
	</ul>
	@throws {PDException}
	*/
	getAttrPermission : function(clname, attrName, obj, callback)
	{
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getAttrPermission.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.getAttrPermission.PAR_clName, clname);
		var many = false;
		if(JafWeb.isArray(attrName))
		{
			many = true;
			var cnt = 0;
			for(var a = 0; a < attrName.length; a++)
			{
				pars.add(JafWebAPI.PDObject.getAttributes.PAR_attr + cnt, attrName[a]);
				cnt++;
			}
		}
		else
			pars.add(JafWebAPI.ClientInfo.getAttrPermission.PAR_attr, attrName);
		if(obj)
		{
			pars.add(JafWebAPI.ClientInfo.getAttrPermission.PAR_oidHi, obj.oidHi);
			pars.add(JafWebAPI.ClientInfo.getAttrPermission.PAR_oidLow, obj.oidLow);
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getAttrPermission(): Params: "+pars.toString());
		var resultHolder = {};
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"ClientInfo.getAttrPermission():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getAttrPermission()");
				if(many)
				{
					var arrTmp = resp.getArray(JafWebAPI.ClientInfo.getAttrPermission.PROP_res, [], 'string', '0');
					resultHolder.result = [];
					for(var i = 0; i < arrTmp.length; i++)
						resultHolder.result.push(eval(arrTmp[i]) || 0);
				}
				else
				{
					var tmp = resp.getString(JafWebAPI.ClientInfo.getAttrPermission.PROP_res);
					resultHolder.result = (eval(tmp) || 0);
				}
				if(typeof callback == 'function')
					callback(resultHolder.result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return resultHolder.result;
	},
	
	/**
	@memberof ClientInfo
	@function getRelPermission
	@desc Die möglichen Rechte für Zugriffe auf eine Beziehung ermitteln.
	@param {string} clname Name der Fachkonzeptklasse.
	@param {string} relName Name der Beziehung.
	@param {PDObject} obj Das <code>this</code>-Objekt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Ein oder mehrere, miteinander "ver-oderte"
	Flags:
	<ul>
		<li>[ClientInfo.RelTraverse]{@link ClientInfo#RelTraverse}</li>
		<li>[ClientInfo.RelRemove]{@link ClientInfo#RelRemove}</li>
		<li>[ClientInfo.RelInsert]{@link ClientInfo#RelInsert}</li>
		<li>[ClientInfo.RelNewInsert]{@link ClientInfo#RelNewInsert}</li>
		<li>[ClientInfo.RelOrder]{@link ClientInfo#RelOrder}</li>
	</ul>
	@throws {PDException}
	*/
	getRelPermission : function(clname, relName, obj, callback)
	{
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getRelPermission.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.getRelPermission.PAR_clName, clname);
		pars.add(JafWebAPI.ClientInfo.getRelPermission.PAR_relname, relName);
		if(obj)
		{
			pars.add(JafWebAPI.ClientInfo.getRelPermission.PAR_oidHi, obj.oidHi);
			pars.add(JafWebAPI.ClientInfo.getRelPermission.PAR_oidLow, obj.oidLow);
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getRelPermission(): Params: "+pars.toString());
		var result = 0;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"ClientInfo.getRelPermission():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getRelPermission()");
				var tmp = resp.getString(JafWebAPI.ClientInfo.getRelPermission.PROP_res);
				result = (eval(tmp) || 0);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof ClientInfo
	@function getExecPermission
	@desc Die möglichen Rechte zum Ausführen einer Server-Operation ermitteln.
	@param {string} clname Name der Fachkonzeptklasse.
	@param {string} opName Name der Operation.
	@param {PDObject} obj Das <code>this</code>-Objekt. Bei
		Klassenoperationen wird dieser Parameter weggelassen.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} <code>true</code>, wenn das Recht gegeben ist, sonst
	<code>false</code>.
	@throws {PDException}
	*/
	getExecPermission : function(clname, opName, obj, callback)
	{
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getExecPermission.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.getExecPermission.PAR_clName, clname);
		pars.add(JafWebAPI.ClientInfo.getExecPermission.PAR_opname, opName);
		if(obj)
		{
			pars.add(JafWebAPI.ClientInfo.getExecPermission.PAR_oidHi, obj.oidHi);
			pars.add(JafWebAPI.ClientInfo.getExecPermission.PAR_oidLow, obj.oidLow);
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getExecPermission(): Params: "+pars.toString());
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"ClientInfo.getExecPermission():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getExecPermission()");
				result = resp.getBool(JafWebAPI.ClientInfo.getExecPermission.PROP_res, false);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	@memberof ClientInfo
	@function getCreatePermission
	@desc Ermittelt, ob der Benutzer ein neues Objekt einer bestimmten
	Klasse anlegen darf.
	@param {string} clname Name der Fachkonzeptklasse.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} <code>true</code>, wenn das Recht gegeben ist, sonst
	<code>false</code>.
	@throws {PDException}
	*/
	getCreatePermission : function(clname, callback)
	{
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getCreatePermission.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.getCreatePermission.PAR_clName, clname);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getCreatePermission(): Params: "+pars.toString());
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"ClientInfo.getCreatePermission():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getCreatePermission()");
				result = resp.getBool(JafWebAPI.ClientInfo.getCreatePermission.PROP_res, false);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof ClientInfo
	@function getIteratePermission
	@desc Prüft, ob der Benutzer das Recht hat, über alle
	Objekte einer Klasse zu iterieren. Diese Berechtigung regelt nur den
	Zugriff auf den Gesamt-Iterator. Iteratoren für Beziehungen werden
	bei den Beziehungen selbst reglementiert.<br/>
	<span class="important">Hinweis:</span> Das JANUS-Laufzeitsystem
	geht davon aus, dass dieses Recht für einen Benutzer konstant bleibt,
	so lange der Benutzer angemeldet ist. Dadurch ist es möglich, auf dem
	Client einen Zwischenspeicher zu verwalten, der wiederholte
	Anfragen mit demselben Klassennamen ohne Konsultation des Servers
	beantworten kann.
	@param {string} clname Name der Fachkonzeptklasse.
	@param {Function} [callback] Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} Wenn der Benutzer das Recht zum Iterieren hat, wird
	<code>true</code> zurückgegeben, sonst <code>false</code>.
	@throws {PDException}
	*/
	getIteratePermission : function(clname, callback)
	{
		// Cache abfragen
		if(this._iteratePerm && this._iteratePerm[clname])
		{
			if(typeof callback == 'function')
			{
				callback(this._iteratePerm[clname]);
				return;
			}
			return this._iteratePerm[clname];
		}
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getIteratePermission.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.getIteratePermission.PAR_clName, clname);
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getIteratePermission(): Params: "+pars.toString());
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"ClientInfo.getIteratePermission():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getIteratePermission()");
				result = resp.getBool(JafWebAPI.ClientInfo.getIteratePermission.PROP_res, false);
				// in Cache eintragen
				if(!this._iteratePerm)
					this._iteratePerm = {};
				this._iteratePerm[clname] = result;
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof ClientInfo
	@function getDelPermission
	@desc Ermittelt, ob der Benutzer ein bestimmtes Objekt löschen darf.
	@param {string} clname Name der Fachkonzeptklasse.
	@param {PDObject} obj Das <code>this</code>-Objekt. Fehlt dieser
		Parameter, so wird ein allgemeines Löschrecht für die Klasse
		ermittelt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} <code>true</code>, wenn das Recht gegeben ist, sonst
	<code>false</code>.
	@throws {PDException}
	*/
	getDelPermission : function(clname, obj, callback)
	{
		var pars = new JParamPacker(JafWebAPI.ClientInfo.getDelPermission.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.getDelPermission.PAR_clName, clname);
		if(obj)
		{
			pars.add(JafWebAPI.ClientInfo.getDelPermission.PAR_oidHi, obj.oidHi);
			pars.add(JafWebAPI.ClientInfo.getDelPermission.PAR_oidLow, obj.oidLow);
		}
		//JDebug.log(JDebug.PD_REQUEST_PARAMS, "ClientInfo.getDelPermission(): Params: "+pars.toString());
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"ClientInfo.getDelPermission():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.getDelPermission()");
				result = resp.getBool(JafWebAPI.ClientInfo.getDelPermission.PROP_res, false);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	@memberof ClientInfo
	@function setLanguage
	@desc Die Sprache für die Web-GUI festlegen. Im Unterschied
	zur in <code>ClientInfo</code> bzw. <code>PDMeta</code>
	auf der Server-Seite verwalteten Sprache, können hier
	auch andere, speziell für die JafWeb-GUI definierte
	Sprachen angegeben werden (vgl. Modell-<i>Property</i>
	<code>XMultilang2</code>).
	@param {mixed} lang Das Kürzel (String) oder der numerische
	Index der zu setzenden Sprache.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} <code>true</code>, falls die Sprache
	gesetzt werden konnte.
	@throws {PDException}
	*/
	setLanguage : function(lang, callback)
	{
		// pruefen, ob ein gueltiges Kuerzel
		var ok = false;
		if(typeof lang == 'number')
		{
			if(lang >= 0 && lang < this.PDClass.PDMeta._shortLang.length)
			{
				ok = true;
				this.PDClass.PDMeta._actLang = lang;
				lang = this.PDClass.PDMeta._shortLang[lang];
			}
		}
		else if(this.PDClass.PDMeta._shortLang && (typeof this.PDClass.PDMeta._shortLang.length == 'number'))
		{
			for(var l=0; l < this.PDClass.PDMeta._shortLang.length; l++)
			{
				if(lang == this.PDClass.PDMeta._shortLang[l])
				{
					ok = true;
					this.PDClass.PDMeta._actLang = l;
					break;
				}
			}
		}
		if(!ok)
		{
			throw new PDException(PDException.ERROR, "The language code '" + lang + "' is not valid.",
					"ClientInfo.setLanguage()");
		}
		var pars = new JParamPacker(JafWebAPI.ClientInfo.setLanguage.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.setLanguage.PAR_lang, lang);
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"ClientInfo.setLanguage():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.setLanguage()");
					result = (resp.getInt(JafWebAPI.PROP_retCode) == 0);
					// TODO?
					if(pdClass.PDMeta.hasMultilang2Support())
						pdClass.PDMeta.loadLanguage();
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof ClientInfo
	@function getLang
	@desc Gibt den Index der aktuellen Anwendunsgsprache
	der Web-GUI zurück.
	@return {number} Der Index der Sprache (0-basiert).
	*/
	getLang : function()
	{
		return this.PDClass.PDMeta.getLang();
	},

	/**
	@memberof ClientInfo
	@function getLanguage
	@desc Gibt die Sprache der Web-GUI zurück. Wenn sie nicht
	eigens mit [setLanguage()]{@link PDMeta#setLanguage} gesetzt wurde,
	wird die in {@link PDMeta} angegebene Sprache
	zurückgegeben.
	@return {string} Das Kürzel der Sprache.
	*/
	getLanguage : function()
	{
		return this.PDClass.PDMeta.getLangCode();
		/*var pars = new JParamPacker("ClientInfo.getLanguage", this.PDClass);
		var result = '';
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(!resp.hasFatalError())
					{
						if(resp.hasError())
							Ext.MessageBox.alert("getLanguage", resp.getErrorMessage());
						else
							result = resp.getString("code");
					}
				};
		// synchroner Request!
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: false,
				params: pars.get(),
				callerName: 'ClientInfo.getLanguage',
				disableCaching: true,
				success: successFn,
				failure: function() { }
			});
		return result;*/
	},
	
	/**
	@memberof ClientInfo
	@function disconnectClient
	@desc Die aktuelle Sitzung beenden. Diese Funktion sollte nur
	benutzt werden, wenn man den Benutzer per
	[PDClass.changeUser()]{@link PDClass#changeUser} direkt 
	von der Client-Seite angemeldet hat.
	Im standardmäßigen JafWeb-Workspace sollte
	man stattdessen [UIWorkspace.logout()]{@link UIWorkspace#logout}
	verwenden.
	@param {Function} [callb] Optionale Callback-Funktion, die
	nach erfolgter Abmeldung aufgerufen werden soll. Bei
	deren Aufruf wird ein boolescher Parameter angegeben, der
	anzeigt, ob die Aktion geklappt hat.
	*/
	disconnectClient : function(callb)
	{
		JafWeb.ajaxRequest({
				url: this.PDClass.getLogoutEvent(),
				authToken: this.PDClass.getAuthToken(),
				method: 'GET',
				params: [ ],
				async: true,
				success: function() {
						if(callb)
							callb(true);
					},
				failure: function() {
						if(callb)
							callb(false);
					}
			});
	},
	
	// neues Transaktionskonzept
	/**
	@memberof ClientInfo
	@function startTransaction
	@desc Startet eine neue Transaktion, die beliebig viele
	Transaktionsobjekte verwaltet.
	@example
var tid = ClientInfo.startTransaction();
var transObjDevice = PDClass.startTransaction(thisObj.classname, thisObj.oid, tid);
// Weitere Objekttransaktionen...
//...
// gesamte Transaktion speichern:
ClientInfo.commitTransaction(tid);
// oder verwerfen:
ClientInfo.abortTransaction(tid);
// transObjDevice existiert nun nicht mehr!
	@param {number} [transId=0] Optionale Transaktions-ID. Wird diese
	angegeben, so wird eine Unteraktion zu der angegebenen Transaktion
	gestartet, sonst eine Top Level-Transaktion.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Transaktions-ID. Diese muss angegeben
	werden, wenn auf die Transaktion zugegriffen werden
	soll. Die Transaktion muss mit [commitTransaction()]{@link ClientInfo#commitTransaction}
	bestätigt oder mit [abortTransaction()]{@link ClientInfo#abortTransaction} verworfen
	werden.
	@throws {PDException}
	 */
	startTransaction : function(transId, addParams, callback)
	{
		//JDebug.log(JDebug.PD_TRANS, "ClientInfo.startTransaction()");
		var pars = new JParamPacker(JafWebAPI.ClientInfo.startTransaction.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.startTransaction.PAR_tid, (transId || 0));
		// benutzerdefinierte Parameter
		if(JafWeb.isArray(addParams))
		{
			for(var i=0; i + 1 < addParams.length; i += 2)
				pars.add(addParams[i], addParams[i + 1]);
		}
		var tid = 0;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"ClientInfo.startTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.startTransaction()");
					tid = resp.getInt(JafWebAPI.ClientInfo.startTransaction.PROP_tid, 0);
					if(typeof callback == 'function')
						callback(tid);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return tid;
	},
	
	/**
	@memberof ClientInfo
	@function commitTransaction
	@desc Bestätigt die Transaktion. Alle beteiligten Fachkonzeptobjekte
	werden gespeichert.
	Wenn kein Fehler aufgetreten ist, ist die Transaktion
	anschließend beendet.<br/>
	<span class="important">Hinweis:</span> Diese Funktion führt keine Eingabevalidierung aus!
	Sie sollte deshalb nur aufgerufen werden, nachdem für jedes
	beteiligte Fachkonzeptobjekt durch Aufruf von [checkConstraints()]{@link PDObject#checkConstraints}
	geprüft wurde, ob das voraussichtlich gespeichert werden kann.
	@param {number} transId Die Transaktions-ID, wie sie von
	[startTransaction()]{@link ClientInfo#startTransaction} zurückgegeben wurde.
	@param {PDObject} masterTransObj (optional) Falls die Funktion
	nach dem Commit das zugehörige echte Objekt zurückgeben muss - z.B.
	um es im Dialog zu bearbeiten oder weiterzugeben -, muss hier das
	entsprechende Transaktionsobjekt angegeben werden.
	@param {string[]} addParams Optionales Array für zusätzliche Parameter.
	In diesem Array werden paarweise Einträge erwartet, deren erster der
	Name und deren zweiter der Wert des zusätzlichen Parameters ist.
	@param {boolean} force Interner Parameter, durch den sich die Funktion
	selbst erneut aufrufen kann, nachdem der Benutzer eine Rückfrage
	("...trotzdem speichern?") beantwortet hat.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {Object} Wenn <code>masterTransObj</code> angegeben wurde, wird
	ein JavaScript-Objekt mit folgenden Properties zurückgegeben:
	<ul>
		<li><code>retCode</code> Wenn alles o.k., wird <code>0</code>
			zurückgegeben.</li>
		<li><code>commitRes</code> Ergebnis des Commit-Vorgangs. Einer der
			folgenden Werte:
			<ul>
				<li><code>ClientInfo.COMMIT_OK</code>: Commit erfolgreich, kein Fehler
					aufgetreten.</li>
				<li><code>ClientInfo.COMMIT_ERRORS</code>: Commit wegen nicht behebbarem
					Fehler fehlgeschlagen.</li>
				<li><code>ClientInfo.COMMIT_WARNINGS</code>: Commit ausgeführt, aber mit
					Warnungen (siehe <code>errMsg</code>).</li>
				<li><code>ClientInfo.COMMIT_NEEDS_CONFIRMATION</code>: Commit wegen Fehlern
					nicht ausgeführt, die vom Benutzer ignoriert werden können.
					In diesem Fall steht in <code>errors</code> die
					Rückfrage an den Benutzer. Wird diese bestätigt, ruft sich die Funktion
					mit dem Paramter <code>force</code> erneut auf, um den Commit zuende
					zu führen.</li>
			</ul>
		</li>
		<li><code>errors String[]</code> String-Array mit Fehlermeldungen. Falls
			<code>stopOnError</code> <code>true</code> angegeben wurde, enthält
			das Array nur ein Element.</li>
		<li><code>warnings String[]</code> String-Array mit Meldungen, die nicht
			zum Abbruch führen.</li>
		<li><code>pdobject PDObject</code> Hier steht das gespeicherte und ggf.
			aktualisierte Originalobjekt drin.</li>
	</ul>
	@throws {PDException}
	*/
	commitTransaction : function(transId, masterTransObj, addParams, force, callback)
	{
		//JDebug.log(JDebug.PD_TRANS, "ClientInfo.commitTransaction("+transId+", "+masterTransObj+")");
		var pars = new JParamPacker(JafWebAPI.ClientInfo.commitTransaction.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.commitTransaction.PAR_tid, transId);
		if(masterTransObj)
			pars.add(JafWebAPI.ClientInfo.commitTransaction.PAR_oid, masterTransObj.oid);
		// benutzerdefinierte Parameter
		if(JafWeb.isArray(addParams))
		{
			for(var i=0; i + 1 < addParams.length; i += 2)
				pars.add(addParams[i], addParams[i + 1]);
		}
		pars.add(JafWebAPI.ClientInfo.commitTransaction.PAR_force, (true === force));
		var result = { };
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"ClientInfo.commitTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.commitTransaction()");
					if(masterTransObj)
					{
						result.retCode = resp.getInt(JafWebAPI.PROP_retCode, -1);
						result.retmsg = resp.getString(JafWebAPI.ClientInfo.commitTransaction.PROP_retMsg);
						result.commitRes = resp.getInt(JafWebAPI.ClientInfo.commitTransaction.PROP_commitRes, ClientInfo.COMMIT_ERRORS);
						//result.transObj = resp.getPDObject('transObj');
						//result.tid = resp.getInt('tid', -1);
						//if(result.transObj && result.tid >= 0)
						//	result.transObj._tid = result.tid;
						result.pdobject = resp.getPDObject(JafWebAPI.ClientInfo.commitTransaction.PROP_realObj);
						result.errors = resp.getArray(JafWebAPI.ClientInfo.commitTransaction.PROP_errMsgs, [], 'string', '');
						result.warnings = resp.getArray(JafWebAPI.ClientInfo.commitTransaction.PROP_warnMsgs, [], 'string', '');
						//if(!result.pdobject && andCommit && holdTrans)
						//	UIMessage.ok('No PDObject found in result', 'PDObject.checkConstraints()');
					}
					else
						result.retCode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					// Transaktionsobjekte Client-seitig entfernen
					var oids = resp.getArray(JafWebAPI.ClientInfo.commitTransaction.PROP_delOids);
					for(var i=0; i < oids.length; i++)
					{
						// aus dem PDObjectCache entfernen
						if(pdClass._usePDObjectCache)
							pdClass.PDObjectCache.removeObject(OID_HI(oids[i]), OID_LO(oids[i]));
					}
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof ClientInfo
	@function abortTransaction
	@desc Verwirft die Transaktion. Es wird nichts gespeichert.
	Wenn kein Fehler aufgetreten ist, ist die Transaktion
	anschließend beendet.
	@param {number} transId Die Transaktions-ID, die von
	[startTransaction()]{@link ClientInfo#startTransaction} zurückgegeben
	wurde.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	*/
	abortTransaction : function(transId, addParams, callback)
	{
		//JDebug.log(JDebug.PD_TRANS, "ClientInfo.abortTransaction("+transId+")");
		var pars = new JParamPacker(JafWebAPI.ClientInfo.abortTransaction.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.abortTransaction.PAR_tid, transId);
		// benutzerdefinierte Parameter
		if(JafWeb.isArray(addParams))
		{
			for(var i=0; i + 1 < addParams.length; i += 2)
				pars.add(addParams[i], addParams[i + 1]);
		}
		var result = 0;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"ClientInfo.abortTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.abortTransaction()");
					result = resp.getInt(JafWebAPI.PROP_retCode, -1);
					// Transaktionsobjekte Client-seitig entfernen
					var oids = resp.getArray(JafWebAPI.ClientInfo.abortTransaction.PROP_oids);
					for(var i=0; i < oids.length; i++)
					{
						// aus dem PDObjectCache entfernen
						if(pdClass._usePDObjectCache)
							pdClass.PDObjectCache.removeObject(OID_HI(oids[i]), OID_LO(oids[i]));
					}
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	@memberof ClientInfo
	@function removeFromTransaction
	@desc Entfernt ein Objekt aus einer laufenden Transaktion.
	@param {number} transId Die Transaktions-ID, die von
	[startTransaction()]{@link ClientInfo#startTransaction} zurückgegeben
	wurde.
	@param {PDObject} transObj Das zu entfernende
	Transaktionsobjekt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	*/
	removeFromTransaction : function(transId, transObj, addParams, callback)
	{
		//JDebug.log(JDebug.PD_TRANS, "ClientInfo.removeFromTransaction("+transId+", "+transObj+")");
		var pars = new JParamPacker(JafWebAPI.ClientInfo.removeFromTransaction.eventName, this.PDClass);
		pars.add(JafWebAPI.ClientInfo.removeFromTransaction.PAR_tid, transId);
		pars.add(JafWebAPI.ClientInfo.removeFromTransaction.PAR_oid, transObj.GetPDObjectId());
		// benutzerdefinierte Parameter
		if(JafWeb.isArray(addParams))
		{
			for(var i=0; i + 1 < addParams.length; i += 2)
				pars.add(addParams[i], addParams[i + 1]);
		}
		var result = 0;
		var pdClass = this.PDClass;
		var _cid = transObj.cid;
		var _oidLow = transObj.oidLow;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"ClientInfo.removeFromTransaction():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "ClientInfo.rermoveFromTransaction()");
					result = resp.getInt(JafWebAPI.PROP_retCode, -1);
					// Transaktionsobjekt Client-seitig entfernen
					if(res == 0 && pdClass._usePDObjectCache)
						pdClass.PDObjectCache.removeObject(_cid, _oidLow);
					if(typeof callback == 'function')
						callback(result);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	}
};



var PDToolsClass = Class.create();
/**
 * @class PDTools
 * @desc Klasse mit Client-seitigen Helferfunktionen rund ums
 * Fachkonzept.<br>
 * Von dieser Klasse sollen keine Objekte instanziiert werden.
 * @author Frank Fiolka
 */
PDToolsClass.prototype =
{
	PDClass : null,
	_validators: null,

	/*
	@ignore(true)
	@constructs PDTools
	@desc Dieser Konstruktor sollte niemals aufgerufen werden.
	Eine Instanz dieser Klasse steht unter deren Namen global
	zur Verfügung.
	*/
	initialize : function(pdClass)
	{
		this.PDClass = (pdClass || null);
	},

	/*
	@ignore(true)
	*/
	initValidators : function() {
		var self = this;
		self._validators = [];
		//
		// Booleans:
		//
		var sBoolRegex = '^(';
		sBoolRegex += self.PDClass.ClientInfo.getTrueValue() + '|';
		sBoolRegex += self.PDClass.ClientInfo.getFalseValue() + ')$';
		var boolRegex = new RegExp(sBoolRegex, 'i');
		self._validators['_bool'] = {
				// validation function
				validate: function(val, field) {
						var valid = boolRegex.test(val);
						//UIDebug.log(UIDebug.DEBUG, 'validate bool: '+val+', result: '+valid);
						return valid;
					},
				// error Text
				text: (self.PDClass.PDMeta.getString('SC::JWNoBoolean') || 'The value in field %f is not a valid boolean.')
				// mask property; keystroke filter mask
				//intMask: /[\d]/i
			};
		
		//
		// Ganzzahlen:
		//
		var sIntRegex = '^[+|-]?\\d+$';
		var intRegex = new RegExp(sIntRegex, 'i');
		var currGroupSign = self.PDClass.ClientInfo.getFloatGroup();
		self._validators['_int'] = {
				validate: function(val, field) {
						if(currGroupSign)
							val = val.replace(currGroupSign, '');
						var valid = intRegex.test(val);
						//UIDebug.log(UIDebug.DEBUG, 'validate int: '+val+', result: '+valid);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoInteger') || 'The value in field %f is not a valid integer.')
			};
		
		//
		// Gleitkommazahlen:
		//
		var sFloatRegex = '^[+|-]?[0-9]+';
		var floatGroupSign = self.PDClass.ClientInfo.getFloatGroup();
		var dec = self.PDClass.ClientInfo.getDecimal();
		if(dec)
		{
			sFloatRegex += '(';
			if(dec == '.')
				sFloatRegex += '\\.';
			else if(dec == ',')
				sFloatRegex += '\\,';
			else
				sFloatRegex += dec;
			sFloatRegex += '[0-9]+)?';
		}
		sFloatRegex += '$';
		var floatRegex = new RegExp(sFloatRegex, 'i');
		self._validators['_float'] = {
				validate: function(val, field, type) {
						if(type == 'currency' && currGroupSign)
							val = val.replace(currGroupSign, '');
						else if(floatGroupSign)
							val = val.replace(floatGroupSign, '');
						var valid = floatRegex.test(val);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoFloat') || 'The value in field %f is not a valid floating point number.')
			};
		
		//
		// Datum: %d.%m.%Y
		//
		var sDateMask = "[\\d";
		var tmpDatFormat = self.PDClass.ClientInfo.getDateFormat();
		if(tmpDatFormat.indexOf('.') >= 0)
			sDateMask += "\\.";
		else if(tmpDatFormat.indexOf('-') >= 0)
			sDateMask += "-";
		else if(tmpDatFormat.indexOf(':') >= 0)
			sDateMask += ":";
		sDateMask += "]";
		self._validators['_date'] = {
				validate: function(val, field) {
						var valid = (Date.parseDate(val, Date.janus2extFormat(tmpDatFormat), true) != null);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoDate') ||
						'The value in field %f is not a valid date (%t).').replace(/%t/, tmpDatFormat),
				// mask property; keystroke filter mask
				mask: new RegExp(sDateMask, "i")
			};

		//
		// Zeit: %h:%M:%s (kurz und lang)
		//
		var sTimeRegex = '^([01]?[0-9]|2[0-3])(';
		var tmpTimeFormat = self.PDClass.ClientInfo.getTimeFormat();
		if(tmpTimeFormat.indexOf(':'))
			sTimeRegex += ':';
		else if(tmpTimeFormat.indexOf('-'))
			sTimeRegex += '-';
		else if(tmpTimeFormat.indexOf('.'))
			sTimeRegex += '\\.';
		else if(tmpTimeFormat.indexOf(' '))
			sTimeRegex += '\\s';
		sTimeRegex += '[0-5][0-9]){1,2}$';
		var timeRegex = new RegExp(sTimeRegex, 'i');
		self._validators['_time'] = {
				validate: function(val, field) {
						var valid = timeRegex.test(val);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoTime') ||
						'The value in field %f is not a valid time.').replace(/%t/, tmpTimeFormat)
			};
		// Der JANUS-Typ time meint eigtl. daytime. Dagegen koennte auch etwas wie duration sinnvoll
		// sein, der nicht auf gueltige Tageszeiten validiert werden muesste; den kann man aber auch als
		// Float mit Unit darstellen.

		//
		// Zeitstempel: %d.%m.%Y %h:%M:%s
		//
		self._validators['_timestamp'] = {
				validate: function(val, field) {
						var valid = (Date.parseDate(val, Date.janus2extFormat(self.PDClass.ClientInfo.getTimestampFormat())) != null);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoTimestamp') ||
						'The value in field %f is not a valid timestamp.').replace(/%t/, self.PDClass.ClientInfo.getTimestampFormat())
			};
		
		//
		// Waehrung
		//
		self._validators['_currency'] = {
				validate: function(val, field) {
						var tmp = val.split(' ');
						if(tmp.length != 2)
							return false;
						var currs = self.PDClass.getCurrencies();
						var f = false;
						for(var c in currs)
						{
							if(tmp[1] == c)
							{
								f = true;
								break;
							}
						}
						if(f === false)
							return false;
						var vt = self.getValidator('float');
						if(vt)
							return vt.validate(tmp[0], field, 'currency');
						return false;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoCurrency') || 'The value in field %f is not a valid currency.')
			};

		//
		// Url
		// (auch Angabe ohne Protokoll zulassen)
		var urlRegex = /^(((https?|ftp|gopher|telnet|file|notes|ms-help):((\/\/)|(\\\\))+)?(localhost|[\w\d]+\.)[\w\d:#@%\/;$()~_?\+-=\\\.&]*)$/i;
		self._validators['_url'] = {
				validate: function(val, field) {
						var valid = urlRegex.test(val);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoURL') || 'The value in field %f is not a valid URL.')
			};

		//
		// E-Mail
		//
		var emailRegex = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
		// (Quelle: http://www.regular-expressions.info)
		self._validators['_email'] = {
				validate: function(val, field) {
						var valid = emailRegex.test(val);
						//UIDebug.log(UIDebug.DEBUG, 'validate email address: '+val+', result: '+valid);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoMailAddress') || 'The value in field %f is not a valid email address.')
			};

		//
		// Dokumentpfad
		//
		// TODO:

		//
		// IPv4-Adresse
		//
		var IPv4AddressRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/i;
		self._validators['_IPv4Address'] = {
				validate: function(val, field) {
						var valid = IPv4AddressRegex.test(val);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoIPv4Address') || 'The value in field %f is not a valid IPv4-address.')
			};

		//
		// IPv6-Adresse
		//
		var IPv6AddressRegex = /^([0-9a-fA-F]{4}|0)(\:([0-9a-fA-F]{4}|0)){7}$/i;
		self._validators['_IPv6Address'] = {
				validate: function(val, field) {
						var valid = IPv6AddressRegex.test(val);
						return valid;
					},
				text: (self.PDClass.PDMeta.getString('SC::JWNoIPv6Address') || 'The value in field %f is not a valid IPv6-address.')
			};
	},
	
	/**
	 * Gibt ein Validierungsobjekt, bestehdn aus einer Validierungsfunktion
	 * sowie einer passenden Meldung, für den angegebenen Datentyp zurück.
	 * Für die Validierung werden die in {@link ClientInfo} benutzerabhängig
	 * eingestellten Formate angewandt.
	 * @param {string} type Der Datentyp. Mögliche Werte, für die
	 * ein Validator zurückgegeben wird:
	 * <ul>
	 * <li><code>bool</code></li>
	 * <li><code>int</code></li>
	 * <li><code>float</code></li>
	 * <li><code>currency</code></li>
	 * <li><code>date</code></li>
	 * <li><code>time</code></li>
	 * <li><code>timestamp</code></li>
	 * <li><code>url</code></li>
	 * <li><code>email</code></li>
	 * <li><code>IPv4Address</code></li>
	 * <li><code>IPv6Address</code></li>
	 * </ul>
	 */
	getValidator : function(type) {
		if(!this._validators)
			this.initValidators();
		if(this._validators && this._validators['_' + type])
			return this._validators['_' + type];
		return null;
	},
	
	/**
	@memberof PDTools
	@function convertFilterForRelation
	@desc Verändert einen für einen Extent formulierten JANUS-Filterausdruck
	so, dass er über eine Zu-1-Beziehung zur Klasse des Extents verwendet
	werden kann. Dabei wird den im Filter vorkommenden
	Attributen die Beziehung vorgeschaltet.
	@param {string} filter Der Filterausdruck.
	@param {string} relation Der technische Name der Beziehung.
	@return {string} Der resultierende Filterausdruck.
	*/
	convertFilterForRelation : function(filter, relation)
	{
		if(!relation)
			return filter;
		var filt = "";
		var rest = filter;
		var pos = rest.search(/[A-Za-z_][A-Za-z0-9_.]*=/);
		while(pos >= 0)
		{
			var eq = rest.indexOf('=');
			var rExpr = rest.substring(pos, eq + 1);
			// "->object" an letzter Stelle wegkuerzen
			if(rExpr.substr(0, 7) == "object=")
				rExpr = "=";
			filt += rest.substr(0, pos) + relation + (rExpr.length > 1 ? "->" : "") + rExpr;
			rest = rest.substr(eq + 1);
			pos = rest.search(/[A-Za-z_][A-Za-z0-9_.]*=/);
		}
		filt += rest;
		//JDebug.log(JDebug.DEBUG, "PDTools.convertFilterForRelation('"+filter+"', '"+relation+"') returns: '"+filt+"'");
		return filt;
	},

	/**
	@memberof PDTools
	@function getSelectFilter
	@desc Auswahlfilter für eine Beziehung zusammenbauen. Dabei wird
	das Property "FilterConnected" aus den Metainformationen
	abgefragt und ggf. ein entspr. Filterausdruck erzeugt, um
	bereits verbundene Objekte nicht in der Auswahlliste
	anzuzeigen.
	@param {PDObject} pdo Das aktuelle Fachkonzeptobjekt, von dem
	die Beziehung ausgeht.
	@param {string} relation Der Beziehungsname.
	@param {string} filter Zusätzlicher Filterausdruck, der um den
	automatisch erzeugten erweitert werden soll.
	@return {string} Der komplette Filterausdruck.
	*/
	getSelectFilter : function(pdo, relation, filter)
	{
		var f = (filter || '');
		if(!pdo)
			return f;
		var cid = pdo.cid;
		var fl = (this.PDClass.PDMeta.getTypeId(cid, relation) & this.PDClass.PDMeta.TFlagMask);
		if (fl & this.PDClass.PDMeta.TFlagRelFilterConnected)
		{
			if(f.charAt(0) == '$' || f.charAt(0) == '~')
				f = f.substr(1);
			var needParen = false;
			if (this.PDClass.PDMeta.getMaxCard(cid, relation) == 1)
			{
				var relObj = pdo.getFirstLink(relation);
				if(relObj)
				{
					if(f)
					{
						f = '(' + f + ')&&(';
						needParen = true;
					}
					f += 'object!=' + pdo.GetPDObjectIdLow();
				}
			}
			else
			{
				var oids = pdo.getConnectedOids(relation);
				var i=0;
				for(; i < oids.length; i++)
				{
					if(i == 0)
					{
						if(f)
						{
							f = '(' + f + ')&&(';
							needParen = true;
						}
						f += 'object!=[';
					}
					else
						f += ',';
					f += OID_LO(oids[i]);
				}
				if(i > 0)
					f += ']';
			}
			if(f)
				f = '$' + f;
			if(needParen)
				f += ')';
		}
		//JDebug.log(JDebug.DEBUG, "PDTools.getSelectFilter(pdo, '"+relation+"', "+filter+"') returns: '"+f+"'");
		return f;
	},

	/**
	@memberof PDTools
	@function makeHTML
	@desc Mit Hilfe dieser Methode wandeln Sie einen beliebigen Text so um, dass
	HTML-Codes ihre Bedeutung verlieren. Insbesondere werden die
	Tag-Startzeichen &lt; und &gt; in &amp;lt; bzw. &amp;gt; umgewandelt.<br/>
	<span class="important">Hinweis:</span> Abweichend von der Server-seitigen API wird hier ein zweiter
	Parameter ("unicode") zur Umwandlung von Unicode-Zeichen in hexadezimale
	Entities ignoriert!
	@param {string} text Der zu konvertierende Text.
	@example PDTools.makeHTML("<b>Test</b>") // returns "&lt;b&gt;Test&lt;/b&gt;"
	*/
	makeHTML : function(text)
	{
		if(!text)
			return '';
		return text.escapeHTML();
	},

	/**
	@memberof PDTools
	@function makeURL
	@throws {PDException}
	 */
	makeURL : function(val)
	{
		// TODO
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.makeURL()");
	},

	/**
	@memberof PDTools
	@function makeLink
	@desc Diese Methode kann bei der Erstellung einer HTML-Sicht auf ein Objekt
	verwendet werden. Sie gibt einen Link auf das übergebene Objekt mit dem
	angegebenen Link-Text zurück. Der optionale String <code>tooltip</code>
	wird als Tooltip angezeigt, wenn der Benutzer mit dem Mauszeiger über
	dem Element verweilt.
	@param {PDObject} obj Das Fachkonzeptobjekt, auf das der Link verweisen soll.
	@param {string} text Der Link-Text.
	@param {string} tooltip Tooltip-Text (optional).
	@throws {PDException}
	*/
	makeLink : function(obj, text, tooltip)
	{
		// TODO
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.makeLink()");
	},

	/**
	@memberof PDTools
	@function makeFilter
	@desc Ein Aufruf dieser Funktion setzt den übergebenen Text in
	Anführungszeichen und maskiert eventuell vorhandene Anführungszeichen,
	so dass das Ergebnis zur Bildung eines Filterausdrucks für
	<code>PDIterator</code> verwendet werden kann.
	@param {string} text Der zu konvertierende Text.
	@return {string} Der konvertierte Text.<br/>
	@example
var filt = "Number=";
filt += PDTools.makeFilter(currentEquipmentNumber);
var eq = PDClass.findObject(PDMeta.getId("Equipment"), filt);
	*/
	makeFilter : function(text)
	{
		// TODO
		return "'" + text + "'"; // macht nur das, was appendQuoted() auf dem Server macht!
	},

	/**
	@memberof PDTools
	@function makeCSV
	@desc Diese Funktion dient zur einfachen Implementierung eines CSV-Exports in
	JavaScript. An die Methode müssen die Daten für eine CSV-Zeile übergeben
	werden.<br>
	Sie gibt eine Zeichenkette mit den CSV-konformen Daten zurück. An diese Zeile
	muss lediglich noch ein Zeilenumbruch angehängt werden.
	@param {string} sep Das Zeichen, das die einzelnen Datenfelder voneinander trennt.
	Normalerweise wird ein Semikolon oder ein Komma verwendet.
	@param {string} delim Das Zeichen, mit dem die zu exportierenden Daten »geklammert«
	werden sollen. Die Klammerung erfolgt nur, wenn im Text ein Trennzeichen oder
	ein Klammerungszeichen erscheint. überlicherweise verwendet man hierfür
	Anführungszeichen.
	@param {string} mask Das Maskierungszeichen wird vor das Klammerzeichen gesetzt, falls
	das Klammerzeichen (<code>delim</code>) im Text vorkommt. Überlicherweise nimmt man
	hier einen Backslash oder man verdoppelt das Klammerungszeichen, indem man den Wert
	von <code>delim</code> wiederholt.
	@throws {PDException}
	*/
	makeCSV : function(sep, delim, mask)
	{
		// TODO???
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.makeCSV()");
	},

	/**
	@memberof PDTools
	@function getUnique
	@desc Die Aufruf dieser Methode erzeugt einen global eindeutigen Wert (ähnlich einer
	aus Windows bekannten GUID).
	@param {boolean} alpha Wird die Funktion ohne Parameter oder mit <code>false</code>
	als Parameter aufgerufen, wird eine 30 Zeichen lange Zeichenkette gebildet, für
	die folgende Eigenschaften gelten:
	<ul>
		<li>Der Wert setzt sich aus den Ziffern 0 bis 9, Groß- und Kleinbuchstaben sowie
		den Sonderzeichen mit den ASCII-Codes 59 bis 64 und 91 bis 96 zusammen.
		<li>Er enthält keine einfachen oder doppelten Anführungszeichen, keine Slashes
		und keine Backslashes sowie keinen Doppelpunkt.
		<li>Wird true übergeben, enthält der Wert nur Kleinbuchstaben (ohne Umlaute).
		Die Länge vergrößert sich dadurch auf 40 Zeichen.
	</ul>
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	*/
	getUnique : function(alpha, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.getUnique.eventName, this.PDClass);
		if(true === alpha)
			pars.add(JafWebAPI.PDTools.getUnique.PAR_alpha, true);
		var result = '';
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.getUnique():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.getUnique()");
				result = resp.getString(JafWebAPI.PDTools.getUnique.PROP_res);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},
	
	/**
	@memberof PDTools
	@function md5sum
	@desc MD5-Prüfsumme für die übergebene Zeichenkette ermitteln.
	@param {string} input Die Zeichenkette.
	@return {string} 32 Zeichen langer String mit der Prüfsumme
	der übergebenen Zeichenkette.
	 */
	md5sum : function(input)
	{
		// s. www.sencha.com/forum/showthread.php?28460-Ext.util.MD5
		return JUtil.MD5(input, false, true);
	},
	
	/**
	@memberof PDTools
	@function base64Encode
	@desc Die übergebenen Daten einer Base64-Kodierung unterziehen.<br/>
	<span class="important">Hinweis:</span>Beachten Sie bitte, dass Sie für Strings,
	die auf Server-Seite dekodiert werden sollen, statt dieser Funktion unbedingt
	[PDTools#stringToBase64()]{@link PDTools#stringToBase64} benutzen
	sollten, um ein korrekt UTF-8-kodiertes Ergebnis zu bekommen!
	@param {string} inp Die zu kodierenden Daten.
	@return {string} Der Base64-kodierte String.
	*/
	base64Encode : function(inp)
	{
		return JUtil.base64.encode(inp);
	},

	/**
	@memberof PDTools
	@function base64Decode
	@desc Einen Base64-kodierten Wert dekodieren.<br/>
	<span class="important">Hinweis:</span>Beachten Sie bitte, dass Sie für auf
	Server-Seite Base64-kodierte Strings statt dieser unbedingt die Funktion
	[PDTools#base64ToString()]{@link PDTools#base64ToString} benutzen
	sollten, um ein korrekt UTF-8-kodiertes Ergebnis zu bekommen!
	@param {string} str Der kodierte String.
	@return {string} Der dekodierte Wert.
	*/
	base64Decode : function(str)
	{
		return JUtil.base64.decode(str);
	},

	/**
	@memberof PDTools
	@function base64Encode
	@desc Einen String einer Base64-Kodierung unterziehen.
	@param {string} inp Die zu kodierenden Daten.
	@return {string} Der Base64-kodierte String.
	*/
	stringToBase64 : function(inp)
	{
		return JUtil.base64.utf8ToBase64(inp);
	},

	/**
	@memberof PDTools
	@function base64Decode
	@desc Einen Base64-kodierten String dekodieren.
	@param {string} str Der kodierte String.
	@return {string} Der dekodierte Wert.
	*/
	base64ToString : function(str)
	{
		return JUtil.base64.base64ToUtf8(str);
	},

	/**
	@memberof PDTools
	@function getUsrDataDir
	@desc Funktion zum Ermitteln des Benutzer-Datenverzeichnisses.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@return {string}
	@throws {PDException}
	*/
	getUsrDataDir : function(val)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.getUrsDataDir(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function getDataDir
	@desc Funktion zum Ermitteln des System-Datenverzeichnisses.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@return {string}
	@throws {PDException}
	*/
	getDataDir : function(val)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.getDataDir(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function getTempDir
	@desc Funktion zum Ermitteln eines temporären Verzeichnisses.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@return {string}
	@throws {PDException}
	*/
	getTempDir : function(val)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.getTempDir(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function isAbsoluteDir
	@desc Funktion zum Prüfen eines Dateipfades.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} name
	@return {boolean}
	@throws {PDException}
	*/
	isAbsoluteDir : function(name)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.isAbsoluteDir(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function sleep
	@desc Das Skript vorübergehend anhalten.
	@param {number} ms Die Unterbrechungszeit in Millisekunden.
	@throws {PDException}
	*/
	sleep : function(ms)
	{
		// TODO
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.sleep()");
	},

	/**
	@memberof PDTools
	@function run
	@desc Funktion zum Aufrufen externer Programme.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@throws {PDException}
	*/
	run : function(val)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.run(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function env
	@desc Funktion zum Abfragen von Umgebungsvariablen.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} variable
	@return {string}
	@throws {PDException}
	*/
	env : function(variable)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.env(): Web apps are not able to access client-system");
	},

	/**
	@memberof PDTools
	@function renameFile
	@desc Funktion zum Umbenennen von Dateien.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} from
	@param {string} to
	@return {string}
	@throws {PDException}
	*/
	renameFile : function(from, to)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.renameFile(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function receiveFile
	@desc Eine Datei vom Server holen.<br/>
	<span class="important">Hinweis:</span> Diese Funktion besitzt im JafWeb keine Implementierung! Um eine
	Datei vom Server zu holen, starten Sie einen Download. Vgl.
	<code>PDOperationCall.execDownload()</code>.
	@param {string} remoteFile
	@param {string} localFile
	@throws {PDException}
	*/
	receiveFile : function(remoteFile, localFile)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.receiveFile()\nUse download instead.");
	},

	/**
	@memberof PDTools
	@function sendFile
	@desc Eine lokale Datei zum Server übertragen.<br/>
	<span class="important">Hinweis:</span> Diese Funktion besitzt im JafWeb keine Implementierung! Um eine
	Datei zum Server zu übertragen, verwenden Sie bitte den Upload-Dialog.
	@param {string} remoteFile
	@param {string} localFile
	@throws {PDException}
	*/
	sendFile : function(localFile, remoteFile)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.sendFile()\nUse upload instead.");
	},

	/**
	@memberof PDTools
	@function getDir
	@desc Funktion zum Ermitteln von Dateien und Unterverzeichnissen.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} name
	@param {string[]} files
	@param {string[]} directories (optional)
	Verzeichnis.
	@return {string}
	@throws {PDException}
	*/
	getDir : function(name, files, directories)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.getDir(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function beep
	@desc Der Aufruf erzeugt einen Signalton. Die Parameter sind hier unwirksam!
	@param {number} freq
	@param {number} duration
	@throws {PDException}
	@todo Implementierung
	*/
	beep : function(freq, duration)
	{
		// TODO: Implementierung mit SoundManager?
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.beep()");
	},

	/**
	@memberof PDTools
	@function Beep
	@desc Siehe [beep()]{@link PDTools#beep}.
	@throws {PDException}
	*/
	Beep : function(freq, duration)
	{
		return this.beep(freq, duration);
	},

	/**
	@memberof PDTools
	@function chdir
	@desc Das aktuelle Arbeitsverzeichnis wechseln.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb
	mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} dir
	@throws {PDException}
	*/
	chdir : function(dir)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.chdir(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function getcwd
	@desc Das aktuelle Arbeitsverzeichnis abfragen.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb
	mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@return {string}
	@throws {PDException}
	*/
	getcwd : function()
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.getcwd(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function fileCopy
	@desc Funktion zum Kopieren von Dateien.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb
	mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} source
	@param {string} dest
	@return {string}
	@throws {PDException}
	*/
	fileCopy : function(source, dest)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.fileCopy(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function fileMove
	@desc Funktion zum Verschieben von Dateien.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb
	mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} source
	@param {string} dest
	@return {string}
	@throws {PDException}
	*/
	fileMove : function(source, dest)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.fileMove(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function deleteFile
	@desc Löscht eine Datei <em>auf dem Server</em>.<br/>
	<span class="important">Hinweis:</span> Die Aktion wird grundsätzlich
	auf dem Server ausgeführt und bezieht sich auf dessen Dateisystem!
	@param {string} filename Der qualifizierte Pfad der Datei auf dem Server.
	@param {Function} [callback] Optionale Callback-Funktion. Falls angegeben,
	wird der Request asynchron ausgeführt und statt die Funktion wird mit dem
	als Rüeckgabewert beschriebenen Wert als Parameter aufgerufen.
	@return {string} Wenn die Datei erfolgreich gelöscht werden konnte, gibt die
	Funktion einen leeren String zurück. Im Fehlerfall wird statt des Leerstrings
	ein Meldungstext zurückgegeben.
	@throws {PDException}
	*/
	deleteFile : function(filename, callback)
	{
		var res = "";
		var pars = new JParamPacker(JafWebAPI.PDOperationCall.delFile.eventName, this.PDClass);
		pars.add(JafWebAPI.PDOperationCall.delFile.PAR_file, filename);
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasError())
					res = resp.getErrorMessage();
				if(typeof callback == 'function')
					callback(res);
			};
		var failureFn = function() {
				res = "Error in PDTools.deleteFile()";
				if(typeof callback == 'function')
					callback(res);
			};
		var req = JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				disableCaching: true,
				callerName: pars.getEventName(),
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return res;
	},

	/**
	@memberof PDTools
	@function fileSize
	@desc Ermittelt die Größe einer Datei <em>auf dem Server</em>.<br/>
	<span class="important">Hinweis:</span> Die Aktion wird grundsätzlich
	auf dem Server ausgeführt und bezieht sich auf dessen Dateisystem!
	@param {string} dir (optional) Falls Sie den Parameter <code>dir</code>
	angeben, wird er als Verzeichnisname interpretiert, in dem sich die
	Datei <code>fname</code> befindet. Fehlt dieser Parameter, muss <code>fname</code>
	inklusive Pfad angegeben werden.
	@param {string} fname Dateiname.
	@throws {PDException}
	*/
	fileSize : function(dir, fname)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.fileSize(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function breakLine
	@desc Diese Funktion fügt in den übergebenen String nach <code>length</code>
	Zeichen einen Zeilenumbruch ein. Ein Zeilenumbruch wird nur anstelle
	eines Leerzeichens oder Tabulators eingefügt, so dass einzelne Zeilen
	das Maximum auch überschreiten können. Wird <code>length</code> nicht
	angegeben, erfolgt der Umbruch nach jeweils 60 Zeichen.
	@param {string} text
	@param {number} length (optional)
	@return {string} Der veränderte Text.
	*/
	breakLine : function(text, length)
	{
		var autoSplit = (length || 60);
		var cCount = 0;
		for (var n = 0; n < text.length; n++)
		{
			if ((text[n] == ' ' || text[n] == '\t') && cCount >= autoSplit)
			{
				text[n] = '\n';
				cCount = 0;
			}
			else
				cCount++;
		}
		return text;
	},

	/**
	@memberof PDTools
	@function zip
	@desc Funktion zum Zippen.<br/>
	<span class="important">Hinweis:</span> Ist im JafWeb nur aus Kompatibilitätsgründen vorhanden und
	hat hier keine Implementierung. Zum Komprimieren und
	Dekomprimieren von Strings vgl. aber <code>lzwCompress()</code> bzw.
	<code>lzwDecompress()</code>.
	@throws {PDException}
	*/
	zip : function()
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.zip(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function lzwCompress
	@desc Komprimiert den übergebenen String.<br/>
	<span class="important">Hinweis:</span> Wenn Sie diese Funktion benutzen, müssen Sie
	die LZW-Bibliothek einbinden. Geben Sie dazu das Tag
	<code>lzwCompression</code> in der Datei <code>JAFparameters</code>
	mit dem Wert "true" an.
	@param {string} source Der zu komprimierende Wert.
	@return {string} Das komprimierte Ergebnis.
	@see <code>lzwDecompress()</code>
	*/
	lzwCompress : function(source)
	{
		// erst bei Bedarf laden
		if(!window.LZW)
		{
			if(!loadJavaScript(UIApplication.getResourceDir() + 'script/jaf/lzw.js', window))
				return;
		}
		return (window.LZW.compress(source) || '');
	},

	/**
	@memberof PDTools
	@function lzwDecompress
	@desc Dekomprimiert den übergebenen String.<br/>
	<span class="important">Hinweis:</span> Wenn Sie diese Funktion benutzen, müssen Sie
	die LZW-Bibliothek einbinden. Geben Sie dazu das Tag
	<code>lzwCompression</code> in der Datei <code>JAFparameters</code>
	mit dem Wert "true" an.
	@param {string} source Der zu dekomprimierende Wert.
	@return {string} Das unkomprimierte Ergebnis.
	@see <code>lzwCompress()</code>
	*/
	lzwDecompress : function(source)
	{
		// erst bei Bedarf laden
		if(!window.LZW)
		{
			if(!loadJavaScript(UIApplication.getResourceDir() + 'script/jaf/lzw.js', window))
				return;
		}
		return (window.LZW.decompress(source) || '');
	},

	/**
	@memberof PDTools
	@function deleteDirectory
	@desc Löscht ein Verzeichnis inklusive aller Unterverzeichnisse und enthaltenen
	Dateien.
	@param {string} dir Das zu löschende Verzeichnis.
	@return {string} Wenn alles erfolgreich gelöscht werden konnte, gibt die
	Funktion einen leeren String zurück. Im Fehlerfall wird statt des Leerstrings
	ein Meldungstext zurückgegeben.
	@throws {PDException}
	*/
	deleteDirectory : function(dir)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.deleteDirectory(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function createTempName
	@desc Diese Funktion ist nur der Vollständigkeit halber da. Im
	Web Client hat sie mangels Zugriff auf das lokale Dateisystem
	keine Funktion.
	@throws {PDException}
	@see <code>createTempNameOnServer()</code>.
	*/
	createTempName : function(prefix, ext)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.createTempName(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function createTempNameOnServer
	@desc Erzeugt einen <em>im Kontext des Servers</em> eindeutigen Namen für
	eine temporäre Datei mit dem Präfix <code>prefix</code> und der
	Dateierweiterung <code>ext</code>.
	@param {string} prefix Namenspräfix.
	@param {string} ext Dateinamenserweiterung.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Der erzeugte Dateiname.
	@throws {PDException}
	*/
	createTempNameOnServer : function(prefix, ext, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.createTempNameOnServer.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.createTempNameOnServer.PAR_prefix, (prefix || ''));
		pars.add(JafWebAPI.PDTools.createTempNameOnServer.PAR_ext, (ext || ''));
		var result = '';
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.createTempNameOnServer():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.createTempNameOnServer()");
				result = resp.getString(JafWebAPI.PDTools.createTempNameOnServer.PROP_res);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	@memberof PDTools
	@function makeFullDir
	@desc Das Verzeichnis <code>name</code> inklusive aller eventuell erforderlichen
	Unterverzeichnisse wird angelegt.
	@param {string} name Pfad des anzulegenden Verzeichnisses.
	@return {string} Im Erfolgsfall gibt die Funktion einen leeren String zurück.
	Im Fehlerfall wird statt des Leerstrings ein Meldungstext zurückgegeben.
	@throws {PDException}
	*/
	makeFullDir : function(name)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.makeFullDir(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function isValidUserName
	@desc Für den übergebenen String wird geprüft, ob er als Benutzername (Login-Name)
	verwendet werden könnte. Es wird nur die syntaktische Korrektheit (maximale Länge,
	Sonderzeichen) geprüft. Die Funktion erlaubt keine Aussage darüber, ob der
	Benutzername bereits vergeben ist.
	@param {string} name Der zu prüfende Name.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} Ergebnis.
	@throws {PDException}
	*/
	isValidUserName : function(name, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.isValidUserName.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.isValidUserName.PAR_name, (name || ''));
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.isValidUserName():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.isValidUserName()");
				result = resp.getBool(JafWebAPI.PDTools.isValidUserName.PROP_res, false);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	@memberof PDTools
	@function isValidPrincipalName
	@desc Für den übergebenen String wird geprüft, ob er als Name eines Mandanten
	(Login-Name) verwendet werden könnte. Es wird nur die syntaktische
	Korrektheit (maximale Länge, Sonderzeichen) geprüft. Die Funktion erlaubt
	keine Aussage darüber, ob der Mandantenname bereits vergeben ist.
	@param {string} name Der zu prüfende Name.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} Ergebnis.
	@throws {PDException}
	*/
	isValidPrincipalName : function(name, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.isValidPrincipalName.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.isValidPrincipalName.PAR_name, (name || ''));
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.isValidPrincipalName():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.isValidPrincipalName()");
				result = resp.getBool(JafWebAPI.PDTools.isValidPrincipalName.PROP_res, false);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	@memberof PDTools
	@function isValidPassword
	@desc Mit Hilfe dieser Funktion können Sie prüfen, ob ein Passwort den bei
	Aktivierung von <code>Secure Passwords</code> gültigen Kriterien entspricht.
	Es gibt zwei Möglichkeiten, diese Funktion zu verwenden:<br>
	Geben Sie als ersten Parameter die Kennung des Benutzers an, die Sie z. B.
	mit Hilfe von <code>PDClass.getUserId()</code> ermittelt haben. Als zweiter
	Parameter folgt dann das (unverschlüsselte) Passwort.<br>
	Alternativ können Sie den gewünschten Login-Namen und den Langnamen
	des Benutzers angeben. Das Passwort folgt dann als dritter Parameter. Auf diese
	Weise kann ein Passwort auch schon für einen noch nicht angelegten Benutzer
	geprüft werden.<br/>
	<span class="important">Hinweis:</span> Bitte beachten Sie aber, dass nicht geprüft
	wird, ob das Passwort bereits von dem Anwender verwendet wurde. Dies macht dann
	erst die Methode <code>PDClass.changePassword()</code>.
	@param {Mixed} uid Numerische Benutzerkennung oder Loginname (String).
	@param {string} [fullname] Name des Benutzers. Dieser wird benötigt, um bei
	noch nicht existierendem Benutzer zu prüfen, ob das Passwort Teile des
	Namens enthält.
	@param {string} pass Passwort (unverschlüsselt).
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} Die Methode gibt <code>true</code> zurück, wenn das Passwort
	den Kriterien entspricht.
	@throws {PDException}
	*/
	isValidPassword : function(uid, fullname, pass, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.isValidPassword.eventName, this.PDClass);
		var pos = 0;
		var callb = null;
		if(arguments.length >= pos && typeof arguments[pos] == 'number')
		{
			pars.add(JafWebAPI.PDTools.isValidPassword.PAR_uid, (arguments[pos] || 0));
			pos++;
		}
		else if(arguments.length >= pos && typeof arguments[pos] == 'string')
		{
			pars.add(JafWebAPI.PDTools.isValidPassword.PAR_name, (arguments[pos] || ''));
			pos++;
		}
		if(arguments.length >= pos && typeof arguments[pos] == 'string')
		{
			pars.add(JafWebAPI.PDTools.isValidPassword.PAR_name, (arguments[pos] || ''));
			pos++;
		}
		if(arguments.length >= pos && typeof arguments[pos] == 'string')
		{
			pars.add(JafWebAPI.PDTools.isValidPassword.PAR_passw, (arguments[pos] || ''));
			pos++;
		}
		if(arguments.length >= pos && typeof arguments[pos] == 'function')
		{
			callb = arguments[pos];
			pos++;
		}
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.isValidPassword():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.isValidPassword()");
				result = (resp.getInt(JafWebAPI.PDTools.isValidPassword.PROP_res, 0) == 0);
				if(typeof callb == 'function')
					callb(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callb == 'function')
					callb();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callb),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callb)
			return result;
	},
	
	/**
	Zeigt eine Fehlermeldung an, die während des Passwortwechsels
	entstanden ist. Bei aktiviertem <i>Property</i>
	<code>PasswordScript</code> wird die Meldung
	eventuell durch ein externes Skript bestimmt.
	@param {string} [msgId='SC::PasswordInvalidCustom1'] Code der
	Fehlermeldung.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {string} Die Fehlermeldung.
	@throws {PDException}
	*/
	passwordError : function(msgId, callback)
	{
		// vgl. PDlg_ChangePassword::PasswordError() - pdguidlg.cpp(2103)
		var pars = new JParamPacker(JafWebAPI.PDTools.passwordError.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.passwordError.PAR_msgId,
				(msgId || 'SC::PasswordInvalidCustom1'));
		var result = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.passwordError():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.passwordError()");
				result = resp.getString(JafWebAPI.PDTools.passwordError.PROP_res, 0);
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/**
	 * @memberof PDTools
	 * @function isValidInteger
	 * @desc Prüft für den übergebenen String-Wert, ob es sich um einen
	 * gemäß den aktuellen Einstellungen gültigen ganzzahligen Wert
	 * handelt.
	 * @param {string} val Der zu prüfende Wert.
	 * @param {number} minVal (optional) Minimaler Wert (inklusive).
	 * @param {number} maxVal (optional) Maximaler Wert (inklusive).
	 * @return {number} Der Zahlenwert, wenn der String gültig ist,
	 * sonst <code>undefined</code>.
	 */
	isValidInteger : function(val, minVal, maxVal)
	{
		// gueltig?
		var vt = this.getValidator('int');
		if(vt && !vt.validate(val))
			return undefined;
		// gemaess aktuellem Tausendertrenner in Zahl konvertieren
		var fTmp = this.isValidFloat(val, minVal, maxVal);
		if(fTmp !== undefined)
		{
			// Floats sollen NICHT akzeptiert werden:
			if(Math.floor(fTmp) !== fTmp)
				return undefined; // NICHT Number.NaN zurueckgeben; die kann man nicht vergleichen!
		}
		return fTmp;
	},

	/**
	 * @memberof PDTools
	 * @function isValidUInteger
	 * @desc Prüft für den übergebenen String-Wert, ob es sich um einen
	 * gemäß den aktuellen Einstellungen gültigen positiv-ganzzahligen
	 * Wert handelt.
	 * @param {string} val Der zu prüfende Wert.
	 * @param {number} minVal (optional) Minimaler Wert (inklusive).
	 * @param {number} maxVal (optional) Maximaler Wert (inklusive).
	 * @return {number} Der Zahlenwert, wenn der String gültig ist,
	 * sonst <code>undefined</code>.
	 */
	isValidUInteger : function(val, minVal, maxVal)
	{
		if(arguments.length > 1)
			return this.isValidInteger(val, minVal, maxVal);
		return this.isValidInteger(val, 0, maxVal);
	},

	/**
	 * @memberof PDTools
	 * @function isValidFloat
	 * @desc Prüft für den übergebenen String-Wert, ob es sich um einen
	 * gemäß den aktuellen Einstellungen gültigen Fließkommawert
	 * handelt.
	 * @param {string} val Der zu prüfende Wert.
	 * @param {number} minVal (optional) Minimaler Wert (inklusive).
	 * @param {number} maxVal (optional) Maximaler Wert (inklusive).
	 * @return {number} Der Zahlenwert, wenn der String gültig ist,
	 * sonst <code>Number.NaN</code>.
	 */
	isValidFloat : function(val, minVal, maxVal)
	{
		// gueltig?
		var vt = this.getValidator('float');
		if(vt && !vt.validate(val))
			return undefined;
		// gemaess aktuellem Dezimal- und Tausendertrenner in Zahl konvertieren
		var tmp = '' + val;
		if(this.PDClass.ClientInfo.getFloatGroup() === '.')
			tmp = tmp.replace(/\./g, '');
		var decSign = this.PDClass.ClientInfo.getDecimal();
		if(decSign && decSign != '.')
			tmp = tmp.replace(new RegExp(decSign), '.');
		var fTmp = parseFloat(tmp);
		if(fTmp != undefined)
		{
			if(arguments.length > 1 && undefined !== minVal && fTmp < minVal)
				return undefined;
			if(arguments.length > 2 && undefined !== maxVal && fTmp > maxVal)
				return undefined;
		}
		return fTmp;
	},

	/**
	@memberof PDTools
	@function toString
	@desc Diese Methode konvertiert einen JavaScript-Datentyp in eine Zeichenkette, so
	dass sie z. B. in Filterausdrücken für Iteratoren verwendet werden kann.<br/>
	Wird als Parameter eine Zahl übergeben, bestimmt ein zweiter Parameter die
	Anzahl der Nachkommastellen, die der String enthalten soll.<br/>
	Bei einem <code>Date</code>-Objekt wird der zweite Parameter als Umschalter für die
	verschiedenen JANUS-Datumswerte interpretiert. Dabei gilt folgender Zusammenhang:
	<ul>
		<li><code>1</code>: Es wird ein JANUS-Timestamp erzeugt.</li>
		<li><code>2</code>: Es wird ein JANUS-Date erzeugt.</li>
		<li><code>3</code>: Es wird ein JANUS-Time-Element erzeugt.</li>
	</ul>
	@param {mixed} val Der zu konvertierende Wert.
	@param {number} opt (optional)
	@throws {PDException}
	*/
	toString : function(val, opt)
	{
		if(typeof val == 'string')
			return val;
		if(typeof val == 'boolean')
			return (val == true ? this.PDClass.ClientInfo.getTrueValue() : this.PDClass.ClientInfo.getFalseValue());
		if(typeof val == 'number')
		{
			if(!opt) // ganzzahlig
				return '' + Math.round(val);
			else
			{
				var tmp = '' + Math.round(val * Math.pow(10, opt)) / Math.pow(10, opt);
				// mit Nullen auffuellen
				if(tmp != 'NaN')
				{
					var sep = tmp.indexOf('.');
					var i = 0;
					if(sep < 0)
						tmp += '.';
					else
						i = tmp.length - sep - 1;
					for(; i < opt; i++)
						tmp += '0';
					if(this.PDClass.ClientInfo.getDecimal() != '.')
						tmp = tmp.replace(/\./, ClientInfo.getDecimal());
				}
				return tmp;
			}
		}
		if(typeof val == 'object')
		{
			if(val instanceof Date)
			{
				switch(opt)
				{
					case 1:
					{
						// Timestamp
						var extFrmt = Date.janus2extFormat(UIApplication.getTimestampFormat());
						return val.format(extFrmt);
					}
					case 2:
					{
						// Date
						var extFrmt = Date.janus2extFormat(UIApplication.getDateFormat());
						return val.format(extFrmt);
					}
					case 3:
					{
						// Time
						var extFrmt = Date.janus2extFormat(UIApplication.getTimeFormat());
						return val.format(extFrmt);
					}
					default:
						;
				}
			}
			else if(JafWeb.isPDObject(val))
				return val.getAttribute(''); // ObjectIdent
		}
		return '';
	},

	/**
	@memberof PDTools
	@function toDouble
	@desc Wie [toFloat()]{@link PDTools#toFloat}.
	@param {string} val Der zu konvertierende Wert.
	@example PDTools.toDouble("12,34") // returns 12.34
	*/
	toDouble : function(val)
	{
		return this.toFloat(val);
	},

	/**
	@memberof PDTools
	@function toFloat
	@desc Konvertiert eine Zeichenkette in einen JavaScript-double-Wert. Die
	Zeichenkette muss in "JANUS-Syntax" angegeben sein, d. h. es gelten die
	Komma- und Tausender-Trennungen der in der Anwendung aktuell eingestellten
	Sprache.
	@param {string} val Der zu konvertierende Wert.
	*/
	toFloat : function(val)
	{
		if(typeof val == 'number')
			return val;
		var tmp = (val || '');
		// Tausendertrenner entfernen
		if(this.PDClass.ClientInfo.getFloatGroup() == '.')
			tmp = tmp.replace(new RegExp('\\' + this.PDClass.ClientInfo.getFloatGroup()), '');
		else if(this.PDClass.ClientInfo.getFloatGroup())
			tmp = tmp.replace(new RegExp(this.PDClass.ClientInfo.getFloatGroup()), '');
		// Dezimaltrenner ggf. konvertieren
		if(this.PDClass.ClientInfo.getDecimal() != '.')
			tmp = tmp.replace(new RegExp(this.PDClass.ClientInfo.getDecimal()), '.');
		return parseFloat(tmp);
	},

	/**
	@memberof PDTools
	@function toInt
	@desc Konvertiert eine Zeichenkette in einen JavaScript-Integer-Wert. Die Zeichenkette
	muss in "JANUS-Syntax" angegeben sein, d. h. es gilt das Zahlenformat der
	JANUS-Anwendung.
	@param {string} val Der zu konvertierende Wert.
	*/
	toInt : function(val)
	{
		if(typeof val == 'number')
			return Math.round(val);
		var tmp = (val || '');
		// Tausendertrenner entfernen
		if(this.PDClass.ClientInfo.getFloatGroup() == '.')
			tmp = tmp.replace(new RegExp('\\' + this.PDClass.ClientInfo.getFloatGroup()), '');
		else if(this.PDClass.ClientInfo.getFloatGroup())
			tmp = tmp.replace(new RegExp(this.PDClass.ClientInfo.getFloatGroup()), '');
		return parseInt(tmp, 10);
	},
	
	/**
	@memberof PDTools
	@function toDate
	@desc Konvertiert eine Zeichenkette in einen JavaScript-Datumswert. Die Zeichenkette
	muss in "JANUS-Syntax" angegeben sein, d. h. es gilt das Datumsformat der
	JANUS-Anwendung in der aktuell eingestellten Sprache. Dabei kann sowohl ein
	Timestamp- als auch ein Date-Wert angegeben werden.
	@param {string} val Der zu konvertierende Wert.
	@param {string} [format] Angabe des JANUS-Formats, das auf die Eingabe
	angewendet werden soll. Fehlt der Paremeter, wird das Ergebnis von
	<code>ClientInfo.getDateFormat()</code> angewendet.<br/>
	Folgende Zeichensequenzen werden unterstützt:
	<table class="props">
		<tbody>
			<tr>
				<td>%a</td><td class="last">Name des Wochentags (in der
					aktuell selektierten Sprache). Es werden nur die ersten drei Buchstaben ausgegeben</td>
			</tr>
			<tr>
				<td>%A</td><td class="last">Name des Wochentags (in der aktuell selektierten Sprache),
					komplettes Wort</td>
			</tr>
			<tr>
				<td>%b</td><td class="last">Name des Monats (in der aktuell selektierten Sprache),
					3 Buchstaben</td>
			</tr>
			<tr>
				<td>%B</td><td class="last">Name des Monats (in der aktuell selektierten Sprache),
					komplettes Wort</td>
			</tr>
			<tr>
				<td>%Y</td><td class="last">Jahr eines Datums, vierstellig</td>
			</tr>
			<tr>
				<td>%y</td><td class="last">Jahr eines Datums, zweistellig</td>
			</tr>
			<tr>
				<td>%m</td><td class="last">Monat eines Datums, zweistellig</td>
			</tr>
			<tr>
				<td>%d</td><td class="last">Monatstag eines Datums, zweistellig</td>
			</tr>
			<tr>
				<td>%j</td><td class="last">Nummer des Tags im Jahr, dreistellig</td>
			</tr>
			<tr>
				<td>%w</td><td class="last">Nummer des Tags in der Woche</td>
			</tr>
			<tr>
				<td>%h</td><td class="last">Stunde einer Uhrzeit, 24h-Format</td>
			</tr>
			<tr>
				<td>%i</td><td class="last">Stunde einer Uhrzeit, 12h-Format</td>
			</tr>
			<tr>
				<td>%p</td><td class="last">"am", wenn die Zeit vor 12:00 Uhr liegt bzw.
					"pm", wenn die Zeit danach liegt</td>
			</tr>
			<tr>
				<td>%P</td><td class="last">"AM" bzw. "PM", je nach Stunde</td>
			</tr>
			<tr>
				<td>%M</td><td class="last">Minuten einer Uhrzeit, zweistellig</td>
			</tr>
			<tr>
				<td>%s</td><td class="last">Sekunden einer Uhrzeit, zweistellig</td>
			</tr>
			<!--
			<tr>
				<td>%U</td><td class="last">Woche, in die der erste Sonntag des Jahres fällt</td>
			</tr>
			<tr>
				<td>%W</td><td class="last">Woche des Jahres. Zur Berechnung wird der europaweit
					gültige Algorithmus nach DIN 1355 angewandt</td>
			</tr>
			-->
			<tr>
				<td>%%</td><td class="last">Das %-Zeichen selbst</td>
			</tr>
		</tbody>
	</table>
	@return {Date} Das Datum oder <code>null</code>, wenn nicht konvertiert
	werden konnte.
	@example
PDTools.toDate('25.07.2016')
	@example
PDTools.toDate('01.01.2001', '%d.%m.%Y')
	@example
PDTools.toDate('2016-07-25', '%Y-%m-%d')
	@example
PDTools.toDate('2016-07-25 11:17', '%Y-%m-%d %h:%M')
	@example
PDTools.toDate('2016-07-25 11:17:22pm', '%Y-%m-%d %h:%M:s%p')
	@example
PDTools.toDate('25.Jul.2016', '%d.%b.%Y')
	@example
PDTools.toDate('25. Juli 2016', '%d. %B %Y')
	@example
PDTools.toDate('Tag 207 in 2016', 'Tag %j in %Y')
	*/
	toDate : function(val, format)
	{
		if(typeof val == 'object' && val instanceof Date)
			return val;
		if(typeof val == 'string')
		{
			if(!format)
				format = this.PDClass.ClientInfo.getDateFormat();
			//if(typeof Date.parseDate == 'function') // von ExtJS!
			//	return Date.parseDate(val, Date.janus2extFormat(format));
			var y2kYear = 50;
			var d = new Date();
			var idxF = 0, idxV = 0;
			var hours = 0;
			var addYearDays = 0;
			while(idxF < format.length)
			{
				if(format.charAt(idxF) == '%')
				{
					idxF++;
					if(idxF >= format.length) break;
					switch(format.charAt(idxF))
					{
						case 'a': // Name des Wochentags (erste 3 Buchstaben, in der aktuell selektierten Sprache)
							var names = UIApplication.getWeekdays(false);
							for(var wd = 0; wd < names.length; wd++)
							{
								if(names[wd].substr(0, 3).toLowerCase() == val.substr(idxV, 3).toLowerCase())
								{
									idxV += 3;
									break;
								}
							}
							break;
						case 'A': // Name des Wochentags (komplettes Wort, in der aktuell selektierten Sprache)
							var names = UIApplication.getWeekdays(false);
							for(var wd = 0; wd < names.length; wd++)
							{
								if(names[wd].toLowerCase() == val.substr(idxV, names[wd].length).toLowerCase())
								{
									idxV += names[wd].length;
									break;
								}
							}
							break;
						case 'b': // Name des Monats (in der aktuell selektierten Sprache), 3 Buchstaben
							var names = UIApplication.getMonthnames(true);
							for(var mn = 0; mn < names.length; mn++)
							{
								if(names[mn].toLowerCase() == val.substr(idxV, 3).toLowerCase())
								{
									d.setMonth(mn);
									idxV += 3;
									break;
								}
							}
							break;
						case 'B': // Name des Monats (in der aktuell selektierten Sprache), komplettes Wort
							var names = UIApplication.getMonthnames(false);
							for(var mn = 0; mn < names.length; mn++)
							{
								if(names[mn].toLowerCase() == val.substr(idxV, names[mn].length).toLowerCase())
								{
									d.setMonth(mn);
									idxV += names[mn].length;
									break;
								}
							}
							break;
						case 'Y': // Jahr eines Datums, vierstellig
							d.setFullYear(parseInt(val.substr(idxV, 4), 10));
							idxV += 4;
							break;
						case 'y': // Jahr eines Datums, zweistellig
							var y = parseInt(val.substr(idxV, 2), 10);
							y = y + (y > y2kYear ? 1900 : 2000);
							d.setFullYear(y);
							idxV += 2;
							break;
						case 'm': // Monat eines Datums, zweistellig
							d.setMonth(parseInt(val.substr(idxV, 2), 10) - 1);
							idxV += 2;
							break;
						case 'd': // Tag eines Datums, zweistellig
							d.setDate(parseInt(val.substr(idxV, 2), 10));
							idxV += 2;
							break;
						case 'j': // Nummer des Tags im Jahr, dreistellig
							addYearDays = parseInt(val.substr(idxV, 3), 10);
							idxV += 3;
							break;
						case 'w': // Nummer des Tags in der Woche
							idxV++;
							break;
						case 'h': // Stunde einer Uhrzeit, 24h-Format
							hours = parseInt(val.substr(idxV, 2), 10);
							idxV += 2;
							break;
						case 'i': // Stunde einer Uhrzeit, 12h-Format
							hours = parseInt(val.substr(idxV, 2), 10);
							idxV += 2;
							break;
						case 'p': // am, wenn die Zeit vor 12:00 Uhr liegt bzw. pm, wenn die Zeit danach liegt
							hours += (val.substr(idxV, 2) == 'pm' ? 12 : 0);
							idxV += 2;
							break;
						case 'P': // AM bzw. PM, je nach Stunde
							hours += (val.substr(idxV, 2) == 'PM' ? 12 : 0);
							break;
						case 'M': // Minuten einer Uhrzeit, zweistellig
							d.setMinutes(parseInt(val.substr(idxV, 2), 10));
							idxV += 2;
							break;
						case 's': // Sekunden einer Uhrzeit, zweistellig
							d.setSeconds(parseInt(val.substr(idxV, 2), 10));
							idxV += 2;
							break;
						case 'U': // Woche, in die der erste Sonntag des Jahres fällt
							// TODO
							break;
						case 'W': // Woche des Jahres. Zur Berechnung wird der europaweit gültige Algorithmus nach DIN 1355 angewandt
							// TODO
							break;
						case '%': // Das %-Zeichen selbst
							break;
						default: ;
					}
				}
				else
					idxV++;
				idxF++;
			}
			if(addYearDays > 0)
			{
				d.setMonth(0);
				d.setDate(1);
				d.setTime(d.getTime() + (addYearDays - 1) * 86400000);
			}
			d.setHours(hours);
			if(d.toString() == 'Invalid Date')
				return null;
			return d;
		}
		return null;
	},
	
	/**
	@memberof PDTools
	@function join
	@desc Wandelt ein Array in einen String um.
	@param {Array} arr Das umzuwandelnde Array.
	@param {string} sep Das zu benutzende Trennzeichen.
	@param {string} [mask='\'] Maskierungszeichen für das
	Trennzeichen.
	@return {string} Das Ergebnis.
	@see [split()]{@link PDTools#split}
	*/
	join : function(arr, sep, mask)
	{
		if(!mask)
			return arr.join(sep);
		var tmp = '';
		for(var i = 0; i < arr.length; i++)
		{
			var s = '' + (arr[i] || '');
			var pos = 0;
			while(pos < s.length)
			{
				pos = s.indexOf(sep, pos);
				if(pos < 0)
					break;
				s = s.substr(0, pos) + mask + s.substr(pos);
				pos += 2;
			}
			if(tmp)
				tmp += sep;
			tmp += s;
		}
		return tmp;
	},

	/**
	@memberof PDTools
	@function split
	@desc Zerlegt einen String anhand eines Trennzeichens
	in ein Array.
	@param {string} str Der zu zerlegende String.
	@param {string} sep Das Trennzeichen, an dem zerlegt
	werden soll.
	@param {string} [mask='\'] Maskierungszeichen für das
	Trennzeichen.
	@return {Arsay} Das Ergebnis.
	@see [join()]{@link PDTools#join}
	*/
	split : function(str, sep, mask)
	{
		if(!mask)
			return str.split(sep);
		var i = 0;
		var arr = [];
		var tmp = '';
		while(i < str.length)
		{
			if(str[i] == mask)
			{
				if(i + 1 < str.length && str[i + 1] == sep)
				{
					tmp += sep;
					++i;
				}
				else if(str[i + 1] == mask)
				{
					tmp += mask;
					++i;
				}
				++i;
				continue;
			}
			if(str[i] != sep)
				tmp += str[i];
			else
			{
				arr.push(tmp);
				tmp = '';
			}
			i++;
		}
		if(tmp || arr.length > 0) // auch einen Leereintrag am Ende einfuegen!
			arr.push(tmp);
		return arr;
	},

	/**
	@memberof PDTools
	@function compareNoSpace
	@desc Vergleich zweier Strings unter Nichtbeachtung von Weißraum am Anfang
	und Ende.
	@param {string} str1 Erster Vergleichsstring.
	@param {string} str2 Zweiter Vergleichsstring.
	@return {boolean} Die Funktion entfernt White Spaces am Anfang und am
	Ende der Zeichenketten und vergleicht die resultierenden Strings.
	Im Fall der Gleichheit gibt die Methode <code>true</code> zurück,
	sonst <code>false</code>.
	*/
	compareNoSpace : function(str1, str2)
	{
		return (str1.removeSpaces() == str2.removeSpaces());
	},

	/**
	@memberof PDTools
	@function removeSpaces
	@desc Entfernt Weißraum am Anfang und Ende des übergebenen Strings.
	@param {string} str
	@return {string}
	@example PDTools.removeSpaces("   abc    ") // returns "abc"
	*/
	removeSpaces : function(str)
	{
		return str.removeSpaces();
	},

	/**
	@memberof PDTools
	@function transcode
	@desc Wandeln Sie das Encoding einer Zeichenkette mit Hilfe dieser Methode
	von <code>srcEnc</code> in <code>destEnc</code> um.
	Folgende Zeichenkodierungen unterstützt die Funktion (die Namen der
	Kodierungen m¨ussen als Zeichenketten an die Methode übergeben werden):
	<ul>
		<li><code>Local</code>: Das auf dem System eingestellte Encoding. Auf
		Windows-Systemen ist dies meist Windows-1252, auf modernen
		Linux-Distributionen UTF-8.</li>
		<li><code>UTF-8</code>: Unicode-Zeichensatz in ASCII-kompatibler 8-Bit-Kodierung.</li>
		<li><code>ISO-8859-1</code>: Westeropäischer Zeichensatz ohne Euro-Zeichen.</li>
		<li><code>ISO-8859-15</code>: Westeropäischer Zeichensatz mit Euro-Zeichen.</li>
		<li><code>Windows-1252</code></li>
		<li><code>Windows-1250</code></li>
	</ul>
	@param {string} srcEnc Quell-Encoding.
	@param {string} text Der zu transkodierende Text.
	@param {string} destEnc Ziel-Encoding.
	@return {string} Rückgabewert der Methode ist die transkodierte Zeichenkette.
	@throws {PDException}
	@example
// um z. B. eine Zeichenkette vom Windows-1252-Encoding
// in UTF-8 umzuwandeln, rufen Sie die Methode wie folgt auf:
PDTools.transcode("Windows-1252", "Mein Text", "UTF-8");
	*/
	transcode : function(srcEnc, text, destEnc)
	{
		// TODO:
		// Hier gibt es ein Problem mit dem uebergebenen String, wenn er Umlaute enthaelt! Er kommt
		// dann auf der Server-Seite nicht an! Fehlt encodeURIComponent()? Ist aber ein POST-Request!
		// Per GET funktioniert die Uebergabe des Parameters. Allerdings kommt der String in der Non-
		// UnicodeApplication im Server lokal kodiert an, sodass die Transkodierung deshalb nicht
		// klappt. Geht transcode() in der Non-UnicodeApplication gar nicht?!? Ist vllt. auch nicht
		// sinnvoll.
		var pars = new JParamPacker(JafWebAPI.PDTools.transcode.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.transcode.PAR_srcEnc, (srcEnc || ''));
		pars.add(JafWebAPI.PDTools.transcode.PAR_src, (text || ''));
		pars.add(JafWebAPI.PDTools.transcode.PAR_destEnc, (destEnc || ''));
		var result = '';
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.transcode():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.transcode()");
				result = resp.getString(JafWebAPI.PDTools.transcode.PROP_res, '');
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: false,
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		return result;
	},

	/**
	@memberof PDTools
	@function isJEXFile
	@desc Prüft, ob die übergebene Datei eine gültige JEX-Datei ist.<br/>
	<span class="important">Hinweis:</span> Diese Funktion hat im JafWeb
	mangels Zugriff auf das lokale Dateisystem
	keine Implementierung!
	@param {string} name
	@throws {PDException}
	*/
	isJEXFile : function(name)
	{
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.isJEXFile(): Web apps are not able to access client-filesystem");
	},

	/**
	@memberof PDTools
	@function getCSVFields
	@desc Diese Methode dient zur Implementierung eines CSV-Imports. Sie ermittelt die
	Namen der Felder (Überschriften) einer CSV-Datei. An die Methode muss dazu
	der Dateiname sowie die Informationen über den Aufbau der CSV-Datei übergeben
	werden. Dazu dienen die drei Parameter <code>sep</code>, <code>delim</code>
	und <code>mask</code>.<br/>
	<span class="important">Hinweis:</span> Bitte beachten Sie, dass es sich hierbei um
	eine Datei <em>im Dateisystem des Anwendungs-Servers</em> handelt! Diese Funktion
	sollte aufgerufen werden, nachdem eine entsprechende, zu importierende CSV-Datei
	zum Server hochgeladen wurde.
	@param {string} fName Der Dateiname.
	@param {string} [sep=';'] Das Zeichen, das die einzelnen Datenfelder voneinander trennt.
	@param {string} [delim='"'] Das Zeichen, mit dem die zu importierenden Daten "geklammert"
	sind.
	@param {string} [mask='\\'] Das Maskierungszeichen, mit dem Klammerzeichen innerhalb der
	Feldwerte geschützt sind.
	@param {string} [newline='\x00D'] Das anzunehmende Zeilenumbruchzeichen.
	@param {boolean} [addEmpty=false] Fügt ggf. einen Leereintrag am Anfang der Spalten ein.
	@param {Function} [callback] Optionale Callback-Funktion. Falls angegeben, wird der
	Request asynchron ausgeführt und die Callback-Funktion mit dem beschriebenen
	Rückgabewert als Parameter aufgerufen.
	@return {string[]} Die Funktion gibt eine Liste mit den gefundenen Spaltenüberschriften
	zurück. Falls die Datei nicht geöffnet werden konnte oder falls es Formatfehler gibt,
	ist der Rückgabewert <code>null</code>.
	@throws {PDException}
	*/
	getCSVFields : function(fName, sep, delim, mask, newline, addEmpty, callback)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.getCSVFields.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.getCSVFields.PAR_fname, (fName || ''));
		pars.add(JafWebAPI.PDTools.getCSVFields.PAR_sep, (sep || ';'));
		pars.add(JafWebAPI.PDTools.getCSVFields.PAR_delim, (delim || '"'));
		pars.add(JafWebAPI.PDTools.getCSVFields.PAR_mask, (mask || '\\'));
		//pars.add(JafWebAPI.PDTools.getCSVFields.PAR_newline, (newline || '\x00D'));
		var result = [];
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.getCSVFields():\n"+resp.getResponseText());
				if(resp.hasError())
					throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDTools.getCSVFields()");
				result = resp.getArray(JafWebAPI.PDTools.getCSVFields.PROP_res, null, 'string', '');
				if(addEmpty && result)
					result.unshift("");
				if(typeof callback == 'function')
					callback(result);
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return result;
	},

	/// Zugriff auf das benutzerabhängige Property-System
	/**
	@memberof PDTools
	@function getPropertyValue
	@desc Liest den Wert eines Properties.
	@param {string} name Name des zu lesenden Properties.
	@return {string} Als Rückgabewert erhalten Sie den aktuellen Wert für den angemeldeten
	Benutzer. Falls das Property für den aktuellen Benutzer nicht definiert ist,
	erhalten Sie den Wert für den Benutzer <code>admin</code> (Benutzer mit der UID 0).
	Ist das Property auch dort nicht definiert, erhalten Sie eine leere Zeichenkette
	als Rückgabewert.
	*/
	getPropertyValue : function(name)
	{
		return this.PDClass.PDProperties.get('', name);
	},

	/**
	@memberof PDTools
	@function setPropertyValue
	@desc Mit Hilfe dieser Funktion setzen Sie den Wert eines Properties.
	@param {string} name Name des zu setzendes Properties.
	@param {string} value Wert, auf den das Property gesetzt werden soll.
	Bitte beachten Sie, dass Properties in der Datenbank immer als Zeichenkette abgelegt
	werden. Wenn Sie also eine Zahl oder einen booleschen Wert im Property
	ablegen, erhalten Sie später eine Zeichenkette zurück. Die maximale Länge eines
	Property-Werts liegt bei 255 Zeichen. Längere Werte werden abgeschnitten. Die
	maximale Länge des Property-Bezeichners liegt bei 80 Zeichen.
	*/
	setPropertyValue : function(name, value)
	{
		if(!name) return;
		if(name.length > 80)
			name = name.substr(0, 80);
		var v = '' + value;
		if(v.length > 255)
			v = v.substr(0, 255);
		this.PDClass.PDProperties.set('', name, v);
	},

	/**
	@memberof PDTools
	@function hasPropertyValue
	@desc Diese Funktion gibt <code>true</code> zurück, wenn das angegebene
	Property für den aktuell angegebenen Benutzer existiert.
	@param {string} name Der Property-Name.
	@return {boolean}
	*/
	hasPropertyValue : function(name)
	{
		return this.PDClass.PDProperties.contains('', name);
	},

	/**
	@memberof PDTools
	@function removePropertyValue
	@desc Diese Funktion entfernt das übergebene Property für den
	angemeldeten Benutzer.
	@param {string} name Der Property-Name.
	*/
	removePropertyValue : function(name)
	{
		this.PDClass.PDProperties.remove('', name);
	},
	
	/// Erzeugen von Debug-Ausgaben
	/**
	@memberof PDTools
	@function DEB
	@desc Erzeugt eine Debug-Ausgabe.
	@param {string} msg Die Ausgabe. Sämtliche Parameter werden in
	Zeichenketten umgewandelt und hintereinander ausgegeben.
	@throws {PDException}
	*/
	DEB : function(msg)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.DEB.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.DEB.PAR_info, (msg || ''));
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.DEB():\n"+resp.getResponseText());
				if(resp.hasError())
					JDebug(JDebug.ERROR, resp.getErrorMessage());
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: true,
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			} );
	},

	/**
	@memberof PDTools
	@function LEVEL
	@desc Diese Funktion erwartet als numerischen Parameter die auszugebenen
	Debug-Level. Die in JavaScript erzeugten Debug-Ausgaben befinden sich auf
	Level 16. Wenn Sie nur diese Ausgaben sehen möchten, lautet der Aufruf
	<code>PDTools.LEVEL(1 << 16)</code>.
	Wenn Sie keine Ausgaben erhalten möchten, geben Sie <code>0</code> als
	Parameter an. Mit <code>-1</code> erhalten Sie sämtliche Ausgaben.
	@param {number} level Der Debug-Level.
	@throws {PDException}
	*/
	LEVEL : function(level)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.LEVEL.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.LEVEL.PAR_sel, (level || 0));
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.LEVEL():\n"+resp.getResponseText());
				if(resp.hasError())
					JDebug.log(JDebug.ERROR, resp.getErrorMessage());
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: false,
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
	},

	/**
	@memberof PDTools
	@function DEBFILE
	@desc Diese Funktion erhält als Parameter den Namen der Datei, in die sämtliche
	Debug-Ausgaben mit <code>DEB()</code> geschrieben werden sollen.
	Wenn Sie diese Funktion nicht vor dem Aktivieren der Debug-Ausgaben aufrufen,
	erfolgen die Ausgaben auf der Server-Konsole.
	@param {string} fname Der Dateiname.
	@throws {PDException}
	*/
	DEBFILE : function(fname)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.DEBFILE.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.DEBFILE.PAR_name, (fname || ''));
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.DEBFILE():\n"+resp.getResponseText());
				if(resp.hasError())
					Ext.MessageBox.alert("DEBFILE", resp.getErrorMessage());
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: false,
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
	},

	/*
	@ignore(true)
	@memberof PDTools
	@function testResult
	@throws {PDException}
	*/
	testResult : function(val)
	{
		var pars = new JParamPacker(JafWebAPI.PDTools.testResult.eventName, this.PDClass);
		pars.add(JafWebAPI.PDTools.testResult.PAR_info, (val || ''));
		var pdClass = this.PDClass;
		var successFn = function(req, options)
			{
				var resp = new JResponse(req, options, pdClass);
				if(resp.hasFatalError())
					throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
							"PDTools.testResult():\n"+resp.getResponseText());
				if(!resp.hasFatalError())
				{
					if(resp.hasError())
						Ext.MessageBox.alert("testResult", resp.getErrorMessage());
				}
			};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "POST",
				async: true,
				params: pars.getPostParams(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
	},

	/**
	@memberof PDTools
	@function getFileContentAsString
	@throws {PDException}
	 */
	getFileContentAsString : function(val)
	{
		// TODO???
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.getFileContantAsString()");
	},

	/**
	@memberof PDTools
	@function runScriptFromFile
	@throws {PDException}
	 */
	runScriptFromFile : function(val)
	{
		// TODO???
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.runScriptFile()");
	},

	/**
	@memberof PDTools
	@function runWizardFromFile
	@throws {PDException}
	 */
	runWizardFromFile : function(val)
	{
		// TODO???
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.runWizardFromFile()");
	},

	/**
	@memberof PDTools
	@function makeDOCX
	@throws {PDException}
	 */
	makeDOCX : function(val)
	{
		// TODO???
		throw new PDException(PDException.ERROR, PDException.NOT_IMPLEMENTED_EXCEPTION,
				"PDTools.makeDOCX()");
	}
};


var PDIterator = Class.create();
/**
 * @class PDIterator
 * @desc Browser-seitige Repräsentation der Klasse <code>PDIterator</code>.
 * Für ein Objekt dieser Klasse wird auf der Server-Seite ein Iterator
 * offen gehalten, aus dem sich mit Aufrufen von <code>next()</code>
 * das jeweils nächste Objekt aus der Ergebnismenge holen lässt.<br/>
 * <span class="important">Hinweis:</span> Beachten Sie bitte, dass es im Regelfall günstiger ist, mit
 * <code>PDClass.getExtent()</code> bzw. <code>PDObject.getExtent()</code>
 * direkt die Objektmenge (nötigenfalls blockweise) zu holen. Gegenüber
 * diesen verursacht der <code>PDIterator</code> wesentlich mehr
 * Kommunikation.
 * @author Frank Fiolka
 */
PDIterator.prototype = 
{
	_iteratorId : 0,
	retcode: 0,
	PDClass: null,
			
	/**
	@constructs PDIterator
	@param {PDObject} rootObj (optional) Fachkonzeptobjekt, von dem aus über eine
	Beziehung iteriert werden soll. Falls stattdessen über einen
	Extent iteriert werden soll, entfällt dieser Parameter.
	@param {string} name Der Name der Fachkonzeptklasse, wenn es sich
	um einen Extent-Iterator handelt. Wenn stattdessen über eine Beziehung
	iteriert werden soll (Fachkonzeptobjekt als erster Paremter), handelt
	es sich hier um den Namen der Beziehung, über die iteriert werden
	soll.
	@param {string} filter (optional) JANUS-Filterausdruck, um die
	von dem Iterator gelieferte Ergebnismenge einzuschränken.
	@param {string} sort JANUS-Sortierausdruck.
	@param {PDObject} thisObj (optional) Fachkonzeptobjekt, das im Filterausdruck
	über das Schlüsselwort <code>this</code> referenziert werden kann.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	 */
	initialize : function(rootObj, name, filter, sort, thisObj, callback, pdClass)
	{
		this.PDClass = (pdClass || null);
		this._iteratorId = 0;
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDIterator.init.eventName, this.PDClass);
		var callbFn = null;
		var pos = 0;
		if(arguments.length > pos && typeof arguments[pos] == "object" &&
				(arguments[pos] instanceof PDObject))
		{
			pars.add(JafWebAPI.PDIterator.init.PAR_oid, arguments[pos].oid);
			pos++;
			if(arguments.length > pos && typeof arguments[pos] == "string")
			{
				pars.add(JafWebAPI.PDIterator.init.PAR_relname, arguments[pos]);
				pos++;
			}
			else
			{
				// Fehler: Beziehungsname fehlt
				throw new PDException(PDException.ERROR, "Relation name missing!", "PDIterator.init()");
			}
		}
		else if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			pars.add(JafWebAPI.PDIterator.init.PAR_clName, arguments[pos]);
			pos++;
		}
		else if(arguments.length > pos && typeof arguments[pos] == "number")
		{
			pars.add(JafWebAPI.PDIterator.init.PAR_cid, arguments[pos]);
			pos++;
		}
		// filter
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			pars.add(JafWebAPI.PDIterator.init.PAR_filter, arguments[pos]);
			pos++;
		}
		// sort
		if(arguments.length > pos && typeof arguments[pos] == "string")
		{
			pars.add(JafWebAPI.PDIterator.init.PAR_sort, arguments[pos]);
			pos++;
		}
		// thisObj
		if(arguments.length > pos && (arguments[pos] === null || (arguments[pos] instanceof PDObject)))
		{
			if(arguments[pos])
			{
				pars.add(JafWebAPI.PDIterator.init.PAR_thiscid, arguments[pos].cid);
				pars.add(JafWebAPI.PDIterator.init.PAR_thisoid, arguments[pos].oid);
			}
			pos++;
		}
		// callback
		if(arguments.length > pos && typeof arguments[pos] == "function")
		{
			callbFn = arguments[pos];
			pos++;
		}
		var id = 0;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDIterator.init():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDIterator.init()");
					id = resp.get(JafWebAPI.PDIterator.init.PROP_id, 0);
					this._iteratorId = id;
					this.retcode = (this._iteratorId > 0);
					if(typeof callbFn == 'function')
						callbFn(id);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callbFn == 'function')
					callbFn();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callbFn),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
	},
	
	/**
	@memberof PDIterator
	@function first
	@desc Gibt das erste Objekt zurück, auf das der Iterator
	zeigt.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Fachkonzeptobjekt.
	@throws {PDException}
	*/
	first : function(callback)
	{
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDIterator.first.eventName, this.PDClass);
		pars.add(JafWebAPI.PDIterator.first.PAR_id, this._iteratorId);
		var resObj = null;
		var ret = -1;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDIterator.first():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDIterator.first()");
					resObj = resp.getPDObject(JafWebAPI.PDIterator.first.PROP_obj);
					ret = resp.getInt(JafWebAPI.PROP_retCode, -1);
					this.retcode = ret;
					if(typeof callback == 'function')
						callback(resObj);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return resObj;
	},
	
	/**
	@memberof PDIterator
	@function next
	@desc Gibt das jeweils nächste Objekt zurück, auf das der
	Iterator zeigt. Falls diese Funktion zum ersten Mal
	aufgerufen wird, wird das erste Objekt zurückgegeben.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {PDObject} Das Fachkonzeptobjekt.
	@throws {PDException}
	*/
	next : function(callback)
	{
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDIterator.next.eventName, this.PDClass);
		pars.add(JafWebAPI.PDIterator.next.PAR_id, this._iteratorId);
		var resObj = null;
		var ret = -1;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDIterator.next():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDIterator.next()");
					resObj = resp.getPDObject(JafWebAPI.PDIterator.next.PROP_obj);
					ret = resp.getInt(JafWebAPI.PROP_retCode, -1);
					this.retcode = ret;
					if(typeof callback == 'function')
						callback(resObj);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return resObj;
	},
	
	/**
	@memberof PDIterator
	@function isValid
	@desc Fragt ab, ob der Iterator auf der Server-Seite noch
	gültig ist.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {boolean} <code>true</code> falls ja, sonst
	<code>false</code>.
	@throws {PDException}
	 */
	isValid : function(callback)
	{
		if(this._iteratorId <= 0)
			return false;
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDIterator.isValid.eventName, this.PDClass);
		pars.add(JafWebAPI.PDIterator.isValid.PAR_id, this._iteratorId);
		var ret = false;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDIterator.isValid():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDIterator.isValid()");
					ret = resp.getBool(JafWebAPI.PDIterator.isValid.PROP_result, false);
					this.retcode = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(typeof callback == 'function')
						callback(ret);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return ret;
	},
	
	/**
	@memberof PDIterator
	@function size
	@desc Gibt die Anzahl der ERgebnisobjekte zurück.
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@return {number} Die Anzahl oder <code>-1</code>, wenn
	sie nicht ermittelt werden konnte.
	@throws {PDException}
	*/
	size : function(callback)
	{
		if(this._iteratorId <= 0)
			return false;
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDIterator.size.eventName, this.PDClass);
		pars.add(JafWebAPI.PDIterator.size.PAR_id, this._iteratorId);
		var ret = -1;
		var count = -1;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDIterator.size():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDIterator.size()");
					ret = resp.getInt(JafWebAPI.PROP_retCode, -1);
					this.retcode = ret;
					count = resp.getInt(JafWebAPI.PDIterator.size.PROP_total, -1);
					if(typeof callback == 'function')
						callback(count);
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return count;
	},
	
	/**
	@memberof PDIterator
	@function close
	@desc Schließt den Iterator wieder.<br/>
	<span class="important">Hinweis:</span> Es ist eminant wichtig, nach der Benutzung des Iterators
	diese Funktion aufzurufen, damit die Ressourcen und vor allem die
	Repräsentation auf der Server-Seite wieder abgeräumt werden!
	@param {Function} callback Optionale Callback-Funktion, die
	nach Verarbeitung der Antwort aufgerufen werden soll. Wird
	diese angegeben, erfolgt der Request-Aufruf <em>asynchron</em>
	und das Ergebnis wird an die Callback-Funktion übergeben. Fehlt
	dieser Parameter, erfolgt der Aufruf <em>synchron</em> und das
	Ergebnis wird direkt zurückgegeben.
	@throws {PDException}
	*/
	close : function(callback)
	{
		this.retcode = 0;
		var pars = new JParamPacker(JafWebAPI.PDIterator.close.eventName, this.PDClass);
		pars.add(JafWebAPI.PDIterator.close.PAR_id, this._iteratorId);
		var ret = -1;
		var pdClass = this.PDClass;
		var successFn = function(req, options)
				{
					var resp = new JResponse(req, options, pdClass);
					if(resp.hasFatalError())
						throw new PDException(PDException.FATAL, "Request got empty or invalid response!",
								"PDIterator.close():\n"+resp.getResponseText());
					if(resp.hasError())
						throw new PDException(PDException.ERROR, resp.getErrorMessage(), "PDIterator.close()");
					ret = resp.getInt(JafWebAPI.PROP_retCode, -1);
					if(ret == 0)
						this._iteratorId = 0;
					this.retcode = ret;
					if(typeof callback == 'function')
						callback();
				};
		var failureFn = function(response, opts) {
				JDebug.log(JDebug.ERROR, "Network communication error in " + pars.getEventName() + "!");
				if(typeof callback == 'function')
					callback();
			};
		JafWeb.ajaxRequest({
				url: this.PDClass.getURL(),
				authToken: this.PDClass.getAuthToken(),
				method: "GET",
				async: (!!callback),
				params: pars.get(),
				callerName: pars.getEventName(),
				disableCaching: true,
				success: successFn,
				failure: failureFn
			});
		if(!callback)
			return ret;
	}
};

JafWeb.createNamespace('JafWeb.PD');
/**
 * Lädt die PD-Schicht des JafWeb.<br/>
 * Dabei ist es möglich, das JafWeb mehrfach zu instantiieren, um zu
 * PD-Objektwelten mehrere Server zu verbinden. Geben Sie dazu einen
 * Instanznamen (Konfigurations-Property <code>instanceName</code>) an,
 * der quasi die Rolle eines Namespaces spielt.<br/>
 * <b>Beispiel:</b>:
<pre class="prettyprint"><code>JafWeb.loadPD({
		instanceName: 'PD1',
		rootURL: 'janus',
		downloadURL: 'download',
		uploadURL: 'upload',
		authToken: '123456789',
		usePDObjectCache: true
	});</code></pre>
 * Auf jede so gebildete Instanz können Sie zugreifen
 * <ul>
 * <li>indem Sie die Rückgabe dieser Funktion in einer Variablen speichern
 * und diese benutzen, oder</li>
 * <li>über den angegebenen Namen innerhalb des globalen Namespaces {@link JafWeb}.</li>
 * </ul>
 * <b>Beispiel:</b>:
<pre class="prettyprint"><code>JafWeb.Elevator1.PDClass.ptr('Landing', 1007);</code></pre>
 * Anders als bisher müssen Sie in dieser Verwendung alle für die Verbindung
 * benötigten Parameter - wie URLs und ggf. Authentifizierungs-Token - beim
 * Erzteugen der Instanz angeben.<br/>
 * Für die Kompatibilität mit der bisherigen Verwendung werden die
 * nicht belegten Konfigurations-Properties aus den entsprechenden
 * Angaben bei {@link UIApplication} belegt.<br/>
 * <span class="important">Wichtige Hinweise:</span>
 * <ul>
 * <li>Beachten Sie bitte, dass im Falle mehrerer Instanzen <em>jede einzelne</em> mit
 * einem eindeutigen Instanznamen erzeugt werden muss. Der Zugriff
 * über die globalen Singletons ist dann nicht möglich und verursacht
 * JavaScript-Fehler!</li>
 * <li>Jede der Instanzen benutzt eine von den anderen fachlich getrennte
 * Objektwelt, die auf keinen Fall vermischt werden dürfen (die Objekt-IDs
 * sind nur innerhalb einer Instanz eindeutig)! Zuweisungen zwischen Objekten
 * verschiedener Instanzen dürfen ausschließlich auf String-Basis erfolgen!</li>
 * <li>Falls Sie die Klasse {@link PDIterator} verwenden möchten (vgl. dagegen
 * aber die Hinweise dort), können Sie das nicht direkt, sondern müssen den
 * Iterator durch Aufruf von [PDClass.createIterator()]{@link PDClass#createIterator}
 * der jeweiligen PD-Instanz erzeugen.</li>
 * <li>Fachkonzeptobjekte {@link PDObject} werden ohnehin nur über die zugehörige
 * {@link PDClass} verwaltet. Gleiches gilt für {@link PDGroupInfo}.</li>
 * </ul>
 *
 * @param {Object} config Properties des Konfigurationsobjekts:
 * <ul>
 * <li><code>instanceName</code> (string) Instanzname. Kann auch leer bleiben,
 * um eine globale Instanz zu erzeugen.</li>
 * <li><code>rootURL</code> (string) Die in der erzeugten Instanz von
 * AJAX-Requests zu verwendende URL. Falls nicht angegeben,
 * wird die aus [PDClass.getURL()]{@link UIApplication#getUrlRoot}
 * verwendet.</li>
 * <li><code>downloadURL</code> (string) Die für Downloads zu verwendende
 * URL. Falls nicht angegeben, wird die aus
 * [UIApplication.getDownloadURL()]{@link UIApplication#getDownloadURL}
 * benutzt.</li>
 * <li><code>uploadURL</code> (string) Die URL für Datei-Uploads. Falls
 * nicht angegeben, wird dies aus
 * [UIApplication.getUploadURL()]{@link UIApplication#getUploadURL}
 * verwendet.</li>
 * <li><code>authToken</code> (string) Authentifizierungs-Token, falls über
 * Token im Request-Header authentifiziert wird. Wenn nicht angegeben,
 * wird das aus [UIApplication.getAuthToken()]{@link UIApplication#getAuthToken}
 * belegt.</li>
 * <li><code>usePDObjectCache</code> (boolean) Gibt an, ob die PD-Schnittstelle
 * die geholten Fachkonzeptobjekte lokal speichern und wiederverwenden soll.
 * (Standardwert: <code>true</code>)</li>
 * </ul>
 * @return {PDClassClass} Die erzeugte {@link PDClass}-Instanz.
 */
JafWeb.loadPD = function(config)
{
	var url = (config ? config['rootURL'] : UIApplication.getUrlRoot());
	var dwnlUrl = (config ? config['downloadURL'] : UIApplication.getDownloadURL());
	var uplUrl = (config ? config['uploadURL'] : UIApplication.getUploadURL());
	var authToken = (config ? config['authToken'] : UIApplication.getAuthToken());
	var logoutEvt = (config ? config['logoutEvent'] : UIApplication.getLogoutEvent());
	var useCache = (config ? config['usePDObjectCache'] : true);
	// Standardverhalten, wie bisher: Nur eine, glonale Instanz:
	if(!config || !config['instanceName'])
	{
		// abwaertskompatibel!
		window.PDClass = new PDClassClass(url, dwnlUrl, uplUrl, authToken, logoutEvt, useCache);
		window.PDMeta = new PDMetaClass(window.PDClass);
		window.ClientInfo = new ClientInfoClass(window.PDClass);
		window.PDProperties = new PDPropertiesClass(false, window.PDClass);
		window.PDTools = new PDToolsClass(window.PDClass);
		// miteinander bekannt machen
		window.PDClass.PDMeta = window.PDMeta;
		window.PDClass.ClientInfo = window.ClientInfo;
		window.PDClass.PDProperties = window.PDProperties;
		window.PDClass.PDTools = window.PDTools;
		return window.PDClass;
	}
	// Separate Instanz:
	var pdClass = new PDClassClass(url, dwnlUrl, uplUrl, authToken, logoutEvt, useCache);
	var pdMeta = new PDMetaClass(pdClass);
	var clientInfo = new ClientInfoClass(pdClass);
	var pdProperties = new PDPropertiesClass(false, pdClass);
	var pdTools = new PDToolsClass(pdClass);
	// miteinander bekannt machen
	pdClass.PDMeta = pdMeta;
	pdClass.ClientInfo = clientInfo;
	pdClass.PDProperties = pdProperties;
	pdClass.PDTools = pdTools;
	JafWeb[config.instanceName] = {};
	JafWeb[config.instanceName].PDClass = pdClass;
	JafWeb[config.instanceName].ClientInfo = clientInfo;
	JafWeb[config.instanceName].PDMeta = pdMeta;
	JafWeb[config.instanceName].PDTools = pdTools;
	JafWeb[config.instanceName].PDProperties = pdProperties;
	// Ankerklasse ist die Instanz von PDClassClass
	return JafWeb[config.instanceName];
}
