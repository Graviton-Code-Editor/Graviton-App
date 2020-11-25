import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

function moveToPage(page, buttons, pages) {
	pages.map(pageElement => {
		pageElement.style.display = 'none'
		if (pageElement.getAttribute('href') == page) {
			pageElement.style.display = 'block'
			const loadedEvent = new CustomEvent('loaded', {})
			pageElement.dispatchEvent(loadedEvent)
		}
	})
	buttons.map(buttonElement => {
		buttonElement.classList.remove('active')
		if (buttonElement.getAttribute('to') == page) {
			buttonElement.classList.add('active')
		}
	})
}

const renderAllPages = (pages, except) => {
	pages.map(pageElement => {
		pageElement.style.display = 'none'
		if (pageElement.getAttribute('href') == except) {
			pageElement.style.display = 'block'
		}
		const loadedEvent = new CustomEvent('loaded', {})
		pageElement.dispatchEvent(loadedEvent)
	})
}

function moveToSection(search, sections, buttons, pages) {
	const foundSection = sections.find(section => {
		return section.title && section.title.match(new RegExp(search, 'i'))
	})

	if (foundSection != null) {
		moveToPage(foundSection.page, buttons, pages)
		foundSection.element.scrollIntoView(false)
	} else {
		moveToPage('customization', buttons, pages)
	}
}
function mounted() {
	const target = this
	const defaultPage = target.getAttribute('default')

	const buttons = [...target.children[0].children]
		.map(buttonElement => {
			if (buttonElement.tagName == 'LABEL') {
				buttonElement.addEventListener('click', () => {
					moveToPage(buttonElement.getAttribute('to'), buttons, pages)
				})
				return buttonElement
			}
		})
		.filter(Boolean)

	const pages = [...target.children[1].children]
		.map(pageElement => {
			if (pageElement.tagName == 'DIV') {
				return pageElement
			}
		})
		.filter(Boolean)

	const getSections = () => {
		return pages
			.map(page => {
				return [...page.getElementsByClassName('section')]
					.map(section => {
						return {
							title: section.getAttribute('href') || section.innerText,
							page: page.getAttribute('href'),
							element: section,
						}
					})
					.filter(Boolean)
			})
			.flat()
	}

	target.searchBy = function (search) {
		renderAllPages(pages, defaultPage)
		moveToSection(search, getSections(), buttons, pages)
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

function SideMenu({ schemes }) {
	return element`
		<div mounted="${mounted}" class="${styleWrapper}"/>
	`
}

export default SideMenu
