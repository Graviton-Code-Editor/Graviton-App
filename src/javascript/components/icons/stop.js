import { element,style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	& > rect{
		fill:var(--windowIconsFill);
	}
`

function Stop(){
	return element`
		<svg class="${styleWrapper}" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="18" height="18" rx="5"/>
		</svg>
	`
}

export default Stop
