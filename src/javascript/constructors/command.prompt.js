import { puffin } from '@mkenzo_8/puffin'
import CommandPromptBody from '../components/command.prompt/command.prompt'
import WindowBackground from '../components/window/background'

function CommandPrompt({
	name=Math.random(),
	showInput = true,
	inputPlaceHolder = "",
	options=[],
	scrollOnTab=false,
	closeOnKeyUp = false,
	onSelected = ()=>{},
	onScrolled = ()=>{}
}){
	if(document.getElementById(name) != null) return; // Check if there are any command prompts already opened
	let CommandPromptState = new puffin.state({
		hoveredOption : null
	})
	const configArguments = arguments[0]
	const CommandPromptComponent = puffin.element(`
		<CommandPromptBody id="${name}" keydown="$scrolling">
			<WindowBackground window="${name}"/>
			<div class="container">
				${(function(){
						return `<input style="${showInput?'':'opacity:0; height:1px; margin:0;padding:0; border:0px;'}" placeHolder="${inputPlaceHolder}" keyup="$writing"/>`
				})()}
				<div/>
			</div>
		</CommandPromptBody>
	`,{
		components:{
			CommandPromptBody,
			WindowBackground
		},
		methods:{
			writing(e){
				e.preventDefault()
				switch(e.keyCode){
					case 9:
						if(scrollOnTab){
							break;
						}
						selectOption(CommandPromptState.data.hoveredOption,{options,onSelected})
						closeCommandPrompt(CommandPromptComponent)
					case 17:
						if(!scrollOnTab){
							 break;
						 }
					case 13:
						selectOption(CommandPromptState.data.hoveredOption,{options,onSelected})
						closeCommandPrompt(CommandPromptComponent)
						break;
					case 38:
					case 40:
						break;
					default:
						renderOptions(
							{
								...configArguments,
								options:filterOptions(this.value,{
									options
								}) 
							},
							{
								parent:this.parentElement.children[1],
								state:CommandPromptState,
								component:CommandPromptComponent
							}
						)
				}
			},
			scrolling(e){
				switch(e.keyCode){
					case 38:
						scrollOptions({
							state:CommandPromptState,
							scrollingDirection:'up',
							...configArguments
						})
						break;
					case 9:
						e.preventDefault();
						if( !scrollOnTab) {
							
							break;
						}
						
					case 40:
						scrollOptions({
							state:CommandPromptState,
							scrollingDirection:'down',
							...configArguments
						})
						break;
				}
			}
		},
		events:{
			mounted(target){
				const container = target.children[1].children[1]
				renderOptions(
					{
						options,
						...configArguments
					},
					{
						parent:container,
						state:CommandPromptState,
						component:CommandPromptComponent
					}
				)
				window.addEventListener('keydown',(e)=>{
					if(e.keyCode === 27){
						closeCommandPrompt(CommandPromptComponent)
					}
				})
				const input = target.children[1].children[0]
					input.focus()
			}
		}
	})

	puffin.render(CommandPromptComponent,document.getElementById("windows"))
}

function closeCommandPrompt(CommandPromptComponent){
	CommandPromptComponent.node.remove()
}

function scrollOptions({ state, scrollingDirection, onScrolled}){
	const hoveredOption = state.data.hoveredOption
	const allOptions = hoveredOption.parentElement.children
	const hoveredOptionPosition = (function(){
		let index = 0;
		for(let option of allOptions){
			if(option == hoveredOption) break;
			index++
		}
		return index
	})()

	if( scrollingDirection == "up" ){
		if(hoveredOptionPosition != 0){
			state.data.hoveredOption = allOptions[hoveredOptionPosition-1]
		}else{
			state.data.hoveredOption = allOptions[allOptions.length-1]
		} 
	}else if( scrollingDirection == "down" ){
		if( hoveredOptionPosition != allOptions.length -1 ){
			state.data.hoveredOption = allOptions[hoveredOptionPosition+1]
		}else{
			state.data.hoveredOption = allOptions[0]
		}
	}
	hoverOption(state.data.hoveredOption,allOptions,onScrolled)   
}

function hoverOption( hoveredOption, allOptions, onScrolled=()=>{} ){
	for(let option of allOptions){
		if(option == hoveredOption){
			option.classList.add('active');
			onScrolled({
				label:option.textContent
			})
		}else{
			option.classList.remove('active');
		}
	}
}

function filterOptions(search,{ options }){
	return options.map(function(option){
		if(option.label.match(new RegExp(search, "i"))) return option
	}).filter(Boolean)
}

function renderOptions({
	options,
	onSelected
},{
	state,
	parent,
	component
}){
	let content = ''
	let hoveredDefault = 0;
	
	const optionsComp = puffin.element(`
			<div>
				${options.map(({ selected, label }, index)=>{
					if( selected ) hoveredDefault = index
					return ` <a click="$onClicked">${label}</a> `
				}).join('')}
			</div>
		`,{
		methods:{
			onClicked(){
				closeCommandPrompt(component)
				selectOption( this, { options, onSelected })
			}
		}
	})
	puffin.render(optionsComp,parent,{
		removeContent:true
	})

	state.data.hoveredOption = parent.children[0].children[hoveredDefault]
	hoverOption(state.data.hoveredOption,parent.children[0].children)
}

const findOptionAction = ( options, option ) => {
	 return options.find(opt => opt.label == option.textContent)
}

function selectOption( option, { options, onSelected }){
	if ( option ){
		const optionObj = findOptionAction( options, option)
		if ( optionObj.action ) optionObj.action()
		if ( onSelected ) onSelected({
			label:option.textContent
		})
	}
}

export default CommandPrompt