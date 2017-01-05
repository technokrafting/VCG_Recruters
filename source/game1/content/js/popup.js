(function() {


		var $eventObj;
		var $popupDiv;
			
		function init(popupDiv,eventObj)
		{
			$popupDiv = popupDiv;
			$eventObj = eventObj;

			$eventObj.registerForEvent($eventObj.eventVariables.CLEAR_POPUP,clearCurrentPopupScreen);
			$eventObj.registerForEvent($eventObj.eventVariables.HIDE_POPUP,hidePopupScreen);

		}

		function clearCurrentPopupScreen()
		{
			$eventObj.trigger($eventObj.eventVariables.DESTROY_POPUP,null);


			//console.log(" Into clearCurrentPopupScreen Function ");
			$popupDiv.fadeOut(500,function(){

				//console.log("Into clearCurrentPopupScreen ");
				$popupDiv.removeClass().empty();

			});
			
			//$popupDiv.hide();
		}

		function hidePopupScreen(eventObj)
		{
			$popupDiv.removeClass().empty();
			$popupDiv.hide();

		}

		

		App.registerPopupObj( {init:init});

})();




