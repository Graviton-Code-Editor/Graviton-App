import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& path{
		fill: var(--iconFill);
	}
	& circle{
		stroke: var(--iconFill);
	}
`

function EnvOutlined() {
	return element`
		<svg class="${styleWrapper}" width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="21.2132" cy="11.0677" r="6.82609" transform="rotate(-45 21.2132 11.0677)" stroke-width="2"/>
			<path d="M5.53387 26.7471C5.02449 26.2377 5.02449 25.4118 5.53387 24.9024L15.6793 14.757L17.5239 16.6016L7.3785 26.7471C6.86912 27.2564 6.04325 27.2564 5.53387 26.7471V26.7471Z" />
		</svg>
	`
}

export default EnvOutlined
