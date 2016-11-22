
var App = (function() {

	
	var $ui, $content, $popup, $lastPageObj,$loader, $api;

	var $currentPageXml,$currentPageType;

	var $uiObj;

	var $eventObj,$popupObj, $audioObj;

	var $currentPageId,$lastPageLoadedId;

	var $currentLoadedPageType;

	var $scoreHm = {};

	var $pageData = {};

	$(document).ready(function() {

		$ui = $("#ui");
		$content = $("#content");
		$popup = $("#popup");
		$loader = $("#loader");

		//console.log("Got Popup Obj "+$popup);

		loadUI();
		

	});

	function loadUI(){

		//Disabled as there is no UI required
		// $ui.load("ui.html",function(){

		// 			loadPage("page1");

		// 		});

		loadPage("page1");
		

	}

	function pageXmlLoaded(xml,pageId,callback)
	{	
		$currentPageXml = xml;
		var pageNode = xml.find("page");
		var loadIn = xml.find("page").attr("loadIn");

		$currentLoadedPageType = loadIn;
		
		$lastPageLoadedId = pageId;
		//console.log(pageId+" Page Loading "+loadIn);

		switch(loadIn)
		{
			case undefined:
				//console.log("Into undefined Loading");
				$currentPageId = pageId;
				$currentPageType = pageNode.attr("type");
				
				$content.load('pages/templates/'+$currentPageType+"/"+$currentPageType+".html",function(){

					var eventObjToSend = {"pageId":pageId};
		            $eventObj.trigger($eventObj.eventVariables.PAGE_LOADED,eventObjToSend);

		            $content.fadeIn(1000);
					$loader.hide();

				});


				return;
		}

		var pageType = pageNode.attr("type");
		$('#'+$currentLoadedPageType).load('pages/templates/'+pageType+"/"+pageType+".html",function(){

			if(callback)
			{
				callback(pageId);
				var eventObjToSend = {"pageId":pageId};
		        $eventObj.trigger($eventObj.eventVariables.PAGE_LOADED,eventObjToSend);

		       
			}

			$loader.hide();
			$('#'+$currentLoadedPageType).fadeIn(1000);
			

		});

		//$('#'+$currentLoadedPageType).show();
		
		
	}


	function loadPageAndDestroyPrevious(eventObj)
	{
		//console.log("loadPageAndDestroyPrevious "+eventObj["pageId"]);
		var pageId = eventObj["pageId"];
		navigate(pageId);
	}



	function loadPage(pageId,callback)
	{
		var xmlPath = "pages/"+pageId+"/"+pageId+".xml";
		//console.log("xmlPath "+xmlPath);
		loadAndParseXml(xmlPath,pageXmlLoaded,pageId,callback);
	}

	function loadPageByEvent(eventObj)
	{
		$loader.show();

		//console.log(" loadPopup "+eventObj);
		var pageId = eventObj["pageId"];
		var pageLoadedCallback = eventObj["callback"];
		loadPage(pageId,pageLoadedCallback);
	}

	function takePageDataFromBookmark(eventObj)
	{
		$pageData = eventObj['pagesData'];

		delete $pageData["decision_cycle1"];
		delete $pageData["decision_cycle1_res"];
		delete $pageData["decision_cycle2"];
		delete $pageData["decision_cycle2_res"];

	}


	function givePageDataForBookmark()
	{
		eventObjToSend = {"pagesData":$pageData};
		//console.log("Got Pages Data");
		//console.log(JSON.stringify($pageData));

		$eventObj.trigger($eventObj.eventVariables.TAKE_PAGE_DATA_FOR_BOOKMARK,eventObjToSend);
	}

	function savePageData(eventObj)
	{
		var pageId = eventObj["pageId"];
		var pageData = eventObj["pageData"];

		$pageData[pageId] = pageData;

		givePageDataForBookmark();

	}

	function givePageData(eventObj)
	{
		var toSendObj = {};

		var senderPageId = eventObj["pageId"];
		var pageDataArr = eventObj["getPageIds"];

		//console.log("givePageData "+senderPageId);
		//console.log(pageDataArr);

		for(i=0;i<pageDataArr.length;i++)
		{
			var pageId = pageDataArr[i];

			//console.log(pageId+" Checking Page for Data "+$pageData[pageId]);

			if($pageData[pageId])
			{
				toSendObj[pageId] = $pageData[pageId];
			}
		}


		var lengthOfData = Object.keys(toSendObj).length;

		var eventObjToSend;

		if(lengthOfData == 0)
		{
			eventObjToSend = {"pageId":senderPageId,"pagesData":undefined};
		}
		else
		{
			eventObjToSend = {"pageId":senderPageId,"pagesData":toSendObj};
		}

		$eventObj.trigger($eventObj.eventVariables.TAKE_PAGE_DATA,eventObjToSend);

	}

	var register = function(pageObj) {
		//console.log("Page Registration ");
		
		switch($currentLoadedPageType)
		{
			case undefined:
				$lastPageObj = pageObj;
			break;

		}
				
		pageObj.init($currentPageXml,controller,$eventObj,$lastPageLoadedId);
	};


	var registerUiObj = function(uiObj) {
		$uiObj = uiObj;
		$uiObj.setEventObj($eventObj);

	};

	var registerPopupObj = function(popupObj){

		//console.log("Registering popup "+$("#popup"));
			
		$("#popup").hide();
		popupObj.init($("#popup"),$eventObj);
	}

	var registerApiObj = function(apiObj){

		$api = apiObj;
		$api.init($eventObj);
	}

	var registerAudioObj = function(audioObj){

		$audioObj = audioObj;
		$api.init($eventObj);
	}


	var registerEventObj = function(eventObj) {
		$eventObj = eventObj;

		$eventObj.registerForEvent($eventObj.eventVariables.LOAD_PAGE,loadPageByEvent);
		$eventObj.registerForEvent($eventObj.eventVariables.LOAD_PAGE_AND_DESTROY_PREVIOUS,loadPageAndDestroyPrevious);
		$eventObj.registerForEvent($eventObj.eventVariables.SAVE_PAGE_DATA,savePageData);
		$eventObj.registerForEvent($eventObj.eventVariables.GIVE_PAGE_DATA,givePageData);
		$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGES_DATA_FROM_BOOKMARK,takePageDataFromBookmark);
		
		//console.log("registerEventObj "+ $eventObj);

	};

	


	var setMenuActive = function(menuName){
		$uiObj.setMenuActive(menuName);
	};


	var navigate = function(pageId) {

		//console.log($lastPageObj+" Into Navigate ");

		$loader.fadeIn(1000);

		if($lastPageObj) {
			destroyPage(function() {
				loadPage(pageId);
			});
		}
		else {
			loadPage(pageId);
		}
	};

	var destroyPage = function(callback) {

		//console.log("destroyPage");

		$content.fadeOut(function() {
				if($lastPageObj)
					$lastPageObj.destroyPage();

				$content.removeClass().empty();
				$lastPageObj = null;
				callback();
			});
	};
	

	var controller = {navigate: navigate};


	return {register: register,
			registerUiObj: registerUiObj,
			registerEventObj: registerEventObj,
			registerPopupObj:registerPopupObj,
			registerApiObj:registerApiObj};
	
})();

