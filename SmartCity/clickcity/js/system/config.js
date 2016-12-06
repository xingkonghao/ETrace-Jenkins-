var DEBUG = true;
//是否是ios系统
var ISIOS = /iP(ad|hone|od)/.test(navigator.userAgent);
var HASTOUCH = ('ontouchstart' in window);
var ANDROID4_4 = /Android 4\.4/g.test(navigator.userAgent);
var ISANDROID = /Android/.test(navigator.userAgent);
var photoColumn = 4;
var iScrollClick = (function(){
	if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) return false;
	if (/Chrome/i.test(navigator.userAgent)) return true;//(/Android/i.test(navigator.userAgent));
	if (/Silk/i.test(navigator.userAgent)) return false;
	if (/Android/i.test(navigator.userAgent)) {
	   var s=navigator.userAgent.substr(navigator.userAgent.indexOf('Android')+8,3);
	   return parseFloat(s[0]+s[3]) < 44 ? false : true
    }
})();
var groupAdminType = '1';
var groupMemberType = '5';
var conversationDelState = '1';
var tabbar_msg_index = 1;
var pageSize = 10;

var tempParams = {
	
};
var local = {
	access_token : '',
	userid : '',
	loginedCellPhone : '',
	loginedPassword : '',
	logined : false,
	registType : '',
	isFirst : true,
	rctoken : '',
	isAdmin : false,
	locationInfo : {},
};
var REG_CELLPHONE = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
var CONFIG = {
	registType : {
		findJob : '找工作',
		findPerson : '找员工'
	},
	dicid :{
		findPerson : '8a21b79b4926c7210149450a2edf0106'
		,findJob: '8a21b79b4926c72101494509f0b80105'
	},
	linktype:{
		jobgetbrowse:'jobgetbrowse'
		,jobinvitebrowse:'jobinvitebrowse'
	},
	readlogtype:{
		jianli:'sendjl'
		,guanzhu:'enterprisenew'
		,mstz:'facenotice'
		,offlinemessage:'offlinemessage'
	},
	appversion:[1.5],
	appversionname:'1.06',
	appversioncode : 6
};	

var PARAMS = {isonline:true};

//onsUI 是否已经准备完毕
var ONSREADY = false;
/*
 * IP 地址,如果在浏览器中调试,必须和浏览器的地址一致
 */
//var WEB_ADDRESS = 'http://192.168.1.7:8080/eeplat/servicecontroller?callType=sa&contextServiceName=';
var WEB_ADDRESS = 'http://www.jinyeiot.com/city/';
var IMGURL = 'http://jinyeiot.com/city/upload/';

var URL = {
	// 登陆
	login : WEB_ADDRESS + 'api/login',
	binduser : WEB_ADDRESS + 'api/lkl_accounts_bind_weixin',
	getCameraList : WEB_ADDRESS + 'api/jy/covering',
	getVideoList : WEB_ADDRESS + 'api/jy/video',
//	getTypeList : WEB_ADDRESS + 'type_get',
	getTypeList : WEB_ADDRESS + 'api/jy/type',
	delCamera : WEB_ADDRESS + 'api/jy/type',
	addCamera : WEB_ADDRESS + 'api/jy/covering/',
	updateCamera : WEB_ADDRESS + 'api/jy/covering/update',
	delCamera : WEB_ADDRESS + 'api/jy/covering/delete',
	getRecommendList : WEB_ADDRESS + 'api/jy/recommend',
	getForeshowList : WEB_ADDRESS + 'api/jy/video/trailer',
	getCameraByVideoId : WEB_ADDRESS + 'api/jy/video/byid',
};

var MODEL_NAME = {
	//登陆
	login : 'login.html',
	main : 'main.html',
	enterpriseslist : 'enterprisesList.html',
	regist : 'regist.html',
	erweima : 'erweima.html',
	appsetup : 'appsetup.html',
	map : 'map.html',
	mapSingle : 'mapSingle.html',
	cameraList : 'cameraList.html',
	aboutus : 'contactus.html',
	content : 'content.html',
	cameraInfo : 'cameraInfo.html',
	foreshowList : 'cameraForeshowList.html',
};

