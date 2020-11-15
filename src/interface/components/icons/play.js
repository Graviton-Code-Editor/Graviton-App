import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& > path{
		stroke:var(--windowIconsFill);
	}
`

function Play() {
	return element`
		<svg  class="${styleWrapper}" width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15 11.7321L4.5 17.7942C3.16667 18.564 1.5 17.6018 1.5 16.0622V3.93782C1.5 2.39822 3.16667 1.43597 4.5 2.20577L15 8.26795C16.3333 9.03775 16.3333 10.9622 15 11.7321Z" stroke-width="3"/>
		</svg>

	`
}

export default Play
