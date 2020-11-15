import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& {
		padding: 10px;
		background: var(--sidemenuSectionBackground);
		border-radius: 6px;
		margin:6px 6px;
		min-height: 50px;
	}
`

function Section() {
	return element`
		<div class="${styleWrapper}"/>
	`
}

export default Section
