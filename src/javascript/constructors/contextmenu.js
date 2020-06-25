import { element, render, lang } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ContextMenuWrapper from '../components/context.menu'
import { LanguageState } from '../utils/lang.config'

function ContextMenu({ list, parent, event, x, y }) {
	const randomSelector = Math.random()
	const contextMenusCreated = document.getElementsByClassName('contextMenu')
	const computedMethods = {
		...list.map(a => a.action),
	}
	if (contextMenusCreated.length != 0) {
		contextMenusCreated[0].remove()
	}
	const positions = {
		x: event ? event.pageX : x,
		y: event ? event.pageY : y,
	}
	if (positions.x >= window.innerWidth - 150) {
		positions.x = positions.x - 75
	}
	if (positions.x < 100) {
		positions.x = event ? event.pageX : x
	}
	const ContextComponent = element({
		components: {
			ContextMenuWrapper,
		},
		addons: [lang(LanguageState)],
	})`
		<ContextMenuWrapper mounted="${mounted}" id="${randomSelector}" class="contextMenu" style="top:${() => positions.y}px; left:${() => positions.x}px;">
			${list.map((option, index) => {
				if (option.label) {
					return element`<button :click="${option.action}" lang-string="${option.label}"/>`
				} else {
					return element`<div class="sep"/>`
				}
			})}
		</ContextMenuWrapper>
	`
	function mounted() {
		const target = this
		parent.setAttribute('hasContext', true)
		RunningConfig.emit('hideAllFloatingComps')
		window.addEventListener('click', e => {
			if (e.target != parent) target.remove()
		})
		window.addEventListener('contextmenu', e => {
			e.stopPropagation()
		})
		RunningConfig.on('hideAllFloatingComps', () => {
			target.remove()
		})
		const calculatedHeight = positions.y - (positions.y + target.clientHeight - window.innerHeight) - 5
		if (positions.y + target.clientHeight > window.innerHeight) {
			target.style.top = calculatedHeight
		}
	}
	render(ContextComponent, document.body)
	return {
		close: () => {
			document.getElementById(randomSelector).remove()
		},
	}
}

export default ContextMenu
