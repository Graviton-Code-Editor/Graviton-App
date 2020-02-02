import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

function goTo(page,buttons,pages){
    pages.map(function(contentPage){
        contentPage.style.display = 'none'
        if(contentPage.getAttribute("href") == page){
            contentPage.style.display = 'block'
        }
    })
    buttons.map(function(buttonPage){
        buttonPage.classList.remove('active')
        if(buttonPage.getAttribute("to") == page){
            buttonPage.classList.add('active')
        }
    })
}

const SideMenu = puffin.element(`
    <div test="1" class="${puffin.style.css`
        ${ThemeProvider}
        & {
            display:flex;
            min-height:100%;
            flex:1;
            overflow:hidden;
        }
        & > div:nth-child(1){
            background:{{sidemenuBackground}};
            min-height:100%;
            min-width:165px;
            display:block;
            padding:20px;
            overflow:auto;
            box-shadow:0px 2px 5px rgba(0,0,0,0.2);
        }
        & > div:nth-child(1) > label {
            display:block;
            white-space:prewrap;
            padding:7px;
            border-radius:6px;
            background:{{sidemenuButtonBackground}};
            color:{{sidemenuButtonext}};
            margin:3px 0px;
        }
        & > div:nth-child(1) > label:hover:not(.active) {
            background:{{sidemenuButtonHoverBackground}};
        }
        & > div:nth-child(1) > label.active {
            background:{{sidemenuButtonActiveBackground}};
            color:{{sidemenuButtonActiveText}};
        }
        & > div:nth-child(2){
            background:transparent;
            min-height:auto;
            max-height:100%;
            width:auto;
            overflow:auto;
            padding:15px;
        }
    `}">

    </div>
`,{
    events:{
        mounted(target){
            const defaultPage = target.getAttribute("default");

            const buttons = (function(){
                let list = [];
                for(let button of target.children[0].children){
                    if(button.tagName == "LABEL"){
                        button.addEventListener('click',()=>{
                            goTo(button.getAttribute("to"),buttons,pages)
                        })
                        list.push(button)
                    }
                }
                return list
            })()

            const pages = (function(){
                let list = [];
                for(let button of target.children[1].children){
                    if(button.tagName == "DIV") {
                        
                        list.push(button)
                    }
                }
                return list
            })()


            goTo(defaultPage,buttons,pages)
            console.log(buttons,pages)
        }
    }
})

export default SideMenu