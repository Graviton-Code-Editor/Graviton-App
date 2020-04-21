import { element, style, render } from '@mkenzo_8/puffin'
import NotificationBody from '../components/notification'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import Cross from '../components/icons/cross'
import RunningConfig from '../utils/running.config'

const NOTIFICATION_LIVE_TIME = 6000 //Notification will fade out in 6 seconds after appear
const MAX_NOTIFICATIONS_LIVING = 3 //There can only be 3 notifications living at once

function Notification({
	title = 'Notification',
	content = '',
	buttons = []
}){
	const listedMethods = buttons.map(({ action }) => action )
	function mounted(){
		setTimeout(
			() => {
				this.remove()
			},
			NOTIFICATION_LIVE_TIME
		)
	}
	const randomSelector = Math.random()
	const NotificationComp = element({
		components:{
			NotificationBody,
			Title:Titles.h4,
			Content:Text,
			Cross
		}
	})`
		<NotificationBody id="${randomSelector}" mounted="${mounted}">
			<div>
				<Cross :click="${closeNotification}"/>
			</div>
			<Title>${ title }</Title>
			<Content>${ content }</Content>
			<div class="buttons">
				${buttons.map(({ label, action }, index)=>{
					return element({
						components:{
							Button
						}
					})`<Button index="${ index }" :click="${clickedButton}">${ label }</Button>`
				})}
			</div>
		</NotificationBody>
	`
	function closeNotification(){
		NotificationNode.remove()
	}
	function clickedButton(){
		closeNotification()
		listedMethods[this.getAttribute('index')]()
	}
	render( NotificationComp, document.getElementById('notifications') )
	const NotificationNode = document.getElementById( randomSelector )
	RunningConfig.emit('notificationPushed',{
		title,
		content,
		element:NotificationNode
	})
}

RunningConfig.on('notificationPushed', notificationDetails => {
	RunningConfig.data.notifications.push( notificationDetails )
	if( RunningConfig.data.notifications.length > MAX_NOTIFICATIONS_LIVING ){
		const { element } = RunningConfig.data.notifications[0]
		RunningConfig.data.notifications.splice(0,1)
		RunningConfig.emit('notificationRemoved',{ element });
		closeNotification(element)
	}
})

export default Notification