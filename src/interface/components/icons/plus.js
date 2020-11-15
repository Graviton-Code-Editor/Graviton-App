import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& > rect{
		fill:var(--statusbarItemIconBackground);
	}
`

function Plus() {
	return element`
		<svg class="${styleWrapper}" width="15" height="15" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="13" y="20" width="18" height="3" rx="1"/>
			<rect x="20.5" y="30.5" width="18" height="3" rx="1" transform="rotate(-90 20.5 30.5)"/>
		</svg>
	`
}

export default Plus
