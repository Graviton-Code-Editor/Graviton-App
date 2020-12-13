import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& {
		transform: rotate(45deg);
		max-height: 17px !important;
		max-width: 17px !important;
	}
	& rect{
		fill:var(--tabIconFill);
		stroke:var(--tabIconFill);
	}
	&:hover rect{
		fill:var(--tabIconHoveringFill);
		stroke:var(--tabIconHoveringFill);
	}
`

function AddTermIcon() {
	return element`
		<svg width="50" height="50" viewBox="0 0 174 174" class="${styleWrapper}" xmlns="http://www.w3.org/2000/svg">
			<rect x="40.3309" y="127.305" width="123" height="9" rx="4.5" transform="rotate(-45 40.3309 127.305)" />
			<rect x="127.305" y="133.669" width="123" height="9" rx="4.5" transform="rotate(-135 127.305 133.669)"  />
		</svg>
	`
}

export default AddTermIcon
