if(typeof ons!='undefined'){
	ons.disableAutoStatusBarFill();
	function _scope(){
		return angular.element(document).scope();
	}
	ons.ready(function() {	
		//ons.disableDeviceBackButtonHandler();
//		ons.createPopover('popoverone.html').then(function(popover) {});
//		ONSREADY = true;
		//唤醒
//		document.addEventListener("resume",function(){
//			try{
//				var scope = angular.element(document).scope();
//				if(scope.locationinfo){
//					scope.locationinfo.updategps();
//				}
//			}catch(e){
//				
//			}
//		} , false); 
		
		//返回键
		document.addEventListener("backbutton", function(){
			alert('sss');
			var scope = angular.element(document).scope();
			if(scope.onbackbutton){
				scope.onbackbutton();
			}
		}, false); 
		
		//联网
		document.addEventListener("online",function(){
			PARAMS.isonline = true;
		} , false); 
		
		//断网
	    document.addEventListener("offline",function(){
	    	PARAMS.isonline = false;
	    } , false); 
		
		lkl.nav.on('postpop',function(a){
			var len =  lkl.nav.getPages().length;
			var enterPage = a.enterPage;
			//if(len >=2){
				var attrvar = enterPage.element.attr('var');
				if(attrvar && CACHE.scrolltop[attrvar]){
					var one = enterPage.element[0].querySelector('ons-scroller');
					if(one && one.scrollTop == 0){
//						console.log('use cache scrolltop');
//						console.log(attrvar);
//						console.log(CACHE.scrolltop[attrvar]);
						one.scrollTop = CACHE.scrolltop[attrvar];
					}
				}
			//}
		});
		lkl.nav.on('prepop',function(a){
			var len =  lkl.nav.getPages().length;
			var currentPage = a.currentPage;
			var attrvar = currentPage.element.attr('var');
			if(attrvar){
//				console.log('clear cache scrolltop');
//				console.log(attrvar);
				CACHE.scrolltop[attrvar] = 0;
				if(attrvar == 'lkl.page.getjobinfo' || attrvar == 'lkl.page.invitejobinfo'){
					_scope().search.clearoptions();
				}else if(attrvar == 'lkl.page.chatdetail'){
					_scope().chatControl.closeChat();
					try{
						_scope().$digest();
					}catch(e){}
					
				}
			}
		});
		lkl.nav.on('postpush',function(a){
			
		});
		lkl.nav.on('prepush',function(a){
			var len =  lkl.nav.getPages().length;
			var currpage = a.currentPage;
			
			//if(len >=2){
				var one = currpage.element[0].querySelector('ons-scroller');
				if(one && one.scrollTop > 0){
					var attrvar = currpage.element.attr('var');
					if(attrvar){
//						console.log('remember cache scrolltop');
//						console.log(attrvar);
//						console.log(one.scrollTop);
						CACHE.scrolltop[attrvar] = one.scrollTop;
					}
				}else if(one && one.scrollTop == 0){
					var attrvar = currpage.element.attr('var');
					if(attrvar){
//						console.log('remember cache scrolltop');
//						console.log(attrvar);
//						console.log(one.scrollTop);
						CACHE.scrolltop[attrvar] = 0;
					}
				}
			//}
		});
		/*
		 * lkl.nav.on('postpush',function(a){
			if(a.enterPage.name.indexOf(MODEL_NAME['mainFindJob'])!=-1){
				lkl.tabbar.mainfindjob.on('postchange',function(){
					var index = lkl.tabbar.mainfindjob.getActiveTabIndex();
					lkl.tabbar.mainfindjob._scope.$parent.activetab(index);
				});
			}else if(a.enterPage.name.indexOf(MODEL_NAME['mainFindPerson'])!=-1){
				lkl.tabbar.mainfindperson.on('postchange',function(){
					var index = lkl.tabbar.mainfindperson.getActiveTabIndex();
					lkl.tabbar.mainfindperson._scope.$parent.activetab(index);
				});
			}
		});
			lkl.nav.on('prepush',function(a){
				console.log('lkl.nav prepush');
				console.log(a);
			});
			
		    document.addEventListener("pause", onPause, false);
		    
		   
		    document.addEventListener("backbutton", onPause, false); //android
		    document.addEventListener("menubutton", onMenubutton, false); //android
		    document.addEventListener("searchbutton",onSearchbutton , false); //android
	    */
	});
}