/**
 * 这部分代码,用于实现和服务器交互.
 */
lkl.factory('connectServer',function($http, utils, mobileapi,pluginService) {
	var cachedatas = {};
	var obj = {};
	var access_token = null;
	var otherAppCode = 'not';
	var TIMEOUT = 12000;
	var retryCount = 0;
	
	function _httpQueuen(){
		var _isRequest = false;
		var _shutdown = false;
		this.queuens = [];
		this.add = function(config,callback,loginfo){
			var self = this;
			self.queuens.push({config:config,callback:callback,info:loginfo});
			if(!_isRequest){
				self.start();
			}
		};
		this.start = function(){
			var self = this;
			if(!_isRequest){
				if(self.queuens.length >0){
					_isRequest = true;
					self.run();
				}else{
					mobileapi.log('queuens length is 0');
				}
			}else{
				mobileapi.log('isrequest...');
			}
		};
		this.stop = function(){
			var self = this;
			if(_isRequest){
				_isRequest = false;
				self.queuens = [];
			}
		};
		this.shutdown = function(){
			var self = this;
			_shutdown = true;
			if(self.queuens[0] && self.queuens[0].callback){
				self.queuens[0].callback(false, {msg:'取消请求'});
			}
			self.stop();
		};
		this.run = function(){
			var self = this;
			var one = self.queuens[0];
			if(one && one.config){
				mobileapi.log('start request...');
				mobileapi.log(one);
				var cf = angular.copy(one.config);
				var cellphone = local.loginedCellPhone;
				if(local.access_token && cf.method=='post'){
					var and = (cf.url.indexOf('?') > 0) ? '&' : '?';
					cf.url = cf.url + and + 'access_token=' + (local.access_token);
				}
				if(local.userid) {
					var and = (cf.url.indexOf('?') > 0) ? '&' : '?';
					cf.url = cf.url + and + 'userid=' + (local.userid);
				}
				
				otherAppCode = pluginService.getCode();
//				alert("获取到其他程序code：" + otherAppCode);
				
				if(otherAppCode) {
					var and = (cf.url.indexOf('?') > 0) ? '&' : '?';
					cf.url = cf.url + and + 'code=' + otherAppCode;
				}
				
				if(cf.method=='post') {
					var and = (cf.url.indexOf('?') > 0) ? '&' : '?';
					if(typeof cf.data == 'string'){
						cf.url = cf.url + and + cf.data;
					} else {
						angular.forEach(cf.data, function(value, key) {
							cf.url = cf.url + "&" + key + "=" + encodeURIComponent(escape(value));
						});
						cf.data = '';
					}
				}
				var starttime = (new Date).getTime();
				$http(cf).success(function(data, status, headers, config) {
					var endtime = (new Date).getTime();
					mobileapi.log('用时: ' + ((endtime - starttime)/1000) +  's');
					if(data && data.success =='false' && data.msg=='err001:session over time!'){
						_refreshtoken(function(success,info){
							if(success){
								self.run();
							}else{
								_back(false,data);
							}
						});
					}else{
						var success = false;
						if(data && data.data && data.data.result) {
							data = data.data.result;
							if(data.length && data.length>0 && data[0].hasOwnProperty('state')){
								data = data[0];
								if(data) {
									success = data.state ? data.state == 1 : true;
								}
							}else if(data.length && data.length>0){
								success = true;
								if(data.length ==1){
									data = data[0];
								}
							}else if(data.success && (data.success=='true' || data.success=='success')){
								success = true;
							}else if(data.id){ 
								success = true;
							}
						} else if(data && data.meta && data.meta.code=='200') {
							success = true;
						}
						if (data && success) {
							_back(true,data);
						} else {
							_back(false,data);
						}
					}
				}).error(function(data, status, headers, config) {
					var endtime = (new Date).getTime();
					mobileapi.log('用时: ' + ((endtime - starttime)/1000) +  's');
					if(!data){
						if((endtime - starttime) > TIMEOUT){
							data = {msg:'网络超时，请稍后重试'};
						}else{
							data = {msg:'未知网络错误'};
						}
					}
					_back(false,data);
				});
			}else{
				if(self.queuens.length >0){
					self.run();
				}else{
					self.stop();
				}
			}
			function _back(success,info){
				if(self.queuens[0] && self.queuens[0].callback){
					if(_shutdown){
						return;
					}
					var ret = self.queuens[0].callback(!_shutdown && success, info);
					if(!ret){
						self.queuens.shift();
						self.run();
					}else{
						self.stop();
					}
				}else{
					self.run();
				}
			}
		};
		
	}
	
	var _httpqueuen = new _httpQueuen();
	var _hidehttpqueuen = new _httpQueuen();
	/*
	 * 调用$http请求数据
	 */
	function _connectService(url, paras, callback, debuginfo,method,ishide) {
		if(!PARAMS.isonline){
			callback(false,{msg:'网络未连接'});
			try{
				angular.element(document).scope().showtooltip("网络未连接");
			}catch(e){
			}
			return;
		}
//		url = url + (DEBUG ? '?random=' + Math.random() : '');
		var cellphone = local.loginedCellPhone;
		var obj = {
			method : 'get',
			url : url ,
			timeout : TIMEOUT,
			headers : {}
		};
		
		if(!paras) paras = '';
		if (method) {
			obj.method = method;
			if (method === 'post') {
				obj.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				obj.data = paras;
			}
		}
		if (obj.method === 'get') {
			obj.url += '?1=1' + paras;
		}
		if(ishide){
			mobileapi.log('use hide http');
			_hidehttpqueuen.add(obj,callback,debuginfo);
		}else{
			_httpqueuen.add(obj,callback,debuginfo);
		}
//		mobileapi.log("请求服务器参数:");
//		mobileapi.log(obj.url);
//		mobileapi.log(obj);
		/*
		$http(obj).success(function(data, status, headers, config) {
			mobileapi.log(debuginfo);
			mobileapi.log(arguments);
			mobileapi.log(data);
			if(data && data.success =='false' && data.msg=='err001:session over time!'){
				if(isbytoken){
					callback(false, '连接服务器失败,稍后重试!\n' + url);
				}else{
					_refreshtoken(function(success,info){
						if(success){
							_connectService(url, paras, callback, debuginfo,method,true);
						}else{
							callback(false, info);
						}
					});
				}
			}else{
				var success = false;
				if(data) {
					if(data.length && data.length>0 && data[0].hasOwnProperty('state')){
						data = data[0];
						if(data) {
							success = data.state ? data.state == 1 : true;
						}
					}else if(data.length && data.length>0){
						success = true;
						if(data.length ==1){
							data = data[0];
						}
					}else if(data.success && (data.success=='true' || data.success=='success')){
						success = true;
					}else if(data.id){ 
						success = true;
					}
				}
				if (data && success) {
					callback(true, data);
				} else {
					callback(false, data);
				}
			}
		}).error(function(data, status, headers, config) {
			if(!data){
				data = {msg:'网络超时，请稍后重试'};
			}
			callback(false, data, status, headers,config);
		});
		*/
	}
	function _refreshtoken(callback,paras){
		if((paras || (local.logined && local.loginedCellPhone
				&&local.loginedPassword)) && retryCount++ < 2){
			var param = paras || "?username=" + local.loginedCellPhone + "&pwd=" + local.loginedPassword
			$http.get(URL.login + param).success(function(data, status, headers, config) {
				if(data && data.token && data.code == '200'){
					var cellphone = local.loginedCellPhone;
					var pwd = local.loginedPassword;
					local.access_token = data.token;
					local.userid = data.userid;
					mobileapi.local(local);
					callback(true, data.token);
				}else{
					callback(false, data);
				}
			}).error(function(data, status, headers, config) {
				callback(false, data);
			});
		}else{
			retryCount = 0;
			callback(false,'not logined');
		}
		
	}
	obj.stopConnect = function(){
		_httpqueuen.shutdown();
		_httpqueuen = new _httpQueuen();
	};
	//获取URL数据
	obj.connect = function(url,paras,callback,method){
		_connectService(url, paras, function(success,data){
			if(callback)callback(success,data);
		}, '获取URL数据',method);
	};
	//获取URL数据
	obj.connectGetArr = function(url,paras,callback,method){
		_connectService(url, paras, function(success,data){
			if(callback) {
				if(data && !angular.isArray(data)) {
					data = [data];
				}
				if(!success) {
					success = angular.isArray(data);
				}
				callback(success,data);
			}
		}, '获取URL数据',method);
	};
	//登陆
	obj.verLogin = function(paras, callback) {
		_refreshtoken(callback,paras);
	};
	//绑定用户
	obj.bindUser = function(paras, callback) {
		_connectService(URL.binduser, paras, callback, '绑定用户中...','post');
	};
	//发送短信
	obj.sendCellPhoneSMS = function(paras, callback) {
		_connectService(URL.sendSMS, paras, callback, '发送短信校验码','get',true);
	};
	/********************************************************************************/
	function _cacheback(keyname,urlname,info,paras, callback,cached){
		var md5 = utils.md5(paras);
		if(!cachedatas[keyname])cachedatas[keyname] = {};
		if(cached && cachedatas[keyname][md5]){
			if(callback)callback(true,cachedatas[keyname]);
		}else{
			_connectService(URL[urlname], paras, function(success,data){
				if(cached)cachedatas[keyname][md5] = data;
				if(callback)callback(success,data);
			}, info);
		}
	}
	return obj;
});