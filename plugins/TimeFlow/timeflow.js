
const timeflow = new gPlugin({
  name: "Time Flow"
})
const dm1 = new dropMenu();
timeflow.createData({
    "week":["0","0","0","0","0","0","0"],
    "today":new Date(),
    "status":"desactivated"
});
var _started = new Date().getTime();
var _now = 0 ;
var days;
var myWeek = timeflow.getData()["week"];
myWeek.splice(0,1);
timeflow.setData("week",myWeek);
function graphic(){
	const week = timeflow.getData()["week"];
        days = `
        <div id="timeflow_content">
			  <p> TimeFlow <p>
			  <div id="D1" class="day">
			  <div class="activity" style=" height:`+(week[0]/200000)+"px"+`"></div></div>
			  <div id="D2" class="day">
			  <div class="activity" style=" height:`+(week[1]/200000)+"px"+`"></div></div>
			  <div id="D3" class="day">
			  <div class="activity" style=" height:`+(week[2]/200000)+"px"+`"></div></div>
			  <div id="D4" class="day">
			  <div class="activity" style=" height:`+(week[3]/200000)+"px"+`"></div></div>
			  <div id="D5" class="day">
			  <div class="activity" style=" height:`+(week[4]/200000)+"px"+`"></div></div>
			  <div id="D6" class="day">
			  <div class="activity" style=" height:`+(week[5]/200000)+"px"+`"></div></div>
			  <div id="D7" class="day">
			  <div class="activity" style=" height:`+(week[6]/200000)+"px "+`"></div></div>
				<span class="line_space_menus"></span>
				<gv-switch  onclick="switchTimeFlow()" id="time_spent_allow" class="`+timeflow.getData()["status"]+`"></gv-switch>
				</div>
				`;
				var myDropmenu ={
				  "button": "TimeFlow",
				  "custom":days,
				}
				dm1.setList(myDropmenu)

					const activities = document.getElementsByClassName("activity");

					for(i=0;i<activities.length;i++){
							activities[i].addEventListener("mouseover",function(){
								const floatingwin = new floatingWindow([100,100],`
								<div style='height:100px; width:100px;'>
									<p style="color:white">
										${((this.style.height.replace(/([a-z])\w+/g,"")*200000)/60000).toFixed(0)+"minutes"}
									</p>
								</div>`) 
							//On hover on every day
							}, false);
					}
}
graphic();
function switchTimeFlow(){
	if(timeflow.getData()["status"]=="desactivated"){
		timeflow.setData("status","activated");
	}else timeflow.setData("status","desactivated");
}
function loop(){
	let seveTS = new Promise(() => {
      let wait = setTimeout(() => {
       
        _now = ((new Date().getTime()-_started)/1000).toFixed(2);
        time = secondsToTime(_now);
        let new_data = timeflow.getData()["week"];
        new_data[6] = _now;
        timeflow.setData("week",new_data);
        graphic();
	      if(timeflow.getData()["status"] ==="activated"){
	      		loop();
	      }	
      
          
      }, 300000) //Call the function every 5minutes 300000
  });
  
  let race = Promise.race([
    seveTS
  ]);

}
loop();

