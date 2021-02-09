import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import RunningConfig from 'RunningConfig'

function hideAllMenus(element) {
	const allMenus = element.parentElement.children
	for (let otherMenu of allMenus) {
		if (otherMenu.children[1]) otherMenu.children[1].style.display = 'none'
		otherMenu.children[0].classList.remove('active')
		otherMenu.setAttribute('showed', 'false')
	}
}

function toggleMenuStatus(element) {
	if (element.getAttribute('showed') == 'true') {
		if (element.children[1]) element.children[1].style.display = 'none'
		element.children[0].classList.remove('active')
		element.setAttribute('showed', 'false')
		element.parentElement.setAttribute('anyDropmenuOpened', 'false')
	} else {
		if (element.children[1]) element.children[1].style.display = 'block'
		element.children[0].classList.add('active')
		element.children[0].focus()
		element.setAttribute('showed', 'true')
		element.parentElement.setAttribute('anyDropmenuOpened', 'true')
	}
}

window.addEventListener('click', (ev: MouseEvent) => {
	ev.stopPropagation()
	const eventTarget = <HTMLElement>ev.target
	if (!eventTarget.parentElement) {
		// Prevent throwing error when the element is no longer attached to the DOM
		return
	}
	if (!eventTarget.parentElement.classList.contains('dropmenu')) {
		RunningConfig.emit('hideAllFloatingComps')
	}
})

function mounted() {
	const { id, props, children, parentElement } = this
	const isSubmenu = props.data.isSubmenu
	const itemsContainer = children[1] ? children[1] : children[0]
	if (!isSubmenu) itemsContainer.style.display = 'none'
	RunningConfig.on('hideAllFloatingComps', () => {
		itemsContainer.style.display = 'none'
		children[0].classList.remove('active')
		parentElement && parentElement.setAttribute('anyDropmenuOpened', 'false')
		this.setAttribute('showed', 'false')
		if (isSubmenu) {
			this.remove()
		}
	})
}

function onMenuHovering() {
	if (!this.parentElement) return
	if (this.getAttribute('showed') === 'true') {
		this.parentElement.setAttribute('anyDropmenuOpened', 'true')
	}
	if (this.parentElement.getAttribute('anyDropmenuOpened') === 'true') {
		hideAllMenus(this)
		toggleMenuStatus(this)
	}
}

const styleWrapper = style`
	&{
		display:block;
		white-space:nowrap;
		left:0;
	}
	& > button{
		min-height:100%;
		background:var(--menuButtonBackground);
		color:var(--menuButtonText);
		border:0px;
		outline:0;
		font-size:12px;
		box-sizing: border-box;
	}
	& > button:hover{
		min-height:100%;
		background:var(--menuButtonHoveringBackground);
		color:var(--menuButtonHoveringText);
	}
	& > button.active , & button:focus{
		background:var(--menuButtonHoveringBackground);
	}
	& > div{
		position:absolute;
		background:var(--menuBackground);
		padding:5px;
		border-radius:5px;
		border-top-left-radius:0px;
		box-shadow:0px 2px 10px rgba(0,0,0,0.2);
		z-index:1;
	}
	& > div p{
		margin:0;
		padding:0;
		height:16px;
	}
	& > div .arrow{
		right:13px;
		width:8px;
		position:absolute;
		height:16px;
	}
	& .tick {
		left: 7px;
		padding: 5px;
		margin: auto 0;
		height: 14px;
		width: 14px;
		position: absolute;
	}
	& > div a{
		display:flex;
		font-size:12px;
		padding:6px 7px;
		min-width:100px;
		border-radius:5px;
		color:var(--menuOptionText);
		cursor:pointer;
		align-items:center;
		padding-right:25px;
		outline: 0;
		-webkit-tap-highlight-color: rgba(255, 255, 255, 0); 
    -webkit-focus-ring-color: rgba(255, 255, 255, 0); 
		& p{
			margin-left: 22px;
		}
	}
	& > div a:hover{
		background:var(--menuOptionHoveringBackground);
		color:var(--menuOptionHoveringText);
	}
	& > div a:hover svg path{
		fill:var(--menuOptionHoveringText);
	}
	& div.sep{
		height:1px;
		border-radius:100px;
		width:90%;
		display:block;
		background:var(--menuDivider);
		margin:5px auto;
		box-sizing:border-box;
	}
`

function MenuComp() {
	function onMenuClicked() {
		toggleMenuStatus(this)
	}

	return element`
		<div id="${Math.random()}" mounted="${mounted}" :click="${onMenuClicked}" :mousemove="${onMenuHovering}" showed="false" class="${styleWrapper} dropmenu"/>
	`
}

export default MenuComp
