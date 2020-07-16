import { state, element, style } from '@mkenzo_8/puffin'

const ItemWrapper = style`
	&[animated="true"]{
		animation: appearItem 0.1s ease-out;
	}
	&{
		background:transparent;
		white-space:nowrap;
		padding:0px;
		user-select:none;
		margin-top:1px;
		margin-left: 10px;
	}
	&[animated="true"] > button:active{
		transition: 0.1s;
		transform: scale(0.97);
	}
	&[animated="true"] button{
		transition:0.07s;
	}
	& > button{
		margin:0;
		border-radius:12px;
		font-size:12px;
		padding:3px 5px;
		padding-right:9px;
		border:none;
		margin:0px;
		background:transparent;
		outline:0;
		white-space:nowrap;
		display:flex;
		align-items: center;
		justify-content: center;
		color:var(--explorerItemText);
	}
	& button:hover{
		background:var(--explorerItemHoveringBackground);
		border-radius:5px;
	}
	& [selected=true] button{
		transition:0.07s;
		background:var(--explorerItemSelectedBackground);
		border-radius:5px;
	}
	& > button > *{
		align-items: center;
		display:flex;
		color:var(--explorerItemText);
	}
	& .gitStatus {
		display:none;
		position:relative;
		border-radius:50px;
		margin: auto 2px;
		margin-left:6px;
		font-size:9px;
		min-width:10px;
		padding:1px 3px;
	}
	& .gitStatus[count=""]{
		min-width:0px;
		padding:3px;
	}
	&[gitStatus="modified"] > button > span {
		color:var(--explorerItemGitModifiedText);
	}
	&[gitStatus="not_added"] > button > span {
		color:var(--explorerItemGitNotAddedText);
	}
	&[gitStatus="modified"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitModifiedIndicator);
	}
	&[gitStatus="not_added"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitNotAddedIndicator);
	}
	&[isFolder="true"] > button > .gitStatus::after{	
		content: attr(count) ;
		color:var(--explorerItemGitIndicatorText);
	}
	& .icon{
		height:20px;
		width:20px;
		margin-right:4px;
		position:relative;
	}
	&[animated="true"] .arrow{
		transition:0.1s;
	}
	& .arrow{
		height:8px;
		width:8px;
		position:relative;
		padding:0px;
		margin-right:3px;
		border-radius:1px;
	}
	&[opened="true"] .arrow{
		transform:rotate(90deg);
	}
	&[opened="false"] .arrow{
		transform:rotate(0deg);
	}
`

const FileItem = () => element`<div class="${ItemWrapper}"`

export default FileItem
