
(function() {


		var $pageId;
		var $eventObj;
		var profilesArr = [];
		var profilesCompleted = [];

		var $navController;

		var totalScore = 0;

		var $bgAudio;

		var init = function (xml,navController,eventObj,pageId)
		{

			$navController = navController;
			
			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;


			$bgAudio = xml.find('bgAudio').text();
			loadBgAudio();

			loadTemplateCss();


			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js


			generateProfies(xml);

			getData();


			var guidelinesId = xml.find('guidelinesPageId').text();
			$('.brochure-icon').on('click',function(){

				var eventObjToSend = {"pageId":guidelinesId};
				$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

			});

			var settingsId = xml.find('settingsPageId').text();
			$('.setting-div').on('click',function(){

				var eventObjToSend = {"pageId":settingsId};
				$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

			});
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

		function generateProfies(xml)
		{


			var profile1 = xml.find('profile1');
			var profile2 = xml.find('profile2');
			var profile3 = xml.find('profile3');


			profilesArr[profilesArr.length] = profile1.text();
			profilesArr[profilesArr.length] = profile2.text();
			profilesArr[profilesArr.length] = profile3.text();
			
			//console.log(easyResumes);

			console.log('profilesArr', profilesArr);

			loadProfileClicks();

		}

		function getData()
		{
			console.log("Get Data Menu");
			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotProfilePagesData);

			var eventObjToSend = {"pageId":$pageId,"getPageIds":[profilesArr[0],profilesArr[1],profilesArr[2]]};
			$eventObj.trigger($eventObj.eventVariables.GIVE_PAGE_DATA,eventObjToSend);
		}

		// function gotPagesData(eventObj)
		// {
		// 	console.log("got Menu Page Data ",eventObj);
		// 	var pageId = eventObj["pageId"];
		// 	if(pageId == $pageId)
		// 	{
		// 		//console.log("Into If "+eventObj["pagesData"]);

		// 		$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);

		// 		var pagesData = eventObj["pagesData"];
		// 		if(pagesData)
		// 		{
		// 			var gotDataObj = pagesData[$pageId];

					
		// 		}

		// 	}
		// }

		function gotProfilePagesData(eventObj)
		{
			console.log('gotProfilePagesData',eventObj);
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				var pagesData = eventObj["pagesData"];
				if(pagesData)
				{	

					var i = 0;
					for(i=0;i<profilesArr.length;i++)
					{
						var gotDataObj = pagesData[profilesArr[i]];

						if(gotDataObj)
						{
							var profileScrore = parseInt(gotDataObj['score']);

							totalScore = totalScore + profileScrore;

							console.log('Setting i '+i);
							//$('#profile-'+(i+1)).removeClass('locked');

							if(profileScrore >= 800)
							{	
								$('#profile-'+(i+1)).removeClass('profile-open');
								$('#profile-'+(i+1)).addClass('profile-done');
							}
						}
						
					}

					//var completedProfilesCount = Object.keys(pagesData).length;

					if(totalScore >= 2400)
					{
						showFinalFeedback();

						var eventObjToSend = {"score":totalScore};
						$eventObj.trigger($eventObj.eventVariables.SET_USER_SCORE,eventObjToSend);
					}
					
				}
				

				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotProfilePagesData);

			}
		}



		function loadProfileClicks()
		{
				$('.profile-btn-continue').click(function() {

					//var eventObjToSend = {"pageId":resumesChoosen[(index)]};
                   // $eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

                   
                   var index = $(this).attr('id').toString().split('-')[1];

                    index = parseInt(parseInt(index) - 1);

                    console.log('index',index);

                    var pageId = profilesArr[index];
                    $navController.navigate(pageId);

				});
		}

		function showFinalFeedback()
		{
			if(totalScore >= 2400 && totalScore <= 2579)
			{
				$('.medal-wrapper .medal').addClass('bronze');
				$('.feedback-medal').addClass('bronze');
				$('.feedback-medal').html('Bronze Medal');
			}

			if(totalScore >= 2580 && totalScore <= 2849)
			{
				$('.medal-wrapper .medal').addClass('silver');
				$('.feedback-medal').addClass('silver');
				$('.feedback-medal').html('Silver Medal');
			}

			if(totalScore >= 2850 && totalScore <= 3000)
			{
				$('.medal-wrapper .medal').addClass('gold');
				$('.feedback-medal').addClass('gold');
				$('.feedback-medal').html('Gold Medal');
			}


			$('.menu-page').addClass('final');

			$('.exit').on('click',function(){
				$('.menu-page').removeClass('final');

				window.close();
			});

			// $('.replay').on('click',function(){

			// 	var eventObjToSend = {"pageId":'page1'};
			// 	$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

			// });
		}	



		function saveData()
		{
			var saveObj = {};
			saveObj["totalScore"] = totalScore;

			var eventObjToSend = {"pageId":$pageId,"pageData":saveObj};
			$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/menuScreen/menuScreen.css";
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

			//$('#content').removeClass('hide-element');

			// /App.pageLoaded();

			var eventObjToSend = {"pageId":$pageId};
			$eventObj.trigger($eventObj.eventVariables.PAGE_INIT,eventObjToSend);

		}


		function destroyPage()
		{
			//console.log("Into Page Destroy");
			//$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);
			$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotProfilePagesData);

			var eventObjToSend = {"pageId":$pageId,"audioPath":$bgAudio};
			$eventObj.trigger($eventObj.eventVariables.STOP_BACKGROUND_AUDIO,eventObjToSend);
		}

		//$('#content').addClass('hide-element');
		var imagesLoaded = 0;

		$('.image').each(function(){

			//console.log($('.menu-bg .anim-div .resume-hand.hand1').css('background'));

			var bgImg = new Image();
			bgImg.onload = function(){

				imagesLoaded++;
				if(imagesLoaded == $('.image').length)
				{
					//alert('all loaded');
			   		App.register( {init:init,destroyPage:destroyPage});
			   		////$('#content').removeClass('hide-element');
				}
			   //myDiv.style.backgroundImage = 'url(' + bgImg.src + ')';
			   

			};

			bgImg.src = $(this).attr('src');

		});
		
		

})();




