import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const listWrapper = style`
	&{
		display:flex;
		flex-direction:columns;
		flex:1;
		max-height:100%;
		overflow:hidden;
		user-select:none;
		& > div{
			overflow:auto;
			padding-right:20px;
			min-height:80%;
			max-height:80%;
			display:block;
		}
		& > div > div{
			min-width:100%;
			max-width:auto;
			white-space:nowrap;
			overflow:hidden;
			padding:10px 25px;
			display:block;
		}
		& > div > div *{
			overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap;
			left:0;
			margin:10px 2px;
			display:block;
			font-size:14px;
		}
		& > div:nth-child(2){
			padding-top:15px;
		}
	}
`

function CardsListContainer() {
	return element`<div class="${listWrapper}"/>`
}

export default CardsListContainer
