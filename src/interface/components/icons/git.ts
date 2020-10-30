import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& rect, path{
		fill:var(--windowIconsFill);
	}
	& circle{
		fill:var(--sidebarBackground);
		stroke: var(--windowIconsFill);
	}
`

function GitIcon() {
	return element`
		<svg class="${styleWrapper}" width="21" height="26" viewBox="0 0 21 26" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="8.13675" y="9.22233" width="2.17115" height="11.9413"/>
			<circle cx="9.22231" cy="22.2492" r="2.75672"/>
			<path d="M2.30285 3.83809C1.87891 3.41415 1.87891 2.7268 2.30285 2.30286V2.30286C2.72679 1.87891 3.41414 1.87891 3.83808 2.30286L16.3943 14.8591L14.8591 16.3943L2.30285 3.83809Z"/>
			<circle cx="16.3943" cy="16.3943" r="2.75672" transform="rotate(-45 16.3943 16.3943)"/>
			<circle cx="9.22231" cy="9.22233" r="2.75672"/>
		</svg>
	`
}

export default GitIcon
