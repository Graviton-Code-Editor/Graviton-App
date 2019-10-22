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
         const initialValue = this.children[0].clientWidth;
         let sum = me.children[0].clientWidth;
         const interval = setInterval(loop, 10);
         function loop() {
          if(me.children[0].clientWidth / me.clientWidth * 100 < newValue - 10){
            sum = newValue - (initialValue / me.clientWidth * 5)-5+"%" ;
            me.children[0].style.width = sum;
          }else{
            clearInterval(interval);
          }
         }
       }
       this.setText = (newValue) => {
        me.children[1].textContent = newValue
       }
       this.close = () =>{
         me.remove();
       }
    }
  };
  