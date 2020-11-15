import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import Core from 'Core'
const {
	electron: { ipcRenderer },
} = Core
import AppPlatform from 'AppPlatform'
import RunningConfig from 'RunningConfig'

function Buttons() {
	const WindowsStyle = style`
		& rect{
			stroke:var(--controlButtonsFill);
		}
		& rect.fill{
			fill:var(--controlButtonsFill);
		}
		& button{
			border:0;
			margin:0;
			flex-align:right;
			min-height:33px;
			padding:0px 13px;
			outline:0;
			left:0;
			background:transparent;
		}
		& button:hover{
			background:var(--controlButtonsHoveringBackground);
		}
		& button:nth-child(3):hover{
			background:var(--controlCloseButtonHoveringBackground);
		}
		& button:nth-child(3):hover rect.fill{
			fill:var(--controlCloseButtonHoveringFill);
		}
		& button:nth-child(3):active{
			background:var(--controlCloseButtonActiveBackground);
		}
		& button:nth-child(3):active rect.fill{
			fill:var(--controlCloseButtonActiveFill);
		}
	`
	return element`
		<div class="buttons ${WindowsStyle}">
			<button title="Minimize" :click="${minimize}">
				<svg xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" width="24" height="24">
					<rect x="7" y="11.5" width="10" height="0.2" />
				</svg>
			</button>
			<button title="Maximize" :click="${toggleMaximize}">
				<svg width="24" height="24" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="16" y="16" width="18.5714" height="18.5714"  stroke-width="2" />
				</svg>
			</button>
			<button title="Close" :click="${close}">
				<svg width="20" height="20" viewBox="0 0 174 174" xmlns="http://www.w3.org/2000/svg">
					<rect class="fill" x="40.3309" y="127.305" width="123" height="9" rx="4.5" transform="rotate(-45 40.3309 127.305)"/>
					<rect class="fill" x="127.305" y="133.669" width="123" height="9" rx="4.5" transform="rotate(-135 127.305 133.669)"/>
				</svg>
			</button>
		</div>
	`
}

function toggleMaximize() {
	ipcRenderer.send('maximize-window', RunningConfig.data.windowID)
}

function close() {
	RunningConfig.emit('checkAllTabsAreSaved', {
		whenContinue() {
			ipcRenderer.send('close-window', RunningConfig.data.windowID)
		},
	})
}

function minimize() {
	ipcRenderer.send('minimize-window', RunningConfig.data.windowID)
}

export default Buttons
