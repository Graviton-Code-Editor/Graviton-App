



function dropmenu(id) {
    var dropdowns = document.getElementsByClassName("dropdown-content");

    for (i = 0; i < dropdowns.length; i++) {
      if(dropdowns[i].id != id){
        dropdowns[i].classList.replace("show","hide");  //Close the other menus
      }else{
        if (dropdowns[i].classList.contains('show')) {
          dropdowns[i].classList.replace("show","hide"); //If clicked menu is opened
        }else{
          dropdowns[i].classList.replace("hide","show");  //If clicked menu is closed
          if(id=="graphic"){
            loadGraphic();
          }
        }

      }
    }
  
	    
	}
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");

    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.replace('show',"hide");
      }
    }
  }
	
}


