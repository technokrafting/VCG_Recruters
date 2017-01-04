
var App = (function() {

	
	var $ui, $content, $popup, $lastPageObj,$loader;

	var $currentPageXml,$currentPageType;

	var $uiObj;

	var $eventObj,$popupObj;

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

		//loadUI();
	
		
		

		loadPage(getParam('tabId'));
		//loadPage("adams_prof_2");

		//console.log("Title "+getParam('title'));

		var title = getParam('title').toString().replace(/%20/g,' ');

		if(title.indexOf("%27") != -1)
		{
			title = title.replace('%27',"'");
		}
		
		document.title = title;


	});

	function getParam(paramName)
	{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('~');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == paramName) 
			{
				return sParameterName[1];
			}
		}
	}

	function loadUI(){

		$ui.load("ui.html");
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
		//console.log('pages/templates/'+pageType+"/"+pageType+".html");
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

	function savePageData(eventObj)
	{
		var pageId = eventObj["pageId"];
		var pageData = eventObj["pageData"];

		//console.log(pageId+" Saving Page Data "+pageData);

		$pageData[pageId] = pageData;
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


	var registerEventObj = function(eventObj) {
		$eventObj = eventObj;

		$eventObj.registerForEvent($eventObj.eventVariables.LOAD_PAGE,loadPageByEvent);
		$eventObj.registerForEvent($eventObj.eventVariables.LOAD_PAGE_AND_DESTROY_PREVIOUS,loadPageAndDestroyPrevious);
		$eventObj.registerForEvent($eventObj.eventVariables.SAVE_PAGE_DATA,savePageData);
		$eventObj.registerForEvent($eventObj.eventVariables.GIVE_PAGE_DATA,givePageData);

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
			registerPopupObj:registerPopupObj};
	
})();