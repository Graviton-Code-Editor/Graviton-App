interface CodeMirrorOptions {
	element: HTMLElement
	value: string
	theme: string
	directory: string
	options?: {
		merge?: boolean
		mirror?: string
	}
	language: {
		fancy: string
		mode: string
		name: string
	}
	CtrlPlusScroll: (direction: string) => void
}

export default CodeMirrorOptions
