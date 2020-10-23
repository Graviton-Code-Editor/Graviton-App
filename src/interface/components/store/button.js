import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'
import { Button } from '@mkenzo_8/puffin-drac'

function storeButton() {
	return element({
		components: {
			Button,
		},
	})`<Button/>`
}

export default storeButton
