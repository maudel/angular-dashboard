// Namespace deklarieren
/**
 * @namespace
 */
var JafWeb = (JafWeb || {});

// Browser detection - internal
JafWeb.getWebBrowserType = function() {
		var Sys = {
				name: '',
				version: 0
			};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		if(s = ua.match(/msie ([\d.]+)/))
		{
			Sys.name = 'IE';
			Sys.version = parseInt(s[1], 10);
			if(Sys.version > 11)
				Sys.name = 'Edge';
		}
		else if(s = ua.match(/edge\/((\d+)?[\w\.]+)/))
		{
			Sys.name = 'IE';
			Sys.version = parseInt(s[1], 10);
			if(Sys.version > 11)
				Sys.name = 'Edge';
		}
		else if(s = ua.match(/firefox\/([\d.]+)/))
		{
			Sys.name = 'Firefox';
			Sys.version = parseInt(s[1], 10);
		}
		else if(s = ua.match(/chrome\/([\d.]+)/))
		{
			Sys.name = 'Chrome';
			Sys.version = parseInt(s[1], 10);
		}
		else if(s = ua.match(/opera.([\d.]+)/))
		{
			Sys.name = 'Opera';
			Sys.version = parseInt(s[1], 10);
		}
		else if(s = ua.match(/version\/([\d.]+).*safari/))
		{
			Sys.name = 'Safari';
			Sys.version = parseInt(s[1], 10);
		}
		else if(s = ua.match(/trident.+rv[:\s]([\w\.]+).+like\sgecko/))
		{
			Sys.name = 'IE';
			Sys.version = parseInt(s[1], 10);
			if(Sys.version > 11)
				Sys.name = 'Edge';
		}
		return Sys;
	};

/**
 * Läuft das JafWeb im Internet Explorer (IE)?
 * @return {number} Falls ja, wird die Versionsnummer
 * zurückgegeben, sonst 0.
 */
JafWeb.isIE = function() {
		var t = this.getWebBrowserType();
		return (t.name == 'IE' ? t.version : 0);
	};

/**
 * Läuft das JafWeb im Internet Explorer (IE)?
 * @return {number} Falls ja, wird die Versionsnummer
 * zurückgegeben, sonst 0.
 */
JafWeb.isEdge = function() {
		var t = this.getWebBrowserType();
		return (t.name == 'Edge' ? t.version : 0);
	};

/**
 * Läuft das JafWeb im Firefox?
 * @return {number} Falls ja, wird die Versionsnummer
 * zurückgegeben, sonst 0.
 */
JafWeb.isFirefox = function() {
		var t = this.getWebBrowserType();
		return (t.name == 'Firefox' ? t.version : 0);
	};

/**
 * Läuft das JafWeb in Chrome?
 * @return {number} Falls ja, wird die Versionsnummer
 * zurückgegeben, sonst 0.
 */
JafWeb.isChrome = function() {
		var t = this.getWebBrowserType();
		return (t.name == 'Chrome' ? t.version : 0);
	};

/**
 * Läuft das JafWeb im Safari?
 * @return {number} Falls ja, wird die Versionsnummer
 * zurückgegeben, sonst 0.
 */
JafWeb.isSafari = function() {
		var t = this.getWebBrowserType();
		return (t.name == 'Safari' ? t.version : 0);
	};

/**
 * Läuft das JafWeb in Opera?
 * @return {number} Falls ja, wird die Versionsnummer
 * zurückgegeben, sonst 0.
 */
JafWeb.isOpera = function() {
		var t = this.getWebBrowserType();
		return (t.name == 'Opera' ? t.version : 0);
	};


//
// IE Closure Leaks vermeiden
//
/*Function.prototype.closure = function() {
		if(!window.__funcs)
			window.__funcs = [ ];
		window.__funcs.push(this);
		return function() {
				return window.__funcs[window.__funcs.length - 1].apply(null, arguments);
			};
	};
*/

// Spezial-Methode, um "richtige Vererbung" zu 
// ermoeglichen (credits to Bob Clary and
// Nicholas C. Zakas - http://www.sitepoint.com/print/javascript-objects...)
/*Object.prototype.extendsClass = function(oSuper)
{
	for(sProperty in oSuper)
	{
		if(sProperty != "extendsClass")
			this[sProperty] = oSuper[sProperty];
	}
}*/
// Anm.: Mehrfachvererbung ist damit auch moeglich!

var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

/**
 * Namespace(s) erzeugen, falls nicht vorhanden.
 * @param {string} namespace Die Namespace-Bezeichnung - ein
 * bis N, untereinander durch Punkt verkettete Namespace-Namen.
 * @example
JafWeb.createNamespace("JafWeb.MeinNamespace");
JafWeb.MeinNamespace.meineFunktion = function() {
		...
	};
 */
JafWeb.createNamespace = function(namespace) {
    var nsparts = namespace.split(".");
    var prnt = JafWeb;
 
    // we want to be able to include or exclude the root namespace 
    // So we strip it if it's in the namespace
    if (nsparts[0] === "JafWeb") {
        nsparts = nsparts.slice(1);
    }
 
    // loop through the parts and create 
    // a nested namespace if necessary
    for (var i = 0; i < nsparts.length; i++) {
        var partname = nsparts[i];
        // check if the current parent already has 
        // the namespace declared, if not create it
        if (typeof prnt[partname] === "undefined") {
            prnt[partname] = {};
        }
        // get a reference to the deepest element 
        // in the hierarchy so far
        prnt = prnt[partname];
    }
    // the parent is now completely constructed 
    // with empty namespaces and can be used.
    return prnt;
};

//
// IE Closure Leaks vermeiden
//
/*Function.prototype.closure = function() {
		if(!window.__funcs)
			window.__funcs = [ ];
		window.__funcs.push(this);
		return function() {
				return window.__funcs[window.__funcs.length - 1].apply(null, arguments);
			};
	};
*/

/**
 * Fragt ab, ob das Dokument vollständig geladen, d.h. der
 * DOM-Baum aufgebaut wurde.
 * @return {boolean}
 */
JafWeb.isDocumentReady = function()
{
	throw "isDocumentReady not implemented (adapter missing)!";
}

/**
 * @desc AJAX-Request ohne Library-Abhängigkeit.
 * @param {Object} cfg Konfiguration. Properties:
 <ul>
	<li><code>url</code>: Die URL, typischerweise die mit
		[UIApplication.getUrlRoot()]{@link UIApplication#getUrlRoot}
		ermittelte.</li>
	<li><code>method</code>: "GET" oder "POST". Beachten Sie aber,
		dass bei der GET-Methode die URL inkl. der angehängten Parameter
		längenbegrenzt ist!</li>
	<li><code>async</code> (boolean) Legt fest, ob synchron oder
		asynchron ausgeführt werden soll. Vgl. dazu
		{@tutorial tut_ajaxRequest}, Abschnitt
		"Synchrone vs. asynchrone Ausführung".</li>
	<li><code>params</code>: Die Parameter, typischerweise die
		Rückgabe von [JParamPacker.get()]{@link JParamPacker#get}.</li>
	<li><code>scope</code>: Scope, in dem die Callback-Funktionen
		ausgeführt werden sollen.</li>
	<li><code>callerName</code>: Angabe der aufrufenden Funktion
		zu Debug-Zwecken, typischerweise
		[JParamPacker.getEventName()]{@link JParamPacker#getEventName}.</li>
	<li><code>disableCaching</code> (boolean)</li>
	<li><code>success</code>: Callback-Funktion für den Erfolgsfall.</li>
	<li><code>failure</code>: Callback-Funktion für den Fehlerfall.</li>
	<li><code>dataType</code>: Erwartetes Antwortformat
		('json'|'html'|'text', Standard: 'json'). Wenn der Server
		absichtlich kein gültiges JSON liefert, weil Sie den ResponseText
		selbst interpretieren möchten, müssen Sie hier unbedingt
		'text' angeben, sonst schlägt der Request fehl!</li>
	<li><code>authToken</code>: Authentifizierungs-Token, falls über
		Token im Request-Header authentifiziert wird.</li>
 </ul>
 @see {@tutorial tut_ajaxRequest}
 */
JafWeb.ajaxRequest = function(cfg)
{
	throw "No AJAX request method implemented (adapter missing)!";
};

/**
 * Handler, mit dem das Absetzen eines AJAX-Requests
 * unterbunden werden kann.
 * @param {Object} cfg Konfiguration. Properties siehe
 * [ajaxRequest()]{@link JafWeb#ajaxRequest}.
 * @return {Mixed} Um den Request zu unterbinden, geben
 * Sie <code>false</code> zurück; in diesem Fall wird die
 * mit dem <code>cfg</code>-Objekt übergebene Fehlerfunktion
 * aufgetufen. In allen anderen Fällen wird der Request
 * ausgeführt.<br/>
 * @example
JafWeb.onAjaxRequest = function(cfg)
	{
		if(myApplication.isOffline())
			return false;
	}
 */
JafWeb.onAjaxRequest = function(cfg) { };

/**
 * @desc Kopiert alle Properties von <code>cfg</code> nach <code>obj</code>.
 * @param {Object} obj In dieses Objekt werden die Properties kopiert.
 * @param {Object} cfg Objekt mit den zu kopierenden Properties.
 * @param {Object} defaults Optionales Objekt mit Vorgabewerten.
 * @return {Object} Das resultierende Objekt wird zurückgegeben.
 */
JafWeb.apply = function(obj, cfg, defaults)
{
    // no "this" reference for friendly out of scope calls
    if(defaults)
	{
        apply(obj, defaults);
    }
    if(obj && cfg && typeof cfg == 'object')
	{
        for(var p in cfg)
		{
            obj[p] = cfg[p];
        }
    }
    return obj;
};

/**
 * @desc Ermittelt, ob der übergebene Wert von einem
 * einfachen Datentyp ist.
 * @param {mixed} val Der zu prüfende Wert.
 * @return {boolean} <code>true</code>, falls einfacher Datentyp.
 */
JafWeb.isPrimitive = function(val)
{
	var t = (typeof val);
	return (t == 'bioolean' || t == 'number' || t == 'string');
};

/**
 * @desc Ermittelt, ob der übergebene Wert ein Array ist.
 * @param {mixed} obj Der zu prüfende Wert.
 * @return {boolean} <code>true</code>, falls Array.
 */
JafWeb.isArray = function(obj)
{
	return (typeof obj == 'object' &&
			Object.prototype.toString.call(obj) == '[object Array]'); // ECMAScript-Standard
};

/**
 * Ermittelt, ob es sich bei dem übergebenen Objekt um
 * ein {@link PDObject} handelt.
 * @return {boolean} <code>true</code>, wenn <code>obj</code>
 * ein gültiges {@link PDObject} ist.
 */
JafWeb.isPDObject = function(obj)
{
	return (obj && (typeof obj == 'object') && (typeof obj['classname'] == 'string') &&
			(typeof obj['cid'] == 'number') && (typeof obj['oidLow'] == 'number') &&
			(typeof obj['PDClass'] == 'object'));
	//return ((typeof obj == 'object') && (obj instanceof PDObject) &&
	//		(obj['PDClass'] instanceof PDClassClass));
};

