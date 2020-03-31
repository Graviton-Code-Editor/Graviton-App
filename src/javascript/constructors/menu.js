import { puffin } from '@mkenzo_8/puffin'
import MenuComp  from '../components/menu'
import ArrowIcon from '../components/icons/arrow'
import { LanguageState, getTranslation } from 'LanguageConfig'

const { remote } = window.require("electron")
const { Menu:NativeMenu } = remote
let NativeMenuBar = new NativeMenu()

function closeAllSubmenus(parent){
	const subMenusOpened = Object.keys(parent.getElementsByClassName("submenu")).map((ele)=>{
		return parent.getElementsByClassName("submenu")[ele]
	})
	subMenusOpened.map((element)=>{
		element.remove()
	})
}

function getDropmenu(list){
	return `
		<div>
			${list.map(function(option,index){
				if(option.label !== undefined){
					return`
						<div>
							<a 
								${option.hint != null?`title="${option.hint}"`:""} 
								click="${!option.list?`$${index}`:''}" 
								mouseenter="${option.list?`$${index}`:'$hideMenus'}"
							>
							<p lang-string="${option.label}">${option.label}</p>
								${option.list?'<ArrowIcon/>':''}
							</a>
						</div>`
				}else{
					return `<span/>`
				}
			}).join("")}
		</div>
	`
}

function getMenu(button,list,leftMargin){
	const isSubmenu = button == null && list != null
	const methodsToBind = Object.assign({},list.map((option)=> {
		const isOptionASubmenu = option.action == null && option.list != null
		if(isOptionASubmenu){
			return function(e){
				closeAllSubmenus(e.target.parentElement.parentElement)
				const subMenuComponent = getMenu(
					null,
					option.list,
					e.target.clientWidth+10
				)
				puffin.render(subMenuComponent,e.target.parentElement)
			}

		}else{
			return option.action
		}
	}))
	return puffin.element(`
		<MenuComp class="${isSubmenu?'submenu':''}" submenu="${isSubmenu}" style="${isSubmenu?`position:absolute;margin-top:-20px;margin-left:${leftMargin}px;`:''}">
			${isSubmenu?'':`<button mouseover="$hideMenus" click="$hideMenus" lang-string="${button}">${button}</button>`}
			${getDropmenu(list)}
		</MenuComp>
	`,{
		components:{
			MenuComp,
			ArrowIcon
		},
		methods:{
			...methodsToBind,
			hideMenus(){
				closeAllSubmenus(this.parentElement.parentElement)
			}
		},
		addons:{
			lang:puffin.lang(LanguageState)
		}
	})
}

function Menu({
	button,
	list
}){
	if(eval('process.platform') !== "darwin"){
		const MenuComponent = getMenu(button,list)
		puffin.render(MenuComponent,document.getElementById("dropmenus"))
	}else{
		appendToBar(createTemplate(button,list))
	}
}

function createTemplate(button,list){
	const { MenuItem } = remote
	return new MenuItem({
		label:button,
		submenu:parseMenu(list)
	})
}

function parseMenu(list){
	return list.map((btn)=>{
		if(btn.label && btn.action){
			return {
				label:btn.label,
				click:btn.action
			} 
		} else if(btn.label && btn.list){
			return {
				label:btn.label,
				submenu:parseMenu(btn.list)
			} 
		} else{
			return {
				type: 'separator'
			}
		} 
	})
}

function appendToBar(item){
	const { Menu:NativeMenu } = remote
	NativeMenuBar.append(item)
	NativeMenu.setApplicationMenu(NativeMenuBar)
}

export default Menu