import { element, render, lang } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ContextMenuWrapper from '../components/context.menu'
import { LanguageState } from 'LanguageConfig'
import PuffinElement from 'Types/puffin.element'
import { ContextMenuOptions } from 'Types/contextmenu'

class ContextMenu {
	private contextElement: PuffinElement
	constructor({ list, parent, event, x, y }: ContextMenuOptions) {
		const contextMenusCreated = document.getElementsByClassName('contextMenu')

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
		<ContextMenuWrapper mounted="${mounted}" class="contextMenu" style="top:${positions.y}px; left:${positions.x}px;">
			${list.map(({ action, label }) => {
				if (label) {
					return element`<button :click="${action}" lang-string="${label}"/>`
				} else {
					return element`<div class="sep"/>`
				}
			})}
		</ContextMenuWrapper>
		`
		function mounted() {
			parent.setAttribute('hasContext', true.toString())
			RunningConfig.emit('hideAllFloatingComps')
			window.addEventListener('click', e => {
				if (e.target != parent) this.remove()
			})
			window.addEventListener('contextmenu', e => {
				e.stopPropagation()
			})
			RunningConfig.on('hideAllFloatingComps', () => {
				this.remove()
			})
			const calculatedHeight = positions.y - (positions.y + this.clientHeight - window.innerHeight) - 5
			if (positions.y + this.clientHeight > window.innerHeight) {
				this.style.top = calculatedHeight
			}
			this.update()
		}
		this.contextElement = render(ContextComponent, document.body)
	}
	public close() {
		this.contextElement.remove()
	}
}

export default ContextMenu
