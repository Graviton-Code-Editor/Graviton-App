import { element, style } from '@mkenzo_8/puffin'

const resizeSelector = Math.random()

function startResizing(event, resizerElement = document.getElementById(resizeSelector)) {
	const otherChildren = resizerElement.parentElement.children
	let leftPanel = null
	Object.keys(otherChildren).forEach(index => {
		const child = otherChildren[index]
		if (child.id == resizerElement.id) {
			leftPanel = otherChildren[index - 1]
		}
	})
	leftPanel.style.width = `${event.clientX - 85}px`
}

const styleWrapper = style`
	&{
		user-select: none;
		padding:3px;
		cursor:e-resize;
	}
`

function stopResizing() {
	window.removeEventListener('mousemove', startResizing, false)
	window.removeEventListener('mouseup', stopResizing, false)
}

function resizerComponent() {
	return element`
		<div id="${resizeSelector}" :mousedown="${working}" class="${styleWrapper}"/>
	`
}

function working() {
	window.addEventListener('mousemove', startResizing, false)
	window.addEventListener('mouseup', stopResizing, false)
}
export default resizerComponent
