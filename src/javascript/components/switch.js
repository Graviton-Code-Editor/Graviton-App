import { puffin } from '@mkenzo_8/puffin'

const Switch = puffin.element(`
	<div click="$toggled" status="{{status}}" class="${puffin.style.css`
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
		<label>{{label}}</label>
	</div>
`,{
	events:{
		mounted(){
			this.props.status = eval(this.getAttribute('default'))
		}	
	},
	methods:{
		toggled(){
			this.props.status = (!this.props.status == true)
			
			const toggledEvent = new CustomEvent('toggled', { detail:this.props.status });
			
			this.dispatchEvent(toggledEvent)
		}
	},
	props:['label','status']
})

export default Switch