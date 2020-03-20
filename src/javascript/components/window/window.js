import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from '../../utils/themeprovider'

const WindowBody = puffin.element(`
	<div class="${puffin.style.css`
		${ThemeProvider}
			&{
				border:1px solid var(--windowBorder);
				width:200px;
				max-width: 80%;
				max-height: 75%;
				background: var(--windowBackground);
				border-radius: 7px;
				overflow:auto;
				position:absolute;
				height:auto;
				display:flex;
				animation:windowOpens ease-out 0.12s;
			}
			& * {
				color:{{textColor}};
			}
		`}">
	</div>
`)

export default WindowBody