/**
 *
 * @tparam obj
 * @treturn String
 */
JafWeb.encode = function(obj)
{
	return JSON.stringify(obj);
};

/**
 * @desc Deserialisiert aus dem übergebenen JSON-String
 * das Objekt. Entspricht normalerweise
 * <code>JSON.parse()</code>.
 * @param {string} str Gültiger JSON-String.
 * @return {Object} Das Objekt. Beachten Sie bitte, dass
 * auf diese Weise keine Instantiierung von einer
 * bestimmten "Klasse" erfolgt.
 */
JafWeb.decode = function(str)
{
	return JSON.parse(str);
};

// Methode, um das Fehlen des instanceof-Operators in JavaScript
// auszugleichen
function instanceOf(object, constructorFunction)
{
	while (object != null)
	{
		if (object == constructorFunction.prototype)
			return true;
		object = object.__proto__;
	}
	return false;
}

// String-Erweiterungen
// (vgl. Prototype-Bibliothek)
/**
 * JavaScript-Klasse String.
 * @external String
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String|String}
 */
/**
 @function external:String#escapeHTML
 @desc Maskiert HTML-Tags durch die entsprechenden Entities,
 so dass sie in HTML-Kontext sichtbar angezeigt werden.
 @return {string} Der Ergebnis-String.
 @see [unescapeHTML()]{@link String#unescapeHTML}
 */
String.prototype.escapeHTML = function()
	{
		return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	};

/**
 @function external:String#unescapeHTML
 @desc Macht die Maskierung von HTML-Tags rückgängig.
 @return {string} Der Ergebnis-String.
 @see [escapeHTML()]{@link String#escapeHTML}
 */
String.prototype.unescapeHTML = function()
	{
		return this.removeTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').
				replace(/&Auml;/g, 'Ä').replace(/&Ouml;/g, 'Ö').replace(/&Uuml;/g, 'Ü').
				replace(/&auml;/g, 'ä').replace(/&öuml;/g, 'ö').replace(/&uuml;/g, 'ü').replace(/&szlig;/g, 'ß').
				replace(/&amp;/g,'&');
	};

/**
 @function external:String#removeSpaces
 @desc Entfernt Weißraum am Anfang und Ende des Strings.
 @return {string} Der bereinigte String.
 */
String.prototype.removeSpaces = function()
	{
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	};

/**
 @function external:String#removeTags
 @desc Entfernt HTML-Auszeichnungen.
 @return {string} Der um die Auszeichnungen bereinigte String.
 */
String.prototype.removeTags = function()
	{
		return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
	};


/**
 @function external:String#toXmlValue
 @desc Konvertiert den String in gültiges XML.
 @return {string} Der konvertierte String.
 */
String.prototype.toXmlValue = function()
	{
		return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	};


/**
 @function external:String#toXmlAttributeValue
 @desc Konvertiert den String in einen gültigen XML-Attributwert.
 @return {string} Der konvertierte String.
 */
