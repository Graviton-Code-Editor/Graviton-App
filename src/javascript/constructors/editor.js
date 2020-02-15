import CodemirrorClient from '../defaults/cmclient'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'

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
        theme:theme,
        fontSize:StaticConfig.data.fontSize,
        CtrlPlusScroll:(direction)=> {
            
            
            if(direction == 'up'){
                StaticConfig.data.fontSize = Number(StaticConfig.data.fontSize)+5
            }else{
                if( StaticConfig.data.fontSize <=5) return
                StaticConfig.data.fontSize = Number(StaticConfig.data.fontSize)-5
            }
            

            Client.do('setFontSize',{
                cm:instance,
                element:bodyElement,
                fontSize:StaticConfig.data.fontSize
            })
        }
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
            theme:ExtensionsRegistry.registry.data.list[data.theme].textTheme
        })

        Client.do('setFontSize',{
            cm:instance,
            element:bodyElement,
            fontSize:StaticConfig.data.fontSize
        })
    })

    return Client
}

export default Editor