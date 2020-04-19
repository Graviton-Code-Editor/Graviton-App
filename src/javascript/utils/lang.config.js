import { puffin } from '@mkenzo_8/puffin'
import Languages from '../../../languages/*.json'
import StaticConfig from 'StaticConfig'

let data = {}
Object.keys(Languages.english.strings).map(string => {
	data[string] =  getTranslation( StaticConfig.data.appLanguage,string)
})
const LanguageState = new puffin.state(
	Object.assign({}, data)
)

StaticConfig.keyChanged('appLanguage',newLanguage => {
	Object.keys(LanguageState.data).map(key => {
		LanguageState.data[key] = getTranslation( newLanguage,key)
	})
	LanguageState.triggerChange()
})

function getTranslation(language,string){
	if( Languages[language].strings[string] ) {
		return Languages[language].strings[string]
	}else if( Languages.english.strings[string] ){
		return Languages.english.strings[string]
	}else{
		return string
	}
}

console.log(LanguageState)
export {
	LanguageState
}