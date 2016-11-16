
(function() {


		var $pageId;
		var $eventObj;
		var easyResumesArr = [];
		var moderateResumesArr = [];
		var difficultResumesArr = [];
		var resumesChoosen = [];
		var resumesCompleted = [];

		var $navController;

		var totalScore = 0;

		var init = function (xml,navController,eventObj,pageId)
		{

			$navController = navController;
			
			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;


			loadTemplateCss();


			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js


			generateResumes(xml);

			getData();


			var guidelinesId = xml.find('guidelinesPageId').text();
			$('.menu-icon-brochure').on('click',function(){

				var eventObjToSend = {"pageId":guidelinesId};
				$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

			});
		}

		function generateResumes(xml)
		{
			var resumes = xml.find('resumes');
			
			var easyResumes = resumes.find('easy');
			//console.log(easyResumes);
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
			console.log("Get Data Menu");
			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);

			var eventObjToSend = {"pageId":$pageId,"getPageIds":[$pageId]};
			$eventObj.trigger($eventObj.eventVariables.GIVE_PAGE_DATA,eventObjToSend);
		}

		function gotPagesData(eventObj)
		{
			console.log("got Menu Page Data ",eventObj);
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				//console.log("Into If "+eventObj["pagesData"]);

				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);

				var pagesData = eventObj["pagesData"];
				if(pagesData)
				{
					var gotDataObj = pagesData[$pageId];

					resumesChoosen = gotDataObj['resumesChoosen'].split(',');

					$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotResumePagesData);

					var eventObjToSend = {"pageId":$pageId,"getPageIds":[resumesChoosen[0],resumesChoosen[1],resumesChoosen[2],resumesChoosen[3],resumesChoosen[4]]};
					$eventObj.trigger($eventObj.eventVariables.GIVE_PAGE_DATA,eventObjToSend);
				}
				else
				{
					var rand1 = easyResumesArr[Math.floor(Math.random() * easyResumesArr.length)];
					rand1 = 'easy_1';
					
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

					

					resumesChoosen[resumesChoosen.length] = rand1;
					resumesChoosen[resumesChoosen.length] = rand2;
					resumesChoosen[resumesChoosen.length] = rand3;
					resumesChoosen[resumesChoosen.length] = rand4;
					resumesChoosen[resumesChoosen.length] = rand5;

					console.log(resumesChoosen);

					loadResumePage(0);
				}


				saveData();
			}
		}

		function gotResumePagesData(eventObj)
		{
			console.log('gotResumePagesData',eventObj);
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				var pagesData = eventObj["pagesData"];
				if(pagesData)
				{	
					for(var i=0;i<resumesChoosen.length;i++)
					{
						var gotDataObj = pagesData[resumesChoosen[i]];

						if(gotDataObj)
						{
							var resumeScrore = parseInt(gotDataObj['score']);

							totalScore = totalScore + resumeScrore;

							console.log('Setting i '+i);
							$('#resume-'+(i+1)).removeClass('locked');

							if(resumeScrore >= 800 && resumeScrore <= 899)
							{
								$('#resume-'+(i+1)).addClass('star-1');
							}

							if(resumeScrore >= 900 && resumeScrore <= 999)
							{
								$('#resume-'+(i+1)).addClass('star-2');
							}

							if(resumeScrore == 1000)
							{
								$('#resume-'+(i+1)).addClass('star-3');
							}
						}
						
					}

					loadResumePage((Object.keys(pagesData).length));
					
				}
				else
				{
					loadResumePage(0);
				}
				
				

				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotResumePagesData);

			}
		}

		function loadResumePage(index)
		{
			$('#resume-'+(index+1)).removeClass('locked');
				$('#resume-'+(index+1)).click(function() {

					//var eventObjToSend = {"pageId":resumesChoosen[(index)]};
                   // $eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

                    $navController.navigate(resumesChoosen[(index)]);

				});
		}



		function saveData()
		{

			var resumesChoosenStr = resumesChoosen.join();

			var saveObj = {};
			saveObj["resumesChoosen"] = resumesChoosenStr;
			saveObj["totalScore"] = totalScore;

			var eventObjToSend = {"pageId":$pageId,"pageData":saveObj};
			$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);
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
			$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);
			$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotResumePagesData);
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




