
(function() {


		var $pageId;
		var $eventObj;

		var $currentSelectedOption;
		var $comptency;
		var $showPopup = true;
		var $correctAnsHm={};
		var $selectOptions;
		var $totalOptions;
		var $correctAnswersHm = {};

		var init = function (xml,navController,eventObj,pageId)
		{
			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;
			loadTemplateCss();


			

			renderTextElements(mainDivId,xml); //Call in utils.js

			$eventObj = eventObj;
			
			renderSelectOptions(xml);
			renderOptions(xml);

			

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

		function renderSelectOptions(xml)
		{

			$selectOptions = "";
			var swotOptions = xml.find('swotOptions');

			swotOptions.children('option').each(function() {

				var value = $(this).attr("value");
				var text = $(this).text();

				$selectOptions = $selectOptions + '<option value='+value+'>'+text+'</option>';

			});

			
		}

		function renderOptions(xml)
		{
			//console.log("renderOptions ");

			var options = xml.find('options');


			var header1 = xml.find('header1').text();
			var header2 = xml.find('header2').text();


			var tds1 = '<tr class="tableHead">';

			tds1 = tds1 + '<td>'+header1+'</td>';
			tds1 = tds1 + '<td>'+header2+'</td>';


			tds1 = tds1 + '</tr>'

			$("#actTable").append(tds1);

			$totalOptions = 0;
			options.children('option').each(function() {


				var tds = '<tr class="tableRow1">';

				var id = $(this).attr("id");
				var value = $(this).attr("value");
				var text = $(this).text();
				var correctAnswer = $(this).attr("correctValue");
				$correctAnswersHm[id]=correctAnswer;

				var selectDef = '<select class="selectDropDown" id="'+id+'">';
				selectDef = selectDef + $selectOptions + '</select>';

				tds = tds+ '<td>'+text+'</td>';
				tds = tds + '<td>'+selectDef+'</td>';

				var tds = tds + '</tr>';

				//console.log("Check Box Div "+tds);

				$("#actTable").append(tds);

				$totalOptions++;

			});


			$('.selectDropDown').change(function(){
					
					var gotVal = $(this).val();

					//console.log("On Change "+gotVal);
					if(gotVal != -1)
						$(this).addClass('OK');
					else
						$(this).removeClass('OK');

					checkForAllSelected();

				});


		}

		function checkForAllSelected()
		{
			var numItems = $('.OK').length;
			if(numItems == $totalOptions)
			{
				$eventObj.trigger($eventObj.eventVariables.ENABLE_DECISION_SUBMIT,null);
			}
			else
			{
				$eventObj.trigger($eventObj.eventVariables.DISABLE_DECISION_SUBMIT,null);
			}
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/DropDownSwot/DropDownSwot.css";
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
				saveData();
				$eventObj.unRegisterEvent($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,destroyPage);
				$eventObj.unRegisterEvent($eventObj.eventVariables.REQUEST_ACTIVITY_DATA,sendData);
				$eventObj.unRegisterEvent($eventObj.eventVariables.RESTORE_ACTIVITY_DATA,restoreData);


				$('#mainPageDiv_'+$pageId).closest('div').removeClass().empty();
			
				//console.log("Into Page Destroy "+$pageId);
			}
			
		}

		function sendData(eventObj)
		{

			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				//console.log("Sending Data "+$pageId);
				
				//console.log($pageId+" $currentSelectedOption "+$currentSelectedOption);
				
				var optArr =  [];
				var totalCorrect = 0;

				$('.selectDropDown').each(function() {

					var id=$(this).attr("id");
					var selectedValue = $(this).val();
					var correctAnsforOpt = $correctAnswersHm[id];

					if(selectedValue == correctAnsforOpt)
					{
						totalCorrect++;
					}

					var tempObj = {};
					tempObj[id] = selectedValue;
					optArr[optArr.length] = tempObj;

				});

				totalCorrect = (totalCorrect/$totalOptions);


				//console.log("totalCorrect "+totalCorrect);

				var actData = {};

				var optScoreArr = [];
				optScoreArr[0] = totalCorrect;

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

		function saveData()
		{
			var optArr =  [];

			$('.selectDropDown').each(function() {

					var selectedValue = $(this).val();
					
					optArr[optArr.length] = selectedValue;

				});

				var actData = {};

				actData["optionSelData"] = optArr;

			var eventObjToSend = {"pageId":$pageId,"pageData":actData};
			$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);
		}


		function restoreData(eventObj)
		{

			//console.log("restoreData MCSS");

			var actData = eventObj["actData"];

			if(actData[0] == $pageId)
			{
				$showPopup = false;
				
				var optArr = actData[2];

				for(i=0;i<optArr.length;i++)
				{
					var tempObj = optArr[i];
					var id = Object.keys(tempObj)[0];
					var selectVal = tempObj[id];

					//console.log(id+" Got Selected Value for "+selectVal);
					$('#'+id).val(selectVal);
				}

				$('.selectDropDown').attr('disabled', 'disabled');


			}
			

		}

		
		App.register( {init:init,destroyPage:destroyPage});


})();




