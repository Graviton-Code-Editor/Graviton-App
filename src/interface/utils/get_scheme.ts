import { element, render, lang } from '@mkenzo_8/puffin'
import { LanguageState } from 'LanguageConfig'
import Switch from '../components/switch'
import { Titles, RadioGroup, Button, Text } from '@mkenzo_8/puffin-drac'
import StaticConfig from 'StaticConfig'
import Section from '../components/window/section'
import Slider from '../components/slider'

const getComp = (scheme: any) => {
	let result: any = {
		comps: {},
		type: 'component',
	}

	if (Array.isArray(scheme)) {
		result.comps = scheme
	} else {
		result = scheme
	}

	return result
}

function getItemHooks() {
	return {
		getComponentFromScheme,
	}
}

export default function getScheme(scheme) {
	return Object.keys(scheme).map(section => {
		const { type, comps: schemeComps, disabled } = getComp(scheme[section])
		if (disabled) return
		const comps = schemeComps
			.map(scheme => {
				const comp = getComp(scheme)
				return getComponentFromScheme(comp)
			})
			.filter(Boolean)
		return element`<div class="section" href="${section}">${comps}</div>`
	})
}

const getComponentFromScheme = comp => {
	if (comp.disabled) return false
	switch (comp.type) {
		case 'title':
			return element({
				components: {
					H4: Titles.h4,
				},
				addons: [lang(LanguageState)],
			})`<H4 class="section" lang-string="${comp.label}"/>`
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
				addons: [lang(LanguageState)],
			})`<Switch :toggled="${onSwitch}" data="${{ default: StaticConfig.data[comp.key], label: comp.label }}"/>`
		case 'radioGroup':
			function onSelected(e) {
				const selectedRadio = e.detail.key
				if (selectedRadio !== StaticConfig.data[comp.key]) {
					StaticConfig.data[comp.key] = selectedRadio
				}
			}

			const RadiosComp = element({
				components: {
					RadioGroup,
				},
				addons: [lang(LanguageState)],
			})`
				<RadioGroup translated="${comp.translated === false ? false : true}" direction="${comp.direction || 'vertically'}" :radioSelected="${onSelected}" styled="${
				comp.styled != null ? comp.styled : true
			}" options="${comp.radios}"/>`

			if (comp.direction === 'horizontally') {
				return element`<div style="overflow: auto; padding: 4px 0px;">${RadiosComp}</div>`
			} else {
				return RadiosComp
			}

		case 'button':
			function onClick(e) {
				comp.onClick.bind(this)(e, getItemHooks())
			}

			return element({
				components: {
					Button,
				},
				addons: [lang(LanguageState)],
			})`<Button :click="${onClick}" lang-string="${comp.label}"/>`
		case 'section':
			const sectionContent = comp.content
				.map(el => {
					return getComponentFromScheme(el)
				})
				.filter(Boolean)

			return element({
				components: {
					Section,
				},
				addons: [lang(LanguageState)],
			})`<Section>${sectionContent}</Section>`
		case 'text':
			return element({
				components: {
					Text,
				},
				addons: [lang(LanguageState)],
			})`<Text class="section" lang-string="${comp.label}"/>`
		case 'slider':
			function onChanged(e) {
				const value = e.detail.value
				if (value !== StaticConfig.data[comp.key]) {
					StaticConfig.data[comp.key] = value
				}
			}

			return element({
				components: {
					Slider,
				},
				addons: [lang(LanguageState)],
			})`<Slider :change="${onChanged}" min="${comp.min}" max="${comp.max}" step="${comp.step}" value="${comp.default}" class="section" data="${{ label: comp.label }}"/>`
	}
}
