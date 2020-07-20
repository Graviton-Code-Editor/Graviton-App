import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& > rect{
		fill:var(--statusbarItemIconBackground);
	}
`
function Minus() {
	return element`
		<svg class="${styleWrapper}" width="15" height="15" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="13" y="20" width="18" height="3" rx="1"/>
		</svg>
	`
}

export default Minus
