import { element, render } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import StaticConfig from 'StaticConfig'
import RunningConfig from 'RunningConfig'
import Terminal from './terminal'

const MainBoxStyle = style`
	position: relative;
	min-height: 100px;
	max-height: calc(100% - 2px);
	bottom: 0;
	flex: 1;
	border-top: 1px solid var(--panelBorder);
`

export default function MainBox() {
	function mounted() {
		if (StaticConfig.data.appShowTerminal) {
			this.style.display = 'block'
			document.getElementById('panels_stack').style.height = '70%'
		} else {
			this.style.display = 'none'
		}
		StaticConfig.keyChanged('appShowTerminal', (show: boolean) => {
			if (show) {
				this.style.display = 'block'
				document.getElementById('panels_stack').style.height = '70%'
			} else {
				this.style.display = 'none'
			}
		})
	}

	function resized() {
		//Send the resize event to the Terminal State
		RunningConfig.emit('mainBoxHasBeenResized')
	}

	return element({
		components: {
			Terminal,
		},
	})`
		<div :resized="${resized}" mounted="${mounted}" class="${MainBoxStyle}">
			<Terminal/>
		</div>
	`
}
