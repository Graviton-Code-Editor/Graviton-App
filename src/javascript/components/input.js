import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
		&{
			background:var(--inputBackground);
			border-radius:4px;
			padding:6px;
			border:0px;
			color:var(--inputText);
		}
	`

function Input(){
	return element`<input class="${styleWrapper}"></input>`
}

export default Input