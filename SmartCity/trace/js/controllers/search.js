lkl.controller('search', function($scope, connectServer, mobileapi, utils, common,pluginService) {
	$scope.searchShopHistory = [];
	$scope.shopArr = [];
	$scope.isShowEmpty = false;
	$scope.searchStr = '';
	$scope.lastSearchStr = '';
	$scope.isLoadSuccess = true;

	function showSearchShophistoryList() {
		if(local.searchShopHistory && local.searchShopHistory.length > 0) {
			$scope.searchShopHistory = local.searchShopHistory;
		}
		
	};

	$scope.isShowHistory = function() {
		return !$scope.isShowResult() && $scope.searchShopHistory.length > 0;
	};

	$scope.isShowResult = function() {
		return $scope.lastSearchStr == $scope.searchStr && $scope.searchStr.length > 0;
	};

	$scope.cleanSearchHistory = function() {
		$scope.searchShopHistory = [];
		local.searchShopHistory = $scope.searchShopHistory;
		common.saveLocal(local);
	};
	$scope.cleanSearchStr = function() {
		$scope.searchStr = '';
		$scope.lastSearchStr = '';
	};

	$scope.clickHistoryItem = function(searchStr) {
		$scope.searchShop(searchStr);
	};

	$scope.clickChoiceShop = function(shopData) {
//		common.popPage();
//		common.popPage();
		$scope.shopData.choiceShop(shopData);
	};

	$scope.saveSearchHistory = function(searchStr){
		var shop = {'name' : searchStr};
		angular.forEach($scope.searchShopHistory,function(value,key){
			if(value.name == searchStr){
				$scope.searchShopHistory.splice(key, 1);
			}
		});
		$scope.searchShopHistory.unshift(shop);
		local.searchShopHistory = $scope.searchShopHistory;
		common.saveLocal(local);
	};

	$scope.searchShop = function(searchStr){
		if(!searchStr){
			searchStr = $scope.searchStr.trim();
		}
		if(searchStr.length == 0 || $scope.lastSearchStr == searchStr) {
			return;
		}
		pluginService.hideKeyboard();
		$scope.searchShopNow(searchStr)
	};
	$scope.searchShopNow = function(searchStr){
		if(!searchStr){
			searchStr = $scope.searchStr.trim();
		}

		$scope.lastSearchStr = searchStr;
		$scope.searchStr = searchStr;
		$scope.saveSearchHistory(searchStr);
		$scope.shopArr = [];
		common.loading();
		var param = '&node_name=' + searchStr;
		var url  = URL.getShopList;
		connectServer.connectGetArr(url, param,
			function callback(isSuccess, dataArr) {
				$scope.isLoadSuccess = isSuccess;
				common.closeLoading();
				$scope.isShowEmpty = !(isSuccess &&  dataArr.length && dataArr.length > 0);
				if (!$scope.isShowEmpty) {
					$scope.shopArr = dataArr;
				}
			}, 'get');
	};

	showSearchShophistoryList();
});