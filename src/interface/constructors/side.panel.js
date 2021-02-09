import { element, render, lang } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import { LanguageState } from 'LanguageConfig'

const styleWrapper = style`
	padding:0px;
	margin-bottom: 2px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: var(--sidebarIconBackground);
	border-radius: 5px;
	overflow: hidden;
	min-height: 50px;
	max-height: 50px;
	--iconFill: var(--sidebarIconsFill);
	&:hover:not(.active) {
		transition: 0.1s;
		background: var(--sidebarIconHoveringBackground);
		--iconFill: var(--sidebarIconsHoveringFill);
	}
	&.active {
		background: var(--sidebarIconActiveBackground);
		--iconFill: var(--sidebarIconsActiveFill);
	}
	svg {
		width: 20px;
	}
	& > .decorator{
		position: absolute;
		font-size:10px;
		border-radius:50px;
		padding: 0px;
		width: 15px;
		height: 15px;
		margin-top: 26px;
		margin-left: 26px;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
		background: var(--sidebarDecoratorBackground);
		color: var(--sidebarDecoratorColor);
		&.false{
			display: none;
		}
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
	let decoratorLabel = ''

	function setDecorator({ label }) {
		decoratorLabel = label
		iconNode.children[1].update()
	}

	const panelIcon = element`
		<div title="${hint}" :click="${display}" class="${styleWrapper}">
			${icon({ setDecorator })}
			<div class="decorator ${() => (decoratorLabel === '' ? 'false' : 'true')}">${() => decoratorLabel}</div>
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
