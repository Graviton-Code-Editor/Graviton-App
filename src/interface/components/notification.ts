import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	transition: 0.1s;
	animation: notificationOpens ease-out 0.12s;
	border-radius:5px;
	min-width:300px;
	max-width:300px;
	min-height:80px;
	background:var(--notificationBackground);
	box-shadow:0px 1px 7px rgba(0,0,0,0.17);
	padding:8px;
	margin:5px 7px;
	&.closing {
		animation: notificationCloses ease-out 0.135s;
	}
	& div:nth-child(1){
		display: flex;
		width: 100%;
		position: relative;
		justify-content: flex-end;
		height: 0;
		& > svg{
			height:18px;
			width:18px;
			padding:0px;
			margin:0px;
			position:absolute;
			right: 5px;
			top: 2px;
			position: relative;
		}
	}
	& h5{
		color:var(--notificationTitleText);
		overflow:hidden;
		text-overflow:ellipsis;
		max-width:145px;
		width:145px;
		white-space:nowrap;
		margin-bottom: 2px;
		user-select: none;
	}
	& > p{
		font-size:13px;
		color:var(--notificationContentText);
		text-overflow: ellipsis;
		overflow: hidden;
	}
	& button {
		font-size:12px;
		padding:8px 10px;
		background:var(--notificationButtonBackground);
	}
	& div:nth-child(2){
		display: flex;
		& > span {
			font-size: 11px;
			margin: auto 5px;
			padding-bottom:2px;
			color: var(--textColor);
			max-width: 100px;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space:nowrap;
		}
	}
`

function NotificationBody() {
	return element`<div class="${styleWrapper}"/>`
}

export default NotificationBody
