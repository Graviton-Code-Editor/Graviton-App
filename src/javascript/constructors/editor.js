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
        language:language,
        value:value,
        theme:theme
    })
    return Instance
}

export default Editor