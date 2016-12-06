lkl.controller('camerainfo', function($scope, connectServer, mobileapi, utils,
		common) {
	$scope.completeBtnTxt = tempParams['completeBtnTxt'] || '发布';
	$scope.title = tempParams['titleTxt'] || '发布信息';
	$scope.cameraInfo = tempParams['cameraInfo'] || {};
	$scope.cameraUrl = '';

	function initInfo() {
		try{
			if($scope.cameraInfo.starttime) {
				var dateSplit = $scope.cameraInfo.starttime.split(' ');
				$scope.cameraInfo.beginDate = dateSplit[0];
				$scope.cameraInfo.beginTime = dateSplit[1];
			} 
			if($scope.cameraInfo.endtime) {
				var dateSplit = $scope.cameraInfo.endtime.split(' ');
				$scope.cameraInfo.endDate = dateSplit[0];
				$scope.cameraInfo.endTime = dateSplit[1];
			} 
		} catch(err) {
			
		}
	};
	
	initInfo();
	
	$scope.showTypeChoice = function() {
		var arr = [];
		angular.forEach($scope.typeInfo.typeDic, function(value, key) {
			arr.push({"name" : value.name,"value" : value.id});
		});
		
		$scope.choiceModal.showChoice('', arr, function succ(value,
				index, name) {
			$scope.cameraInfo.typeid = value;
		});
		
	};
	
	$scope.submit = function(jobinviteInfoForm) {
//		var starttime = $scope.cameraInfo.beginDate + ' '
//				+ $scope.cameraInfo.beginTime;
//		var endtime = $scope.cameraInfo.endDate + ' '
//				+ $scope.cameraInfo.endTime;
//
//		if ($scope._comparedate(starttime, endtime) == 1) {
//			mobileapi.alert('开始时间不能大于结束时间');
//			return;
//		}
//
//		if ($scope._comparedate(endtime) == -1) {
//			mobileapi.alert('结束时间不能小于当前时间');
//			return;
//		}
//
//		$scope.cameraInfo.starttime = starttime;
//		$scope.cameraInfo.endtime = endtime;

		common.loading();
		var url = $scope.cameraInfo.id ? URL.updateCamera : URL.addCamera;
		connectServer.connect(url, $scope.cameraInfo, function(isSuccess, data) {
			common.closeLoading();
			if(isSuccess){
				$scope.showTip($scope.title + '成功');
				common.popPage();
			} else {
				$scope.showTip($scope.title + '失败，请重试');
			}
		}, 'post');
	};

	$scope._parseDate = function(d) {
		if (d) {
			if (angular.isDate(d)) {
				return d
			} else if (typeof d == 'string') {
				// console.log(d);
				d = d.replace(/-/g, '/').replace(/\.[0-9]+$/, '');
				d = new Date(d);
				// console.log(d);
				return d;
			} else {
				return null;
			}
		} else {
			return null;
		}
	};

	$scope._comparedate = function(date1, date2) {
		if (!date2)
			date2 = new Date();
		if (date1 && date2) {
			var d1 = $scope._parseDate(date1);
			var d2 = $scope._parseDate(date2);

			if (d1 && d2) {
				var t1 = d1.getTime();
				var t2 = d2.getTime();
				if (t1 == t2) {
					return 0;
				} else {
					if (t1 > t2) {
						return 1;
					} else {
						return -1;
					}
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	};

});