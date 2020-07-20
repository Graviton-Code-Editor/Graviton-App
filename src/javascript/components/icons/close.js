import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& rect{
		stroke: var(--windowIconsFill);
	}
`

function Close() {
	return element`
		<svg class="${styleWrapper}"  width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="1" y="1" width="16" height="16" rx="4" stroke-width="3"/>
		</svg>
	`
}

export default Close
