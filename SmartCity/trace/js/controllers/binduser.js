lkl.controller('binduser', function($scope, connectServer, mobileapi, utils,
		common) {
	$scope.loginname = '';
	$scope.password = '';
	$scope.loginBtnIsLock = false;

	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}

	$scope.submit = function() {
		if ($scope.loginBtnIsLock)
			return;
		var loginname = $scope.loginname;
		var password = $scope.password;
		var weixinopenid = getQueryString('openid');
		var eventkey = getQueryString('eventkey');
		$scope.loginBtnIsLock = true;
		common.loading('绑定用户中...');
		var params = '&loginname=' + loginname + '&pwd=' + utils.md5(password)
				+ '&openid=' + weixinopenid + '&eventkey=' + eventkey;
		connectServer.bindUser(params, function(isSuccess, data) {
			if (isSuccess && data.succ == 'succ') {
				mobileapi.alert(data.msg || '绑定用户成功');
			} else {
				mobileapi.alert(data.msg || '绑定用户失败');
			}
			common.closeLoading();
			$scope.loginBtnIsLock = false;
		});
	};

});