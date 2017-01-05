
(function() {


		var $pageId;
		var $eventObj;
		var $audioOff;

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

			$('.settings-btn.exit').click(function(){

				window.close();
			});

			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_AUDIO_STATUS,gotAudioStatus);

			
			var eventObjToSend = {"pageId":$pageId};
			$eventObj.trigger($eventObj.eventVariables.GET_AUDIO_STATUS,eventObjToSend);



		}

		function gotAudioStatus(eventObj)
		{
			$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_AUDIO_STATUS,gotAudioStatus);
			var pageId = eventObj['pageId'];
			if(pageId == $pageId)
			{
				$audioOff = eventObj['audioOff'];

				setAudioControl();

			}
		}

		function setAudioControl()
		{
			if($audioOff == true)
			{
				$('.audio span').html('Music On');
				$('.audio').on('click',function(){

					$audioOff = false;
					$('.audio span').html('Music Off');
					var eventObjToSend = {"pageId":$pageId};
					$eventObj.trigger($eventObj.eventVariables.SET_AUDIO_ON,eventObjToSend);

					setAudioControl();
				});
			}
			else
			{
				$('.audio span').html('Music Off');
				$('.audio').on('click',function(){

					$audioOff = true;
					$('.audio span').html('Music On');
					var eventObjToSend = {"pageId":$pageId};
					$eventObj.trigger($eventObj.eventVariables.SET_AUDIO_OFF,eventObjToSend);

					setAudioControl();

				});
			}
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/settingsScreen/settingsScreen.css";
			link.media = 'all';
			mainPageDiv.appendChild(link);

			$('#mainPageDiv_'+$pageId).removeClass('hide-element');

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


		}



		function destroyPage()
		{
			//console.log("Into Page Destroy");
		}
		
		$('#mainPageDiv').addClass('hide-element');
		var imagesLoaded = 0;

		//alert('Page Load Start '+$('#mainPageDiv .image').length);

		$('#mainPageDiv .image').each(function(){

			//console.log($('.menu-bg .anim-div .resume-hand.hand1').css('background'));

			var bgImg = new Image();
			bgImg.onload = function(){

				imagesLoaded++;
				if(imagesLoaded == $('#mainPageDiv .image').length)
				{
					//console.log('all loaded');
			   		App.register( {init:init,destroyPage:destroyPage});
				}
			   //myDiv.style.backgroundImage = 'url(' + bgImg.src + ')';
			   

			};

			bgImg.src = $(this).attr('src');

		});


})();




