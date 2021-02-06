import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const panelStyled = style`
	&[empty=true]{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		& > p {
			text-align: center;
			font-size: 13px;
			user-select: none;
		}
	}
	&[empty=false]{
		& > p{
			display: none;
		}
	}
`

export default function ContainerPanel() {
	return element`
		<div class="${panelStyled}"/>
	`
}
