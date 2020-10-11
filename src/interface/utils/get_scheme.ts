import { element } from '@mkenzo_8/puffin'
import Switch from '../components/switch'
import { Titles, RadioGroup, Button, Text } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'

export default function getScheme(scheme) {
	return Object.keys(scheme).map(section => {
		const schemeComps = scheme[section]
		const comps = schemeComps
			.map(comp => {
				switch (comp.type) {
					case 'title':
						return element({
							components: {
								H4: Titles.h4,
							},
						})`<H4 lang-string="${comp.label}"/>`
					case 'switch':
						function onSwitch(e) {
							const newStatus = e.detail.status
							if (newStatus !== StaticConfig.data[comp.key]) {
								StaticConfig.data[comp.key] = newStatus
							}
						}

						return element({
							components: {
								Switch,
							},
						})`<Switch :toggled="${onSwitch}" data="${{ default: StaticConfig.data[comp.key], label: comp.label }}"/>`
					case 'radioGroup':
						function onSelected(e) {
							const selectedRadio = e.detail.target.getAttribute('key')
							if (selectedRadio !== StaticConfig.data[comp.key]) {
								StaticConfig.data[comp.key] = selectedRadio
							}
						}

						return element({
							components: {
								RadioGroup,
							},
						})`
						<RadioGroup direction="${comp.direction || 'horizontally'}" :radioSelected="${onSelected}" styled="${comp.styled != null ? comp.styled : true}">
							${comp.radios.map(radio => {
								const radioKey = radio.key ? radio.key : radio.label ? radio.label.toLowerCase() : radio.toLowerCase()
								return element`<label styled="${radio.styled != null ? comp.styled : true}" hidden-radio="${radio.hiddenRadio != null ? radio.hiddenRadio : false}" checked="${
									radio.checked || false
								}" key="${radioKey}">${radio.comp ? radio.comp({ info: radio.info }) : radio.label || radio}</label>`
							})}
						</RadioGroup>`
					case 'button':
						return element({
							components: {
								Button,
							},
						})`<Button :click="${comp.onClick}" lang-string="${comp.label}"/>`
					case 'text':
						return element({
							components: {
								Text,
							},
						})`<Text lang-string="${comp.label}"/>`
				}
			})
			.filter(Boolean)
		return element`<div href="${section}">${comps}</div>`
	})
}
