
(function() {

	
	var eventVariables = {


	SET_MENU_ACTIVE: "SET_MENU_ACTIVE",
	CLEAR_POPUP: "CLEAR_POPUP",
	HIDE_POPUP: "HIDE_POPUP",
	DESTROY_POPUP: "DESTROY_POPUP",
	LOAD_PAGE: "LOAD_PAGE",
	ENABLE_DECISION_SUBMIT: "ENABLE_DECISION_SUBMIT",
	DISABLE_DECISION_SUBMIT: "DISABLE_DECISION_SUBMIT",
	DESTROY_ACTIVITY_SCREEN: "DESTROY_ACTIVITY_SCREEN",
	REQUEST_ACTIVITY_DATA: "REQUEST_ACTIVITY_DATA",
	DISPATCH_ACTIVITY_DATA: "DISPATCH_ACTIVITY_DATA",
	RESTORE_ACTIVITY_DATA: "RESTORE_ACTIVITY_DATA",
	ACTIVITY_PAGE_LOADED: "ACTIVITY_PAGE_LOADED",
	NEED_ACTIVITY_USER_DATA: "NEED_ACTIVITY_USER_DATA",
	SEND_ACTIVITY_USER_DATA: "SEND_ACTIVITY_USER_DATA",
	PAGE_LOADED: "PAGE_LOADED",
	LOAD_PAGE_AND_DESTROY_PREVIOUS: "LOAD_PAGE_AND_DESTROY_PREVIOUS",
	SAVE_PAGE_DATA: "SAVE_PAGE_DATA",
	GIVE_PAGE_DATA: "GIVE_PAGE_DATA",
	TAKE_PAGE_DATA: "TAKE_PAGE_DATA",
	INIT_DECISION_SCREEN: "INIT_DECISION_SCREEN",
	FEEDBACK_SCREEN_LOADED: "FEEDBACK_SCREEN_LOADED",
	HOW_TO_PROCEED_CLICK: "HOW_TO_PROCEED_CLICK",
	DESTROY_PAGE: "DESTROY_PAGE",
	LOAD_LATEST_DECISION_SCREEN: "LOAD_LATEST_DECISION_SCREEN",
	SAVE_DATA_TO_API: "SAVE_DATA_TO_API",
	TAKE_PAGES_DATA_FROM_BOOKMARK: "TAKE_PAGES_DATA_FROM_BOOKMARK",
	TAKE_PAGE_DATA_FOR_BOOKMARK: "TAKE_PAGE_DATA_FOR_BOOKMARK",
	SEND_OER_DATA: "SEND_OER_DATA",
	LOAD_BACKGROUND_AUDIO: "LOAD_BACKGROUND_AUDIO",
	BG_AUDIO_LOADED: "BG_AUDIO_LOADED",
	PLAY_BACKGROUND_AUDIO: "PLAY_BACKGROUND_AUDIO",
	STOP_BACKGROUND_AUDIO: "STOP_BACKGROUND_AUDIO",
	PLAY_AUDIO: "PLAY_AUDIO",
	GET_AUDIO_STATUS: "GET_AUDIO_STATUS",
	TAKE_AUDIO_STATUS: "TAKE_AUDIO_STATUS",
	SET_AUDIO_OFF: "SET_AUDIO_OFF",
	SET_AUDIO_ON: "SET_AUDIO_ON",
	SET_USER_SCORE: "SET_USER_SCORE",
	COURSE_EXIT: "COURSE_EXIT",
	}
	var eventNameHm = {};

	
	var createEvent = function(nameOfEvent)
	{

			var newEventRegHm = [];
			eventNameHm[nameOfEvent] = newEventRegHm;

	}
	

	var registerForEvent = function(eventName,callback) {
		
		if(eventNameHm[eventName])
		{
			//console.log("registerForEvent ");
			var callbackArr = eventNameHm[eventName];
			callbackArr[callbackArr.length] = callback;
		}
		else
		{
			createEvent(eventName);
			registerForEvent(eventName,callback);
			////console.log("No Event With name "+eventName+" is available");
		}
		
	};

	var trigger = function(eventName,dataObj) {
		
		if(eventNameHm[eventName])
		{
			var callbackArr = eventNameHm[eventName];
			var length = callbackArr.length;

			//console.log(eventName+" Triggering Event "+callbackArr.length);

			for(i=0;i<length;i++)
			{
				//console.log(callbackArr.length+" Looping "+i+" "+eventName);
				try {
				    var callback = callbackArr[i];

				    ////console.log(eventName+" Triggering Event "+callback);
				    console.log(callbackArr.length+" Got Callback "+i+" "+eventName);

					callback(dataObj);

					//console.log(callbackArr.length+" Callback Complete "+i+" "+eventName);

				}
				catch(exception){ 

					console.log("Error in Function "+ exception.message);
					callbackArr.splice(i, 1);

				}
				
			}	
		}
		else
		{
			//console.log("No Event With name "+eventName+" is available for Trigger");
		}
					
	};

	var unRegisterEvent = function(eventName,callback)
	{
		var callbackArr = eventNameHm[eventName];
		var index = callbackArr.indexOf(callback);
		if(index != -1)
		{
			//console.log(eventName+" unRegister Got Index ");
			callbackArr.splice(index, 1);
		}
		

	}

	
	App.registerEventObj({createEvent:createEvent,registerForEvent:registerForEvent,trigger:trigger,eventVariables:eventVariables,unRegisterEvent:unRegisterEvent});

	
	
})();
