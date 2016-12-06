lkl.controller('login',function($scope,connectServer,mobileapi,utils,common){
	$scope.loginname = local.loginedCellPhone || '';
	$scope.password = (local.loginedPassword?local.loginedPassword.substring(0,15):'');
	$scope.loginBtnIsLock = false;
	$scope.toRegist = function() {
		common.pushPage('regist');
	};
	$scope.toForgetPassword = function() {
		common.pushPage('forgetPassword');
	};
	$scope.submit = function() {
		if($scope.loginBtnIsLock) return;
		var loginname = $scope.loginname;
		var password = $scope.password;
		$scope.loginBtnIsLock = true;
		common.loading('正在登陆...');
		if(local.loginedPassword && password == local.loginedPassword.substring(0,15)){
			password = local.loginedPassword;
		}else{
			password = utils.md5(password);
		}
		var params = '?username=' + loginname
				+ '&pwd=' + password + '&1=1';
		connectServer.verLogin(params, function(isSuccess, data) {
			local.isAdmin = true; 
			local.logined = true; 
			common.saveLocal();
			common.popPage();
			if (isSuccess) {
				
				local.loginedCellPhone = loginname;
				local.loginedPassword = password;
				
				local.isAdmin = true; 
				local.logined = true; 
				common.saveLocal();
//				common.popPage();
				if($scope.cameraloader){
					$scope.cameraloader.refreshData();	
				}
				
			} else {
				mobileapi.alert("登录失败: " + (data.msg || ''));
			}
			common.closeLoading();
			$scope.loginBtnIsLock = false;
			
			
		});
	};
	
});