String.prototype.toXmlAttributeValue = function()
	{
		return this.replace(/&/g,'&amp;').replace(/'/g,'&apos;').replace(/"/g,'&quot;');
	};

/**
 @function external:String#appendXmlAttribute
 @desc Hängt ein XML-Attribut an den String an.
 @param {string} name Der Attributname. Muss ein XML-konformer Attribtname sein.
 @param {string} value Der Attributwert. Die Konvertierung erfolgt automatisch.
 @return {string} Der konvertierte String.
 */
String.prototype.appendXmlAttribute = function(name, value)
	{
		return this+' '+name+'="'+value.toXmlAttributeValue()+'"';
	};

/**
 @function external:String#addIndent
 @desc Hängt Einzug an den String an.
 @param {number} count Anzahl Tabs, die eingezogen werden soll.
 @return {string} Der um den Einzug verlängerte String.
 */
String.prototype.addIndent = function(count)
	{
		var tmp = '';
		{
			for(var i=0; i<count; i++)
				tmp += '\t';
		}
		return this+tmp;
	};

/**
 @function external:String#insert
 @desc Einen String an einer bestimmten Stelle in den
 aktuellen String einfügen.
 @param {string} what Der einzufügende String.
 @param {number} pos Position, an der eingefügt werden
 soll. Falls die Position nach dem Ende des Strings liegt,
 wird stattdessen angehängt.
 @return {string} Der Ergebnis-String.
 */
String.prototype.insert = function(what, pos)
	{
		// wir tolerieren auch umgekehrte Parameterangabe
		if(typeof what == 'number' && typeof pos == 'string')
		{
			var tmp = what;
			what = pos;
			pos = tmp;
		}
		if(pos >= this.length)
			return this + what;
		return this.substr(0, pos) + what + this.substr(pos);
	};

/**
 @function external:String#lastIndexOf
 @desc Ermittelt das letzte Auftreten eines Zeichens in dem String.
 @param {string} ch Das gesuchte Zeichen.
 @return {number} Position des letzten Auftretens oder -1, wenn es
 gar nicht vorkommt.
 */
String.prototype.lastIndexOf = function(ch)
	{
		var i = this.length - 1;
		while(i >= 0)
		{
			if(this.charAt(i) == ch)
				return i;
			i--;
		}
		return -1;
	};

/**
 @function external:String#replaceAll
 @desc Ersetzt alle Vorkommen des Strings <code>find</code>
 durch den String <code>replace</code>.
 @param {string} find Der zu ersetzende String.
 @param {string} replace Der einzusetzende String.
 @return {string} Das Resultat.
 */
String.prototype.replaceAll = function(find, replace)
	{
		var pos = 0;
		var txt = this;
		while(pos = txt.indexOf(find) >= 0)
			txt = txt.replace(find, replace, pos);
		return txt;
	};
	
/**
 * JavaScript-Klasse Array.
 * @external Array
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array|Array}
 */
/**
 @function external:Array#clone
 @desc Clone-Funktion für Arrays.
 @param {boolean} recursive Zeigt an, dass das Klonen rekursiv
 durch alle enthaltenen Arrays erfolgen soll. Standardwert
 ist <code>true</code>.
 @return {Array} Das neu erzeugte Array.
 */
Array.prototype.clone = function(recursive)
	{
		var arr = [ ];
		for(var i=0; i < this.length; i++)
		{
			if(false !== recursive && JafWeb.isArray(this[i]))
				arr.push(this[i].clone(true));
			else
				arr.push(this[i]);
		}
		return arr;
	};

// Erweiterungen des Datentyps Date
/**
 * JavaScript-Klasse Date.
 * @external Date
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date|Date}
 */
/**
 * @function external:Date#isValid
 * @desc Fragt auf einem Date-Objekt ab, ob es ein
 * gültiges Datum enthält.
 * @return {boolean} Gültig oder nicht.
 */
Date.prototype.isValid = function()
	{
		// Date gibt im Fall ungueltigen Datums bei getTime()
		// NaN zurueck.
		return (!Number.isNaN(this.getTime()));
	};

/**
 * @function external:Date#ext2janusFormat
 * @static
 * @desc Ein Ext-spezifisches Datumsformat in eines
 * für JANUS umwandeln.
 * @param {string} extF Das ExtJS-Format.
 * @return {string} Das JANUS-Format.
 */
Date.ext2janusFormat = function(extF)
	{
		var res = "";
		var i=0;
		while(i < extF.length)
		{
			switch(extF.charAt(i))
			{
				case 'l': res += "%a"; break;
				case 'D': res += "%A"; break;
				case 'M': res += "%b"; break;
				case 'F': res += "%B"; break;
				case 'Y': res += "%Y"; break;
				case 'y': res += "%y"; break;
				case 'm': res += "%m"; break;
				case 'd': res += "%d"; break;
				case 'z': res += "%j"; break;
				case 'N': res += "%w"; break;
				case 'H': res += "%h"; break;
				case 'h': res += "%i"; break;
				case 'a': res += "%p"; break;
				case 'A': res += "%P"; break;
				case 'i': res += "%M"; break;
				case 's': res += "%s"; break;
				//case 'U': res += ""; break; // unbekannt
				case 'W': res += "%W"; break;
				case '%': res += "%%"; break;
				default:
					// Rest einfach anhaengen
					res += extF.charAt(i);
			}
			i++;
		}
		return res;
	};
	
/**
 * @function external:Date#janus2extFormat
 * @static
 * @desc Ein JANUS-spezifisches Datumsformat in eines
 * für Ext umwandeln.
 * @param {string} jF Das JANUS-Format.
 * @return {string} Das ExtJS-Format.
 */
Date.janus2extFormat = function(jF)
	{
		var res = "";
		var i=0;
		while(i < jF.length)
		{
			if(jF.charAt(i) == '%')
			{
				i++;
				if(i >= jF.length) break;
				switch(jF.charAt(i))
				{
					case 'a': res += "l"; break;
					case 'A': res += "D"; break;
					case 'b': res += "M"; break;
					case 'B': res += "F"; break;
					case 'Y': res += "Y"; break;
					case 'y': res += "y"; break;
					case 'm': res += "m"; break;
					case 'd': res += "d"; break;
					case 'j': res += "z"; break;
					case 'w': res += "N"; break;
					case 'h': res += "H"; break;
					case 'i': res += "h"; break;
					case 'p': res += "a"; break;
					case 'P': res += "A"; break;
					case 'M': res += "i"; break;
					case 's': res += "s"; break;
					case 'U': res += ""; break; // unbekannt
					case 'W': res += "W"; break;
					case '%': res += "%"; break;
					default: ;
				}
			}
			else
				res += jF.charAt(i);
			i++;
		}
		return res;
	};
	
/**
 * @function external:Date#isValidDate
 * @static
 * @desc Für einen String prüfen, ob er ein gültiges
 * Datum enthält. Es wird das aktuell gültige
 * JANUS-Datumsformat benutzt.
 * @param {string} dateString Der zu prüfende Datums-String.
 * @param {boolean} exactMatch Zeigt an, ob der String exakt
 * dem Format folgen soll oder auch Annäherungen toleriert
 * werden sollen, die in einem JANUS-Filterausdruck
 * auch akzeptiert würden. Falls das Format z.B. zweistellige
 * Monatstage vorschreibt, kann hiermit angezeigt werden,
 * dass auch einstellige Angaben akzeptiert werden sollen.
 * Standardwert: <code>false</code>.
 * @return {boolean} <code>true</code>, falls gültig, sonst
 * <code>false</code>.
 */
Date.isValidDate = function(dateString, exactMatch)
	{
		if(!dateString)
			return false;
		var dFmt = this.janus2extFormat(UIApplication.getDateFormat());
		var d = Date.parseDate(dateString, dFmt, true);
		if(d)
			return true;
		var year4digit = (dFmt.indexOf('Y') >= 0);
		// wenn !exactMatch, auch einstellige Angaben erlauben
		if(true !== exactMatch)
		{
			// TODO: Wochentagsangaben raus
			// einstellige statt zweistelliger Angaben (d -> j, m -> n, h -> g)
			dFmt = dFmt.replace(/d/g, 'j').replace(/m/g, 'n').replace(/h/g, 'g');
			d = Date.parseDate(dateString, dFmt, true);
			if(d)
				return true;
			// Jahr auch zweistellig erlauben (Y -> y).
			// Y und y schliessen sich im Ext-Format
			// gegenseitig aus!
			d = Date.parseDate(dateString, (year4digit ? dFmt.replace(/Y/g,'y') : dFmt.replace(/y/g,'Y')), true);
			if(d)
				return true;
		}
		return false;
	};
	
/**
 * @function external:Date#isValidTime
 * @static
 * @desc Für einen String prüfen, ob er eine gültige
 * Uhrzeit enthält. Es wird das aktuell gültige
 * JANUS-Zeitformat benutzt.
 * @param {string} timeString Der zu prüfende Uhrzeit-String.
 * @param {boolean} allowIncomplete Zeigt an, dass auch ein
 * unvollständig angegebener Wert akzeptiert werden
 * soll. So wird der String auch als gültig angesehen, wenn
 * entgegen einer im Format geforderten Sekundenangabe
 * lediglich der Stunden- und Minutenteil enthalten ist.
 * Standardwert: <code>false</code>.
 * @param {boolean} exactMatch Zeigt an, ob der String exakt
 * dem Format folgen soll oder auch Annäherungen toleriert
 * werden sollen, die in einem JANUS-Filterausdruck
 * auch akzeptiert würden. Falls das Format z.B. zweistellige
 * Angaben vorschreibt, kann hiermit angezeigt werden,
 * dass trotzdem einstellige akzeptiert werden sollen.
 * Standardwert: <code>false</code>.
 * @return {boolean} <code>true</code>, falls gültig, sonst <code>false</code>.
 */
Date.isValidTime = function(timeString, allowIncomplete, exactMatch)
	{
		if(!timeString)
			return false;
		var dFmt = 'Y-m-d ';
		var dummyDate = '1970-01-01 ';
		var tFmt = this.janus2extFormat(UIApplication.getTimeFormat());
		var t = Date.parseDate(dummyDate + timeString, dFmt + tFmt, true);
		if(t)
			return true;
		// wenn !exactMatch, auch einstellige Angaben erlauben
		if(true !== exactMatch)
		{
			// TODO: Wochentagsangaben raus
			// einstellige statt zweistelliger Angaben (m -> n, h -> g)
			tFmt = tFmt.replace(/H/g, 'G').replace(/h/g, 'g');
			t = Date.parseDate(dummyDate + timeString, dFmt + tFmt, true);
			if(t)
				return true;
		}
		if(true === allowIncomplete)
		{
			var timeSep = tFmt.match(/[ :\-\.;_]/)[0];
			// Zeitformat zerlegen
			var aTimeFmt = tFmt.split(timeSep);
			var tmp = dFmt;
			for(var i=0; i < aTimeFmt.length; i++)
			{
				if(i > 0)
					tmp += timeSep;
				tmp += aTimeFmt[i];
				ts = Date.parseDate(dummyDate + timeString, tmp, true);
				if(ts)
					return true;
			}
		}
		return false;
	};
	
/**
 * @function external:Date#isValidTimestamp
 * @static
 * @desc Für einen String prüfen, ob er einen gültigen
 * Zeitstempel enthält. Es wird das aktuell gültige
 * JANUS-Zeitstempelformat benutzt.
 * @param {string} tsString Der zu prüfende Zeitstempel-String.
 * @param {boolean} allowIncomplete Zeigt an, dass auch ein
 * unvollständig angegebener Zeitstempel akzeptiert werden
 * soll. So wird der String auch als gültig angesehen, wenn er
 * lediglich den Datumsteil enthält.
 * Standardwert: <code>false</code>.
 * @param {boolean} exactMatch Zeigt an, ob der String exakt
 * dem Format folgen soll oder auch Annäherungen toleriert
 * werden sollen, die in einem JANUS-Filterausdruck
 * auch akzeptiert würden. Falls das Format z.B. zweistellige
 * Monatstage vorschreibt, kann hiermit angezeigt werden,
 * dass auch einstellige Angaben akzeptiert werden sollen.
 * Standardwert: <code>false</code>.
 * @return {boolean} <code>true</code>, falls gültig, sonst <code>false</code>.
 */
Date.isValidTimestamp = function(tsString, allowIncomplete, exactMatch)
	{
		if(!tsString)
			return false;
		var tsFmt = this.janus2extFormat(UIApplication.getTimestampFormat());
		var ts = Date.parseDate(tsString, tsFmt, true);
		if(ts)
			return true;
		var year4digit = (tsFmt.indexOf('Y') >= 0);
		// wenn !exactMatch, auch einstellige Angaben erlauben
		if(true !== exactMatch)
		{
			// TODO: Wochentagsangaben raus
			// einstellige statt zweistelliger Angaben (d -> j, m -> n, h -> g)
			tsFmt = tsFmt.replace(/d/g, 'j').replace(/m/g, 'n').replace(/H/g, 'G').replace(/h/g, 'g');
			ts = Date.parseDate(tsString, tsFmt, true);
			if(ts)
				return true;
			// Jahr auch zweistellig erlauben (Y -> y).
			// Y und y schliessen sich im Ext-Format
			// gegenseitig aus!
			ts = Date.parseDate(tsString, (year4digit ? tsFmt.replace(/Y/g,'y') : tsFmt.replace(/y/g,'Y')), true);
			if(ts)
				return true;
		}
		if(true === allowIncomplete)
		{
			var timestampSep = ' '; // Annahme!
			var tmp = tsFmt.split(timestampSep);
			if(tmp.length = 2)
			{
				var dFmt = tmp[0];
				var tFmt = tmp[1];
				var timeSep = tmp[1].match(/[ :\-\.;_]/)[0];
				// wir akzeptieren auch unvollstaendige Zeitstempel!
				// nur Datum?
				ts = Date.parseDate(tsString, dFmt, true);
				if(ts)
					return true;
				ts = Date.parseDate(tsString, (year4digit ? dFmt.replace(/Y/g,'y') : dFmt.replace(/y/g,'Y')), true);
				if(ts)
					return true;
				// Zeitformat zerlegen
				var aTimeFmt = tFmt.split(timeSep);
				var tmp = dFmt;
				for(var i=0; i < aTimeFmt.length; i++)
				{
					if(i == 0)
						tmp += timestampSep;
					else
						tmp += timeSep;
					tmp += aTimeFmt[i];
					ts = Date.parseDate(tsString, tmp, true);
					if(ts)
						return true;
					ts = Date.parseDate(tsString, (year4digit ? tmp.replace(/Y/g,'y') : tmp.replace(/y/g,'Y')), true);
					if(ts)
						return true;
				}
			}
		}
		return false;
	};

// Zusaetzliche Datentypen:
var JDuration = Class.create();
/**
 * @class JDuration
 * @desc Klasse zur Spezifikation einer zeitlichen Dauer.
 * @author Frank Fiolka
 */
JDuration.prototype = 
{
	/**
	 * Anzahl Sekunden.
	 */
	sec : 0,
	
	/**
	 @desc Ausgeben der Dauer als String. Dabei wird die Ausgabeeinheit
	 einigermaßen sinnvoll dimensioniert, sodass z.B. für die
	 Dauer von 320 Sekunden "5 m" ausgegeben wird. Die über den
	 ausgegebenen Wert hinausgehenden Sekunden werden ignoriert.
	 @return {String} Der String, z.B. "".
	 */
	toString : function()
	{
		// ab dieser Grenze naechstgroessere Einheit verw.:
		var limit = 2;
		var res = {
				value: this.sec,
				unit: 's'
			};
		var min = 60;
		var hour = 60 * min;
		var day = 24 * hour;
		var month = 30 * day; // ungenau!
		var year = 365 * day;
		if(this.sec > limit * year)
		{
			res.unit = 'Y';
			res.value = Math.floor(this.sec / year);
		}
		else if(this.sec > limit * month)
		{
			res.unit = 'M';
			res.value = Math.floor(this.sec / month);
		}
		else if(this.sec > limit * day)
		{
			res.unit = 'd';
			res.value = Math.floor(this.sec / day);
		}
		else if(this.sec > limit * hour)
		{
			res.unit = 'h';
			res.value = Math.floor(this.sec / hour);
		}
		else if(this.sec > limit * min)
		{
			res.unit = 'm';
			res.value = Math.floor(this.sec / min);
		}
		return '' + res.value + ' ' + res.unit;
	},

	/**
	 * @constructs JDuration
	 * @desc Erzeugt die Dauer.
	 * @param {number} sec Anzahl Sekunden.
	 */
	initialize : function(sec)
	{
		if(sec instanceof Date)
			this.sec = Math.floor(sec.getTime() / 1000);
		else if(typeof sec == 'number')
			this.sec = sec;
		else
			this.sec = 0;
	}
};
JDuration.sec = 0;

var JColor = Class.create();
/**
 * @class JColor
 * @desc Klasse zur Spezifikation von Farbwerten. Ein Objekt dieser
 * Klasse kann mit einem hexadezimalen, einem RGB-Farbwert oder
 * durch Angabe einer vordefinierten Farbkonstanten erzeugt
 * werden. Der Wert ist anschließend in verschiedenen Formaten
 * abfragbar mit [getHex()]{@link JColor#getHex}, [getRGB()]{@link JColor#getRGB},
 * [getRGBString()]{@link JColor#getRGBString} bzw. [getInt()]{@link JColor#getInt}.
 * @author Frank Fiolka
 */
JColor.prototype = 
{
	/* Vordefinierte Farben */
	/**
	 * Vordefinierte Farbe 'schwarz'.
	 * @const {JColor}
	 */
	black : null,
	/**
	 * Vordefinierte Farbe 'Blau'.
	 * @const {JColor}
	 */
	blue : null,
	/**
	 * Vordefinierte Farbe 'Cyan'.
	 * @const {JColor}
	 */
	cyan : null,
	/**
	 * Vordefinierte Farbe 'Dunkelgrau'.
	 * @const {JColor}
	 */
	darkGray : null,
	/**
	 * Vordefinierte Farbe 'Grau'.
	 * @const {JColor}
	 */
	gray : null,
	/**
	 * Vordefinierte Farbe 'Hellgrau'.
	 * @const {JColor}
	 */
	lightGray : null,
	/**
	 * Vordefinierte Farbe 'Magenta'.
	 * @const {JColor}
	 */
	magenta : null,
	/**
	 * Vordefinierte Farbe 'Orange'.
	 * @const {JColor}
	 */
	orange : null,
	/**
	 * Vordefinierte Farbe 'Rosa'.
	 * @const {JColor}
	 */
	pink : null,
	/**
	 * Vordefinierte Farbe 'Rot'.
	 * @const {JColor}
	 */
	red : null,
	/**
	 * Vordefinierte Farbe 'Weiß'.
	 * @const {JColor}
	 */
	white : null,
	/**
	 * Vordefinierte Farbe 'Gelb'.
	 * @const {JColor}
	 */
	yellow : null,
	/**
	 * Vordefinierte Farbe 'Grün'.
	 * @const {JColor}
	 */
	green : null,
	//@}

	/**
	 * Rotanteil.
	 * @member {number}
	 */
	r : -1,
	/**
	 * Grünanteil.
	 * @member {number}
	 */
	g : -1,
	/**
	 * Blauanteil.
	 * @member {number}
	 */
	b : -1,
	/**
	 * Alpha-Kanal (Transparenz).
	 * @member {number}
	 * @desc Wert zwischen 0 (deckend) und 100 (transparent).
	 */
	alpha : 0,

	/**
	 * Fragt ab, ob der Farbwert gültig ist.
	 * @return {boolean} <code>true</code>, wenn der Farbwert
	 * gültig (und nicht leer) ist.
	 * @return {boolean} Gültig oder nicht.
	 */
	isValid : function()
	{
		return (this.r >= 0 && this.r <= 255 &&
				this.g >= 0 && this.g <= 255 &&
				this.b >= 0 && this.b <= 255 &&
				this.alpha >= 0 && this.alpha <= 100);
	},
	
	/**
	 * Fragt ab, ob die Farbe den Wert "transparent", also
	 * im Alphakanal den Wert 100 hat.
	 * @return {boolean} Transparent oder nicht.
	 */
	isTransparent : function()
	{ return (this.alpha == 100); },
	
	/**
	 * Gibt den Rotanteil zurück.
	 * @return {number} Anteil zwischen 0 und 255.
	 */
	getRed : function()
	{ return this.r; },
	
	/**
	 * Gibt den Grünanteil zurück.
	 * @return {number} Anteil zwischen 0 und 255.
	 */
	getGreen : function()
	{ return this.g; },
	
	/**
	 * Gibt den Blauanteil zurück.
	 * @return {number} Anteil zwischen 0 und 255.
	 */
	getBlue : function()
	{ return this.b; },
	
	/**
	 * Gibt den Alphakanalwert zurück.
	 * @return {number} Wert für die Transparenz zwischen
	 * 0 (deckend) und 100 (transparent).
	 */
	getAlpha : function()
	{ return this.alpha; },
	
	/**
	 * Gibt die Farbe in hexadezimaler Notation
	 * zurück, wie sie für HTML und CSS verwendet wird.
	 * @return {string} Farbwert mit vorangestelltem "#"
	 * oder ein Leerstring, wenn es sich nicht um eine
	 * gültige Farbe handelt.
	 */
	getHex : function()
	{
		if(!this.isValid())
			return '';
		var r = this.r.toString(16);
		if(r.length == 1) r = '0' + r;
		var g = this.g.toString(16);
		if(g.length == 1) g = '0' + g;
		var b = this.b.toString(16);
		if(b.length == 1) b = '0' + b;
		return '#' + r + g + b;
	},
	
	/**
	 * Gibt den Farbwert als Array der Anteile zurück.
	 * @return {number[]} 3-elementiges Array mit den
	 * Anteilen oder <code>null</code>, wenn die Farbe
	 * nicht gültig ist.
	 */
	getRGB : function()
	{
		if(this.isValid())
			return [this.r, this.g, this.b];
		return null;
	},

	/**
	 * Gibt den Farbwert String, bestehend aus den kommaseparierten
	 * numerischen Farbwerten.
	 * @return {string} Der String oder Leerstring, wenn die Farbe
	 * nicht gültig ist.
	 */
	getRGBString : function()
	{
		if(this.isValid())
			return [this.r, this.g, this.b].join(',');
		return '';
	},
	
	/**
	 * Gibt den Farbwert als einzelne Ganzzahl zurück.
	 * @return {number} Der Farbwert oder <code>-1</code>,
	 * wenn die Farbe nicht gültig ist.
	 */
	getInt : function()
	{
		if(!this.isValid())
			return -1;
		return /*((this.r & 0xFF) << 32) |*/ ((this.r & 0xFF) << 16) | ((this.g & 0xFF) << 8) | ((this.b & 0xFF) << 0);
	},
	
	/**
	 * Gibt die Helligkeit nach
	 * [W3C]{@link http://www.w3.org/TR/AERT#color-contrast}
	 * zurück.
	 * @return {number} Ein Helligkeitswert zwischen 0 und 255.
	 * Bei ungültiger Farbe wird ein negativer Wert zurückgegeben.
	 */
	getBrightness : function()
	{
		if(!this.isValid())
			return -1;
		return ((this.r * 299 + this.g * 587 + this.b * 114) / 1000);
	},

	/**
	 * Setzt den Farbwert neu.
	 * @param {number} r Rotanteil (0 bis 255).
	 * @param {number} g Grünanteil.
	 * @param {number} b Blauanteil.
	 * @param {number} alpha Transparenzwert zwischen 0 (deckend)
	 * und 100 (transparent). (Optional)
	 * Statt dieser kann auch ein String-Parameter angegeben
	 * werden; dieser wird, wenn ihm ein "#" vorangestellt
	 * ist, als hexadezimale Darstellung der Farbe interpretiert,
	 * sonst als kommaseparierte RGB-Werte.
	 */
	set : function(r, g, b, alpha)
	{
		if(arguments.length > 0 && arguments[0] === 'transparent')
		{
			this.set(-1, -1, -1, 100);
			return;
		}
		var argc = 0;
		while(argc < arguments.length && typeof arguments[argc] !== 'undefined')
			argc++;
		if(typeof r == 'string')
		{
			if(!r)
				return;
			if(r.charAt(0) == '#')
			{
				r = r.substr(1);
				if(r.length == 3)
				{
					this.r = parseInt(r.charAt(0), 16);
					this.g = parseInt(r.charAt(1), 16);
					this.b = parseInt(r.charAt(2), 16);
				}
				else if(r.length == 6)
				{
					this.r = parseInt(r.substr(0, 2), 16);
					this.g = parseInt(r.substr(2, 2), 16);
					this.b = parseInt(r.substr(4, 2), 16);
				}
			}
			else
			{
				var arr = r.split(',');
				if(arr && (arr.length == 3 || arr.length == 4))
				{
					this.r = parseInt(arr[0], 10);
					this.g = parseInt(arr[1], 10);
					this.b = parseInt(arr[2], 10);
					if(arr.length == 4)
						this.alpha = parseInt(arr[3], 10);
				}
				else if(arr && arr.length == 1)
				{
					r = parseInt(arr[0], 10);
					// fallthrough!
				}
			}
		}
		if(typeof r == 'number')
		{
			if(argc == 1)
			{
				//this.alpha = (r >> 32) & 0xFF;
				this.r = (r >> 16) & 0xFF;
				this.g = (r >> 8) & 0xFF;
				this.b = (r >> 0) & 0xFF;
			}
			else if((typeof g == 'number') && (typeof b == 'number'))
			{
				this.r = r;
				this.g = g;
				this.b = b;
				if(typeof alpha == 'number')
					this.alpha = alpha;
			}
		}
		else if(JafWeb.isArray(r) && (r.length == 3 || r.length == 4))
		{
			if(typeof r[0] == 'number')
				this.r = r[0];
			else
				this.r = parseInt(r[0], 10);
			if(typeof r[1] == 'number')
				this.g = parseInt(r[1], 10);
			else
				this.g = parseInt(r[1], 10);
			if(typeof r[2] == 'number')
				this.b = parseInt(r[2], 10);
			else
				this.b = parseInt(r[2], 10);
			if(r.length == 4)
			{
				if(typeof r[3] == 'number')
					this.alpha = parseInt(r[3], 10);
				else
					this.alpha = parseInt(r[3], 10);
			}
		}
		else if(r && (r instanceof JColor))
		{
			this.r = r.r;
			this.g = r.g;
			this.b = r.b;
			this.alpha = r.alpha;
		}
		return this;
	},
	
	/**
	 * @constructs JColor
	 * Erzeugt die Farbdarstellung.
	 * @param {number} r Rotanteil (0 bis 255).
	 * @param {number} g Grünanteil.
	 * @param {number} b Blauanteil.
	 * @param {number} alpha Transparenzwert zwischen 0 (deckend)
	 * und 100 (transparent). (Optional)
	 * Statt dieser kann auch ein String-Parameter angegeben
	 * werden; dieser wird, wenn ihm ein "#" vorangestellt
	 * ist, als hexadezimale Darstellung der Farbe interpretiert,
	 * sonst als kommaseparierte RGB-Werte.
	 */
	initialize : function(r, g, b, alpha)
	{
		this.r = -1;
		this.g = -1;
		this.b = -1;
		this.alpha = 0;
		this.set(r, g, b, alpha);
	}
};
JColor.black = new JColor(0, 0, 0);
JColor.blue = new JColor(0, 0, 255);
JColor.cyan = new JColor(0, 255, 255);
JColor.darkGray = new JColor(64, 64, 64);
JColor.gray = new JColor(128, 128, 128);
JColor.lightGray = new JColor(192, 192, 192);
JColor.magenta = new JColor(255, 0, 255);
JColor.orange = new JColor(255, 200, 0);
JColor.pink = new JColor(255, 175, 175);
JColor.red = new JColor(255, 0, 0);
JColor.white = new JColor(255, 255, 255);
JColor.yellow = new JColor(255, 255, 0);
JColor.green = new JColor(0, 255, 0);
	

/**
 * @class JDebug
 * @desc UI-unabhängige Debug-Funktionen.
 * Meldungen über diese Schnittstelle werden mit einem
 * bestimmten Debug-Level ausgegeben. Anhand des mit
 * [JDebug.setDebugLevel()]{@link JDebug#setDebugLevel}
 * eingestellten Debug-Levels wird dann entschieden, ob die
 * Meldung ausgegeben oder aber ignoriert wird.<br/>
 * Für das Wohin der Ausgabe wird folgende Strategie
 * angewandt:
 <ul>
	<li>Wenn [Remote Debugging]{@link JDebug#activateRemoteDebugging}
	aktiviert ist, wird die Meldung per AJAX-Request zum Server
	geschickt. Das kann z.B. nützlich sein, wenn auf dem Client
	keine Werkzeuge zum Debuggen vorhanden sind.</li>
	<li>Wenn der aktuelle Browser die Funktion <code>console.log()</code>
	kennt, wird diese mit Angabe des entsprechenden Debug-Levels
	aufgerufen. Bei fast allen aktuellen Browsern ist das der Fall.</li>
	<li>Wenn die JafWeb-UI verwendet wird, also {@link UIDebug} vorhanden
	ist, wird auf eine im Arbeitsbereich eingeblendete ExtJS-Konsole
	ausgegeben.</li>
 </ul>
 Bei der Ausgabe der Meldungen
 * @author Frank Fiolka
 */
var JDebug = {
	// Konstanten fuer Debug level
	/**
	 * @const {number}
	 */
	ALL : 2,
	/**
	 * @const {number}
	 */
	L1 : 4,
	/**
	 * @const {number}
	 */
	L2 : 8,
	/**
	 * @const {number}
	 */
	L3 : 16,
	/**
	 * @const {number}
	 */
	L4 : 32,
	/**
	 * @const {number}
	 */
	L5 : 64,
	/**
	 * @const {number}
	 */
	L6 : 128,
	/**
	 * @const {number}
	 */
	DEBUG : 256,
	/**
	 * @const {number}
	 */
	ERROR : 512,
	/**
	 * @const {number}
	 */
	INFO : 1024,
	/**
	 * @const {number}
	 */
	WARN : 2048,
	/**
	 * @const {number}
	 */
	PD_REQUEST_PARAMS : 4096,
	/**
	 * @const {number}
	 */
	PD_RESPONSE_TEXT : 8192,
	/**
	 * @const {number}
	 */
	PD_TRANS : 16384, // neues Transaktionskonzept
	/**
	 * @const {number}
	 */
	UI_COMP_INIT : 32768,
	/**
	 * @const {number}
	 */
	UI_COMP_RENDER : 65536,
	/**
	 * @const {number}
	 */
	UI_SET_CONTROL_DATA : 131072,
	/**
	 * @const {number}
	 */
	UI_GET_CONTROL_DATA : 262144,
	/**
	 * @const {number}
	 */
	UI_FOCUS : 524288,
	/**
	 * @const {number}
	 */
	UI_EVENT : 1048576,
	/**
	 * @const {number}
	 */
	UI_FOCUS: 2097152,
	/**
	 * @const {number}
	 */
	UI_TOUCH: 4194304,
	// weitere?

	/**
	 * Aktueller Debug-Level.
	 * @attr {number}
	 */
	_actDebugLevel : 2,
	_buffer: [ ],
	_remoteDebugging: false,
	
	/**
	 * Den aktuellen Debug-Level setzen, der darüber entscheidet,
	 * welche Meldungen ausgegeben werden.
	 * @param {number} level Der Level - ein oder mehrere, miteinander
	 * durch ODER verkettete Konstanten aus {@link JDebug}.
	 */
	setDebugLevel : function(level)
	{
		this._actDebugLevel = level;
	},
	
	/**
	 * Aktiviert Remote-Debugging. Die Log-Ausgaben werden
	 * dann an den Server geschickt. Dieser entscheidet
	 * darüber, ob und wie diese Meldungen ausgegeben
	 * werden.
	 * Vgl. das Tutorial {@tutorial tut_remoteDebugging}.
	 * @param {boolean} [yesno=true]
	 */
	activateRemoteDebugging : function(yesno)
	{
		this._remoteDebugging = (false !== yesno);
	},
	
	/*
	 * @ignore(true)
	 * Die vor <code>onReady</code> gepufferten
	 * Log-Einträge rausschreiben.
	 */
	flushBuffer : function()
	{
		for(var i=0; i<this._buffer.length; i++)
			JDebug.log(-1, this._buffer[i], true);
		this._buffer = [ ];
	},

	/**
	 * Meldung in das Debug-Fenster schreiben. Der Wert wird
	 * angefügt.
	 * @param {string} level Debug-Level. Hier sollte eine der in
	 * dieser Klasse definierten Konstanten angegeben werden, um
	 * die Meldung zu klassifizieren. Auf diese Weise kann
	 * an einer Stelle die "Geschwätzigkeit" der Meldungen
	 * festgelegt werden.
	 * @param {mixed} val Die auszugebende Meldung.
	 * @param {boolean} noBuffer Meldung soll nicht gepuffert werden.
	 */
	log : function(level, val, noBuffer)
	{
		if(typeof UIDebug != 'undefined' && !this._remoteDebugging)
		{
			UIDebug.log(level, val, noBuffer);
			return;
		}
		if(this._actDebugLevel == this.ALL || this._actDebugLevel < 0 ||
				(this._actDebugLevel & level) != 0)
		{
			if(this._remoteDebugging)
			{
				PDTools.DEB(val);
				return;
			}
			if(!JafWeb.isDocumentReady())
			{
				if(noBuffer)
					return;
				this._buffer.push(val);
			}
			else
			{
				try
				{
					switch(level)
					{
						case JDebug.WARN:
							console.warn(val);
							break;
						case JDebug.INFO:
							console.info(val);
							break;
						case JDebug.DEBUG:
							console.debug(val);
							break;
						case JDebug.ERROR:
							console.error(val);
							break;
						default:
							console.log(val);
					}
				}
				catch(ex)
				{
					if(level == JDebug.ERROR)
						alert(val);
				}
			}
		}
	},

	/**
	 * Variable in die Debug-Konsole dumpen.
	 * @param {mixed} val Die auszugebende Variable.
	 */
	dump : function(val)
	{
		JDebug.log(JDebug.INFO, inspect(val));
	}
}

//JDebug._actDebugLevel = JDebug.WARN|JDebug.INFO|JDebug.ERROR|JDebug.DEBUG; //JDebug.PD_TRANS
JDebug._actDebugLevel = JDebug.WARN|JDebug.ERROR;

	
	
/**
 @desc Zwei JavaScript-Objekte hinsichtlich ihres Inhalts vergleichen.
 Da JavaScript komplexe Typen als Referenzen verwaltet, reicht
 es nicht, den Vergleichsoperator auf die Variablen anzuwenden.
 @param {Object} o1 Das erste Vergleichsobjekt.
 @param {Object} o2 Das zweite Vergleichsobjekt.
 @return {boolean} <code>true</code>, falls beide Objekte gleich
 (nicht: identisch) sind, sonst <code>false</code>.
 */
function ObjectsEqual(o1, o2) // NICHT den Object-prototype erweitern, damit kommt Ext nicht klar!
{
	if(!o1 && !o2)
		return true;
	if(!o1 || !o2)
		return false;
	for(var p in o1)
	{
		if(typeof(o2[p]) == 'undefined')
			return false;
		if(o1[p])
		{
			switch(typeof(o1[p]))
			{
				case 'object':
					if(!ObjectsEqual(o1[p], o2[p]))
						return false;
					break;
				case 'function':
					if(typeof(o2[p]) != 'function')
						return false;
					if(p != 'equals' && (o1[p].toString() != o2[p].toString()))
						return false;
					break;
				default:
					if(o1[p] != o2[p])
						return false;
			}
		}
		else if(o2[p])
			return false;
	}
	for(var q in o2)
	{
		if(typeof(o1[q]) == 'undefined')
			return false;
	}
	return true;
}

/**
 * @desc Prüft, ob es sich bei dem übergebenen Objekt um ein
 * gültiges <code>PDObject</code> handelt.<br/>
 * <span class="important">Hinweis:</span> Für <code>null</code> wird <code>false</code>
 * zurückgegeben, obwohl es natürlich sinnvoll sein kann,
 * das als Wert einer <code>PDObject</code>-Variablen
 * anzusehen.
 * @deprecated Verwenden Sie bitte statt dieser
 * die Funktion [JafWeb.isPDObject()]{@link JafWeb#isPDObject}.
 * @param {mixed} obj Der zu prüfende Wert.
 * @return {boolean} <code>true</code>, falls es sich um ein
 * gültiges <code>PDObject</code> handelt, sonst
 * <code>false</code>.
 */
function isValidPDObject(obj)
{
	if(!obj || typeof obj != 'object')
		return false;
	// diese Properties muss jedes PDObject haben:
	if(typeof obj.oidLow != 'number' ||
			typeof obj.cid != 'number' ||
			typeof obj.oidHi != 'number' ||
			typeof obj.oid != 'string' ||
			typeof obj.classname != 'string')
		return false;
	return true;
}

/*
 * @ignore(true)
 * XMLNode (aus XML for <SCRIPT>) erweitern, falls eingebunden.
 */
if(typeof XMLNode != 'undefined')
{
	XMLNode.prototype.toXmlString = function(indent) {
	    if (this.nodeType=='TEXT')
        return (this.content ? this.content.toXmlValue() : '');
	    if (this.nodeType=='CDATA')
	    {
	    	if(typeof indent == 'number' && indent >= 0)
	    	{
		    	var s = '';
		    	s.addIndent(indent);
		    	s += '<![CDATA[' + this.content + ']]>\n';
		    	return s;
	    	}
        return '<![CDATA[' + this.content + ']]>';
      }
	    if (this.nodeType=='COMMENT' )
	    {
	    	if(typeof indent == 'number' && indent >= 0)
	    	{
		    	var s = '';
		    	s.addIndent(indent);
		    	s += '<!--' + (this.content ? this.content.toXmlValue() : '') + '-->\n';
		    	return s;
	    	}
        return '<!--' + (this.content ? this.content.toXmlValue() : '') + '-->';
      }
			var s = '';
    	if(typeof indent == 'number' && indent >= 0)
    		s.addIndent(indent);
			s += '<' + this.tagName;
			for(var a in this.attributes)
			{
				if(a && a.charAt(0) == '_')
					s += ' ' + a.substr(1) + '="' +
							(typeof this.attributes[a]=='string' ? this.attributes[a].toXmlAttributeValue() : this.attributes[a]) + '"';
			}
			var i=0;
			for(; i < this.children.length; i++)
			{
	    	if(typeof indent == 'number' && indent >= 0)
	    	{
					if(i == 0)
						s += '>\n';
					s += this.children[i].toXmlString.call(this.children[i], indent + 1);
				}
				else
				{
					if(i == 0)
						s += '>';
					s += this.children[i].toXmlString.call(this.children[i]);
				}
			}
			if(i == 0)
			{
				s += '/>';
	    	if(typeof indent == 'number' && indent >= 0)
					s += '\n';
			}
			else
			{
	    	if(typeof indent == 'number' && indent >= 0)
	    	{
	    		s.addIndent(indent);
					s += '</' + this.tagName + '>\n';
				}
				else
					s += '</' + this.tagName + '>';
			}
			return s;
		};
}


/*
 * @ignore(true)
 * <code>requestAnimationFrame()</code> und <code>cancelAnimationFrame()</code>
 * hinzufügen, falls nicht vorhanden.
 */
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


/**
 * @desc JavaScript dynamisch nachladen.
 * @param {string} url URL der zu ladenden JavaScript-Datei, z.B.
 * <code>resExt/script/myscript.js</code>.
 * @param {string} scope Ausführungskontext für die
 * <code>eval()</code>-Funktion. Falls nicht angegeben, wird
 * <code>window</code> angenommen.<br/>
 * Variablen, die in dem geladenen Skript mit <code>var</code> deklariert
 * sind, werden zu lokalen Variablen innerhalb des Ausführungskontexts.
 * Wenn Variablen von außerhalb des Kontexts zugreifbar sein sollen,
 * müssen sie in dem geladenen Skript als "Member" deklariert werden,
 * z.B. <code>this.myVar = 'Hallo';</code>.
 * @param {boolean} [disableCaching=true] Zeigt an, ob dem Browser verboten
 * werden soll, das Ergebnis zwischenzuspeichern. Bei variablen Inhalten
 * soll nicht zwischengespeichert werden, bei statischen beschleunigt das
 * Zwischenspeichern das Laden, weil der Request eingespart werden kann.
 * @return {string} Falls ein Fehler aufgetreten ist, die Fehlermeldung,
 * sonst Leerstring. Falls das Skript nicht gefunden wurde, wird
 * "Server side failure with status 404" zurückgegeben.
 */
function loadJavaScript(url, scope, disableCaching)
{
	//UIDebug.log(UIDebug.DEBUG, "loadJavaScript('" + url + "')");
	var res = '';
	var successFn = function(response, options)
		{
			try
			{
				// Ext: response.responseText, JQuery: response
				if(scope)
					(new Function("with(this) {" + (response.responseText || response) + "}")).call(scope);
				else
					window.eval(response.responseText || response);
			}
			catch(ex)
			{
				res = ex.toString();
				if(typeof ex.lineNo != 'undefined')
					res += ", line " + ex.lineNo;
			}
		};
	var req = JafWeb.ajaxRequest({
			url: url,
			method: 'GET',
			async: false, //(async !== false),
			dataType: 'text', // wichtig bei JQuery, weil sonst gueltiges JSON erwartet wird!
			scope: (scope || window),
			disableCaching: (false !== disableCaching),
			success: successFn,
			failure: function(response, opts) {
					//UIDebug.log(UIDebug.ERROR, "loadJavaScript('"+url+"') failed");
					res = "Server side failure with status " + response.status;
				}
		});
	return res;
}


/*
 * @desc Eigenschaften des übergebenen Konfigurationsobjekts
 * anzeigen.
 */
function showConfig(cfg, inclFunctions)
{
	var tmp = "";
	if(!cfg)
		tmp = "null";
	else
	{
		for(sProperty in cfg)
		{
			if((!inclFunctions || inclFunctions==false) &&
					typeof cfg[sProperty] == "function")
				continue;
			if(tmp != "") tmp += "\n";
			tmp += sProperty + ": " + cfg[sProperty];
		}
	}
	alert(tmp);
}

/**
 * @desc Den übergebenen Wert mit all seinen Properties als
 * String ausgeben.
 * @param {mixed} val Ein Wert beliebigen Typs.
 * @param {boolean} recursive Zeigt an, ob Properties von
 * Objekten bzw. Array-Elemente rekursiv weiterverfolgt
 * werden sollen.
 * @return {string} Die Ausgabe.
 */
function inspect(val, recursive)
{
	if(val === null) return "null";
	if(val === undefined) return "undefined";
	switch(typeof val)
	{
		case "string":
			return "\""+val.replace(/\"/g,"\\\"")+"\"";
		case "number":
			return ""+val;
		case "boolean":
			return (val == true ? "true" : "false");
		case "function":
			return "function";
		case "object":
			var tmp = "";
			if(typeof val == 'object' && val.length != undefined) // instanceof funktioniert nicht zuverlaessig!
			{
				tmp = "[";
				for(var i=0; i < val.length; i++)
				{
					if(tmp != "[") tmp += ", ";
					tmp += inspect(val[i]);
				}
				tmp += "]";
			}
			else
			{
				tmp = "{";
				for(var property in val)
				{
					if(typeof val[property] == "function") continue;
					if(tmp != "{") tmp += ", ";
					tmp += property + ": " + (recursive === true ? inspect(val[property]) : val[property]);
				}
				tmp += "}";
			}
			return tmp;
		default:
			return "";
	}
}

/*
 * @ignore(true)
 * @desc Fügt dem übergebenen String einen weiteren CSS-Klassennamen hinzu,
 * falls er nicht bereits drin vorkommt.
 * @param {string} classString Zu ändernder Klassen-String.
 * @param {string} classToAdd Die hinzuzufügende CSS-Klasse.
 * @return {string} Das Resultat, das dem class-Attribut wieder
 * zugewiesen werden kann.
 */
function addCssClass(classString, classToAdd)
{
	var tmp = (classString ? classString.split(' ') : []);
	if(tmp.indexOf(classToAdd) < 0)
		tmp.push(classToAdd);
	return tmp.join(' ');
}

/*
 * @ignore(true)
 * @desc Entfernt aus dem übergebenen String einen CSS-Klassennamen,
 * falls dieser darin vorkommt.
 * @param {string} classString Zu ändernder Klassen-String.
 * @param {string} classToRemove Die zu entfernende CSS-Klasse.
 * @return {string} Das Resultat, das dem class-Attribut wieder
 * zugewiesen werden kann.
 */
function removeCssClass(classString, classToRemove)
{
	var tmp = (classString ? classString.split(' ') : []);
	var pos = tmp.indexOf(classToRemove);
	if(pos >= 0)
		tmp.splice(pos, 1);
	return tmp.join(' ');
}


var JParamPacker = Class.create();
/**
 * @class JParamPacker
 * Klasse zum einfachen Verwalten von Web-Request-Parametern.
 * Die Parameter können einzeln hinzugefügt werden.
 * Die resultierenden Parameter lassen sich mit einem einzigen
 * Aufruf (richtig kodiert) an einen Request übergeben.
 * @author Frank Fiolka
 */
JParamPacker.prototype = 
{
	_params: [ ],
	_jWebEvent: "",
	PDClass : null,

	/**
	 * @constructs JParamPacker
	 * Erzeugt das Objekt.
	 * @param {string} janusWebEvent Der Event-Name. Unter diesem
	 * Namen wird das Web-Ereignis im Server-seitigen Controller
	 * behandelt. Der Name sollte keine Unterstriche und Sonderzeichen
	 * enthalten, Satzzeichen z.B. sind aber zulässig.<br>
	 * Außerdem sollten selbst definierte Event-Namen nicht mit
	 * den Namen der Fachkonzeptklassen aus der Laufzeitbibliothek
	 * (<code>PDMeta.</code>, <code>PDClass.</code>, <code>PDObject.</code>,
	 * <code>PDProperties.</code>, <code>ClientInfo.</code>,
	 * <code>PDOperationCall.</code> sowie <code>PDTree.</code>)
	 * beginnen, um Konflikte mit der JafWeb-eigenen Ereignisbehandlung
	 * zu vermeiden.
	 */
	initialize : function(janusWebEvent, pdClass)
	{
		if((typeof PDClassClass != 'undefined') &&
				(arguments[arguments.length - 1] instanceof PDClassClass))
			this.PDClass = arguments[arguments.length - 1];
		else if(typeof PDClass != 'undefined')
			this.PDClass = PDClass;
		this._jWebEvent = janusWebEvent||"";
		this._params = new Array();
	},
	
	/**
	 * Löscht das Objekt.
	 */	
	Delete : function()
	{
		this._params = null;
		this._jWebEvent = null;
	},
	
	/**
	 *  Gibt den Event-Namen zurück.
	 *  @return {string} Der Name.
	 */
	getEventName : function()
	{ return this._jWebEvent; },
	
	/**
	 *  Fügt ein Fachkonzeptobjekt mit seiner Objektkennung hinzu.
	 *  Diese Funktion wird typischerweise bei den Requests für
	 *  PDObject benutzt, um das aktuelle Objekt zu kennzeichnen.
	 *  Um stattdessen das komplette Objekt mit seinen Attributen
	 *  hinzuzufügen, benutzen Sie <code>add()</code>.
	 *  @param {PDObject} pdo Das Fachkonzept-Objekt.
	 */
	addPDObjectByIds : function(pdo)
	{
		this.add(JafWebAPI.PDObject.PAR_cid, pdo.cid);
		this.add(JafWebAPI.PDObject.PAR_clName, pdo.classname);
		this.add(JafWebAPI.PDObject.PAR_oidHi, pdo.oidHi);
		this.add(JafWebAPI.PDObject.PAR_oidLow, pdo.oidLow);
		if(pdo._lockid >= 0)
			this.add("lockId", (pdo._lockid || -1));
		if(pdo._tid)
			this.add("tid", pdo._tid);
	},
	
	/**
	 * Fügt einen Request-Parameter hinzu. Falls ein gleichnamiger
	 * Parameter bereits vorhanden ist, wird dieser durch den neuen
	 * überschrieben.
	 * @param {string} name Der Parametername.
	 * @param {mixed} value Der Wert. Hier kann ein beliebiger Typ
	 * inklusive <code>PDObject</code> angegeben werden.
	 * @param {boolean} recursive Zeigt beim Hinzufügen von
	 * <code>PDObject</code>-Transaktionsobjekten an, dass mit diesem
	 * verbundene Transaktionsobjekte ebenfalls mit hinzugefügt werden
	 * sollen.
	 * @param {boolean} overwrite Zeigt an, ob ein evtl. bereits vorhandener
	 * gleichnamiger Parameter überschrieben werden (<code>true</code>)
	 * oder der neue als weiterer, gleichnmaiger Parameter hinzugefügt werden
	 * soll (<code>false</code>). Standardwert ist <code>false</code>.
	 */
	add : function(name, value, recursive, overwrite)
	{
		if(arguments.length >= 2 && typeof name == "string" && name != "")
		{
			// falls bereits drin, den alten erst entfernen?
			if(true === overwrite)
			{
				var i=0;
				while(i + 1 < this._params.length)
				{
					if(this._params[i] == name)
						this._params.splice(i, 2);
					else
						i += 2;
				}
			}
			switch(typeof value)
			{
				case "string":
					this._params.push(name);
					this._params.push(""+value);
					break;
				case "boolean":
					this._params.push(name);
					this._params.push((value == true ? "true" : "false"));
					break;
				case "number":
					this._params.push(name);
					if(value == Number.NaN)
						this._params.push("");
					else
						this._params.push(""+value);
					break;
				case "object":
					// unterscheiden, ob PDObject oder nur JS-object
					//JDebug.log(JDebug.WARN, "JParamPacker.add('"+name+"', "+inspect(value)+")");
					if(value && (typeof value['GetPDObjectId']) == "function")
					{
						this._params.push(name);
						this._params.push(value.objectToString((value.isTrans && value.isTrans() && true === recursive)).replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,''));
						//this._params.push(value.objectToString((value.isTrans && value.isTrans() && true === recursive)).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,''));
					}
					else if(value instanceof Array)
					{
						//this._params.push(value.join(','));
						// die Params einzeln einfuegen!
						for(var i=0; i < value.length; i++)
						{
							var v = value[i];
							if(typeof v == 'string')
								v = v.replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'');
								//v = v.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'');
							this._params.push(name);
							this._params.push(v);
						}
					}
					else
					{
						this._params.push(name);
						var tmp = "{";
						for(var s in value)
						{
							if(tmp != "{") tmp += ",";
							tmp += s + ": '";
							if(typeof value[s] == 'string')
								tmp += value[s].replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'');
							else
								tmp += value[s];
							//tmp += value[s].replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'');
							tmp += "'";
						}
						tmp += "}";
						this._params.push(tmp);
					}
					break;
				default: // undefined, function
					this._params.push(name);
					this._params.push("");
			}
		}
	},
	
	/**
	 * Gibt den aus den Parametern zusammengesetzten String zurück.
	 * @param {boolean} encode Legt fest, ob der Wert für die Benutzung in
	 * einer URL kodiert werden soll (<code>true</code>). Wenn der Wert
	 * an einen AJAX-Request übergeben wird, ist das normalerweise <em>nicht</em>
	 * erwünscht, weil dieser die nötige Kodierung selbst übernimmt. Daher ist
	 * <code>false</code> der Standardwert. Geben Sie hier <code>true</code> an,
	 * wenn Sie den zurückgegebenen String direkt in einer URL (z.B. zum Befüllen
	 * eines IFRAME) einsetzen wollen.
	 * @return {string} Der String, der alle JANUS-Parameter kodiert, also der
	 * Wert für den Web-Parameter <code>janusWebEvent</code>.
	 */
	getEventString : function(encode)
	{
		var tmpEvt = this._jWebEvent;
		for(var i=0; i < this._params.length-1; i+=2)
			tmpEvt += "_" + this._params[i].replace(/\\/g,"\\\\").replace(/_/g,"\\_") + "_" + this._params[i+1].replace(/\\/g,"\\\\").replace(/_/g,"\\_");
		if(true === encode)
			tmpEvt = encodeURIComponent(tmpEvt);
		return tmpEvt;
	},
	
	/**
	 * URL für POST-Requests zurückgeben. Diese URL setzt sich aus
	 * der Root Url (siehe <code>UIWorkspace.getUrlRoot()</code>)
	 * und dem Web-Parameter <code>janusWebEvent</code> zusammen.
	 * Der Wert des Parameters ist der im <code>JParamPacker</code>-
	 * Konstruktor übergebene Event-Name.
	 * @return {string} Die URL.
	 */
	getPostUrl : function()
	{
		return this.PDClass.getURL() + '?iid=' + this.PDClass.PDMeta.getInstanceID() +
				'&sessionId=' + this.PDClass.getAuthToken() +
				'&janusWebEvent=' + this._jWebEvent;
	},
	
	/**
	 * URL für GET-Requests zurückgeben. Diese URL setzt sich aus
	 * der Root Url (siehe <code>UIWorkspace.getUrlRoot()</code>)
	 * und dem Web-Parameter <code>janusWebEvent</code> zusammen,
	 * dem sämtliche hinzugefügten JafWeb-Parameter anhängen (siehe
	 * [getEventString()]{@link JParamPacker#getEventString}).
	 * Der Wert des Parameters ist der im <code>JParamPacker</code>-
	 * Konstruktor übergebene Event-Name.
	 * @param {boolean} encode Legt fest, ob der Wert für die Benutzung in
	 * einer URL kodiert werden soll (<code>true</code>). Wenn der Wert
	 * an einen AJAX-Request übergeben wird, ist das normalerweise <em>nicht</em>
	 * erwünscht, weil dieser die nötige Kodierung selbst übernimmt. Daher ist
	 * <code>false</code> der Standardwert. Geben Sie hier <code>true</code> an,
	 * wenn Sie den zurückgegebenen String direkt in einer URL (z.B. zum Befüllen
	 * eines IFRAME) einsetzen wollen.
	 * @return {string} Die URL.
	 */
	getUrl : function(encode)
	{
		return this.PDClass.getURL() + '?iid=' + this.PDClass.PDMeta.getInstanceID() +
				'&sessionId=' + this.PDClass.getAuthToken() +
				'&janusWebEvent=' + this.getEventString(encode);
	},
	
	/**
	 * Gibt die Parameter zur Verwendung in einem GET-Request
	 * zurück.
	 * @return {Object} JavaScript-Objekt mit den Parametern zur
	 * Übergabe an <code>JafWeb.ajaxRequest()</code>.
	 */
	get : function(eventType)
	{
		eventType = (eventType || 'janusWebEvent');
		var tmp = {
				JanusApplicationName: "GenericJanusApplication",
				iid: this.PDClass.PDMeta.getInstanceID()
			};
		tmp[eventType] = this.getEventString(false);
		if(eventType == 'serverEvent')
			tmp.janusWebEvent = eventType;
		return tmp;
	},
	
	/**
	 * Gibt die Parameter zur Verwendung in einem POST-Request
	 * zurück.
	 * @return {Object} JavaScript-Objekt mit den Parametern zur
	 * Übergabe an <code>JafWeb.ajaxRequest()</code>.
	 */
	getPostParams : function(eventType)
	{
		eventType = (eventType || 'janusWebEvent');
		var tmp = {
				JanusApplicationName: "GenericJanusApplication",
				iid: PDMeta.getInstanceID()
			};
		tmp[eventType] = this.getEventName();
		for(var i=0; i < this._params.length-1; i+=2)
		{
			tmp['jwv_'+this._params[i]] = this._params[i+1];
			//if(tmp['jwv_'+this._params[i]].match(/\n/))
			//	JDebug.log(JDebug.WARN, "JParamPacker.getPostParams(): value of parameter '"+this._params[i]+"' contains line break!");
		}
		return tmp;
	},
	
	/**
	 * Gibt eine String-Repräsentation der aktuell vom
	 * <code>JParamPacker</code> verwalteten Werte aus.
	 * Sinnvoll für Debugging-Zwecke.
	 * @return {string} JSON-artige Zeichenkette.
	 */
	toString : function()
	{
		var tmp = "{\n";
		tmp += "\tJanusApplicationName: 'GenericJanusApplication',\n";
		tmp += "\tiid: " + this.PDClass.PDMeta.getInstanceID() + ",\n";
		tmp += "\tjanusWebEvent: '" + this.getEventString() + "'\n";
		tmp += "}";
		return tmp;
	},
	
	/**
	 * Löscht alle hinzugefügten Parameter (nicht
	 * aber den Event-Namen).
	 */
	clear : function()
	{
		this._params = new Array();
	}
};


