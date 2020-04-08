import { puffin } from '@mkenzo_8/puffin'

const CenteredLayout = puffin.element(`
	<div class="${puffin.style.css`
		&{
			display:flex;
			min-height:100%;
			min-width:100%;
			align-items:center;
			justify-content:center;
		}
	`}">
	</div>
`)

export default CenteredLayout