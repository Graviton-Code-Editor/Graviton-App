import { puffin } from '@mkenzo_8/puffin'

const DialogBody = new puffin.element(`
    <div class="${puffin.style.css`
		&{
			width:100%;
			height:100%;
			box-sizing:border-box;
			overflow-x:hidden;
			overflow-y:auto;
			position:absolute;
			display:flex;
			flex-direction:column;
			padding:12px
		}
		& p {
			margin-top:15px;
		}
		& > div:nth-child(1){
			min-height:auto;	
			flex:1;
		}
		& > div:nth-child(2){
			min-height:auto;
			position:relative;
			bottom:0px;
			display:flex;
			justify-content:flex-end;
		}
		& button {
			max-height:auto;
			padding:8px 11px;
			font-size:13px;
		}
    `}"/>
`)

export default DialogBody