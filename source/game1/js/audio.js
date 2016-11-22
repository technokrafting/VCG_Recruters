(function() {


		var $eventObj;
		var $pageAudios;
		var $bgAudioElements;
		var $audioOff = false;
			
		function init(popupDiv,eventObj)
		{
			$eventObj = eventObj;
			$pageAudios = {};
			$bgAudioElements = {};

			$eventObj.registerForEvent($eventObj.eventVariables.PLAY_BACKGROUND_AUDIO,playBgAudio);
			$eventObj.registerForEvent($eventObj.eventVariables.LOAD_BACKGROUND_AUDIO,loadBgAudio);
			$eventObj.registerForEvent($eventObj.eventVariables.STOP_BACKGROUND_AUDIO,stopBgAudio);
			$eventObj.registerForEvent($eventObj.eventVariables.SET_AUDIO_OFF,stopAudio);
			$eventObj.registerForEvent($eventObj.eventVariables.SET_AUDIO_ON,startAudio);

			$eventObj.registerForEvent($eventObj.eventVariables.GET_AUDIO_STATUS,getAudioStatus);

			//$eventObj.registerForEvent($eventObj.eventVariables.PLAY_AUDIO,playAudio);

		}

		function stopAudio(eventObj)
		{
			//console.log('stopAudio');
			$audioOff = true;
			var keys = Object.keys($bgAudioElements);
			for(var i=0;i<keys.length;i++)
			{
				var audioElement = $bgAudioElements[keys[i]];
				//audioElement.volume = 0;
				$(audioElement).prop('volume',0);

				//console.log(audioElement.volume);
			}
		}

		function startAudio(eventObj)
		{
			$audioOff = false;
			var keys = Object.keys($bgAudioElements);
			for(var i=0;i<keys.length;i++)
			{
				var audioElement = $bgAudioElements[keys[i]];
				$(audioElement).prop('volume',1);
			}
		}

		function loadBgAudio(eventObj)
		{
			//console.log('loadBgAudio',eventObj);
			var pageId = eventObj["pageId"];
			var audioPath = eventObj['audioPath'];

			var tempObj;
			if($pageAudios[pageId])
			{
				tempObj = $pageAudios[pageId];
				
			}
			else
			{
				tempObj = {};
			}
			tempObj[audioPath] = audioPath;
			$pageAudios[pageId] = tempObj;

			var audioElement = new Audio(audioPath);

			audioElement.addEventListener("canplay",function(){
				//console.log('canPlay');

				var eventObjToSend = {"pageId":pageId,"audioPath":audioPath};
				$eventObj.trigger($eventObj.eventVariables.BG_AUDIO_LOADED,eventObjToSend);
		       
		    });

			//$('#content').append(audioElement);

			audioElement.setAttribute('src', audioPath);
			//console.log('src Set',audioPath);

			audioElement.load();

			$bgAudioElements[audioPath] = audioElement;
			

		}


		function playBgAudio(eventObj)
		{
			//console.log('playBgAudio',eventObj);
			var pageId = eventObj["pageId"];
			var audioPath = eventObj['audioPath'];

			var tempObj;
			if($pageAudios[pageId])
			{
				tempObj = $pageAudios[pageId];

				if(tempObj[audioPath])
				{
					var audioElement = $bgAudioElements[audioPath];
					if($audioOff == true)
					{
						audioElement.volume = 0;
					}
					audioElement.play();

					audioElement.addEventListener("ended",function(){
						
						//console.log('Ended');

						audioElement.pause();
						audioElement.currentTime = 0;
						audioElement.play();
				       
				    });
				}
				
			}
			

		}

		function stopBgAudio(eventObj)
		{
			var pageId = eventObj["pageId"];
			var audioPath = eventObj['audioPath'];

			if($bgAudioElements[audioPath])
			{
				var audioElement = $bgAudioElements[audioPath];
				audioElement.pause();

				delete audioElement[audioPath];

				var tempObj = $pageAudios[pageId];

				delete tempObj[audioPath];
				
			}
			
			

		}

		function getAudioStatus(eventObj)
		{
			var pageId = eventObj['pageId'];

			var eventObjToSend = {"pageId":pageId,"audioOff":$audioOff};
			$eventObj.trigger($eventObj.eventVariables.TAKE_AUDIO_STATUS,eventObjToSend);
		}


		App.registerPopupObj( {init:init});

})();




