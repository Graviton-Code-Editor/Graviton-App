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
		const locale = globalAny.navigator.language.substr(0, globalAny.navigator.language.indexOf('-'))

		switch (locale) {
			case 'en':
				LanguageState.data.translations = Languages['english'].translations
				break
			case 'cat':
				LanguageState.data.translations = Languages['catalan'].translations
				break
			case 'la':
				LanguageState.data.translations = Languages['classical_latin'].translations
				break
			case 'pt':
				LanguageState.data.translations = Languages['brazilian_portuguese'].translations
				break
			case 'fr':
				LanguageState.data.translations = Languages['french'].translations
				break
			case 'de':
				LanguageState.data.translations = Languages['german'].translations
				break
			case 'it':
				LanguageState.data.translations = Languages['italian'].translations
				break
			case 'ru':
				LanguageState.data.translations = Languages['russian'].translations
				break
			case 'es':
				LanguageState.data.translations = Languages['spanish'].translations
				break
			case 'pl':
				LanguageState.data.translations = Languages['polish'].translations
				break
			case 'ar':
				LanguageState.data.translations = Languages['arabic'].translations
				break
			case 'tr':
				LanguageState.data.translations = Languages['turkish'].translations
				break
			case 'zh':
				LanguageState.data.translations = Languages['simplifiedChinese'].translations
				break
			case 'el':
				LanguageState.data.translations = Languages['greek'].translations
				break
			default:
				setFallback(locale)
		}
	} else if (Languages[newLanguage]) {
		LanguageState.data.translations = Languages[newLanguage].translations
	} else {
		//Fallback to english if the configured language is not found
		setFallback(newLanguage)
	}
})

export { LanguageState }
