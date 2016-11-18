
(function() {


		var $pageId;
		var $eventObj;

		var init = function (xml,navController,eventObj,pageId)
		{


			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;

			$eventObj = eventObj;


			loadTemplateCss();


			

			renderTextElements(mainDivId,xml,eventObj,navController); //Call in utils.js

		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/splashScreen/splashScreen.css";
			link.media = 'all';
			mainPageDiv.appendChild(link);

			checkFile("pages/"+$pageId+"/"+$pageId+".css",cssCallback);

			initPage();


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

		function initPage()
		{
			//var animTime = 8400;
				//console.log($('.anim-div .splash-animation'))
				var loaded = 0;
				for(var i=1; i<=100;i++){
					var img = new Image();
					
					img.onload = function(){
						console.log("loaded", loaded);
						loaded++;
						if(loaded== 100){
							//console.log("rubn")
							splashSequence();
						}
					}
					img.src = "crops/splash/splashLogo_sprite/"+i+".png";
					$('.anim-div .splash-animation').append(img);
				}
				
				//$('.anim-div .splash-animation').css('background-image','url(crops/splash/splashLogo_sprite/1.png)');
				
		}

		function splashSequence(){
				var i = 1;
				
				var t = setInterval(function(){
					
					//console.log('i = ',i);
					if(i > 99){
						clearInterval(t);
						$('.enter-btn-wrap').addClass('appear');
					}
					else{
						$('.anim-div .splash-animation img').removeClass("active");
						$('.anim-div .splash-animation img').eq(i).addClass("active");

						i++;
					}
				}, 80);
			}


		function destroyPage()
		{
			//console.log("Into Page Destroy");
		}
		
		App.register( {init:init,destroyPage:destroyPage});


})();




