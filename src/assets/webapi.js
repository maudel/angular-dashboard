/**
 * Definition der Web-Requests und Parameter.
 * Wird fuer PDClasses.js eingebunden.
 * Vgl. <a href="webapi.html" target="_blank">Dokumentation</a>.<br/>
 * API-Version 15, generiert Mon 26.06.2017
 */
var JafWebAPI =
{
	"API_version": 15,
	"PROP_errMsg" : "errMsg",
	"PROP_retCode" : "retCode",
	"PROP_retMsg" : "retMsg",
	"PDMeta" : {
		"load": {
			"eventName": "PDMeta.load",
			"PROP__apiVersion": "_apiVersion",
			"PROP__instanceID": "_instanceID",
			"PROP__multilang2": "_multilang2",
			"PROP__classes": "_classes",
			"PROP__superClasses": "_superClasses",
			"PROP__subClasses": "_subClasses",
			"PROP__strings": "_strings",
			"PROP__numStrings": "_numStrings",
			"PROP__numErrorMessages": "_numErrorMessages",
			"PROP__stringsIdent": "_stringsIdent",
			"PROP__stringsIndex": "_stringsIndex",
			"PROP__errorMessages": "_errorMessages",
			"PROP__shortLang": "_shortLang",
			"PROP__languages": "_languages",
			"PROP__numLanguages": "_numLanguages",
			"PROP__actLang": "_actLang",
			"PROP__copyright": "_copyright",
			"PROP__about": "_about",
			"PROP__version": "_version",
			"PROP__infobarText": "_infobarText",
			"PROP__eModel": "_eModel",
			"PROP__classes_stereo": "_classes_stereo",
			"PROP__classes_s": "_classes_s",
			"PROP__classes_l": "_classes_l",
			"PROP__classes_d": "_classes_d",
			"PROP__classes_f": "_classes_f",
			"PROP__modelId1": "_modelId1",
			"PROP__modelId2": "_modelId2"
		},
		"load2": {
			"eventName": "PDMeta.load2"
		},
		"getIcon": {
			"eventName": "PDMeta.getIcon",
			"PAR_iconId": "iconId",
			"PROP_icon": "icon"
		},
		"getClassIcon": {
			"eventName": "PDMeta.getClassIcon",
			"PAR_iconId": "iconId",
			"PROP_icon": "icon"
		},
		"checkRequestAPI": {
			"eventName": "PDMeta.checkRequestAPI",
			"PAR_clientVersion": "clientVersion",
			"PROP_result": "result"
		}
	},
	"PDClass" : {
		"jexecUpload": {
			"eventName": "PDClass.jexecUpload",
			"PAR_attr": "attr",
			"PAR_baseDir": "baseDir",
			"PAR_path": "path",
			"PAR_tooid": "tooid",
			"PAR_tocid": "tocid",
			"PAR_toclass": "toclass",
			"PAR_UPLOADED_FILE": "UPLOADED_FILE",
			"PROP_success": "success",
			"PROP_errors": "errors",
			"PROP_filename": "filename"
		},
		"removeUploadedFile": {
			"eventName": "PDClass.removeUploadedFile",
			"PAR_attr": "attr",
			"PAR_baseDir": "baseDir",
			"PAR_path": "path",
			"PAR_tooid": "tooid",
			"PAR_tocid": "tocid",
			"PAR_toclass": "toclass",
			"PAR_file": "file",
			"PROP_success": "success",
			"PROP_errors": "errors"
		},
		"jexecDownload": {
			"eventName": "PDClass.jexecDownload",
			"PAR_path": "path",
			"PAR_file": "file",
			"PAR_filepath": "filepath",
			"PAR_attr": "attr",
			"PAR_oid": "oid",
			"PAR_cid": "cid",
			"PAR_clName": "clName",
			"PAR_oidLow": "oidLow",
			"PAR_janusServerPageEvent": "janusServerPageEvent",
			"PAR_del": "del"
		},
		"getJanusServerPage": {
			"eventName": "PDClass.getJanusServerPage",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidHi": "oidHi",
			"PAR_oidLow": "oidLow",
			"PAR_imgPath": "imgPath",
			"PAR_templ": "templ",
			"PAR_pid": "pid",
			"PAR_webEvent": "webEvent"
		},
		"janusServerPageParse": {
			"eventName": "PDClass.janusServerPageParse",
			"PAR_imgPath": "imgPath",
			"PAR_templ": "templ",
			"PAR_pid": "pid"
		},
		"janusServerPageFromOp": {
			"eventName": "PDClass.janusServerPageFromOp",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidHi": "oidHi",
			"PAR_oidLow": "oidLow",
			"PAR_op": "op",
			"PAR_imgPath": "imgPath",
			"PAR_templ": "templ",
			"PAR_pid": "pid",
			"PAR_inStr": "inStr",
			"PAR_inPdo": "inPdo"
		},
		"getJanusServerStartPage": {
			"eventName": "PDClass.getJanusServerStartPage",
			"PAR_imgPath": "imgPath",
			"PAR_pid": "pid"
		},
		"deleteObject": {
			"eventName": "PDClass.deleteObject",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PAR_md5": "md5",
			"PAR_tid": "tid"
		},
		"prepareDeletion": {
			"eventName": "PDClass.prepareDeletion",
			"PAR_oids": "oids",
			"PAR_transObj": "transObj",
			"PROP_count": "count",
			"PROP_failedAt": "failedAt",
			"PROP_classes": "classes"
		},
		"newObject": {
			"eventName": "PDClass.newObject",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PROP_obj": "obj"
		},
		"startNewTransaction": {
			"eventName": "PDClass.startNewTransaction",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_tid": "tid",
			"PAR_allAttrs": "allAttrs",
			"PAR_attrs": "attrs",
			"PAR_allTo1Rels": "allTo1Rels",
			"PAR_rels": "rels",
			"PROP_transObj": "transObj",
			"PROP_lockId": "lockId",
			"PROP_lockInfo": "lockInfo"
		},
		"startTransaction": {
			"eventName": "PDClass.startTransaction",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PAR_tid": "tid",
			"PAR_allAttrs": "allAttrs",
			"PAR_attrs": "attrs",
			"PAR_allTo1Rels": "allTo1Rels",
			"PAR_rels": "rels",
			"PROP_lockInfo": "lockInfo",
			"PROP_transObj": "transObj",
			"PROP_realObj": "realObj",
			"PROP_lockId": "lockId"
		},
		"changePassword": {
			"eventName": "PDClass.changePassword",
			"PAR_uid": "uid",
			"PAR_passw": "passw",
			"PAR_newPassw": "newPassw",
			"PAR_passwRetype": "passwRetype",
			"PAR_crypted": "crypted",
			"PROP_focus": "focus"
		},
		"changeUser": {
			"eventName": "PDClass.changeUser",
			"PAR_loginName": "loginName",
			"PAR_passw": "passw",
			"PAR_princ": "princ",
			"PAR_lang": "lang",
			"PAR_client": "client",
			"PROP_changeUserRes": "changeUserRes",
			"PROP_changeUserMsg": "changeUserMsg",
			"PROP_changePrincRes": "changePrincRes",
			"PROP_changePrincMsg": "changePrincMsg",
			"PROP_sessionId": "sessionId"
		},
		"deleteUser": {
			"eventName": "PDClass.deleteUser"
		},
		"getUserId": {
			"eventName": "PDClass.getUserId",
			"PAR_name": "name",
			"PROP_id": "id"
		},
		"getUserName": {
			"eventName": "PDClass.getUserName",
			"PAR_uid": "uid",
			"PROP_name": "name"
		},
		"motd": {
			"eventName": "PDClass.motd",
			"PROP_motd": "motd"
		},
		"userSettings": {
			"eventName": "PDClass.userSettings",
			"PAR_login": "login",
			"PROP_login": "login",
			"PROP_fullname": "fullname",
			"PROP_passExp": "passExp",
			"PROP_accExp": "accExp"
		},
		"callOperation": {
			"eventName": "PDClass.callOperation",
			"PAR_op": "op",
			"PAR_inStr": "inStr",
			"PAR_inPdo": "inPdo",
			"PAR_async": "async",
			"PROP_OUTSTR": "OUTSTR",
			"PROP_OUTPDO": "OUTPDO"
		},
		"changePrincipal": {
			"eventName": "PDClass.changePrincipal"
		},
		"getPrincipalFullname": {
			"eventName": "PDClass.getPrincipalFullname",
			"PAR_pid": "pid",
			"PROP_name": "name"
		},
		"getPrincipalId": {
			"eventName": "PDClass.getPrincipalId",
			"PAR_name": "name",
			"PROP_pid": "pid"
		},
		"getPrincipalName": {
			"eventName": "PDClass.getPrincipalName",
			"PAR_pid": "pid",
			"PROP_name": "name"
		},
		"getPrincipalsForUser": {
			"eventName": "PDClass.getPrincipalsForUser"
		},
		"setPrincipalName": {
			"eventName": "PDClass.setPrincipalName"
		},
		"setPrincipalsForUser": {
			"eventName": "PDClass.setPrincipalsForUser"
		},
		"setUsersForPrincipal": {
			"eventName": "PDClass.setUsersForPrincipal"
		},
		"checkLock": {
			"eventName": "PDClass.checkLock"
		},
		"lockInfo": {
			"eventName": "PDClass.lockInfo",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PROP_client": "client",
			"PROP_user": "user",
			"PROP_locktime": "locktime",
			"PROP_uid": "uid"
		},
		"ptr": {
			"eventName": "PDClass.ptr",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PAR_allAttrs": "allAttrs",
			"PAR_attrs": "attrs",
			"PAR_allTo1Rels": "allTo1Rels",
			"PAR_rels": "rels",
			"PROP_obj": "obj"
		},
		"ptrs": {
			"eventName": "PDClass.ptrs",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PAR_allAttrs": "allAttrs",
			"PAR_attrs": "attrs",
			"PAR_allTo1Rels": "allTo1Rels",
			"PAR_rels": "rels",
			"PROP_objs": "objs"
		},
		"findObjects": {
			"eventName": "PDClass.findObjects",
			"PAR_classes": "classes",
			"PAR_value": "value",
			"PAR_maxLen": "maxLen",
			"PAR_maxRes": "maxRes",
			"PAR_startRes": "startRes",
			"PAR_asOidList": "asOidList",
			"PAR_imgPath": "imgPath",
			"PAR_pid": "pid",
			"PROP_oids": "oids"
		},
		"getExtent": {
			"eventName": "PDClass.getExtent",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_filter": "filter",
			"PAR_thisPdo": "thisPdo",
			"PAR_sort": "sort",
			"PAR_blockSize": "blockSize",
			"PAR_blockNo": "blockNo",
			"PAR_from": "from",
			"PAR_to": "to",
			"PAR_infoOnly": "infoOnly",
			"PAR_info": "info",
			"PAR_attr": "attr",
			"PAR_asArr": "asArr",
			"PROP_rows": "rows",
			"PROP_blockSize": "blockSize",
			"PROP_blockNo": "blockNo",
			"PROP_total": "total"
		},
		"exportExtent": {
			"eventName": "PDClass.exportExtent",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_attr": "attr",
			"PAR_filter": "filter",
			"PAR_thisPdo": "thisPdo",
			"PAR_sort": "sort",
			"PAR_exportFormat": "exportFormat",
			"PAR_xsl": "xsl",
			"PAR_viewname": "viewname",
			"PAR_guiLabels": "guiLabels",
			"PAR_resDir": "resDir"
		},
		"getExtentGroups": {
			"eventName": "PDClass.getExtentGroups",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_groupBy": "groupBy",
			"PAR_filter": "filter",
			"PAR_thisOid": "thisOid",
			"PROP_infos": "infos"
		},
		"getSingleton": {
			"eventName": "PDClass.getSingleton",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PROP_obj": "obj"
		},
		"isUnique": {
			"eventName": "PDClass.isUnique",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PAR_attr": "attr",
			"PAR_val": "val",
			"PROP_result": "result"
		},
		"countObjects": {
			"eventName": "PDClass.countObjects",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_sel": "sel",
			"PAR_thisOid": "thisOid",
			"PROP_count": "count"
		},
		"getEnumCode": {
			"eventName": "PDClass.getEnumCode",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_attr": "attr",
			"PAR_lang": "lang",
			"PAR_enumVal": "enumVal",
			"PROP_code": "code"
		},
		"getEnumConst": {
			"eventName": "PDClass.getEnumConst",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_attr": "attr",
			"PAR_icns": "icns",
			"PROP_values": "values",
			"PROP_icons": "icons",
			"PROP_extensible": "extensible"
		},
		"getGlobalEnumConst": {
			"eventName": "PDClass.getGlobalEnumConst",
			"PAR_ename": "ename",
			"PAR_icns": "icns",
			"PAR_tech": "tech",
			"PROP_values": "values",
			"PROP_codes": "codes",
			"PROP_active": "active",
			"PROP_tech": "tech",
			"PROP_icons": "icons",
			"PROP_extensible": "extensible"
		},
		"getCurrencies": {
			"eventName": "PDClass.getCurrencies",
			"PROP_names": "names",
			"PROP_values": "values",
			"PROP_prec": "prec"
		},
		"getAttribute": {
			"eventName": "PDClass.getAttribute",
			"PAR_cattr": "cattr",
			"PROP_value": "value",
			"PROP_flags": "flags"
		},
		"setAttribute": {
			"eventName": "PDClass.setAttribute",
			"PAR_cattr": "cattr",
			"PAR_value": "value"
		},
		"moveInExtent": {
			"eventName": "PDClass.moveInExtent",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oids": "oids",
			"PAR_idx": "idx",
			"PROP_retMsg": "retMsg"
		},
		"checkTransactions": {
			"eventName": "PDClass.checkTransactions",
			"PROP_trans": "trans"
		},
		"checkTransaction": {
			"eventName": "PDClass.checkTransaction",
			"PAR_tid": "tid",
			"PROP_tid": "tid",
			"PROP_lockid": "lockid",
			"PROP_count": "count",
			"PROP_childTrans": "childTrans"
		}
	},
	"PDObject" : {
			"PAR_object": "object",
			"PAR_oid": "oid",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidHi": "oidHi",
			"PAR_oidLow": "oidLow",
			"PAR_tid": "tid",
	
		"deleteConnected": {
			"eventName": "PDObject.deleteConnected",
			"PAR_relname": "relname",
			"PAR_relOid": "relOid",
			"PAR_tid": "tid"
		},
		"connect": {
			"eventName": "PDObject.connect",
			"PAR_relname": "relname",
			"PAR_relOid": "relOid",
			"PAR_lockId": "lockId",
			"PROP_card": "card",
			"PROP_invCard": "invCard",
			"PROP_invRole": "invRole"
		},
		"disconnect": {
			"eventName": "PDObject.disconnect",
			"PAR_relname": "relname",
			"PAR_relOid": "relOid",
			"PAR_lockId": "lockId",
			"PROP_card": "card",
			"PROP_invCard": "invCard",
			"PROP_invRole": "invRole"
		},
		"getAttribute": {
			"eventName": "PDObject.getAttribute",
			"PAR_attr": "attr",
			"PROP_value": "value",
			"PROP_flags": "flags"
		},
		"getAttributes": {
			"eventName": "PDObject.getAttributes",
			"PAR_attr": "attr",
			"PROP_values": "values",
			"PROP_flags": "flags",
			"PROP_count": "count"
		},
		"setAttribute": {
			"eventName": "PDObject.setAttribute",
			"PAR_attr": "attr",
			"PAR_value": "value",
			"PROP_value": "value",
			"PROP_flags": "flags"
		},
		"getEnumConst": {
			"eventName": "PDObject.getEnumConst",
			"PAR_attr": "attr",
			"PAR_icns": "icns",
			"PROP_res": "res",
			"PROP_icons": "icons",
			"PROP_extensible": "extensible"
		},
		"countObjects": {
			"eventName": "PDObject.countObjects",
			"PAR_relname": "relname",
			"PAR_filter": "filter",
			"PAR_thisPdo": "thisPdo",
			"PROP_count": "count"
		},
		"countObjectsMulti": {
			"eventName": "PDObject.countObjectsMulti",
			"PAR_relname": "relname",
			"PAR_filter": "filter",
			"PROP_count": "count"
		},
		"getFirstLink": {
			"eventName": "PDObject.getFirstLink",
			"PAR_relname": "relname",
			"PROP_relObj": "relObj",
			"PROP_flags": "flags"
		},
		"setFirstLink": {
			"eventName": "PDObject.setFirstLink",
			"PAR_relname": "relname",
			"PAR_relOid": "relOid",
			"PROP_card": "card",
			"PROP_invCard": "invCard",
			"PROP_invRole": "invRole"
		},
		"abortTransaction": {
			"eventName": "PDObject.abortTransaction",
			"PAR_rec": "rec",
			"PAR_holdTrans": "holdTrans",
			"PAR_lockId": "lockId",
			"PROP_transObj": "transObj",
			"PROP_errMsgs": "errMsgs"
		},
		"checkConstraints": {
			"eventName": "PDObject.checkConstraints",
			"PAR_object": "object",
			"PAR_clName": "clName",
			"PAR_rec": "rec",
			"PAR_stopOnError": "stopOnError",
			"PAR_andCommit": "andCommit",
			"PAR_holdTrans": "holdTrans",
			"PAR_tid": "tid",
			"PAR_lockId": "lockId",
			"PAR_strat": "strat",
			"PROP_errMsgs": "errMsgs",
			"PROP_warnMsgs": "warnMsgs",
			"PROP_transObj": "transObj",
			"PROP_realObj": "realObj"
		},
		"callOperation": {
			"eventName": "PDObject.callOperation",
			"PAR_op": "op",
			"PAR_inStr": "inStr",
			"PAR_inPdo": "inPdo",
			"PAR_async": "async",
			"PAR_lockId": "lockId",
			"PROP_lockInfo": "lockInfo",
			"PROP_obj": "obj",
			"PROP_OUTSTR": "OUTSTR",
			"PROP_OUTPDO": "OUTPDO"
		},
		"isUptodate": {
			"eventName": "PDObject.isUptodate",
			"PAR_md5": "md5",
			"PROP_res": "res"
		},
		"getExtent": {
			"eventName": "PDObject.getExtent",
			"PAR_relname": "relname",
			"PAR_filter": "filter",
			"PAR_thisPdo": "thisPdo",
			"PAR_sort": "sort",
			"PAR_blockSize": "blockSize",
			"PAR_blockNo": "blockNo",
			"PAR_from": "from",
			"PAR_to": "to",
			"PAR_infoOnly": "infoOnly",
			"PAR_info": "info",
			"PAR_attr": "attr",
			"PROP_rows": "rows",
			"PROP_blockSize": "blockSize",
			"PROP_blockNo": "blockNo",
			"PROP_total": "total"
		},
		"getConnectedOids": {
			"eventName": "PDObject.getConnectedOids",
			"PAR_relname": "relname",
			"PROP_oids": "oids"
		},
		"getExtentGroups": {
			"eventName": "PDObject.getExtentGroups"
		},
		"getStatus": {
			"eventName": "PDObject.getStatus",
			"PAR_patt": "patt",
			"PROP_value": "value"
		},
		"moveInRelation": {
			"eventName": "PDObject.moveInRelation",
			"PAR_relname": "relname",
			"PAR_oids": "oids",
			"PAR_idx": "idx",
			"PROP_retMsg": "retMsg"
		},
		"sync": {
			"eventName": "PDObject.sync",
			"PAR_object": "object",
			"PAR_clName": "clName",
			"PAR_lockId": "lockId",
			"PAR_tid": "tid"
		}
	},
	"PDProperties" : {
		"load": {
			"eventName": "PDProperties.load"
		},
		"get": {
			"eventName": "PDProperties.get",
			"PAR_key": "key"
		},
		"set": {
			"eventName": "PDProperties.set"
		},
		"contains": {
			"eventName": "PDProperties.contains",
			"PAR_key": "key",
			"PROP_result": "result"
		},
		"remove": {
			"eventName": "PDProperties.remove",
			"PAR_key": "key"
		},
		"clear": {
			"eventName": "PDProperties.clear",
			"PAR_uid": "uid"
		}
	},
	"PDTools" : {
		"getUnique": {
			"eventName": "PDTools.getUnique",
			"PAR_alpha": "alpha",
			"PROP_res": "res"
		},
		"createTempNameOnServer": {
			"eventName": "PDTools.createTempNameOnServer",
			"PAR_prefix": "prefix",
			"PAR_ext": "ext",
			"PROP_res": "res"
		},
		"isValidUserName": {
			"eventName": "PDTools.isValidUserName",
			"PAR_name": "name",
			"PROP_res": "res"
		},
		"isValidPrincipalName": {
			"eventName": "PDTools.isValidPrincipalName",
			"PAR_name": "name",
			"PROP_res": "res"
		},
		"isValidPassword": {
			"eventName": "PDTools.isValidPassword",
			"PAR_passw": "passw",
			"PAR_uid": "uid",
			"PAR_login": "login",
			"PAR_name": "name",
			"PROP_res": "res"
		},
		"passwordError": {
			"eventName": "PDTools.passwordError",
			"PAR_msgId": "msgId",
			"PROP_res": "res"
		},
		"transcode": {
			"eventName": "PDTools.transcode",
			"PAR_src": "src",
			"PAR_srcEnc": "srcEnc",
			"PAR_destEnc": "destEnc",
			"PROP_res": "res"
		},
		"getCSVFields": {
			"eventName": "PDTools.getCSVFields",
			"PAR_fname": "fname",
			"PAR_sep": "sep",
			"PAR_delim": "delim",
			"PAR_mask": "mask",
			"PAR_newline": "newline",
			"PROP_res": "res"
		},
		"DEB": {
			"eventName": "PDTools.DEB",
			"PAR_info": "info"
		},
		"LEVEL": {
			"eventName": "PDTools.LEVEL",
			"PAR_sel": "sel"
		},
		"DEBFILE": {
			"eventName": "PDTools.DEBFILE",
			"PAR_name": "name"
		},
		"testResult": {
			"eventName": "PDTools.testResult",
			"PAR_info": "info"
		}
	},
	"ClientInfo" : {
		"ping": {
			"eventName": "ClientInfo.ping"
		},
		"load": {
			"eventName": "ClientInfo.load",
			"PROP__dateformat": "_dateformat",
			"PROP__timeformat": "_timeformat",
			"PROP__timestampformat": "_timestampformat",
			"PROP__decimalsign": "_decimalsign",
			"PROP__floatgroupsign": "_floatgroupsign",
			"PROP__currencygroupsign": "_currencygroupsign",
			"PROP__falsevalue": "_falsevalue",
			"PROP__truevalue": "_truevalue"
		},
		"getUserObject": {
			"eventName": "ClientInfo.getUserObject",
			"PAR_allAttrs": "allAttrs",
			"PAR_attrs": "attrs",
			"PAR_allTo1Rels": "allTo1Rels",
			"PAR_rels": "rels",
			"PROP_obj": "obj"
		},
		"getPrincipalObject": {
			"eventName": "ClientInfo.getPrincipalObject",
			"PROP_obj": "obj"
		},
		"setLanguage": {
			"eventName": "ClientInfo.setLanguage",
			"PAR_lang": "lang"
		},
		"getLanguage": {
			"eventName": "ClientInfo.getLanguage",
			"PROP_code": "code"
		},
		"getAttrPermission": {
			"eventName": "ClientInfo.getAttrPermission",
			"PAR_clName": "clName",
			"PAR_oidLow": "oidLow",
			"PAR_attr": "attr",
			"PROP_res": "res"
		},
		"getRelPermission": {
			"eventName": "ClientInfo.getRelPermission",
			"PAR_clName": "clName",
			"PAR_oidLow": "oidLow",
			"PAR_relname": "relname",
			"PROP_res": "res"
		},
		"getExecPermission": {
			"eventName": "ClientInfo.getExecPermission",
			"PAR_clName": "clName",
			"PAR_oidLow": "oidLow",
			"PAR_opname": "opname",
			"PROP_res": "res"
		},
		"getCreatePermission": {
			"eventName": "ClientInfo.getCreatePermission",
			"PAR_clName": "clName",
			"PROP_res": "res"
		},
		"getIteratePermission": {
			"eventName": "ClientInfo.getIteratePermission",
			"PAR_clName": "clName",
			"PROP_res": "res"
		},
		"getDelPermission": {
			"eventName": "ClientInfo.getDelPermission",
			"PAR_clName": "clName",
			"PAR_oidLow": "oidLow",
			"PROP_res": "res"
		},
		"startTransaction": {
			"eventName": "ClientInfo.startTransaction",
			"PAR_tid": "tid",
			"PROP_tid": "tid"
		},
		"commitTransaction": {
			"eventName": "ClientInfo.commitTransaction",
			"PAR_tid": "tid",
			"PAR_oid": "oid",
			"PAR_force": "force",
			"PROP_realObj": "realObj",
			"PROP_commitRes": "commitRes",
			"PROP_errMsgs": "errMsgs",
			"PROP_warnMsgs": "warnMsgs",
			"PROP_delOids": "delOids"
		},
		"abortTransaction": {
			"eventName": "ClientInfo.abortTransaction",
			"PAR_tid": "tid",
			"PROP_oids": "oids"
		},
		"removeFromTransaction": {
			"eventName": "ClientInfo.removeFromTransaction",
			"PAR_tid": "tid",
			"PAR_oid": "oid"
		}
	},
	"PDWizard" : {
		"complete": {
			"eventName": "PDWizard.complete"
		},
		"getControlData": {
			"eventName": "PDWizard.getControlData",
			"PAR_vals": "vals",
			"PAR_props": "props",
			"PAR_dlgobj": "dlgobj"
		},
		"setControlData": {
			"eventName": "PDWizard.setControlData"
		}
	},
	"PDTree" : {
		"getNodeData": {
			"eventName": "PDTree.getNodeData",
			"PAR_nType": "nType",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oid": "oid",
			"PAR_assoc": "assoc",
			"PAR_filter": "filter",
			"PAR_sort": "sort",
			"PAR_opname": "opname",
			"PAR_depth": "depth",
			"PAR_tree": "tree",
			"PAR_iconPath": "iconPath",
			"PROP_nType": "nType",
			"PROP_text": "text",
			"PROP_count": "count",
			"PROP_leaf": "leaf",
			"PROP_clName": "clName",
			"PROP_viewname": "viewname",
			"PROP_oid": "oid",
			"PROP_assoc": "assoc",
			"PROP_filter": "filter",
			"PROP_sort": "sort",
			"PROP_opname": "opname",
			"PROP_flags": "flags",
			"PROP_icon": "icon",
			"PROP_children": "children"
		},
		"getTreeData": {
			"eventName": "PDTree.getTreeData",
			"PAR_tree": "tree",
			"PAR_iconPath": "iconPath"
		},
		"getCount": {
			"eventName": "PDTree.getCount",
			"PAR_nType": "nType",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oid": "oid",
			"PAR_assoc": "assoc",
			"PAR_filter": "filter",
			"PAR_tree": "tree",
			"PROP_count": "count"
		}
	},
	"PDChart" : {
		"getChartData": {
			"eventName": "PDChart.getChartData",
			"PAR_type": "type",
			"PAR_clName": "clName",
			"PAR_xattr": "xattr",
			"PAR_desc": "desc",
			"PAR_oid": "oid",
			"PAR_oidHi": "oidHi",
			"PAR_oidLow": "oidLow",
			"PAR_relName": "relName",
			"PAR_filter": "filter",
			"PAR_cats": "cats",
			"PAR_ser": "ser",
			"PAR_attrs": "attrs",
			"PAR_serfilt": "serfilt",
			"PROP_data": "data",
			"PROP_xAxis": "xAxis",
			"PROP_series": "series"
		}
	},
	"PDIterator" : {
		"init": {
			"eventName": "PDIterator.init",
			"PAR_oid": "oid",
			"PAR_relname": "relname",
			"PAR_clName": "clName",
			"PAR_filter": "filter",
			"PAR_thisPdo": "thisPdo",
			"PAR_sort": "sort",
			"PROP_id": "id"
		},
		"first": {
			"eventName": "PDIterator.first",
			"PAR_id": "id",
			"PROP_obj": "obj"
		},
		"next": {
			"eventName": "PDIterator.next",
			"PAR_id": "id",
			"PROP_obj": "obj"
		},
		"close": {
			"eventName": "PDIterator.close",
			"PAR_id": "id"
		},
		"isValid": {
			"eventName": "PDIterator.isValid",
			"PAR_id": "id",
			"PROP_result": "result"
		},
		"size": {
			"eventName": "PDIterator.size",
			"PAR_id": "id",
			"PROP_total": "total"
		}
	},
	"PDOperationCall" : {
		"init": {
			"eventName": "PDOperationCall.init",
			"PAR_object": "object",
			"PAR_op": "op",
			"PAR_lockId": "lockId",
			"PAR_inStr": "inStr",
			"PAR_inPdo": "inPdo",
			"PAR_async": "async",
			"PAR_downl": "downl",
			"PROP_id": "id",
			"PROP_lockInfo": "lockInfo"
		},
		"checkState": {
			"eventName": "PDOperationCall.checkState",
			"PAR_id": "id",
			"PAR_cancelled": "cancelled",
			"PROP_errors": "errors",
			"PROP_state": "state",
			"PROP_obj": "obj",
			"PROP_OUTSTR": "OUTSTR",
			"PROP_OUTPDO": "OUTPDO",
			"PROP_percent": "percent",
			"PROP_progressMsg": "progressMsg",
			"PROP_downlfile": "downlfile",
			"PROP_filename": "filename"
		},
		"download": {
			"eventName": "PDOperationCall.download",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PAR_op": "op",
			"PAR_inStr": "inStr",
			"PAR_inPdo": "inPdo"
		},
		"downlFile": {
			"eventName": "PDOperationCall.downlFile",
			"PAR_file": "file",
			"PAR_downlfile": "downlfile"
		},
		"delFile": {
			"eventName": "PDOperationCall.delFile",
			"PAR_file": "file",
			"PROP_obj": "obj"
		},
		"jexecUpload": {
			"eventName": "PDOperationCall.jexecUpload",
			"PAR_op": "op",
			"PAR_async": "async",
			"PAR_clName": "clName",
			"PAR_cid": "cid",
			"PAR_oidLow": "oidLow",
			"PAR_inStr": "inStr",
			"PAR_inPdo": "inPdo",
			"PAR_UPLOADED_FILE": "UPLOADED_FILE",
			"PROP_success": "success",
			"PROP_path": "path",
			"PROP_errors": "errors",
			"PROP_filename": "filename",
			"PROP_id": "id",
			"PROP_lockInfo": "lockInfo",
			"PROP_obj": "obj",
			"PROP_OUTSTR": "OUTSTR",
			"PROP_OUTPDO": "OUTPDO"
		}
	}
}
