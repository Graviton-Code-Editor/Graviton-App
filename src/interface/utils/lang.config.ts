import { state } from '@mkenzo_8/puffin'
import Languages from '../collections/languages'
import StaticConfig from 'StaticConfig'
import throwError from './throw_error'
import { PuffinState } from 'Types/puffin.state'

let initialTranslations = {}

if (Languages[StaticConfig.data.appLanguage]) {
	const data = Languages[StaticConfig.data.appLanguage].translations
	initialTranslations = data
} else {
	initialTranslations = Languages.english.translations
	throwError(`Couldnt find language by name ${StaticConfig.data.appLanguage}`, StaticConfig.data.appLanguage)
}

const LanguageState: PuffinState = new state({
	translations: initialTranslations,
	fallbackTranslations: Languages.english.translations,
})

function setFallback(notFoundLang: string): void {
	StaticConfig.data.appLanguage = 'english'
	LanguageState.data.translations = Languages[StaticConfig.data.appLanguage].translations
	throwError(`Couldnt find language by name ${notFoundLang}`, StaticConfig.data.appLanguage)
}

StaticConfig.keyChanged('appLanguage', (newLanguage: string) => {
	if (Languages[newLanguage]) {
		LanguageState.data.translations = Languages[newLanguage].translations
	} else {
		//Fallback to english if the configured language is not found
		setFallback(newLanguage)
	}
})

export { LanguageState }
