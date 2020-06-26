import { element, style } from '@mkenzo_8/puffin'
import { Input } from '@mkenzo_8/puffin-drac'

const styleWrapper = style`
	&{
		--puffinInputBackground: var(--sidemenuSearcherBackground);
		--textColor: var(--sidemenuSearcherText);
		--inputBorder: var(--sidemenuSearcherBorder);
		margin: 10px 0px;
	}
`

function SideMenuSearcher() {
	return element({
		components: {
			Input,
		},
	})`
		<Input  mounted="${mounted} :keyup="${writing}" placeHolder="Search" class="${styleWrapper}"/>
	`
}

function writing() {
	filterBy(this.parentElement.parentElement, this.value)
}

function mounted() {
	this.focus()
}

const filterBy = (container, search) => container.searchBy(search)

export default SideMenuSearcher
