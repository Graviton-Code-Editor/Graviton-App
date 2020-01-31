import CodemirrorClient from '../defaults/cmclient'

function Editor({
    element,
    value,
    language,
    theme
}){
    const Instance = CodemirrorClient
    Instance.do('create',{
        element:element,
        language:Instance.do('getLangFromExt',language),
        value:value,
        theme:theme
    })
    return Instance
}

export default Editor