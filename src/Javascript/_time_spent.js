
var week ="";
var today ;

var _started = new Date().getTime();
var _now = 0 ;
var time;

var allow_time_spent = "activated";
saveTimeSpent();
function loadGraphic(){

	var g_content = document.getElementById('graphic_content');

  var days = `
  <p>  `+selected_language["Phrase7"]+`<p>
  <div id="D1" class="day">
  <div class="activity"></div></div>
  <div id="D2" class="day">
  <div class="activity"></div></div>
  <div id="D3" class="day">
  <div class="activity"></div></div>
  <div id="D4" class="day">
  <div class="activity"></div></div>
  <div id="D5" class="day">
  <div class="activity"></div></div>
  <div id="D6" class="day">
  <div class="activity"></div></div>
  <div id="D7" class="day">
  <div class="activity"></div></div>
  <p id="today"></p>`;

  g_content.innerHTML = days;

  let daysDivs = document.getElementsByClassName("day");
  var i = 0;
  for(i=0;i<daysDivs.length; i++){
   

    if(week[i]==0){
      daysDivs[i].children[0].style.background = "var(--dropmenu-disabled)";
    }else{
      daysDivs[i].children[0].style.height = (week[i]/250000)+"px";

    }
  }
          _now = ((new Date().getTime()-_started)/1000).toFixed(2);;
          time = secondsToTime(_now);
          document.getElementById("today").innerText = selected_language["Phrase8"] +time.h+"h : "+time.m+"min : "+time.s+"s";
          
}

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}


function saveTimeSpent(){

  
  let seveTS = new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        if(allow_time_spent ==="activated"){
          clearTimeout(wait);

          _now = ((new Date().getTime()-_started)).toFixed(2); 
          if( _now > 55000000 ){ 
            RealToday = JSON.stringify(new Date()); //Will be restarted every 15 hours
          }
          time = secondsToTime(_now);
          
          fs.readFile(timeSpentDir, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          week = JSON.parse(data)["week"];
          today = JSON.parse(data)["today"];

          if(RealToday !==today){
            week.splice(0,1); //Creating a new line
          }
          
          week[6] = _now;

          var data = {"week":week,"today": RealToday};
          data = JSON.stringify(data);
          fs.writeFile(timeSpentDir, data, (err) => {
            if (err) {
              console.log(err);
              return;
            }
          });

          saveTimeSpent();
        });
    

        }
          
      }, 300000) //Call the function every 5minutes
  });
  
  let race = Promise.race([
    seveTS
  ]);

}

function loadTimeSpent(){

  if(allow_time_spent==="activated"){

      

      if (!fs.existsSync(timeSpentDir)) {

        var data = {"week":["0","0","0","0","0","0","0"],"today": JSON.stringify(new Date())};
        data = JSON.stringify(data);
        fs.writeFile(timeSpentDir, data, (err) => { });//Create the TimeSpent JSON file 
        week = JSON.parse(data)["week"];
        today = JSON.parse(data)["today"];

      }else{

           fs.readFile(timeSpentDir, 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          week = JSON.parse(data)["week"];
          today = JSON.parse(data)["today"];
          });

      }
   
  }else{

     document.getElementById("graphicDiv").style = "display:none"; //Hide the TimeSpent button of toolbar
  
  }
	if(_firsTime === false){
	 welcomePage();
	}else{
		FirstTime();
	}

}






