
(function() {


		var $pageId;
		var $eventObj;
		var $cycleData = {};
		var $cycleAttemptPerData = {};
		var $cycleIdArr = [];
		var $cycleScoreData = {};
		var $passingPerArr=[];
		var $cycleReservedCompHm = {};
		var $feedbackITextHm={};
		var $navController;
		var $firstLoadFlag;
		var $apiModuleScore;
		var $apiCompetencyData = {};
		var $oerLinks = {};
		var $oerLinkCount = 0;
		var $oerLinkClicked = 0;
		var $currentShowIndex = -1;
		var $currentOerClickedHm = {};
		var $feedbackTextDataArr = [];
		var $toGoNextPageId;

		var init = function (xml,navController,eventObj,pageId)
		{

			//console.log("Init Feedback");
			$toGoNextPageId = null;
			$firstLoadFlag = false;
			$navController = navController;

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;

			$pageId = pageId;
			loadTemplateCss();

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js

			$eventObj = eventObj;
		
			parseCycles(xml);
			parseFeedbackITexts(xml);
			parseFeedbackText(xml);

			//testData();
			
			getData();

			//testData();

			//populateCycleTabs();
			//showData();

			
			//$('.oerButton').off();
			

			//var eventObjToSend = {"pageId":$pageId}; //Doing this here as, next back button need destroy
			//$eventObj.trigger($eventObj.eventVariables.FEEDBACK_SCREEN_LOADED,eventObjToSend);


		}

		function parseFeedbackText(xml)
		{
			//console.log("parseFeedbackText ");

			var feedbackRange = xml.find('feedbackRange');

			feedbackRange.children('range').each(function() {

				var feedArr = [];
				var start = $(this).attr('start');
				var end = $(this).attr('end');
				var text = $(this).text();

				feedArr[0] = start;
				feedArr[1] = end;
				feedArr[2] = text;

				//console.log("Got Feedback Data "+start+' '+end+' '+text);

				$feedbackTextDataArr[$feedbackTextDataArr.length] = feedArr;

			});

		}

		function parseFeedbackITexts(xml)
		{
			var iTexts = xml.find('iTexts');

			iTexts.children('iText').each(function() {

				var iTextId = $(this).attr('id');
				var iText = $(this).text();

				$feedbackITextHm[iTextId] = iText;

			});
		}

		function parseCycles(xml)
		{
			var cycles = xml.find('cycles');

			cycles.children('cycle').each(function() {

				var cyclePageId = $(this).attr('pageId');
				var cycleReservedPageId = $(this).attr('reservedPageId');
				var passingPer = $(this).attr('passingPer');

				$passingPerArr[$passingPerArr.length] = passingPer;

				var competencyHm = {};
				var cycleAttempHm = {};

				var competencies = $(this).find('competencies');
				competencies.children('competency').each(function() {

					var competency = $(this).attr('type');
					var attempPer = $(this).attr('attemptPer');
					
					cycleAttempHm[competency] = attempPer;

					var evaluationRangeArr = [];


					var evaluationRange = $(this).find('evaluationRange');
					evaluationRange.children('range').each(function() {

						var competencyDataArr = [];

						var start = parseFloat($(this).attr('start'));
						var end = parseFloat($(this).attr('end'));
						var text = $(this).find('text').text();

						competencyDataArr[0] = start;
						competencyDataArr[1] = end;
						competencyDataArr[2] = text;

						var oerLinksArr = [];

						$(this).find('oerLinks').children('link').each(function() {

							var tempObj = {};
							var linkName = $(this).attr('name');

							//console.log($(this)+ ' Got Link Name '+linkName);
							var link = $(this).text();
							tempObj[linkName] = link;

							oerLinksArr[oerLinksArr.length] = tempObj;

						});

						competencyDataArr[3] = oerLinksArr;

						evaluationRangeArr[evaluationRangeArr.length] = competencyDataArr;

					});

					competencyHm[competency] = evaluationRangeArr;


				});

				$cycleIdArr[$cycleIdArr.length] = cyclePageId;
				$cycleIdArr[$cycleIdArr.length] = cycleReservedPageId;

				$cycleData[cyclePageId] = competencyHm;
				$cycleAttemptPerData[cyclePageId] = cycleAttempHm;

			});
		}


		function testData()
		{
			//$cycleScoreData["decision"] = [0.6,0.8,0.3];
			//$cycleScoreData["decision_cycle1"] = [0.9,0.9,0.9];
			//$cycleReservedCompHm["decision_cycle1"] = 1;
			//$cycleScoreData["decision_cycle2"] = [0.6,0.7,0.6];
			//$cycleReservedCompHm["decision_cycle2"] = 2;

			var eventObj = {};
			eventObj["pageId"] = $pageId;

			var pageData = {};

			var cycleData = {};
			
			var scoreHm = {};
			scoreHm["score_m1_c1_1a"] = [0.4];
			scoreHm["score_m1_c1_1b"] = [0.43];
			scoreHm["score_m1_c1_2a"] = [0];
			scoreHm["score_m1_c1_2b"] = [0];
			scoreHm["score_m1_c1_2c"] = [0.5];
			scoreHm["score_m1_c1_3a"] = [0.5];
			scoreHm["score_m1_c1_4a"] = [1];
			scoreHm["score_m1_c1_4b"] = [0.375];
			scoreHm["score_m1_c1_4c"] = [0.4];
			scoreHm["score_m1_c1_4d"] = [1];

			var compHm = {};
			compHm["competency_m1_c1_1a"] = "Operational Assessment";
			compHm["competency_m1_c1_1b"] = "Management and Leadership Concepts";
			compHm["competency_m1_c1_2a"] = "Management and Leadership Concepts";
			compHm["competency_m1_c1_2b"] = "Management and Leadership Concepts";
			compHm["competency_m1_c1_2c"] = "Management and Leadership Concepts";
			compHm["competency_m1_c1_3a"] = "Ethical Decision-Making";
			compHm["competency_m1_c1_4a"] = "Management and Leadership Concepts";
			compHm["competency_m1_c1_4b"] = "Management and Leadership Concepts";
			compHm["competency_m1_c1_4c"] = "Management and Leadership Concepts";
			compHm["competency_m1_c1_4d"] = "Operational Assessment";

			cycleData["scoreHm"] =  scoreHm;
			cycleData["competencyHm"] = compHm;


			var cycleData1 = {};
			
			var scoreHm1 = {};
			scoreHm1["score_m1_c1_5"] = [1];
			scoreHm1["score_m1_c1_6"] = [1];
			scoreHm1["score_m1_c1_7"] = [1];
			

			var compHm1 = {};
			compHm1["competency_m1_c1_5"] = "Management and Leadership Concepts";
			compHm1["competency_m1_c1_6"] = "Operational Assessment";
			compHm1["competency_m1_c1_7"] = "Ethical Decision-Making";

			cycleData1["scoreHm"] =  scoreHm1;
			cycleData1["competencyHm"] = compHm1;


			var cycleData2 = {};
			
			var scoreHm2 = {};
			scoreHm2["score_m1_c2_1"] = [0.5];
			scoreHm2["score_m1_c2_2"] = [0.5];
			scoreHm2["score_m1_c2_3"] = [0.5];
			

			var compHm2 = {};
			compHm2["competency_m1_c2_1"] = "Management and Leadership Concepts";
			compHm2["competency_m1_c2_2"] = "Operational Assessment";
			compHm2["competency_m1_c2_3"] = "Ethical Decision-Making";

			cycleData2["scoreHm"] =  scoreHm2;
			cycleData2["competencyHm"] = compHm2;

			var cycleData3 = {};
			
			var scoreHm3 = {};
			scoreHm3["score_m1_c2_4"] = [1];
			scoreHm3["score_m1_c2_5a"] = [1];
			scoreHm3["score_m1_c2_5b"] = [1];
			scoreHm3["score_m1_c2_6"] = [1];
			scoreHm3["score_m1_c2_7a"] = [1];
			scoreHm3["score_m1_c2_7b"] = [1];
			

			var compHm3 = {};
			compHm3["competency_m1_c2_4"] = "Operational Assessment";
			compHm3["competency_m1_c2_5a"] = "Management and Leadership Concepts";
			compHm3["competency_m1_c2_5b"] = "Management and Leadership Concepts";
			compHm3["competency_m1_c2_6"] = "Ethical Decision-Making";
			compHm3["competency_m1_c2_7a"] = "Management and Leadership Concepts";
			compHm3["competency_m1_c2_7b"] = "Management and Leadership Concepts";

			cycleData3["scoreHm"] =  scoreHm3;
			cycleData3["competencyHm"] = compHm3;


			pageData["decision_cycle1"] = cycleData;
			pageData["decision_cycle1_res"] = cycleData1;
			pageData["decision_cycle2"] = cycleData2;
			//pageData["decision_cycle2_res"] = cycleData3;

			eventObj["pagesData"] = pageData;
			gotPagesData(eventObj);

			//populateCycleTabs();
			//showData(0);
		}

		function getData()
		{
			//console.log("Get Data Feedback");
			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA,gotPagesData);

			var eventObjToSend = {"pageId":$pageId,"getPageIds":$cycleIdArr};
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
					//console.log("Into OK "+Object.keys(pagesData).length);

					var pagesLength = Object.keys(pagesData).length;

					//console.log("Got Pages Length from Take Data "+pagesLength);

					
					
					var currentCyclePageId;

					for(i=0;i<pagesLength;i++)
					{

						var currentCheckingPageId = Object.keys(pagesData)[i];
						var indexOfCurrentPage = $cycleIdArr.indexOf(currentCheckingPageId);

						var isReserved = false;
						var mainCyclePageId; 
						if((indexOfCurrentPage%2) == 0)
						{
							mainCyclePageId = $cycleIdArr[indexOfCurrentPage];
							$cycleReservedCompHm[mainCyclePageId] = 1;
							
						}
						else
						{
							mainCyclePageId = $cycleIdArr[indexOfCurrentPage-1];
							$cycleReservedCompHm[mainCyclePageId] = 2;
							isReserved = true;

						}
						
						
						var cyclePageData = pagesData[currentCheckingPageId];
						
						var cycleCompetencyHm = $cycleData[mainCyclePageId];

						//console.log(mainCyclePageId+" Looping Pages Data  "+cyclePageData + " "+currentCheckingPageId);


						

							//console.log("Got Pages Data "+cyclePageData);

							var scoreHm = cyclePageData["scoreHm"];
							var competencyData = cyclePageData["competencyHm"];

							var competenciesArr = Object.keys(cycleCompetencyHm);

							//console.log("Got Competencies from Decision "+mainCyclePageId);
							//console.log(competencyData);
							//console.log(scoreHm);

							var competencyScoreArr = [];

							////console.log("competencyData.length "+competencyData.length);

							var mainCounter = 0;

							for(j=0;j<competenciesArr.length;j++)
							{
								var compName = competenciesArr[j];
								var totalScore = 0;
								var mainCounter = 0;
								for (var key in competencyData) 
								{	
									if(compName == competencyData[key])
									{
										var pageId = key.replace("competency_","");
										var scoreArr = scoreHm['score_'+pageId];

										//console.log(key+" Got Page Id "+pageId);
										//console.log(scoreArr);
										for(k=0;k<scoreArr.length;k++)
										{
											totalScore = totalScore + parseFloat(scoreArr[k]);
											mainCounter++;
										}

										
									}
									
								}

								//console.log(totalScore+" Calculating Total "+mainCounter);

								totalScore = (totalScore/mainCounter);

								var attempPer = $cycleAttemptPerData[mainCyclePageId][compName];

								//console.log(compName+" Got Attempt % "+attempPer)
								totalScore = ((attempPer/100)*totalScore);

								competencyScoreArr[competencyScoreArr.length] = totalScore;
							}

							//console.log("isReserved "+isReserved);
							if(isReserved == true)
							{
								var prevCompScoreArr = $cycleScoreData[mainCyclePageId];
								for(k=0;k<prevCompScoreArr.length;k++)
								{
									var calScore = (competencyScoreArr[k]+prevCompScoreArr[k])/2;

									//console.log("calScore "+calScore);

									if(calScore > 0.8)
									{
										//calScore = 0.8;
									}

									competencyScoreArr[k] = calScore
								}

							}
							$cycleScoreData[mainCyclePageId] = competencyScoreArr;

					}
					
					populateCycleTabs();

					var currentCycleLength = Object.keys($cycleScoreData).length;

					showData((currentCycleLength-1),true);

				}

			

			}
		}

		function populateCycleTabs(){

			var currentCycleLength = Object.keys($cycleScoreData).length;

			//console.log(Object.keys($cycleScoreData)+" populateCycleTabs "+currentCycleLength);
			for(i=0;i<currentCycleLength;i++)
			{
				var div = '<div id=tab_'+i+' index='+i+' class="tab"><span class="tabText">Round '+(i+1)+'</span></div>';
				$('#cycleTab').append(div);
			}

			$('.tab').click(function() {


					$('.tab').removeClass('tabActive');

					var index = $(this).attr('index');
				
					showData(index,false);

				});

		}

		function showData(index,loadNext)
		{

			//console.log(" showData "+index);
			$('#cycleData').empty();
			$('#competencyData').empty();
			$('#cycleScore').empty();

			var cycleId = Object.keys($cycleData)[index];
			var cycleScoreArr = $cycleScoreData[cycleId];


			var attemptVal = parseInt($cycleReservedCompHm[cycleId]);

			//console.log(cycleId+" showData Data "+cycleScoreArr);
			
			var competencyHm = $cycleData[cycleId];
			var length = Object.keys(competencyHm).length;

			//console.log(cycleId+" Got Competency Length "+length);

			var cumulativeScore = 0;

			if(loadNext == true)
			{
				$currentShowIndex = index;
				$currentOerClickedHm = {};
			}
				
			if($currentShowIndex == index)
			{
				$oerLinkCount = 0;
				$oerLinkClicked = 0;
			}


			for(i=0;i<length;i++)
			{
				var competency = Object.keys(competencyHm)[i];
				var div = '<div class=competencyList id='+cycleId+'_'+i+'>';

				div = div + '<div id='+cycleId+'_'+i+'_arrowDiv class=compArrow></div>';
				div = div + '<span>'+competency+'</span>';
				

				div = div + '</div>';

				$('#cycleData').append(div);

				var totalScore = cycleScoreArr[i];
				totalScore = Math.round(totalScore * 100);

				var toShowScore = totalScore;
				if(attemptVal == 2)
				{
					//totalScore = totalScore;
					//toShowScore = toShowScore;
					
				}

				var attempPer = $cycleAttemptPerData[cycleId][competency];

				attempPer = (attempPer/100)
				toShowScore = (toShowScore/attempPer);
				toShowScore = Math.round(toShowScore);

				cumulativeScore = cumulativeScore + totalScore;

				//console.log(" Got Total Score "+totalScore);
				//console.log(cycleScoreArr);

				var textToShow = "";
				var linksToShowArr = [];
				var evaluationArr = competencyHm[competency];

				


				for(j=0;j<evaluationArr.length;j++)
				{
					var start = evaluationArr[j][0];
					var end = evaluationArr[j][1];

					//console.log(start+" Got Score "+end);

					if(toShowScore >= start && toShowScore <= end)
					{
						textToShow = evaluationArr[j][2];
						linksToShowArr = evaluationArr[j][3];
						break;
					}
				}

				$apiCompetencyData[competency] = toShowScore;

				var linksDiv = '<div id="oerLinks"><ul>';


				
				for(p=0;p<linksToShowArr.length;p++)
				{
					var tempObj = linksToShowArr[p];
					var linkName = Object.keys(tempObj)[0];
					var link = tempObj[linkName];

					if($currentShowIndex == index && attemptVal != 2)
					{
						//console.log("Index If "+$currentOerClickedHm[i+"_"+index+"_"+p]);
						if($currentOerClickedHm[i+"_"+index+"_"+p])
						{
							linksDiv = linksDiv + '<li><a href='+link+' id='+i+"_"+index+"_"+p+' target=_blank class="toCheck clicked">'+linkName+'</a></li>';
							$oerLinkClicked = $oerLinkClicked + 1;
						}
						else
							linksDiv = linksDiv + "<li><a href="+link+" id="+i+"_"+index+"_"+p+" target=_blank class=toCheck>"+linkName+"</a></li>";

						$oerLinkCount = $oerLinkCount + 1;
					}
						
					else
						linksDiv = linksDiv + "<li><a href="+link+" target=_blank>"+linkName+"</a></li>";

				}


				linksDiv = linksDiv + '</ul></div>';


				var div = '<div id='+cycleId+'_'+i+'_data class=eval>'+'<span class="compScore">'+toShowScore+'%</span><br/><br/>'+textToShow+linksDiv+'</div>';

				$('#competencyData').append(div);

				$('#'+cycleId+'_'+i).click(function() {

					$('.eval').hide();
					var id = $(this).attr('id');

					$('#'+id+'_data').show();


					$('.competencyList').removeClass('compActive');
					$(this).addClass('compActive');

					$('.compArrow').removeClass('compArrowActive');
					$('#'+id+'_arrowDiv').addClass('compArrowActive');

				});
				
			}

			$('.toCheck').click(function() {

					if(!$(this).hasClass('clicked'))
					{
						$(this).addClass('clicked');
						$oerLinkClicked++;

						var id = $(this).attr('id');

						//console.log("Got Clicked Id "+id );

						$currentOerClickedHm[id] = "clicked";

						var nameArr = [];
						var name = $(this).text();


						nameArr[nameArr.length] = name;

						var eventObjToSend = {"oerNameList":nameArr};
						$eventObj.trigger($eventObj.eventVariables.SEND_OER_DATA,eventObjToSend);

						//checkForNextEnable();
						
					}

				});

			
			cumulativeScore = Math.round(cumulativeScore);

			var toShowCumulativeScore = cumulativeScore;

			//console.log(attemptVal+" toShowCumulativeScore "+toShowCumulativeScore)
		
			if(attemptVal == 2)
			{
				if(cumulativeScore > 80)
				{
					toShowCumulativeScore = 80;
				}
			}
			

			$('.eval').hide();
			$('#'+cycleId+'_'+index+'_data').show();

			$('#'+cycleId+'_0').click();

			$('#tab_'+index).addClass('tabActive');

			var passingPer = $passingPerArr[index];

			//console.log(passingPer+" Passing Percentage "+cumulativeScore);

			var textForAdd = "";
			for(m=0;m<$feedbackTextDataArr.length;m++)
			{
				var dataArr = $feedbackTextDataArr[m];
				var start = dataArr[0];
				var end = dataArr[1];

				if(cumulativeScore >= start && cumulativeScore <= end)
				{
					textForAdd = dataArr[2];
					break;
				}
			}

			$('#cycleScore').append(toShowCumulativeScore+"% "+textForAdd);


			calculateCumulativeCyclesScore();

			
			//console.log(i+" calculateCumulativeCyclesScore Finish "+$firstLoadFlag);

			if(loadNext == true)
			{


				var passCount = parseInt($cycleReservedCompHm[cycleId]);


				//console.log(cumulativeScore+" passingPer "+passingPer + ":::"+passCount);

				if(cumulativeScore < passingPer && passCount == 1)
				{
					$('#iText').empty();
					$('#iText').append($feedbackITextHm["first_failed"]);

					$('#nextBtn span').empty();
					$('#nextBtn span').append("Replay");
					$('#nextBtn span').addClass("replay");

					$('#nextBtn').off();

					$toGoNextPageId = $cycleIdArr[$cycleIdArr.indexOf(cycleId)+1];


					// $('#nextBtn').on();
					// $('#nextBtn').click(function() {
					
					// 	 $navController.navigate($cycleIdArr[$cycleIdArr.indexOf(cycleId)+1]);

					// });
					apiModuleStatus = 1;
				}


				var passedOn1 = false;

				var apiModuleStatus = 0;

				if(cumulativeScore >= passingPer && passCount == 1)
				{
					$('#iText').empty();
					$('#iText').append($feedbackITextHm["first_passed"]);

					$('#nextBtn span').empty();
					$('#nextBtn span').append("Continue");
					$('#nextBtn span').addClass("continue");

					$('#nextBtn').off();

					$toGoNextPageId =$cycleIdArr[$cycleIdArr.indexOf(cycleId)+2];

					// $('#nextBtn').on();
					// $('#nextBtn').click(function() {
					
					// 	 $navController.navigate($cycleIdArr[$cycleIdArr.indexOf(cycleId)+2]);

					// });

					passedOn1 = true;
					apiModuleStatus = 1;
				}

				var failedOn2 = false;
				if(cumulativeScore < passingPer && passCount == 2)
				{
					$('#iText').empty();
					$('#iText').append($feedbackITextHm["second_failed"]);

					$('#nextBtn span').empty();
					$('#nextBtn span').append("Continue");
					$('#nextBtn span').addClass("continue");

					$('#nextBtn').off();

					$toGoNextPageId = $cycleIdArr[$cycleIdArr.indexOf(cycleId)+2];

					// $('#nextBtn').on();
					// $('#nextBtn').click(function() {
					
					// 	 $navController.navigate($cycleIdArr[$cycleIdArr.indexOf(cycleId)+2]);

					// });

					failedOn2 = true;
					apiModuleStatus = 1;
				}

				
				var passedOn2 = false;
				if(cumulativeScore >= passingPer && passCount == 2)
				{
					$('#iText').empty();
					$('#iText').append($feedbackITextHm["second_passed"]);

					$('#nextBtn span').empty();
					$('#nextBtn span').append("Continue");
					$('#nextBtn span').addClass("continue");

					$('#nextBtn').off();

					$toGoNextPageId = $cycleIdArr[$cycleIdArr.indexOf(cycleId)+2];

					// $('#nextBtn').on();
					// $('#nextBtn').click(function() {
					
					// 	 $navController.navigate($cycleIdArr[$cycleIdArr.indexOf(cycleId)+2]);

					// });

					passedOn2 = true;
					apiModuleStatus = 1;
				}


				$('#nextBtn').removeClass('nextButtonDisabled');

				$('#nextBtn').on();

					$('#nextBtn').click(function() {
					
						 $navController.navigate($toGoNextPageId);

					});

				if(($cycleIdArr.indexOf(cycleId)+2) >= $cycleIdArr.length)
				{
					if(passCount == 1 && passedOn1 == true)
					{
						$('#iText').empty();
						$('#iText').append($feedbackITextHm["complete"]);
						$('#nextBtn').hide();
					}

					if(passCount == 2 && failedOn2 == true)
					{
						$('#iText').empty();
						$('#iText').append($feedbackITextHm["complete"]);
						$('#nextBtn').hide();
					}

					if(passCount == 2 && passedOn2 == true)
					{
						$('#iText').empty();
						$('#iText').append($feedbackITextHm["complete"]);
						$('#nextBtn').hide();
					}
					apiModuleStatus = 2;
				}

				//checkForNextEnable();

					
			}
						
			
		}

		function checkForNextEnable()
		{
			//console.log($oerLinkClicked+" checkForNextEnable "+$oerLinkCount);

			if($oerLinkClicked == $oerLinkCount)
			{
				// $('#nextBtn').removeClass('nextButtonDisabled');

				 sendOerData();

				// $('#nextBtn').on();

				// 	$('#nextBtn').click(function() {
					
				// 		 $navController.navigate($toGoNextPageId);

				// 	});
			}
			else
			{
				$('#nextBtn').addClass('nextButtonDisabled');
			}
		}

		function sendOerData()
		{
			var nameArr = [];
			$('.toCheck').each(function() {

			  var name = $(this).text();

			  //console.log("Got Names "+name);

			  nameArr[nameArr.length] = name;

			});

			var eventObjToSend = {"oerNameList":nameArr};
			$eventObj.trigger($eventObj.eventVariables.SEND_OER_DATA,eventObjToSend);
			
		}
		

		function calculateCumulativeCyclesScore()
		{

			$('#cumulativeText').empty();
			$('#cumulativeMsg').empty();

			var totalCount = 0;
			
			var passCount = 0;

			var totalPassingPer = 0;

			var scoreArr = [];
			for (var key in $cycleScoreData) 
			{
				var totalScore = 0;
				var competencyScoreArr = $cycleScoreData[key];

				for(i=0;i<competencyScoreArr.length;i++)
				{
					//console.log(" Got Total Score Cum "+parseFloat(competencyScoreArr[i]));

					var compScore = Math.round(parseFloat(competencyScoreArr[i]) * 100)
					totalScore = totalScore + compScore;
					totalCount++;
				}

				totalPassingPer = totalPassingPer + parseFloat($passingPerArr[passCount]);
				passCount++;

				var attemptVal = parseInt($cycleReservedCompHm[key]);
				if(attemptVal == 2)
				{
					if(totalScore > 80)
					{
						totalScore = 80;
					}
				}


				scoreArr[scoreArr.length] = totalScore;
				

			}

			var finalScore = 0;
			for(j=0;j<scoreArr.length;j++)
			{
				finalScore = finalScore + scoreArr[j];
			}

			finalScore = (finalScore/scoreArr.length);
			finalScore = Math.round(finalScore);

			$apiModuleScore = finalScore;

			totalPassingPer = (totalPassingPer/passCount);

			//console.log(finalScore+" Got Cum Score "+totalPassingPer);

			var textToAdd = "";
			for(m=0;m<$feedbackTextDataArr.length;m++)
			{
				var dataArr = $feedbackTextDataArr[m];
				var start = dataArr[0];
				var end = dataArr[1];

				if(finalScore >= start && finalScore <= end)
				{
					textToAdd = dataArr[2];
					break;
				}
			}

			$('#cumulativeText').append(finalScore+'%');
			$('#cumulativeMsg').append(textToAdd);


		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/feedbackShow/feedbackShow.css";
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
			{
				link.href = "pages/"+$pageId+"/"+$pageId+".css";
				//console.log(isAvailable+" Css Set "+link.href);
				link.media = 'all';
				mainPageDiv.appendChild(link);
			}
				
		}


		function destroyPage()
		{
			//console.log("Into Page Destroy");
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




