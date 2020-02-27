import { puffin } from '@mkenzo_8/puffin'
import ThemeProvider from 'ThemeProvider'

const NotificationBody = puffin.style.div`
    ${ThemeProvider}
    &{
        border-radius:5px;
        min-width:300px;
        min-height:80px;
        background:{{notificationBackground}};
        box-shadow:0px 2px 15px rgba(0,0,0,0.2);
        padding:8px;
        margin:3px 0px;
    }
    &  svg{
        height:20px;
        width:20px;
        padding:0px;
        margin:0px;
        position:absolute;
        right:10px;
        
    }
    & > h3{
        color:{{notificationTitleText}};
    }
    & > p{
        font-size:13px;
        color:{{notificationContentText}};
    }
`

export default NotificationBody