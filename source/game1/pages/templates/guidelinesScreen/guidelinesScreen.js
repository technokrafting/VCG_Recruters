
(function() {


		var $pageId;
		var $eventObj;

		var init = function (xml,navController,eventObj,pageId)
		{

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;
			loadTemplateCss();

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js

			$eventObj = eventObj;

			
			$( "#closeButton" ).click(function() {
				
				var eventObjToSend = {"pageId":$pageId};
				$eventObj.trigger($eventObj.eventVariables.CLEAR_POPUP,eventObjToSend);

			});

			

		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/guidelinesScreen/guidelinesScreen.css";
			link.media = 'all';
			mainPageDiv.appendChild(link);

			checkFile("pages/"+$pageId+"/"+$pageId+".css",cssCallback);

		}

		function cssCallback(isAvailable)
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';

			if(isAvailable == true)
				link.href = "pages/"+$pageId+"/"+$pageId+".css";
			else
				return;

			//console.log(isAvailable+" Css Set "+link.href);
			link.media = 'all';
			mainPageDiv.appendChild(link);

			setDelay(1,function(){initPage();});
			
			//initPage();
			console.log("after init page");
		}

		function initPage()
		{
			$('.coverflow').coverflow({
					outerAngle: -5,
					outerScale: 0.8,
					index: 0,
					enableKeyboard: true,
					enableClick:true,
					change:function(event,cover,index){
						console.log(cover,":::",index)
						console.log("max index = ",$('#guidelines-carousel .cover').length);
						//var currIndex = $(".coverflow").coverflow('index');
						var maxIndex = $('#guidelines-carousel .cover').length - 1;
						if(index>0){
							$('.carousel-nav-btn.prev').click(function(){
								$(".coverflow").coverflow('index',index-1);
							});
						}
						if(index<maxIndex){
							$('.carousel-nav-btn.next').click(function(){
								$(".coverflow").coverflow('index',index+1);
							});
						}
						if(index == 0){
							$('.carousel-nav-btn.prev').addClass('disabled');
							$('.carousel-nav-btn.next').click(function(){
								$('.carousel-nav-btn.prev').removeClass('disabled');
							})
						}
						if(index == maxIndex){
							$('.carousel-nav-btn.next').addClass('disabled');
							$('.carousel-nav-btn.prev').click(function(){
								$('.carousel-nav-btn.next').removeClass('disabled');
							});
						}
					}
				});
			
		}


		function destroyPage()
		{
			//console.log("Into Page Destroy");
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




