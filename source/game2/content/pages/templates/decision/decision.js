
(function() {


		var $pageId;
		var $eventObj;
		var $scoreHm = {};
		var $actSelHm = {};
		var $competencyHm = {};
		var $quesHm = {};
		var $currentPageId,$currentPageIndex;
		var $submitBtn;
		var $nextBtn, $backBtn;
		var $simpleQuestionArr = [];
		var $questionValueBtnArr = [];
		var $lastPendingActivityIndex;
		var $clickableDivId = [];
		var $feedbackPage;
		var $pageParentDivInfo = {};

		var init = function (xml,navController,eventObj,pageId)
		{

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;


			$pageId = pageId;	
			loadTemplateCss();


			$feedbackPage = xml.find('page').attr('feedbackPageId');

			
			renderTextElements(mainDivId,xml,eventObj); //Call in utils.js

			$eventObj = eventObj;
			
			
			$submitBtn = $( "#submitBtn" );
			$nextBtn = $('#nextBtn');
			$backBtn = $('#backBtn');

			$eventObj.registerForEvent($eventObj.eventVariables.ENABLE_DECISION_SUBMIT,enableSubmitButton);
			$eventObj.registerForEvent($eventObj.eventVariables.DISABLE_DECISION_SUBMIT,disableSubmitButton);
			$eventObj.registerForEvent($eventObj.eventVariables.DISPATCH_ACTIVITY_DATA,gotActivityData);
			$eventObj.registerForEvent($eventObj.eventVariables.NEED_ACTIVITY_USER_DATA,giveActivityUserData);


			loadValueButtons(xml);

			loadQuestionsModel(xml);

			$currentPageIndex = 0;
			
			getData();

			var eventObjToSend = {"pageId":$pageId}; //Doing this here as, next back button need destroy
			$eventObj.trigger($eventObj.eventVariables.INIT_DECISION_SCREEN,eventObjToSend);

		}

		function loadValueButtons(xml)
		{
			var valueBtns = xml.find('valueBtns');

			valueBtns.children('button').each(function() 
			{

				var id=$(this).attr('id');
				var pageId=$(this).attr('pageId');
				var openIn=$(this).attr('openIn');
				var classStr=$(this).attr('class');
				var text=$(this).text();

				if(!classStr)
				{
					classStr = "";
				}

				var div = "";
				if(openIn)
				{
					div = '<div id=valueBtn'+id+' openIn='+openIn+' pageId='+pageId+' class="valueButton"><span class="valueButtonText '+classStr+'">'+text+'</span></div>';
				}
				else
				{
					div = '<div id=valueBtn'+id+' pageId='+pageId+' class="valueButton"><span class="valueButtonText '+classStr+'">'+text+'</span></div>';
				}
				
				$('#valueButtons').append(div);

			});

			$('.valueButton').click(function() {

				var pageId = $(this).attr('pageId');
				var openIn = $(this).attr('openIn');

				var eventObjToSend  = {"pageId":pageId};
				if(openIn == "tab")
				{
					window.open("tabs/launcher.html?tabId="+pageId+"~title="+$(this).text(), "launcherTab", "width=1022, height=592,resizable=no");
				}
				else if(openIn == "window")
				{
					window.open("docs/"+pageId, "launcherTab");
				}
				else
				{
					$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);
				}
                


			});


		}

		function loadQuestionsModel(xml){


			var $numDiv = $('#quesNum');

			//console.log("Loading Questions Model");
			var mainQuesCount = 0;
			var startCountFrom = 0;

			var startNumberFrom = xml.find('page').attr('startNumberFrom');

			//console.log("Got startNumberFrom "+startNumberFrom);

			if(startNumberFrom)
			{
				startCountFrom = parseInt(startNumberFrom);
			}
			else
			{
				startCountFrom = 1;
			}
			
			//console.log("Over "+startNumberFrom);

			var questionPages = xml.find('questionPages');

			questionPages.children('questionPage').each(function() 
			{

				var questionIdArr = [];


				var divStr = '<div id=nav_'+(mainQuesCount+1)+' class="mainNum" type=main><span class="mainNumText">'+(startCountFrom)+'</span>';

				var subDivStr;
				var questionCount = $(this).children('question').length;
				if(questionCount == 1)
				{
					divStr = divStr + '</div>';

				}
				else
				{
					subDivStr = '<div class="sub" id=subNav_'+(mainQuesCount+1)+'>';
				}


				var firstPageId;

				var counter = 0;
				$(this).children('question').each(function() 
				{

					counter++;

					var quesId = $(this).text();
					var valueBtnStr = $(this).attr('valueBtnStr');
					//console.log("Loading Question "+quesId);
					questionIdArr[questionIdArr.length] = quesId;

					$simpleQuestionArr[$simpleQuestionArr.length] = quesId;
					$questionValueBtnArr[$questionValueBtnArr.length] = valueBtnStr;

					$pageParentDivInfo[quesId] = 'nav_'+(mainQuesCount+1);


					if(questionCount == 1)
					{
						
					}
					else
					{
						subDivStr = subDivStr + '<div id=sub_'+quesId+' parentDiv=nav_'+(mainQuesCount+1)+' class="subLink" pageId='+quesId+' type=sub></div>';
						$clickableDivId[$clickableDivId.length] = 'sub_'+quesId;
					}

					if(counter == 1)
					{
						firstPageId = quesId;
					}
					
					
				});


				$numDiv.append(divStr);

				if(questionCount == 1)
				{
					
					$('#nav_'+(mainQuesCount+1)).attr('pageId',firstPageId);
					$clickableDivId[$clickableDivId.length] = 'nav_'+(mainQuesCount+1);

				}
				else
				{
					subDivStr = subDivStr + '</div>';

					$('#subNavDiv').append(subDivStr);

					$('#nav_'+(mainQuesCount+1)).attr('pageId',firstPageId);

				}


			$quesHm["questionGroup_"+mainQuesCount] = questionIdArr;
			mainQuesCount++;
			startCountFrom++;

			
				
			});


		}

		function loadQuestion()
		{


			var eventObjToSend = {"pageId":$currentPageId}; //Doing this here as, next back button need destroy
			$eventObj.trigger($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,eventObjToSend);
			
			var mainCount = -1

			var mainLength = Object.keys($quesHm).length;
			//console.log(mainLength);
			for(i=0;i<mainLength;i++)
			{
				var questionIdArr = $quesHm["questionGroup_"+i];
				for(j=0;j<questionIdArr.length;j++)
				{
					mainCount++;
					if(mainCount == $currentPageIndex)
					{
						var quesPageId = questionIdArr[j];

						var indexOfNewPage = $simpleQuestionArr.indexOf(quesPageId);
						if($lastPendingActivityIndex)
						{
							if(indexOfNewPage > $lastPendingActivityIndex)
								$lastPendingActivityIndex = indexOfNewPage;
						}
						else
						{
							$lastPendingActivityIndex = indexOfNewPage;
						}
						

						$currentPageId = quesPageId;

						//console.log("Triggering Load "+quesPageId);


						
						$('#mainPageDiv_'+$pageId).hide();
						
						var eventObjToSend = {"pageId":quesPageId,"callback":onActivityPageLoaded};
						$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

						checkNextBackBtn(quesPageId);
						updateMainNavButtons();



						$('.valueButton').hide();
						var valueBtnStr = $questionValueBtnArr[indexOfNewPage];
						var valueBtnStrArr = valueBtnStr.split(',');
						for(m=0;m<valueBtnStrArr.length;m++)
						{
							$('#valueBtn'+valueBtnStrArr[m]).show();
						}


						var divName = $clickableDivId[indexOfNewPage];

						//console.log("Got Div Id "+divName);

						var patt = new RegExp("nav");
						var res = patt.test(divName);

						if(res == false)
						{
							var parentDiv = $('#'+divName).attr('parentDiv');
							$('#'+parentDiv).addClass('mainNumActive');

							$('#'+divName).addClass('active');
							$('#'+divName).parent().show();

						
						}
						else
						{
							$('#'+divName).addClass('mainNumActive');
						}

						$('#howToProceedBtn').off();
						$('#howToProceedBtn').on();
						$('#howToProceedBtn').click(function() {

							 var eventObjToSend = {"pageId":$currentPageId+"_popup"};
                    		 $eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);


						});

					
						return;

					}
				}

			}
		}

		function popupClosed(eventObj)
		{
			//console.log("Into Popup Closed Decision ");

			$('#mainPageDiv_'+$pageId).removeClass("deactivate");
			$('#mainPageDiv_'+$pageId).show();

			$eventObj.unRegisterEvent($eventObj.eventVariables.CLEAR_POPUP,popupClosed);
		}

		function checkNextBackBtn(questionId)
		{

			
			var indexOfQues = $simpleQuestionArr.indexOf(questionId);
			var nextId = $simpleQuestionArr[indexOfQues+1];
			var prevId = $simpleQuestionArr[indexOfQues-1];

			var questionParentDiv = $pageParentDivInfo[questionId];
			var nextParentDiv = $pageParentDivInfo[nextId];
			var prevParentDiv = $pageParentDivInfo[prevId];

			//console.log($lastPendingActivityIndex+" checkNextBackBtn "+(indexOfQues+1));
			//console.log(prevId+" Got Pages "+nextId)

			if($lastPendingActivityIndex == (indexOfQues+1))
			{
				setNextBtn(true);

				if(nextParentDiv == questionParentDiv)
				{
					setNextBtn(true);
				}
				else
				{
					setNextBtn(false);
				}
			}
			else if($actSelHm["actSel_"+nextId])
			{
				if(nextParentDiv == questionParentDiv)
				{
					setNextBtn(true);
				}
				else
				{
					setNextBtn(false);
				}
				
			}
			else
			{
				setNextBtn(false);
			}


			if($actSelHm["actSel_"+prevId])
			{
				if(prevParentDiv == questionParentDiv)
				{
					setBackBtn(true);
				}
				else
				{
					setBackBtn(false);
				}
			}	
			else
			{
				setBackBtn(false);
			}

		}

		function setNextBtn(status)
		{
			//console.log("setNextBtn "+status);

			if(status == true)
			{
				$nextBtn.off();
				$nextBtn.on();
				$nextBtn.click(function() {

					$currentPageIndex++;
					loadQuestion();

				});

				$nextBtn.removeClass( "nextBtnDisabled" );

			}
			else
			{
				$nextBtn.addClass( "nextBtnDisabled" );
				$nextBtn.off();
			}
		}

		function setBackBtn(status)
		{
			if(status == true)
			{
				$backBtn.off();
				$backBtn.on();
				$backBtn.click(function() {

					$currentPageIndex--;
					loadQuestion();

				});

				$backBtn.removeClass( "backBtnDisabled" );

			}
			else
			{
				$backBtn.addClass( "backBtnDisabled" );
				$backBtn.off();

			}
		}

		function updateMainNavButtons()
		{

			var parentIdArr = [];
			var lastParentId;

			for(i=0;i<=$lastPendingActivityIndex;i++)
			{
				var divName = $clickableDivId[i];
				$('#'+divName).off();
				$('#'+divName).on();

				$('#'+divName).addClass("numClickable");

				$('#'+divName).click(function() {

					var pageId = $(this).attr('pageId');
					var indexOfPage = $simpleQuestionArr.indexOf(pageId);

					if($actSelHm["actSel_"+pageId] || indexOfPage == $lastPendingActivityIndex)
					{
						$currentPageIndex = indexOfPage;
						//console.log("Triggering from NumClickable "+pageId);
						loadQuestion();
					}

				});

				var patt = new RegExp("nav");
				var res = patt.test(divName);


				var gotParentId;

				if(res == false)
				{

					gotParentId = $('#'+divName).attr('parentDiv');

					$('#'+gotParentId).off();
					$('#'+gotParentId).on();

					$('#'+gotParentId).addClass("numClickable");
							
					$('#'+gotParentId).click(function() {

						//console.log("On Main Click ");

						var pageId = $(this).attr('pageId');
						var indexOfPage = $simpleQuestionArr.indexOf(pageId);

						if($actSelHm["actSel_"+pageId] || indexOfPage == $lastPendingActivityIndex)
						{
							$currentPageIndex = indexOfPage;
							//console.log("Triggering from NumClickable "+pageId);
							loadQuestion();
						}

					});
				}
				else
				{
					gotParentId = $('#'+divName).attr('id');
				}

				if(i == $lastPendingActivityIndex)
				{
					lastParentId = gotParentId;
				}

				if(parentIdArr.indexOf(gotParentId) == -1)
				{
					parentIdArr[parentIdArr.length] = gotParentId;
				}
			}

			$('.mainNum').removeClass("mainNumActive");
			$('.subLink').removeClass("active");
			$('.subLink').parent().hide();


			for(i=0;i<parentIdArr.length;i++)
			{
				var parentId = parentIdArr[i];
				if(parentId != lastParentId)
				{
					$('#'+parentId).addClass('mainComplete');
				}
			}

			var currentPageParentDiv;
			var currentPageDivName = $clickableDivId[$currentPageIndex];
			var patt = new RegExp("nav");
			var res = patt.test(currentPageDivName);
			if(res == false)
			{
				currentPageParentDiv = $('#'+currentPageDivName).attr('parentDiv');
			}
			else
			{
				currentPageParentDiv = $('#'+currentPageDivName).attr('id');
			}

			$('#'+lastParentId).removeClass("mainComplete");
			$('#'+currentPageParentDiv).removeClass("mainComplete");


			
		}

		function enableSubmitButton(eventObj)
		{
			//console.log(" enableSubmitButton ");

			$submitBtn.off();

			$submitBtn.on();
			$submitBtn.click(function() {



				var eventObjToSend = {"pageId":$currentPageId};
				$eventObj.trigger($eventObj.eventVariables.REQUEST_ACTIVITY_DATA,eventObjToSend);

				
				$currentPageIndex++;

				if($currentPageIndex == $simpleQuestionArr.length)
				{
					
					var eventObjToSend = {"pageId":$currentPageId};
					$eventObj.trigger($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,eventObjToSend);

					 var eventObjToSend = {"pageId":$feedbackPage};
                     $eventObj.trigger($eventObj.eventVariables.LOAD_PAGE_AND_DESTROY_PREVIOUS,eventObjToSend);

				}
				else
				{

					loadQuestion();
				}
				

			});

			$submitBtn.removeClass( "submitDisabled" );
			
		}

		function disableSubmitButton(eventObj)
		{
			////console.log($submitBtn.prop('disabled'));
			$submitBtn.off();
			$submitBtn.addClass( "submitDisabled" );

			////console.log(" disableSubmitButton "+$submitBtn.prop('disabled'));
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/decision/decision.css";
			link.media = 'all';
			mainPageDiv.appendChild(link);

			checkFile("pages/"+$pageId+"/"+$pageId+".css",cssCallback);


		}

		function cssCallback(isAvailable)
		{
			var mainPageDiv = document.getElementById('mainPageDiv_'+$pageId);
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

			//console.log("Into Page Destroy Decision "+$pageId);

			$eventObj.unRegisterEvent($eventObj.eventVariables.ENABLE_DECISION_SUBMIT,enableSubmitButton);
			$eventObj.unRegisterEvent($eventObj.eventVariables.DISABLE_DECISION_SUBMIT,disableSubmitButton);
			$eventObj.unRegisterEvent($eventObj.eventVariables.DISPATCH_ACTIVITY_DATA,gotActivityData);
			$eventObj.unRegisterEvent($eventObj.eventVariables.NEED_ACTIVITY_USER_DATA,giveActivityUserData);
			$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPageData);
			$eventObj.unRegisterEvent($eventObj.eventVariables.CLEAR_POPUP,popupClosed);
			
			saveData();

			$('#mainPageDiv_'+$pageId).removeClass("deactivate");
			
			var eventObjToSend = {"pageId":$currentPageId};
			$eventObj.trigger($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,eventObjToSend);

			var eventObjToSend = {"pageId":$pageId};
			$eventObj.trigger($eventObj.eventVariables.HIDE_POPUP,eventObjToSend); //This is done cause if user goes back any popup should be cleared
			$eventObj.trigger($eventObj.eventVariables.DESTROY_POPUP,undefined); //This is done to destroy TabInfoPage is any

		}

		function saveData()
		{
			var saveObj = {};
			saveObj["scoreHm"] = $scoreHm;
			saveObj["actSelHm"] = $actSelHm;
			saveObj["competencyHm"] = $competencyHm;
			saveObj["lastPendingActivityIndex"] = $lastPendingActivityIndex;

			var eventObjToSend = {"pageId":$pageId,"pageData":saveObj};
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
			var senderPageId = eventObj["pageId"];
			if(senderPageId == $pageId)
			{
				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPageData);

				var gotDataObj = eventObj["pagesData"];
				if(gotDataObj)
				{
					gotDataObj = gotDataObj[$pageId];

					$scoreHm = gotDataObj["scoreHm"];
					$actSelHm = gotDataObj["actSelHm"];
					$competencyHm = gotDataObj["competencyHm"];
					$lastPendingActivityIndex = gotDataObj["lastPendingActivityIndex"];

					
					$currentPageIndex = $lastPendingActivityIndex;

					var eventObjToSend = {"pageId":$currentPageId};
					$eventObj.trigger($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,eventObjToSend);

					loadQuestion();
				}
				else
				{
					loadQuestion();
					
				}
				


			}
		}

		function onActivityPageLoaded(pageId)
		{
			//console.log("OnActivity Page Loaded "+pageId);

			$('#mainPageDiv_'+$pageId).removeClass('first-time');
			$('#mainPageDiv_'+$pageId).removeClass('restore');

			if($actSelHm["actSel_"+pageId])
			{

				var actData = [];
				actData[0] = pageId;
				actData[1] =  $competencyHm["competency_"+pageId];
				actData[2] =  $actSelHm["actSel_"+pageId];
				actData[3] =  $scoreHm["score_"+pageId];

				var eventObjToSend = {"actData":actData};
				$eventObj.trigger($eventObj.eventVariables.RESTORE_ACTIVITY_DATA,eventObjToSend);

				$('#mainPageDiv_'+$pageId).addClass('restore');
				$('#mainPageDiv_'+$pageId).show();
			}
			else
			{
				//$('#decActContentDiv').hide();
				$('#mainPageDiv_'+$pageId).addClass('deactivate');
				$('#mainPageDiv_'+$pageId).addClass('first-time');

				//console.log("Registerng Close Popup Event");
				$eventObj.registerForEvent($eventObj.eventVariables.CLEAR_POPUP,popupClosed);

			}



		}

		function gotActivityData(eventObj)
		{
			if(eventObj)
			{
				//console.log("Got Activity Data");

				var actData = eventObj["actData"];

				var pageId = actData[0];
				var competency = actData[1];
				var optSelArr = actData[2];
				var scoreArr = actData[3];

				$competencyHm["competency_"+pageId] = competency;
				$actSelHm["actSel_"+pageId] = optSelArr;
				$scoreHm["score_"+pageId] = scoreArr;


				var lengthOfScore = Object.keys($scoreHm).length;
					var scoreArr = $scoreHm["score_"+$currentPageId];

					var totalScore = 0;
					for(i=0;i<scoreArr.length;i++)
					{
						totalScore = totalScore + scoreArr[i];
					}
					//console.log($currentPageId+" Got Act Score "+(totalScore*100));

					addToConsole($currentPageId+" Activity Score: "+Math.round(totalScore*100));

				//console.log("Got Activity Data");
				//console.log($scoreHm);
			}
			
		}

		function giveActivityUserData(eventObj)
		{
			if(eventObj)
			{
				var senderPageId = eventObj["pageId"];
				var pageDataToGive =eventObj["pageDataToGive"];

				var eventObjToSend = {"pageId":senderPageId,"actUserData":$actSelHm["actSel_"+pageDataToGive]}; //Doing this here as, next back button need destroy
				$eventObj.trigger($eventObj.eventVariables.SEND_ACTIVITY_USER_DATA,eventObjToSend);


			}
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




