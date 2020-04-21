import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	&{
		display:flex;
		justify-content:start;
		margin:5px;
		padding:5px;
		max-width:200px;
	}
	& .wrapper{
		background:var(--switchBackground);
		border-radius:15px;
		padding:3px 6px;
		min-width:38px;
		height:18px;
		display:flex;
		align-items:center;
		cursor:pointer;
	}
	& .indicator{
		height: 14px;
		width: 14px;
		border-radius:100px;
	}
	&[status=true] .indicator{
		transition:0.2s ease;
		background:var(--switchIndicatorActivatedBackground);
		left:24px;
		position:relative;
	}
	&[status=false] .indicator{
		transition:0.2s ease;
		background:var(--switchIndicatorDesactivatedBackground);
		left:0;
		position:relative;
	}
	& label {
		margin-left:10px;
		margin-top:2px;
		overflow:hidden;
		text-overflow:ellipsis;
		font-size:13px;
	}
`

function Switch(props){
	let status = props.status.default
	return element`
		<div :click="${toggled}" mounted="${mounted}" status="${()=>status}" class="${styleWrapper}">
			<div class="wrapper">
				<div class="indicator"/>
			</div>
			<label/>
		</div>
	`
	function mounted(){
		this.children[1].innerText = this.getAttribute("label")
		this.props.status = status
	}
	function toggled(){
		//Invert the the status
		status = (!status == true)
		//Update the status prop
		this.update()
		//Create the toggled event
		const toggledEvent = new CustomEvent('toggled', { 
			detail:{
				status
			}
		});
		//Trigger the toggled event
		this.dispatchEvent(toggledEvent)
	}
}


export default Switch