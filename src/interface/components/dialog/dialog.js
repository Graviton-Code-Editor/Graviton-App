import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: auto;
		position: absolute;
		display: flex;
		flex-direction: column;
		padding: 12px;
		user-select: none;
	}
	& h2:empty{
		display: none;
	}
	& > div:nth-child(1){
		min-height: auto;
		flex: 1;
		& > p {
			margin-top:15px;
			font-size: 13px;
			&[isComponent="true"]{
				margin:0;
				padding:0;
			}
		}
	}
	& > div:nth-child(2){
		min-height: auto;
		position: relative;
		bottom: 0px;
		display: flex;
		justify-content: flex-end;
	}
	& button {
		max-height: auto;
		padding: 9px 12px;
		font-size: 12px;
		cursor: pointer;
	}
	& button[important="true"] {
		background: var(--buttonImportantBackground);
		color: var(--buttonImportantText);
		box-shadow:none;
	}
`

function DialogBody() {
	return element`
		<div class="${styleWrapper}"/>
	`
}

export default DialogBody
