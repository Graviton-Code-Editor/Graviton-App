let editorClients = []

function EditorClient({ name = 'unknown' }, object) {
	return {
		name,
		do(name, args) {
			if (object[name]) {
				return object[name](args)
			}
		},
	}
}

export { EditorClient, editorClients }
