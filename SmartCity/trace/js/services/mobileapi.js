/**
 * 实现调用手机本地代码,并返回数据 包括PhoneGap自带的插件,还有自定义的插件
 * 
 */

lkl.factory('mobileapi', function(utils, $http,$timeout) {
	var obj = {};
	var appid = utils.md5(location.href);
	var positionoption = {
		enableHighAccuracy : true
		//maximumAge : 3000,
		//,timeout : 15000
	};
	var watchpositionoption = {
		enableHighAccuracy : true
		//,maximumAge : 30000
		//,timeout : 15000
	};
	// 弹出提示
	obj.alert = function(a, callback) {
		angular.element(document.getElementById('mainBody')).scope().inputModal.showAlert('提示',a,callback);
//		if (navigator.notification) {
//			navigator.notification.alert(a, function() {
//				if (callback)
//					callback();
//			}, "消息", "确定");
//		} else {
//			alert(a);
//		}
	};
	obj.error = function(msg) {
		alert(msg);
	};
	// 日志信息
	obj.log = function(a) {
		if (DEBUG) {
			if (typeof console != 'undefined') {
				console.log(a);
			}
		}
	};
	// 日志信息
	obj.error = function(a) {
		alert(a);
	};
	// 确认or取消
	obj.confirm = function(a, success, fail,cancelStr,confirmStr) {
		if(!cancelStr) cancelStr = '取消';
		if(!confirmStr) confirmStr = '确定';
	
		angular.element(document.getElementById('mainBody')).scope().inputModal
			.showConfirm('提示',a,success,fail);
		
		//alert(cancelStr + "==" + confirmStr);
//		if (navigator.notification) {
//			navigator.notification.confirm(a, function(btnid) {
//				if (btnid == 2) {
//					if (success)
//						success();
//				} else {
//					if (fail)
//						fail();
//				}
//			}, '提示', cancelStr + ',' + confirmStr);
//		} else {
//			if (window.confirm(a)) {
//				if (success)
//					success();
//			} else {
//				if (fail)
//					fail();
//			}
//		}
	};
	// 本地数据持久化
	obj.local = function(b) {
		if (localStorage) {
			if (b) {
				try {
					localStorage.setItem(appid, JSON.stringify(b));
				} catch (e) {

				}
			} else {
				return JSON.parse(localStorage.getItem(appid));
			}
		} else {
			return {};
		}
	};
	// session数据
	obj.session = function(a, b) {
		if (!DEBUG && CACHE.SESSION) {
			if (b) {
				try {
					CACHE.SESSION[a] = b;
				} catch (e) {

				}
			} else {
				return CACHE.SESSION[a];
			}
		} else if (sessionStorage) {
			if (b) {
				try {
					sessionStorage.setItem(a, JSON.stringify(b));
				} catch (e) {

				}
			} else {
				try{
					return JSON.parse(sessionStorage.getItem(a));
				}catch(e){
					return {};
				}
			}
		} else {
			return {};
		}
	};
	var _watchID = null;
	/**
	 * 清除watchPosition（暂停实时导航）
	 */
	obj.celarWatchPosition = function() {
		if (_watchID) {
			navigator.geolocation.clearWatch(_watchID);
			_watchID = null;
		}
	};
	/**
	 * 获取地理位置经纬度 - 一直调用，用于实时导航时
	 * 
	 * @param callback
	 *            回调函数，第一个参数是否成功，第二个参数是返回的数据,lat表示纬度,lng表示经度
	 */
	obj.watchPosition = function(callback) {
		if (navigator.geolocation) {
			if (_watchID)
				return;
			_watchID = navigator.geolocation.watchPosition(function(pos) {
				var latitude = pos.coords.latitude;
				var longitude = pos.coords.longitude;
				callback(true, {
					lat : latitude,
					lng : longitude
				});
			}, function(positionError) {
				callback(false, _positionError(positionError));
			}, watchpositionoption);
		} else {
			obj.alert('not support geolocation');
		}
	};
	/**
	 * 获取地理位置经纬度一次
	 * 
	 * @param callback
	 *            回调函数，第一个参数是否成功，第二个参数是返回的数据,lat表示纬度,lng表示经度
	 */
	obj.getPosition = function(callback) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(pos) {
				var latitude = pos.coords.latitude;
				var longitude = pos.coords.longitude;
				callback(true, {
					lat : latitude,
					lng : longitude
				});
			}, function(positionError) {
				callback(false, _positionError(positionError));
			}, positionoption);
		} else {
			obj.alert('not support geolocation');
		}
	};
	function _positionError(positionError){
		var code = positionError.code;
		var ret = '获取地理位置失败：';
		if(code == positionError.PERMISSION_DENIED){
			//：权限被拒绝
			ret += '权限被拒绝';
		}else if(code == positionError.POSITION_UNAVAILABLE){
			//：位置不可用
			ret += '位置不可用';
		}else if(code == positionError.TIMEOUT){
			//：超时
			ret += '超时';
		}else{
			ret += '未知错误';
		}
		return ret;
	}
	return obj;
});
