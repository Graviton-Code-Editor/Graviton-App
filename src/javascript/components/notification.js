import { puffin } from '@mkenzo_8/puffin'

const NotificationBody = puffin.style.div`
	&{
		border-radius:5px;
		min-width:300px;
		min-height:80px;
		background:var(--notificationBackground);
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
		color:var(--notificationTitleText);
	}
	& > p{
		font-size:13px;
		color:var(--notificationContentText);
	}
	& button {
		font-size:13px;
		padding:8px 10px;
		background:var(--notificationButtonBackground);
	}
`

export default NotificationBody