

/**
 * 这部分代码,用于实现和插件交互. 
 */ 
lkl.factory('pluginService',function($timeout,utils) {
	var obj = {};
	var appcode = '';
	function connectWebViewJavascriptBridge(callback) {
		if (window.WebViewJavascriptBridge) {
			callback(WebViewJavascriptBridge);
		} else {
			document.addEventListener('WebViewJavascriptBridgeReady', function() {callback(WebViewJavascriptBridge);}, false);
		}
	}
	
	function getScope() {
		return angular.element(document.getElementById('mainBody')).scope();
	}
	if(ISIOS){
		connectWebViewJavascriptBridge(function(bridge) {
			bridge.init(function(message, responseCallback) {
			});
			bridge.registerHandler('onOtherAppCode', function(data, responseCallback) {
				appcode = data;
			});
			bridge.registerHandler('refreshData', function(data, responseCallback) {
//				getScope().refreshData();
			});
		});
	}
	
	obj.toMainPage = function(succCallback,failCallback) {
		if(ISANDROID) {
			AppGloabl.toMainPage();
		}
	};
	obj.exitapp = function(succCallback,failCallback) {
		if(ISANDROID) {
			AppGloabl.exitApp();
		}
	};
	obj.scanCode = function(params,succCallback,failCallback) {
		params = angular.toJson(params);
		if(ISANDROID) {
			AppGloabl.getQRCode(params);
		} else if(ISIOS){
			connectWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getQRCode', params, function() {
				});
				bridge.registerHandler('onQRCode', function(data, responseCallback) {
//					alert('onLocation call back' + angular.toJson(data));
					succCallback(data);
				});
			});
		} else {
			$timeout(function() {
//				11010824002070031025
//				11010805700002301312
				getScope().onQRCode({'code':'11010805700002301312'});
			}, 300);
			
		}
	};
	obj.hideKeyboard = function(succCallback,failCallback) {
		if(ISANDROID) {
			AppGloabl.hideKeyboard();
		}
	};
	obj.openUrl = function(url,succCallback,failCallback) {
		if(ISANDROID) {
			return AppGloabl.openUrl(url);
		} else {
			return appcode;
		}
	};
	obj.lat = 0;
	obj.getLocation = function(succCallback,failCallback) {
		if(ISIOS) {
			connectWebViewJavascriptBridge(function(bridge) {
				bridge.callHandler('getLocation', {}, function() {
				});
				bridge.registerHandler('onLocation', function(data, responseCallback) {
//					alert('onLocation call back' + angular.toJson(data));
					succCallback(data);
				});
			});
		} else if(ISANDROID) {
			AppGloabl.getLocation();
		} else {
			obj.lat = obj.lat + 0.01;
			getScope().onLocation({"enable" : true,"lat": (40.666044 + obj.lat) + '', "lng": "109.855954", "addr" : "北京昌平区天通苑中东路5号" + obj.lat});
//			getScope().onLocation({"enable" : "false"});
		}
		
	};
	obj.copyToClipboard = function(content,succCallback,failCallback) {
		var params = {'content':content};
		lklplugin.execMethod(params,'copytoclipboard',succCallback,failCallback);
	};
	return obj;
});
