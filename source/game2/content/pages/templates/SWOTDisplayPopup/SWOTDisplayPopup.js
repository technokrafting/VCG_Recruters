
(function() {


		var $pageId;
		var $eventObj;

		var $xml;
		var $swotPageId;

		var init = function (xml,navController,eventObj,pageId)
		{

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;
			loadTemplateCss();


			renderTextElements(mainDivId,xml); //Call in utils.js

			$eventObj = eventObj;

			$xml = xml;

			renderSwot(xml);

			$( "#closeButton" ).click(function() {
				
				$eventObj.trigger($eventObj.eventVariables.CLEAR_POPUP);

			});


		}

		function renderSwot(xml)
		{
			var pageDataToGive = xml.find("swot").attr("page");

			$swotPageId = pageDataToGive;

			//console.log("Asking for Page Data "+pageDataToGive);


			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotSwotUserData);
			var eventObjToSend = {"pageId":$pageId,"getPageIds":[pageDataToGive]};
			$eventObj.trigger($eventObj.eventVariables.GIVE_PAGE_DATA,eventObjToSend);

		}

		function gotSwotUserData(eventObj)
		{
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotSwotUserData);

				var gotDataObj = eventObj["pagesData"];
				if(gotDataObj)
				{

					gotDataObj = gotDataObj[$swotPageId];

					var swotXml = $xml.find("swot");

					var headsArr = [];

					swotXml.find("heads").children('head').each(function() {

						headsArr[headsArr.length] = $(this).text();

					});

					
					var actUserData = gotDataObj["optionSelData"];

					//console.log("Got User Sel Data "+actUserData);
				

					var headsTh = swotXml.find("heads").attr("tableHeadText");
					var paramsTh = swotXml.find("params").attr("tableHeadText");


					var tds = '<tr">';
					tds = tds+ '<th>'+paramsTh+'</th>';
					tds = tds + '<th>'+headsTh+'</th>';

					tds = tds + '</tr>';

					var count = 0;
					swotXml.find("params").children('param').each(function() {

						var userSel = actUserData[count];

						var gotHeadId = userSel.charAt(0); 
						//console.log("gotHeadId "+gotHeadId);
						


						tds = tds+ '<tr class="tableRow1">';
						tds = tds+ '<td>'+$(this).text()+'</td>';
						tds = tds + '<td>'+headsArr[parseInt(gotHeadId)-1]+'</td>';
						tds = tds + '</tr>';

						count++;

					});
					
					$("#swotTable").append(tds);
				}

			}

			
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/SWOTDisplayPopup/SWOTDisplayPopup.css";
			link.media = 'all';

			//console.log($pageId+" loadTemplateCss MCSSRADIOSWOT "+mainPageDiv);

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
				$('.radioBtn').off();

				var optArr = actData[2];

				$('#'+optArr[0]).addClass( "radioActive" );

			}
			

		}

		
		App.register( {init:init,destroyPage:destroyPage});


})();




