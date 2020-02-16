import { puffin } from '@mkenzo_8/puffin'
import Languages from '../../../languages/*.json'
import StaticConfig from 'StaticConfig'

const LanguageConfig = new puffin.state(Languages[StaticConfig.data.language].strings)

StaticConfig.changed(function(){
    Object.keys(LanguageConfig.data).map(function(key){
        LanguageConfig.data[key] = Languages[StaticConfig.data.language].strings[key]
    })
    LanguageConfig.triggerChange()
})

export default LanguageConfig