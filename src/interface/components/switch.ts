import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		display:flex;
		justify-content:start;
		margin:5px;
		padding:5px;
		max-width:300px;
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0); 
    -webkit-focus-ring-color: rgba(255, 255, 255, 0); 
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
	& span {
		margin-left:10px;
		margin-top:2px;
		overflow:hidden;
		text-overflow:ellipsis;
		font-size:13px;
	}
`

function Switch({ data }) {
	let { default: defaultStatus, label } = data
	return element`
		<div :click="${toggle}" mounted="${mounted}" status="${() => defaultStatus}" class="${styleWrapper}">
			<div class="wrapper">
				<div class="indicator"/>
			</div>
			<span lang-string="${label}"/>
		</div>
	`
	function mounted() {
		this.props.status = defaultStatus
		this.toggle = value => toggle.bind(this)(null, value)
	}
	function toggle(ev, customStatus) {
		const isClicked = !!ev
		//Update the status
		if (customStatus) defaultStatus = customStatus
		else defaultStatus = !defaultStatus == true
		//Update the status prop
		this.update()
		//Create the toggled event
		if (isClicked) {
			const toggledEvent = new CustomEvent('toggled', {
				detail: {
					status: defaultStatus,
				},
			})
			//Trigger the toggled event
			this.dispatchEvent(toggledEvent)
		}
	}
}

export default Switch
