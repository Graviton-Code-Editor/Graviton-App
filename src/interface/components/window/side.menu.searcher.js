import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import { Input } from '@mkenzo_8/puffin-drac'

const styleWrapper = style`
	&{
		--puffinInputBackground: var(--sidemenuSearcherBackground);
		--textColor: var(--sidemenuSearcherText);
		--inputBorder: var(--sidemenuSearcherBorder);
		margin: 4px 3px !important;
	}
`

function SideMenuSearcher() {
	return element({
		components: {
			Input,
		},
	})`
		<Input mounted="${mounted}" :keyup="${writing}" placeHolder="Search" class="${styleWrapper}"/>
	`
}

function writing() {
	filterBy(this.parentElement.parentElement, this.value)
}

function mounted() {
	setTimeout(() => this.focus(), 1)
}

const filterBy = (container, search) => container.searchBy(search)

export default SideMenuSearcher
