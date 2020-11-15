import { state, element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const ItemWrapper = style`
	&{
		background:transparent;
		white-space:nowrap;
		padding:0px;
		user-select:none;
		margin-left: 10px;
		content-visibility: paint;
		contain-intrinsic-size: 26px;
		&[animated="true"]{
			animation: appearItem 0.07s ease-out;
		}
	}
	& button{
		transition:0.015s;
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
		&:hover, &:focus{
			background:var(--explorerItemHoveringBackground);
			border-radius:5px;
		}
		&[ishidden="true"]{
			opacity: 0.6;
		}
	}
	&[selected=true] > button{
		transition:0.07s;
		background:var(--explorerItemSelectedBackground);
		border-radius:5px;
	}
	& > button > *{
		align-items: center;
		display:flex;
		color:var(--explorerItemText);
	}
	& .decorator {
		position:relative;
		border-radius:50px;
		margin: auto 2px;
		margin-left:6px;
		font-size:9px;
		min-width:10px;
		padding:1px 3px;
	}
	& .gitStatus {
		display:none;
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
  &[gitStatus="created"] > button > span {
		color:var(--explorerItemGitCreatedText);
	}
  &[gitStatus="renamed"] > button > span {
		color:var(--explorerItemGitRenamedText);
	}
	&[gitStatus="modified"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitModifiedIndicator);
	}
	&[gitStatus="not_added"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitNotAddedIndicator);
	}
  &[gitStatus="created"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitCreatedIndicator);
	}
  &[gitStatus="renamed"][isFolder="true"] > button > .gitStatus {
		display:block;
		background:var(--explorerItemGitRenamedIndicator);
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
		transition:0.07s;
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
