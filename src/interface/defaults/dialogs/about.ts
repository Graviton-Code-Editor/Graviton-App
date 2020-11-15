import Dialog from '../../constructors/dialog'
import packageJSON from '../../../../package.json'
import buildJSON from '../../../../assets/build.json'
import { element } from '@mkenzo_8/puffin'
import { css as style } from '@emotion/css'
import { Text } from '@mkenzo_8/puffin-drac'
import GravitonLargeLogo from '../../../../assets/large_logo.svg'
import Core from 'Core'
const { openExternal } = Core
import TopMenu from '../../components/window/top_menu'
import { Button } from '@mkenzo_8/puffin-drac'

const styleWrapper = style`
	&{
		display: flex;
		flex-direction: column;
		margin: 0 auto;
	}
	&  img {
		margin: 0 auto;
	}
	&  div[href="about"]{
		height: 100%;
	}
	& .about{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
	}
	& > div:nth-child(2) > div {
		overflow: auto;
		max-height: 180px;
		padding: 3px;
		display: flex;
		justify-content: center;
		align-items: center;
		& > button {
			display: block ;
			width: 100%;
			margin: 3px 0px;
		}
	}
`

const aboutContent = () => element({
	components: {
		Text,
		TopMenu,
	},
})`
	<TopMenu class="${styleWrapper}" default="about">
		<div>
			<label to="about">About</label>
			<label to="credits">Credits</label>
		</div>
		<div>
			<div href="about">
				<div class="about">
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
			</div>
			<div href="credits">
				${packageJSON.contributors.map(({ name, url }) => {
					return element({
						components: {
							Button,
						},
					})`<Button :click="${() => openExternal(url)}">${name}</Button>`
				})}
			</div>
		</div>
	</TopMenu>
`

function About() {
	const DialogInstance = new Dialog({
		height: '315px',
		width: '275px',
		component: aboutContent,
		buttons: [
			{
				label: 'menus.Help.Website',
				action() {
					openExternal('https://graviton.netlify.app/')
				},
			},
			{
				label: 'misc.Close',
			},
		],
	})
	return DialogInstance
}

export default About
