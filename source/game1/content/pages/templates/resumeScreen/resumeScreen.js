
(function() {


		var $pageId;
		var $eventObj;
		var $progressBar;
		var $totalAttempts;
		var $completedAttempts;
		var $issueToIdentify;
		var $totalIssueIdentified;
		var $issuesToIdentifyHm = {};
		var $score = '0000';
		var $scoreBoard;
		var $pageBreak = 518;

		var $hintTaken = 0;

		var $resumePagesObj = {};

		var $totalResumeHeight = 0;

		var $previousScore = 0;
		var $bgAudio;

		var $menuPageId;


		var init = function (xml,navController,eventObj,pageId)
		{



			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;
			
			

			$bgAudio = xml.find('bgAudio').text();
			loadBgAudio();

			

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js


			$progressBar = $('.progress-bg');
			$scoreBoard = $('.score-count');

			$menuPageId = xml.find('menuageId').text();


			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotMenuPageData);

			var eventObjToSend = {"pageId":$pageId,"getPageIds":[$menuPageId]};
			$eventObj.trigger($eventObj.eventVariables.GIVE_PAGE_DATA,eventObjToSend);
			

			renderData(xml);

		}

		function gotMenuPageData(eventObj)
		{
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotMenuPageData);
				var pagesData = eventObj["pagesData"];

				var gotDataObj = pagesData[$menuPageId];

				console.log('Got Total Score',gotDataObj['totalScore']);

				$previousScore = parseInt(gotDataObj['totalScore']);
				
			}
		}

		function loadBgAudio()
		{
			$eventObj.registerForEvent($eventObj.eventVariables.BG_AUDIO_LOADED,bgAudioLoaded);

			var eventObjToSend = {"pageId":$pageId,"audioPath":$bgAudio};
			$eventObj.trigger($eventObj.eventVariables.LOAD_BACKGROUND_AUDIO,eventObjToSend);
		}

		function bgAudioLoaded(eventObj)
		{
			var pageId = eventObj['pageId'];
			if(pageId == $pageId)
			{
				var audioPath = eventObj['audioPath'];
				if(audioPath == $bgAudio)
				{
					$eventObj.unRegisterEvent($eventObj.eventVariables.BG_AUDIO_LOADED,bgAudioLoaded);
					
					var eventObjToSend = {"pageId":$pageId,"audioPath":$bgAudio};
					$eventObj.trigger($eventObj.eventVariables.PLAY_BACKGROUND_AUDIO,eventObjToSend);
				}
			}
		}

		function renderData(xml)
		{
			$totalAttempts = xml.find('attempts').text();
			$issueToIdentify = xml.find('issuesToFind').text();
			$completedAttempts = 0;
			$totalIssueIdentified = 0;

			setIssueText();

			setProgressBar();

			setScore();

			loadResume();

			var guidelinesPageId = xml.find('guidelinesPageId').text();
			$('#resume-guidelines-btn').on('click',function(){

				var eventObjToSend = {"pageId":guidelinesPageId};
				$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

			});

			var settingsId = xml.find('settingsPageId').text();
			$('.setting-div').on('click',function(){

				var eventObjToSend = {"pageId":settingsId};
				$eventObj.trigger($eventObj.eventVariables.LOAD_PAGE,eventObjToSend);

			});

			console.log($totalAttempts);
		}


		function setIssueText()
		{
			$('#issue-count-text').html($totalIssueIdentified+'/'+$issueToIdentify);
		}

		function setProgressBar()
		{
			var per = Math.floor((($totalAttempts-$completedAttempts)/($totalAttempts))*100);
			$progressBar.css('width',per+'%');
		}

		function setScore()
		{
			$scoreBoard.html($score);
		}


		function loadResume()
		{
			$('#resume-content-container').load("pages/"+$pageId+"/resume.html",function(){
			loadResumeData();
		});

		}

		function loadResumeData()
		{
			//console.log($('.incorrect').length);

			var sameIdObj = {};
			var incorrectArr = [];
			$( ".incorrect" ).each(function( index ) {
				incorrectArr[index] = index;

				var id = 'incorrect-'+index;

				if($(this).hasClass('is_same'))
				{
					var tempArr;
					var sameId = $(this).attr('sameId');
					if(sameIdObj[sameId])
					{
						tempArr = sameIdObj[sameId];
					}
					else
					{
						tempArr = [];
					}

					tempArr[tempArr.length] = index;
					sameIdObj[sameId] = tempArr;
				}

			    $(this).attr('id',id);
			    $(this).attr('index',index);

			});

			//console.log('sameIdObj',sameIdObj);

			$( ".correct" ).each(function( index ) {
				
				var id = 'correct-'+index;
			    $(this).attr('id',id);
			    $(this).attr('index',index);

			});

			$( ".explanation" ).each(function( index ) {
				
				var id = 'explanation-'+index;
			    $(this).attr('id',id);
			    $(this).attr('index',index);

			});

			var finalInCorrectShowArr = [];
			var totalIssuesToIdentify = $issueToIdentify;

			var sameKeys = Object.keys(sameIdObj);
			for(var i=0;i<sameKeys.length;i++)
			{

				var idsArr = sameIdObj[sameKeys[i]];

				var isToShow = Math.round(Math.random() * 1);
				isToShow = 1;
				for(var j=0;j<idsArr.length;j++)
				{
					if(isToShow == 1)
					{
						finalInCorrectShowArr[finalInCorrectShowArr.length] = idsArr[j];
						totalIssuesToIdentify--;
					}
					
					incorrectArr.splice(incorrectArr.indexOf(idsArr[j]),1);
				}
				
				
				
			}

			console.log('finalInCorrectShowArr',finalInCorrectShowArr);


			for (var a = incorrectArr, i = totalIssuesToIdentify; i--; ) {
			    var random = a.splice(Math.floor(Math.random() * (incorrectArr.length)), 1)[0];
			    finalInCorrectShowArr[finalInCorrectShowArr.length] = random;
			}

			$( ".incorrect" ).each(function( index ) {

			  var toShow = finalInCorrectShowArr.indexOf(index);

			  if(toShow == -1)
			  {
			  	 $('#incorrect-'+index).removeClass().empty();
			  	 $('#explanation-'+index).removeClass().empty();

			  	 $('#incorrect-'+index).remove();
			  	 $('#explanation-'+index).remove();
			  }
			  else
			  {
			  	$('#correct-'+index).empty();

			  	 var tempObj = {};
			  	 tempObj.index = index;
			  	 tempObj.found = 0;

			  	 $issuesToIdentifyHm[index] = tempObj;

			  	$('#incorrect-'+index).addClass('red-text-bg');

			  }

			});

			console.log('Data Obj ',$issuesToIdentifyHm);


			$('.explanation').hide();



			$('.hint-btn').on('click',function(){

				if($hintTaken == 0)
				{
					$hintTaken = 1;

					var nextErrorIndex = -1;

					var keysArr = Object.keys($issuesToIdentifyHm);
					for(var i=0;i<=keysArr.length;i++)
					{
						var tempObj = $issuesToIdentifyHm[keysArr[i]];
						if(tempObj.found == 0)
						{
							nextErrorIndex = keysArr[i];

							break;
						}
					}

					if(nextErrorIndex != -1)
					{
						console.log('$issuesToIdentifyHm',$issuesToIdentifyHm,nextErrorIndex);
						//nextErrorIndex = 5;
						var errorTop = $('#incorrect-'+nextErrorIndex).offset().top;

						errorTop = errorTop;

						var parentScroll = $('#resume-content-container').offset().top;

						if(parentScroll > errorTop)
						{
							errorTop = parentScroll - errorTop;
						}
						else
						{
							errorTop = errorTop - parentScroll;
						}
						

						console.log('errorTop',errorTop);

						var scrollTo = 0;

						scrollTo = errorTop;

						console.log('scrollTo',scrollTo);

						// if(scrollTo >= -20 && scrollTo <= 20)
						// {
						// 	scrollAnimationComplete(nextErrorIndex,scrollTo);
						// }
						// else
						// {
							
						// }

						$('.resume-content').animate({
					        scrollTop: scrollTo
						    }, 1000, function(){


						    	scrollTo = scrollTo;
						    	scrollAnimationComplete(nextErrorIndex,scrollTo);
						    	
						    	// if(scrollTo < 0)
						    	// {
						    	// 	scrollTo = $('#resume-content-container').offset().top;
						    	// 	scrollAnimationComplete(nextErrorIndex,scrollTo);
						    	// }
						    	// else
						    	// {
						    		
						    	// }
						    	

						    });
						
					}

					$(this).addClass('disabled');

				}
			});


			$('#done-btn').on('click',function(){

				stopResumeClick();

			});

			$('#back-btn').on('click',function(e){

				e.stopPropagation();

				if($completedAttempts != $totalAttempts)
				{
					startResumeClick();
				}
				

				$('#doneModal').modal('hide');

			});

			$('#questions-submit').on('click',function(){


				var questionScore = 0;

				$( ".radio-btn:checked" ).each(function() {

					console.log('Radio Id ',$(this).attr('correct'));
					
					if($(this).attr('correct') == 'yes')
					{
						questionScore = questionScore + 100;
					}

				});

			showFinalScore(questionScore);

			});

			


			$('.main-page-bg').removeClass('resume');
			$('.main-page-bg').addClass('info-tint');

			$('.challenge-continue-btn').on('click',function(){


				$('.main-page-bg').removeClass('info-tint');
				$('.main-page-bg').addClass('resume');
				startResumeClick();

			});

			
			loadTemplateCss();

			
			
		}


		function scrollAnimationComplete(nextErrorIndex, oldTop)
		{
			//var elementPos = $('#incorrect-'+nextErrorIndex).offset().top;

			//console.log('elementPos top ',elementPos);

	    	//elementPos = elementPos - 100;

	    	var hintClone = $('.hint-box-top').clone();
			//hintClone.top = scrollTo;


			hintClone.css('top',oldTop);

			//console.log('elementPos',elementPos);

			hintClone.removeClass('hide-element');

			$('#resume-content-container').append(hintClone);
		}

		function hideHintBox()
		{
			$('.hint-box-top').addClass('hide-element');
		}

		function loadPageSizeData()
		{

			var eventObjToSend = {"pageId":$pageId};
			$eventObj.trigger($eventObj.eventVariables.PAGE_INIT,eventObjToSend);

			
			var resumeHeight = $('#resume-content-container').css('height');

			console.log('resumeHeight',resumeHeight);
			resumeHeight = resumeHeight.substring(0,resumeHeight.length-2);

			resumeHeight = resumeHeight;

			$totalResumeHeight = resumeHeight;

			var numofPages = Math.ceil((resumeHeight/$pageBreak)/2);

			var pageCut = 518;

			var start = 90;

			for(var i=1;i<=numofPages;i++)
			{
				$('.page'+i).removeClass('hide-element');

				var tempObj = {};
				tempObj.pageNum = i;
				tempObj.topStart = start;
				tempObj.topEnd = start - pageCut;

				start = start - pageCut;

				tempObj.bottomStart = start;
				tempObj.bottomEnd = start - pageCut;

				start = start - pageCut;

				$resumePagesObj[i] = tempObj;

			}


			//console.log('$resumePagesObj',$resumePagesObj);

			$( ".resume-content" ).on('scroll',function(e) {
			  //console.log(e);

			  var top = $('#resume-content-container').offset().top;
			  console.log('top',top);

			 top = top - 300;
			 var section = getSectionByTop(top);

			  setPageSection(section);

			  //console.log('top Page', top);


			});

			console.log('numofPages',numofPages,resumeHeight,$pageBreak);

		}


		function showFinalScore(questionScore)
		{
			var intScore = parseInt($score);
			intScore = intScore + questionScore;

			if(intScore < 800)
			{
				$('.score-star').addClass('star-0');
				$('.congrats').addClass('hide-element');
			}

			if(intScore >= 800 && intScore <= 899)
			{
				$('.score-star').addClass('star-1');
				$('.hard-luck').addClass('hide-element');
				saveData(intScore);
			}

			if(intScore >= 900 && intScore <= 999)
			{
				$('.score-star').addClass('star-2');
				$('.hard-luck').addClass('hide-element');
				saveData(intScore);
			}

			if(intScore >= 1000)
			{
				$('.score-star').addClass('star-3');
				$('.hard-luck').addClass('hide-element');
				saveData(intScore);
			}

			$('#issues-identified').html($totalIssueIdentified);
			$('#total-issues').html($issueToIdentify);

			$('#missed-attempts').html($completedAttempts);

			$('#previous-score').html($previousScore);

			$('#current-score').html(intScore);

			if(intScore >= 800)
			{
				$('#total-score').html(($previousScore+intScore));
			}
			else
			{
				$('#total-score').html(($previousScore));
			}
			

		}


		function startResumeClick()
		{
			$('#resume-content-container').on('click',function(e){

				hideHintBox();

				console.log(e);
				var top = $(this).offset().top;

				var clientX = e.clientX - 275;
				var clientY = e.clientY - top - 20;

				//console.log('top',top);

				$completedAttempts++;

				if($completedAttempts == $totalAttempts)
				{

					//alert('Game Over');

					$('#done-btn').click();

					stopResumeClick();
					//$(this).off();

				}

					var callout = $('.ok-popout').eq(0).clone();

					callout.css('top',clientY);
					callout.css('left',clientX);

					callout.removeClass('hide-element');
					callout.addClass('fade-in-out');

					addCirleMark(clientY,clientX);


					$(this).append(callout);

					var len = parseInt(callout.css("animation-duration").split("s")[0])*1000;

					setDelay(len,function(){

						callout.removeClass('fade-in-out');
						callout.addClass('hide-element');

					});
					console.log("anim dur 1: ", len);
					

				setProgressBar();

			});


			$('.incorrect').on('click',function(e){

				//alert('Issue Identified');

				hideHintBox();
				var id = $(this).attr('index');

				//console.log(id);

				var tempObj = $issuesToIdentifyHm[id];
				//console.log('tempObj',tempObj);
				if(tempObj.found == 0)
				{
					$totalIssueIdentified++;

					//alert(id);

					

					$(this).addClass('red-text-bg');

					tempObj.found = 1;

					var intScore = parseInt($score);
					intScore = intScore + 100;

					console.log('intScore',intScore.length);
					if(intScore.toString().length == 3)
					{
						intScore = '0'+ intScore;
					}

					$score = intScore;


					var elementOffset = $(this).offset();

					var exclamationClone = $('.answer-exclamation').clone();
					//hintClone.top = scrollTo;
					exclamationClone.removeClass('hide-element');

					exclamationClone.css('top',elementOffset.top - 10);
					exclamationClone.css('left',elementOffset.left - 50);

					$('body').append(exclamationClone);

					$('#explanation-'+id).show();
					
					$('#explanation-'+id).addClass('fade-in-out');
					
					var len = parseInt($('#explanation-'+id).css("animation-duration").split("s")[0])*1000;


					setDelay(len, function(){

						$('#explanation-'+id).removeClass('fade-in-out');
					
					});

					exclamationClone.addClass('animate-exclamation');
					setDelay(400,function(){

								setScore();
								setIssueText();

								exclamationClone.removeClass().empty();

						});


					var top = $('#resume-content-container').offset().top;

					var clientX = e.clientX - 275;
					var clientY = e.clientY - top - 20;

					addCirleMark(clientY,clientX);

				}
				else
				{	
					
					$('#explanation-'+id).show();
					
					$('#explanation-'+id).addClass('fade-in-out');
					
					var len = parseInt($('#explanation-'+id).css("animation-duration").split("s")[0])*1000;

					setDelay(len, function(){

						$('#explanation-'+id).removeClass('fade-in-out');
					});

					console.log("anim dur: ", len);
					
					
					//$('#explanation-'+id).show();
					//$('#explanation-'+id).addClass('fade-in-out');
				}
				

				
				
				e.stopPropagation();


			});
		}

		function stopResumeClick()
		{
			console.log('stopResumeClick');
			$('#resume-content-container').off();
			$('.incorrect').off();
		}

		function addCirleMark(top,left)
		{
			var circle = $('.click-mark-circle').eq(0).clone();

			circle.css('top',top + 25);
			circle.css('left',left);

			circle.removeClass('hide-element');
			//circle.addClass('fade-in-out');


			$('#resume-content-container').append(circle);
		}

		function getSectionByTop(top)
		{
			var pageKeys = Object.keys($resumePagesObj);

			var section = '';

			  for(var i=0;i<pageKeys.length;i++)
			  {
			  	var pageObj = $resumePagesObj[pageKeys[i]];

			  	section = (i+1).toString();

			  	if(pageObj.topStart >= top && pageObj.topEnd <= top){

			  		section = section + '1';
			  		break;
			  	}

			  	if(pageObj.bottomStart >= top && pageObj.bottomEnd <= top){

			  		section = section + '2';
			  		break;
			  	}

			  }

			  return section;
		}

		function setPageSection(section)
		{
			$('.pages-bg').removeClass('page-up');
			$('.pages-bg').removeClass('page-down');
			$('.pages-bg').removeClass('page-blank');
			$('.pages-bg').addClass('page-blank');

			switch(section)
			{
				case "11":

					$('.page1').removeClass('page-blank');
					$('.page1').addClass('page-up');

				break;
				case "12":

					$('.page1').removeClass('page-blank');
					$('.page1').addClass('page-down');

				break;
				case "21":

					$('.page2').removeClass('page-blank');
					$('.page2').addClass('page-up');

				break;
				case "22":

					$('.page2').removeClass('page-blank');
					$('.page2').addClass('page-down');

				break;
				case "31":

					$('.page3').removeClass('page-blank');
					$('.page3').addClass('page-up');

				break;
				case "32":

					$('.page3').removeClass('page-blank');
					$('.page3').addClass('page-down');

				break;
				case "41":

					$('.page4').removeClass('page-blank');
					$('.page4').addClass('page-up');

				break;
				case "42":

					$('.page4').removeClass('page-blank');
					$('.page4').addClass('page-down');

				break;

			}

		}


		function saveData(score)
		{
			var saveObj = {};
			saveObj["score"] = score;

			var eventObjToSend = {"pageId":$pageId,"pageData":saveObj};
			$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);
		}


		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/resumeScreen/resumeScreen.css";
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

			loadPageSizeData();

			//$('#content').removeClass('hide-element');

		}


		function destroyPage()
		{
			//console.log("Into Page Destroy");
			var eventObjToSend = {"pageId":$pageId,"audioPath":$bgAudio};
			$eventObj.trigger($eventObj.eventVariables.STOP_BACKGROUND_AUDIO,eventObjToSend);


			// /$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_CURRENT_SCORE,onCurrentScoreReceived);
			$eventObj.unRegisterEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotMenuPageData);
		}

		//$('#content').addClass('hide-element');
		var imagesLoaded = 0;

		$('.image').each(function(){

			//console.log($('.menu-bg .anim-div .resume-hand.hand1').css('background'));

			var bgImg = new Image();
			bgImg.onload = function(){

				imagesLoaded++;
				if(imagesLoaded == $('.image').length)
				{
					//alert('all loaded');
			   		App.register( {init:init,destroyPage:destroyPage});
				}
			   //myDiv.style.backgroundImage = 'url(' + bgImg.src + ')';
			   

			};

			bgImg.src = $(this).attr('src');

		});
		
		//App.register( {init:init,destroyPage:destroyPage});


})();




