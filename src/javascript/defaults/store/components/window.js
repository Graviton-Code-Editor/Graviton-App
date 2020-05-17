import semver from 'semver'
import packageJSON from '../../../../../package.json'
import { element, style } from '@mkenzo_8/puffin'
import { Titles, Card, Button, Text } from '@mkenzo_8/puffin-drac'
import { LanguageState, getTranslation } from 'LanguageConfig'
import SideMenu from '../../../components/window/side.menu'
import installPlugin from '../utils/install.plugin'
import uninstallPlugin from '../utils/uninstall.plugin'
import Window from '../../../constructors/window'
import storeButton from './button'
import Notification from '../../../constructors/notification'

const pluginReserved = pluginName => pluginName == 'Arctic' || pluginName == 'Night'

const getPluginInfo = (object, key) => {
	if (object[key]) {
		return object[key]
	} else {
		return 'Unknown'
	}
}

function getCompatiblePugin(gravitonVersion, releases) {
	if (!releases) return false
	return releases.find(rel => {
		if (gravitonVersion.match(new RegExp(rel.target)) && semver.gt(gravitonVersion, rel.minTarget)) {
			return rel
		}
	})
}
function hasUpdate(pluginVersion, localPluginVersion) {
	if (semver.valid(pluginVersion) && semver.valid(localPluginVersion)) {
		return semver.gt(pluginVersion, localPluginVersion)
	}
	return false
}

const styleWrapper = style`
	& .content {
		overflow: hidden;
	}
	& .content > div{
		overflow:auto; 
		min-height: calc( 100% - 100px);
	}
	& .content > .buttons{
		max-height: 140px;
		min-height: 50px;
	}
	& .content > .buttons *{
		min-height: 36px;
	}
	& .error {
		margin-top: 7px;
		text-decoration: underline;
	}
`

function pluginWindow({ name, releases, id, repository, author = 'Unknown' }, { name: localName, version: localVersion = 'Unknown', id: localId, author: localAuthor = 'Unknown' }, isInstalled) {
	const pluginInfo = arguments[0]
	const pluginLocalInfo = arguments[1]
	const pluginInfoValid = Object.assign({}, pluginInfo, pluginLocalInfo)

	const pluginCompatibleVersion = getCompatiblePugin(packageJSON.version, pluginInfoValid.releases)

	const isPluginReserved = pluginReserved(pluginInfoValid.name)

	if (!isPluginReserved && pluginInfoValid.releases && pluginCompatibleVersion) {
		var { version: lastReleaseVersion, target: lastReleaseTarget } = pluginCompatibleVersion
	} else {
		var lastReleaseVersion = 'Unknown'
		var lastReleaseTarget = 'Unknown'
	}

	const newUpdate = hasUpdate(lastReleaseVersion, localVersion)
	const haveRelease = lastReleaseVersion !== 'Unknown'
	const component = element({
		components: {
			H2: Titles.h2,
			SideMenu,
			Text,
		},
	})`
		<SideMenu default="about">
			<div>
				<H2>${getPluginInfo(pluginInfoValid, 'name')}</H2>
				<label to="about" lang-string="misc.About"/>
			</div>
			<div class="${styleWrapper}">
				<div href="about" class="content">
					<div>
						<Text>
							<b lang-string="misc.Author" string="{{misc.Author}}: ${getPluginInfo(pluginInfoValid, 'author')}"/>
						</Text>
						<Text lang-string="misc.LastVersion" string="{{misc.LastVersion}}: ${lastReleaseVersion}"/>
						<Text lang-string="misc.InstalledVersion" string="{{misc.InstalledVersion}}: ${localVersion}"/>
						${(!isPluginReserved && !pluginCompatibleVersion && getNoCompatibleversion()) || element`<div/>`}
					</div>
					<div class="buttons">
						${getUpdateButton()}
						${getUninstallButton() || getInstallButton() || element`<div/>`}
					</div>
				</div>
			</div>
		</SideMenu>
	`
	function getNoCompatibleversion() {
		return element({
			components: {
				Text,
			},
		})` <Text class="error" lang-string="windows.Store.AnyCompatibleVersion"/>`
	}
	function getUpdateButton() {
		if (newUpdate) {
			return element({
				components: {
					storeButton,
				},
			})` <storeButton :click="${update}" lang-string="windows.Store.Update"/>`
		}
		return element`<div/>`
	}
	function getInstallButton() {
		if (!isInstalled && haveRelease) {
			return element({
				components: {
					storeButton,
				},
			})` <storeButton :click="${install}" lang-string="windows.Store.Install"/>`
		}
		return null
	}
	function getUninstallButton() {
		if (isInstalled && !pluginReserved(pluginInfoValid.name)) {
			return element({
				components: {
					storeButton,
				},
			})`<storeButton :click="${uninstall}" lang-string="windows.Store.Uninstall"/>`
		} else {
			return null
		}
	}
	function update() {
		installPlugin({
			id: pluginInfoValid.id,
			release: pluginInfoValid.releases[0].url,
		}).then(() => {
			pluginUpdatedNotification(pluginInfoValid.name)
		})
	}
	function install() {
		installPlugin({
			id: pluginInfoValid.id,
			release: pluginInfoValid.releases[0].url,
		}).then(() => {
			pluginInstalledNotification(pluginInfoValid.name)
		})
	}
	function uninstall() {
		uninstallPlugin(pluginInfoValid).then(() => {
			pluginUninstalledNotification(pluginInfoValid.name)
		})
	}
	const pluginWindow = new Window({
		component: () => component,
		height: '55%',
		width: '45%',
	})
	pluginWindow.launch()
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
