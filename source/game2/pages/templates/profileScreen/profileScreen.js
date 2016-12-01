
(function() {


		var $pageId;
		var $eventObj;
		var $score;

		var $currentStep = 0;

		var $correctSequenceObj = {};

		var init = function (xml,navController,eventObj,pageId)
		{


			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;


			loadTemplateCss();

			
			initAnswers(xml);
				
			initStep1();

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js

			initializeScreenJs();

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

				if(currentObj.answer == 'yes')
				{
					$score = $score + currentObj.score;
				}
				else
				{

				}

				initStep2();


			});

			$('.reject').on('click',function(){

				if(currentObj.answer == 'yes')
				{
					
					//show We see potential in the candidate. Kindly evaluate him further	
					$('#suggestionModal').modal('show');

				}else{

					$score = $score + currentObj.score;
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

				if(currentObj.answer == 'yes')
				{
					$score = $score + currentObj.score;
				}
				else
				{

				}

				initStep3();


			});

			$('.reject').on('click',function(){

				if(currentObj.answer == 'yes')
				{
					
					//show We see potential in the candidate. Kindly evaluate him further	
					$('#suggestionModal').modal('show');

				}else{

					$score = $score + currentObj.score;
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

				if(currentObj.answer == 'yes')
				{
					$score = $score + currentObj.score;
				}
				else
				{

				}

				initStep4();


			});

			$('.reject').on('click',function(){

				if(currentObj.answer == 'yes')
				{
					
					//show We see potential in the candidate. Kindly evaluate him further	
					$('#suggestionModal').modal('show');

				}else{

					$score = $score + currentObj.score;
				}

				initStep4();

			});

		}


		function initStep4()
		{

			var currentObj = $correctSequenceObj['step3'];

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
			
			var rating = document.getElementById('ratingSlider');
			noUiSlider.create(rating, {
				start: [5],
				step: 1,
				range: {
					min: [ 1 ],
					max: [ 10 ]
				},
				pips: { // Show a scale with the slider
					mode: 'steps',
					stepped: true,
					density: 10
				}
			})
			
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
		
		App.register( {init:init,destroyPage:destroyPage});


})();




