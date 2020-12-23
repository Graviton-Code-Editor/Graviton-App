import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& {
		padding: 10px;
		color: var(--textColor);
		font-size: 14px;
		& > * {
			padding: 7px 20px;
			& > td {
				padding: 3px 10px;
				& > button {
					padding:  8px 9px;
					margin: 0px;
					text-transform: none;
				}
			}
		}
	}
`

function ShortcutsTable() {
	return element`<table class="${styleWrapper}"/>`
}

export default ShortcutsTable
