import { element, render, lang } from '@mkenzo_8/puffin'
import NotificationBody from '../components/notification'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import Cross from '../components/icons/cross'
import RunningConfig from 'RunningConfig'
import { LanguageState } from '../utils/lang.config'

import { NotificationsLifeTime, NotificationsMaxCount } from 'Constants'
import { NotificationOptions, NotificationDetails } from 'Types/notification'

class Notification {
	public NotificationElement: HTMLElement
	constructor({ author, title = 'Notification', content = '', buttons = [], lifeTime = NotificationsLifeTime }: NotificationOptions) {
		function mounted() {
			if (lifeTime != Infinity) {
				setTimeout(() => {
					this.remove()
				}, lifeTime)
			}
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
					<Cross :click="${() => closeNotification(this.NotificationElement)}"/>
				</div>
				<div>
					<Title lang-string="${title}"/>
					${author ? element`<span>From: ${author}</span>` : element`<div/>`}
				</div>
				<Content lang-string="${content}"/>
				<div class="buttons">
					${buttons.map(({ label, action }) => {
						const clickedButton = () => {
							closeNotification(this.NotificationElement)
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
		this.NotificationElement = render(NotificationComp, document.getElementById('notifications'))

		this.emit({
			title,
			content,
			element: this.NotificationElement,
		})
	}
	public remove() {
		this.NotificationElement.remove()
	}
	private emit(notificationDetails: NotificationDetails) {
		RunningConfig.data.notifications.push(notificationDetails)
		if (RunningConfig.data.notifications.length > NotificationsMaxCount) {
			const { element } = RunningConfig.data.notifications[0]
			RunningConfig.data.notifications.splice(0, 1)
			RunningConfig.emit('aNotificationHasBeenCleared', { element })
			closeNotification(element)
		}
		RunningConfig.emit('aNotificationHasBeenEmitted', notificationDetails)
	}
}

function closeNotification(node: HTMLElement) {
	node.remove()
}

export default Notification