var JResponse = Class.create();
/**
 * @class JResponse
 * @desc Klasse zur Kapselung von JSON-Responses. Die Klasse
 * wandelt den vom Server gelieferten JSON-String in ein
 * JavaScript-Objekt um und bietet Funktionen zum komfortablen
 * und typsicheren Zugriff auf die Elemente.<br/>
 * <span class="important">Hinweis:</span> Vor der Verwendung des Response-Objekts sollte erst
 * mit <code>hasFatalError()</code> abgefragt werden, ob nicht ein
 * schwerer Fehler (z.B. Trennung der Netzwerkverbindung) aufgetreten
 * ist. In diesem Fall verursacht der Zugriff auf weitere Elemente
 * des Objekts Fehler.
 * @author Frank Fiolka
 */
JResponse.prototype = 
{
	_data : null,
	PDClass : null,

	/**
	 * @constructs JResponse
	 * Erzeugt das Objekt.
	 * @param {Object} request XMLHttpRequest-Objekt, das vom Ajax-Request
	 * zurückgeliefert wird. Der Konstruktor interpretiert dessen
	 * Property <code>responseText</code>.
	 * @param {Object} options Die an den Request übergebenen Optionen.
	 */
	initialize : function(request, options, pdClass)
	{
		try
		{
			if((typeof PDClassClass != 'undefined') &&
					(arguments[arguments.length - 1] instanceof PDClassClass))
				this.PDClass = arguments[arguments.length - 1];
			else if(typeof PDClass != 'undefined')
				this.PDClass = PDClass;
			//JDebug.log(JDebug.DEBUG, "JResponse ctor - responseText: "+request.responseText);
			if(typeof request == 'object' && typeof request['responseText'] == 'undefined')
			{
				this._data = request;
				this._responseText = request;
			}
			else
			{
				this._data = JafWeb.decode(request.responseText);
				this._responseText = request.responseText;
			}
		}
		catch(ex)
		{
			if(typeof Ext == 'object' && (typeof UIApplication != 'undefined'))
				UIApplication.handleNetworkError(Ext.Ajax, request);
			/* if(!request.responseText || request.responseText.substr(0, 5)=='<html')
				UIApplication.handleNetworkError(Ext.Ajax, request);
			else
			{
				//JDebug.log(JDebug.WARN, "response: "+request.responseText);
				this._data = {
						errMsg: 'Response: eval failed! ResponseText: "'+request.responseText+'"'
					};
			} */
		}
	},
	
	/**
	 * Löscht das Objekt.
	 */	
	Delete : function()
	{
		for(var p in this._data)
		{
			if(typeof this._data[p] == "object")
				delete this._data[p];
		}
		delete this._data;
	},
	
	/**
	 * Fragt ein Property typunabhängig ab.
	 * @param {string} property Name des abzufragenden Properties.
	 * @return {mixed} Der Wert.
	 * @see Typabhängige Varianten {@link JResponse#getBool},
	 * {@link JResponse#getString} usw.
	 */
	get : function(property)
	{
		return this._data[property];
	},
	
	/**
	 * Gibt die komplette Datenstruktur zurück.
	 * @return {Object} JavaScript-Objekt mit den Daten.
	 */
	getData : function()
	{ return (this._data || null); },
	
	/**
	 * Gibt den Wert eines booleschen Properties aus
	 * dem Response zurück.
	 * @param {string} property Name des abzufragenden Properties.
	 * @param {boolean} def Optionale Angabe eines Default-Wertes
	 * für den Fall, dass das Property nicht gefunden wurde.
	 * Wenn dieser Parameter fehlt, wird in diesem Fall
	 * <code>undefined</code> zurückgegeben.
	 * @return {boolean} Der Wert des Properties oder der in
	 * <code>def</code> angegebene Wert oder <code>undefined</code>.
	 */
	getBool : function(property, def)
	{
		if(this._data && (this._data[property] === true || this._data[property] === 'true'))
			return true;
		if(this._data && (this._data[property] === false || this._data[property] === 'false'))
			return false;
		if(this._data && (typeof this._data[property] == 'number'))
			return (this._data[property] !== 0);
		return def;
	},
	
	/**
	 * Gibt den Wert eines String-Properties aus dem Response
	 * zurück.
	 * @param {string} property Name des abzufragenden Properties.
	 * @param {string} def Optionale Anagbe eines Default-Wertes
	 * für den Fall, dass das Property nicht gefunden wurde.
	 * Wenn dieser Parameter fehlt, wird in diesem Fall
	 * <code>null</code> zurückgegeben.
	 */
	getString : function(property, def)
	{
		if(this._data && this._data[property] !== undefined /*&& typeof this._data[property] == "string"*/)
			return '' + this._data[property];
		return (def !== undefined ? def : null);
	},
	
	/**
	 * Gibt den Wert eines ganzzahligen Properties aus dem Response
	 * zurück.
	 * @param {string} property Name des abzufragenden Properties.
	 * @param {number} def Default-Wert für den Fall, dass das Property
	 * nicht gefunden wird (optional).
	 * @return {number} Der ganzzahlige Wert oder der in <code>def</code>
	 * angegebene Default-Wert. Falls letzterer nicht angegeben wurde,
	 * wird bei fehlendem Property <code>null</code> zurückgegeben.
	 */
	getInt : function(property, def)
	{
		if(this._data && this._data[property] !== undefined)
		{
			if(typeof this._data[property] == "string")
			{
				var v = parseInt(this._data[property]);
				if(v != Number.NaN)
					return v;
			}
			else if(typeof this._data[property] == "number")
				return this._data[property];
		}
		return (def !== undefined ? def : null);
	},
	
	/**
	 * Gibt den Wert eines Fließkomma-Properties aus dem Response
	 * zurück.
	 * @param {string} property Name des abzufragenden Properties.
	 * @param {number} def Default-Wert für den Fall, dass das Property
	 * nicht gefunden wird (optional).
	 * @return {number} Der Gleitkommawert oder der in <code>def</code>
	 * angegebene Default-Wert. Falls letzterer nicht angegeben wurde,
	 * wird bei fehlendem Property <code>null</code> zurückgegeben.
	 */
	getFloat : function(property, def)
	{
		if(this._data && this._data[property] !== undefined)
		{
			if(typeof this._data[property] == "string")
			{
				var v = parseFloat(this._data[property]);
				if(v != Number.NaN)
					return v;
			}
			else if(typeof this._data[property] == "number")
				return this._data[property];
		}
		return (def !== undefined ? def : null);
	},
	
	/**
	 * Gibt ein <code>PDObject</code> zurück oder <code>null</code>,
	 * wenn das Property nicht gefunden wurde.
	 * @param {string} property Name des abzufragenden Properties.
	 * @param {PDObject} def Default-Wert für den Fall, dass das Property
	 * nicht gefunden wird (optional).
	 * @return {PDObject} Das Fachkonzeptobjekt oder der bei <code>def</code>
	 * angegebene Default-Wert oder <code>null</code>.
	 */
	getPDObject : function(property, def)
	{
		if(this._data && this._data[property] && typeof this._data[property] == "object")
		{
			var tmp = this.PDClass.toPDObject(this._data[property]);
			if(tmp instanceof PDObject)
				return tmp;
		}
		return (def !== undefined ? def : null);
	},
	
	/**
	 * Gibt ein Array-Property zurück, falls es
	 * existiert.
	 * @param {string} property Name des abzufragenden Properties.
	 * @param {Array} def Optionale Angabe eines Default-Wertes
	 * für den Fall, dass das Property nicht gefunden wurde.
	 * Wenn dieser Parameter fehlt, wird in diesem Fall
	 * ein leeres Array zurückgegeben.
	 * @param {string} elementType Optionale Angabe für den Datentyp
	 * der Array-Elemente. Erlaubt sind die Werte "PDObject" sowie
	 * die vom JavaScript-Operator <code>typeof</code> verstandenen
	 * Werte.
	 * @param {mixed} elementDef Optionale Angabe eines Wertes für die Elemente,
	 * die keinen nach <code>elementType</code> gültigen Datentyp besitzen.
	 * @return {Array} Array mit Elementen des angegebenen Typs. 
	 */
	getArray : function(property, def, elementType, elementDef)
	{
		if(this._data && this._data[property] && JafWeb.isArray(this._data[property]))
		{
			if(!elementType)
				return this._data[property];
			var tmp = new Array();
			for(var i=0; i<this._data[property].length; i++)
			{
				if(elementType == "PDObject")
				{
					var tmpObj = this.PDClass.toPDObject(this._data[property][i]);
					if(JafWeb.isPDObject(tmpObj))
						tmp.push(tmpObj);
					else if(elementDef !== undefined)
						tmp.push(elementDef);
					else
						tmp.push(null);
				}
				else if(typeof (this._data[property][i]) == elementType)
					tmp.push(this._data[property][i]);
				else if(elementDef !== undefined)
					tmp.push(elementDef);
				else
					tmp.push(null); // oder besser gar nicht einfuegen???
			}
			return tmp;
		}
		return (def !== undefined ? def : new Array());
	},
	
	/**
	 * Gibt numerischen Fehlercode zurück.
	 * Falls keiner existiert, wird <code>0</code>
	 * zurückgegeben.
	 * @return {number} Der Fehler-Code.
	 */
	getErrorCode : function()
	{
		return (this._data.retCode || 0);
	},
	
	/**
	 * Gibt Fehlermeldung zurück, falls eine existiert.
	 * Andernfalls wird ein Leerstring zurückgegeben.
	 * @return {string} Der Fehlertext. Falls keiner existiert,
	 * wird ein Leerstring zurückgegeben.
	 */
	getErrorMessage : function()
	{
		if(this.errMsg)
			return this.errMsg;
		if(this._data && this._data.errMsg)
			return this._data.errMsg;
		if(this._data && JafWeb.isArray(this._data._errMsgs) && this._data._errMsgs.length > 0)
			return this._data._errMsgs[0];
		return '';
	},
	
	/**
	 * Gibt ein Array mit Fehlermeldungen zurück.
	 * Falls keine Fehlermeldung existiert, wird ein leeres
	 * Array zurückgegeben.
	 * @return {string[]} Die Fehlertexte oder ein leeres Array.
	 */
	getErrorMessages : function()
	{
		var msgs = (this._data && JafWeb.isArray(this._data._errMsgs) ? this._data._errMsgs : []);
		if(this.errMsg)
			msgs.push(this.errMsg);
		else if(this._data.errMsg)
			msgs.push(this._data.errMsg);
		return msgs;
	},
	
	/**
	 * Fehler aufgetreten?
	 * @return {boolean} <code>true</code>, falls ein Fehler aufgetreten ist.
	 */
	hasError : function()
	{
		return (!this._data || this.hasErrorMessage());
	},

	/**
	 * Gibt es Fehlermeldungen?
	 * @return {boolean} <code>true</code>, falls es Fehlermeldungen gibt.
	 */
	hasErrorMessage : function()
	{
		return (this._data &&
				(this._data.errMsg ||
				(this._data._errMsgs && this._data._errMsgs.length > 0)));
	},

	/**
	 * Ist ein schwerer Fehler aufgetreten, der nicht mehr
	 * sinnvoll von der Anwendung behandelt werden kann?
	 * Falls das der Fall ist, wird der globale Fehler-Mechanismus
	 * (siehe <code>UIApplication.onNetworkError()</code>) ausgelöst
	 * und es dürfen keine weiteren Ausgaben gemacht werden. Das
	 * <code>JResponse</code>-Objekt ist möglicherweise ungültig.
	 * @return {boolean} <code>true</code>, falls ein nicht behebbarer Fehler
	 * aufgetreten ist.
	 */
	hasFatalError : function()
	{
		return (!this._data);
	},

	/**
	 * Gibt es Warnungen?
	 * @return {boolean} <code>true</code>, falls es Warnmeldungen gibt.
	 */
	hasWarning : function()
	{
		return (this._data &&
				((this._data.warn && this._data.warn != '') ||
				(this._data.warns && this._data.warns.length > 0)));
	},

	/**
	 * Gibt es Nachrichten aus diesem Response?
	 * @return {boolean} <code>true</code>, falls es Informationsmeldungen gibt.
	 */
	hasInfo : function()
	{
		return (this._data &&
				((this._data.info && this._data.info != '') ||
				(this._data.infos && this._data.infos.length > 0)));
	},

	/**
	 * Gibt die Reponse-Rohdaten zurück.
	 * @treturn String Die Daten.
	 */
	getResponseText : function()
	{
		return this._responseText;
	}
}






