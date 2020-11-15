import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

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
	moveToPage(defaultPage, buttons, pages)
}

const styleWrapper = style`
	& {
		display:flex;
		max-height:100%;
		height: 100%;
		flex:1;
		overflow:hidden;
		user-select:none;
	}
	& > div:nth-child(1){
		background: transparent;
		display:flex;
		flex-direction:row;
		justify-content: center;
		padding:3px 15px;
		overflow:auto;
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
		padding:8px 12px;
		border-radius:5px;
		background:var(--topmenuButtonBackground);
		color:var(--sidemenuButtonText);
		margin:1px 2px;
		font-size:13px;
		height: 15px;
		min-height: 15px;
		&:hover:not(.active) {
			transition:0.04s;
			background:var(--topmenuButtonHoveringBackground);
		}
		&.active {
			background:var(--topmenuButtonActiveBackground);
			color:var(--topmenuButtonActiveText);
		}
	}
	& > div:nth-child(2){
		background:transparent;
		overflow:auto;
		margin-top:5px;
		padding: 5px;
		flex:1;
	}
	& > div:nth-child(2) > div > div h4{
		margin-bottom: 2px;
		font-size: 14px;
	}
`

function TopMenu() {
	return element`
		<div mounted="${mounted}" class="${styleWrapper}"/>
	`
}

export default TopMenu
