import { puffin } from '@mkenzo_8/puffin'

const Loader = puffin.element(`
	<div class="${puffin.style.css`
		&{
			animation: spin 1s linear infinite;
			border:7px solid rgba(0,0,0,0);
			border-top:7px solid var(--loaderBackground);
			border-bottom:7px solid var(--loaderBackground);
			border-radius: 50%;
			width: 40px;
			height: 40px;
			box-sizing:border-box;
			margin:0;
			padding:0;
		}
	`}"/>
`)

export default Loader