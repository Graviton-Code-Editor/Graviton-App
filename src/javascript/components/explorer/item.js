import { element, render, style } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import Icons from '../../../../assets/icons/**.svg'
import ArrowIcon from '../icons/arrow'
import Explorer from '../../constructors/explorer'
import StaticConfig from 'StaticConfig'

const ItemWrapper = style`
	@keyframes appearItem{
		from {
			opacity: 0.3;
			margin-left: 5px;
		}
		to {
			margin-left: 10px;
			opacity: 1;
		}
	}
	&[animated="true"]{
		animation: appearItem 0.1s ease-out;
	}
	&{
		background:transparent;
		white-space:nowrap;
		padding:0px;
		user-select:none;
		margin-top:1px;
		margin-left: 10px;
	}
	&[animated="true"] > button:active{
		transition: 0.1s;
		transform: scale(0.97);
	}
	&[animated="true"] button{
		transition:0.07s;
	}
	& > button{
		margin:0;
		border-radius:12px;
		font-size:12px;
		padding:3px 5px;
		padding-right:9px;
		min-height: 26px;
		border:none;
		margin:0px;
		background:transparent;
		outline:0;
		white-space:nowrap;
		display:flex;
		align-items: center;
		justify-content: center;
		color:var(--explorerItemText);
	}
	& button:hover{
		background:var(--explorerItemHoveringBackground);
		border-radius:5px;
	}
	& > button > *{
		align-items: center;
		display:flex;
		color:var(--explorerItemText);
	}
	& .decorator {
		display: block;
		position:relative;
		border-radius:50px;
		margin: auto 2px;
		margin-left:6px;
		font-size:9px;
		min-width:10px;
		padding:1px 3px;
	}
	& .icon{
		height:20px;
		width:20px;
		margin-right:4px;
		position:relative;
	}
	&[animated="true"] .arrow{
		transition:0.1s;
	}
	& .arrow{
		height:8px;
		width:8px;
		position:relative;
		padding:0px;
		margin-right:6px;
		border-radius:1px;
	}
	&[itemIsOpened="true"] .arrow{
		transform:rotate(90deg);
	}
	&[itemIsOpened="false"] .arrow{
		transform:rotate(0deg);
	}
`

function Item({ label, items, mounted, icon, action, contextAction, decorator = {} }) {
	let itemIsOpened = false
	let decoratorLabel = decorator.label || ''
	let decoratorBackground = decorator.background || 'transparent'
	return element({
		components: {
			ArrowIcon,
		},
	})`
		<div itemIsOpened="${() => itemIsOpened}" class="${ItemWrapper}" mounted="${itemMounted}" animated="${StaticConfig.data.appEnableExplorerItemsAnimations}">
			<button :click="${onClick}" :contextmenu="${onContextMenu}">
				<ArrowIcon class="arrow" style="${items ? '' : 'opacity:0;'}"/>
				<img class="icon" src="${Icons[icon] ? Icons[icon] : Icons['unknown.file']}"></img>
				<span>${label}</span>
				<span class="decorator" style="background: ${() => decoratorBackground}">${() => decoratorLabel}</span>
			</button>
			<div/>
		</div>
	`
	function itemMounted() {
		if (mounted) {
			mounted(getMethods(this))
		}
	}
	function getMethods(item) {
		return {
			setIcon(newIcon) {
				setIcon(newIcon, item)
			},
			setItems(newItems) {
				setItems(newItems, item)
			},
			setDecorator(newDecorator) {
				setDecorator(newDecorator, item)
			},
		}
	}
	function setIcon() {
		const iconImg = this.getElementsByClassName('icon')[0]
		iconImg.src = Icons[icon] ? Icons[icon] : Icons['unknown.file']
	}
	function setDecorator({ label, background }, item) {
		if (label) decoratorLabel = label
		if (background) decoratorBackground = background
		const decorator = item.getElementsByClassName('decorator')[0]
		decorator.update()
	}
	function setItems(newItems, item) {
		items = newItems
		const itemExplorer = Explorer({
			items,
		})
		item.children[1].innerHTML = ''
		render(itemExplorer, item.children[1])
		itemIsOpened = true
		item.update()
	}
	function onContextMenu(e) {
		if (contextAction) {
			contextAction.bind(this)(e, getMethods(this))
		}
	}
	function onClick(e) {
		e.isOpened = itemIsOpened
		if (items) {
			if (itemIsOpened) {
				this.parentElement.children[1].innerHTML = ''
				itemIsOpened = false
			} else if (items.length != 0) {
				const itemExplorer = Explorer({
					items,
				})
				this.parentElement.children[1].innerHTML = ''
				render(itemExplorer, this.parentElement.children[1])
				itemIsOpened = true
			}
		}
		if (action) {
			action.bind(this)(e, getMethods(this.parentElement))
		}
		this.parentElement.update()
	}
}

export default Item
