import Dialog from '../../constructors/dialog'
import packageJSON from '../../../../package.json'
import buildJSON from '../../../../assets/build.json'
import { element, style } from '@mkenzo_8/puffin'
import { Text } from '@mkenzo_8/puffin-drac'
import GravitonLargeLogo from '../../../../assets/large_logo.svg'

const styleWrapper = style`
	&{
		display: flex;
		flex-direction: column;
		margin: 0 auto;
	}
	&  img {
		margin: 0 auto;
	}
	& > div {
		margin: 0 auto;

	}

`

const aboutContent = () => element({
	components: {
		Text,
	},
})`
	<div class="${styleWrapper}">
		<img width="175px" draggable="false" src="${GravitonLargeLogo}"/> 
		<br/>
		<div>
			<span>
				Graviton v${packageJSON.version}
			</span> 
			<br/>
			<span lang-string="misc.BuildDate" string="{{misc.BuildDate}}: ${buildJSON.date}"/>
			<br/>
			<span lang-string="misc.Author" string="{{misc.Author}}: Marc Espín Sanz"/>
			<br/>
		</div>
	</div>
`

function About() {
	const DialogInstance = new Dialog({
		height: '240px',
		width: '275px',
		component: aboutContent,
		buttons: [
			{
				label: 'misc.Close',
				important: false,
			},
		],
	})
	return DialogInstance
}

export default About
