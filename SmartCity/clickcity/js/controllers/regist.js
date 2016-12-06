lkl.controller('regist',function($scope,common,connectServer,mobileapi,utils){
	$scope.findJob = CONFIG.registType.findJob;
	$scope.findPerson = CONFIG.registType.findPerson;
	$scope.findJobID = CONFIG.dicid.findJob;
	$scope.findPersonID = CONFIG.dicid.findPerson;
	
	$scope.reInitRegistInfo = function() {
		$scope.regist.cellphone = '';
		$scope.regist.vercode = '';
		$scope.regist.password = '';
		$scope.regist.verpass = '';
		$scope.regist.btnVerCodeLock = false;
		$scope.regist.btnVerCodeLockDelay = 60;
		//是否禁用手机号登录
		$scope.regist.islockedphone = 0;
		$scope.regist.btnCompleteLock = false;
		//公司的登录名
		$scope.regist.loginname = '';
		$scope.regist.isVerCodeBtnDelayed = false;
		$scope.regist.registType = $scope.findPersonID;
	}
	
	$scope.reInitRegistInfo();
	
	$scope.checkloginname = function(loginname){
		return;
		$scope.ischeckingloginname = true;
		var lnvalue = $scope.regist.loginname;
		loginname.$setValidity("isrepeat", true);
		if(lnvalue){
			connectServer.findbyPhone('&loginname=' + lnvalue,function(success,data){
				if(success && data.cellphone){
					loginname.$setValidity("isrepeat", false);
				}
				$scope.ischeckingloginname = false;
			})
		}
	}
	$scope.compare = function(ctrl){
		var bool = (!$scope.regist.password || !$scope.regist.verpass) || ($scope.regist.password != $scope.regist.verpass);
		ctrl.password.$setValidity("isequals", bool);
		ctrl.verpass.$setValidity("isequals", bool);
		return bool;
	}
	//返回按钮
	$scope.backbtn = function(){
		if(lkl.nav.pages.length == 1){
			common.resetToPage('login');
		}else{
			common.popPage();
		}
	};
	
	//获取验证码
	$scope.getVerCode = function() {
		var cellphone = $scope.regist.cellphone;
		var params = '&cellphone=' + cellphone;
		
		if(!REG_CELLPHONE.test($scope.regist.cellphone)){
			mobileapi.alert('请输入正确的手机号');
			return;
		}
		
		$scope.regist.btnVerCodeLock = true;
		
		connectServer.sendCellPhoneSMS(params, function(isSuccess, data) {
			if (isSuccess) {
				if (!$scope.regist.isVerCodeBtnDelayed) {
					$scope.regist.isVerCodeBtnDelayed = true;
					if (data.delay) {
						$scope.regist.btnVerCodeLockDelay = data.delay;
					}
					$scope.regist.reCalcDelayLock($scope.regist.btnVerCodeLockDelay);
				} else {
					$scope.regist.btnVerCodeLock = false;
				}
//				pluginService.getSMSVerCode(function(winParam){
//					$scope.regist.vercode = winParam || '';
//				});
			} else {
				mobileapi.alert("校验码发送失败: " + (data.msg || ''));
				$scope.regist.btnVerCodeLock = false;
			}
		});
	};
	
	//完成注册
	$scope.complete = function() {
		if($scope.ischeckingloginname){
			mobileapi.alert('正在检查用户名，请稍后重试');
			return;
		}
		if($scope.regist.btnCompleteLock) return;
		var islockedphone = $scope.regist.islockedphone;
		var password = $scope.regist.password;
		var verpass = $scope.regist.verpass;
		var vercode = $scope.regist.vercode;
		var registType = $scope.regist.registType;
		var cellphone = $scope.regist.cellphone;
		var loginname = $scope.regist.loginname;
		if(password != verpass){
			mobileapi.alert("两次密码不一致!");
			return;
		}
		if(!registType){
			mobileapi.alert('请选择类型');
			return;
		}
		if(!REG_CELLPHONE.test(cellphone)){
			mobileapi.alert('请输入正确的手机号');
			return;
		}
		$scope.regist.btnCompleteLock = true;
		common.loading('正在注册');
		password = utils.md5(password);
		
		//当禁用手机号做为登录名时
		if(!loginname) {
			loginname = cellphone;
		}
			
		var params = '&cellphone=' + cellphone
					+ '&pwd=' + password
					+ '&code=' + vercode
					+ '&accounttype=' + registType
					+ '&loginname=' + loginname
					+ '&salesid=' + local.salesid;
		
		connectServer.registAccount(params,function(isSuccess, data) {
			if (isSuccess) {
//				mobileapi.confirm('注册成功,是否继续完善基本信息？',function(){
//					common.pushPage('addenterpriseinfo');
//					var accountinfo = {};
//					mobileapi.session('accountinfo')
//				},'否','是');
				mobileapi.alert("注册成功");
				$scope.runOnUI(function () {
					$scope.reInitRegistInfo();
				});
			} else {
				mobileapi.alert("注册失败: " + (data.msg || ''));
			}
			common.closeLoading();
			$scope.regist.btnCompleteLock = false;
		});
	}
});