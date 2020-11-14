let editorClients = []

/*
 * The EditorClient provides an easy way to communicate
 * from Graviton API to third-party libraries with an unified syntax
 */

class EditorClient {
	public name: string
	public type: string
	public do: (actionName: string, actionArgs: any) => any
	constructor({ name = 'unknown', type }, object) {
		this.name = name
		this.type = type
		this.do = (name, args) => {
			if (object[name]) {
				return object[name](args)
			}
		}
	}
}

export { EditorClient, editorClients }
