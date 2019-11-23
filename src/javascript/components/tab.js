function retrieveTab({ id, name, data, screen, type, longpath = "" }) {
  const { puffin } = require("@mkenzo_8/puffin");
  const minWidth = name.length * 4 +115;
  const maxWidth = name.length * 5 + 100;
  const tab = puffin.element(
    `
    <div longpath="${longpath}" draggable="true" dragstart="$dragging" click="$loadMe" typeEditor="${type}" style="min-width: ${minWidth}px; 
        max-width: ${maxWidth}px;" elementType="tab" class="tab_component selected tab_part" screen="${screen}" data="${data}" id="${id}${type}" TabID="${id}${type}" >
        <p class="tab_part" id="${id}TextTab" TabID="${id}${type}" elementType="tab">${name}</p>
        <button mouseover="$hoveringMe" mouseout="$notHoveringMe" click="$closeMe" id="${id}CloseButton" class="close_tab tab_part" hovering="false" elementType="false" TabID="${id}${type}"></button>
    </div>  
`,
    {
      methods: [
        function closeMe() {
          closeTab(`${id}${type}`, true);
        },
        function hoveringMe() {
          this.setAttribute("hovering", true);
        },
        function notHoveringMe() {
          this.setAttribute("hovering", false);
        },
        function loadMe() {
          loadTab(this);
        },
        function dragging() {
          event.dataTransfer.setData("id", this.id);
        }
      ]
    }
  );
  tab.node.children[1].innerHTML = icons.close;
  return tab;
}

module.exports = retrieveTab;
