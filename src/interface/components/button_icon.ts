import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& {
		border: 0;
		padding: 2px;
		margin: 2px;
		background: transparent;
		cursor: pointer;
		& svg {
			max-height: 20px;
			max-width: 20px;
			
		}
	}
`

function ButtonIcon() {
	return element`
		<button class="${styleWrapper}"/>
	`
}

export default ButtonIcon
