import { element, render, lang } from '@mkenzo_8/puffin'
import NotificationBody from '../components/notification'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import Cross from '../components/icons/cross'
import RunningConfig from 'RunningConfig'
import { LanguageState } from 'LanguageConfig'

import { NotificationsLifeTime, NotificationsMaxCount } from 'Constants'
import { NotificationOptions, NotificationDetails } from 'Types/notification'

class Notification {
	public NotificationElement: HTMLElement
	constructor({ component, author, title = 'Notification', content = '', buttons = [], lifeTime = NotificationsLifeTime }: NotificationOptions) {
		const self = this
		function mounted() {
			this.instance = self
			if (lifeTime != Infinity) {
				setTimeout(() => {
					self.remove()
				}, lifeTime)
			}
		}

		const NotificationComp = element({
			components: {
				NotificationBody,
				Title: Titles.h5,
				Cross,
			},
			addons: [lang(LanguageState)],
		})`
			<NotificationBody mounted="${mounted}">
				<div>
					<Cross :click="${() => this.remove()}"/>
				</div>
				<div>
					${author ? element`<span>(${author} plugin)</span>` : element`<div/>`}
					<Title lang-string="${title}"/>
				</div>
				<div>
					${
						component
							? component()
							: element({
									components: {
										Content: Text,
									},
							  })`<Content class="content" lang-string="${content}"/>`
					}
				</div>
				<div class="buttons">
					${buttons.map(({ label, action }) => {
						const clickedButton = () => {
							this.remove()
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
			instance: this,
		})
	}
	public remove() {
		this.NotificationElement.classList.add('closing')
		setTimeout(() => {
			this.NotificationElement.remove()
		}, 135)
	}
	private emit(notificationDetails: NotificationDetails) {
		RunningConfig.data.notifications.push(notificationDetails)
		if (RunningConfig.data.notifications.length > NotificationsMaxCount) {
			const { instance, element } = RunningConfig.data.notifications[0]
			RunningConfig.data.notifications.splice(0, 1)
			RunningConfig.emit('aNotificationHasBeenCleared', {
				element,
			})
			instance.remove()
		}
		RunningConfig.emit('aNotificationHasBeenEmitted', notificationDetails)
	}
}

export default Notification
