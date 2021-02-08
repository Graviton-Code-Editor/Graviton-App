import { state } from '@mkenzo_8/puffin'
import Languages from '../collections/languages'
import StaticConfig from 'StaticConfig'
import throwError from '../utils/throw_error'
import { PuffinState } from 'Types/puffin.state'
const globalAny: any = global

let initialTranslations = {}

if (Languages[StaticConfig.data.appLanguage]) {
	const data = Languages[StaticConfig.data.appLanguage].translations
	initialTranslations = data
} else {
	initialTranslations = Languages.english.translations
	const err = `Couldnt find language by name ${StaticConfig.data.appLanguage}`
	throwError(err, err)
}

const LanguageState: PuffinState = new state({
	translations: initialTranslations,
	fallbackTranslations: Languages.english.translations,
})

function setFallback(notFoundLang: string): void {
	StaticConfig.data.appLanguage = 'english'
	LanguageState.data.translations = Languages[StaticConfig.data.appLanguage].translations
	const err = `Couldnt find language by name ${notFoundLang}`
	throwError(err, err)
}

StaticConfig.keyChanged('appLanguage', (newLanguage: string) => {
	if (Languages[newLanguage].name === 'Default') {
		// Get the language part from the locale (e.g. en-GB -> en)
		const newLocale = globalAny.navigator.language.substr(0, globalAny.navigator.language.indexOf('-'))
		// Used to detect if the language was found
		let found = false

		Object.keys(Languages).some(i => {
			if (Languages[i].locale === newLocale) {
				LanguageState.data.translations = Languages[i].translations
				found = true
			}
		})

		if (!found) {
			setFallback(newLocale)
		}
	} else if (Languages[newLanguage]) {
		LanguageState.data.translations = Languages[newLanguage].translations
	} else {
		//Fallback to english if the configured language is not found
		setFallback(newLanguage)
	}
})

export { LanguageState }