var CACHE = {
	//存取的是加载json资源时，json资源对应的数据
	JSON:{}
	//优化mobileapi.sessioin时用
	,SESSION:{}
	,scrolltop:{}
};
var RESOUCES = {
	//图片资源
	images : ['images/mdr.png','images/deletebtn.png','images/green_arrow.png','images/finallogo.png','images/fsjl.png','images/headicon.png','images/headiconadd.png','images/heng_ceshi.png','images/loginBg.png','images/logo.png','images/pao-loading.gif','images/passwordlabel.png','images/phone.png','images/photoadd.png','images/pic_loading.png','images/userlabel.png','images/white_arrow.png','images/zhaopian.png','images/advert/1.png','images/advert/2.png','images/advert/3-2.png','images/loadresource/body.png','images/loadresource/bottom.png','images/loadresource/logo.png','images/loadresource/top.png','images/msgtop/bg.png','images/msgtop/dwdt-selected.png','images/msgtop/dwdt.png','images/msgtop/jlx-selected.png','images/msgtop/jlx.png','images/msgtop/lt-selected.png','images/msgtop/lt.png','images/msgtop/xttz-selected.png','images/msgtop/xttz.png','images/msgtop/yqtz-selected.png','images/msgtop/yqtz.png','images/msgtop/yzxx-selected.png','images/msgtop/yzxx.png','images/spaceicon/accessrecord.png','images/spaceicon/attention.png','images/spaceicon/dwxx.png','images/spaceicon/favorite.png','images/spaceicon/ltqz.png','images/spaceicon/lxxx.png','images/spaceicon/postrecord.png','images/spaceicon/qzjl.png','images/spaceicon/setaccountstate.png','images/spaceicon/userinfo.png','images/spaceicon/verifyinfo.png','images/spaceicon/ztsz.png','images/spaceicon/zwxx.png','images/tabs/kj-selected.png','images/tabs/kj.png','images/tabs/lts-selected.png','images/tabs/lts.png','images/tabs/xx-selected.png','images/tabs/xx.png','images/tabs/zgz-selected.png','images/tabs/zgz.png','images/tabs/zyg-selected.png','images/tabs/zyg.png','images/sendfail.png','images/mood/1.png','images/mood/10.png','images/mood/11.png','images/mood/12.png','images/mood/13.png','images/mood/14.png','images/mood/15.png','images/mood/16.png','images/mood/17.png','images/mood/18.png','images/mood/19.png','images/mood/2.png','images/mood/20.png','images/mood/21.png','images/mood/22.png','images/mood/23.png','images/mood/24.png','images/mood/25.png','images/mood/26.png','images/mood/27.png','images/mood/28.png','images/mood/29.png','images/mood/3.png','images/mood/30.png','images/mood/31.png','images/mood/32.png','images/mood/33.png','images/mood/34.png','images/mood/35.png','images/mood/36.png','images/mood/37.png','images/mood/38.png','images/mood/39.png','images/mood/4.png','images/mood/40.png','images/mood/41.png','images/mood/42.png','images/mood/43.png','images/mood/44.png','images/mood/45.png','images/mood/46.png','images/mood/47.png','images/mood/48.png','images/mood/49.png','images/mood/5.png','images/mood/50.png','images/mood/51.png','images/mood/6.png','images/mood/7.png','images/mood/8.png','images/mood/9.png']
	//json 数据资源
	,jsons : ['json/tables.json','json/card.json','json/data_province.json','json/data_city.json','json/data_area.json','json/positions.json']
	//一些需要提前加载的文件
	,files : []
	//模板资源
	,doms : ['html/modal/choicemodal.html','html/modal/choiceposition.html'
	         ,'html/modal/fsmstz.html','html/modal/searchfilter.html'
	         ,'html/modal/selectcity.html','html/modal/tooltip.html'
	         ,'html/modal/selectcityfullscreen.html','html/modal/fsjl.html'
	         ,'html/modal/inputmodal.html','html/modal/offlinemessage.html','html/modal/loading.html','html/modal/choicetime.html']
};
