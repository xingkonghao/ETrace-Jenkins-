lkl.controller('cameraForeshowList', function($scope, connectServer, mobileapi, utils,
		common) {
	$scope.foreshowArr = [];
	
	function getForeshowList() {
		common.loading();
		var param = '';
//		if($scope.typeInfo.selectedType.id) {
//			param = "&typeid=" + $scope.typeInfo.selectedType.id;
//		}
		var url = URL.getForeshowList;
		connectServer.connectGetArr(url, param,
			function callback(isSuccess, dataArr) {
				common.closeLoading();
				if (isSuccess) {
					$scope.foreshowArr = dataArr;
				}
			}, 'get');
	};
	
	getForeshowList();
});