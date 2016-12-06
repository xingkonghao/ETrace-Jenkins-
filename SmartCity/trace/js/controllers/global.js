lkl.controller('global', function($scope, mobileapi, common, connectServer,
		$sce,pluginService,$timeout) {
	$scope.versionName = CONFIG.appversionname;
	$scope.isNotInit = true;
	
	$scope.initApp = function() {
		common.initLocal();
		$scope.getLocation();
		
		$scope.initServerData();
		$scope.showMainPage(DEBUG ? 0 : 4300);
		$scope.checkUpgrade();
		$scope.isNotInit = false;
		
//		$scope.$watch('trace.inputTraceCode',function(newValue,oldValue, scope){
//	        $scope.trace.inputTraceCode = newValue.replace(/\D/g,'');
//		});
		
	};
	$scope.scrollToEnd = function(bottom) {
			$timeout(function() {
				try{
					var chatscroll = document.getElementById('main_scroll');
					if(!chatscroll) {
						return;
					}
					var scrollTop = chatscroll.scrollHeight;
					if(bottom) {
						scrollTop = scrollTop - bottom;
					}
					chatscroll.scrollTop = scrollTop;
				} catch(e) {
				}
			}, 100);
	};
	$scope.inputMethodHide = function() {
		$timeout(function() {
			try{
				var traceCodeInput = document.getElementById('trace_code_input');
				if(!traceCodeInput) {
					return;
				}
				traceCodeInput.blur();
			} catch(e) {
			}
		}, 100);
	};
	$scope.checkUpgrade = function() {
		if(ISANDROID){
			connectServer.connect(URL.getVersion, '', function callback(
					isSuccess, data) {
				if (isSuccess) {
//					if(data.versioncode <= CONFIG.appversioncode){
//						return;
//					}
					mobileapi.confirm('系统检测到新版本v' + data.version +  ". " + data.note + "是否升级？", function() {
						pluginService.openUrl(data.updateurl);
					},'','暂不升级','立即升级');
				}
			}, 'get');
		}
	};
	$scope.showMainPage = function(delayTime) {
		common.runOnUI(function callback() {
			var mainPage = '';
			if(local.isFirst) {
				local.isFirst = false;
				common.saveLocal();
				mainPage = 'advert';
			} else {
				mainPage = 'main';
//				mainPage = 'traceResult';
			}
			pluginService.toMainPage();
			common.resetToPage(mainPage);
		}, delayTime);
	};
	$scope.experienceNow = function(){
		$scope.showMainPage(0);
	};
	$scope.getLocation = function() {
		pluginService.getLocation($scope.onLocation);
	};
	$scope.relocation = function() {
		common.loading();
		$scope.getLocation();
	};
	$scope.onLocation = function(loc) {
		common.closeLoading();
		$scope.locationInfo = loc;
//		alert(angular.toJson(loc));
		if(loc && loc.lat && loc.lng){
//			local.locationInfo = {lat : loc.lat,lng : loc.lng};
			$scope.shopData.findNearbyShop(true);
//			common.saveLocal();
		} else {
			
		}
	};
	$scope.locationInfo = {
		lat : '',
		lng : '',
		enable : true,
	};
	$scope.recommendInfo = {
		recommendArr : [],
	};
	$scope.recommendClick = function() {
			
	};
	$scope.recommendTouch = function() {
		alert('touch');
	};
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};
	$scope.othercontent = {
		html : 'https://www.baidu.com',
		title : '百度一下',
		info : {},
		rightcallback : '',
		righttxt : '',
		rightparam : '',
		showContent : function(html, title,info,rightcallback,rightparam,righttxt) {
			var self = this;
			self.html = html;
			self.title = title;
			self.info = info;
			self.rightcallback = rightcallback;
			self.righttxt = righttxt;
			self.rightparam = rightparam;
			common.pushPage('content');
		},
		getUrl : function() {
			return this.html;
		}
	};
	$scope.initServerData = function() {
		$scope.shopData.getShopData();
	};
	$scope.isShowTraceCodeKeyboard = false;
	$scope.showTraceCodeKeyboard = function() {
		$scope.isShowTraceCodeKeyboard = true;
		$scope.scrollToEnd();
	};
	$scope.hideTraceCodeKeyboard = function() {
		$scope.isShowTraceCodeKeyboard = false;
	};
	$scope.inputTraceCode = function(code) {
		if($scope.trace.inputTraceCode.length == 20) {
			return;
		}
		$scope.trace.inputTraceCode = $scope.trace.inputTraceCode + code;
	};
	$scope.deleteTraceCode = function() {
		if($scope.trace.inputTraceCode) {
			$scope.trace.inputTraceCode = $scope.trace.inputTraceCode.substring(0,$scope.trace.inputTraceCode.length - 1);
		}
	};
	$scope.trace = {
		QRCodeType : 'QRCODE_TYPE',
		BarCodeType : 'BARCODE_TYPE',
		traceType : '',
		traceShop : {},
		traceData : {},
		traceCode : "",
		inputTraceCode : "",
		feedbackStr : "",
		feedbackName : "",
		feedbackPhone : "",
		isLoadFinish : false,
		showFeedback : false,
		isReLoad : false,
		isLoadSuccess : true,
		isOnTraceCodeSuccess : false,
		 //11011300114200150426
        url1 : "http://wx.bjfxr.com/wx/weixin/rcode.html?trace_code=11011300114200150426",
        url2 : "http://wx.bjfxr.com/wx/weixin/fcode.html?trace_code=",
        getShowTraceCode : function() {
        	var self = this;
        	var traceCode = self.traceCode;
        	if(traceCode && traceCode.length > 28) {
        		traceCode = traceCode.substring(0,28) + "...";
        	} 
        	return traceCode;
        },
        traceBarCode : function() {
			var self = this;
			if(!$scope.locationInfo.lng || !$scope.locationInfo.lat) {
				if(!$scope.locationInfo.enable || 'false' == $scope.locationInfo.enable) {
				    $scope.shopData.showShopNearNo();
				} else{
				$scope.shopData.showShopList();
				}
			} else {
                $scope.shopData.showShopNearList();
			}
		},
		reloadTraceCode : function() {
			var self = this;
			self.isReLoad = true;
			self.onTraceCode(self.traceCode);
		},
        onTraceCode : function(code) {
			var self = this;
			var lastReload = self.isReLoad;
			if(self.isReLoad){
			    self.isReLoad = false;
			}
			if(!code || code.length == 0) {
				if(!lastReload){
					common.popPage();
				}
				return;
			}
			self.traceData = '';
			self.showFeedback = false;
			self.isLoadFinish = false;
			self.feedbackStr = '';
			self.isOnTraceCodeSuccess = true;
			if (self.traceType == self.QRCodeType) {
				self.loadQRCodeData(code);
			} else if (self.traceType == self.BarCodeType) {
				self.loadBarCodeData(code);
			}
		},
		onTraceShop : function(shopData) {
			var self = this;
			if(shopData && shopData.node_id) {
				self.traceShop = shopData;
				self.scanBarCode();
			}
		},
		scanCode : function() {
			var self = this;
			self.isReLoad = true;
			self.localScanCode();
		},
		scanQRCode : function() {
			var self = this;
			self.traceType = self.QRCodeType;
			self.showTraceResult();
			self.localScanCode();
		},
		scanBarCode : function() {
			var self = this;
			self.traceType = self.BarCodeType;
			self.showTraceResult();
			self.localScanCode();
		},
		localScanCode : function() {
			var self = this;
			var params = {};
			if(self.traceType == self.BarCodeType) {
				params.type = '1';
			} else {
				params.type = '2';
			}
			pluginService.scanCode(params,$scope.onQRCode);
		},
		loadBarCodeData : function(code) {
			var self = this;
			self.traceCode = code;
			var nodeId = self.traceShop.node_id;
			if(nodeId && nodeId.length > 0) {
				common.loading();
				var param = '&node_id=' + nodeId + '&trace_code=' + code;
				var url  = URL.barCode;
				connectServer.connect(url, param,self.onTraceServerData, 'get');
			}
		},
		loadQRCodeData : function(code) {
			var self = this;
			self.traceCode = code;
			code = self.getTraceCode(code);

			if(!code){
				self.onTraceServerData(false,{});
//				$scope.showTip("对不起，您所扫描的二维码不正确");
				return;
			}
			self.traceCode = code;
			var param = '&trace_code=' + code;
			var url  = URL.qrCode;
			common.loading();
			connectServer.connect(url, param, self.onTraceServerData, 'get');
		},
		searchCodeData : function() {
			var self = this;
			var code = self.getTraceCode(self.inputTraceCode);
			
			if(!code){
				$scope.showTip("您输入的追溯码长度不符");
				return;
			}
			self.traceType = self.QRCodeType;
			self.inputTraceCode = '';
			self.showTraceResult();
			self.onTraceCode(code);
		},
		onTraceServerData : function(isSuccess, data){
			
			common.closeLoading();
			$scope.trace.isLoadSuccess = isSuccess || !data.code || data.code > 0;
			if(!$scope.trace.isLoadSuccess){
//				$scope.showTip("网络连接有问题，请稍后重试");
				return;
			}
			$scope.trace.isLoadFinish = true;
//				alert(isSuccess + angular.toJson(data));
			if (isSuccess) {
				$scope.trace.traceData = data;
			}
		},
		getTraceCode : function(code) {
			var res = "";
	        var arr = code.split("/");
	        var codePatt=new RegExp("[0-9]{20,}");
	        angular.forEach(arr,function(value,key){
				if(codePatt.test(value)){
					res = value;
				}
			});
	        return res;
		},
		feedback : function() {
			var self = this;
			if(self.feedbackStr.trim().length < 1) {
				$scope.showTip('反馈意见不能为空');
				return;
			}
			var param = '&contacts_name=' + self.feedbackName.trim() 
					+ '&contacts_tel=' + self.feedbackPhone.trim() 
					+ '&feedback=' + self.feedbackStr.trim();
			connectServer.connect(URL.feedback, param,function cb(isSuccess, data) {
				if(isSuccess) {
					$scope.showTip('反馈成功,感谢您的反馈');
					common.popPage();
				} else {
					$scope.showTip('您的网络异常，请稍后再试');
				}
			}, 'get');

		},
		showTraceResult : function() {
			var self = this;
			self.isOnTraceCodeSuccess = false;
			common.pushPage('traceResult');
		}
	};
    $scope.onQRCode = function(code) {
//    	alert(angular.toJson(code));
	    $scope.trace.onTraceCode(code.code);
	};
	$scope.shopData = {
		typeSuper : '0004',
		typeVegetable : '0003',
		superMarketParentArr : [],
		superMarketMap : {},
		vegetableMarketAreaArr : [],
		vegetableMarketMap : {},
		shopHistory : [],
		shopArr : [],
		shopNearbyArr : [],
		showShopList : function() {
			common.pushPage('shopList');
		},
		showShopNearList : function() {
			common.pushPage('shopNearList');
		},
		showShopNearNo : function() {
			common.pushPage('shopNearNo');
		},
		choiceShop : function(shopData) {
			var self = this;
			self.saveChoiceHistory(shopData);
			$scope.trace.onTraceShop(shopData);
		},
		loadChoiceHistory : function() {
			var self = this;
			if(local.shopHistory){
				self.shopHistory = local.shopHistory;
			}
		},
		saveChoiceHistory : function(shopData){
			var self = this;
			if(!local.shopHistory) {
				local.shopHistory = [];
			}
			angular.forEach(local.shopHistory,function(value,key){
				if(key > 18 || value.node_id == shopData.node_id){
					local.shopHistory.splice(key, 1);
				}
			});
			local.shopHistory.unshift(shopData);
			self.shopHistory = local.shopHistory;
			common.saveLocal(local);
		},
		findNearbyShop : function(isReload) {
			var self = this;
			if(!isReload && self.shopNearbyArr.length > 0) {
				return;
			}
			self.shopNearbyArr = [];
			var scope = 0.0009; //100米以内  ps:111千米约为经纬1度。所以100/111000得出此结果
			if($scope.locationInfo.lng &&  $scope.locationInfo.lat && self.shopArr.length > 0) {
				angular.forEach(self.shopArr,function(value,key){
					if(value.y_coordinate && value.x_coordinate){
						var yDistance = value.y_coordinate - $scope.locationInfo.lng;
						var xDistance = value.x_coordinate - $scope.locationInfo.lat;
						value.distance = yDistance * yDistance + xDistance * xDistance;
						self.fillNearbyShopArr(self.shopNearbyArr,value);
					}
				});
				angular.forEach(self.shopNearbyArr,function(value,key){
					var mileNum = Math.ceil(Math.sqrt(value.distance) * 111000);
					if(mileNum < 100){
						value.mile =  '<100m';
					} else if(mileNum > 10000) {
						value.mile = Math.round(mileNum / 1000) + 'km';
					} else if(mileNum > 1000) {
						value.mile = Math.round(mileNum / 100) / 10  + 'km';
					} else {
						value.mile =  mileNum + 'm';
					}
				});
			}
		},
		fillNearbyShopArr : function(shopArr,shop) {
			var self = this;
			if(shopArr.length < 6){
				shopArr.push(shop); 
			} else {
				if(self.sortShop(shop, shopArr[shopArr.length -1]) < 0) {
					shopArr.pop();
					shopArr.push(shop);
				}
				shopArr = shopArr.sort(self.sortShop);
			}
		},
		sortShop : function(shopA,shopB) {
			return shopA.distance - shopB.distance;
		},
		getShopData : function(callback) {
			var self = this;
			if(self.superMarketParentArr.length > 0){
				if(callback){
					callback(true);
				}
				return;
			}
			var param = '';
			var url  = URL.getShopList;
			connectServer.connectGetArr(url, param,
				function cb(isSuccess, dataArr) {
					if (isSuccess) {
						self.parseShopData(dataArr);
					}
					if(callback) {
						callback(isSuccess);
					}
				}, 'get');
		},
		parseShopData : function(shopArr) {
			var self = this;
			if(shopArr && shopArr.length && shopArr.length > 0) {
				self.superMarketParentArr = [];
				self.superMarketMap = {};
				self.vegetableMarketAreaArr = [];
				self.vegetableMarketMap = {};
				self.shopArr = shopArr;
				angular.forEach(shopArr,function(value,key){
					if(self.typeSuper == value.type){
						var dataArr;
						var isParent = self.isParent(value);
						if(isParent){
							self.superMarketParentArr.push(value);
						} else {
							var keyId = value.parent;
							if(self.superMarketMap.hasOwnProperty(keyId)){
								dataArr = self.superMarketMap[keyId];
							} else {
								dataArr = [];
								self.superMarketMap[keyId] = dataArr;
							}
							dataArr.push(value);
						}
					} else if(self.typeVegetable == value.type) {
						var dataArr;
						if(self.vegetableMarketMap.hasOwnProperty(value.area_id)){
							dataArr = self.vegetableMarketMap[value.area_id];
						} else {
							dataArr = [];
							self.vegetableMarketMap[value.area_id] = dataArr;
							self.vegetableMarketAreaArr.push(value);
						}
						dataArr.push(value);
					}
					
					self.superMarketParentArr= self.superMarketParentArr.sort(
			                 function compareFunction(param1,param2){
			                     return param1.node_name.localeCompare(param2.node_name);
			                 }
			             );
					
				});
			}
		},
		isParent : function(shopData) {
			return !shopData.parent;
		},
	};
	
	$scope.main = {
		markers : '',
		label : '',
		title : '',
		url : '',
		map : '',
		mapSearch : {},
		cameraArr : [],
		isSingleMap : false,
		videoArr : '',
		currShowCamera : '',
		currClickCamera : '',
		currInfoWindow : '',
		currCarouselIndex : '',
		autoCarousel : function() {
			var self = this;
//			self.isStopCarousel = false;
//			common.runOnUI(function() {
//				if(typeof(recommendCarousel)!=="undefined" && recommendCarousel && recommendCarousel._element) {
//					if(recommendCarousel.getActiveCarouselItemIndex() + 1
//							== $scope.recommendInfo.recommendArr.length){
//						recommendCarousel.first();
//					} else {
//						recommendCarousel.next();
//					}
//				}
//				self.autoCarousel();
//			}, 3000);
		},
		closeCarousel : function(){
			var self = this;
			self.isStopCarousel = true;
		},
	};
	var _clicktwo = false;
	$scope.onBackButton = function() {
		var hasmodal = false;
		for ( var key in lkl.modal) {
			if (lkl.modal.hasOwnProperty(key)) {
				if (lkl.modal[key].hide && lkl.modal[key]._isVisible()) {
					hasmodal = true;
					if (key == 'loading') {
						connectServer.stopConnect();
						funs.closeLoading();
					} else if (key == 'choicemodal') {
						$scope.choiceModal.cancelChoice();
					} else if (key == 'choicemodal') {
						$scope.inputModal.cancelClick();
					} else {
						lkl.modal[key].hide();
					}
				}
			}
		}

		if (!hasmodal) {
			if (lkl.nav.getPages().length > 1) {
				lkl.nav.popPage();
			} else {
				if (!_clicktwo) {
					$timeout(function() {
						$scope.showTip("再按一次退出");
						_clicktwo = true;
						$timeout(function() {
							_clicktwo = false;
						}, 5000, false);
					});
				} else {
					pluginService.exitapp();
//					navigator.app.exitApp();
				}
			}
		}
	};
	$scope.showTip = function(msg) {
		common.runOnUI(function() {
			$scope.tooltip.show(msg);
		}, 0);
	};
	$scope.tooltip = {
		message : '',
		classopacity0 : false,
		classshowblock : false,
		classhide : true,
		classtooltip : true,
		isshowing : false,
		timeid : null,
		show : function(a) {
			var self = this;
			self.stop();

			if (a) {
				self.message = a;
			} else {
				self.message = "提示!";
			}
			self.classhide = false;
			self.classshowblock = true;
			self.isshowing = true;

			self.timeid = $timeout(function() {
				document.querySelector('#lkltooltip').className += ' opacity0';
				self.timeid2 = $timeout(function() {
					self.stop();
				}, 2000);
			}, 3000);
		},
		stop : function() {
			var self = this;
			self.classhide = true;
			self.classshowblock = false;
			self.isshowing = false;
			document.querySelector('#lkltooltip').className = document
					.querySelector('#lkltooltip').className.replace(
					' opacity0', '');
			$timeout.cancel(self.timeid);
			$timeout.cancel(self.timeid2);
			self.timeid2 = null;
			self.timeid = null;
		}
	};
	$scope.choiceModal = {
		choiceTitle : '请选择',
		// [{name: '显示的名字',value: '实际值'},{...}]
		// 或者直接dictionry表中的格式 id当作value，dicvalue当作name
		choiceArr : '',
		succCallback : '',
		cancelCallback : '',
		showChoice : function(choicetitle, choicearr, succcallback,
				cancelcallback) {
			var self = this;
			if (!choicearr)
				return;
			common.runOnUI(function() {
				if (choicetitle)
					self.choiceTitle = choicetitle;
				self.choiceArr = choicearr;
				self.succCallback = succcallback;
				self.cancelCallback = cancelcallback;
				lkl.modal.choicemodal.show();
			}, 300);
		},
		hideChoice : function() {
			lkl.modal.choicemodal.hide();
		},
		cancelChoice : function() {
			this.hideChoice();
			if (this.cancelCallback)
				this.cancelCallback();
		},
		itemClick : function(choiceItem, index) {
			this.hideChoice();
			if (this.succCallback)
				this.succCallback(choiceItem.value, index, choiceItem.name);
		}
	};
	$scope.inputModal = {
		title:'请输入',
		inputstr : '',
		succCallback:'',
		cancelCallback:'',
		inputMode: false,
		alertMode: false,
		showAlert:function(title,msg,succcallback,cancelcallback) {
			lkl.modal.inputmodal.show();
			if(title) this.title = title;
			this.msg = msg;
			this.inputMode = false;
			this.alertMode = true;
			this.succCallback = succcallback;
			this.cancelCallback = cancelcallback;
		},
		showConfirm:function(title,msg,succcallback,cancelcallback) {
			lkl.modal.inputmodal.show();
			if(title) this.title = title;
			this.inputMode = false;
			this.alertMode = false;
			this.msg = msg;
			this.succCallback = succcallback;
			this.cancelCallback = cancelcallback;
		},
		showInputModal:function(title,msg,succcallback,cancelcallback) {
			lkl.modal.inputmodal.show();
			if(title) this.title = title;
			this.inputMode = true;
			this.alertMode = false;
			this.msg = msg;
			this.succCallback = succcallback;
			this.cancelCallback = cancelcallback;
		},
		hideModal:function() {
			this.inputstr = '';
			lkl.modal.inputmodal.hide();
		},
		cancelClick:function() {
			this.hideModal();
			if(this.cancelCallback) this.cancelCallback();
		},
		confirmClick:function() {
			var self = this;
			if(self.inputMode && (!self.inputstr || self.inputstr.length == 0)){
				mobileapi.alert('输入不能为空！');
				return;
			}
 			if(this.succCallback) this.succCallback(angular.copy(self.inputstr));
			this.hideModal();
			
		}
	};
});

