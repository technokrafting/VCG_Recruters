
(function() {


		var $pageId;
		var $eventObj;
		var $bgAudio;

		var init = function (xml,navController,eventObj,pageId)
		{


			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;


			$bgAudio = xml.find('bgAudio').text();
			loadBgAudio();
			


			loadTemplateCss();

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js

			
		}

		function loadBgAudio()
		{
			$eventObj.registerForEvent($eventObj.eventVariables.BG_AUDIO_LOADED,bgAudioLoaded);

			var eventObjToSend = {"pageId":$pageId,"audioPath":$bgAudio};
			$eventObj.trigger($eventObj.eventVariables.LOAD_BACKGROUND_AUDIO,eventObjToSend);
		}

		function bgAudioLoaded(eventObj)
		{
			var pageId = eventObj['pageId'];
			if(pageId == $pageId)
			{
				var audioPath = eventObj['audioPath'];
				if(audioPath == $bgAudio)
				{
					$eventObj.unRegisterEvent($eventObj.eventVariables.BG_AUDIO_LOADED,bgAudioLoaded);
					
					var eventObjToSend = {"pageId":$pageId,"audioPath":$bgAudio};
					$eventObj.trigger($eventObj.eventVariables.PLAY_BACKGROUND_AUDIO,eventObjToSend);
				}
			}
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/splashScreen/splashScreen.css";
			link.media = 'all';
			mainPageDiv.appendChild(link);

			checkFile("pages/"+$pageId+"/"+$pageId+".css",cssCallback);

			initPage();


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

		}

		function initPage()
		{
			//var animTime = 8400;
				//console.log($('.anim-div .splash-animation'))
				var loaded = 0;
				var imgArr = [];
				for(var i=1; i<=150;i++){
					var img = new Image();

					imgArr.push(img);					
					img.onload = function(){
						console.log("loaded", loaded);
						loaded++;
						if(loaded == 150){
							//console.log("rubn")
								console.log("splash images loaded!")
							splashSequence();
						}
					}
					img.src = "img/splashLogo_sprite/"+i+".png";
					$('.anim-div .splash-animation').append(img);
				}
				
				//$('.anim-div .splash-animation').css('background-image','url(crops/splash/splashLogo_sprite/1.png)');
				
		}

		function splashSequence(){

			var eventObjToSend = {"pageId":$pageId};
			$eventObj.trigger($eventObj.eventVariables.PAGE_INIT,eventObjToSend);
			
				var i = 1;
				
				var t = setInterval(function(){
					
					//console.log('i = ',i);
					if(i > 149){
						clearInterval(t);
						$('.enter-btn-wrap').addClass('appear');
					}
					else{
						$('.anim-div .splash-animation img').removeClass("active");
						$('.anim-div .splash-animation img').eq(i).addClass("active");

						i++;
					}
				}, 72);
			}


		function destroyPage()
		{
			console.log("Into Page Destroy Splash");

			var eventObjToSend = {"pageId":$pageId,"audioPath":$bgAudio};
			$eventObj.trigger($eventObj.eventVariables.STOP_BACKGROUND_AUDIO,eventObjToSend);

		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




