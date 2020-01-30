import CodeMirror from 'codemirror'
import EditorClient from '../constructors/editorclient'

const CodemirrorClient = new EditorClient({
    name:'codemirror',
},{
    getValue: (cm) => cm.getValue(),
    create: (cm,{element, language,value ="",theme}) => {
        const CodemirrorEditor = CodeMirror(element,{
            mode:language,
            value:value,
            lineNumber:true,
            htmlMode:false,
            theme:theme
        })
        return CodemirrorEditor
    }
})

export default CodemirrorClient