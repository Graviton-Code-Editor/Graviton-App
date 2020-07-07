import { element, style } from '@mkenzo_8/puffin'
import { Button } from '@mkenzo_8/puffin-drac'

function storeButton() {
	return element({
		components: {
			Button,
		},
	})`<Button style="width:calc(100% - 10px)"/>`
}

export default storeButton
