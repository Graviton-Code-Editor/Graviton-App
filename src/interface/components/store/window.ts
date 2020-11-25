import semver from 'semver'
import packageJSON from '../../../../package.json'
import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import { Titles, Card, Button, Text } from '@mkenzo_8/puffin-drac'
import { LanguageState } from 'LanguageConfig'
import SideMenu from '../window/side_menu'
import { installPluginFromURL } from '../../defaults/store/utils/install.plugin'
import uninstallPlugin from '../../defaults/store/utils/uninstall.plugin'
import Window from '../../constructors/window'
import storeButton from './button'
import Notification from '../../constructors/notification'
import getCompatibleRelease from '../../defaults/store/utils/get.compatible.release'
import DefaultPluginIcon from '../icons/plugin_store'

const styleWrapper = style`
	& .content {
		overflow: hidden;
	}
	& .content span{
		font-size: 15px;
	}
	& .content > div{
		overflow:auto; 
		height: 100%;
		& > .horizontal_view {
			display: flex;
			& .buttons {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				max-height: 145px;
				text-align: center;
				& button {
					max-width: 150px;
				}
			}
			& .title {
				display: flex;
				align-items:flex-start;
				& h2 {
					margin-top: 10px;
				}
				& > div > * {
					margin-left: 2px;
					padding: 5px;
					margin-bottom: 7px;
				}
			}
			& .author {
				margin-bottom: 5px;
			}
			& .plugin_icon {
				width: 115px;
				height: 115px;
				border-radius:8px;
				box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
				padding: 0px;
				margin: 12px;
				display: flex;
				justify-content: center;
				align-items: center;
				background: var(--cardBackground);
			}
		}
		& .description {
			padding: 8px 12px;
		}
	}
	& .error {
		margin: 0px 12px;
		max-width: 250px;
		background: var(--cardBackground);
		padding: 12px 10px;
		border-radius: 6px;
	}
`

class pluginWindow {
	isInstalled: boolean
	isReserved: boolean
	lastReleaseVersion: string = 'Unknown'
	lastReleaseTarget: string = 'Unknown'
	lastRelease: any
	hasAnyUpdate: boolean

	remotePackage: any
	localPackage: any
	usefulPackage: any

	constructor(remotePackage, localPackage, isInstalled, isReserved) {
		this.isInstalled = isInstalled
		this.isReserved = isReserved
		this.remotePackage = remotePackage
		this.localPackage = localPackage

		this.init()

		const component = element({
			components: {
				H1: Titles.h1,
				H2: Titles.h2,
				SideMenu,
				Text,
				Button,
				Icon: this.getPluginIcon(),
			},
		})`
		<SideMenu default="about">
			<div>
				<H1>${this.usefulPackage.name}</H1>
				<label to="about" lang-string="misc.About"/>
			</div>
			<div class="${styleWrapper}">
				<div href="about" class="content">
					<div>
						<div class="horizontal_view">
							<div class="title">
								<Icon class="plugin_icon"/>
								<div>
									<H2>${this.usefulPackage.name}</H2>
									<Text class="author" lang-string="misc.By" string="{{misc.By}} ${this.usefulPackage.author}"/>
									<span>
										${this.usefulPackage.version ? `v${this.usefulPackage.version}` : ''}
									</span>
								</div>
							</div>
							<div class="buttons">
								${this.getUpdateButton()}
								${this.getUninstallButton() || this.getInstallButton() || element`<div/>`}
							</div>
						</div>
						<Text class="description">
							${this.usefulPackage.description}
						</Text>
							${(!this.isReserved && !this.lastRelease && this.getNoCompatibleversion()) || element`<div/>`}
					</div>
				</div>
			</div>
		</SideMenu>
		`

		const pluginWindow = new Window({
			component: () => component,
			minWidth: '300px',
			minHeight: '250px',
			height: '65%',
			width: '70%',
		})

		pluginWindow.launch()
	}
	init() {
		this.usefulPackage = Object.assign({}, this.remotePackage, this.localPackage)
		this.lastRelease = getCompatibleRelease(packageJSON.version, this.usefulPackage.releases)

		if (!this.isReserved && this.usefulPackage.releases && this.lastRelease) {
			this.lastReleaseVersion = this.lastRelease.version
			this.lastReleaseTarget = this.lastRelease.target
		}
		if (semver.valid(this.lastReleaseVersion) && semver.valid(this.localPackage.version)) {
			this.hasAnyUpdate = semver.gt(this.lastReleaseVersion, this.localPackage.version)
		} else {
			this.hasAnyUpdate = false
		}
	}
	getPluginIcon() {
		if (this.usefulPackage.plugin) {
			//WIP
		} else {
			//Fallback icon
			return DefaultPluginIcon
		}
	}
	getNoCompatibleversion() {
		return element({
			components: {
				Text,
			},
		})` <Text class="error" lang-string="windows.Store.AnyCompatibleVersion"/>`
	}
	getUpdateButton() {
		if (this.hasAnyUpdate) {
			return element({
				components: {
					Button,
				},
			})` <Button :click="${this.update.bind(this)}" lang-string="windows.Store.Update"/>`
		}
		return element`<div/>`
	}
	getInstallButton() {
		if (!this.isInstalled && this.lastReleaseVersion !== 'Unknown') {
			return element({
				components: {
					Button,
				},
			})`<Button :click="${this.install.bind(this)}" lang-string="windows.Store.Install" string="{{windows.Store.Install}} v${this.lastReleaseVersion}"/>`
		}
		return null
	}
	getUninstallButton() {
		if (this.isInstalled && !this.isReserved) {
			return element({
				components: {
					Button,
				},
			})`<Button :click="${this.uninstall.bind(this)}" lang-string="windows.Store.Uninstall"/>`
		} else {
			return null
		}
	}
	update() {
		installPluginFromURL({
			id: this.usefulPackage.id,
			release: this.lastRelease.url,
		}).then(() => {
			pluginUpdatedNotification(this.usefulPackage.name)
		})
	}
	install() {
		installPluginFromURL({
			id: this.usefulPackage.id,
			release: this.lastRelease.url,
		}).then(() => {
			pluginInstalledNotification(this.usefulPackage.name)
		})
	}
	uninstall() {
		uninstallPlugin(this.usefulPackage).then(() => {
			pluginUninstalledNotification(this.usefulPackage.name)
		})
	}
}

function verifyTarget(must, is) {
	if (semver.valid(must) && semver.valid(is)) {
		return semver.gte(must, is)
	}
	return false
}

function pluginUpdatedNotification(pluginName) {
	new Notification({
		title: `Updated ${pluginName}`,
	})
}

function pluginInstalledNotification(pluginName) {
	new Notification({
		title: `Installed ${pluginName}`,
	})
}

function pluginUninstalledNotification(pluginName) {
	new Notification({
		title: `Uninstalled ${pluginName}`,
	})
}
export default pluginWindow
