import { puffin } from '@mkenzo_8/puffin'

const SideMenuSearcher = puffin.element(`
	<input keyup="$writing" placeHolder="Search" class="${puffin.style.css`
		&{
			transition:0.3s;
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
			margin-bottom:6px;
		}
		&:focus{
			transition:0.3s;
			box-shadow:0px 2px 7px rgba(0,0,0,0.2)
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

const filterBy = ( container, search ) =>  container.searchBy(search)

export default SideMenuSearcher