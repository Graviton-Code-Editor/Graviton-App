import { element, style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	& *{
		stroke: var(--iconFill);
	}
`

function EnvOutlined() {
	return element`
		<svg class="${styleWrapper}" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M5.8 5.8C5.8 5.16196 5.8 4.55446 5.8 3.9994C5.8 2.34254 7.14315 1 8.8 1H21.9684C23.6427 1 25 2.43269 25 4.2V17.2C25 18.8569 23.6569 20.2 22 20.2H20.2V8.8C20.2 7.14315 18.8568 5.8 17.2 5.8H5.8Z" stroke-width="2"/>
			<rect x="1" y="5.8" width="19.2" height="19.2" rx="3" stroke-width="2"/>
		</svg>
	`
}

export default EnvOutlined
