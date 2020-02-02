import DialogBody from '../components/dialog/dialog'
import WindowBackground  from '../components/window/background'
import {puffin} from '@mkenzo_8/puffin'
import {Titles,Text } from '@mkenzo_8/puffin-drac'

function Dialog({
    title = 'Title',
    content = ""
}){
    const randomSelector = Math.random()
    const DialogComp = puffin.element(`
        <div id="${randomSelector}" class="${puffin.style.css`
            &{
                min-height:100%;
                min-width:100%;
                position:fixed;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%);

            }
        `}">
            <WindowBackground window="${randomSelector}"/>
            <DialogBody>
                <H1>${title}</H1>
                <Text>${content}</Text>
            </DialogBody>
        </div>
    `,{
        components:{
            DialogBody,
            WindowBackground,
            H1:Titles.h1,
            Text

        }
    })
    
    puffin.render(DialogComp,document.getElementById("windows"))
}
export default Dialog