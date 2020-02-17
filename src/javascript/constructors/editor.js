import CodemirrorClient from '../defaults/cmclient'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import ExtensionsRegistry from 'ExtensionsRegistry'
import CursorPositionBottomBarItem from '../defaults/status.bar.items/cursor.position'

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
                instance:instance,
                element:bodyElement,
                fontSize:StaticConfig.data.fontSize
            })
        }
    })
    
    Client.do('refresh',instance)

    Client.do('onChanged',{
        instance:instance,
        action:()=>tabElement.props.state.data.saved = false
    })

    Client.do('onActive',{
        instance:instance,
        action:(instance)=>{
            focusEditor(Client,instance)

            tabElement.props.state.data.active = true
            RunningConfig.data.focusedPanel = panel

            if(CursorPositionBottomBarItem.isHidden()){
                CursorPositionBottomBarItem.show()
            }
            updateCursorPosition(Client,instance)
        }
    })

    StaticConfig.changed(function(data){
        Client.do('setTheme',{
            instance:instance,
            theme:ExtensionsRegistry.registry.data.list[data.theme].textTheme
        })

        Client.do('setFontSize',{
            instance:instance,
            element:bodyElement,
            fontSize:StaticConfig.data.fontSize
        })
    })
    if(CursorPositionBottomBarItem.isHidden()){
        CursorPositionBottomBarItem.show() //Display cursor position item in bottom bar
    }
    updateCursorPosition(Client,instance)
    RunningConfig.changed(function(data){
        if(data.focusedEditor == null){
            CursorPositionBottomBarItem.hide()
        }
    })
    tabElement.focusEditor = ()=>{
        focusEditor(Client,instance)
        updateCursorPosition(Client,instance)
        Client.do('doFocus',{instance})
    };

    return Client
}

function updateCursorPosition(Client,instance){
    const { line, ch } = Client.do('getCursorPosition',{instance:instance})
    CursorPositionBottomBarItem.setLabel(`Ln ${line}, Ch ${ch}`)
}

function focusEditor(Client,instance){
    RunningConfig.data.focusedEditor = {
        client:Client,
        instance:instance
    }
}
export default Editor