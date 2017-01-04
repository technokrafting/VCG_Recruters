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

			$cycleTime = LMSGetValue('cmi.session_time');

			console.log('Got Scorm Time',$cycleTime);

			$cycleTimer = new Timer();
			$cycleTimer.setTimeInFormat($cycleTime);


			$cycleTimer.startTimer();


			$bookmark = LMSGetValue('cmi.suspend_data');


			console.log('Got Suspend Data from LMS ',$bookmark);
			console.log('Got Location from LMS ',LMSGetValue('cmi.location'));

			sendBookmarkValues();

			$isPassed = LMSGetValue('cmi.success_status');

			$eventObj.trigger($eventObj.eventVariables.COURSE_EXIT,{});

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
			

			console.log('Got $score',$score);

			if($score > 0)
			{
				console.log('Into passed',parseInt(LMSGetValue('cmi.score.raw')),isNaN(parseInt(LMSGetValue('cmi.score.raw'))));

				LMSSetValue("cmi.completion_status",'complete');
				LMSSetValue("cmi.success_status", "passed");

				if(isNaN(parseInt(LMSGetValue('cmi.score.raw'))) == true)
				{
					console.log('Setting Raw as 0');
					LMSSetValue('cmi.score.raw',0);
				}

				console.log('After Set Raw',parseInt(LMSGetValue('cmi.score.raw')),parseFloat(($score/3000)));

				if(parseInt(LMSGetValue('cmi.score.raw')) < parseInt($score))
				{
					LMSSetValue("cmi.score.raw", parseInt($score));
					LMSSetValue("cmi.score.scaled", parseFloat(($score/3000)));
				}

				LMSSetValue('cmi.suspend_data','');
				LMSSetValue("cmi.exit", "");

			}
			else
			{
				//Suspend Data Set

				LMSSetValue("cmi.completion_status",'incomplete');
				LMSSetValue("cmi.success_status", "failed");
				//LMSSetValue("cmi.location", "location set");


				var pagesData = obj["pagesData"];
				$bookmark = JSON.stringify(pagesData);

				LMSSetValue('cmi.suspend_data',$bookmark);
				LMSSetValue("cmi.exit", "suspend");
			}

			var cycleTime = $cycleTimer.getTimeInFormat();
			LMSSetValue("cmi.session_time", cycleTime);

			LMSCommit();

		}

		App.registerApiObj( {init:init});

})();




