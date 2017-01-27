
(function() {


		var $pageId;
		var $eventObj;
		var $navController;
		var $score = 0;

		var $currentStep = 0;

		var $correctSequenceObj = {};

		var $isRejected = false;

		var $menuPageId;

		var $bgAudio;

		var sectionScoreHm = {};

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


			$menuPageId = xml.find('menuPageId').text();

			initAnswers(xml);

			loadProfileData(xml);
				
		
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


		function loadProfileData(xml)
		{

			
			$('#profile-content-container').load("pages/"+$pageId+"/profile.html",function(){



			profileLoaded(xml);

			

		});

		}

		function profileLoaded(xml)
		{
			initStep1();

			initializeScreenJs();

			var settingsId = xml.find('settingsPageId').text();
			$('.setting-div').on('click',function(){

				var eventObjToSend = {"pageId":settingsId};
				$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

			});

			loadTemplateCss();
			
		}

		function initAnswers(xml)
		{
			var tempObj = {};
			tempObj.answer = xml.find('step1').text();
			tempObj.score = xml.find('step1').attr('score');

			$correctSequenceObj['step1'] = tempObj;


			var tempObj = {};
			tempObj.answer = xml.find('step2').text();
			tempObj.score = xml.find('step2').attr('score');

			$correctSequenceObj['step2'] = tempObj;


			var tempObj = {};
			tempObj.answer = xml.find('step3').text();
			tempObj.score = xml.find('step3').attr('score');

			$correctSequenceObj['step3'] = tempObj;


			var tempObj = {};
			tempObj.answer = xml.find('step4a').text();
			tempObj.score = xml.find('step4a').attr('score');

			$correctSequenceObj['step4a'] = tempObj;

			var tempObj = {};
			tempObj.answer = xml.find('step4b').text();
			tempObj.score = xml.find('step4b').attr('score');

			$correctSequenceObj['step4b'] = tempObj;
		}

		function initStep1()
		{

			var currentObj = $correctSequenceObj['step1'];

			$('.resume-wrap').removeClass('hide-element');
			$('.resume-wrap .eval-step-heading .pg-active').removeClass('hide-element');
			$('.resume-wrap .eval-step-heading .pg-inactive').addClass('hide-element');

			$('.accept').off();
			$('.reject').off();

			$('.accept').on('click',function(){

				if(currentObj.answer == 'accept')
				{
					$score = $score + parseInt(currentObj.score);
					sectionScoreHm['step1'] = parseInt(currentObj.score);

					$('#nextPageModal').modal('show');
					$('#next-done-btn').off();

					$('.step1-complete').removeClass('hide-element');

					$('#next-done-btn').on('click',function(){

						$('.step1-complete').addClass('hide-element');

						initStep2();

					});
				}
				else
				{
					initStep2();
				}

				


			});

			$('.reject').on('click',function(){

				$isRejected = true;

				if(currentObj.answer == 'accept')
				{
					
					//show We see potential in the candidate. Kindly evaluate him further	
					$('#suggestionModal').modal('show');

				}else{

					$score = $score + parseInt(currentObj.score);
					sectionScoreHm['step1'] = parseInt(currentObj.score);
				}

				initStep4();

			});

		}

		function initStep2()
		{

			var currentObj = $correctSequenceObj['step2'];

			$('.resume-wrap .eval-step-heading .pg-active').addClass('hide-element');
			$('.resume-wrap .eval-step-heading .pg-inactive').removeClass('hide-element');



			$('.report-wrap').removeClass('hide-element');
			$('.report-wrap .eval-step-heading .pg-active').removeClass('hide-element');
			$('.report-wrap .eval-step-heading .pg-inactive').addClass('hide-element');


			$('.accept').off();
			$('.reject').off();

			$('.accept').on('click',function(){

				if(currentObj.answer == 'accept')
				{
					$score = $score + parseInt(currentObj.score);
					sectionScoreHm['step2'] = parseInt(currentObj.score);

					$('#nextPageModal').modal('show');
					$('#next-done-btn').off();

					$('.step2-complete').removeClass('hide-element');

					$('#next-done-btn').on('click',function(){

						$('.step2-complete').addClass('hide-element');

						initStep3();

					});
				}
				else
				{
					initStep3();
				}



			});

			$('.reject').on('click',function(){

				$isRejected = true;

				if(currentObj.answer == 'accept')
				{
					
					//show We see potential in the candidate. Kindly evaluate him further	
					$('#suggestionModal').modal('show');

				}else{

					$score = $score + parseInt(currentObj.score);
					sectionScoreHm['step2'] = parseInt(currentObj.score);
				}

				initStep4();

			});

		}


		function initStep3()
		{

			var currentObj = $correctSequenceObj['step3'];

			$('.resume-wrap .eval-step-heading .pg-active').addClass('hide-element');
			$('.resume-wrap .eval-step-heading .pg-inactive').removeClass('hide-element');


			$('.report-wrap .eval-step-heading .pg-active').addClass('hide-element');
			$('.report-wrap .eval-step-heading .pg-inactive').removeClass('hide-element');


			$('.transcript-wrap').removeClass('hide-element');
			$('.transcript-wrap .eval-step-heading .pg-active').removeClass('hide-element');
			$('.transcript-wrap .eval-step-heading .pg-inactive').addClass('hide-element');


			$('.accept').off();
			$('.reject').off();

			$('.accept').on('click',function(){

				if(currentObj.answer == 'accept')
				{
					$score = $score + parseInt(currentObj.score);
					sectionScoreHm['step3'] = parseInt(currentObj.score);

					$('#nextPageModal').modal('show');
					$('#next-done-btn').off();

					$('.step3-complete').removeClass('hide-element');

					$('#next-done-btn').on('click',function(){

						$('.step3-complete').addClass('hide-element');

						initStep4();

					});
				}
				else
				{
					initStep4();
				}


			});

			$('.reject').on('click',function(){

				$isRejected = true;

				if(currentObj.answer == 'accept')
				{
					
					//show We see potential in the candidate. Kindly evaluate him further	
					$('#suggestionModal').modal('show');

				}else{

					$score = $score + parseInt(currentObj.score);
					sectionScoreHm['step3'] = parseInt(currentObj.score);
				}

				initStep4();

			});

		}


		function initStep4()
		{

			var step4aObj = $correctSequenceObj['step4a'];
			
			$('.resume-wrap').removeClass('hide-element');
			$('.resume-wrap .eval-step-heading .pg-active').addClass('hide-element');
			$('.resume-wrap .eval-step-heading .pg-inactive').removeClass('hide-element');


			$('.report-wrap').removeClass('hide-element');
			$('.report-wrap .eval-step-heading .pg-active').addClass('hide-element');
			$('.report-wrap .eval-step-heading .pg-inactive').removeClass('hide-element');

			$('.transcript-wrap').removeClass('hide-element');
			$('.transcript-wrap .eval-step-heading .pg-active').addClass('hide-element');
			$('.transcript-wrap .eval-step-heading .pg-inactive').removeClass('hide-element');


			$('.reasoning-wrap').removeClass('hide-element');
			$('.reasoning-wrap .eval-step-heading .pg-active').removeClass('hide-element');
			$('.reasoning-wrap .eval-step-heading .pg-inactive').addClass('hide-element');

			$('.page-foot').addClass('hide-element');

			$('.accept').off();
			$('.reject').off();

			$('#step-4-done-btn').on('click',function(){

				var answerStr = step4aObj.answer;

				var selectedStr = '';
				$('.vcg-checkbox.selected').each(function(){

					var checkId = $(this).attr('checkId');
					selectedStr = selectedStr + checkId + ','
					console.log('checkId ',checkId);
				});

				selectedStr = selectedStr.toString().substring(0,selectedStr.toString().lastIndexOf(','));

				//console.log('Check Answer ',answerStr + ':::::::'+selectedStr);

				if(answerStr == selectedStr)
				{
					//alert('same');
					$score = $score + parseInt(step4aObj.score);
					sectionScoreHm['step4a'] = parseInt(step4aObj.score);
				}


				if($isRejected == false)
				{	
					//console.log('check-yes',$('#check-yes').hasClass('selected'));

					if($('#check-yes').hasClass('selected'))
					{
						$('#ratingSliderModal').modal('show');
					}
					else
					{
						saveData();
						showFeedback();
						//gotoMenuPage();
					}
				}
				else
				{
					saveData();
					showFeedback();
					//gotoMenuPage();
				}
				

			});


			$('#slider-done-btn').on('click',function(){


				var rating = document.getElementById('ratingSlider');
				var sliderVal = parseInt(rating.noUiSlider.get());

				var step4bObj = $correctSequenceObj['step4b'];

				var answerArr = step4bObj.answer.split(',');
				console.log('answerArr',answerArr,sliderVal);

				console.log('indexOf',answerArr.indexOf(sliderVal.toString()));

				if(answerArr.indexOf(sliderVal.toString()) != -1)
				{
					$score = $score + parseInt(step4bObj.score);
					sectionScoreHm['step4b'] = parseInt(step4bObj.score);
				}

				saveData();
				showFeedback();
				//gotoMenuPage();


			});
			

		}


		function saveData()
		{
			var saveObj = {};
			saveObj["score"] = $score;

			var eventObjToSend = {"pageId":$pageId,"pageData":saveObj};
			$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);

		}

		function showFeedback()
		{


			if($score < 800)
			{
				$('.score-star').addClass('star-0');
				$('.congrats').addClass('hide-element');
			}

			if($score >= 800 && $score <= 899)
			{
				$('.score-star').addClass('star-1');
				$('.hard-luck').addClass('hide-element');
			}

			if($score >= 900 && $score <= 999)
			{
				$('.score-star').addClass('star-2');
				$('.hard-luck').addClass('hide-element');
			}

			if($score >= 1000)
			{
				$('.score-star').addClass('star-3');
				$('.hard-luck').addClass('hide-element');
			}


			var step1Score = 'N.A';
			var step2Score = 'N.A';
			var step3Score = 'N.A';
			var step4aScore = 'N.A';
			var step4bScore = 'N.A';

			if(sectionScoreHm['step1'])
			{
				step1Score = sectionScoreHm['step1'];
			}
			if(sectionScoreHm['step2'])
			{
				step2Score = sectionScoreHm['step2'];
			}
			if(sectionScoreHm['step3'])
			{
				step3Score = sectionScoreHm['step3'];
			}
			if(sectionScoreHm['step4a'])
			{
				step4aScore = sectionScoreHm['step4a'];
			}
			if(sectionScoreHm['step4b'])
			{
				step4bScore = sectionScoreHm['step4b'];
			}

			console.log('sectionScoreHm',sectionScoreHm);


			$('#resume-score').html(step1Score);
			$('#report-score').html(step2Score);
			$('#transcript-score').html(step3Score);
			if(step4aScore == 'N.A' && step4bScore == 'N.A')
			{
				$('#candidate-score').html(step4aScore);
			}
			else
			{
				if(step4aScore == 'N.A')
				{
					step4aScore = 0;
					
				}
				else
				{
					step4bScore = 0;
				}

				$('#candidate-score').html((parseInt(step4aScore) + parseInt(step4bScore)));
			}
			
			$('#total-score').html($score);


			$('#feedbackModal').modal('show');
		}

		function gotoMenuPage()
		{
			//alert('Score is '+ $score);

			$navController.navigate($menuPageId);
		}

		function initializeScreenJs()
		{
			$('.vcg-checkbox').click(function() {
				var me = $(this);
				if($('.checkbox-holder .vcg-checkbox.selected').length < 2 && !(me.hasClass('selected'))){
					me.addClass('selected');
					me.closest('.checkbox-holder').find('input[type="checkbox"]').trigger('click');
				}
				else if(me.hasClass('selected')){
					me.removeClass('selected');
					me.closest('.checkbox-holder').find('input[type="checkbox"]').trigger('click');
				}
				else{
					return;
				}
			});

			var rating = document.getElementsByClassName('range-slider');
			for (i=0;i<rating.length;i++){
				noUiSlider.create(rating[i], {
					start: [5],
					step: 1,
					range: {
						min: [ 1 ],
						max: [ 10 ]
					}
				})
			}
		}



		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/profileScreen/profileScreen.css";
			link.media = 'all';
			mainPageDiv.appendChild(link);

			checkFile("pages/"+$pageId+"/"+$pageId+".css",cssCallback);

			//$('#content').removeClass('hide-element');

			var eventObjToSend = {"pageId":$pageId};
			$eventObj.trigger($eventObj.eventVariables.PAGE_INIT,eventObjToSend);


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




