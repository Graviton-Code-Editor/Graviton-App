import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import { element, createElement } from '@mkenzo_8/puffin'

const isEnabled = () => StaticConfig.data.editorEnableCSC || false

RunningConfig.on('aTabHasBeenCreated', ({ tabElement, client, instance }) => {
	const isCM = client.name === 'codemirror'

	if (!isCM || !isEnabled()) return

	const cursor = createElement(element`
		<div tabindex="-1" style="pointer-events:none;position: absolute; background: rgba(150,150,150,0.4); transition: 0.1s; width: ${StaticConfig.data.editorFontSize / 4}px"/>
	`)

	tabElement.state.data.bodyElement.appendChild(cursor)

	instance.on('cursorActivity', () => {
		setTimeout(refreshCursor, 1)
	})

	instance.on('scroll', () => {
		setTimeout(refreshCursor, 1)
	})

	instance.on('change', () => {
		setTimeout(refreshCursor, 1)
	})

	instance.on('viewportChange', () => {
		setTimeout(refreshCursor, 1)
	})

	StaticConfig.keyChanged('editorFontSize', () => {
		setTimeout(refreshCursor, 1)
	})

	function refreshCursor() {
		if (!isCursorVisible(instance)) {
			cursor.style.display = 'none'
			return
		}
		cursor.style.display = 'block'
		const cursorElement = instance.getWrapperElement().getElementsByClassName('CodeMirror-cursor')[0]
		if (!cursorElement) return
		const { x, y } = cursorElement.getBoundingClientRect()
		const { clientHeight } = cursorElement
		cursor.style.top = y
		cursor.style.left = x
		cursor.style.height = clientHeight
		cursor.style.width = StaticConfig.data.editorFontSize / 1.6
	}
})

const isCursorVisible = cm => {
	const { top, right, bottom, left } = cm.getWrapperElement().getBoundingClientRect()
	const { top: cursorY, left: cursorX } = cm.cursorCoords(true, 'page')
	return cursorY > top && cursorY < bottom && cursorX > left && cursorX < right
}
