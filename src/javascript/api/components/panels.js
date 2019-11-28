module.exports = {
  Panel: function({
    id = Math.random(),
    content = "",
    minHeight = "45px",
    maxHeight = "auto",
    visible = true
  }) {
    const {puffin} = require("@mkenzo_8/puffin")
    const panelPuffin = puffin.element(`
      <div class="explorer_panel" id="${id}" style="min-height:${minHeight};max-height:${maxHeight}; display:${visible?"block":"none"}">${content}</div>
    `)
    this.panelObject = panelPuffin.node;
    const me = this;
    this.open = () => {
      me.panelObject = document.getElementById(id);
      for (i = 0; i < me.panelObject.parentElement.children.length; i++) {
        if (me.panelObject.parentElement.children[i].id == me.panelObject.id) {
          me.panelObject.parentElement.children[i - 1].style.display = "block";
          me.panelObject.style.display = "block";
          return;
        }
      }
    };
    this.close = () => {
      me.panelObject = document.getElementById(id);
      for (i = 0; i < me.panelObject.parentElement.children.length; i++) {
        if (me.panelObject.parentElement.children[i].id == me.panelObject.id) {
          me.panelObject.parentElement.children[i - 1].style.display = "none";
          me.panelObject.style.display = "none";
          return;
        }
      }
    };
    this.destroy = () => {
      me.panelObject = document.getElementById(id);
      for (i = 0; i < me.panelObject.parentElement.children.length; i++) {
        if (me.panelObject.parentElement.children[i].id == me.panelObject.id) {
          me.panelObject.parentElement.children[i - 1].remove();
          me.panelObject.remove();
          return;
        }
      }
    };
    const explorer = document.getElementById("explorer_app");
    puffin.render(panelPuffin,explorer)
    if (document.getElementById("explorer_app").children.length > 1) {
      const random_ID = Math.random();
      const resizeElement = document.createElement("div");
      resizeElement.classList = "explorer_resizer";
      resizeElement.setAttribute("elementType", "panel_resizer");
      resizeElement.id = random_ID;
      explorer.insertBefore(resizeElement, document.getElementById(id));
      for (i = 0; i < resizeElement.parentElement.children.length; i++) {
        if (resizeElement.parentElement.children[i] == resizeElement) {
          var box =  resizeElement.parentElement.children[i - 1]
        }
      }
      const initialiseResize = e => {
        window.addEventListener("mousemove", startResizing, false);
        window.addEventListener("mouseup", stopResizing, false);
      };
      resizeElement.addEventListener("mousedown", initialiseResize, false);
      const startResizing = e => {
        const past = box.parentElement.children;
        let calc_height = 35;
        for (i = 0; i < past.length; i++) {
          const brother = past[i];
          if (brother.id == box.id) break;
          calc_height += brother.clientHeight + 12;
        }
        box.style.height = e.clientY - calc_height + "px";
        box.style.maxHeight = e.clientY - calc_height + "px";
      };
      const stopResizing = e => {
        window.removeEventListener("mousemove", startResizing, false);
        window.removeEventListener("mouseup", stopResizing, false);
      };
    }
    this.panelObject = document.getElementById(id);
    graviton.panels.push(this)
  }
};
