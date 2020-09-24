import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	&{
		border-radius:5px;
		min-width:300px;
		max-width:300px;
		min-height:80px;
		background:var(--notificationBackground);
		box-shadow:0px 1px 7px rgba(0,0,0,0.17);
		padding:8px;
		margin:5px 7px;
	}
	&  svg{
		height:18px;
		width:18px;
		padding:0px;
		margin:0px;
		position:absolute;
		right:15px;
	}
	& > h5{
		color:var(--notificationTitleText);
		overflow:hidden;
		text-overflow:ellipsis;
		max-width:225px;
		width:225px;
		white-space:nowrap;
		margin-bottom: 2px;
	}
	& > p{
		font-size:13px;
		color:var(--notificationContentText);
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
			color: var(--textColor)
		}
	}
`

function NotificationBody() {
	return element`<div class="${styleWrapper}"/>`
}

export default NotificationBody
