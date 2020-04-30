import { puffin } from '@mkenzo_8/puffin'
import Languages from '../../../languages/*.json'
import StaticConfig from 'StaticConfig'

let data = {}
Object.keys(Languages.english.translations).map(string => {
	data[string] =  getTranslation( StaticConfig.data.appLanguage,string)
})

const LanguageState = new puffin.state({
	translations:data
})

StaticConfig.keyChanged('appLanguage',newLanguage => {
	Object.keys(LanguageState.data.translations).map(key => {
		LanguageState.data.translations[key] = getTranslation( newLanguage,key)
	})
	LanguageState.triggerChange()
})

function getTranslation(language,string){
	if( Languages[language].translations[string] ) {
		return Languages[language].translations[string]
	}else if( Languages.english.translations[string] ){
		return Languages.english.translations[string]
	}else{
		return string
	}
}

console.log(LanguageState)
export {
	LanguageState
}