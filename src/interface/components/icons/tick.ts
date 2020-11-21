import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	& path{
		fill:var(--menuOptionText);
	}
`

function Tick() {
	return element`
		<svg class="${styleWrapper}" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8.57302 20.6471L22.3882 6.83186C22.7787 6.44134 23.4119 6.44134 23.8024 6.83186L24.8385 7.86796C25.2291 8.25848 25.2291 8.89165 24.8385 9.28217L11.7304 22.3903C11.3399 22.7808 10.7067 22.7808 10.3162 22.3903L8.57302 20.6471Z"/>
			<path d="M8.57302 20.647L4.37952 16.4535C3.989 16.063 3.989 15.4298 4.37952 15.0393L5.4156 14.0032C5.80612 13.6127 6.43929 13.6127 6.82981 14.0032L11.8401 19.0135L8.57302 20.647Z"/>
		</svg>
	`
}

export default Tick
