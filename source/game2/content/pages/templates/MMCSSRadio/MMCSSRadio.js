
(function() {


		var $pageId;
		var $eventObj;

		var $currentSelectedOption;
		var $comptency;
		var $correctOptions = [];
		var $radClassArr = [];
		var $showPopup = true;


		var init = function (xml,navController,eventObj,pageId)
		{

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;


			$pageId = pageId;
			loadTemplateCss();

			
			renderTextElements(mainDivId,xml); //Call in utils.js

			$eventObj = eventObj;
			
			
			renderCorrectAnswers(xml);
			renderTable(xml);

			$comptency = xml.find('question').attr("competency");

			$eventObj.trigger($eventObj.eventVariables.DISABLE_DECISION_SUBMIT,null);

			$eventObj.registerForEvent($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,destroyPage);
			$eventObj.registerForEvent($eventObj.eventVariables.REQUEST_ACTIVITY_DATA,sendData);
			$eventObj.registerForEvent($eventObj.eventVariables.RESTORE_ACTIVITY_DATA,restoreData);


			setTimeout(function(){ 

					var initPopup = xml.find('initPopup').text();
					if(initPopup && $showPopup == true)
					{
						//console.log(" Got init Popup Id "+initPopup);
						var eventObjToSend = {"pageId":initPopup};
		                eventObj.trigger(eventObj.eventVariables.LOAD_PAGE,eventObjToSend);
					}

				}, 100);


		}

		function renderCorrectAnswers(xml)
		{
			var answers = xml.find('answers');
			////console.log(answers);
			var answersArr = answers.text().split(',');

			for(i=0;i<answersArr.length;i++)
			{
				////console.log("Got Answers "+answersArr[i]);
				$correctOptions[i] = answersArr[i];
			}

			////console.log($correctOptions);
		}

		function renderTable(xml)
		{
			//console.log("renderTable ");

			var actTable  = document.getElementById('actTable');

			var tds = '<tr class=tableHead>';

			//tds = tds+ '<th id=paramTd></th>'; //To Give column for params

			var heads = xml.find('heads');

			heads.children('head').each(function() {

				var headText = $(this).text();

				tds = tds+ '<th class=headTh>'+headText+'</th>';
				
			});

			var tds = tds + '</tr>';

			$("#actTable").append(tds);


			var params = xml.find('params');

			params.children('param').each(function() {

				var paramId = $(this).attr("id");
				var paramText = $(this).text();

				var tds = '<tr class=tableRow id='+paramId+'>';

				tds = tds+ '<td>'+ paramText +'</td>';

				var radClass = "radio_"+paramId;

				$radClassArr[$radClassArr.length] = radClass;


				var heads = xml.find('heads');
				var headLength = heads.children('head').length;

				var counter = 0;
				heads.children('head').each(function() {

					counter++;
					if(counter < headLength)
					{
						var headId = $(this).attr("id");
						var headText = $(this).text();

						var checkId = headId+paramId;
						
						var checkBoxDef = '<div class="radioBtn '+radClass+'" customClass='+radClass+' isChecked=no id='+checkId+'></div>';

						tds = tds+ '<td>'+checkBoxDef+'</td>';
					}

					
				});

				$("#actTable").append(tds);

			});



			for(i=0;i<$radClassArr.length;i++)
			{
				var radClass = $radClassArr[i];

				//console.log("Working on Rad Class "+radClass);

				$('.'+radClass).each(function(){

					$(this).click(function() {

						var customClass = $(this).attr('customClass');

						//console.log(customClass+" Got RadClass Length "+$('.'+customClass).length);

						$('.'+customClass).removeClass( "radioActive" );
						$('.'+customClass).attr('isChecked','no');

						$(this).addClass( "radioActive" );
						$(this).attr('isChecked','yes');

						checkForSubmit();
				
					});

				});
			}

		}


		function checkForSubmit()
		{
			var activeLength = 0;

			for(i=0;i<$radClassArr.length;i++)
			{
				var radClass = $radClassArr[i];
				var toCheckClass = '.'+radClass +'.radioActive';
				//console.log(toCheckClass+" Checking Class "+$(toCheckClass).length);

				if($(toCheckClass).length != 0)
				{
					activeLength++;
				}
			}

			if(activeLength == $radClassArr.length)
			{
				$eventObj.trigger($eventObj.eventVariables.ENABLE_DECISION_SUBMIT,null);
			}
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/MMCSSRadio/MMCSSRadio.css";
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


		function destroyPage(eventObj)
		{
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				$eventObj.unRegisterEvent($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,destroyPage);
				$eventObj.unRegisterEvent($eventObj.eventVariables.REQUEST_ACTIVITY_DATA,sendData);
				$eventObj.unRegisterEvent($eventObj.eventVariables.RESTORE_ACTIVITY_DATA,restoreData);

				$('#mainPageDiv_'+$pageId).closest('div').removeClass().empty();
			
				//console.log("Into Page Destroy "+$pageId);
			}
			
		}

		function sendData(eventObj)
		{

			var optArr =  [];
				
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				//console.log("Sending Data "+$pageId);
				

				var correctSelected = 0;
				var incorrectSelected = 0;

				for(i=0;i<$radClassArr.length;i++)
				{
					var radClass = $radClassArr[i];
					var toCheckClass = '.'+radClass +'.radioActive';
					//console.log(toCheckClass+" Checking Class "+$(toCheckClass).length);

					var chkId = $(toCheckClass).attr('id');
					optArr[optArr.length] = chkId;

					if($correctOptions.indexOf(chkId) != -1)
					{
						correctSelected++;
					}
					else
					{
						//incorrectSelected++;
					}
					
				}

				//console.log(correctSelected+" Checking Score "+incorrectSelected);

				var scoreToSend = 0;
				var correctLength = $correctOptions.length;
				var totalNeg = incorrectSelected;
				if(totalNeg >= correctSelected)
				{
					scoreToSend = 0;
				}
				else
				{
					var correctAvg = correctSelected - totalNeg;
					scoreToSend = ((correctAvg/correctLength)*100);
					scoreToSend = scoreToSend / 100;
				}

				//console.log("Sending Score in MMCSSRadio "+scoreToSend);

				var optScoreArr = [];
				optScoreArr[0] = scoreToSend;

				
				var actData = {};

				actData[0] = $pageId;
				actData[1] = $comptency;
				actData[2] = optArr;
				actData[3] = optScoreArr;

				var eventObjToSend = {"actData":actData};

				//console.log("Sending Act Data ");
				//console.log(eventObjToSend);

				$eventObj.trigger($eventObj.eventVariables.DISPATCH_ACTIVITY_DATA,eventObjToSend);

			}
		}

		function restoreData(eventObj)
		{

			//console.log("restoreData MMCSSRadio");

			var actData = eventObj["actData"];

			if(actData[0] == $pageId)
			{
				$showPopup = false;

				$('.radioBtn').off();

				var optArr = actData[2];

				for(i=0;i<optArr.length;i++)
				{
					$('#'+optArr[i]).addClass( "radioActive" );
				}

				

			}
			

		}


		
		App.register( {init:init,destroyPage:destroyPage});


})();




