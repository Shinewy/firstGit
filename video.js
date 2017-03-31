var video=document.getElementById("myvideo");
	$(".newVideo").hover(function() {
		$(".control").stop().animate({'bottom':'0'},500);
	},function() {
		$(".control").animate({'bottom':'-84px'},500);
	})
	//属性与方法的应用
	$(".btnPlay,#myvideo").click(function() {
		$(".replaydiv").hide();
		playPause();
	})
	function playPause() {
		if(video.paused) {
			video.play();
			$(".btnPlay").css('background-position','0 -30px');
		}else {
			video.pause();
			$(".btnPlay").css('background-position','0 0');
		}
	}
	function speed(n) {
		var rate=video.playbackRate;
		rate+=n*rate;
	}
	function big() {
		video.width=560; 
	}
	function small() {
		video.width=220; 
	}
	
	//得到视频总时间长度
	$("#myvideo").on('loadedmetadata',function() {		//loadedmetadata事件，加载元数据，计算视频时长
		$(".current").text(time(0));
		$('.duration').text(time(video.duration))		//s:如何折换成分、时
		$("#myvideo").removeAttr("controls");
		$(".volum").css('width','50%');
		video.volume=0.5;
	})
	//得到视频当前播放时间 
	$("#myvideo").on('timeupdate',function() {			//timeupdate事件
		$(".duration").text(time(video.duration));
		$(".current").text(time(video.currentTime));
		var nowt=video.currentTime;						//currentTime:当前时间
		var max=video.duration;							//duration:总时长
		var per=(nowt/max)*100;
		$('.timeBar').css('width',per+'%');
		$('span.per').text(per+'%');
		//reRun(video)
		if(video.ended) {
			var s;
			if(document.mozFullScreen) {
				document.mozCancelFullScreen();
				s=500;
			}
			if(document.webkitIsFullScreen) {
				document.webkitExitFullscreen();
				s=50;
			}
			setTimeout(replay,s);				//此时要用setTimeout()来控制，退出全屏？？
		}
	})
	
	//进度条拖拽及点击行为
	var timeDrag=false;
	$(".progressBar").mousedown(function(e) {				//mousedown:鼠标按下事件，e是当前点击位置，调节视频进度
		console.log(e.pageX);
		timeDrag=true;
		updatebar(e.pageX);
	})
	function updatebar(x) {
		var progress=$(".progressBar");
		var maxduration=video.duration;
		var posit=x-progress.offset().left;				//鼠标点击的相对位置
		var percentage=posit/progress.width()*100;
		if(percentage>100) {
			percentage=100;
		}else if(percentage<0) {
			percentage=0;
		}
		$(".timeBar").css('width',percentage+'%');			//width的百分比
		//时间属性currentTime
		video.currentTime=maxduration*percentage/100;		
	}
	//显示缓冲栏  buffered
	function startBuffer() {
		var maxduration=video.duration;
		var currentBuffer=video.buffered.end(0); //??
		var percentage=currentBuffer/maxduration*100;
		$('.bufferBar').css('width',percentage+'%');
		if(percentage<100) {
			setTimeout(startBuffer,500);
		}
	}
	setTimeout(startBuffer,500);
	//音量控制  muted volume
	$(".volumbtn").click(function() {			//是否静音控制
		var volumbarlen;
		video.muted=!video.muted;
		if(video.muted) {
			$(".volumbtn").css('background-position','-90px 0');
			$(".volum").css('width','0');
		}else {
			$(".volumbtn").css('background-position','-90px -60px');
			$(".volum").css('width','50%');
		}
		//还可以对volumbarlen进行判断，修饰样式
	})
	$(".volumBar").mousedown(function(e) {			//调节音量
		$(this).css('cursor','pointer');
		volumbar(e.pageX);
	})
	function volumbar(x) {
		var maxvolum=$(".volumBar").width();
		var volum=$(".volum");
		var posit=x-volum.offset().left;
		var percentage=posit/maxvolum*100;
		//音量属性volume
		video.volume=percentage/100;			
		if(percentage>100) {
			percentage=100;
		}else if(percentage<0) {
			percentage=0;
		}
		$(".volum").css('width',percentage+'%');	//width的百分比
	}
	//播放速度	playbackRate
	var playbackRate1=1;
	//快进
	$(".ff").click(function() {
		video.playbackRate=(video.playbackRate)*2;
		return false;
	})
	//后退（目前有问题）
	$(".rw").click(function() {
		video.playbackRate=playbackRate1*(-2);
		return false;
	})
	//快慢
	$(".sl").click(function() {
		video.playbackRate=(video.playbackRate)*(0.5);
		return false;
	})
	//全屏
	$(".screenbtn").click(function() {
		var newvideo=document.getElementsByClassName("newVideo");
		//screen(video);
		screen(newvideo[0]);
	})
	function screen(elem) {
		var navigator1=navigator.userAgent;
		if(navigator1.indexOf("Chrome")>-1) {
			if(!document.webkitIsFullScreen) {
				$(".newVideo").css({'width':window.outerWidth,'height':outerHeight});
				elem.webkitRequestFullScreen();
			}else {
				document.webkitExitFullscreen();
				$(".newVideo").css({'width':600,'height':350});
			}
		}else if(navigator1.indexOf("Firefox")>-1) {
			if(!document.mozFullScreen) {
				elem.mozRequestFullScreen();
			}else {
				document.mozCancelFullScreen();
			}
		}
	}
	/*esc的keydown方法的代替方法*/
	$(window).resize(function() {
		if(document.webkitIsFullScreen) {
			$(".newVideo").css({'width':window.outerWidth,'height':outerHeight});
		}else {
			$(".newVideo").css({'width':600,'height':350});
		}
	})
	/*esc的keydown方法无效*/
	/*$(window).keydown(function(e) {
		if(e.keyCode==27) {
			alert(e.keyCode)
			$(".newVideo").css({'width':600,'height':350});
		}
	})*/
	//开关灯控制
	$(".lightbar").click(function() {
		if($(this).hasClass('on')) {
			$(this).removeClass('on');
			$("body").append('<div class="overlay"></div>');
			$(this).css('background-position','-45px -60px');
		}else {
			$(this).addClass('on');
			$(this).css('background-position','-45px -30px');
			$(".overlay").remove();
		}
		return false;
	})
	//重新播放
	function replay() {
		//alert($('#myvideo').height())
		$(".replaydiv").css({'height':''+$('.newVideo').height()+'','width':''+$('.newVideo').width()+''});
		var left=($(".replaydiv").width()-$(".replay").width())/2;
		var top=($(".replaydiv").height()-$(".replay").height())/2;
		$(".replay").css({'top':top,'left':left});
		$(".replaydiv").show();
		$(".btnPlay").css('background-position','0 0');
	}
	$('.replay').click(function() {
		video.currentTime=0;
		video.play();
		$(".replaydiv").hide();
	})
	
	//折换成标准时间
	function time(n) {
		var h=parseInt(n/3600);
		var m=parseInt(n/60);
		var s=parseInt(n-h*3600-m*60);
		console.log(m);
		if(h<10) {
			h='0'+h;
		}
		if(m<10) {
			m='0'+m;
		}
		if(s<10) {
			s='0'+s;
		}
		return h+':'+m+':'+s;
	}
