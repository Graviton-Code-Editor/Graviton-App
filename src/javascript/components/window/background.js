import { puffin } from '@mkenzo_8/puffin'

const WindowBackground = puffin.element(`
    <div click="$closeMe" keyup="$keyPresssed" class="${puffin.style.css`
        &{
            position:fixed;
            top:0;
            left:0;
            min-height:100%;
            min-width:100%;
            background:black;
            opacity:0.3;
        }
    `}">
        
    </div>
`,{
    methods:{
        closeMe(){
            document.getElementById(this.props.window).remove()
        }
    },
    props:[
        "window"
    ]
})

export default WindowBackground