
(function() {


		var $pageId;
		var $eventObj;
		var easyResumesArr = [];
		var moderateResumesArr = [];
		var difficultResumesArr = [];
		var resumesChoosen = [];
		var resumesCompleted = [];

		var init = function (xml,navController,eventObj,pageId)
		{


			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;


			loadTemplateCss();


			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js


			generateResumes(xml);

			getData();
		}

		function generateResumes(xml)
		{
			var resumes = xml.find('resumes');
			
			var easyResumes = resumes.find('easy');
			console.log(easyResumes);
			easyResumes.children('resume').each(function() 
			{
				easyResumesArr[easyResumesArr.length] = $(this).attr('pageId');
				//console.log('Easy Resumes', $(this).attr('pageId'));

			});

			var moderateResumes = resumes.find('moderate');
			moderateResumes.children('resume').each(function() 
			{
				moderateResumesArr[moderateResumesArr.length] = $(this).attr('pageId');
				//console.log('Easy Resumes', $(this).attr('pageId'));

			});


			var difficultResumes = resumes.find('difficult');
			difficultResumes.children('resume').each(function() 
			{
				difficultResumesArr[difficultResumesArr.length] = $(this).attr('pageId');
				//console.log('Easy Resumes', $(this).attr('pageId'));

			});

		}

		function getData()
		{
			//console.log("Get Data Feedback");
			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);

			var eventObjToSend = {"pageId":$pageId,"getPageIds":[$pageId]};
			$eventObj.trigger($eventObj.eventVariables.GIVE_PAGE_DATA,eventObjToSend);
		}

		function gotPagesData(eventObj)
		{
			//console.log("gotPagesData "+eventObj);
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				//console.log("Into If "+eventObj["pagesData"]);

				//$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);

				var pagesData = eventObj["pagesData"];
				if(pagesData)
				{
					

				}
				else
				{
					var rand1 = easyResumesArr[Math.floor(Math.random() * easyResumesArr.length)];
					var rand2 = easyResumesArr[Math.floor(Math.random() * easyResumesArr.length)];
					while(rand2 == rand1)
					{
						rand2 = easyResumesArr[Math.floor(Math.random() * easyResumesArr.length)];
					}

					var rand3 = moderateResumesArr[Math.floor(Math.random() * moderateResumesArr.length)];
					var rand4 = moderateResumesArr[Math.floor(Math.random() * moderateResumesArr.length)];
					while(rand4 == rand3)
					{
						rand4 = moderateResumesArr[Math.floor(Math.random() * moderateResumesArr.length)];
					}
					var rand5 = difficultResumesArr[Math.floor(Math.random() * difficultResumesArr.length)];

					console.log(rand1,rand2,rand3,rand4,rand5);

					rand1 = 'easy_1';

					resumesChoosen[resumesChoosen.length] = rand1;
					resumesChoosen[resumesChoosen.length] = rand2;
					resumesChoosen[resumesChoosen.length] = rand3;
					resumesChoosen[resumesChoosen.length] = rand4;
					resumesChoosen[resumesChoosen.length] = rand5;

					console.log(resumesChoosen);
				}

				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);

				loadPageEntities();
			}
		}

		function loadPageEntities()
		{
			if(resumesCompleted.length == 0)
			{
				$('#resume-1').removeClass('locked');
				$('#resume-1').click(function() {

					var eventObjToSend = {"pageId":resumesChoosen[0]};
                    $eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

				});
			}

		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/menuScreen/menuScreen.css";
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




