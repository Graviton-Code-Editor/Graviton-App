import { puffin } from '@mkenzo_8/puffin'
import NotificationBody from '../components/notification'
import { Titles, Text } from '@mkenzo_8/puffin-drac'
import Cross from '../components/icons/cross'
import RunningConfig from '../utils/running.config'

function Notification({
    title = 'Title',
    content = ''
}){

    const NotificationComp = puffin.element(`
        <NotificationBody>
            <div><Cross click="$closeNotification"/></div>
            <Title>${title}</Title>
            <Content>${content}</Content>
        </NotificationBody>
    `,{
        components:{
            NotificationBody,
            Title:Titles.h3,
            Content:Text,
            Cross
        },
        methods:{
            closeNotification(){
                closeNotification(NotificationComp.node)
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