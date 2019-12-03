module.exports = class ProcessBarGv extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        /*
            <gv-process value="0"></gv-process>
            to
            <gv-process value="0">
                <gv-process-bar></gv-process-bar>
                <gv-process-text></gv-process-text>
            </gv-process>
        */
       const me = this;
       this.children[0].style.width = this.getAttribute("value") + "%";
       this.setValue = (newValue) => {
          me.children[0].style.width = `${newValue}%`
       }
       this.setText = (newValue) => {
        me.children[1].textContent = newValue
       }
       this.close = () =>{
         me.remove();
       }
    }
  };
  