const timeflow = new gPlugin({
  name: "Time Flow"
})
const dm1 = new dropMenu({
	id:"timeflow_dropmenu"
});
timeflow.createData({
    "times":["0","0","0","0","0","0","0"],
    "today":new Date(),
    "status":"desactivated"
});
var _started = new Date().getTime();
var _now = 0 ;
var days;
var times = timeflow.getData()["times"];
times.splice(0,1);
timeflow.setData("times",times);
function graphic(){
	const new_times = timeflow.getData()["times"];
        days = `
        <div id="timeflow_content">
			  <p> TimeFlow <p>
			  <div id="D1" class="day">
			  <div class="activity" style=" height:`+(new_times[0]/200000)+"px"+`"></div></div>
			  <div id="D2" class="day">
			  <div class="activity" style=" height:`+(new_times[1]/200000)+"px"+`"></div></div>
			  <div id="D3" class="day">
			  <div class="activity" style=" height:`+(new_times[2]/200000)+"px"+`"></div></div>
			  <div id="D4" class="day">
			  <div class="activity" style=" height:`+(new_times[3]/200000)+"px"+`"></div></div>
			  <div id="D5" class="day">
			  <div class="activity" style=" height:`+(new_times[4]/200000)+"px"+`"></div></div>
			  <div id="D6" class="day">
			  <div class="activity" style=" height:`+(new_times[5]/200000)+"px"+`"></div></div>
			  <div id="D7" class="day">
			  <div class="activity" style=" height:`+(new_times[6]/200000)+"px "+`"></div></div>
				</div>
				<span class="line_space_menus"></span>
				<gv-switch  onclick="switchTimeFlow()" class="`+timeflow.getData()["status"]+`"></gv-switch>

				`;
				var myDropmenu ={
				  "button": "Time Flow",
				  "custom":days,
				  "list":{
				  	"*line":"",
				  	"Information":"timeflowInfo()"
				  }
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
		loop();
	}else timeflow.setData("status","desactivated");
}
function loop(){
	let seveTS = new Promise(() => {
      let wait = setTimeout(() => {
        _now = ((new Date().getTime()-_started)/1000).toFixed(2);
        time = secondsToTime(_now);
        let new_data = timeflow.getData()["times"];
        new_data[6] = _now;
        timeflow.setData("times",new_data);
        graphic();
	      if(timeflow.getData()["status"] ==="activated"){
	      		loop();
	      }	   
      }, 3000000) //Call the function every 5minutes 300000
  });
  
  let race = Promise.race([
    seveTS
  ]);

}
loop();

function timeflowInfo(){
	createDialog('timeflow_info', selected_language['About']+" Timeflow" ,
      "Time collets the time you are coding by saving <strong>locally</strong> the data."
      ,
      selected_language['Accept'] 
      ,null,'closeDialog(this)','')
}