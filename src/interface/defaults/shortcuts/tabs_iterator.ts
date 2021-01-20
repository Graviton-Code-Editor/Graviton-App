import RunningConfig from 'RunningConfig'
import CommandPrompt from '../../constructors/command.prompt'
import { TabEventArgs } from 'Types/tab'
import PuffinElement from 'Types/puffin.element'

let openedTabsList = []

RunningConfig.on('aTabHasBeenCreated', ({ tabElement }: TabEventArgs) => {
	openedTabsList.push({
		element: tabElement,
		title: tabElement.state.data.title,
		icon: (tabElement.children[0] as PuffinElement).src,
	})
})

RunningConfig.on('aTabHasBeenClosed', ({ tabElement }: TabEventArgs) => {
	openedTabsList.splice(getTabIndex(tabElement), 1)
})

const getTabIndex = element => {
	let i = null
	openedTabsList.find((tab, index) => {
		if (tab.element == element) i = index
	})
	return i
}
//Command: Open the tabs iterator (default: Ctrl+Tab)
RunningConfig.on('command.openCurrentPanelTabsIterator', () => {
	if (RunningConfig.data.focusedTab) {
		const focusedTabData = {
			element: RunningConfig.data.focusedTab,
			title: RunningConfig.data.focusedTab.state.data.title,
			icon: (RunningConfig.data.focusedTab.children[0] as HTMLImageElement).src,
		}

		const focusedTabIndex = getTabIndex(RunningConfig.data.focusedTab)
		openedTabsList.splice(focusedTabIndex, 1)
		openedTabsList.unshift(focusedTabData)

		new CommandPrompt({
			name: 'tab_switcher',
			showInput: false,
			scrollOnTab: true,
			closeOnKeyUp: true,
			defaultOption: openedTabsList.length > 1 ? 1 : 0,
			options: [
				...openedTabsList.map(tab => {
					return {
						icon: tab.icon,
						data: tab.element,
						label: tab.title,
					}
				}),
			],
			onSelected(res) {
				const toFocusTab = openedTabsList.find(tab => {
					return tab.element == res.data
				})
				toFocusTab && toFocusTab.element.state.emit('focusedMe')
			},
		})
	}
})
