import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import StaticConfig from 'StaticConfig'
import AppPlatform from 'AppPlatform'
import RunningConfig from 'RunningConfig'

const styleWrapper = style`
	&{
		user-select: none;
		&[direction="horizontally"]{
			cursor:e-resize;
		}
		&[direction="vertically"]{
			cursor:n-resize;
		}
	}
	&[blocked=false]{
		padding:3px;
	}
`

export default function resizerComponent() {
	function resizerMounted() {
		const direction = this.getAttribute('direction')

		if (direction === 'horizontally') {
			StaticConfig.keyChanged('appEnableSidepanel', value => {
				this.setAttribute('blocked', !value)
				if (!value) this.style.width = '0'
			})
		} else {
			this.setAttribute('blocked', 'false')
		}
	}

	return element`
		<div blocked="${!StaticConfig.data.appEnableSidepanel}" mounted="${resizerMounted}" :mousedown="${working}" class="${styleWrapper}"/>
	`
}

function working() {
	const resizerElement = this
	const direction = resizerElement.getAttribute('direction')
	let resizerOffset = 0

	if (direction === 'horizontally') {
		resizerOffset = StaticConfig.data.appEnableSidebar ? 70 : 25
		StaticConfig.keyChanged('appEnableSidebar', status => {
			if (status) {
				resizerOffset = 70
			} else {
				resizerOffset = 25
			}
		})
	} else {
		if (AppPlatform == 'win32' || RunningConfig.data.isBrowser) {
			resizerOffset = 45
		} else {
			resizerOffset = 0
		}
	}

	window.addEventListener('mousemove', startResizing, false)
	window.addEventListener('mouseup', stopResizing, false)

	function startResizing(event) {
		if (resizerElement.getAttribute('blocked') === 'true') return
		const otherChildren = resizerElement.parentElement.children

		let leftPanel = null
		let rigthPanel = null

		Object.keys(otherChildren).forEach((el, index: number) => {
			const child = otherChildren[index]
			if (child == resizerElement) {
				leftPanel = otherChildren[index - 1]
				rigthPanel = otherChildren[index + 1]
			}
		})

		if (direction === 'horizontally') {
			leftPanel.style.width = `${event.clientX - resizerOffset}px`
		} else {
			leftPanel.style.height = `${event.clientY - resizerOffset}px`
		}

		const resizedEvent = new CustomEvent('resized', {
			detail: {},
		})

		leftPanel.dispatchEvent(resizedEvent)
		rigthPanel.dispatchEvent(resizedEvent)
	}

	function stopResizing() {
		window.removeEventListener('mousemove', startResizing, false)
		window.removeEventListener('mouseup', stopResizing, false)
	}
}
