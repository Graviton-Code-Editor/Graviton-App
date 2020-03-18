let editorClients = []

function EditorClient({
	name="",
},object){
	return {
		do(name,args){
			if(object[name]!=null){
				return object[name](args)
			}
		}
	}
}

export  { EditorClient, editorClients}