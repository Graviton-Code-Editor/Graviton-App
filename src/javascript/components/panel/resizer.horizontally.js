import {puffin} from '@mkenzo_8/puffin'

const ResizerID = Math.random()

function startResizing(e,box = document.getElementById(ResizerID)){
    let leftPanel = null;
    for (let i = 0; i < box.parentElement.children.length; i++) {
        const child = box.parentElement.children[i];
        if (child.id == box.id) {
            leftPanel = box.parentElement.children[i-1]
        }
        
    }
    leftPanel.style.width = e.clientX - 25 + "px";
    leftPanel.style.maxWidth = e.clientX -25 + "px";
}

function stopResizing(e,box){
    window.removeEventListener("mousemove", startResizing, false);
    window.removeEventListener("mouseup", stopResizing, false);
}

const Resizer = puffin.element(`
    <div mousedown="$working" class="${
        puffin.style.css`
            &{
                padding:3px;
                cursor:e-resize;
            }
        `
    }" >

    </div>
`,{
    events:{
        mounted(target){
            target.id = ResizerID
        }
    },
    methods:{
        working(e){
            window.addEventListener("mousemove",startResizing, false);
            window.addEventListener("mouseup", stopResizing, false);
        }
    }
})

export default Resizer