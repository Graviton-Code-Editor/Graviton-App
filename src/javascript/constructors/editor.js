import CodemirrorClient from '../defaults/cmclient'
import RunningConfig from 'RunningConfig'

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

    Client.do('onChanged',{cm:instance,action:()=>tabElement.props.state.data.saved = false})

    Client.do('onActive',{cm:instance,action:(cm)=>{
        RunningConfig.data.focusedEditor = {
            client:Client,
            instance:cm
        }
        tabElement.props.state.data.active = true
        RunningConfig.data.focusedPanel = panel
    }})

    return Client
}

export default Editor