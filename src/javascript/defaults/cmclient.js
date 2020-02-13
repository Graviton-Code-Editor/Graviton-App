import CodeMirror from 'codemirror'
import EditorClient from '../constructors/editorclient'

require ('../../../node_modules/codemirror/mode/**/*.js')

const CodemirrorClient = new EditorClient({
    name:'codemirror',
},{
    getValue: (cm) => cm.getValue(),
    getLangFromExt(extension){
        switch(extension){
            case 'html':
                return 'htmlmixed'
            case 'js':
                return 'javascript'
            case 'json':
                return 'application/json'
            case 'css':
                return 'css'
            default:
                return extension    
        }
    },
    create({element,language, value, theme}){
        const CodemirrorEditor = CodeMirror(element,{
            mode:language,
            value:value,
            lineNumbers:true,
            htmlMode:false,
            theme:theme
        })
        return {
            instance : CodemirrorEditor
        }
    },
    refresh(cm){
        setTimeout(function() {
            cm.refresh()
        },10);
    },
    onChanged({cm,action}){
        cm.on('change',()=>action())
    },
    onActive({cm,action}){
        cm.on('cursorActivity',()=>action(cm))
        cm.on('mousedown',()=>action(cm))
    },
    setTheme({cm,theme}){
        cm.setOption('theme',theme)
    }
})

export default CodemirrorClient