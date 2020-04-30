import { element, style, render, lang } from '@mkenzo_8/puffin'
import { LanguageState } from 'LanguageConfig'

const styleWrapper = style`
	& {
		padding: 13px 1px;
		margin: 1px auto;
		display: flex;
		justify-content: center;
		background: var(--sidebarIconBackground);
		border-radius: 5px;
	}
	&:hover:not(.active) {
		transition: 0.1s;
		background: var(--sidebarIconHoveringBackground)
	}
	&.active {
		background: var(--sidebarIconActiveBackground);
	}
	& svg {
		width: 20px;
	}
`

const styleWrapperPanel = style`
	& {
		display: none;
		max-height: 100%;
		overflow: auto;
	}
`

function SidePanel({
	icon,
	panel
}){
	const panelIcon = element`
		<div :click=${display} class="${styleWrapper}">
			${icon()}
		</div>`
	
	const panelContainer = element({
		addons:[
			lang(LanguageState)
		]
	})`
		<div class="${styleWrapperPanel}">
			${panel()}
		</div>`
	
	const iconNode = render(panelIcon,document.getElementById('sidebar'))
	
	const panelNode = render(panelContainer,document.getElementById('sidepanel'))

	function display(){
		hideAllPanels()
		iconNode.classList.add('active')
		panelNode.style.display = 'block'
	}
	return {
		display,
		panelNode
	}
}

function hideAllPanels(){
	const { children } = document.getElementById('sidepanel')
	for( const child of children ){
		child.style.display = 'none'
	}
	const { children:iconsChildren } = document.getElementById('sidebar')
	for( const child of iconsChildren ){
		child.classList.remove('active')
	}
}

export default SidePanel