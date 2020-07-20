import { element, render, lang } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import { LanguageState } from 'LanguageConfig'

const styleWrapper = style`
	& {
		padding:0px;
		margin: 1px auto;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--sidebarIconBackground);
		border-radius: 5px;
		overflow: hidden;
		min-height: 50px;
		max-height: 50px;
		--iconFill: var(--sidebarIconsFill);
	}
	&:hover:not(.active) {
		transition: 0.1s;
		background: var(--sidebarIconHoveringBackground);
		--iconFill: var(--sidebarIconsHoveringFill)
	}
	&.active {
		background: var(--sidebarIconActiveBackground);
		--iconFill: var(--sidebarIconsActiveFill)
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

function SidePanel({ icon, panel, hint = '' }) {
	const panelIcon = element`
		<div title="${hint}" :click=${display} class="${styleWrapper}">
			${icon()}
		</div>`

	const panelContainer = element({
		addons: [lang(LanguageState)],
	})`
		<div class="${styleWrapperPanel}">
			${panel()}
		</div>`

	const iconNode = render(panelIcon, document.getElementById('sidebar'))

	const panelNode = render(panelContainer, document.getElementById('sidepanel'))

	function display() {
		hideAllPanels()
		iconNode.classList.add('active')
		panelNode.style.display = 'block'
	}
	return {
		display,
		panelNode,
	}
}

function hideAllPanels() {
	const { children } = document.getElementById('sidepanel')
	for (const child of children) {
		child.style.display = 'none'
	}
	const { children: iconsChildren } = document.getElementById('sidebar')
	for (const child of iconsChildren) {
		child.classList.remove('active')
	}
}

export default SidePanel
