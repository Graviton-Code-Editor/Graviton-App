import { element, style, render } from '@mkenzo_8/puffin'
import { Titles, RadioGroup, Text, Button } from '@mkenzo_8/puffin-drac'
import { LanguageState } from 'LanguageConfig'
import Window from '../../constructors/window'
import StaticConfig from 'StaticConfig'
import SideMenu from '../../components/window/side.menu'
import getList from '../store/api/get.list'
import StoreCard from '../../components/store/card'
import Loader from '../../components/loader'

import HomePage from '../store/pages/home'
import InstalledPage from '../store/pages/installed'

import { WindowInstance } from 'Types/window'

function Store(): WindowInstance {
	const StorePage = element({
		components: {
			H1: Titles.h1,
			SideMenu,
			HomePage,
			InstalledPage,
		},
	})`
		<SideMenu default="home" style="min-height:100%;">
			<div>
				<H1 lang-string="windows.Store.Store"/>
				<label to="home" lang-string="windows.Store.Home.Home"/>
				<label to="installed" lang-string="windows.Store.Installed.Installed"/>
			</div>
			<div>
				<HomePage/>
				<InstalledPage/>
			</div>
		</SideMenu>
	`
	return new Window({
		title: 'store',
		component: () => StorePage,
	})
}

export default Store
