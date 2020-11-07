import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import { element, createElement } from '@mkenzo_8/puffin'
import { TabEventArgs } from 'Types/tab'

const isEnabled = () => StaticConfig.data.editorEnableCSC || false

RunningConfig.on('aTabHasBeenCreated', ({ tabElement, client, instance, isEditor }: TabEventArgs) => {
	if (!isEditor) return
	const isCM = client.name === 'codemirror'

	if (!isCM || !isEnabled()) return

	const cursor = createElement(element`
		<div tabindex="-1" style="top:0;left:0;pointer-events:none;position: absolute; background: rgba(150,150,150,0.4); width: ${StaticConfig.data.editorFontSize / 4}px"/>
	`)

	tabElement.state.data.bodyElement.appendChild(cursor)

	instance.on('cursorActivity', () => {
		refreshCursor()
	})

	instance.on('scroll', () => {
		refreshCursor(true)
	})

	instance.on('change', () => {
		refreshCursor()
	})

	instance.on('viewportChange', () => {
		refreshCursor()
	})

	instance.on('blur', () => {
		refreshCursor(true)
	})

	instance.on('refresh', () => {
		refreshCursor()
	})

	StaticConfig.keyChanged('editorFontSize', () => {
		refreshCursor(true)
	})

	function refreshCursor(fast = false) {
		if (!isCursorVisible(instance)) {
			cursor.style.display = 'none'
			return
		}
		if (fast) {
			cursor.style.transition = ''
		} else {
			cursor.style.transition = 'ease-out 0.1s'
		}
		cursor.style.display = 'block'
		const cursorElement = instance.getWrapperElement().getElementsByClassName('CodeMirror-cursor')[0]
		if (!cursorElement) return
		const { top: cursorY, left: cursorX } = instance.cursorCoords(true, 'page')
		const { clientHeight } = cursorElement
		cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`
		cursor.style.height = clientHeight
		cursor.style.width = StaticConfig.data.editorFontSize / 1.6
	}

	refreshCursor(true)
})

const isCursorVisible = cm => {
	const { top, right, bottom, left } = cm.getWrapperElement().getBoundingClientRect()
	const gutterSize = cm.getGutterElement().offsetWidth
	const { top: cursorY, left: cursorX } = cm.cursorCoords(true, 'page')
	return cursorY > top && cursorY < bottom && cursorX > left + gutterSize && cursorX < right
}
