import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& rect{
		fill:var(--tabIconFill);
	}
	&:hover rect{
		fill:var(--tabIconHoveringFill);
	}
`

function AddTermIcon() {
	return element`
		<svg class="${styleWrapper}" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="3.33332" width="1.33333" height="8" rx="0.666667" fill="#646464"/>
			<rect y="4.66666" width="1.33333" height="8" rx="0.666667" transform="rotate(-90 0 4.66666)" fill="#646464"/>
		</svg>
	`
}

export default AddTermIcon
