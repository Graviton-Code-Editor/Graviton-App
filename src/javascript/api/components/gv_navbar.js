/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
"use strict"
/**
 *
 * @desc This is a web component for side menus
 * @usage <gv-navpanel>
            <gv-navbar
                <gv-navtitle>Window</gv-navtitle>
                <gv-navbutton href=AA default >Content 1</gv-navbutton>
                <gv-navbutton href=BB >Content 2</gv-navbutton>
            </gv-navbar>
            <gv-navcontent>
                <gv-navpage href=AA default>
                    <p>SOME CONTENT 1 </p>
                </gv-navpage>
                <gv-navpage href=BB>
                    <p>SOME CONTENT 2 </p>
                </gv-navpage>
            </gv-navcontent>
        </gv-navpanel>
 *
 */
module.exports = class GvNavBar extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const sideMenu = this.children[0];
    const sideContent = this.children[1];
    const menuButtons = sideMenu.children;
    const contentPages = sideContent.children;
    if(this.classList.length==0) this.classList.add("side-menu")
    
    for (i = 0; i < menuButtons.length; i++) {
      const button = menuButtons[i];
      button.addEventListener("click", () => {
        for (i = 0; i < contentPages.length; i++) {
          if (
            contentPages[i].getAttribute("href") == button.getAttribute("href")
          ) {
            contentPages[i].style.display = "block";
          } else {
            contentPages[i].style.display = "none";
          }
        }
        for (i = 0; i < menuButtons.length; i++) {
          menuButtons[i].removeAttribute("default");
          if (
            menuButtons[i].getAttribute("href") != button.getAttribute("href")
          )
            menuButtons[i].classList.remove("active");
        }
        button.classList.add("active");
        const event = pagesEvents.filter((ev)=>{
          return ev.name == button.getAttribute("href");
        })[0]
        if( event !== undefined){
          event.emitter.emit("load")
        }
      });
    }
  }
};