lkl.controller('appsetup', function($scope, $http, common, mobileapi, utils,
		connectServer) {
	$scope.appsetup = {
		aboutUs : function() {
			common.pushPage('aboutus');
		},
		isIos : function() {
			return ISIOS;
		},
		aboutUs2 : function() {
			window.open("http://www.baidu.com");
			// common.pushPage('aboutus');
		}
	};
});

lkl.factory('common', function($timeout, mobileapi) {
	var obj = {
		// 关闭遮罩
		closeLoading : function(text) {
			$timeout(function() {
				lkl.modal.loading.hide();
			});
		},
		// 打开遮罩
		loading : function(text) {
			if (!lkl || !lkl.modal || !lkl.modal.loading) {
				mobileapi.log('no loadig modal');
				return;
			}
			$timeout(function() {
				// console.log('loding,timout,li');
				if (text) {
					lkl.modal.loading._scope.loadingText = text;
				} else {
					lkl.modal.loading._scope.loadingText = '拼命加载中...';
				}
				lkl.modal.loading.show();
			});
		},
		// 重置页面
		resetToPage : function(a) {
			if (MODEL_NAME[a]) {
				lkl.nav.resetToPage(MODEL_NAME[a]
						+ (DEBUG ? '?random=' + Math.random() : ''));
			}
		},
		// 跳转页面
		pushPage : function(a, b) {
			if (MODEL_NAME[a]) {
				lkl.nav.pushPage(MODEL_NAME[a]
						+ (DEBUG ? '?random=' + Math.random() : ''), b);
			}
		},
		getPage : function(a) {
			if (MODEL_NAME[a]) {
				return MODEL_NAME[a]
						+ (DEBUG ? '?random=' + Math.random() : '');
			} else {
				return '';
			}
		},
		// 关闭跳转页面
		popPage : function(a) {
			lkl.nav.popPage(a);
		},

		// 初始化本地持久化数据
		initLocal : function() {
			var temp = mobileapi.local();
			if (temp) {
				local = temp;
			} else {
				mobileapi.local(local);
			}
		},
		// 保存持久化数据
		saveLocal : function() {
			mobileapi.local(local);
		},
		runOnUI : function(callback, delay) {
			if (!delay)
				delay = 0;
			// alert('runOnUI!!!!!!!!');
			// console.log('runOnUI!!!!!!!!');
			$timeout(callback, delay);
		},
	};
	return obj;
});