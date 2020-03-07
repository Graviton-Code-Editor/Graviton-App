import { puffin } from '@mkenzo_8/puffin'

const SideMenuSearcher = puffin.element(`
   <input keyup="$writing" placeHolder="Search" class="${puffin.style.css`
        &{
            background:var(--sidemenuSearcherBackground);
            color:var(--sidemenuSearcherText);
            border:0px;
            padding:7px;
            margin:0 auto;
            border-radius:5px;
            margin:3px 0;
            max-width:auto;
            display:block;
            white-space:prewrap;
            margin-bottom:3px;
        }
   `}"/>
`,{
    methods:{
        writing(){
            filterBy(this.parentElement.parentElement,this.value)
        }
    },
    events:{
        mounted(target){
            target.focus()
        }
    }
})

function filterBy(container,search){
    container.searchBy(search)
}

export default SideMenuSearcher