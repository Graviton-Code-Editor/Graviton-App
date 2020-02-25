import CodeMirror from 'codemirror'
import { EditorClient } from '../constructors/editorclient'

require ('../../../node_modules/codemirror/mode/**/*.js')

import '../../../node_modules/codemirror/addon/search/search.js'
import '../../../node_modules/codemirror/addon/selection/active-line.js'
import '../../../node_modules/codemirror/addon/edit/matchbrackets'
import '../../../node_modules/codemirror/addon/edit/matchtags'
import '../../../node_modules/codemirror/addon/edit/closetag'
import '../../../node_modules/codemirror/addon/edit/closebrackets'

const CodemirrorClient = new EditorClient({
    name:'codemirror',
},{
    getValue: (instance) => instance.getValue(),
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
    create({element,language, value, theme, fontSize, CtrlPlusScroll}){
        const CodemirrorEditor = CodeMirror(element,{
            mode:language,
            value:value,
            lineNumbers:true,
            htmlMode:false,
            styleActiveLine: { nonEmpty: true },
            styleActiveSelected: true,
            matchTags: { bothTags: true },
            autoCloseTags: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            theme:theme
        })

        element.getElementsByClassName("Codemirror")[0].style.fontSize = fontSize;

        CodemirrorEditor.addKeyMap({
            'Ctrl-Up': function (instance) {
                CtrlPlusScroll('up')
            },
            'Ctrl-Down': function (instance) {
                CtrlPlusScroll('down')
            }
        })
        
        element.addEventListener('wheel',(e)=>{
            if(!e.ctrlKey) return
            if(e.wheelDeltaY.toString()[0]=='-'){
                CtrlPlusScroll('down')
            }else{
                CtrlPlusScroll('up')
            }
        })

        CodemirrorEditor.refresh()
        return {
            instance : CodemirrorEditor
        }
    },
    refresh(instance){
        setTimeout(function() {
            instance.refresh()
        },10);
    },
    onChanged({instance,action}){
        instance.on('change',()=>action())
    },
    onActive({instance,action}){
        instance.on('cursorActivity',()=>action(instance))
        instance.on('mousedown',()=>action(instance))
    },
    setTheme({instance,theme}){
        instance.setOption('theme',theme)
    },
    setFontSize({instance, element, fontSize}){
        element.getElementsByClassName("Codemirror")[0].style.fontSize = fontSize;
        instance.refresh()
    },
    getCursorPosition({instance}){
        const { line, ch } = instance.getCursor()
        return {
            line:line+1,
            ch:ch+1
        }
    },
    doFocus({instance}){
        instance.focus()
    }
})

export default CodemirrorClient