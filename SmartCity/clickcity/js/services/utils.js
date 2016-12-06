/**
 * 实现一些帮助方法
 * 加密
 * JSON转参数串
 */

lkl.factory('utils',function($http) {
	var EARTH_RADIUS = 6378.137;
	var _baiduurl = "http://api.map.baidu.com/";
	var _geocoder = _baiduurl + "geocoder/v2/?";
	var _geoconv = _baiduurl + "geoconv/v1/?";
	var _location = _baiduurl + "location/ip?";
	var _baiduak = "C2aGT6CrvyN6pnBCN0Pc65cY";
	var BAIDUAPIERROR = {
		'0':'正常',
		'1':'服务器内部错误',
		'2':'请求参数非法',
		'3':'权限校验失败',
		'4':'配额校验失败',
		'5':'ak不存在或者非法',
		'101':'服务禁用',
		'102':'不通过白名单或者安全码不对',
		'203':'无请求权限',
		'204':'无请求权限',
		'205':'无请求权限',
		'210':'无请求权限',
		'233':'无请求权限',
		'231':'用户uid，ak不存在',
		'232':'用户、ak被封禁',
		'234':'sn签名计算错误',
		'210':'权限资源不存在',
		'345':'分钟配额超额',
		'346':'月配额超额',
		'347':'年配额超额',
		'348':'永久配额超额无请求权限',
		'355':'日配额超额',
		'350':'配额资源不存在'
	};
	
	//获取当前设备的地理位置信息
	var _locationurl = _location + "ak=" + _baiduak + "&coor=bd09ll&ip=";
	//通过经纬度坐标获取位置信息
	var _geocoderurl = _geocoder + "ak=" + _baiduak + "&output=json&location=??";
	//通过位置信息获取经纬度坐标
	var _geocoderurl2 = _geocoder + "ak=" + _baiduak + "&output=json&address=??&city=??";
	/*
	 *  将常用经纬度坐标转换为百度用的坐标
	    from 参数	源坐标类型
	    1：GPS设备获取的角度坐标;
		2：GPS获取的米制坐标、sogou地图所用坐标;
		3：google地图、soso地图、aliyun地图、mapabc地图和amap地图所用坐标
		4：3中列表地图坐标对应的米制坐标
		5：百度地图采用的经纬度坐标
		6：百度地图采用的米制坐标
		7：mapbar地图坐标;
		8：51地图坐标
		
		to 参数	目的坐标类型	
		5：bd09ll(百度经纬度坐标),
		6：bd09mc(百度米制经纬度坐标);
	 */
	var _geoconvurl = _geoconv + "ak=" + _baiduak + "&output=json&from=1&to=5&coords=??";
	
	var obj = {};
	//获取当前设备的地理位置信息
	obj.GPSByBaidu = function(callback){
		$http.get(_locationurl).success(function(data, status, headers, config){
			if(data && data.status == 0){
				var one= data.content;
				callback(true,{lng:one.point.x,lat:one.point.y,city:one.address_detail.city}); 
			}else{
				var errorinfo = BAIDUAPIERROR[data.status];
				callback(false,'status error:' + (errorinfo?errorinfo:data)); 
			}
		}).error(function(data, status, headers, config){
			callback(false,'return data error:' + data); 
		});
	};
	//将设备获取到的GPS转换成百度地图的经纬度
	obj.convertGPS2BaiDu = function(lat,lng,callback){
		if(lat && lng){
			$http.get(_geoconvurl.replace('??',lng+','+lat)).success(function(data, status, headers, config){
				if(data && data.status == 0){
						var one= data.result[0];
						callback(true,{lng:one.x,lat:one.y}); 
				}else{
					var errorinfo = BAIDUAPIERROR[data.status];
					callback(false,'status error:' + (errorinfo?errorinfo:data)); 
				}
			}).error(function(data, status, headers, config){
				callback(false,'return data error:' + data); 
			});
		}
	};
	//通过经纬度获取地理位置信息
	obj.getLatLngInfo = function(lat,lng,callback){
		if(lat && lng){
			$http.get(_geocoderurl.replace('??',lat+','+lng)).success(function(data, status, headers, config){
				if(data && data.status == '0'){
					var posinfo = data.result.addressComponent;
					if(posinfo.city){
						callback(true,posinfo);
					}else{
						callback(false,posinfo);
					}
				}else{
					var errorinfo = BAIDUAPIERROR[data.status];
					callback(false,'status error:' + (errorinfo?errorinfo:data)); 
				}
			}).error(function(data, status, headers, config){
				callback(false,data);
			});
		}
	};
	//通过地理位置信息获取经纬度
	obj.getAddressInfo = function(address,city,callback){
		if(address && city){
			$http.get(_geocoderurl2.replace('??',address).replace('??',city)).success(function(data, status, headers, config){
				if(data && data.status == '0'){
					var posinfo = data.result.location;
					callback(true,{lat:posinfo.lat,lng:posinfo.lng});
				}else{
					var errorinfo = BAIDUAPIERROR[data.status];
					callback(false,'status error:' + (errorinfo?errorinfo:data)); 
				}
			}).error(function(data, status, headers, config){
				callback(false,data);
			});
		}else{
			callback(false,null);
		}
	};
	//计算两个经纬度之间的距离，单位千米
	obj.getDistance = function(lat1, lng1, lat2, lng2){
	   function rad(d){
		   return d * Math.PI / 180.0;
	   }
	   var radLat1 = rad(lat1);
	   var radLat2 = rad(lat2);
	   var a = radLat1 - radLat2;
	   var b = rad(lng1) - rad(lng2);

	   var s = 2 * Math.sin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
		Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
	   s = s * EARTH_RADIUS;
	   s = Math.round(s * 10000) / 10000;
	   return s;
	};
	obj.rows2arr = function(rows){
		var ret =[];
		for(var i=0,len=rows.length;i<len;i++){
			ret.push(angular.copy(rows.item(i)));
		}
		return angular.copy(ret);
	};
	obj.nokey = function(obj){
		var ret=true;
		if(obj){
			for(var key in obj){
				if(obj[key]){
					return false;
				}
			}
		}
		return ret;
	};
	obj.keys = function(obj){
		var ret=[];
		if(obj){
			angular.forEach(obj,function(value,key){
				ret.push(key);
			});
		}
		return ret;
	};
	//JSON转参数串
	obj.json2params = function(o, keys) {
		var params = '';
		if (typeof o === 'string') {
			params = o;
			return params;
		}
		if (!o) {
			return params;
		}
		if (keys && keys.length && keys.length > 0) {
			for ( var i = 0, len = keys.length; i < len; i++) {
				params += '&' + keys[i].toLowerCase() + '='
						+ encodeURI(obj.toJson(o[keys[i]]));
			}
		} else {
			for ( var key in o) {
				params += '&' + key.toLowerCase() + '='
					+ encodeURI(obj.toJson(o[key]));
			}
		}
		return params;
	};
	obj.toJson = function(o){
		if(angular.isString(o)){
			return o;
		}else{
			return angular.toJson(o);
		}
	};
	obj.fromJson = function(o){
		if(angular.isString(o)){
			return angular.fromJson(o);
		}else{
			return o;
		}
	};
	//字符串转UTF8编码
	obj.encodeUTF8 = function(s) {
		var i, r = [], c, x;
		for (i = 0; i < s.length; i++)
			if ((c = s.charCodeAt(i)) < 0x80)
				r.push(c);
			else if (c < 0x800)
				r.push(0xC0 + (c >> 6 & 0x1F),
						0x80 + (c & 0x3F));
			else {
				if ((x = c ^ 0xD800) >> 10 == 0) // 对四字节UTF-16转换为Unicode
					c = (x << 10)
							+ (s.charCodeAt(++i) ^ 0xDC00)
							+ 0x10000, r.push(
							0xF0 + (c >> 18 & 0x7),
							0x80 + (c >> 12 & 0x3F));
				else
					r.push(0xE0 + (c >> 12 & 0xF));
				r.push(0x80 + (c >> 6 & 0x3F),
						0x80 + (c & 0x3F));
			}
		;
		return r;
	};
	obj.deleteDuplicates=function(arr){
		var obj = {};
		angular.forEach(arr,function(value,key){
			obj[value] = true;
		});
		
		return this.keys(obj);
	};
	obj.uuid = function() {
		var str = new Date().getTime() +'-'+ Math.random();
		return this.md5(str);
	};
	//MD5加密
	obj.md5 = function(a){
		var hexcase=0;
		if(a=="") return a; 
		return rstr2hex(rstr_md5(str2rstr_utf8(a)));
		
		function hex_hmac_md5(a,b){
			return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)));
		}
		function md5_vm_test(){
			return hex_md5("abc").toLowerCase()=="900150983cd24fb0d6963f7d28e17f72";		
		}
		function rstr_md5(a){
			return binl2rstr(binl_md5(rstr2binl(a),a.length*8));
		}
		function rstr_hmac_md5(c,f){
			var e=rstr2binl(c);
			if(e.length>16){
				e=binl_md5(e,c.length*8);
			}
			var a=Array(16),d=Array(16);
			for(var b=0;b<16;b++){
				a[b]=e[b]^909522486;
				d[b]=e[b]^1549556828;
			}
			var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);
			return binl2rstr(binl_md5(d.concat(g),512+128));
		}
		function rstr2hex(c){
			try{
				hexcase;
			}catch(g){
				hexcase=0;
			}
			var f=hexcase?"0123456789ABCDEF":"0123456789abcdef";
			var b="";
			var a;
			for(var d=0;d<c.length;d++){
				a=c.charCodeAt(d);
				b+=f.charAt((a>>>4)&15)+f.charAt(a&15);
			}
			return b;
		}
		function str2rstr_utf8(c){
			var b="";
			var d=-1;
			var a,e;
			while(++d<c.length){
				a=c.charCodeAt(d);
				e=d+1<c.length?c.charCodeAt(d+1):0;
				if(55296<=a&&a<=56319&&56320<=e&&e<=57343){
					a=65536+((a&1023)<<10)+(e&1023);
					d++;
				}
				if(a<=127){
					b+=String.fromCharCode(a);
				}else{
					if(a<=2047){
						b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63));
					}else{
						if(a<=65535){
							b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63));
						}else{
							if(a<=2097151){
								b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63));
							}
						}
					}
				}
			}
			return b;
		}
		function rstr2binl(b){
			var a=Array(b.length>>2);
			for(var c=0;c<a.length;c++){
				a[c]=0;
			}
			for(var c=0;c<b.length*8;c+=8){
				a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32);
			}
			return a;
		}
		function binl2rstr(b){
			var a="";
			for(var c=0;c<b.length*32;c+=8){
				a+=String.fromCharCode((b[c>>5]>>>(c%32))&255);
			}
			return a;
		}
		function binl_md5(p,k){
			p[k>>5]|=128<<((k)%32);
			p[(((k+64)>>>9)<<4)+14]=k;
			var o=1732584193;
			var n=-271733879;
			var m=-1732584194;
			var l=271733878;
			for(var g=0;g<p.length;g+=16){
				var j=o;
				var h=n;
				var f=m;
				var e=l;
				o=md5_ff(o,n,m,l,p[g+0],7,-680876936);
				l=md5_ff(l,o,n,m,p[g+1],12,-389564586);
				m=md5_ff(m,l,o,n,p[g+2],17,606105819);
				n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);
				o=md5_ff(o,n,m,l,p[g+4],7,-176418897);
				l=md5_ff(l,o,n,m,p[g+5],12,1200080426);
				m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);
				n=md5_ff(n,m,l,o,p[g+7],22,-45705983);
				o=md5_ff(o,n,m,l,p[g+8],7,1770035416);
				l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);
				m=md5_ff(m,l,o,n,p[g+10],17,-42063);
				n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);
				o=md5_ff(o,n,m,l,p[g+12],7,1804603682);
				l=md5_ff(l,o,n,m,p[g+13],12,-40341101);
				m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);
				n=md5_ff(n,m,l,o,p[g+15],22,1236535329);
				o=md5_gg(o,n,m,l,p[g+1],5,-165796510);
				l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);
				m=md5_gg(m,l,o,n,p[g+11],14,643717713);
				n=md5_gg(n,m,l,o,p[g+0],20,-373897302);
				o=md5_gg(o,n,m,l,p[g+5],5,-701558691);
				l=md5_gg(l,o,n,m,p[g+10],9,38016083);
				m=md5_gg(m,l,o,n,p[g+15],14,-660478335);
				n=md5_gg(n,m,l,o,p[g+4],20,-405537848);
				o=md5_gg(o,n,m,l,p[g+9],5,568446438);
				l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);
				m=md5_gg(m,l,o,n,p[g+3],14,-187363961);
				n=md5_gg(n,m,l,o,p[g+8],20,1163531501);
				o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);
				l=md5_gg(l,o,n,m,p[g+2],9,-51403784);
				m=md5_gg(m,l,o,n,p[g+7],14,1735328473);
				n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);
				o=md5_hh(o,n,m,l,p[g+5],4,-378558);
				l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);
				m=md5_hh(m,l,o,n,p[g+11],16,1839030562);
				n=md5_hh(n,m,l,o,p[g+14],23,-35309556);
				o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);
				l=md5_hh(l,o,n,m,p[g+4],11,1272893353);
				m=md5_hh(m,l,o,n,p[g+7],16,-155497632);
				n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);
				o=md5_hh(o,n,m,l,p[g+13],4,681279174);
				l=md5_hh(l,o,n,m,p[g+0],11,-358537222);
				m=md5_hh(m,l,o,n,p[g+3],16,-722521979);
				n=md5_hh(n,m,l,o,p[g+6],23,76029189);
				o=md5_hh(o,n,m,l,p[g+9],4,-640364487);
				l=md5_hh(l,o,n,m,p[g+12],11,-421815835);
				m=md5_hh(m,l,o,n,p[g+15],16,530742520);
				n=md5_hh(n,m,l,o,p[g+2],23,-995338651);
				o=md5_ii(o,n,m,l,p[g+0],6,-198630844);
				l=md5_ii(l,o,n,m,p[g+7],10,1126891415);
				m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);
				n=md5_ii(n,m,l,o,p[g+5],21,-57434055);
				o=md5_ii(o,n,m,l,p[g+12],6,1700485571);
				l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);
				m=md5_ii(m,l,o,n,p[g+10],15,-1051523);
				n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);
				o=md5_ii(o,n,m,l,p[g+8],6,1873313359);
				l=md5_ii(l,o,n,m,p[g+15],10,-30611744);
				m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);
				n=md5_ii(n,m,l,o,p[g+13],21,1309151649);
				o=md5_ii(o,n,m,l,p[g+4],6,-145523070);
				l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);
				m=md5_ii(m,l,o,n,p[g+2],15,718787259);
				n=md5_ii(n,m,l,o,p[g+9],21,-343485551);
				o=safe_add(o,j);
				n=safe_add(n,h);
				m=safe_add(m,f);
				l=safe_add(l,e);
			}
			return Array(o,n,m,l);
		}
		function md5_cmn(h,e,d,c,g,f){
			return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d);
		}
		function md5_ff(g,f,k,j,e,i,h){
			return md5_cmn((f&k)|((~f)&j),g,f,e,i,h);
		}
		function md5_gg(g,f,k,j,e,i,h){
			return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h);
		}
		function md5_hh(g,f,k,j,e,i,h){
			return md5_cmn(f^k^j,g,f,e,i,h);
		}
		function md5_ii(g,f,k,j,e,i,h){
			return md5_cmn(k^(f|(~j)),g,f,e,i,h);
		}
		function safe_add(a,d){
			var c=(a&65535)+(d&65535);
			var b=(a>>16)+(d>>16)+(c>>16);
			return(b<<16)|(c&65535);
		}
		function bit_rol(a,b){
			return(a<<b)|(a>>>(32-b));
		}
	};
	return obj;
});
