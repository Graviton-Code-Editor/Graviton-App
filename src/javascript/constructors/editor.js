import CodemirrorClient from '../defaults/cmclient'

function Editor({
    element,
    value,
    language,
    theme
}){
    const Client = CodemirrorClient

    const { instance } = Client.do('create',{
        element:element,
        language:Client.do('getLangFromExt',language),
        value:value,
        theme:theme
    })
    
    Client.do('refresh',instance)

    return Client
}

export default Editor