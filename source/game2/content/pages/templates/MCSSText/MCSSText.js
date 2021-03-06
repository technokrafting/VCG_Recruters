
(function() {


		var $pageId;
		var $eventObj;

		var $currentSelectedOption;
		var $comptency;
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
			
			
			renderOptions(xml);

			$('.options').each(function(){
				
					$(this).click(function() {
						$(".options").removeClass( "optionActive" );
						$(this).addClass( "optionActive" );

						if(!$currentSelectedOption)
						{
							$eventObj.trigger($eventObj.eventVariables.ENABLE_DECISION_SUBMIT,null);
						}

						$currentSelectedOption = $(this);

						

					});


				});

			

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

			var options = xml.find('options');

			var optionsDiv  = document.getElementById('options');

			options.children('option').each(function() {


				//console.log("Into ");



				var id = $(this).attr("id");
				var value = $(this).attr("value");
				var text = $(this).text();

				var div  = document.createElement('div');
				div.id = id;
				div.setAttribute('value', value);
				div.setAttribute('class', 'options');
				div.appendChild(document.createTextNode(text));

				//console.log("Got appendStr"+div);
				optionsDiv.appendChild(div);

			});
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/MCSSText/MCSSText.css";
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

			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				//console.log($pageId+" $currentSelectedOption "+$currentSelectedOption);
				var opId = $currentSelectedOption.attr('id');
				var optScore = $currentSelectedOption.attr('value');

				var actData = {};

				var optArr =  [];
				optArr[0] = opId;

				var optScoreArr = [];
				optScoreArr[0] = optScore;

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

				$('.options').off();

				var optArr = actData[2];

				$('#'+optArr[0]).addClass( "optionActive" );

				

			}
			

		}

		
		App.register( {init:init,destroyPage:destroyPage});


})();




