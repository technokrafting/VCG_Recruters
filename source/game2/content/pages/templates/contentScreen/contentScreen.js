
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

			parseComponents(xml);

			
			
			
		}

		function parseComponents(xml)
		{
			var components = xml.find('components');
			components.children('bg').each(function() 
			{
				var compId = $(this).attr('id');

				var div = '<div id='+compId+'></div>';

				$('#tabContent #body').append(div);
			});
			
			components.children('text').each(function() 
			{
				var textName = $(this).text();
				var compId = $(this).attr('id');
				var classList= $(this).attr('class');
				var div = '<div id='+compId+' class='+classList+'>'+textName+'</div>';

				$('#tabContent #body').append(div);
			});

			
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/contentScreen/contentScreen.css";
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




