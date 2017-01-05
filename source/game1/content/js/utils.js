function loadXml(url,successFunction)
{
    $.ajax({
    type: "GET",
    url: url,
    dataType: "xml",
    success: function (xml) {

        successFunction(xml);
    }
    });
}

function loadAndParseXml(url,successFunction,pageId,callback)
{
    //console.log(pageId+" loadAndParseXml Utils "+url);
    $.ajax({
    type: "GET",
    url: url+"?"+(new Date()),
    dataType: "xml",
    success: function (xml) {

            //console.log(" Xml Loaded "+xml);
            
             var xml = $(xml);
          
            successFunction(xml,pageId,callback);
        }
    });
}

function checkFile(url,callBackFunction)
{
    $.ajax({
    type: "GET",
    url: url,
    async: false,
    success: function (xml) {

        callBackFunction(true);
    },
    error: function (xml) {

        callBackFunction(false);
    }
    });
}

function renderTextElements(divId,xml,event,navigator)
{
    //console.log("renderTextElements "+divId);
    
    if(xml)
    {
         $('#'+divId).find(".text-block").each(function(i){
                
                $(this).html(xml.find($(this).attr("id")).text());
            })
    }
    else
    {
        return;
    }

    if(event)
    {
         $('#'+divId).find(".popup-text-block").each(function(i){
                
                $(this).html(xml.find($(this).attr("id")).text());

                ////console.log("Getting Id "+$(this).attr("id"));
                var pageId = xml.find($(this).attr("id")).attr("pageId");
                //console.log($(this).closest('div').attr('id')+" Loading Popup On Click "+pageId);

                $(this).parent().click(function() {

                    var eventObjToSend = {"pageId":pageId};
                    event.trigger(event.eventVariables.LOAD_PAGE,eventObjToSend);

                 });

                
            })

         var pageZone = xml.find("page").attr("zone");
            if(pageZone)
            {
                var eventObjToSend = {"menuName":pageZone};
                event.trigger(event.eventVariables.SET_MENU_ACTIVE,eventObjToSend);
            }


    }

    if(navigator)
    {
         $('#'+divId).find(".next-text-block").each(function(i){
                
                $(this).html(xml.find($(this).attr("id")).text());

                //console.log("Getting Id "+$(this).attr("id"));
                var pageId = xml.find($(this).attr("id")).attr("pageId");
                //console.log("Got Page id in controller "+pageId);

                $(this).closest('div').click(function() {

                    navigator.navigate(pageId);

                 });

                
            })
    }

   
}

 function setDelay(delay, callback)
    {
        var t = setTimeout(function(){
            
            if(callback)
            {
                callback();
                clearTimeout(t);
            }
            
        }, delay);
    }



function Timer(){


    var timerCounter = 0;
    var timeoutFunc;

    this.setData = function(initTime)
    {
        timerCounter = initTime;
    };

    this.startTimer = function()
    {
        //console.log("Starting Timer");
        timeoutFunc = setInterval(function(){ timerCounter = timerCounter + 1; //console.log("Recurring "+timerCounter);
        }, 1000);
    };

    this.pauseTimer = function()
    {
        clearInterval(timeoutFunc);
    };

    this.resumeTimer = function()
    {
        timeoutFunc = setInterval(function(){ timerCounter = timerCounter + 1; }, 1000);
    };

    this.stopTimer = function()
    {
        clearInterval(timeoutFunc);
    };

    this.getTime = function()
    {
        return timerCounter;
    };

    this.getTimeInFormat = function()
    {
        var h = Math.floor(timerCounter / 3600),
        m = Math.floor(timerCounter / 60) % 60,
        s = timerCounter % 60;
        if (h < 10) h = "0" + h;
        if (m < 10) m = "0" + m;
        if (s < 10) s = "0" + s;

        var pythonDate = 'PT'+h+'H'+m+'M'+s+'S'; 

        console.log('Sending Time ',pythonDate);
        return pythonDate;

    }

    this.setTimeInFormat = function(timeInHHMMSS)
    {
        console.log("setTimeInFormat "+timeInHHMMSS);

        timeInHHMMSS = timeInHHMMSS.substring(2,timeInHHMMSS.length);

        console.log('Got PT String',timeInHHMMSS);

        var hh = timeInHHMMSS.substring(0,timeInHHMMSS.indexOf('H'));
        var mm = timeInHHMMSS.substring(timeInHHMMSS.indexOf('H')+1,timeInHHMMSS.indexOf('M'));
        var ss = timeInHHMMSS.substring(timeInHHMMSS.indexOf('M')+1,timeInHHMMSS.length-1);

        console.log('Calculated Time',hh,mm,ss);

        var hms = hh+":"+mm+":"+ss;   // your input string
        var a = hms.toString().split(':'); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        //console.log("Got Split "+a[0]+ " "+a[1]+" "+a[2]);

        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        timerCounter = seconds;
    }


}



