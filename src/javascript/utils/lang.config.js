import { lang, state } from '@mkenzo_8/puffin'
import Languages from '../../../languages/*.json'
import StaticConfig from 'StaticConfig'
import Notification from '../constructors/notification'
import throwError from './throw.error'

let initialTranslations = {}

if (Languages[StaticConfig.data.appLanguage]) {
	const data = Languages[StaticConfig.data.appLanguage].translations
	initialTranslations = data
} else {
	initialTranslations = Languages.english.translations
	throwError(`Couldnt find language by name ${StaticConfig.data.appLanguage}`, StaticConfig.data.appLanguage)
}

const LanguageState = new state({
	translations: initialTranslations,
	fallbackTranslations: Languages.english.translations,
})

const setFallback = notFoundLang => {
	StaticConfig.data.appLanguage = 'english'
	LanguageState.data.translations = Languages[StaticConfig.data.appLanguage].translations
	throwError(`Couldnt find language by name ${notFoundLang}`, StaticConfig.data.appLanguage)
}

StaticConfig.keyChanged('appLanguage', newLanguage => {
	if (Languages[newLanguage]) {
		LanguageState.data.translations = Languages[newLanguage].translations
	} else {
		//Fallback to english if the configured language is not found
		setFallback(newLanguage)
	}
})

export { LanguageState }
