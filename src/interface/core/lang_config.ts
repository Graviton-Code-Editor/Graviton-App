import { state } from '@mkenzo_8/puffin'
import Languages from '../collections/languages'
import StaticConfig from 'StaticConfig'
import throwError from '../utils/throw_error'
import { PuffinState } from 'Types/puffin.state'

let initialTranslations = {}
let applyingSystemLanguage = false

function setSystemLanguage() {
	if (StaticConfig.data.appUseSystemLanguage) {
		// Get the language part from the locale (e.g. en-GB -> en)
		const systemLocale = navigator.language.substr(0, navigator.language.indexOf('-'))

		Object.keys(Languages).forEach(languageName => {
			const { locale } = Languages[languageName]
			if (locale === systemLocale) {
				applyingSystemLanguage = true
				StaticConfig.data.appLanguage = languageName
			}
		})
	}
	applyingSystemLanguage = false
}

setSystemLanguage()

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
	if (StaticConfig.data.appUseSystemLanguage && !applyingSystemLanguage) StaticConfig.data.appUseSystemLanguage = false
	if (Languages[newLanguage]) {
		LanguageState.data.translations = Languages[newLanguage].translations
	} else {
		//Fallback to english if the configured language is not found
		setFallback(newLanguage)
	}
})

StaticConfig.keyChanged('appUseSystemLanguage', (value: boolean) => {
	if (value) setSystemLanguage()
})

export { LanguageState }
