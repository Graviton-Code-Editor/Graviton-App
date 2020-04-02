import { puffin } from '@mkenzo_8/puffin'
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
	const listedMethods = buttons.map(({action})=>action)
	const NotificationComp = puffin.element(`
		<NotificationBody>
			<div>
				<Cross click="$closeNotification"/>
			</div>
			<Title>${title}</Title>
			<Content>${content}</Content>
			<div class="buttons">
				${buttons.map(({label,action},index)=>{
					return `<Button index="${index}" click="$clickedButton">${label}</Button>`
				}).join('')}
			</div>
		</NotificationBody>
	`,{
		events:{
			mounted(){
				setTimeout(()=>{
					this.remove()
				},NOTIFICATION_LIVE_TIME)
			}	
		},
		components:{
			NotificationBody,
			Title:Titles.h4,
			Content:Text,
			Cross,
			Button
		},
		methods:{
			closeNotification(){
				closeNotification(NotificationComp.node)
			},
			clickedButton(){
				NotificationComp.node.remove()
				listedMethods[this.getAttribute("index")]()
			}
		}
	})
	puffin.render(NotificationComp, document.getElementById("notifications"))
	RunningConfig.emit('notificationPushed',{
		title,
		content,
		element:NotificationComp.node
	})
}

function closeNotification(NotificationElement){
	NotificationElement.remove()
}

RunningConfig.on('notificationPushed',(notificationDetails)=>{
	RunningConfig.data.notifications.push(notificationDetails)
	if( RunningConfig.data.notifications.length > MAX_NOTIFICATIONS_LIVING ){
		const { element } = RunningConfig.data.notifications[0]
		RunningConfig.data.notifications.splice(0,1)
		RunningConfig.emit('notificationRemoved',{ element });
		closeNotification(element)
	}
})

export default Notification