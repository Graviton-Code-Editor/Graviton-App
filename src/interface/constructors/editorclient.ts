let editorClients = []

class EditorClient {
	public name: string
	public type: string
	public do: any
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
