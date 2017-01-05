
(function() {


		var $pageId;
		var $eventObj;

		var init = function (xml,navController,eventObj,pageId)
		{

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;
			loadTemplateCss();

			

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js

			$eventObj = eventObj;

			
			loadData(xml);
			
			
			$( "#closeButton" ).click(function() {
				
				//var eventObjToSend = {"pageId":$pageId};
				//$eventObj.trigger($eventObj.eventVariables.CLEAR_POPUP,eventObjToSend);
				window.close();

			});

		}

		function loadData(xml)
		{
			var pageId = xml.find('dataPageId').text();

			var xmlPath = "pages/"+pageId+"/"+pageId+".xml";
			//console.log("xmlPath "+xmlPath);
			loadAndParseXml(xmlPath,pageXmlLoaded,pageId,null);
		}

		function pageXmlLoaded(xml,pageId,callback)
		{	
			var pageNode = xml.find("page");
			var bodyText = pageNode.find('body');

			////console.log(bodyText.html());
			$('#popupHeader').html(bodyText.text());
			
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/profileInfoScreen/profileInfoScreen.css";
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


		function destroyPage()
		{
			//console.log("Into Page Destroy");
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




