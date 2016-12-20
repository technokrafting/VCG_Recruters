
(function() {


		var $pageId;
		var $eventObj;

		var $currentSelectedOption;
		var $comptency;
		var $correctOptions = [];
		var $showPopup = true;
		var $totalRows = 0;
		var $compCorrectTotal = {};


		var init = function (xml,navController,eventObj,pageId)
		{

			//console.log("Before Timer");

			var mainDivId = "mainPageDiv_"+pageId;
			var mainDiv = document.getElementById('mainPageDiv');
			mainDiv.id = mainDivId;
			
			$pageId = pageId;
			loadTemplateCss();

			

			renderTextElements(mainDivId,xml); //Call in utils.js

			$eventObj = eventObj;
			
			
			renderCorrectAnswers(xml);
			renderTable(xml);

			
			

			$comptency = xml.find('question').attr("competency");

			$eventObj.trigger($eventObj.eventVariables.DISABLE_DECISION_SUBMIT,null);

			$eventObj.registerForEvent($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,destroyPage);
			$eventObj.registerForEvent($eventObj.eventVariables.REQUEST_ACTIVITY_DATA,sendData);
			$eventObj.registerForEvent($eventObj.eventVariables.RESTORE_ACTIVITY_DATA,restoreData);



			setTimeout(function(){ 

					var initPopup = xml.find('initPopup').text();
					if(initPopup && $showPopup == true)
					{
						//console.log(" Got init Popup Id "+initPopup);
						var eventObjToSend = {"pageId":initPopup};
		                eventObj.trigger(eventObj.eventVariables.LOAD_PAGE,eventObjToSend);
					}

				}, 100);


			


		}

		function renderCorrectAnswers(xml)
		{
			var answers = xml.find('answers');
			////console.log(answers);
			var answersArr = answers.text().split(',');

			var tempAnsHm = {};

			for(i=0;i<answersArr.length;i++)
			{
				////console.log("Got Answers "+answersArr[i]);
				$correctOptions[i] = answersArr[i];


				var charOfId = answersArr[i].toString().charAt(answersArr[i].toString().length-1);
					
					if(!tempAnsHm[charOfId])
					{
						var arr = [];
						tempAnsHm[charOfId] = arr;
						$totalRows++;
					}

					if(!$compCorrectTotal[charOfId])
					{
						$compCorrectTotal[charOfId] = 1;
					}
					else
					{
						var num = $compCorrectTotal[charOfId];
						num = num+1;
						$compCorrectTotal[charOfId] = num;
					}
					
			}

			////console.log($correctOptions);
		}

		function renderTable(xml)
		{
			//console.log("renderTable ");

			var actTable  = document.getElementById('actTable');

			var tempParams = xml.find('params');

			var tds = '<thead>';
			tds = tds + '<tr class=tableHead>';

			tds = tds+ '<th class=headTh id="paramHead">'+tempParams.attr('paramHead')+'</th>'; //To Give column for params

			var heads = xml.find('heads');

			heads.children('head').each(function() {

				var headText = $(this).text();

				tds = tds+ '<th class=headTh>'+headText+'</th>';
				
			});

			var tds = tds + '</tr>';

			tds = tds + '</thead>';

			$("#actTable").append(tds);

			var params = xml.find('params');

			params.children('param').each(function() {

				var paramId = $(this).attr("id");
				var paramText = $(this).text();
				var tabPageId = $(this).attr("tabPageId");
				var tabWidth = $(this).attr("tabWidth");
				var tabHeight = $(this).attr("tabHeight");



				var tds = '<tr class=tableRow id='+paramId+'>';

				tds = tds+ '<td class="dataTd profDetails" id=prof'+paramId+'>'+ paramText +'</td>';

				var heads = xml.find('heads');

				heads.children('head').each(function() {

					var headId = $(this).attr("id");
					var headText = $(this).text();

					var checkId = headId+paramId;

					var checkBoxDef = '<div class=checkBox isChecked=no id='+checkId+'></div>';

					tds = tds+ '<td class="dataTd">'+checkBoxDef+'</td>';

				});

				
				$("#dataTable").append(tds);

				$('#prof'+paramId).click(function() {

					//alert(tabPageId+" Opening "+tabWidth + " "+tabHeight);
					window.open("tabs/launcher.html?tabId="+tabPageId+"~title=Management Profile", "launcherTab", "width="+tabWidth+", height="+tabHeight+",resizable=no");

				});

			});

			$('.checkBox').each(function(){
				
					$(this).click(function() {

						var checkedAttr = $(this).attr("isChecked");
						//console.log("Got Chk Attribute "+checkedAttr);

						if(checkedAttr == 'no')
						{
							$(this).attr('isChecked','yes')
							$(this).addClass( "checkActive" );
						}
						else
						{
							$(this).attr('isChecked','no');
							$(this).removeClass( "checkActive" );
						}	

						if($('.checkActive').length == 0)
						{
							$eventObj.trigger($eventObj.eventVariables.DISABLE_DECISION_SUBMIT,null);
						}
						else
						{
							$eventObj.trigger($eventObj.eventVariables.ENABLE_DECISION_SUBMIT,null);
						}
						
					});


				});

			////console.log('Before //console');
			////console.log($('.checkActive'));

			//$eventObj.trigger($eventObj.eventVariables.ENABLE_DECISION_SUBMIT,null);
		}

		function loadTemplateCss()
		{
			var mainPageDiv  = document.getElementById('mainPageDiv_'+$pageId);
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = "pages/templates/MMCMS/MMCMS.css";
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


		function destroyPage(eventObj)
		{
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{
				$eventObj.unRegisterEvent($eventObj.eventVariables.DESTROY_ACTIVITY_SCREEN,destroyPage);
				$eventObj.unRegisterEvent($eventObj.eventVariables.REQUEST_ACTIVITY_DATA,sendData);
				$eventObj.unRegisterEvent($eventObj.eventVariables.RESTORE_ACTIVITY_DATA,restoreData);

				$('#mainPageDiv_'+$pageId).closest('div').removeClass().empty();
			
				//console.log("Into Page Destroy "+$pageId);
			}
			
		}

		function sendData(eventObj)
		{

			var optArr =  [];
				
			var pageId = eventObj["pageId"];
			if(pageId == $pageId)
			{

				
				var ansHm = {};
				
				$('.checkActive').each(function(){

					var chkId = $(this).attr('id');

					//console.log("Got Checked Id "+chkId);

					var charOfId = chkId.toString().charAt(chkId.toString().length-1);
					//console.log(chkId+" Got char At "+charOfId);

					var arr;

					if(!ansHm[charOfId])
					{
						arr = [];
						ansHm[charOfId] = arr;
					}
					else
					{
						arr = ansHm[charOfId];
					}

					arr[arr.length] = chkId;

					optArr[optArr.length] = chkId;

				});


				var scoreToSend = 0;


				var keysArr = Object.keys(ansHm);
				for(i=0;i<keysArr.length;i++)
				{
					var key = keysArr[i];
					var arr = ansHm[key];

					var correctSelected = 0;
					var incorrectSelected = 0;

					var rowScore = 0;

					for(j=0;j<arr.length;j++)
					{
						var gotChkId = arr[j];
						if($correctOptions.indexOf(gotChkId) != -1)
						{
							correctSelected++;
						}
						else
						{
							//console.log(gotChkId+" Got Incorrect  ");
							incorrectSelected++;
						}

						//console.log(gotChkId+" Checking  "+correctSelected + " "+incorrectSelected);

					}

					if(incorrectSelected >= correctSelected)
					{
						rowScore = 0;
					}
					else
					{
						var totalCorrectAns = $compCorrectTotal[key];
						var correctAvg = correctSelected - incorrectSelected;
						rowScore = ((correctAvg/totalCorrectAns)*100);
					}

					
					scoreToSend = scoreToSend + rowScore;
					
					//console.log(arr.length+" Got Row Score  "+scoreToSend + " "+arr.length);

				}

				//console.log($totalRows+" scoreToSend "+scoreToSend);

				scoreToSend = Math.round(scoreToSend / $totalRows);
				//console.log(" Round "+scoreToSend);

				if(scoreToSend != 0)
					scoreToSend = (scoreToSend / 100).toFixed(2);


				//console.log(" Current Answers "+scoreToSend);
				
				var actData = {};


				var optScoreArr = [];
				optScoreArr[0] = scoreToSend;

				actData[0] = $pageId;
				actData[1] = $comptency;
				actData[2] = optArr;
				actData[3] = optScoreArr;

				var eventObjToSend = {"actData":actData};

				////console.log("Sending Act Data ");
				////console.log(eventObjToSend);

				//console.log("Sending Data "+$pageId);
				
				$eventObj.trigger($eventObj.eventVariables.DISPATCH_ACTIVITY_DATA,eventObjToSend);

			}
		}

		function restoreData(eventObj)
		{

			//console.log("restoreData MMCMS");

			var actData = eventObj["actData"];

			if(actData[0] == $pageId)
			{
	
				$showPopup = false;

				$('.checkBox').off();

				var optArr = actData[2];

				for(i=0;i<optArr.length;i++)
				{
					$('#'+optArr[i]).addClass( "checkActive" );
				}


			}
			

		}


		
		App.register( {init:init,destroyPage:destroyPage});


})();




