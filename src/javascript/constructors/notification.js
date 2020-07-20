import { element, render, lang } from '@mkenzo_8/puffin'
import NotificationBody from '../components/notification'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import Cross from '../components/icons/cross'
import RunningConfig from 'RunningConfig'
import { LanguageState } from '../utils/lang.config'

const NOTIFICATION_LIVE_TIME = 6000 //Notification will fade out in 6 seconds after appear
const MAX_NOTIFICATIONS_LIVING = 3 //There can only be 3 notifications living at once

function Notification({ title = 'Notification', content = '', buttons = [] }) {
	const listedMethods = buttons.map(({ action }) => action)
	function mounted() {
		setTimeout(() => {
			this.remove()
		}, NOTIFICATION_LIVE_TIME)
	}
	const NotificationComp = element({
		components: {
			NotificationBody,
			Title: Titles.h5,
			Content: Text,
			Cross,
		},
		addons: [lang(LanguageState)],
	})`
		<NotificationBody mounted="${mounted}">
			<div>
				<Cross :click="${() => closeNotification(NotificationNode)}"/>
			</div>
			<Title lang-string="${title}"/>
			<Content lang-string="${content}"/>
			<div class="buttons">
				${buttons.map(({ label, action }, index) => {
					function clickedButton() {
						closeNotification(NotificationNode)
						action()
					}
					return element({
						components: {
							Button,
						},
					})`<Button :click="${clickedButton}" lang-string="${label}"/>`
				})}
			</div>
		</NotificationBody>
	`
	const NotificationNode = render(NotificationComp, document.getElementById('notifications'))
	RunningConfig.emit('notificationPushed', {
		title,
		content,
		element: NotificationNode,
	})
}

function closeNotification(node) {
	node.remove()
}

RunningConfig.on('notificationPushed', notificationDetails => {
	RunningConfig.data.notifications.push(notificationDetails)
	if (RunningConfig.data.notifications.length > MAX_NOTIFICATIONS_LIVING) {
		const { element } = RunningConfig.data.notifications[0]
		RunningConfig.data.notifications.splice(0, 1)
		RunningConfig.emit('notificationRemoved', { element })
		closeNotification(element)
	}
})

export default Notification
