
(function() {


		var $pageId;
		var $eventObj;

		var $visitedStateArr = [];
		var $visitedPageIdArr = [];

		var $currentPageId;

		var init = function (xml,navController,eventObj,pageId)
		{

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;
			
			loadTemplateCss();


			$eventObj.registerForEvent($eventObj.eventVariables.DESTROY_POPUP,destroyPage);


			$eventObj.registerForEvent($eventObj.eventVariables.DESTROY_PAGE,destroyPageEvent);

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js

			

				
			loadTabModel(xml);
			
			
			$( "#closeButton" ).click(function() {
				
				//$eventObj.trigger($eventObj.eventVariables.DESTROY_POPUP);
				//$eventObj.trigger($eventObj.eventVariables.CLEAR_POPUP);

				window.close();
				

			});

			getData();

			

		}

		function loadTabModel(xml)
		{
			var tabs = xml.find('tabs');
			tabs.children('tab').each(function() {

				var pageId = $(this).attr('pageId');
				var tabText = $(this).text();

				var div = '<div class="tab" id=tab_'+pageId+' pageId='+pageId+'><div class="tabImg"><span class="tabText">'+tabText+'</span></div></div>';

				$("#mainPageDiv_"+$pageId+" #tabList").first().append(div);				
			});


			$("#mainPageDiv_"+$pageId+" #tabList").first().find('.tab').click(function() {
				
				var pageId = $(this).attr('pageId');

				$("#mainPageDiv_"+$pageId+" #tabList").first().find('.tabImg').removeClass('tabActive');


				$('#tab_'+pageId+' .tabImg').addClass('tabVisited');

				$('#tab_'+pageId+' .tabImg').addClass('tabActive');


				if($currentPageId)
				{
					var eventObjToSend = {"destroyPageId":$currentPageId};
					$eventObj.trigger($eventObj.eventVariables.DESTROY_PAGE,eventObjToSend);

				}

				$currentPageId = pageId;

				var eventObjToSend = {"pageId":pageId};

				$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);


				if($visitedStateArr.indexOf(pageId) == -1)
				{
					$visitedStateArr[$visitedStateArr.length] = $('#tab_'+pageId);
					$visitedPageIdArr[$visitedPageIdArr.length] = pageId;
				}

			
				//setVisited();
			});

			$("#mainPageDiv_"+$pageId+" #tabList").first().find('.tab')[0].click();
		}


		
		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/tabInfoScreenPopup/tabInfoScreenPopup.css";
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
			{
				link.href = "pages/"+$pageId+"/"+$pageId+".css";
				//console.log(isAvailable+" Css Set "+link.href);
				link.media = 'all';
				mainPageDiv.appendChild(link);
			}
				
			

		}

		function destroyPageEvent(eventObj)
		{
			var pageId = eventObj["destroyPageId"];

			if(pageId == $pageId)
			{
				$eventObj.unRegisterEvent($eventObj.eventVariables.DESTROY_PAGE,destroyPageEvent);

				destroyPage(null);
			}
		}


		function destroyPage(eventPage)
		{

			$eventObj.unRegisterEvent($eventObj.eventVariables.DESTROY_POPUP,destroyPage);

			$eventObj.trigger($eventObj.eventVariables.DESTROY_POPUP);


			//console.log("Into Page Destroy tabInfoScreen");
			saveData();
		}

		function saveData()
		{

			
			var actData = {};

			actData["clicks"] = $visitedPageIdArr;

			var eventObjToSend = {"pageId":$pageId,"pageData":actData};
			$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);

			
		}

		function getData()
		{
			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPageData);
			var eventObjToSend = {"pageId":$pageId,"getPageIds":[$pageId]};
			$eventObj.trigger($eventObj.eventVariables.GIVE_PAGE_DATA,eventObjToSend);
		}

		function gotPageData(eventObj)
		{
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPageData);

				var gotDataObj = eventObj["pagesData"];
				if(gotDataObj)
				{
					gotDataObj = gotDataObj[$pageId];

					//console.log("Got Page Data TabInfoScreen ");
					
					$visitedPageIdArr = gotDataObj["clicks"];

					//console.log($visitedPageIdArr);


					for(i=0;i<$visitedPageIdArr.length;i++)
					{
						$('#tab_'+$visitedPageIdArr[i]+' .tabImg').addClass('tabVisited');
						$visitedStateArr[$visitedStateArr.length] = $('#tab_'+$visitedPageIdArr[i]);
					}

				}
			}
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




