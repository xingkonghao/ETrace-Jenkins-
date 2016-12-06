lkl.controller('global', function($scope, mobileapi, common, connectServer,
		$sce,pluginService,$timeout) {
	$scope.ImgBase = IMGURL;
	$scope.waitLocCount = 1;
	$scope.waitLocMax = 2;
	$scope.versionName = CONFIG.appversionname;
	$scope.initApp = function() {
		pluginService.getLocation($scope.onLocation);
		common.initLocal();
		
		$scope.initServerData();
		$scope.showMainPage(1000);
	};
	$scope.loginout = function() {
		if (local.isAdmin) {
			mobileapi.confirm('确定退出?', function() {
				common.runOnUI(function() {
					local.isAdmin = false; 
					local.logined = false; 
					local.access_token = '';
					local.userid = '';
					common.saveLocal();
					$scope.cameraloader.refreshData();
				});
			});
		} else {
			// local.isAdmin = true;
			// common.saveLocal();
			common.pushPage('login');
		}
	},
	$scope.showMainPage = function(delayTime) {
		common.runOnUI(function callback() {
			if(local.locationInfo.lat) {
				common.resetToPage('cameraList');
			} else if($scope.waitLocCount > $scope.waitLocMax){
				//模拟个假的位置
				local.locationInfo = {lat : '35.422121',lng : '116.5921'};
				common.resetToPage('cameraList');
			} else {
				$scope.waitLocCount = $scope.waitLocCount + 1;
				$scope.showMainPage(1000);
			}
			
		}, delayTime);
	};
	$scope.onLocation = function(loc) {
		if(loc && loc.lat && loc.lng){
			local.locationInfo = {lat : loc.lat,lng : loc.lng};
			$scope.locationInfo = local.locationInfo;
			common.saveLocal();
		} else {
			
		}
	};
	$scope.isAdmin = function() {
		return local.logined && local.isAdmin;
	};
	$scope.locationInfo = {
		lat : '',
		lng : '',
	};
	$scope.recommendInfo = {
		recommendArr : [],	
	};
	$scope.typeInfo = {
		typeDic : {},
		typeMainArr : [],
		typeSubArr : [],
		selectedType : {},
		moreType : {'name' : '更多', 'type_icon' : 'images/more.png','isNoPre' : true},
		selfMoreType : {'name' : '更多', 'type_icon' : 'images/more.png', 'isNoPre' : true},
		initType : function(typeArr) {
			var self = this;
			self.typeDic = {};
			self.typeMainArr = [];
			self.typeSubArr = [];
			angular.forEach(typeArr, function(value, key) {
				self.typeDic[value.id] = value;
				if (value.sort == '1') {
					self.typeMainArr.push(value);
				} else {
					self.typeSubArr.push(value);
				}
			});
			if(self.typeMainArr.length > 0){
				self.selectedType = self.typeMainArr[0];
			}
			self.loadData();
		},
		selectSubType : function(type) {
			var self = this;
			if (type == self.selectedType) {
				self.selectedType = {};
				self.moreType = self.selfMoreType;
			} else {
				self.selectedType = type;
				self.moreType = type;
			}
			self.loadData();
		},
		selectMoreType : function() {
			lkl.modal.more.show();
		},
		selectType : function(type) {
			var self = this;
			self.moreType = self.selfMoreType;
			if (type == self.selectedType) {
				self.selectedType = {};
			} else {
				self.selectedType = type;
			}
			self.loadData();
		},
		loadData : function() {
			if($scope.cameraloader.map){
				$scope.cameraloader.getCameraList();
			} 
			$scope.cameraloader.getVideoList();
		}
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
		$scope.initTypeData();
		connectServer.connectGetArr(URL.getRecommendList, '', function callback(
				isSuccess, dataArr) {
			if (isSuccess) {
				$scope.recommendInfo.recommendArr = dataArr;
			}
		}, 'get');
	};
	$scope.initTypeData = function() {
		connectServer.connectGetArr(URL.getTypeList, '', function callback(
				isSuccess, dataArr) {
			if (isSuccess) {
				$scope.typeInfo.initType(dataArr);
			}
		}, 'get');
	};
	
	$scope.cameraloader = {
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
			self.isStopCarousel = false;
			common.runOnUI(function() {
				if(typeof(recommendCarousel)!=="undefined" && recommendCarousel && recommendCarousel._element) {
					if(recommendCarousel.getActiveCarouselItemIndex() + 1
							== $scope.recommendInfo.recommendArr.length){
						recommendCarousel.first();
					} else {
						recommendCarousel.next();
					}
				}
				self.autoCarousel();
			}, 3000);
		},
		closeCarousel : function(){
			var self = this;
			self.isStopCarousel = true;
		},
		showCameraList : function() {
			common.pushPage('cameraList');
		},
		showForeshow : function() {
			common.pushPage('foreshowList');
		},
		refreshData : function() {
			$scope.initTypeData();
		},
		getVideoList : function() {
			var self = this;

			common.loading();
			var param = '';
			if($scope.typeInfo.selectedType.id) {
				param = "&typeid=" + $scope.typeInfo.selectedType.id;
			}
			connectServer.connectGetArr(URL.getVideoList, param,
					function callback(isSuccess, dataArr) {
						common.closeLoading();
						if (isSuccess) {
							self.videoArr = dataArr;
						}
					}, 'get');
		},
		pop : function() {
			lkl.nav.popPage();
		},
		showMap : function() {
			common.pushPage('map');
		},
		showMapForSingle : function(id) {
			var self = $scope.cameraloader;;
			connectServer.connect(URL.getCameraByVideoId, '&id=' + id, function callback(
					isSuccess, data) {
				common.closeLoading();
				if (isSuccess) {
					self.showMapSingle(data);
				} else {
					mobileapi.alert('获取信息失败，请重试');
				}
			}, 'get');

		},
		showMapSingle : function(camera) {
			var self = $scope.cameraloader;;
			self.currShowCamera = camera;
			common.pushPage('mapSingle');
		},
		showSetup : function() {
			common.pushPage('appsetup');
		},
		addCameraInfo : function(cameraInfo) {
			var self = this;
			if(self.currInfoWindow){
				self.currInfoWindow.close();
			}
			self.showCameraInfo(cameraInfo);
		},
		showCameraInfo : function(cameraInfo) {
			if (cameraInfo && cameraInfo.id) {
				tempParams['titleTxt'] = "编辑信息";
			}
			tempParams['cameraInfo'] = cameraInfo;
			common.pushPage('cameraInfo');
		},
		showLive : function(camera) {
			var self = this;
			if(!camera) {
				camera = self.currClickCamera;
			}
			var baseUrl = "http://www.jinyeiot.com/city/video/getcovering.jsp";
			$scope.othercontent.showContent(baseUrl + '?id=' + camera.id, camera.name);
		},
		showLiveFromList : function(video) {
			var self = this;
			if(!video) {
				return;
			}
			var baseUrl = "http://www.jinyeiot.com/city/video/getvideo.jsp";
			$scope.othercontent.showContent(baseUrl + '?id=' + video.id, video.video_name,
					'',self.showMapForSingle,video.id,'地图定位');
		},
		clickRecommend : function(recommend) {
			var self = this;
			var baseUrl = "http://jinyeiot.com/qiantai/gongsi/shoujiz.html";
			$scope.othercontent.showContent(baseUrl, recommend.name);
		},
		initSingleMap : function() {
			var self = this;
			if(self.currShowCamera && self.currShowCamera.baidux && self.currShowCamera.baiduy){
				var map = new BMap.Map("allmap"); // 创建Map实例
				self.map = map;
				var point = new BMap.Point(self.currShowCamera.baiduy,self.currShowCamera.baidux); // 创建点坐标
				var marker = new BMap.Marker(point);
				self.map.addOverlay(marker);
				map.centerAndZoom(point, 15); // 初始化地图,设置中心点坐标和地图级别。
				map.addControl(new BMap.ZoomControl()); // 添加地图缩放控件
				map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
			} else {
				$scope.showTip('对不起，没有获取到定位信息');
				common.popPage();
			}
		},
		initMap : function() {
			var self = this;
			var map = new BMap.Map("allmap"); // 创建Map实例
			self.map = map;
			var point = new BMap.Point(local.locationInfo.lng,local.locationInfo.lat); // 创建点坐标
			var marker = new BMap.Marker(point);
			self.map.addOverlay(marker);
			map.centerAndZoom(point, 12); // 初始化地图,设置中心点坐标和地图级别。
			map.addControl(new BMap.ZoomControl()); // 添加地图缩放控件
			map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
			self.mapSearch = new BMap.LocalSearch(map, {
				renderOptions : {
					map : map
				}
			});
			self.getCameraList();
			map.addEventListener("click", self.clickMap);
		},
		addCamera : function(cameraArr) {
			var self = this;
			angular.forEach(cameraArr, function(value, key) {
				try {
					if(value.baiduy && value.baidux){
						var marker1 = '';
						if(value.icon || value.type_icon){
							var img = IMGURL;
							if(value.icon) {
								img = img + value.icon;
							} else if(value.type_icon) {
								img = img + value.type_icon;
							}
							var BIcon = new BMap.Icon(img, new BMap.Size(30, 30));        
							marker1 = new BMap.Marker(new BMap.Point(value.baiduy,
									value.baidux), {icon: BIcon});    
						} else{
							marker1 = new BMap.Marker(new BMap.Point(value.baiduy,
									value.baidux)); // 创建标注
						}
						self.map.addOverlay(marker1); // 将标注添加到地图中
						marker1.camera = value;
						marker1.addEventListener("click", self.clickCamera);
					}
				} catch(e){
					
				}
				
			});
		},
		clickMap : function(e) {
			var self = $scope.cameraloader;
			if ($scope.isAdmin()) {
				var opts = {
					title : '提示', // 信息窗口标题
				};
				var cameraStr = "{ 'baiduy' : " +  e.point.lng +", 'baidux' : " + e.point.lat + "}";
				var content =  '<a style="color: white;" ' + 
					'href="javascript:angular.element(document.getElementById(\'mainBody\')).scope().' +
					'cameraloader.addCameraInfo('+cameraStr+');">新增直播</a>';
				
				// 创建信息窗口
				var infoWindow = new BMap.InfoWindow(content,opts);
				self.currInfoWindow = infoWindow;
				self.map.openInfoWindow(infoWindow,e.point);
			} else {
			}
		},
		clickCamera : function(e) {
			e.domEvent.stopPropagation();
			var self = $scope.cameraloader;
			if ($scope.isAdmin()) {
				var arr = [ {
					"name" : "现场在线",
					"value" : "0"
				}, {
					"name" : "修改",
					"value" : "1"
				}, {
					"name" : "删除",
					"value" : "2"
				} ];
				$scope.choiceModal.showChoice('', arr, function succ(value,
						index, name) {
					if ('0' == value) {
						self.showLive(e.target.camera);
					} else if ('1' == value) {
						self.showCameraInfo(e.target.camera);
					} else if ('2' == value) {
						self.delCamera(e.target, e.target.camera);
					}
				});
			} else {
				var opts = {
					title : e.target.camera.name, // 信息窗口标题
				};
				self.currClickCamera = e.target.camera;
				var content = "";
				if(e.target.camera.starttime && e.target.camera.endtime){
					content = "<p style='font-size:15px'>"+e.target.camera.starttime + '至' + e.target.camera.endtime +"</p> ";
				}
				content = content +  '<a style="color: white;" href="javascript:angular.element(document.getElementById(\'mainBody\')).scope().cameraloader.showLive()">现场在线</a>';
				
				// 创建信息窗口
				var infoWindow = new BMap.InfoWindow(content,opts);
				this.openInfoWindow(infoWindow);
				
//				self.showLive(e.target.camera);
			}
		},
		delCamera : function(marker, camera) {
			var self = this;
			mobileapi.confirm('确定删除?', function() {
				var params = {'id' : camera.id};
				connectServer.connect(URL.delCamera, params, function callback(
						isSuccess, data) {
					common.closeLoading();
					if (isSuccess) {
						angular.forEach(self.cameraArr, function(value, key) {
							value.value = value.id;
							if (value.id == camera.id) {
								self.cameraArr.splice(key, 1);
							}
						});
						self.map.removeOverlay(marker);
					} else {
						mobileapi.alert('删除失败，请重试');
					}
				}, 'post');
				
			});
		},
		getCameraList : function(type) {
			var self = this;
			self.clearCamera();

			common.loading();
			var param = '';
			if($scope.typeInfo.selectedType.id) {
				param = "&typeid=" + $scope.typeInfo.selectedType.id;
			}
			connectServer.connectGetArr(URL.getCameraList, param,
					function callback(isSuccess, dataArr) {
						common.closeLoading();
						if (isSuccess) {
							self.cameraArr = dataArr;
							self.addCamera(dataArr);
						}
					}, 'get');

		},
		clearCamera : function() {
			var self = this;
			// common.runOnUI(function callback() {
			//				
			// });
			self.cameraArr = [];
			if(self.map){
				self.map.clearOverlays();
				//重画我的位置
				var point = new BMap.Point(local.locationInfo.lng,local.locationInfo.lat);
				var marker = new BMap.Marker(point);
				self.map.addOverlay(marker);
			}
		},
		searchMap : function(keyStr) {
			var self = this;
			if (!keyStr) {
				return;
			}
			self.mapSearch.search(keyStr);
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
		$scope.tooltip.show(msg);
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
		inputMode: true,
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

lkl.controller('main', function($scope, common, connectServer, mobileapi,
		$timeout) {
	var images = [ 'images/tabs/zgz', 'images/tabs/xx', 'images/tabs/lts',
			'images/tabs/kj' ];
	var tabsname = [ 'one', 'two', 'three', 'four' ];

	$scope.tabbar = {
		one : {
			html : common.getPage('enpriseslist'),
			label : '单位查看'
		},
		two : {
			html : common.getPage('regist'),
			label : '单位注册'
		},
		three : {
			html : common.getPage('erweima'),
			label : '二维码'
		},
		four : {
			html : common.getPage('appsetup'),
			label : '设置'
		}
	};

	_clearall();

	function _clearall() {
		angular.forEach(tabsname, function(value, key) {
			$scope.tabbar[value].image = images[key] + '.png';
		});
	}

	$scope.activetab = function(index) {
		_clearall();
		$scope.tabbar[tabsname[index]].image = images[index] + '-selected.png';
	};
	$scope.lisener = function() {
		$scope.activetab(lkl.tabbar.main.getActiveTabIndex());
		lkl.tabbar.main.on('postchange', function() {
			$scope.activetab(lkl.tabbar.main.getActiveTabIndex());
		});
	};

});

lkl.controller('cameraList', function($scope, $http, mobileapi, utils,
		connectServer) {
	$scope.cameraList = {

	};
});
lkl.controller('appsetup', function($scope, $http, common, mobileapi, utils,
		connectServer) {
	$scope.appsetup = {
		loginout : function() {
			if (local.isAdmin) {
				mobileapi.confirm('确定退出?', function() {
					common.runOnUI(function() {
						local.isAdmin = false; 
						local.logined = false; 
						local.access_token = '';
						common.saveLocal();
					});
				});
			} else {
				// local.isAdmin = true;
				// common.saveLocal();
				common.pushPage('login');
			}
		},
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
