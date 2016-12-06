lkl.controller('enterpriseinfo',function($scope,$http,mobileapi,utils,sqlite,connectServer,pluginService){
	$scope.enterpriseinfo = {
		area : mobileapi.session('cachearea') || {},
		accountInfo : mobileapi.session('accountinfo'),
		changedImgUri : '',
		changedImgKey : '',
		saveInfo:function(enterpriseInfoForm){
			var self = this;
			if(enterpriseInfoForm.$valid){
				$scope.loading('保存数据中');
				//防止头像已修改头像后无效bug
				self.accountInfo.headportrait = mobileapi.session('accountinfo').headportrait;
				sqlite.table('enterprises').replacesFromLocal({},[self.accountInfo]).then(function(success,data){
					if(success) {
						mobileapi.session('accountinfo',self.accountInfo);
						if(self.changedImgKey){
							//alert("==更改businesslicence成功，插入上传文件记录前");
							$scope.photoloader.savePhotoUploadRecord(self.changedImgUri,self.changedImgKey,function(success,data){
								if(success) {
									//alert("==更改businesslicence成功，并插入上传文件记录");
									$scope.synchronization.syncData();
									$scope._popPage();
								}
								$scope.closeLoading();
							});
						} else {
							//alert("==未更改businesslicence");
							$scope.synchronization.syncData();
							$scope._popPage();
							$scope.closeLoading();
						}
					} else {
						$scope.closeLoading();
					}
				});
			} else {
				mobileapi.alert('请完善信息后再保存');
			}
		},
		changeBusinesslicence : function(){
			var self = this;
			function succ(value,index) {
				var imgkey = utils.uuid();
				pluginService.getPhoto(value,function(imageuri) {
					$scope.$apply(function(){
						self.changedImgKey = imgkey;
						self.changedImgUri = imageuri;
						$scope.enterpriseinfo.accountInfo.businesslicence = imgkey;
						//alert("==" + self.accountInfo.businesslicence);
					});
				},imgkey);
			}
			$scope.space.getPhoto(succ);
		},
		showTradeType : function() {
			var self = this;
			self.showChoice('请选择行业类别',$scope.dictionarybytype['tradetype'],self.accountInfo,'tradetype');
		},
		showChoice:function(choiceTitle,choiceArr,model,propertyName) {
			$scope.choiceModal.showDicChoice(choiceTitle,choiceArr,succ);
			function succ(value,index) {
				model[propertyName] = value;
			}
		}
	};
});
lkl.controller('enterpriseslist',function($scope,$http,mobileapi,connectServer,funs,utils){
//	var accountid = mobileapi.session('account').id;
	
	$scope.enterpriseslist = {
		dataarr:[]
		,loading:true
		,itemclick:function(data,e){
			if(e.target.type == 'checkbox')return;
			var self = this;
			if(self.edit){
				data.checked = !data.checked;
			}else{
//				mobileapi.session('showuserinfoaccountid',data.accountid);
//				funs.pushPage('accountinfoshow');
			}
		},
		selectall:function(){
			var self = this;
			for(var i=0,len=self.dataarr.length;i<len;i++){
				self.dataarr[i].checked = true;
			}
		},
		selectinvert:function(){
			var self = this;
			for(var i=0,len=self.dataarr.length;i<len;i++){
				self.dataarr[i].checked = !self.dataarr[i].checked;
			}
		},
		cancelver:function(){
			var self = this;
			var ret = [];
			for(var i=0,len=self.dataarr.length;i<len;i++){
				if(self.dataarr[i].checked){
					ret.push(self.dataarr[i].id);
				}
			}
			if(ret.length==0){
				mobileapi.alert('请选择');
			}else{
				mobileapi.confirm('确认删除选中的验证记录？',function(){
					funs.loading('删除选中的验证记录中');
					connectServer.deleteuserverifymulti('id='+ (ret.join(',')),function(success,data){
						if(success){
							$scope.tooltip.show('删除成功!');
						}else{
							$scope.tooltip.show('删除失败!');
						}
						self.init();
						funs.closeLoading();
					});
				},function(){});
			}
		},init:function(){
			var self = this;
			connectServer.connectGetArr(URL.getEnterpriseList,'&salesid='+local.salesid,function(success,data){
				self.loading = false;
				if(success){
					if(!data.length && data.id){
						data = [data];
					}
					self.dataarr = data;
				}else{
					self.dataarr = [];
				}
			});
		}
	};
	$scope.enterpriseslist.init();
});

