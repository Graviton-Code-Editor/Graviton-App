import CodeMirror from 'codemirror'
import { EditorClient } from '../constructors/editorclient'

require ('../../../node_modules/codemirror/mode/**/*.js')

import 'codemirror/addon/search/search'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'

const CodemirrorClient = new EditorClient({
    name:'codemirror',
},{
    getValue: (instance) => instance.getValue(),
    getLangFromExt(extension){
        switch(extension){
            /*
            Every case refers to a programming language's file format, 
            (example: JavaScript -> js). 
            If it's not supported it will go into the default case, 
            bellow yo can see the list of supported by this CodeMirror Client.
            */
            case 'html':
                return { name: 'htmlmixed' }
            case 'js':
                return { name: 'javascript' }
            case 'json':
                return { name: 'application/json' }
            case 'css':
                return { name: 'css' }
            case 'd':
                return { name: 'text/x-d' }
            case 'sass':
                return { name: 'text/x-sass' }
            case 'php':
                return { name: 'application/x-httpd-php' }
            case 'md':
                return { name: 'text/x-markdown' }
            default:
                return { 
                    name: extension,
                    unknown:true
                 }   
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