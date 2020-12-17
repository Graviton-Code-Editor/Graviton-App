import { DialogOptions, DialogInstance } from './dialog'
import { NotificationOptions, NotificationInstance } from './notification'
import { ContextMenuOptions, ContextMenuInstance } from './contextmenu'

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
	 * @param options  Notification's options
	 */
	function ContextMenu(options: ContextMenuOptions): ContextMenuInstance
}
