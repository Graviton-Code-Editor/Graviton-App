import { DialogOptions, DialogInstance } from './dialog'
import { NotificationOptions, NotificationInstance } from './notification'
import { ContextMenuOptions, ContextMenuInstance } from './contextmenu'
import { WindowOptions, WindowInstance } from './window'
import { RunningConfigPluginsInterface } from './running_config'

/**
 * Documented API for Graviton Editor
 *
 * @preferred
 */
declare namespace GravitonAPI {
	/**
	 * This refers to the Dialog Component, a small window, usually with a title, content and buttons.
	 *
	 * ```ts
	 * const dialogExample = new Dialog({
	 *  title: 'The title',
	 *  content: 'The content',
	 *  buttons:[
	 *   {
	 *    label: 'A button',
	 *    action(){
	 *     console.log('The button was clicked')
	 *    }
	 *   }
	 *  ]
	 * })
	 * ```
	 *
	 * @param options  Dialog's options
	 *
	 */
	function Dialog(options: DialogOptions): DialogInstance
	/**
	 * Notification constructor
	 *
	 * ```ts
	 * const notificationExample = new Dialog({
	 *  title: 'The title',
	 *  content: 'The content',
	 *  buttons:[
	 *   {
	 *    label: 'Another button',
	 *    action(){
	 *     console.log('The button was clicked')
	 *    }
	 *   }
	 *  ]
	 * })
	 * ```
	 *
	 * @param options  Notification's options
	 */
	function Notification(options: NotificationOptions): NotificationInstance
	/**
	 * Context Menu constructor
	 *
	 * ```ts
	 * const contetmenuExample = new ContextMenu({
	 *  parent: document.body,
	 *  list: [
	 *    {
	 *      label: 'A Button',
	 *      action(){
	 *       console.log('The button was clicked')
	 *      }
	 *    }
	 *   ],
	 *   x: 200,
	 *   y: 200
	 * })
	 * ```
	 *
	 * @param options  ContexMenu's options
	 */
	function ContextMenu(options: ContextMenuOptions): ContextMenuInstance
	/**
	 * Window constructor
	 *
	 * ```ts
	 * const windowExample = new Window({
	 *   component(){
	 *     return element`<p>Hello World</p>`
	 *   }
	 * })
	 *
	 * ```
	 *
	 * @param options  Window's options
	 *
	 */
	function Window(options: WindowOptions): WindowInstance
	const RunningConfig: RunningConfigPluginsInterface
}

GravitonAPI.RunningConfig.on(['aTabHasBeenCreated', 'aFileHasBeenCreated'], () => {})
