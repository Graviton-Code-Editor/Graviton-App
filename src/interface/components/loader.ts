import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		animation: spin 1s linear infinite;
		border:7px solid rgba(0,0,0,0);
		border-top:7px solid var(--loaderBackground);
		border-bottom:7px solid var(--loaderBackground);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		box-sizing:border-box;
		margin:0;
		padding:0;
	}
`

function Loader() {
	return element`<div class="${styleWrapper}"></div>`
}

export default Loader
