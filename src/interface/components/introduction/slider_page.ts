import { element, render, lang } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'

const styleWrapper = style`
	&  {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		& > div { 
			flex: 1;
			margin: 0 auto; 
		}
		& * {
			user-select: none;
		}
	}
	& .title {
		text-align: center;
		margin-top: 25px;
		margin-bottom: 15px;
	}
	& table {
		margin: 12px auto;
		margin-top: 20px;
		user-select: none;
		padding: 12px;
		background: var(--sidemenuSectionBackground);
		border-radius: 6px;
		& tr {
			height: 35px;
			text-align: center;
		}
		& a {
			margin: 6px;
			padding: 6px 10px;
			font-size: 14px;
		}
	}
	@media only screen and (max-width: 500px) {
		& .theme_cards {
			display: flex;
			flex-direction: column;
		}
	}
	
`

export default function IntroductionPage() {
	return element`<div class="${styleWrapper}"/>`
}
