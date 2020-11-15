import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&{
		min-height:100%;
		min-width:100%;
		display:flex;
		justify-content: center;
		top:0;
		left:0; 
		position:fixed;
		user-select:none;
	}
	& input{
		background:var(--commandPromptInputBackground);
		color:var(--sidemenuSearcherText);
		border: none;
		padding:8px;
		margin:0 auto;
		border-radius:5px;
		min-width: 100%;
		max-width:100%;
		display:block;
		white-space:prewrap;
		font-size:12px;
		box-shadow: 0px 2px 5px rgba(0,0,0,0.15);
	}
	& .container{
		flex:1;
		position:absolute;
		overflow: hidden;
		top:100px;
		max-height:80%;
		min-width:175px;
		max-width:175px;
		margin:0 auto;
		justify-content:center;
		align-items:center;
		display:flex;
		flex-direction:column;
		background:var(--commandPromptBackground);
		padding:7px;
		border-radius:6px;
	}
	& .container > div{
		display:flex;
		flex-direction:column;
		min-width:100%;
		background:inherit;
		margin-top:5px;
		max-width:100%;
		overflow: auto;
	}
	& .container > div > div{
		min-width:auto;
		flex:1;
		background:transparent;
		max-width:100%;
	}
	& a{
		overflow:hidden;
		text-overflow:ellipsis;
		font-size:12px;
		white-space:nowrap;
		display: flex;
		align-items: center;
		padding:7px 8px;
		background:var(--commandPromptOptionBackground);
		color:var(--commandPromptOptionText);
		border-radius:5px;
		margin:1px 0px;
		& > img {
			height: 20px;
			margin-right: 5px;
		}
		&.active, &:hover{
			cursor: pointer;
			background:var(--commandPromptOptionActiveBackground);
			color:var(--commandPromptOptionActiveText);
		}
	}
`

function CommandPromptBody() {
	return element`<div class="${styleWrapper}"/>`
}

export default CommandPromptBody
