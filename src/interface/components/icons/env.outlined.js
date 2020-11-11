import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& {
		width: 23px !important;
		height: 23px !important;
	}
	& path{
		fill: var(--iconFill);
	}
	& circle{
		stroke: var(--iconFill);
	}
`

function EnvOutlined() {
	return element`
		<svg class="${styleWrapper}" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="19.799" cy="10.7944" r="6.30435" transform="rotate(-45 19.799 10.7944)" stroke-width="2"/>
			<path d="M5.16495 25.4284C4.68953 24.953 4.68953 24.1822 5.16495 23.7068L14.634 14.2377L16.3557 15.9593L6.8866 25.4284C6.41118 25.9038 5.64037 25.9038 5.16495 25.4284V25.4284Z" />
		</svg>

	`
}

export default EnvOutlined
