lkl.controller('shop', function($scope, connectServer, mobileapi, utils, common,pluginService) {
	$scope.shopType = 'history';
	$scope.selectedSuperMarketParent = '';
	$scope.selectedVegetableMarketArea = '';
	$scope.isLoadSuccess = true;
	$scope.isOnLine = true;
	$scope.isShowSearch = false;
	
	function showShopList() {
		$scope.shopData.loadChoiceHistory();
		$scope.shopData.findNearbyShop();
//		if($scope.shopData.shopNearbyArr.length > 0) {
//			$scope.shopType = 'nearby';
//		} else 
		if($scope.shopData.shopHistory.length > 0) {
			$scope.shopType = 'history';
		} else {
			$scope.shopType = $scope.shopData.typeSuper;
		}
	}
	
	$scope.goBack = function() {
		if($scope.isShowSearch) {
			$scope.isShowSearch = false;
			initSearchParams();
		} else{
			lkl.nav.popPage();
		}
	}
	
	$scope.showSearchShop = function(){
//		common.pushPage('search');
		$scope.isShowSearch = true;
		initSearchParams();
		showSearchShophistoryList();
	};
	$scope.reloadShop = function(){
		getShopList();
	};
	
	$scope.clickSuperMarketParent = function(data) {
		$scope.selectedSuperMarketParent = data.node_id;
	};
	
	$scope.clickVegetableMarketArea = function(data) {
		$scope.selectedVegetableMarketArea = data.area_id;
	};
	
	$scope.clickShop = function(shopData) {
//		common.popPage();
		$scope.shopData.choiceShop(shopData);
	};
	
	function getShopList() {
		var self = this;
		common.loading();
		$scope.shopData.getShopData(function(isSuccess) {
			$scope.isLoadSuccess = isSuccess;
			if(!isSuccess){
				$scope.isOnLine = PARAMS.isonline;
			}
			showShopList();
			if($scope.shopData.superMarketParentArr.length > 0) {
				$scope.selectedSuperMarketParent =  $scope.shopData.superMarketParentArr[0].node_id;
			}
			if($scope.shopData.vegetableMarketAreaArr.length > 0) {
				$scope.selectedVegetableMarketArea = $scope.shopData.vegetableMarketAreaArr[0].area_id;
			}
			common.closeLoading();
		});
	};
	
	getShopList();
	
	
	
	
	
	
	
	$scope.searchShopHistory = [];
	$scope.shopArr = [];
	$scope.isShowEmpty = false;
	$scope.searchStr = '';
	$scope.lastSearchStr = '';
	
	function initSearchParams() {
		$scope.searchShopHistory = [];
		$scope.shopArr = [];
		$scope.isShowEmpty = false;
		$scope.searchStr = '';
		$scope.lastSearchStr = '';
	}

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
		if(!$scope.isShowSearch) {
			$scope.showSearchShop();
		}
		
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
	
});