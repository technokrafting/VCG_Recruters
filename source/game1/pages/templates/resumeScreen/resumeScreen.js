
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

		var init = function (xml,navController,eventObj,pageId)
		{


			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;


			loadTemplateCss();


			

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js


			$progressBar = $('.progress-bg');
			$scoreBoard = $('.score-count');

			renderData(xml);
			

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

			var incorrectArr = [];
			$( ".incorrect" ).each(function( index ) {
				incorrectArr[index] = index;

				var id = 'incorrect-'+index;
			    $(this).attr('id',id);
			    $(this).attr('index',index);

			});

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


			for (var a = incorrectArr, i = $issueToIdentify; i--; ) {
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

			  }

			});

			console.log('Data Obj ',$issuesToIdentifyHm);


			$('.explanation').hide();

			$('.incorrect').on('click',function(e){

				//alert('Issue Identified');

				var id = $(this).attr('index');

				//console.log(id);

				var tempObj = $issuesToIdentifyHm[id];
				//console.log('tempObj',tempObj);
				if(tempObj.found == 0)
				{
					$totalIssueIdentified++;

					//alert(id);

					$('#explanation-'+id).show();

					tempObj.found = 1;

					setIssueText();


					var intScore = parseInt($score);
					intScore = intScore + 100;

					console.log('intScore',intScore.length);
					if(intScore.toString().length == 3)
					{
						intScore = '0'+ intScore;
					}

					$score = intScore;
					setScore();

				}
				

				e.stopPropagation();


			});


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
						console.log('errorTop',errorTop);

						var section = getSectionByTop(errorTop);

						var pageObj = $resumePagesObj[nextErrorIndex];

						var scrollTo = 0;

						scrollTo = errorTop - 150;

						$('.resume-content').animate({
					        scrollTop: scrollTo
					    }, 1500, function(){


					    	var elementPos = $('#incorrect-'+nextErrorIndex).offset().top;
					    	elementPos = elementPos - 100;

					    	var hintClone = $('.hint-box-top').clone();
							//hintClone.top = scrollTo;


							hintClone.css('top',elementPos);

							console.log('elementPos',elementPos);

							hintClone.removeClass('hide-element');

							$('#resume-content-container').append(hintClone);

					    });
					}

					$(this).addClass('disabled');

				}
			});


			$('#done-btn').on('click',function(){

				stopResumeClick();

			});

			$('#back-btn').on('click',function(){

				startResumeClick();

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


			loadPageSizeData();

			startResumeClick();

		}


		function loadPageSizeData()
		{
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


			console.log('$resumePagesObj',$resumePagesObj);

			$( ".resume-content" ).on('scroll',function(e) {
			  //console.log(e);

			  var top = $('#resume-content-container').offset().top;
			  //console.log('top',top);

			 var section = getSectionByTop(top);

			  setPageSection(section);

			  //console.log('section', section);


			});

			//console.log('numofPages',numofPages,resumeHeight,$pageBreak);
		}


		function showFinalScore(questionScore)
		{
			var intScore = parseInt($score);
			intScore = intScore + questionScore;

			if(intScore < 800)
			{
				$('.score-star').addClass('0-star');
			}

			if(intScore >= 800 && intScore <= 899)
			{
				$('.score-star').addClass('1-star');
				saveData(intScore);
			}

			if(intScore >= 900 && intScore <= 999)
			{
				$('.score-star').addClass('2-star');
				saveData(intScore);
			}

			if(intScore == 1000)
			{
				$('.score-star').addClass('3-star');
				saveData(intScore);
			}

			$('#issues-identified').html($totalIssueIdentified);
			$('#total-issues').html($issueToIdentify);

			$('#missed-attempts').html($completedAttempts);

			$('#previous-score').html($previousScore);

			$('#current-score').html(intScore);

			$('#total-score').html(($previousScore+intScore));

		}


		function startResumeClick()
		{
			$('#resume-content-container').on('click',function(e){

				var top = $(this).offset().top;

				var clientX = e.offsetX;
				var clientY = e.clientY - top - 20;

				console.log('top',top);

				$completedAttempts++;

				if($completedAttempts == $totalAttempts)
				{

					alert('Game Over');

					$(this).off();
				}

				var callout = $('.ok-popout').clone();

					callout.css('top',clientY);
					callout.css('left',clientX);

					callout.removeClass('hide-element');

					$(this).append(callout);

				setProgressBar();

			});
		}

		function stopResumeClick()
		{
			$('#resume-content-container').off();
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

		}


		function destroyPage()
		{
			//console.log("Into Page Destroy");
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




