import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& rect, path{
		fill:var(--iconFill);
	}
	& circle{
		fill:var(--sidebarBackground);
		stroke: var(--iconFill);
	}
`

function GitIcon() {
	return element`
		<svg class="${styleWrapper}" width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="6.17116" y="7.25673" width="2.17115" height="11.9413"/>
			<circle cx="7.25672" cy="20.2836" r="2.25672" stroke-width="1.5"/>
			<path d="M2.30285 3.83809C1.87891 3.41415 1.87891 2.7268 2.30285 2.30286V2.30286C2.72679 1.87891 3.41414 1.87891 3.83808 2.30286L16.3943 14.8591L14.8591 16.3943L2.30285 3.83809Z"/>
			<circle cx="16.3943" cy="16.3943" r="2.25672" transform="rotate(-45 16.3943 16.3943)" stroke-width="1.5"/>
			<circle cx="7.25672" cy="7.25672" r="2.25672" stroke-width="1.5"/>
		</svg>

	`
}

export default GitIcon
