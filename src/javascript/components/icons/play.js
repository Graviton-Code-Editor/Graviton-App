import { element,style } from '@mkenzo_8/puffin'

const styleWrapper = style`
	& > path{
		fill:var(--windowIconsFill);
	}
`

function Play(){
	return element`
		<svg class="${styleWrapper}" width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M18.5 8.40193C20.5 9.55663 20.5 12.4434 18.5 13.5981L5 21.3923C3 22.547 0.5 21.1036 0.5 18.7942V3.20577C0.5 0.896367 3 -0.547005 5 0.607695L18.5 8.40193Z"/>
		</svg>
	`
}

export default Play