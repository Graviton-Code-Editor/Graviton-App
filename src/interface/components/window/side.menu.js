import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

function moveToPage(page, buttons, pages) {
	pages.map(function (contentPage) {
		contentPage.style.display = 'none'
		if (contentPage.getAttribute('href') == page) {
			contentPage.style.display = 'block'
			const loadedEvent = new CustomEvent('loaded', {})
			contentPage.dispatchEvent(loadedEvent)
		}
	})
	buttons.map(function (buttonPage) {
		buttonPage.classList.remove('active')
		if (buttonPage.getAttribute('to') == page) {
			buttonPage.classList.add('active')
		}
	})
}

function moveToSection(search, sections, buttons, pages) {
	const result = sections.filter(section => section.title && section.title.match(new RegExp(search, 'i')))[0]
	if (result != null) {
		moveToPage(result.page, buttons, pages)
		result.element.scrollIntoView(false)
	}
}
function mounted(a) {
	const target = this
	const defaultPage = target.getAttribute('default')
	const buttons = Object.keys(target.children[0].children)
		.map(btn => {
			const button = target.children[0].children[btn]
			if (button.tagName == 'LABEL') {
				button.addEventListener('click', () => {
					moveToPage(button.getAttribute('to'), buttons, pages)
				})
				return button
			}
		})
		.filter(Boolean)
	const pages = Object.keys(target.children[1].children)
		.map(pg => {
			const page = target.children[1].children[pg]
			if (page.tagName == 'DIV') {
				return page
			}
		})
		.filter(Boolean)
	const sections = pages
		.map(page => {
			return Object.keys(page.children).map(function (index) {
				const section = page.children[index]
				if (section.tagName == 'DIV') {
					return {
						title: section.getAttribute('href'),
						page: page.getAttribute('href'),
						element: section,
					}
				}
			})
		})
		.flat()
	target.searchBy = function (search) {
		moveToSection(search, sections, buttons, pages)
	}
	moveToPage(defaultPage, buttons, pages)
}

const styleWrapper = style`
	& {
		display:flex;
		max-height:100%;
		flex:1;
		overflow:hidden;
		user-select:none;
	}
	& > div:nth-child(1){
		background:var(--sidemenuBackground);
		min-height:100%;
		min-width:180px;
		max-width:180px;
		display:flex;
		flex-direction:column;
		padding:20px;
		overflow:auto;
		box-shadow:0px 0px 10px rgba(0,0,0,0.2);
	}
	& > div:nth-child(1) > h1 {
		overflow:hidden;
		text-overflow:ellipsis;
		text-align: center;
		font-size: 25px;
		max-width: 100%;
		margin: 20px 0;
		margin-bottom: 27px;
	}
	& > div:nth-child(1) > label {
		transition:0.04s;
		display:block;
		white-space:prewrap;
		padding:7px 9px;
		border-radius:6px;
		background:var(--sidemenuButtonBackground);
		color:var(--sidemenuButtonText);
		margin:1px 0px;
		font-size:13px;
		&:hover:not(.active) {
			transition:0.04s;
			background:var(--sidemenuButtonHoveringBackground);
		}
		&.active {
			background:var(--sidemenuButtonActiveBackground);
			color:var(--sidemenuButtonActiveText);
		}
	}
	& > div:nth-child(2){
		background:transparent;
		min-height:auto;
		max-height:100%;
		width:auto;
		height:auto;
		overflow:auto;
		padding:15px;
		flex:1;
	}
	& > div:nth-child(2) > div > div h4{
		margin-bottom: 2px;
		font-size: 14px;
	}
`

function SideMenu() {
	return element`
		<div mounted="${mounted}" class="${styleWrapper}"/>
	`
}

export default SideMenu
