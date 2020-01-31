import CodeMirror from 'codemirror'
import EditorClient from '../constructors/editorclient'

require ('../../../node_modules/codemirror/mode/**/*.js')

const CodemirrorClient = new EditorClient({
    name:'codemirror',
},{
    getValue: (cm) => cm.getValue(),
    getLangFromExt(extension){
        switch(extension){
            case 'js':
                return 'javascript'
            case 'css':
                return 'css'
            default:
                return extension    
        }
    },
    create: ({element,language, value, theme}) => {
        const CodemirrorEditor = CodeMirror(element,{
            mode:language,
            value:value,
            lineNumbers:true,
            htmlMode:false,
            theme:theme
        })
        return CodemirrorEditor
    }
})

export default CodemirrorClient