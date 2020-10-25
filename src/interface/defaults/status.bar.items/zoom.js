import StatusBarItem from '../../constructors/status.bar.item'
import Plus from '../../components/icons/plus'
import Minus from '../../components/icons/minus'
import StaticConfig from 'StaticConfig'
import ContextMenu from '../../constructors/contextmenu'
import RunningConfig from 'RunningConfig'

if (!RunningConfig.data.isBrowser) {
	/*
	 * Don't load in browser version
	 */
	new StatusBarItem({
		component: Plus,
		position: 'right',
		action() {
			StaticConfig.data.appZoom += 0.1
		},
		contextAction: showZoomContext,
	})

	new StatusBarItem({
		component: Minus,
		position: 'right',
		action() {
			StaticConfig.data.appZoom -= 0.1
		},
		contextAction: showZoomContext,
	})
}

function showZoomContext(e) {
	new ContextMenu({
		list: [
			{
				label: 'Default',
				action() {
					StaticConfig.data.appZoom = 1
				},
			},
		],
		event: e,
		parent: document.body,
	})
}
