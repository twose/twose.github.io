	var v5_init			= false;
    var v5_protocol		= "http://";
	var v5_base_url		= "v5kf.com/";
	var v5_public_url	= "http://v5kf.com/public/chat/";
	var v5_chat_url		= v5_protocol+"chat.v5kf.com/desk/";
	var v5_new_chat_url	= v5_protocol+"chat.v5kf.com/desk/kehu.html";
	var v5_static_url	= "http://static.v5kf.com/";
	var v5_flash_url	= "v5kf.com/flash/";
	var v5_site_id		= 10000;
	var v5_gid			= 0;
	var v5_ident		= "";
	var v5_accept		= 0;
	var v5_params		= "";
	var v5_opt			= {"intro":"\u5728\u7ebf\u54a8\u8be2","floatpos":0,"showclose":0,"showoffline":0,"showrobot":1,"showmode":3,"chatsize":0,"pageurl":"\/main.html,\/web\/weixin\/csgd.html","cells":{"wangwang":{"id":"wangwang","name":"\u65fa\u65fa\u5ba2\u670d"},"qq":{"id":"qq","name":"QQ\u5ba2\u670d"},"qrcode":{"id":"qrcode","name":"\u4e8c\u7ef4\u7801"},"message":{"id":"message","name":"\u7559\u8a00\u53cd\u9988"},"chat":{"id":"chat","name":"\u5728\u7ebf\u5bf9\u8bdd"}},"qqlist":[{"name":"\u8d26\u53f7\u5bc6\u7801","id":"41623334","desc":"\u70b9\u51fb\u8fd9\u91cc\u8ddf\u6211QQ\u5bf9\u8bdd"},{"name":"\u7cfb\u7edf\u54a8\u8be2","id":"1026699498","desc":"\u70b9\u51fb\u8fd9\u91cc\u8ddf\u6211QQ\u5bf9\u8bdd"},{"name":"\u529f\u80fd\u54a8\u8be2","id":"3254784114","desc":"\u70b9\u51fb\u8fd9\u91cc\u8ddf\u6211QQ\u5bf9\u8bdd"},{"name":"\u5546\u52a1\u5408\u4f5c","id":"1026699498","desc":"\u70b9\u51fb\u8fd9\u91cc\u8ddf\u6211QQ\u5bf9\u8bdd"},{"name":"\u673a\u5668\u4eba\u5ba2\u670d","id":"3053532768","desc":"\u70b9\u51fb\u8fd9\u91cc\u81ea\u52a8\u56de\u590d"}],"wwlist":[{"name":"V5\u6dd8\u5b9d","id":"v5kf_com","desc":"\u70b9\u51fb\u8fd9\u91cc\u8ddf\u6211\u65fa\u65fa\u5bf9\u8bdd"}],"msglist":{"username":"2","gender":"0","email":"2","qq":"1","phone":"1","address":"0","content":"2"},"botlist":[],"floattpl":2,"qrlist":[{"name":"\u5fae\u4fe1\u516c\u4f17\u53f7","url":"http:\/\/static.v5kf.com\/images\/weixin_dms.jpg"},{"name":"\u624b\u673a\u5ba2\u670dAPP","url":"http:\/\/static.v5kf.com\/images\/qrcode_v5_app.png"},{"name":"\u65b0\u6d6a\u5fae\u535a","url":"http:\/\/rs.v5kf.com\/upload\/10000\/14508726996.png"},{"name":"\u652f\u4ed8\u5b9d\u670d\u52a1\u7a97","url":"http:\/\/rs.v5kf.com\/upload\/10000\/145087053410.png"}]};
	var v5_chat_attrs	= "toolbar=0,scrollbars=0,location=0,menubar=0,resizable=1,top=" + (window.screen.availHeight - (window.screen.availHeight/2+275+40)) + ",left=" + (window.screen.availWidth - (window.screen.availWidth/2+365+20)) + ",width=730,height=550";

	
	var vs = document.createElement("script");
	vs.type = "text/javascript";
	vs.async = true;
	vs.src = "http://static.v5kf.com/js/v5_float_2.js?v=09231";
	vs.charset = "utf-8";
	if(document.body) {
		document.body.appendChild(vs);
	}else if(document.getElementsByTagName('head').length > 0){
		document.getElementsByTagName('head')[0].appendChild(vs);
	}
	// document.body.appendChild(vs);
	// document.write('<script charset="utf-8" src="http://static.v5kf.com/js/v5_float_2.js?v=0103"></script>');