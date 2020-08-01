interface WindowOptions {
	title?: string
	component: object
	minWidth?: string
	minHeight?: string
	height?: string
	width?: string
	id?: string
}

interface WindowInstance {
	launch: () => void
	close: () => void
	on: (string, any) => void
}

export { WindowOptions, WindowInstance }
