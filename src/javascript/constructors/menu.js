import {puffin} from '@mkenzo_8/puffin'
import Dropmenu  from '../components/dropmenu'

function Menu({
    button,
    list
}){
    const randomID = Math.random()
    const methodsToBind = Object.assign({},list.map((option)=> option.action))
    const MenuComponent = puffin.element(`
        <Dropmenu>
            <button>${button}</button>
            <div>
            ${(function(){
                let content = "";
                list.map(function(option,index){
                    content += `<a click="$${index}">${option.label}</a>`
                })
                return content;
            })()}
            </div>
        </Dropmenu>
    `,{
        components:{
            Dropmenu
        },
        methods:methodsToBind
    })

    puffin.render(MenuComponent,document.getElementById("dropmenus"))
}

export default Menu