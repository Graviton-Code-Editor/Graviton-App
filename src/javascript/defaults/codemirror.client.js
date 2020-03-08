import CodeMirror from 'codemirror'
import { EditorClient } from '../constructors/editorclient'

require ('../../../node_modules/codemirror/mode/**/*.js')

import 'codemirror/addon/search/search'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/addon/hint/xml-hint'
import 'codemirror/addon/hint/html-hint'

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
            case 'scss':
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
            theme:theme,
          	indentWithTabs:true,
          	tabSize:2
        })
        CodemirrorEditor.on("keyup", function (cm, event) {
          if (!cm.state.completionActive && 
              event.keyCode != 13 &&
              event.keyCode != 8 && 
              event.keyCode != 9  && 
              event.keyCode != 222 && 
              event.keyCode != 38 && 
              event.keyCode != 40 && 
              event.keyCode != 39 && 
              event.keyCode != 37 && 
              event.keyCode != 17 && 
              event.keyCode != 18 && 
              event.keyCode != 188 &&
              event.keyCode != 27 && 
              event.keyCode != 46 && 
              event.keyCode > 31 && 
              ( event.keyCode < 48 ||  event.keyCode > 57) &&
              event.keyCode != 32 &&
              event.ctrlKey  == false &&
              event.keyCode  != 91
          ) {
						CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
          }
        });

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
        instance.refresh()
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
      	instance.refresh()
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