import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import Core from 'Core'
const { openExternal } = Core

const styleWrapper = style`
	& {
		color: var(--textColor);
		padding: 6px;
		text-decoration: underline;
		&:hover{
			background: var(--textFocusedBackground);
			border-radius: 5px;
			cursor: pointer;
		}
	}
`

function Link({ to }) {
	return element`
		<a :click="${() => openExternal(to)}" class="${styleWrapper}"/>
	`
}

export default Link
