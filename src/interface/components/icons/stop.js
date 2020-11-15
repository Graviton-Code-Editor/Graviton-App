import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& rect{
		fill:var(--windowIconsFill);
	}
`

function Stop() {
	return element`
		<svg class="${styleWrapper}"  width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="4.61538" height="16.6154" rx="2.30769" fill="#C4C4C4"/>
			<rect x="7.38462" width="4.61538" height="16.6154" rx="2.30769" fill="#C4C4C4"/>
		</svg>
	`
}

export default Stop
