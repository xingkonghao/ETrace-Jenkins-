

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
	if(ISIOS){
		connectWebViewJavascriptBridge(function(bridge) {
			bridge.init(function(message, responseCallback) {
			});
			bridge.registerHandler('onOtherAppCode', function(data, responseCallback) {
				appcode = data;
			});
			bridge.registerHandler('refreshData', function(data, responseCallback) {
				angular.element(document.getElementById('mainBody')).scope().cameraloader.refreshData();
			});
		});
	}
	
	
	obj.exitapp = function(succCallback,failCallback) {
		if(ISANDROID) {
			AppGloabl.exitApp();
		}
	};
	obj.getCode = function(succCallback,failCallback) {
		if(ISANDROID) {
			return AppGloabl.getOtherAppCode();
		} else {
			return appcode;
		}
	};
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
		}
		
	};
	obj.copyToClipboard = function(content,succCallback,failCallback) {
		var params = {'content':content};
		lklplugin.execMethod(params,'copytoclipboard',succCallback,failCallback);
	};
	return obj;
});
