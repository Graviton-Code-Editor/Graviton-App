/* Just testing */

const dreble = new Plugin({
  name: "GitTest"
})
const drebledm = new dropMenu({
	id:"dreble_dm"
});
drebledm.setList({
  "button": "Dreble",
  "list":{
  	"Navigations":"nav_window.launch()"
  }
})
const nav_window = new Window({
	id:"navigationWindow",
	content:`
	<h2 class="window_title">Navigations</h2> 
  <div class="section">
  	<p>Just testing.</p>
    <button class="button1" onclick="">Testing</button>
  </div>
	`
})