var JUtil = (JUtil || {});
//
// Allgemeine Basis - oberhalb von UI/PD - fuer's JafWeb.
// Erweiterungen fuer ExtJS geheoeren NICHT hierher!
//
JUtil.base64 = {

	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	/**
	 * Einen Base64-kodierten Wert in einen String dekodieren.<br/>
	 * <span class="important">Hinweis:</span> ECMA Script schreibt vor, dass
	 * JavaScript-Strings UTF-16-kodiert sind (<a href="http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf">ECMA 262</a>,
	 * Seite 158). Das kann zu Problemen führen, wenn
	 * ein auf Server-Seite mit <code>PDTools.base64Encode()</code> kodierter
	 * String in der JafWeb-UI wieder dekodiert werden soll! Siehe
	 * <a href="http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings">
	 * http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings</a>
	 * @param {string} input Base64-kodierte Eingabe.
	 * @return {string} Das UTF8-kodierte Ergebnis.
	 */
	base64ToUtf8 : function(input) {
		input = input.replace(/\s/g, '');
		return decodeURIComponent(escape(this.decode(input)));
	},

	/**
	 * Einen String in einen Base64-kodierten Wert enkodieren.<br/>
	 * @param {string} input Der Eingabe-String (als Encoding gilt immer UTF-8).
	 * @return {string} Das Base64-kodierte Ergebnis. Dieses kann in einer
	 * JANUS-<em>UnicodeApplication</em> mit <code>PDTools::base64Decode()</code>
	 * wieder in einen UTF-8-String gewandelt werden.
	 */
	utf8ToBase64 : function(input) {
		return this.encode(unescape(encodeURIComponent(input)));
	},
	
	/**
	 * 
	 * @param {string} input Eingabe.
	 * @return {string} Ergebnis
	 */
	encode : function (input) {
		if(typeof window['btoa'] == 'function')
			return window.btoa(input);
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		//input = Ext.util.base64._utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
		}
		return output;
	},
	
	/**
	 * Einen Base64-kodierten Wert in einen String dekodieren.
	 * <span class="important">Hinweis:</span>
	 * <a href="http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings">
	 * http://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings</a>
	 
	 * @param {string} input Eingabe.
	 * @return {string} Ergebnis
	 */
	decode : function (input) {
		if(typeof window['atob'] == 'function')
			return window.atob(input);
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		//output = Ext.util.base64._utf8_decode(output);
		return output;
	},
	
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
		}
		return utftext;
	},

	_b64_to_utf8 : function( str ) {
		return decodeURIComponent(escape(window.atob( str )));
	},
	
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};

