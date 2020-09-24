import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& path{
		fill:var(--explorerItemArrowBackground);
	}
`

function FolderArrow() {
	return element`
		<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg" class="${styleWrapper}">
			<path d="M12 6.5L0.75 12.9952V0.00480938L12 6.5Z"/>
		</svg>
	`
}

export default FolderArrow
