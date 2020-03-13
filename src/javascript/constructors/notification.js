import { puffin } from '@mkenzo_8/puffin'
import NotificationBody from '../components/notification'
import { Titles, Text, Button } from '@mkenzo_8/puffin-drac'
import Cross from '../components/icons/cross'
import RunningConfig from '../utils/running.config'

function Notification({
	title = 'Title',
	content = '',
	buttons = {}
}){
	const listedMethods = buttons.map(({action})=>action)
	const NotificationComp = puffin.element(`
	<NotificationBody>
			<div><Cross click="$closeNotification"/></div>
			<Title>${title}</Title>
			<Content>${content}</Content>
			<div class="buttons">
				${(()=>{
					let content = ""
					buttons.map(({label,action},index)=>{
						content +=`<Button index="${index}" click="$clickedButton">${label}</Button>`
					})
					return content;
				})()}
			</div>
		</NotificationBody>
`,{
		components:{
			NotificationBody,
			Title:Titles.h3,
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
	const maxNotifactionsOpened = 3 //This refers to the max of opened folders at once
	RunningConfig.data.notifications.push(notificationDetails)
	if( RunningConfig.data.notifications.length > maxNotifactionsOpened ){
		const { element } = RunningConfig.data.notifications[0]
		RunningConfig.data.notifications.splice(0,1)
		RunningConfig.emit('notificationRemoved',{ element });
		closeNotification(element)
	}
})

export default Notification