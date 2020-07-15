interface WindowOptions {
	title?: string,
	component: object,
	height: string,
	width: string,
	id?: string
}

interface WindowInstance {
	launch: () => void,
	close:  () => void
}

export  {
	WindowOptions,
	WindowInstance
}