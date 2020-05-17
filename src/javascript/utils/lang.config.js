import { lang, state } from '@mkenzo_8/puffin'
import Languages from '../../../languages/*.json'
import StaticConfig from 'StaticConfig'
import Notification from '../constructors/notification'
const isDarwin = window.require('process') === 'darwin'

if (isDarwin) {
	StaticConfig.keyChanged('appLanguage', () => {
		new Notification({
			title: 'notifications.appLanguageChanged.appLanguageChanged',
			content: 'notifications.appLanguageChanged.restartMessage',
		})
	})
}

let data = Languages[StaticConfig.data.appLanguage].translations

const LanguageState = new state({
	translations: data,
	fallbackTranslations: Languages.english.translations,
})

StaticConfig.keyChanged('appLanguage', newLanguage => {
	LanguageState.data.translations = Languages[newLanguage].translations
})

console.log(LanguageState)

export { LanguageState }