var $consoleArr = [];
function addToConsole(str)
{
	$consoleArr[$consoleArr.length] = str;
}
function showConsole()
{
	for(i=0;i<$consoleArr.length;i++)
	{
		//console.log($consoleArr[i]);
	}
}

function clearConsole()
{
	$consoleArr = [];
}

$('#globalConsoleButton').click(function() {

	//$content.removeClass().empty();
	$('#popup').removeClass().empty();

	//$('#popup').append("<div id=consoleDiv>")

	var divStr = "<div id=consoleDiv>";
	var consoleStr = "";
	for(i=0;i<$consoleArr.length;i++)
	{
		consoleStr = consoleStr + $consoleArr[i] + "~";

		divStr = divStr + $consoleArr[i]+"<br/>";
		
	}

	

	//console.log(divStr);

	//$('#popup').append(divStr);
	//window.open("console.html?"+consoleStr,'_blank');
	$('#popup').fadeIn(1000);	

	var str = '<div id="consoleClose" class="nextButton"><span id="nextButton" class="nextButtonText">Close</span></div>';
	divStr = divStr + str;
	//$('#popup').append(str);

	divStr = divStr + "</div>";

	$('#popup').append(divStr);

	$('#consoleClose').click(function() {

		$('#popup').fadeOut(1000);

	});

	//$('#popup').append('</div>');


});