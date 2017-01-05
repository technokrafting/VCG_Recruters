
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
		var $dropDownData = {};

		var init = function (xml,navController,eventObj,pageId)
		{
			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;
			loadTemplateCss();


			

			renderTextElements(mainDivId,xml); //Call in utils.js

			$eventObj = eventObj;
			

			renderDropDownData(xml);
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

		function renderDropDownData(xml)
		{

			var dropdowns = xml.find('dropdowns');

			dropdowns.children('dropdown').each(function() {

				var id = $(this).attr("id");
				var drops = $(this).find('drops');

				var mainArr = [];

				
				drops.children('drop').each(function() {

					var dataArr = [];
					var value = $(this).attr('value');
					var text = $(this).text();

					dataArr[0] = value;
					dataArr[1] = text;

					mainArr[mainArr.length] = dataArr;
				});

				$dropDownData[id] = mainArr;

			});

			
			

			
		}

		function renderOptions(xml)
		{
			//console.log("renderOptions ");

			var actTableHeader = xml.find('actTableHeader').text();
			$("#actTable").append(actTableHeader);
			
			$totalOptions = 0;

			var params = xml.find('params');

			params.children('param').each(function() {


				var paramId = $(this).attr("id");
				var paramText = $(this).text();

				var tds = '<tr class=tableRow id='+paramId+'>';

				tds = tds+ '<td>'+ paramText +'</td>';


				var heads = xml.find('heads');
				var headLength = heads.children('head').length;

				var counter = 0;
				heads.children('head').each(function() {


						tds = tds + '<td>';

					
						var headId = $(this).attr("id");
						
						var checkId = headId+paramId;
						
						var selectDef = '<select class="selectDropDown" id="'+checkId+'">';
						
						var dropDataArr = $dropDownData[checkId];

						var options = '<option value="-1">---</option>';

						for(k=0;k<dropDataArr.length;k++)
						{
							var innerArr = dropDataArr[k];
							var value = innerArr[0];
							var text = innerArr[1];

							options = options + '<option value='+value+'>'+text+'</option>';

						}

						selectDef = selectDef + options + '</select>';

						tds = tds + selectDef + '</td>';
											
				});


				tds = tds + '</tr>';

				$("#actTable").append(tds);


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

			var dropDownLength = Object.keys($dropDownData).length;
			if(numItems == dropDownLength)
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
			link.href = "pages/templates/DropDownTable/DropDownTable.css";
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

				var scoreColumnHm = {};
				
				$('.selectDropDown').each(function() {

					var id=$(this).attr("id");
					var selectedValue = $(this).val();
					var selectedText = $(this).children(":selected").text();

					var mainInt = id.charAt(0);

					//console.log(id+' Got Id '+mainInt);

					var currentScoreForId = 0;
					var currentCountForId = 0;

					if(scoreColumnHm[mainInt])
					{
						currentScoreForId = scoreColumnHm[mainInt][0];
						currentCountForId = scoreColumnHm[mainInt][1];
					}


					var dropDownDataArr = $dropDownData[id];

					//console.log(id+ " Got dropDownDataArr "+dropDownDataArr.length);

					for(j=0;j<dropDownDataArr.length;j++)
					{
						var innerObj = dropDownDataArr[j];

						//console.log(selectedText+' Checking '+innerObj[1]);
						if(selectedText == innerObj[1])
						{
							//console.log(' parseInt(innerObj[0]) '+parseInt(innerObj[0]));
							currentScoreForId = currentScoreForId + parseFloat(innerObj[0]);
							currentCountForId++;
							break;
						}
					}

					var tempArr = [];
					tempArr[0] = currentScoreForId;
					tempArr[1] = currentCountForId;

					scoreColumnHm[mainInt] = tempArr;
					
					var tempObj = {};
					tempObj[id] = selectedValue;
					optArr[optArr.length] = tempObj;

				});
				
				var totalScore = 0;

				var lengthOfMain = Object.keys(scoreColumnHm).length;
				for (var key in scoreColumnHm) 
				{
					var totalIdScore = scoreColumnHm[key][0];
					var countOfId = scoreColumnHm[key][1];

					//console.log(' totalIdScore '+(totalIdScore/countOfId));

					totalScore = totalScore + (totalIdScore/countOfId);
				}

				//console.log(lengthOfMain+' Got Total Score '+totalScore);



				totalScore = (totalScore / lengthOfMain);

				totalScore = (totalScore*100);

				totalScore = Math.round(totalScore);

				totalScore = (totalScore/100);

				//var totalDropDowns = Object.keys($dropDownData).length;

				//console.log(lengthOfMain+" totalScore Length "+totalScore);

				//totalScore = (totalScore/totalDropDowns);


				//console.log("totalScore "+totalScore);

				var actData = {};

				var optScoreArr = [];
				optScoreArr[0] = totalScore;

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




