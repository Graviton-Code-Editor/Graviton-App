
const timeSpentDir = "_time_spent.json";

var week = " ";

var _started = new Date().getTime();
var _now ;
var time;
function loadGraphic(){

	var g_content = document.getElementById('graphic_content');


  var days = `
  <p>  Last 7 times:<p>
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
      daysDivs[i].children[0].style.height = (week[i]*8)+"px";

    }
  }



	
 _now = ((new Date().getTime()-_started)/1000).toFixed(2);;

	
	 time = secondsToTime(_now);
	document.getElementById("today").innerText = "Today: " +time.h+"h : "+time.m+"min : "+time.s+"s";

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
	_now = ((new Date().getTime()-_started)/1000).toFixed(2);;

	time = secondsToTime(_now);

	week.splice(0,1);
	week[6] = time.h;
	
	var weekOut = {"week":week};
	weekOut = JSON.stringify(weekOut);

	fs.writeFile(timeSpentDir, weekOut, (err) => {
    if (err) {
      alert("An error ocurred updating the file" + err.message);
      console.log(err);
      return;
    }
  });
}

function loadTimeSpent(){


	fs.readFile(timeSpentDir, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  week = JSON.parse(data)["week"];
  console.log(week);
 		
 });
	if(_firsTime === false){

	 welcomePage();
	}else{
		FirstTime();
	}

}






