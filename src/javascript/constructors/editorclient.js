

function EditorClient({
    name="",
},object){
    return {
        do(name,args){
            if(object[name]!=null){
                object[name](null,args)
            }
        }
    }
}

export default EditorClient