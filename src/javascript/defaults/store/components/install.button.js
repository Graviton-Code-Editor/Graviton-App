import { element, style } from '@mkenzo_8/puffin'
import { Button } from '@mkenzo_8/puffin-drac'

const styleWrapper = style`
	& {
		width: calc( 100% - 10px);
	}
`

function installButton(){
	return element({
		components:{
			Button
		}
	})`<Button class="${styleWrapper}"></Button>`
}

export default installButton