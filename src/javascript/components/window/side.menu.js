import { puffin } from '@mkenzo_8/puffin'

function moveToPage(page,buttons,pages){
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


function moveToSection(search,sections,buttons,pages){
    const result = sections.filter(section=>section.title.match(new RegExp(search,'i')))[0];
    if(result != null){
        moveToPage(result.page,buttons,pages)
        result.element.scrollIntoView( false )
    }
}

const SideMenu = puffin.element(`
    <div class="${puffin.style.css`
        & {
            display:flex;
            max-height:100%;
            flex:1;
            overflow:hidden;
            user-select:none;
        }
        & > div:nth-child(1){
            background:var(--sidemenuBackground);
            min-height:100%;
            min-width:180px;
            max-width:180px;
            display:flex;
            flex-direction:column;
            padding:20px;
            overflow:auto;
            box-shadow:0px 0px 10px rgba(0,0,0,0.2);
        }
        & > div:nth-child(1) > h1 {
            overflow-x:hidden;
            text-overflow:ellipsis;
        }
        & > div:nth-child(1) > label {
            transition:0.04s;
            display:block;
            white-space:prewrap;
            padding:7px 9px;
            border-radius:6px;
            background:var(--sidemenuButtonBackground);
            color:var(--sidemenuButtonText);
            margin:1px 0px;
            font-size:13px;
        }
        & > div:nth-child(1) > label:hover:not(.active) {
            transition:0.04s;
            background:var(--sidemenuButtonHoverBackground);
        }
        & > div:nth-child(1) > label.active {
            background:var(--sidemenuButtonActiveBackground);
            color:var(--sidemenuButtonActiveText);
        }
        & > div:nth-child(2){
            background:transparent;
            min-height:auto;
            max-height:100%;
            width:auto;
            height:auto;
            overflow:auto;
            padding:15px;
            flex:1;
        }
    `}"/>
`,{
    events:{
        mounted(target){
            const defaultPage = target.getAttribute("default");

            const buttons = (function(){
                let list = [];
                for(let button of target.children[0].children){
                    if(button.tagName == "LABEL"){
                        button.addEventListener('click',()=>{
                            moveToPage(button.getAttribute("to"),buttons,pages)
                        })
                        list.push(button)
                    }
                }
                return list
            })()

            const pages = (function(){
                let list = [];
                for(let page of target.children[1].children){
                    if(page.tagName == "DIV") { 
                        list.push(page)
                    }
                }
                return list
            })()

            const sections = (function(){
                let list = []
                pages.map(function(page){
                    Object.keys(page.children).map(function(index){
                        const section = page.children[index]
                        if(section.tagName == "DIV"){
                            list.push({
                                title:section.getAttribute("href"),
                                page:page.getAttribute("href"),
                                element:section
                            })
                        } 
                    })
                })
                return list
            })()

            target.searchBy = function(search){
                moveToSection(search,sections,buttons,pages)
            }

            moveToPage(defaultPage,buttons,pages)
        }
    }
})


export default SideMenu