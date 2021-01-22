import CommandPrompt from '../../constructors/command.prompt'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import PluginsRegistry from 'PluginsRegistry'
import About from '../dialogs/about'
import Languages from '../../collections/languages'
import configEditor from '../tabs/config.editor.js'
import Settings from '../windows/settings'
import Dashboard from '../windows/dashboard'
import Store from '../windows/store'

//Command: Open the global command prompt (default: Ctrl+P)
RunningConfig.on('command.openCommandPrompt', () => {
	new CommandPrompt({
		name: 'global',
		showInput: true,
		inputPlaceHolder: 'Enter a command',
		options: [
			{
				label: 'Open Settings',
				action: () => Settings().launch(),
			},
			{
				label: 'Open Projects',
				action: () => {
					/*
					 * Prevent opening the Welcome window in Browser mode
					 */
					if (!RunningConfig.data.isBrowser) {
						Dashboard().launch()
					}
				},
			},
			{
				label: 'Open Workspaces',
				action: () => {
					/*
					 * Prevent opening the Welcome window in Browser mode
					 */
					if (!RunningConfig.data.isBrowser) {
						Dashboard({
							defaultPage: 'workspaces',
						}).launch()
					}
				},
			},
			{
				label: 'Open Store',
				action: () => {
					/*
					 * Prevent opening Store in Browser mode
					 */
					if (!RunningConfig.data.isBrowser) {
						Store().launch()
					}
				},
			},
			{
				label: 'Open About',
				action: () => About().launch(),
			},
			{
				label: 'Open Manual Configuration',
				action: () => configEditor(),
			},
			{
				label: 'Set Theme',
				action: () => {
					const configuredTheme = StaticConfig.data.appTheme
					const registry = PluginsRegistry.registry.data.list
					new CommandPrompt({
						showInput: true,
						inputPlaceHolder: 'Select a theme',
						options: [
							...Object.keys(registry)
								.map(name => {
									const pluginInfo = registry[name]
									if (pluginInfo.type == 'theme') {
										return {
											label: name,
											selected: configuredTheme === name,
										}
									}
								})
								.filter(Boolean),
						],
						onSelected(res) {
							StaticConfig.data.appTheme = res.label
						},
						onScrolled(res) {
							StaticConfig.data.appTheme = res.label
						},
					})
				},
			},
			{
				label: 'Set zoom',
				action: () => {
					new CommandPrompt({
						showInput: false,
						options: [
							{
								label: 'Default',
								action() {
									StaticConfig.data.appZoom = 1
								},
							},
							{
								label: 'Increase',
								action() {
									StaticConfig.data.appZoom += 0.1
								},
							},
							{
								label: 'Decrease',
								action() {
									StaticConfig.data.appZoom -= 0.1
								},
							},
						],
					})
				},
			},
			{
				label: 'Set Language',
				action: () => {
					const configuredLanguage = StaticConfig.data.appLanguage
					new CommandPrompt({
						showInput: true,
						inputPlaceHolder: 'Select a language',
						options: [
							...Object.keys(Languages).map(lang => {
								const languageName = Languages[lang].name
								return {
									data: lang,
									label: languageName,
									selected: configuredLanguage === languageName,
								}
							}),
						],
						onSelected(res) {
							StaticConfig.data.appLanguage = res.data
						},
						onScrolled(res) {
							StaticConfig.data.appLanguage = res.data
						},
					})
				},
			},
			{
				label: 'Set provider',
				action: () => {
					const configuredProviderName = RunningConfig.data.explorerProvider.providerName
					new CommandPrompt({
						showInput: true,
						inputPlaceHolder: 'Select a provider',
						options: [
							...RunningConfig.data.registeredExplorerProviders.map(provider => {
								const providerName = provider.providerName
								return {
									data: {
										provider,
									},
									label: providerName,
									selected: true,
								}
							}),
						],
						onSelected(res) {
							RunningConfig.data.explorerProvider = res.data.provider
						},
						onScrolled(res) {
							RunningConfig.data.explorerProvider = res.data.provider
						},
					})
				},
			},
			...RunningConfig.data.globalCommandPrompt,
		],
	})
})
