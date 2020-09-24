export interface EditorClient {
	name: string
	type: string
	do: (actionName: string, actionArgs: any) => any
}
