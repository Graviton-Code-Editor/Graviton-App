import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& {
		border: 0;
		padding: 2px;
		margin: 2px;
		background: transparent;
		cursor: pointer;
		& svg {
			height: 12px;
			width: 12px;
		}
	}
`

function ButtonIcon() {
	return element`
		<button class="${styleWrapper}"/>
	`
}

export default ButtonIcon
