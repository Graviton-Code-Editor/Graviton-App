import { element, style } from '@mkenzo_8/puffin'

function Switch(){
	return element`
		<div :click="${toggled}" mounted="${mounted}" class="${style`
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
		`}">
			<div class="wrapper">
				<div class="indicator"/>
			</div>
			<label></label>
		</div>
	`
}
function mounted(){
	this.children[1].innerText = this.getAttribute("label")
	this.props.status = this.props.status.default
	this.setAttribute("status",this.props.status)
}
function toggled(){
	this.props.status = (!this.props.status == true)
	this.setAttribute("status",this.props.status)
	const toggledEvent = new CustomEvent('toggled', { detail:this.props.status });
	this.dispatchEvent(toggledEvent)
}

export default Switch