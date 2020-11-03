import { element } from '@mkenzo_8/puffin'
import { css as style } from 'emotion'

const styleWrapper = style`
	& {
		position: absolute;
		background: var(--windowBackground);
		width: auto;
		height: auto;
		top:75px;
		left: 75px;
		user-select: none;
		border-radius: 5px;
		padding:5px;
		box-shadow: 0px 2px 8px rgba(0,0,0,0.2);
	}
	& h5 {
		margin: 0;
		padding: 0;
		text-align: center;
		width: 100%;
	}
	& .buttons {
		display: flex;
	}
	& .buttons > div{
		padding: 3px 15px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius:5px;
		transition: .2s;
		background:transparent;
	}
	& .buttons > div:hover {
		background: var(--sidemenuBackground);
		transition: .2s;
	}
	& .buttons > div > svg{
		height:35%;
		margin: 5px 2px;
	}
	& .buttons  > div > p{
		font-size:10px;
		margin: 0;
		padding: 0;
	}
	& > div {
		display: flex;
	}
	& .dragger {
		background: var(--sidemenuBackground);
		border-radius:5px;
		padding: 6px 3px;
		cursor: move;
		margin-bottom:4px;
	}
	& .status{
		font-size:10px;
	}
	& .status span[status="Stopped"]{
		color: red;
	}
	& .status span[status="Started"]{
		color: #1DFA19;
	}
`

export default function EnvClient() {
	return element`<div class="${styleWrapper}"/>`
}
