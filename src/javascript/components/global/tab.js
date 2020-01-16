

function retrieveTab({ id, name, data, screen, type, longpath = "" }) {
  /**
    * @desc Returns a Tab component 
    */
  const minWidth = name.length * 4 +115;
  const maxWidth = name.length * 5 + 100;
  const tab = puffin.element(
    `
    <div name="${name}" file_status="saved" longpath="${type == "free"?id:longpath}" draggable="true" dragstart="$dragging" click="$loadMe" typeEditor="${type}" style="min-width: ${minWidth}px; 
        max-width: ${maxWidth}px;" elementType="tab" class="tab_component selected tab_part" screen="${screen}"  id="${id}${type}" TabID="${id}${type}" >
        <p class="tab_part" id="${id}TextTab" TabID="${id}${type}" elementType="tab">${name}</p>
        <button typeEditor="${type}" mouseover="$hoveringMe" mouseout="$notHoveringMe" click="$closeMe" id="${id}CloseButton" class="close_tab tab_part" hovering="false" elementType="false" TabID="${id}${type}">${icons.close}</button>
    </div>  
`,
    {
      methods: {
        closeMe() {
          if(type == "text"){
            closeTab(`${id}${type}`,false);
          }else{
            closeTab(`${id}${type}`, true);
          }
        },
        hoveringMe() {
          this.setAttribute("hovering", true);
        },
        notHoveringMe() {
          this.setAttribute("hovering", false);
        },
        loadMe() {
          loadTab(this);
        },
        dragging() {
          event.dataTransfer.setData("id", this.id);
        }
      }
    }
  );
  tab.node.data = data
  return tab;
}

module.exports = retrieveTab;
