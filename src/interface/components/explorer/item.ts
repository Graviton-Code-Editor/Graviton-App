import { element, render } from '@mkenzo_8/puffin'
import RunningConfig from 'RunningConfig'
import ArrowIcon from '../icons/arrow'
import Explorer from '../../constructors/explorer'
import StaticConfig from 'StaticConfig'
import { css as style } from '@emotion/css'
import { ExplorerItemOptions, ExplorerItemDecorator } from 'Types/explorer'
import PuffinElement from 'Types/puffin.element'

const ItemWrapper = style`
	@keyframes appearItem{
		from {
			opacity: 0.35;
			transform: translateX(-10px);
		}
		to {
			transform: translateX(0px);
			margin-left: 10px;
			opacity: 1;
		}
	}
	&{
		animation: appearItem 0.07s ease-out;
		background:transparent;
		white-space:nowrap;
		padding:0px;
		user-select:none;
		margin-top:1px;
		margin-left: 10px;
	}
	& button{
		transition:0.015s;
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
		border-radius:20px;
		margin: auto 2px;
		margin-left:6px;
		font-size: 9px;
		min-width:4px;
		padding: 1px 3px;
		min-height: 6px;
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

class Item {
	itemIsOpened: boolean = false
	decoratorLabel: String
	decoratorBackground: String
	decoratorColor: String
	decoratorFontSize: String
	configuredIcon: String
	items: ExplorerItemOptions[]
	action: any
	contextAction: any
	label: String

	constructor({ component, label, items, mounted, icon, iconComp, action, contextAction, decorator = {}, hint = '' }: ExplorerItemOptions) {
		this.decoratorLabel = decorator?.label || ''
		this.decoratorBackground = decorator?.background || 'transparent'
		this.decoratorColor = decorator?.color || 'var(--textColor)'
		this.decoratorFontSize = decorator?.fontSize || '9px'
		this.configuredIcon = icon
		this.items = items
		this.label = label
		this.action = action
		this.contextAction = contextAction
		const self = this

		function itemMounted() {
			if (mounted) {
				mounted.bind(this)(self.getHooks(this))
			}
			if (iconComp) {
				RunningConfig.on('updatedIconpack', () => {
					self.setIcon(self.configuredIcon, this)
				})
			}
		}

		function onContextMenu(event: MouseEvent) {
			if (contextAction) {
				contextAction.bind(this)(event, self.getHooks(this))
			}
		}
		function onClick(event: MouseEvent) {
			if (self.items) {
				if (self.itemIsOpened) {
					this.parentElement.children[1].innerHTML = ''
					self.itemIsOpened = false
				} else if (self.items.length != 0) {
					const itemExplorer = Explorer({
						items: self.items,
					})
					this.parentElement.children[1].innerHTML = ''
					self.itemIsOpened = true
					render(itemExplorer, this.parentElement.children[1])
				}
			}
			if (action) {
				action.bind(this)(event, self.getHooks(this.parentElement))
			}
			this.parentElement.update()
		}

		const iconSrc = this.getIcon(icon)

		let itemComponent

		if (component) {
			itemComponent = component()
		} else {
			itemComponent = element({
				components: {
					ArrowIcon,
				},
			})`
			<button :click="${onClick}" :contextmenu="${onContextMenu}"  title="${hint}">
				<ArrowIcon class="arrow" style="${items ? '' : 'opacity:0;'}"/>
				${iconComp ? iconComp() : element`<img class="icon" src="${iconSrc}"/>`}
				<span class="label">${() => this.label}</span>
				<span class="decorator" style="font-size: ${() => this.decoratorFontSize};color: ${() => this.decoratorColor}; background: ${() => this.decoratorBackground}">${() => this.decoratorLabel}</span>
			</button>
			<div/>
			`
		}

		return element`
			<div itemIsOpened="${() => this.itemIsOpened}" class="${ItemWrapper}" mounted="${itemMounted}" animated="${StaticConfig.data.appEnableExplorerItemsAnimations}">
				${itemComponent}
			</div>
		`
	}
	/*
	 * Get icon from current loaded Iconpack
	 */
	getIcon(icon: any) {
		return RunningConfig.data.iconpack[icon] ? RunningConfig.data.iconpack[icon] : RunningConfig.data.iconpack['unknown.file']
	}
	/*
	 * Get Item's hooks
	 */
	getHooks(item: HTMLElement) {
		return {
			setIcon: (newIcon: String) => {
				this.setIcon(newIcon, item)
				this.configuredIcon = newIcon
			},
			setLabel: (newLabel: string) => {
				this.setLabel(newLabel, item)
			},
			setItems: (newItems: ExplorerItemOptions[], openItems: boolean = true) => {
				this.setItems(newItems, openItems, item)
			},
			setDecorator: (newDecorator: ExplorerItemDecorator) => {
				this.setDecorator(newDecorator, item)
			},
		}
	}
	/*
	 * Update Item's label
	 */
	setLabel(label: String, item: HTMLElement) {
		const labelElement: any = item.getElementsByClassName('label')[0]
		this.label = label
		labelElement.update()
	}
	/*
	 * Update Item's icon
	 */
	setIcon(icon: String, item: HTMLElement) {
		const iconImg: any = item.getElementsByClassName('icon')[0]
		// Icon might not exist because there is a component icon
		if (iconImg) {
			iconImg.src = this.getIcon(icon)
		}
	}
	/*
	 * Update Item's decorator
	 */
	setDecorator({ label, background, color, fontSize }: ExplorerItemDecorator, item: PuffinElement) {
		if (label) this.decoratorLabel = label
		if (background) this.decoratorBackground = background
		if (color) this.decoratorColor = color
		if (fontSize) this.decoratorFontSize = fontSize
		const decorator = <PuffinElement>item.getElementsByClassName('decorator')[0]
		decorator.update()
	}
	/*
	 * Update Item's inner items
	 */
	setItems(newItems: ExplorerItemOptions[], openItems: boolean, item: PuffinElement) {
		this.items = newItems
		if (this.itemIsOpened || openItems) {
			const itemExplorer = Explorer({
				items: this.items,
			})
			item.children[1].innerHTML = ''
			render(itemExplorer, item.children[1])
			this.itemIsOpened = true
		}

		item.update()
	}
}

export default Item
