import { element, style } from '@mkenzo_8/puffin'


const styleWrapper = style`
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
`

function SideMenuSearcher(){
	return element`
		<input  mounted="${mounted} :keyup="${writing}" placeHolder="Search" class="${styleWrapper}"/>
	`
}

function writing(){
	filterBy(this.parentElement.parentElement,this.value)
}

function mounted(){
	this.focus()
}

const filterBy = ( container, search ) =>  container.searchBy(search)

export default SideMenuSearcher