JUtil.MD5 = function(s,raw,hexcase,chrsz) {
	raw = raw || false;	
	hexcase = hexcase || false;
	chrsz = chrsz || 8;

	function safe_add(x, y){
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
	function bit_rol(num, cnt){
		return (num << cnt) | (num >>> (32 - cnt));
	}
	function md5_cmn(q, a, b, x, s, t){
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
	}
	function md5_ff(a, b, c, d, x, s, t){
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t){
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t){
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t){
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	}

	function core_md5(x, len){
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;
		var a =  1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d =  271733878;
		for(var i = 0; i < x.length; i += 16){
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
			d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
			b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
			d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
			c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
			d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
			d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);
			a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
			d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
			c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
			b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
			a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
			d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
			c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
			d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
			c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
			a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
			d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
			c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
			b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);
			a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
			d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
			b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
			d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
			c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
			d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
			c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
			a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
			d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
			b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);
			a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
			d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
			c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
			d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
			d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
			a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
			d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
			b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);
			a = safe_add(a, olda);
			b = safe_add(b, oldb);
			c = safe_add(c, oldc);
			d = safe_add(d, oldd);
		}
		return [a, b, c, d];
	}
	function str2binl(str){
		var bin = [];
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
		}
		return bin;
	}
	function binl2str(bin){
		var str = "";
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < bin.length * 32; i += chrsz) {
			str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
		}
		return str;
	}
	
	function binl2hex(binarray){
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) + hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
		}
		return str;
	}
	return (raw ? binl2str(core_md5(str2binl(s), s.length * chrsz)) : binl2hex(core_md5(str2binl(s), s.length * chrsz))	);
};
