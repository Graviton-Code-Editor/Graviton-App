let editorClients = []

function EditorClient({ name = 'unknown', type }, object) {
	return {
		name,
		do(name, args) {
			if (object[name]) {
				return object[name](args)
			}
		},
		type,
	}
}

export { EditorClient, editorClients }
