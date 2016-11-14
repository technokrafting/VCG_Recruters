
(function() {


		var $pageId;
		var $eventObj;

		var $currentSelectedOption;
		var $comptency;
		var $showPopup = true;
		var $radClassArr = [];

		var init = function (xml,navController,eventObj,pageId)
		{

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;
			loadTemplateCss();

			

			renderTextElements(mainDivId,xml); //Call in utils.js

			$eventObj = eventObj;
			
			
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

		function renderOptions(xml)
		{
			//console.log("renderOptions ");

			var optionsDiv  = document.getElementById('options');

			var activities = xml.find('activities');

			var count = 0;


			activities.children('details').each(function() {

				count++;


				var heading = $(this).find('heading');

				var tds = '<table class=actTable id=actTable_'+ count +'><tr>';
				tds = tds + '<th colspan=2>'+heading.text()+'</th></tr>'

				var options = $(this).find('options');

				var radClass = "radioBtn_"+count;

				$radClassArr[$radClassArr.length] = radClass;

				options.children('option').each(function() {

					tds = tds + '<tr class="tableRow">';

					var id = $(this).attr("id");
					var value = $(this).attr("value");
					var text = $(this).text();

					var checkBoxDef = '<div class="radioBtn '+radClass+'" customClass='+radClass+' isChecked=no id='+id+' value='+value+'></div>';

					tds = tds+ '<td>'+checkBoxDef+'</td>';
					tds = tds + '<td>'+text+'</td>';

					tds = tds + "</tr>"

				});


				var tds = tds + '</table>';

				////console.log("Check Box Div "+tds);

				$('#options').append(tds);


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

			});

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
			link.href = "pages/templates/MultiMCSSRadio/MultiMCSSRadio.css";
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

			var actScore = 0;
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				//console.log("Sending Data "+$pageId);
				
				
				var optArr =  [];

				for(i=0;i<$radClassArr.length;i++)
				{
					var radClass = $radClassArr[i];
					var toCheckClass = '.'+radClass +'.radioActive';
					
					var chkId = $(toCheckClass).attr('id');
					optArr[optArr.length] = chkId;

					var chkValue = parseFloat($(toCheckClass).attr('value'));
					

					actScore = actScore + chkValue;
				}

				actScore = ((parseFloat(actScore)/parseFloat($radClassArr.length)) * 100);
				actScore = actScore / 100;

				//console.log(" Sending Score "+actScore);


				var actData = {};


				var optScoreArr = [];
				optScoreArr[0] = actScore;

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

			//console.log("restoreData MCSS");

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




