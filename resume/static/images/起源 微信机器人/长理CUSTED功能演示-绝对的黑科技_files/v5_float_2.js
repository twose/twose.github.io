/**
 * 页面浮动菜单
 */
(function(window, fn) {
	var list = [];
	if (document.readyState === 'complete' && list.length <= 0) {
		fn();
		window.v5PluginCB && (window.v5PluginCB('bar'));
	} else {
		if (list.length <= 0) {
			if (window.addEventListener) {
				document.addEventListener('DOMContentLoaded', completed, false);
				window.addEventListener('load', completed, false);
			} else {
				document.ondomcontentloaded = completed;
				window.onload = completed;
			}
		}
		list.push(fn);
	}
	function completed() {
		if (window.removeEventListener) {
			document.removeEventListener('DOMContentLoaded', completed, false);
			window.removeEventListener('load', completed, false);
		}
		var fn = list.shift();
		while (fn) {
			fn();
			fn = list.shift();
		}
		window.v5PluginCB && (window.v5PluginCB('bar'));
	}
})(this, function() {
	var data = {
		site: {
			id: 10000,
			float: 0, // 0 right 1 left
			gid: 0
		},
		begin: {
			show: true,
			text: '回到顶部'
		},
		chat: {
			show: true,
			text: '在线交流',
			href: [
				// {
				// 	text: '售前',
				// 	list: [
				// 		{text: '智能客服', state: 1, link: ''},
				// 		{text: '小李', state: 0, link: ''}
				// 	]
				// },
				// {
				// 	text: '售后',
				// 	list: [
				// 		{text: '智能客服', state: 1, link: ''},
				// 		{text: '小王', state: 0, link: ''}
				// 	]
				// }
			]
		},
		qq: {
			show: true,
			text: '咨询QQ',
			href: [
				{text: '商务合作', link: 'http://wpa.qq.com/msgrd?v=3&uin=1026699498&site=qq&menu=yes'},
				{text: '系统咨询', link: 'http://wpa.qq.com/msgrd?v=3&uin=1026699498&site=qq&menu=yes'}
			]
		},
		wang: {
			show: true,
			text: '咨询旺旺',
			href: [
				{text: '网店咨询', link: 'http://amos.im.alisoft.com/msg.aw?v=2&uid=v5kf_com&site=cntaobao&s=1&charset=utf-8'}
			]
		},
		qr: {
			show: true,
			text: '扫码关注',
			list: [
				{text: '关注微信号', img: 'http://static.v5kf.com/images/weixin_dms.jpg'},
				{text: '关注易信号', img: 'http://static.v5kf.com/images/weixin_dms.jpg'},
				{text: '关注微信号', img: 'http://static.v5kf.com/images/weixin_dms.jpg'}
			]
		},
		msg: {
			show: true,
			text: '我要留言',
			list: {
				username: 2,
				gender: 0,
				email: 1,
				qq: 1,
				phone: 1,
				address: 1,
				content: 1
			}
		}
	}, submitting, ajax = ajaxInst(), tick, newwin, newurl,
	re = new RegExp('\\b'+(['v5_chat_link']).join('\\b|\\b')+'\\b');

	initKeyword();
	adjustData();

	appendCss();
	appendHtml();
	bindEvents();

	function initKeyword() {
		var url, eqid;
		try{
			url = top.document.referrer;
		}catch(e){
			if(parent) {
				try{
					url = parent.document.referrer;
				}catch(e){
					url = "";
				}
			}
		}
		if(!url || url.toLowerCase().indexOf('baidu.com') == -1) {
			return;
		}
		eqid = url ? getParam(url, 'eqid', '&', '=') : '';
		if(eqid && typeof(navigator.cookieEnabled) != "undefined" && navigator.cookieEnabled) {
			setCookie('v5_eqid', eqid, 3600);
		}
	}
	function getOptVars() {
		var vars = '';
		if(typeof(_v5opt) != "undefined" && _v5opt) {
			for(var key in _v5opt) {
				vars += _v5opt[key] ? '&'+key+'='+encodeURIComponent(_v5opt[key]) : '';
			}
		}
		return vars;
	};
	function adjustData() {
		// 站点信息
		typeof v5_site_id !== 'undefined' && (data.site.id = v5_site_id);
		typeof v5_gid !== 'undefined' && (data.site.gid = v5_gid);
		// 配置
		var op;
		if (typeof v5_opt !== 'undefined' && (op = v5_opt)) {
			// 浮动方向
			op.floatpos && (data.site.float = op.floatpos);
			// 按钮文字
			data.qq.show = !! op.cells.qq;
			op.cells.qq && op.cells.qq.name && (data.qq.text = op.cells.qq.name.substr(0,4));
			data.wang.show = !! op.cells.wangwang;
			op.cells.wangwang && op.cells.wangwang.name && (data.wang.text = op.cells.wangwang.name.substr(0,4));
			data.qr.show = !! op.cells.qrcode;
			op.cells.qrcode && op.cells.qrcode.name && (data.qr.text = op.cells.qrcode.name.substr(0,4));
			data.msg.show = !! op.cells.message;
			op.cells.message && op.cells.message.name && (data.msg.text = op.cells.message.name.substr(0,4));
			data.chat.show = !! op.cells.chat;
			op.cells.chat && op.cells.chat.name && (data.chat.text = op.cells.chat.name.substr(0,4));
			// 客服选择显示 0不显示 1机器人 2离线
			data.chat.show && loadWorkers();
			// qq wangwang
			if (data.qq.show && op.qqlist && op.qqlist.length) {
				data.qq.href = [];
				for (var i = 0; i < op.qqlist.length; i++) {
					var qq = op.qqlist[i];
					data.qq.href.push({
						text: qq.name,
						link: 'http://wpa.qq.com/msgrd?v=3&uin=' + qq.id + '&site=qq&menu=yes'
					});
				}
			} else {
				data.qq.show = false;
			}
			if (data.wang.show && op.wwlist && op.wwlist.length) {
				data.wang.href = [];
				for (var i = 0; i < op.wwlist.length; i++) {
					var wang = op.wwlist[i];
					data.wang.href.push({
						text: wang.name,
						link: 'http://amos.im.alisoft.com/msg.aw?v=2&uid=' + wang.id + '&site=cntaobao&s=1&charset=utf-8'
					});
				}
			} else {
				data.wang.show = false;
			}
			// 二维码内容
			if (data.qr.show && op.qrlist && op.qrlist.length) {
				data.qr.list = [];
				for (var i = 0; i < op.qrlist.length; i++) {
					var qr = op.qrlist[i];
					data.qr.list.push({
						text: qr.name,
						img: qr.url
					});
				};
			} else {
				data.qr.show = false;
			}
			// 消息配置
			if (data.msg.show && op.msglist) {
				for (var key in data.msg.list) {
					data.msg.list[key] = parseInt(op.msglist[key] || 0);
				}
			} else {
				data.msg.show = false;
			}
		}
	}
	function loadWorkers() {
		var now = new Date();
		if (!tick || now.getTime() - tick > 300000) {
			tick = now.getTime();
			window.v5_callback = callback;
			ajax(v5_protocol + v5_base_url + "v5kf.js", {
				method: 'jsonp',
				data: {
					h: now.getHours(),
					m: now.getMinutes(),
					s: now.getSeconds(),
					res: window.screen.width + 'x' + window.screen.height,
					cookie: 1,
					fla: 1,
					java: 1,
					act: 'tracking',
					site_id: data.site.id,
					gid: data.site.gid,
					url: window.location.href,
					// url: window.location.href.replace(/#.*$/g, ''),
					urlref: top.document.referrer,
				},
				done: function() {}
			});
		}
	}

	function bindEvents() {
		// 
		document.getElementById('v5Bar').onclick = clickAll;
		// 
		document.getElementById('v5ToHead').onclick = scrollToHead;
		window.addEventListener ? window.addEventListener('scroll', scrollToShow) :
			(window.onscroll = scrollToShow);
		// 
		var v5Comment = document.getElementById('v5Comment'), inputs, textarea, len;
		if (v5Comment) {
			inputs = v5Comment.getElementsByTagName('input');
			len = inputs.length;
			for (var i = 0; i < len; i++) {
				inputs[i].onfocus = inputFocused;
				inputs[i].onblur = inputBlured;
			}
			textarea = v5Comment.getElementsByTagName('textarea')[0];
			textarea && (textarea.onfocus = inputFocused, textarea.onblur = inputBlured);
			// 
			var v5MsgSubmit = document.getElementById('v5MsgSubmit');
			v5MsgSubmit && (v5MsgSubmit.onclick = msgSubmit);
		}
		// 
		var v5Chat = document.getElementById('v5Chat');
		v5Chat && (v5Chat.onmouseenter = loadWorkers);
	}
	function inputFocused(e) {
		this.style.backgroundColor = "";
		/fold/i.test(this.parentElement.className) || (this.parentElement.className += ' fold');
	}
	function inputBlured(e) {
		/[^\s]+/.test(this.value) || (this.parentElement.className = this.parentElement.className.replace(/\s*\bfold(\s*)/g, '$1'));
	}
	function msgSubmit(e) {
		if (submitting) { return ; }
		var that = this,
			v5Comment = document.getElementById('v5Comment'), inputs, textarea, len;
		inputs = v5Comment.getElementsByTagName('input');
		len = inputs.length;
		// 验证
		for (var i = 0; i < len; i++) {
			if(data.msg.list[inputs[i].name] == 2 &&
				!inputs[i].value) {
				inputs[i].style.backgroundColor = "#F7C4C4";
				return ;
			}
		}
		textarea = v5Comment.getElementsByTagName('textarea')[0];
		if (textarea && data.msg.list[textarea.name] == 2 && 
			!textarea.value) {
			textarea.style.backgroundColor = "#F7C4C4";
			return ;
		}
		// 提交
		var d = {
			site_id: data.site.id
		};
		for (var i = 0; i < len; i++) {
			d[inputs[i].name] = inputs[i].value;
		}
		textarea && (d[textarea.name] = textarea.value);
		d['url'] = escape(window.location.href);

		that.innerHTML = '提交中...';
		submitting = ajax(v5_public_url + 'ajax_visitor_message', {
			method: 'jsonp',
			data: d,
			success: function(text) {
				if(typeof v5_msgres !== 'undefined' && v5_msgres == 'ok') {
					that.innerHTML = '提交成功';
				}else {
					that.innerHTML = '重新提交';
				}
			},
			error: function(err) {
				that.innerHTML = '失败(重试)';
			},
			done: function() {
				submitting = null;
			}
		});
	}
	function clickAll(e) {
		e || (e = window.event);
		var target = e.target || e.srcElement;
		if (/v5-pnl-link/i.test(target.className)) {
			if (!/off/i.test(target.className)) {
				var url = target.getAttribute('href');
				if (newwin && !newwin.closed && newurl === url) {
					newwin.focus();
				} else {
					newwin && !newwin.closed && newwin.close();
					newwin = window.open((newurl = url), '_blank', (/\bkf\b/i.test(target.className) ? v5_chat_attrs : undefined));
				}
			}
		}
	}
	function toRobot() {
		if(!data.site.robot) {
			return false;
		}
		if (newwin && !newwin.closed && newurl === data.site.robot) {
			newwin.focus();
		} else {
			newwin && !newwin.closed && newwin.close();
			newwin = window.open((newurl = data.site.robot), '_blank', v5_chat_attrs);
		}
		// data.site.robot && window.open(data.site.robot, '_blank', v5_chat_attrs);
	}
	function toDiy(params) {
		if(!data.site.diy) {
			return false;
		}
		var diyurl = params ? data.site.diy + '&' + params : data.site.diy;
		if (newwin && !newwin.closed && newurl === diyurl) {
			newwin.focus();
		} else {
			newwin && !newwin.closed && newwin.close();		
			newwin = window.open((newurl = diyurl), '_blank', v5_chat_attrs);
		}
		// data.site.diy && window.open(diyurl, '_blank', v5_chat_attrs);
	}
	function bindToRobot(parent) {
		parent || (parent = document.body);
		var dom = parent.firstChild;
		while (dom) {
			if (dom.nodeType === 1) {
				re.test(dom.className) && (dom.onclick = function() {
					toDiy(this.getAttribute('v5_magic') ? 'magic=' + this.getAttribute('v5_magic') : '');
				});
				bindToRobot(dom);
			}
			dom = dom.nextSibling;
		}
	}
	function scrollToHead(e) {
		window.scrollTo(0, 0);
		document.getElementById('v5ToHead').className += ' hide';
	}
	function scrollToShow(e) {
		var toHead = document.getElementById('v5ToHead'),
			top = document.documentElement.scrollTop||document.body.scrollTop;
		if (top > 200) {
			toHead.className = toHead.className.replace(/\s*hide(\s*)/g, '$1');
		} else {
			toHead.className += ' hide';
		}
	}

	function callback(json) {
		// 是否隐藏整个插件
		if (json.code) {
			var bar = document.getElementById('v5Bar');
			bar && (bar.style.display = 'block');
		}
		data.chat.href = [];
		// 显示人工客服
		var workersOnline = 0;
		var v5ChatUrl = v5_chat_url + 'kehu.html?site_id=' + data.site.id + '&eqid=' + getCookie('v5_eqid') + getOptVars() + '&url='+escape(window.location.href)+'&gid='+data.site.gid+'&entry=0&tm=' + (new Date()).getTime();
		if (json.workers) {
			var arr = [];
			if(typeof(json.workers) !== 'undefined') { 
				for (var key in json.workers) {
					var w = json.workers[key];
					if(w && typeof(w.name) != 'undefined' && w.name) {
						var chatUrl = v5ChatUrl + '&worker_id='+w.id+'&group_id='+w.group_id;
						arr.push({
							text: w.name || ('客服' + key),
							state: w.state || 0,
							link: chatUrl
						});
						w.state && (workersOnline++);	
					}
				}
			}
			if (arr.length && arr.length > 0) {
				data.chat.href.push({
				'text': typeof v5_opt.intro !== 'undefined' && v5_opt.intro ? v5_opt.intro : '在线客服',
				'list': arr
				});
			}
		}

		// 未指派对话
		data.site.diy = v5ChatUrl + '&worker_id=-1&group_id=-1';

		// 显示机器人
		if ((v5_opt.showrobot == 1 || (v5_opt.showrobot == 2 && !workersOnline)
			) && json.robot) {
			data.chat.href.push({
				'text': json.robot.desc || ' ',
				'list': [
					{
						text: json.robot.name || '智能客服',
						state: 1,
						link: (data.site.robot = v5ChatUrl)
					}
				]
			});
			// 为页面内按钮添加链接
			bindToRobot();
		}
		// 重构
		var box = document.getElementById('v5ChatBox');
		box && (box.innerHTML = bldChatList());

		// 邀请对话
		if(typeof(v5_invite_time) != 'undefined' && v5_invite_time >= 0 && json.showinvite == 1 && typeof(v5_invite_data) != 'undefined') {			
			bldInvite();
		}
	}

	function bldInvite() {
		invite_tpl_id = v5_opt.invite_tpl;
		invite_set = v5_invite_data[v5_opt.invite_tpl];
		
		invite_set.form				= v5_opt.invite_tpl;
		invite_set.chat_site_id		= v5_site_id;
		invite_set.timer_open		= v5_invite_time;
		invite_set.timer_close		= v5_opt.invite_close;
		invite_set.kf_url			= v5_opt.invite_btnchat_url;
		invite_set.register_url		= v5_opt.invite_btnfunc_url;

		invite_set.img.show			= invite_set.img.show;
		invite_set.img.picUrl		= v5_opt.invite_logo;
		invite_set.img.picSize		= invite_set.img.picSize;

		invite_set.text_tittle.show = invite_set.text_b.show;
		invite_set.text_tittle.text = v5_opt.invite_title;

		invite_set.text_a.show		= invite_set.text_b.show;
		invite_set.text_a.text		= v5_opt.invite_banner;

		invite_set.text_b.show		= invite_set.text_b.show;
		invite_set.text_b.text		= v5_opt.invite_desc;
		
		invite_set.btn_left.show	= v5_opt.invite_btnfunc_type;
		invite_set.btn_left.text	= v5_opt.invite_btnfunc_title;

		invite_set.btn_right.show	= invite_set.btn_right.show;
		invite_set.btn_right.text	= v5_opt.invite_btnchat_title;;
		invite_set.btn_close		= invite_set.btn_close;

		v5_invite_initdata = invite_set;
		
		init_invite();
	}

	function bldChatList() {
		var str = '';
		for (var i = 0; i < data.chat.href.length; i++) {
			var cls = data.chat.href[i];
			str += '<label class="v5-pnl-lbl">' + cls.text + '</label><div class="v5-pnl-links">';
			for (var j = 0; j < cls.list.length; j++) {
				var item = cls.list[j];
				if (item.state || (typeof v5_opt.showoffline !== 'undefined' && v5_opt.showoffline)) {
					str += '<div class="v5-pnl-link kf'+(item.state ? '' : ' off')+'" href="' +
						item.link + '">' + item.text + '</div>';
				}
			}
			str += '</div>';
		}
		return str;
	}
	function bldQQList() {
		var str = '';
		for (var i = 0; i < data.qq.href.length; i++) {
			var item = data.qq.href[i];
			if (item.text != '' && item.link != '') {
				str += '<div class="v5-pnl-link v5-qq" href="' + item.link + '">' + item.text + '</div>';
			}
		}
		return str;
	}
	function bldWWList() {
		var str = '';
		for (var i = 0; i < data.wang.href.length; i++) {
			var item = data.wang.href[i];
			if (item.text != '' && item.link != '') {
				str += '<div class="v5-pnl-link ww" href="' + item.link + '">' + item.text + '</div>';
			}
		}
		return str;
	}
	function bldQrList() {
		var str = '';
		for (var i = 0; i < data.qr.list.length; i++) {
			var item = data.qr.list[i];
			if (item.text != '' && item.img != '') {
				str += '<div class="v5-pnl-qrbox"'+ (data.qr.list.length === 1 ? ' style="width: 100%;"' : '') + '>\
					<img class="v5-pnl-qr" src="' + item.img + '"/>\
					<div class="v5-pnl-qrtxt">' + item.text + '</div>\
				</div>';
			}
		}
		return str;
	}

	function appendHtml() {
		var bar = document.createElement('ul');
		bar.className = 'v5-bar' + (data.site.float ? ' left' : '');
		bar.id = 'v5Bar'
		bar.innerHTML = '';
		if(!data.chat.show) {
			bar.style.display = 'block';
		}
		data.begin.show && (bar.innerHTML += '<li class="v5-btn hide" id="v5ToHead">\
				<img class="v5-btn-img" src="' + v5_static_url + 'images/v5_chat/tpl2/up.png"/>\
				<em class="v5-btn-txt">' + (data.begin.text || '回到顶部') + '</em>\
			</li>');
		data.chat.show && (bar.innerHTML += '<li class="v5-btn" id="v5Chat">\
				<img class="v5-btn-img" src="' + v5_static_url + 'images/v5_chat/tpl2/kefu.png"/>\
				<em class="v5-btn-txt">' + (data.chat.text ||'在线交流') + '</em>\
				<div class="v5-btn-pnl">\
					<div class="v5-pnl-box" id="v5ChatBox">' + bldChatList() + '</div>\
				</div>\
			</li>');
		var v5QQList = bldQQList();
		data.qq.show && !!v5QQList && (bar.innerHTML += '<li class="v5-btn">\
				<img class="v5-btn-img" src="' + v5_static_url + 'images/v5_chat/tpl2/qq.png"/>\
				<em class="v5-btn-txt">' + (data.qq.text ||'咨询QQ') + '</em>\
				<div class="v5-btn-pnl">\
					<div class="v5-pnl-box">\
						<img class="v5-pnl-img" src="' + v5_static_url + 'images/v5_chat/tpl2/qqq.png" alt="QQ"/>\
						<div class="v5-pnl-list">' + v5QQList + '</div>\
					</div>\
				</div>\
			</li>');
		var v5WWList = bldWWList();
		data.wang.show && !!v5WWList && (bar.innerHTML += '<li class="v5-btn">\
				<img class="v5-btn-img" src="' + v5_static_url + 'images/v5_chat/tpl2/wang.png"/>\
				<em class="v5-btn-txt">' + (data.wang.text ||'咨询旺旺') + '</em>\
				<div class="v5-btn-pnl">\
					<div class="v5-pnl-box">\
						<img class="v5-pnl-img" src="' + v5_static_url + 'images/v5_chat/tpl2/wangwang.png" alt="旺旺"/>\
						<div class="v5-pnl-list">' + v5WWList + '</div>\
					</div>\
				</div>\
			</li>');
		var v5QrList = bldQrList();
		data.qr.show && !!v5QrList && (bar.innerHTML += '<li class="v5-btn">\
				<img class="v5-btn-img" src="' + v5_static_url + 'images/v5_chat/tpl2/qrcode.png"/>\
				<em class="v5-btn-txt">' + (data.qr.text ||'扫码关注') + '</em>\
				<div class="v5-btn-pnl">\
					<div class="v5-pnl-box">' + v5QrList + '</div>\
				</div>\
			</li>');
		if (data.msg.show) {
			str = '<li class="v5-btn">\
				<img class="v5-btn-img" src="' + v5_static_url + 'images/v5_chat/tpl2/comment.png"/>\
				<em class="v5-btn-txt">' + (data.msg.text ||'我要留言') + '</em>\
				<div class="v5-btn-pnl">\
					<div class="v5-pnl-box" id="v5Comment">';
			data.msg.list.username && (str += 
						'<div class="v5-pnl-tr">\
							<span class="v5-pnl-span">姓名' + (data.msg.list.username == 2 ? '*' : '') + '</span>\
							<input class="v5-pnl-input" name="username" type="text" autocomplete="off"/>\
						</div>');
			data.msg.list.gender && (str += 
						'<div class="v5-pnl-tr">\
							<span class="v5-pnl-span">性别' + (data.msg.list.gender == 2 ? '*' : '') + '</span>\
							<input class="v5-pnl-input" name="gender" type="text" autocomplete="off"/>\
						</div>');
			data.msg.list.phone && (str += 
						'<div class="v5-pnl-tr">\
							<span class="v5-pnl-span">电话' + (data.msg.list.phone == 2 ? '*' : '') + '</span>\
							<input class="v5-pnl-input" name="phone" type="text" autocomplete="off"/>\
						</div>');
			data.msg.list.email && (str += 
						'<div class="v5-pnl-tr">\
							<span class="v5-pnl-span">邮箱' + (data.msg.list.email == 2 ? '*' : '') + '</span>\
							<input class="v5-pnl-input" name="email" type="text" autocomplete="off"/>\
						</div>');
			data.msg.list.qq && (str += 
						'<div class="v5-pnl-tr">\
							<span class="v5-pnl-span">QQ' + (data.msg.list.qq == 2 ? '*' : '') + '</span>\
							<input class="v5-pnl-input" name="qq" type="text" autocomplete="off"/>\
						</div>');
			data.msg.list.address && (str += 
						'<div class="v5-pnl-tr">\
							<span class="v5-pnl-span">地址' + (data.msg.list.address == 2 ? '*' : '') + '</span>\
							<input class="v5-pnl-input" name="address" type="text" autocomplete="off"/>\
						</div>');
			data.msg.list.content && (str += 
						'<div class="v5-pnl-tr">\
							<span class="v5-pnl-span">留言' + (data.msg.list.content == 2 ? '*' : '') + '</span>\
							<textarea class="v5-pnl-text" name="content"></textarea>\
						</div>');
			str += '<div class="v5-pnl-btn" id="v5MsgSubmit">提交留言</div>\
					</div>\
				</div>\
			</li>';
			bar.innerHTML += str;
		}
		document.body.appendChild(bar);
	}

	function appendCss() {
		var docHead = document.getElementsByTagName('head')[0];
		if (docHead) {
			var style = document.createElement('style');
			if ('styleSheet' in style || /\bEdge\b/i.test(navigator.appVersion)) {
			// if (false || 'styleSheet' in style) {
				var link = document.createElement('link');
				link.id = 'v5kf2';
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('media','all');
				link.href = v5_static_url + 'css/chat/float/v5_float_2.css';
				docHead.appendChild(link);
			} else {
				docHead.appendChild(style);
				style.innerHTML = '\
					.v5-bar {\
						position: fixed;\
						_position: absolute;\
						right: 10px;\
						bottom: 10px;\
						z-index: 2147483584;\
						width: 40px;\
						list-style: none;\
						display: none;\
						padding-left: 0;\
						margin: 0;\
						border-radius: .3em;\
						background-color: rgba(41,42,42,.75);\
						*background-color: #5E5F5F;\
						background-color: #5E5F5F\9;\
						background-color: rgba(41,42,42,.75)\9\0;\
					}\
					.v5-bar.left {\
						left: 10px;\
						right: auto;\
					}\
					.v5-btn {\
						display: block;\
						height: 38px;\
						float: left;\
						cursor: pointer;\
						clear: both;\
						width: 40px;\
						line-height: 38px;\
						text-align: center;\
						color: white;\
						border-radius: .2em;\
						position: relative;\
						overflow: visible;\
					}\
					.v5-btn.hide {\
						display: none;\
					}\
					.v5-btn:hover {\
						background: rgba(41,42,42,.95);\
						*background-color: #5E5F5F;\
						background-color: #5E5F5F\9;\
						background-color: rgba(41,42,42,.95)\9\0;\
					}\
					.v5-btn-img, .v5-btn-txt {\
						width: 24px;\
						font-style: normal;\
						display: inline-block;\
					}\
					.v5-btn-txt {\
						display: none;\
						font-size: 12px;\
						line-height: 16px;\
						margin-top: 3px;\
						*margin-top: 1px;\
						color: #ddd;\
					}\
					.v5-btn:hover .v5-btn-img {\
						display: none;\
					}\
					.v5-btn:hover .v5-btn-txt {\
						display: inline-block;\
					}\
					.v5-btn-img {\
						width: 35px;\
						margin-top: 2px;\
					}\
					.v5-btn-pnl {\
						font-size: 12px;\
						display: none;\
						position: absolute;\
						right: 100%;\
						bottom: -1em;\
						width: 18em;\
						padding: 1em;\
						overflow: hidden;\
						cursor: auto;\
					}\
					.left .v5-btn-pnl {\
						right: auto;\
						left: 100%;\
					}\
					.v5-btn:hover .v5-btn-pnl {\
						display: block;\
					}\
					.v5-pnl-box {\
						min-height: 4em;\
						max-height: 36em;\
						background-color: white;\
						box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.25);\
						border-radius: 3px;\
						padding: 1em;\
						*border: 1px solid #aaa;\
						border: 1px solid #aaa\9;\
						text-align: left;\
						overflow: auto;\
						color: #333;\
					}\
					.v5-pnl-box::after {\
						content: "";\
						width: 0px;\
						height: 0px;\
						display:block;\
						position: absolute;\
						right: 0;\
						bottom: 30px;\
						border: 6px solid #000;\
						z-index: 2;\
						border-color:transparent transparent transparent #FFF;\
					}\
					#v5ChatBox {\
						max-height: 24em;\
					}\
					.left .v5-pnl-box::after {\
						right: auto;\
						left: 8px;\
						box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.11);\
						transform: rotate(-45deg);\
					}\
					.v5-pnl-lbl {\
						float: left;\
						width: 4.5em;\
						text-align: center;\
						margin: 1em 0;\
						line-height: 2.7;\
					}\
					.v5-pnl-links {\
						overflow: hidden;\
						padding: 1em 2em 0 1em;\
						margin-bottom: 2em;\
					}\
					.v5-pnl-links:last-child {\
						margin-bottom: 1em;\
					}\
					.v5-pnl-img {\
						float: left;\
						width: 2.5em;\
						height: auto;\
						margin: 1em;\
					}\
					.v5-pnl-list {\
						overflow: hidden;\
						padding: 1em 2em 1em 1em;\
					}\
					.v5-pnl-link {\
						line-height: 2.5;\
						text-align: center;\
						cursor: pointer;\
						background-color: #2dc462;\
						border-radius: .3em;\
						margin-bottom: 1em;\
						color: white;\
					}\
					.v5-pnl-link.off {\
						background-color: #aaa;\
						cursor: auto;\
					}\
					.v5-pnl-link.v5-qq {\
						background-color: #369CE3;\
					}\
					.v5-pnl-link.ww {\
						background-color: #4FB9EE;\
					}\
					.v5-pnl-link:last-child {\
						margin-bottom: 0;\
					}\
					.v5-pnl-qrbox {\
						width: 50%;\
						float: left;\
						overflow: hidden;\
						margin: .5em 0;\
					}\
					.v5-pnl-qr {\
						width: 90%;\
						margin: 0 5%;\
						vertical-align: middle;\
					}\
					.v5-pnl-qrtxt {\
						width: 90%;\
						margin: 0 5%;\
						text-align: center;\
						color: #333;\
						line-height: 1;\
					}\
					.v5-pnl-tr {\
						position: relative;\
						margin: 1em .5em 0 .5em;\
					}\
					.v5-pnl-span {\
						position: absolute;\
						top: .5em;\
						left: .5em;\
						color: #969696;\
						line-height: 22px;\
					}\
					.v5-pnl-tr.fold .v5-pnl-span {\
						display: none;\
					}\
					.v5-pnl-input,\
					.v5-pnl-text {\
						padding: .5em 5%;\
						background-color: #EEF2F3;\
						border-radius: .3em;\
						display: block;\
						border: 0px;\
						width: 90%;\
						line-height: 1.6;\
						outline: none;\
					}\
					.v5-pnl-text {\
						height: 5em;\
						resize: none;\
					}\
					.v5-pnl-btn {\
						width: 7em;\
						text-align: center;\
						line-height: 2.5em;\
						cursor: pointer;\
						background-color: #56595A;\
						color: white;\
						margin: 1em auto;\
						border-radius: .3em;\
					}';
			}
		}
	}
	function PARAM(valPairs, elemSep, pairSep)
	{
		if (valPairs) {
			var aElem = valPairs.toString().split(elemSep);
			for (var i = 0; i < aElem.length; ++i) {
				var aPair = aElem[i].split(pairSep);
				(aPair.length>1) && (this[aPair[0]] = unescape(aPair[1]));
			}
		}
	};
	function getParam(valPairs, sName, elemSep, pairSep)
	{
		var xParam = new PARAM(valPairs, elemSep, pairSep);
		return xParam[sName] ? xParam[sName] : "";
	};
	function getCookie(sName){	
		return unescape(getParam(document.cookie, sName, "; ", "="));
	};
	function setCookie(sName, sValue, nExpireSec, sDomain, sPath)
	{
		var sCookie = sName + "=" + escape(sValue) + ";";
		if((document.cookie.length + sCookie.length) >= 4096) {
			return false;
		}

		if (nExpireSec) {
			var oDate = new Date();
			oDate.setTime(oDate.getTime() + parseInt(nExpireSec) * 1000);
			sCookie += "expires=" + oDate.toUTCString() + ";";
		}
		if (sDomain) {
			sCookie += "domain=" + sDomain+";";
		}
		if (sPath) {
			sCookie += "path=" + sPath + ";"
		}
		document.cookie = sCookie;
		return true;
	};
	function ajaxInst() {
		function noop() {}
		function config(options) {
			var def = {
				url: "",
				method: "GET",
				data: "",
				async: true,
				success: noop,
				error: noop,
				done: noop,
				headers: {}
			}, key;
			for (key in def) {
				if (!(key in options)) {
					options[key] = def[key];
				}
			}
			return options;
		}
		function preprocess(options) {
			var arr, key;
			options.method = options.method.toUpperCase();
			if (typeof options.data === "object") {
				arr = [];
				for (key in options.data) {
					arr.push(key + "=" + options.data[key]);
					// arr.push(key + "=" + (escape ? escape(options.data[key]) : options.data[key]));	
				}
				options.data = arr.join("&");
			}
		}
		function listen(xhr, options) {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4) {
					if (this.status >= 200 && this.status < 300) {
						options.success(this.responseText, this.status);
					} else {
						options.error(this.responseText, this.status);
					}
					options.done();
				}
			};
		}
		function open(xhr, options) {
			if (/post/i.test(options.method)) {
				xhr.open(options.method, options.url, options.async);
			} else if (/get/i.test(options.method)) {
				options.data = options.data ? "?" + options.data : "";
				xhr.open(options.method, options.url + options.data, options.async);
			}
		}
		function headers(xhr, options) {
			if (/post/i.test(options.method)) {
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			}
			for (var key in options.headers) {
				xhr.setRequestHeader(key, options.headers[key]);
			}
		}
		function send(xhr, options) {
			if (/get/i.test(options.method)) {
				xhr.send();
			} else if (/post/i.test(options.method)) {
				xhr.send(options.data);
			}
		}
		function request(options) {
			config(options);
			preprocess(options);
			if (/jsonp?/i.test(options.method)) {
				if (!options.url) {
					options.error("URL为空");
				} else if (options.data) {
					options.url += "?" + options.data;
				}
				return jsonp(options);
			} else {
				if (typeof XMLHttpRequest === "undefined" &&
					typeof ActiveXObject === "undefined") {
					console.warn("%c环境：%c您的浏览器可能不支持AJAX", "font-weight:bold", "font-weight:normal");
					return null;
				}
				var xhr = typeof(XMLHttpRequest) !== "undefined" ?
					new XMLHttpRequest() :
					(typeof(ActiveXObject) !== "undefined" ?
						new window.ActiveXObject("Microsoft.XMLHTTP") :
						null);
				listen(xhr, options);
				open(xhr, options);
				headers(xhr, options);
				send(xhr, options);
				return xhr;
			}
		}
		return function(url, options) {
			if (typeof url === "object") {
				options = url;
			} else {
				options.url = url;
			}
			return request(options);
		};
		function jsonp(options) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = options.url;
			script.async = options.async;
			function callback(e) {
				this.onload = this.onerror = undefined;
				document.body.removeChild(this);
				if (e) {
					if (e.type === "load") {
						options.success("脚本加载成功：" + this.src, 200);
					} else {
						options.error("脚本加载失败：" + this.src, 404);
					}
				}
				options.done();
				script = null;
			}
			script.onload = callback;
			script.onerror = callback;
			// 兼容IE 7 8
			script.onreadystatechange = function(e) {
				if (this.readyState === 'loaded') {
					options.done();
				}
			}
			document.body.appendChild(script);
			return callback;
		}
	}
});
