import CodemirrorClient from '../defaults/cmclient'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ThemeRegistry from 'ThemeRegistry'

function Editor({
    bodyElement,
    tabElement,
    value,
    language,
    panel,
    theme
}){

    const Client = CodemirrorClient

    const { instance } = Client.do('create',{
        element:bodyElement,
        language:Client.do('getLangFromExt',language),
        value:value,
        theme:theme
    })
    
    Client.do('refresh',instance)

    Client.do('onChanged',{
        cm:instance,
        action:()=>tabElement.props.state.data.saved = false
    })

    Client.do('onActive',{
        cm:instance,action:(cm)=>{
            RunningConfig.data.focusedEditor = {
                client:Client,
                instance:cm
            }
            tabElement.props.state.data.active = true
            RunningConfig.data.focusedPanel = panel
        }
    })

    StaticConfig.changed(function(data){
        Client.do('setTheme',{
            cm:instance,
            theme:ThemeRegistry.registry.data.list[data.theme].textTheme
        })
    })

    return Client
}

export default Editor