/**
 * 展示功能 通用操作
 */

$.ready(function() {
	// header 部分操作
	var btnProducts = $('#btnProducts')[0],
		subMenu = $('#subMenu')[0],
		btnToggle = $('#btnToggle')[0],
		inSubMenu = false;
	if (window.innerWidth > 768) {
		btnProducts.onmouseenter = function() {
			$('#subPnl').addClass('trans display');
			setTimeout(function() {
				$('#subPnl').addClass('showing');
			}, 50);
			// $('#subPnl').css('display', 'block');
			$('#siteHead').removeClass('dark');
		};
		btnProducts.onmouseleave = function() {
			setTimeout(function() {
				if (!inSubMenu) {
					$('#subPnl').removeClass('trans showing display');
					// $('#subPnl').removeClass('showing');
					// setTimeout(function() {
					// 	$('#subPnl').removeClass('trans display');
					// }, 500);
					// $('#subPnl').css('display', '', true);
					/^(\/|\/index.html)$/.test(window.location.pathname) && $('#siteHead').addClass('dark');
				}
			}, 100);
		};
		subMenu.onmouseover = function() {
			inSubMenu = true;
		};
		subMenu.onmouseleave = function() {
			inSubMenu = false;
			$('#subPnl').removeClass('trans showing display');
			// $('#subPnl').removeClass('showing');
			// setTimeout(function() {
			// 	$('#subPnl').removeClass('trans display');
			// }, 500);
			/^(\/|\/index.html)$/.test(window.location.pathname) && $('#siteHead').addClass('dark');
		};
	}

	btnToggle.onclick = function() {
		if ($.toggleClass($('#siteCollapse')[0], 'show')) {
			$.addClass(this, 'opened');
			window.innerWidth <= 768 && $.addClass(this.parentElement.parentElement, 'dark');
		} else {
			$.removeClass(this, 'opened');
			window.innerWidth <= 768 && !/^\/(index\.(html|php))?$/.test(window.location.pathname) && $.removeClass(this.parentElement.parentElement, 'dark');
		}
	};



	// 轮播图
	var carousel = document.getElementById('carousel'),
		cbars = document.getElementById('carouselBar'),
		cLeft = document.getElementById('carouselLeft'),
		cRight = document.getElementById('carouselRight'),
		cTitle = document.getElementById('cTitle'),
		cPara = document.getElementById('cPara'),
		cActItem = 0, cursor, lastPer, timer;
	function carouselRun(liNew, liOld, bar) {
		timer = $.timer({
			// tick: (timer || {}).tick,
			duration: 500,
			tween: function(p) {
				liOld.style.opacity = 1 - p;
				liNew.style.opacity = p;
				if ($.ua.ie && $.ua.ie <= 8) {
					liOld.style.filter = 'alpha(opacity=' + 100 * (1 - p) + ')';
					liOld.style.msFilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity= ' + 100 * (1 - p) + ')';
					liNew.style.filter = 'alpha(opacity=' + 100 * p + ')';
					liNew.style.msFilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity= ' + 100 * p + ')';
				}
				var tempPer = p;
				if (p < 0.5) {
					p = 1 - p * 2;
				} else {
					if (lastPer < 0.5) {
						cTitle.innerHTML = liNew.getAttribute('title');
						cPara.innerHTML = liNew.getAttribute('para');
					}
					p = p * 2 - 1;
				}
				lastPer = tempPer;
				cTitle.style.opacity = p;
				cPara.style.opacity = p;
				if ($.ua.ie && $.ua.ie <= 8) {
					cTitle.style.filter = 'alpha(opacity=' + 100 * p + ')';
					cTitle.style.msFilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity= ' + 100 * p + ')';
					cPara.style.filter = 'alpha(opacity=' + 100 * p + ')';
					cPara.style.msFilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity= ' + 100 * p + ')';
				}
			}
		}, function() {
			$.tabClass(liNew, 'front');
			$.tabClass(bar, 'active');
			// 
			cursor = (new Date()).getTime() + 5000;
		});
	}
	if (carousel) {
		// 初始化显示
		var liNew = document.getElementById('c' + cActItem);
		liNew.style.opacity = 1;
		liNew.style.filter = 'alpha(opacity=100)';
		liNew.style.msFilter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';
		// 自动切换
		cursor = (new Date()).getTime() + 5000;
		$.timer({
			duration: 0,
			tween: function() {
				if ((new Date()).getTime() >= cursor) {
					cursor = (new Date()).getTime() + 5000;
					// 显示下一个
					var children = $.children(cbars),
						bar, liOld, liNew;
					for (var i = 0; i < children.length; i++) {
						if (/active/.test(children[i].className)) {
							liOld = document.getElementById('c' + i);
							bar = children[i = ((i + 1) % 4 + 4) % 4];
							liNew = document.getElementById('c' + i);
							break;
						}
					}
					carouselRun(liNew, liOld, bar);
				}
			}
		});
		// 绑定事件
		if (cbars) {
			cbars.onclick = function(e) {
				if (!e) {
					e = window.event;
					if (!e) {
						return ;
					}
				}
				if (e.button !== 0) {
					return ;
				}
				var target = e.target || e.srcElement;
				if (/carousel-bar\b/.test(target.parentElement.className)) {
					if (!/active/.test(target.className)) {
						var liOld = document.getElementById('c' + cActItem),
							children = $.children(target.parentElement), liNew;

						for (var i = 0; i < children.length; i++) {
							if (children[i] === target) {
								cActItem = i;
								break;
							}
						}
						liNew = document.getElementById('c' + cActItem);

						if (liNew) {
							carouselRun(liNew, liOld, target);
						}
					}
				}
			};
		}
		// 
		if (cLeft) {
			cLeft.onclick = function() {
				var children = $.children(cbars),
					bar, liOld, liNew;
				for (var i = 0; i < children.length; i++) {
					if (/active/.test(children[i].className)) {
						liOld = document.getElementById('c' + i);
						bar = children[i = ((i - 1) % 4 + 4) % 4];
						liNew = document.getElementById('c' + i);
						break;
					}
				}
				carouselRun(liNew, liOld, bar);
			};
		}
		if (cRight) {
			cRight.onclick = function() {
				var children = $.children(cbars),
					bar, liOld, liNew;
				for (var i = 0; i < children.length; i++) {
					if (/active/.test(children[i].className)) {
						liOld = document.getElementById('c' + i);
						bar = children[i = ((i + 1) % 4 + 4) % 4];
						liNew = document.getElementById('c' + i);
						break;
					}
				}
				carouselRun(liNew, liOld, bar);
			};
		}
	}



	// 主页预览
	var previewBtn = document.getElementById('previewBtn'),
		previewInput = document.getElementById('previewInput'),
		lastVal, previewWin;
	function previewOpen() {
		var val = previewInput.value.replace(/\r?\n/g, '').replace(/^\s*|\s*$/g, '');
		if (val && !/\/\//.test(val)) {
			val = '' + val;
		}
		if (val !== lastVal) {
			previewWin && !previewWin.closed && previewWin.close();
			previewWin = window.open('https://www.baidu.com/s?wd=不知道为什么你搜' + encodeURIComponent(val)+'我就变滑稽了', '_blank');
			lastVal = val;
		}
	}
	if (previewBtn && previewInput) {
		previewBtn.onclick = previewOpen;
		previewInput.onkeydown = function(e) {
			if (e.which === 13) {
				previewOpen();
			}
		};
	}
});
