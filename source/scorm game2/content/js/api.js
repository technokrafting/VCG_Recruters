(function() {


		var $configXml;
		var $moduleId,$userId,$moduleAttemptId,$moduleTime,$moduleScore,$moduleStatus,$bookmark;
		var $cycleId,$cycleNum,$cycleScore,$cycleTime,$cycleAttempt,$parameterObj;
		var $eventObj;
		var $compDataArr = {};
		var $mainCourseTimer;
		var $cycleTimer;
		var $apiCompetencyCodeHm = {};

		var $score = 0;
				
			
		function init(eventObj)
		{
			$eventObj = eventObj;


			$eventObj.registerForEvent($eventObj.eventVariables.SAVE_DATA_TO_API,saveCourseData);
			
			//$eventObj.registerForEvent($eventObj.eventVariables.SET_USER_STATUS_PASSED,setPassed);
			$eventObj.registerForEvent($eventObj.eventVariables.SET_USER_SCORE,setScore);

				
			//var xmlPath = "config.xml";
			//loadAndParseXml(xmlPath,configXmlLoaded);

			var result = false;

			var result = LMSIsInitialized();
			if (result == false) 
			{
			 	var subResult = LMSInitialize();

			 	console.log('LMSInitialize',subResult);
			 	if(subResult != "true")
			 	{
			 		console.log('LMSInitialize is False');
			   		return false;
			 	}
			 	else
			 	{
			 		console.log('LMSInitialize Successful');
			 	}

			}
			else
			{
				LMSInitialize();
				console.log('Already Initialized');
			}

			$cycleTime = LMSGetValue('cmi.total_time');

			console.log('Got Scorm Time',$cycleTime);

			$cycleTimer = new Timer();
			$cycleTimer.setTimeInFormat($cycleTime);


			$cycleTimer.startTimer();


			$bookmark = LMSGetValue('cmi.suspend_data');

			sendBookmarkValues();

			$isPassed = LMSGetValue('cmi.success_status');

			return true;
		}


		function setScore(obj)
		{
			$score = parseInt(obj['score']);

			//saveCourseData(null);

			$eventObj.trigger($eventObj.eventVariables.COURSE_EXIT,{});
		}
		

		function configXmlLoaded(xml)
		{
			$configXml = xml;
			
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

		function saveCourseData(obj)
		{

			console.log('Pages Data ',obj["pagesData"]);
			var cycleTime = $cycleTimer.getTimeInFormat();
			LMSSetValue("cmi.total_time", cycleTime);

			if($score > 0)
			{
				LMSSetValue("cmi.completion_status", 'complete');
				LMSSetValue("cmi.success_status", "passed");

				if(parseInt(LMSGetValue('cmi.score.raw')) < parseInt($score))
				{
					LMSSetValue("cmi.score.raw", $score);
				}

				LMSSetValue('cmi.suspend_data','');

			}
			else
			{
				//Suspend Data Set

				LMSSetValue("cmi.completion_status", 'incomplete');
				LMSSetValue("cmi.success_status", "failed");

				var pagesData = obj["pagesData"];
				$bookmark = JSON.stringify(pagesData);

				LMSSetValue('cmi.suspend_data',$bookmark);
			}


			LMSCommit();

		}

		App.registerApiObj( {init:init});

})();




