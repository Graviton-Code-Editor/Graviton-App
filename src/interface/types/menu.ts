export interface MenuHooks {
	setChecked: (checked: boolean) => void
}

export interface MenuOptions {
	button: string
	list?: MenuOption[]
}

export interface MenuOption {
	label?: string
	action?: (MenuHooks) => void
	checked?: boolean
	mounted?: (MenuHooks) => void
	type?: string
	list?: this[]
}
