(function() {


		var $eventObj;
		var $menuButton0Page = "page1";
		var $menuButton1Page = "page3";
		var $menuButton2Page = "scenerio";
		var $menuButton3Page = "decision_cycle1";
		var $menuButton4Page = "feedback";
		var $quitPopup = "quitPopup";
		
		var $pagesVisited = [];
			
		function init()
		{
				/*$('.menuGeneric').each(function(){
				
					$(this).click(function() {
						$(".menuActive").removeClass( "menuActive" );
						$(this).addClass( "menuActive" );
					});


				});*/

				$('#globalCloseButton').click(function() {
					
						// window.close();
						var eventObjToSend = {"pageId":$quitPopup};
						$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

					});

		}



		
		function assignAllNormalCss(clickedObj)
		{
			$('.menuGeneric').each(function(){
				
				if(clickedObj.is($(this)) == false)
					$(this).removeClass( "menuActive" );

			});
		}


		init();

		function setMenuActive(eventObj)
		{
			var menuName = eventObj["menuName"];
			$(".menuActive").removeClass( "menuActive" );
			$('#'+menuName).addClass( "menuActive" );
			$('#'+menuName).removeClass( "menuVisited" );
		}

		function decisionScreenLoaded(eventObj)
		{
			
			var pageId = eventObj["pageId"];
			//console.log("decisionScreenLoaded "+pageId);


			$menuButton3Page = pageId;


			$pagesVisited = [];
			$pagesVisited[$pagesVisited.length] = 'menuButton0';
			$pagesVisited[$pagesVisited.length] = 'menuButton1';
			$pagesVisited[$pagesVisited.length] = 'menuButton2';
			$pagesVisited[$pagesVisited.length] = 'menuButton3';

			//$pagesVisited.splice(3, 1);
			$('#menuButton4').off();
		}

		function feedbackScreenLoaded(eventObj)
		{
			//console.log("Before Loop");
			$('#menuButton0').off();
			$('#menuButton1').off();
			$('#menuButton2').off();
			$('#menuButton3').off();
			$('#menuButton4').off();

			for(i=0;i<$pagesVisited.length;i++)
			{
				//console.log("Offing ");
				////console.log("Offing "+$pagesVisited[i].attr('id'));
				$('#'+$pagesVisited[i]).off();
				$('#'+$pagesVisited[i]).removeClass( "menuVisited" );
			}

			//console.log("feedbackScreenLoaded "+$pagesVisited.length);
			

			
		}

		function pageLoaded(eventObj){


			var pageId = eventObj["pageId"];

			//console.log("pageLoaded UI "+pageId);

			if(pageId == "feedback")
			{
				return;
			}

			var add = 0;
			var btn;

			switch(pageId)
			{

				case $menuButton0Page:

					btn = 'menuButton0';

					add = 1;

				break;
				case $menuButton1Page:

					btn = 'menuButton1';

					add = 1;

				break;
				case $menuButton2Page:

					btn = 'menuButton2';

					add = 1;

				break;
				case $menuButton3Page:

					btn = 'menuButton3';

					add = 1;

				break;
				case $menuButton4Page:

					btn = 'menuButton4';

					add = 1;

				break;
			}


			if(add == 1)
			{
				if($pagesVisited.indexOf(btn) == -1)
				{
					$pagesVisited[$pagesVisited.length] = btn;
				}

				for(i=0;i<$pagesVisited.length;i++)
				{
					if(btn != $pagesVisited[i])
					{
						$('#'+$pagesVisited[i]).addClass( "menuVisited" );
					}

					$('#'+$pagesVisited[i]).off();
					$('#'+$pagesVisited[i]).on();

					$('#'+$pagesVisited[i]).click(function() {
						

						var loadPageId;
						switch($(this).attr('id'))
						{
							case 'menuButton0':

								loadPageId = $menuButton0Page;

							break;

							case 'menuButton1':

								loadPageId = $menuButton1Page;

							break;
							case 'menuButton2':

								loadPageId = $menuButton2Page;

							break;
							case 'menuButton3':

								loadPageId = $menuButton3Page;

							break;
							case 'menuButton4':

								loadPageId = $menuButton4Page;


							break;
						}


						var eventObjToSend = {"pageId":loadPageId};
						$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE_AND_DESTROY_PREVIOUS,eventObjToSend);

					});

						

				}
			}

			

		};

		function loadDecisionScreen(event)
		{
			//console.log("loadDecisionScreen ");
			var eventObjToSend = {"pageId":$menuButton3Page};
			$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE_AND_DESTROY_PREVIOUS,eventObjToSend);
		}

		function setEventObj(obj)
		{
			$eventObj = obj;
			$eventObj.registerForEvent($eventObj.eventVariables.SET_MENU_ACTIVE,setMenuActive);
			$eventObj.registerForEvent($eventObj.eventVariables.PAGE_LOADED,pageLoaded);
			$eventObj.registerForEvent($eventObj.eventVariables.INIT_DECISION_SCREEN,decisionScreenLoaded);
			$eventObj.registerForEvent($eventObj.eventVariables.FEEDBACK_SCREEN_LOADED,feedbackScreenLoaded);
			$eventObj.registerForEvent($eventObj.eventVariables.LOAD_LATEST_DECISION_SCREEN,loadDecisionScreen);
		}

		App.registerUiObj( {setEventObj:setEventObj});

})();




