import { element } from '@mkenzo_8/puffin'
import { Card } from '@mkenzo_8/puffin-drac'
import RunningConfig from 'RunningConfig'
import CardsListContainer from '../../../components/dashboard/cards.list'

import { PuffinComponent } from 'Types/puffin.component'

export default function ProjectsPage({ closeWindow }): PuffinComponent {
	return element({
		components: {
			CardsListContainer,
		},
	})`
		<CardsListContainer href="create_project">
			<div>
				${RunningConfig.data.projectServices.map(({ name, description, onExecuted }) => {
					return element({
						components: {
							Card,
						},
					})`
						<Card :click="${onExecuted}" :click="${createProject}">
							<b>${name}</b>
							<p>${description}</p>
						</Card>
					`
				})}
			</div>
		</CardsListContainer>
    `
	function createProject() {
		closeWindow()
	}
}
