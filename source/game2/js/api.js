(function() {


		var $configXml;
		var $moduleId,$userId,$moduleAttemptId,$moduleTime,$moduleScore,$moduleStatus,$bookmark;
		var $cycleId,$cycleNum,$cycleScore,$cycleTime,$cycleAttempt,$parameterObj;
		var $eventObj;
		var $compDataArr = {};
		var $mainCourseTimer;
		var $cycleTimer;
		var $apiCompetencyCodeHm = {};
				
			
		function init(eventObj)
		{
			$eventObj = eventObj;


			$eventObj.registerForEvent($eventObj.eventVariables.SAVE_DATA_TO_API,saveData);
			$eventObj.registerForEvent($eventObj.eventVariables.INIT_DECISION_SCREEN,decisionScreenLoaded);
			$eventObj.registerForEvent($eventObj.eventVariables.FEEDBACK_SCREEN_LOADED,feedbackScreenLoaded);
			$eventObj.registerForEvent($eventObj.eventVariables.TAKE_PAGE_DATA_FOR_BOOKMARK,setBookmarkValue);
			$eventObj.registerForEvent($eventObj.eventVariables.SEND_OER_DATA,sendOerData);
			

				
			var xmlPath = "config.xml";
			loadAndParseXml(xmlPath,configXmlLoaded);

			
		}

		

		function configXmlLoaded(xml)
		{
			$configXml = xml;

		    //createTestDummy();

			//callGetParameter();

			//setTimeout(function(){ callGetModuleDetails(); }, 3000);
			//callGetModuleDetails();
			//callPostModuleDetails();


			
		}

		function decisionScreenLoaded(eventObj)
		{
			if($cycleTimer != null)
			{
				$cycleTimer.stopTimer();
			}
			else
			{
				$cycleTimer = new Timer();
			}
			
			$cycleTimer.startTimer();
			
		}


		function feedbackScreenLoaded(eventObj)
		{
			//$cycleTimer.stopTimer();	
			//saveData();
		}


		function createTestDummy()
		{

			$moduleAttemptId = '132';
			$moduleScore = "49";
			$moduleStatus = "1";
			$moduleTime = "00:10:20";
			$bookmark = '{\"decision_cycle1\":[],\"decision_cycle1_res\":[],\"m1_c2_3a\":{\"optionSelData\":[\"0\",\"1\",\"1\",\"1\",\"1\",\"1\",\"1\",\"0\",\"1\",\"0.5\"]},\"m1_c2_4a\":{\"optionSelData\":[\"0.5\",\"0\",\"0.5\",\"1\"]},\"decision_cycle2\":{\"scoreHm\":{\"score_m1_c2_1\":[\"0\"],\"score_m1_c2_2a\":[\"0.5\"],\"score_m1_c2_2b\":[\"1\"],\"score_m1_c2_3a\":[0.75],\"score_m1_c2_3b\":[\"0.5\"],\"score_m1_c2_4a\":[0.5],\"score_m1_c2_4b\":[\"0\"]},\"actSelHm\":{\"actSel_m1_c2_1\":[\"opt2\"],\"actSel_m1_c2_2a\":[\"opt2\"],\"actSel_m1_c2_2b\":[\"opt2\"],\"actSel_m1_c2_3a\":[{\"1a\":\"0\"},{\"2a\":\"1\"},{\"1b\":\"1\"},{\"2b\":\"1\"},{\"1c\":\"1\"},{\"2c\":\"1\"},{\"1d\":\"1\"},{\"2d\":\"0\"},{\"1e\":\"1\"},{\"2e\":\"0.5\"}],\"actSel_m1_c2_3b\":[\"opt2\"],\"actSel_m1_c2_4a\":[{\"1a\":\"0.5\"},{\"2a\":\"0\"},{\"1b\":\"0.5\"},{\"2b\":\"1\"}],\"actSel_m1_c2_4b\":[\"opt2\"]},\"competencyHm\":{\"competency_m1_c2_1\":\"Basic Accounting Concepts\",\"competency_m1_c2_2a\":\"Basic Principles of Finance\",\"competency_m1_c2_2b\":\"Basic Principles of Finance\",\"competency_m1_c2_3a\":\"Analysis of Financial Statements\",\"competency_m1_c2_3b\":\"Analysis of Financial Statements\",\"competency_m1_c2_4a\":\"Analysis of Financial Statements\",\"competency_m1_c2_4b\":\"Analysis of Financial Statements\"},\"lastPendingActivityIndex\":6}}';
			

			$cycleId = "326";
			$cycleNum = "2";
			$cycleScore = "41";
			$cycleTime = "00:00:47";
			$cycleAttempt = "1";


			$apiCompetencyCodeHm['Analysis of Financial Statements'] = 'AF_ANA_FIN_STA_003';
			$apiCompetencyCodeHm['Basic Accounting Concepts'] = 'AF_BAS_ACC_CON_001';



			var tempScoreHm = {};
			var tempCompHm = {};

			tempScoreHm["score_Analysis of Financial Statements"] = [(40/100)];
			tempScoreHm["score_Basic Accounting Concepts"] = [(52/100)];
			tempScoreHm["score_Basic Principles of Finance"] = [(52/100)];
			//tempScoreHm["score_Ethical Decision-Making"] = [(0/100)];

			tempCompHm["competency_Analysis of Financial Statements"] = 'Analysis of Financial Statements';
			tempCompHm["competency_Basic Accounting Concepts"] = 'Basic Accounting Concepts';
			tempCompHm["competency_Basic Principles of Finance"] = 'Basic Principles of Finance';
			//tempCompHm["competency_Ethical Decision-Making"] = 'Ethical Decision-Making';

			var saveObj = {};
			saveObj["scoreHm"] = tempScoreHm;
			saveObj["competencyHm"] = tempCompHm;
			              	

			


			






			var tempScoreHm1 = {};
			var tempCompHm1 = {};

			tempScoreHm1["score_Analysis of Financial Statements"] = [(35/100)];
			tempScoreHm1["score_Basic Accounting Concepts"] = [(0/100)];
			tempScoreHm1["score_Basic Principles of Finance"] = [(76/100)];
			//tempScoreHm1["score_Ethical Decision-Making"] = [(0/100)];

			tempCompHm1["competency_Analysis of Financial Statements"] = 'Analysis of Financial Statements';
			tempCompHm1["competency_Basic Accounting Concepts"] = 'Basic Accounting Concepts';
			tempCompHm1["competency_Basic Principles of Finance"] = 'Basic Principles of Finance';
			//tempCompHm1["competency_Ethical Decision-Making"] = 'Ethical Decision-Making';

			var saveObj1 = {};
			saveObj1["scoreHm"] = tempScoreHm1;
			saveObj1["competencyHm"] = tempCompHm1;


			sendBookmarkValues();
			

			var eventObjToSend = {"pageId":"decision_cycle1","pageData":saveObj};
		    $eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);

		    
			              	
			var eventObjToSend = {"pageId":"decision_cycle2","pageData":saveObj1};
			$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);


			

			loadPage("feedback_show");


		}
		function callGetParameter()
		{
			var getApiCall = $configXml.find("webApi").find("parameterCall").text();

			$.support.cors = true;
			$.ajax({
			            type: "GET",
			            url: getApiCall,
			            crossDomain:true,
						headers:{"access-control-allow-origin":"*"},
			            data: null,
			            dataType: "json",
			            success: function (data) {

			               //console.log("Got Success ");
			               //console.log(data);

			               var jsonText = data;

			              var jsonStr = JSON.stringify(data);
			              var jsonObj = jQuery.parseJSON(jsonStr);

			             // //console.log("String json "+jsonStr);
			             // //console.log("json obj "+jsonObj);


			              var jsonLength = Object.keys(jsonObj).length;

			              var competencies =$configXml.find('competencies');
							competencies.children('competency').each(function() {

								var competency = $(this).text();
								for(i=0;i<jsonLength;i++)
								{
									var compName = jsonObj[i].ParameterName;
									if(compName == competency)
									{
										$apiCompetencyCodeHm[competency] = jsonObj[i].ParameterCode;
									}
								}

							});

							//console.log("Got Parameter Codes");
							//console.log($apiCompetencyCodeHm);

							callGetModuleDetails();

			               //alert("View Model "+jsonObj.ParameterMasterViewModel);
							
			            },
			            error: function (parsedjson,textStatus,errorThrown) {

			            	console.log("Error in Parameter Call: "+JSON.stringify(parsedjson));
							//console.log(errorThrown);
			            }
			        });
		}


		function callGetModuleDetails()
		{
			//console.log("callGetModuleDetails");
			var getApiCall = $configXml.find("webApi").find("moduleGet").text();

			$.support.cors = true;
			$.ajax({
			            type: "GET",
			            url: getApiCall,
			            crossDomain:true,
						headers:{"access-control-allow-origin":"*"},
			            data: null,
			            dataType: "json",
			            success: function (data) {

			               //console.log("Got Success ");
			               //console.log(data);

			               var jsonText = data;

			              var jsonStr = JSON.stringify(data);
			              var jsonObj = jQuery.parseJSON(jsonStr);

			              //console.log("String json "+jsonStr);
			              //console.log("json obj "+jsonObj);

			              var jsonLength = Object.keys(jsonObj).length;

			              $moduleAttemptId=jsonObj[jsonLength-1].ModuleAttemptID;
			              $moduleScore = jsonObj[jsonLength-1].ModuleScore;
			              $moduleStatus = jsonObj[jsonLength-1].ModuleStatus;
			              $moduleTime = jsonObj[jsonLength-1].ModuleTimeTaken;
			              $bookmark = jsonObj[jsonLength-1].Bookmark;
			              $cycleId = jsonObj[jsonLength-1].CycleID;
			              $cycleNum = jsonObj[jsonLength-1].CycleNum;
			              $cycleScore = jsonObj[jsonLength-1].CycleScore;
			              $cycleTime = jsonObj[jsonLength-1].CycleTimeTaken;
			              $cycleAttempt = jsonObj[jsonLength-1].CycleAttemptNumber;

			              //console.log($cycleNum+" Got Module Data ")

			              sendBookmarkValues();


							$mainCourseTimer = new Timer();
							$mainCourseTimer.setTimeInFormat($moduleTime);
							$mainCourseTimer.startTimer();
			              
			              if($cycleNum == null)
			              {
			              	loadPage("page1");
			              	return;
			              }

			             

			              //Cycle1 and Attemp1
			              if($cycleNum.toString() == "1" && $cycleAttempt.toString() == "1")
			              {
			              	var tempScoreHm = {};
			              	var tempCompHm = {};


			              	//console.log(jsonObj[0].ParameterList[2].ParameterValue);
						  	var tempCounter = 0;
			              	var competencies =$configXml.find('competencies');
							competencies.children('competency').each(function() {

								//console.log("This Text "+$(this).text());

								var gotScore = 0;
								for(j=0;j<jsonObj[0].ParameterList.length;j++)
								{
									var gotCode = jsonObj[0].ParameterList[j].ParameterCode;

									if(gotCode == $apiCompetencyCodeHm[$(this).text()])
									{
										gotScore = jsonObj[0].ParameterList[j].ParameterValue;
									}

								}
								
								
								tempScoreHm["score_"+$(this).text()] = [(gotScore/100)];

								tempCompHm["competency_"+$(this).text()] = $(this).text();

								tempCounter++;

							});



							//console.log("Loop Over ");

							$cycleTimer = new Timer();
							$cycleTimer.setTimeInFormat($cycleTime);

							//console.log(" Got Data ");
							//console.log(tempScoreHm);
							//console.log(tempCompHm);

							var saveObj = {};
							saveObj["scoreHm"] = tempScoreHm;
							saveObj["competencyHm"] = tempCompHm;
			              	
			              	var eventObjToSend = {"pageId":"decision_cycle1","pageData":saveObj};
							$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);

							loadPage("feedback_show");
			                return;
			              }

			              //Cycle1 and Attemp2
			              if($cycleNum.toString() == "1" && $cycleAttempt.toString() == "2")
			              {
			              	var tempScoreHm = {};
			              	var tempCompHm = {};

			              	var tempCounter = 0;
			              	var competencies =$configXml.find('competencies');
							competencies.children('competency').each(function() {

								var gotScore = 0;
								for(j=0;j<jsonObj[0].ParameterList.length;j++)
								{
									var gotCode = jsonObj[0].ParameterList[j].ParameterCode;

									if(gotCode == $apiCompetencyCodeHm[$(this).text()])
									{
										gotScore = jsonObj[0].ParameterList[j].ParameterValue;
									}

								}
								
								
								tempScoreHm["score_"+$(this).text()] = [(gotScore/100)];

								tempCompHm["competency_"+$(this).text()] = $(this).text();

								tempCounter++;


							});


							var saveObj = [];
							saveObj["scoreHm"] = tempScoreHm;
							saveObj["competencyHm"] = tempCompHm;
			              	
			              	var eventObjToSend = {"pageId":"decision_cycle1","pageData":saveObj};
							$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);


							var eventObjToSend1 = {"pageId":"decision_cycle1_res","pageData":saveObj};
							$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend1);

							loadPage("feedback_show");
			                return;
			              }


			              //Cycle2 and Attemp1
			              if($cycleNum.toString() == "2" && $cycleAttempt.toString() == "1")
			              {
			              	var tempScoreHm = {};
			              	var tempCompHm = {};

			              	var tempCounter = 0;
			              	var competencies =$configXml.find('competencies');
							competencies.children('competency').each(function() {

								var gotScore = 0;
								for(j=0;j<jsonObj[0].ParameterList.length;j++)
								{
									var gotCode = jsonObj[0].ParameterList[j].ParameterCode;

									if(gotCode == $apiCompetencyCodeHm[$(this).text()])
									{
										gotScore = jsonObj[0].ParameterList[j].ParameterValue;
									}

								}
								
								tempScoreHm["score_"+$(this).text()] = [(gotScore/100)];

								tempCompHm["competency_"+$(this).text()] = $(this).text();

								tempCounter++;


							});


							var saveObj = [];
							saveObj["scoreHm"] = tempScoreHm;
							saveObj["competencyHm"] = tempCompHm;
			              	
			              	var eventObjToSend = {"pageId":"decision_cycle1","pageData":saveObj};
							$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);



							var tempScoreHm2 = {};
			              	var tempCompHm2 = {};

			              	var tempCounter2 = 0;
			              	var competencies2 =$configXml.find('competencies');
							competencies2.children('competency').each(function() {

								
								var gotScore = 0;
								for(j=0;j<jsonObj[1].ParameterList.length;j++)
								{
									var gotCode = jsonObj[1].ParameterList[j].ParameterCode;

									if(gotCode == $apiCompetencyCodeHm[$(this).text()])
									{
										gotScore = jsonObj[1].ParameterList[j].ParameterValue;
									}

								}
								
								
								tempScoreHm2["score_"+$(this).text()] = [(gotScore/100)];

								tempCompHm2["competency_"+$(this).text()] = $(this).text();

								tempCounter2++;


							});


							$cycleTimer = new Timer();
							$cycleTimer.setTimeInFormat($cycleTime);

							var saveObj2 = [];
							saveObj2["scoreHm"] = tempScoreHm2;
							saveObj2["competencyHm"] = tempCompHm2;
			              	
			              	var eventObjToSend2 = {"pageId":"decision_cycle2","pageData":saveObj2};
							$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend2);



							loadPage("feedback_show");
			                return;
			              }

			              //Cycle2 and Attemp2
			              if($cycleNum.toString() == "2" && $cycleAttempt.toString() == "2")
			              {
			              	var tempScoreHm = {};
			              	var tempCompHm = {};

			              	var competencies =$configXml.find('competencies');
							competencies.children('competency').each(function() {

								tempScoreHm["score_"+$(this).text()] = 0.5;

								tempCompHm["competency_"+$(this).text()] = $(this).text();

							});

							var saveObj = [];
							saveObj["scoreHm"] = tempScoreHm;
							saveObj["competencyHm"] = tempCompHm;
			              	
			              	var eventObjToSend = {"pageId":"decision_cycle2","pageData":saveObj};
							$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend);


							var eventObjToSend1 = {"pageId":"decision_cycle2_res","pageData":saveObj};
							$eventObj.trigger($eventObj.eventVariables.SAVE_PAGE_DATA,eventObjToSend1);

							loadPage("feedback_show");
			                return;
			              }
			              
			               
							
			            },
			            error: function (parsedjson,textStatus,errorThrown) {

			            	console.log("Error while fetching module details: "+JSON.stringify(parsedjson));
							//console.log(errorThrown);
			            }
			        });
		}


		function callGetModuleDetailsOnly()
		{
			//console.log("callGetModuleDetails");
			var getApiCall = $configXml.find("webApi").find("moduleGet").text();

			$.support.cors = true;
			$.ajax({
			            type: "GET",
			            url: getApiCall,
			            crossDomain:true,
						headers:{"access-control-allow-origin":"*"},
			            data: null,
			            dataType: "json",
			            success: function (data) 
			            {

			               //console.log("Got Success ");
			               //console.log(data);

			               var jsonText = data;

			              var jsonStr = JSON.stringify(data);
			              var jsonObj = jQuery.parseJSON(jsonStr);

			              //console.log("String json "+jsonStr);
			              //console.log("json obj "+jsonObj);

			              var jsonLength = Object.keys(jsonObj).length;

			              $moduleAttemptId=jsonObj[jsonLength-1].ModuleAttemptID;
			              $moduleScore = jsonObj[jsonLength-1].ModuleScore;
			              $moduleStatus = jsonObj[jsonLength-1].ModuleStatus;
			              $moduleTime = jsonObj[jsonLength-1].ModuleTimeTaken;
			              $bookmark = jsonObj[jsonLength-1].Bookmark;
			              $cycleId = jsonObj[jsonLength-1].CycleID;
			              $cycleNum = jsonObj[jsonLength-1].CycleNum;
			              $cycleScore = jsonObj[jsonLength-1].CycleScore;
			              $cycleTime = jsonObj[jsonLength-1].CycleTimeTaken;
			              $cycleAttempt = jsonObj[jsonLength-1].CycleAttemptNumber;
			          },
			            error: function (parsedjson,textStatus,errorThrown) {

			            	console.log("Error while fetching module details: "+JSON.stringify(parsedjson));
							//console.log(errorThrown);
			            }

			              
			       });

	
		}


		
		
		function loadPage(pageId)
		{
			 var eventObjToSend = {"pageId":pageId};
			 $eventObj.trigger($eventObj.eventVariables.LOAD_PAGE_AND_DESTROY_PREVIOUS,eventObjToSend);

		}

		function sendBookmarkValues()
		{
			if($bookmark)
			{
				//console.log('Setting bookmark values '+$bookmark);
				var eventObjToSend = {"pagesData":jQuery.parseJSON($bookmark)};
			 	$eventObj.trigger($eventObj.eventVariables.TAKE_PAGES_DATA_FROM_BOOKMARK,eventObjToSend);
			}
			
		}

		function setBookmarkValue(obj)
		{
			var pagesData = obj["pagesData"];
			$bookmark = JSON.stringify(pagesData);
		}

		function saveData(obj)
		{

			var getApiCall = $configXml.find("webApi").find("modulePost").text();


			//console.log("saveData "+obj);
			var parameterObj = [];
			for(i=0;i<obj["parameterList"].length;i++)
			{
				var tempObj = obj["parameterList"][i];
				var compName = Object.keys(tempObj)[0];
				var compScore = tempObj[compName];




				var apiCode = $apiCompetencyCodeHm[compName];
				//console.log("Got Api Code "+apiCode);

				var tempObj1 = {};
				tempObj1["ParameterCode"]=apiCode;
				tempObj1["ParameterValue"]=compScore;
				parameterObj[parameterObj.length] = tempObj1;
			}

			//console.log("parameterObj");
			//console.log(parameterObj);

			$cycleTimer.stopTimer();

			//console.log("Stopping Timer "+$configXml.find("moduleId").text()+ " "+obj["moduleScore"]+" "+obj["moduleStatus"]+" "+$mainCourseTimer.getTimeInFormat()+" "+obj["cycleNum"]+" "+obj["cycleScore"]);

			var jsonObj = {
				"UserID":null,
				"ModuleID":$configXml.find("moduleId").text(),
				"ModuleAttemptID":$moduleAttemptId,
				"ModuleScore":obj["moduleScore"],
				"ModuleStatus":obj["moduleStatus"],
				"ModuleTimeTaken":$mainCourseTimer.getTimeInFormat(),
				"Bookmark":$bookmark,
				"CycleID":$cycleId,
				"CycleNum":obj["cycleNum"],
				"CycleScore":obj["cycleScore"],
				"CycleTimeTaken":$cycleTimer.getTimeInFormat(),
				"CycleAttemptNumber":obj["cycleAttemptNumber"],
				"ParameterList":parameterObj
			};

			//console.log("JSon Generated");


			var jsonStr1 = JSON.stringify(jsonObj);
			//console.log(" Sending Data "+jsonStr1);
			
			$.support.cors = true;
			$.ajax({
			            type: "POST",
			            url: getApiCall,
			            crossDomain:true,
						headers:{"access-control-allow-origin":"*"},
						contentType: "application/json;charset=utf-8",
			            data: jsonStr1,
			            dataType: "json",
			            success: function (data) {

			               //console.log("Got Success ");
			               //console.log(data);

			               var jsonText = data;

			              var jsonStr = JSON.stringify(data);
			              var jsonObj1 = jQuery.parseJSON(jsonStr);

			              //console.log("String json "+jsonStr);
			              //console.log("json obj "+jsonObj1);

			               //alert("View Model "+jsonObj.ParameterMasterViewModel);

			               callGetModuleDetailsOnly();
			              
			              
							
			            },
			            error: function (parsedjson,textStatus,errorThrown) {

			            	console.log("Error while saving module details: "+JSON.stringify(parsedjson));
							//console.log(errorThrown);
			            }
			        });


		}


		function sendOerData(obj)
		{
			var getApiCall = $configXml.find("webApi").find("moduleOer").text();

			var parameterObj = [];
			for(i=0;i<obj["oerNameList"].length;i++)
			{
				var oerName = obj["oerNameList"][i];
				
				var tempObj1 = {};
				tempObj1["OERResoureName"]=oerName;
				parameterObj[parameterObj.length] = tempObj1;
			}


			var jsonObj = {
				"UserID":null,
				"CycleID":$cycleId,
				"OERREsourceList":parameterObj
			};

			var jsonStr1 = JSON.stringify(jsonObj);
			//console.log(" Sending Data "+jsonStr1);
			
			$.support.cors = true;
			$.ajax({
			            type: "POST",
			            url: getApiCall,
			            crossDomain:true,
						headers:{"access-control-allow-origin":"*"},
						contentType: "application/json;charset=utf-8",
			            data: jsonStr1,
			            dataType: "json",
			            success: function (data) {

			               //console.log("Got Success ");
			                 							
			            },
			            error: function (parsedjson,textStatus,errorThrown) {

			            	console.log("Error while sending OER details: "+JSON.stringify(parsedjson));
							//console.log(errorThrown);
			            }
			        });
		}

		App.registerApiObj( {init:init,
							 saveData:saveData});

})();




