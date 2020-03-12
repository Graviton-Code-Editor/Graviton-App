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
			min-width:40px;
			height:20px;
			display:flex;
			align-items:center;
			cursor:pointer;
		}
		& .indicator{
			height: 16px;
			width: 16px;
			border-radius:100px;
		}
		&[status=true] .indicator{
			transition:0.13s;
			background:var(--switchIndicatorActivatedBackground);
			left:25px;
			position:relative;
		}
		&[status=false] .indicator{
			transition:0.13s;
			background:var(--switchIndicatorDesactivatedBackground);
			left:0;
			position:relative;
		}
		& label {
			margin-left:10px;
			margin-top:1px;
			overflow:hidden;
			text-overflow:ellipsis;
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