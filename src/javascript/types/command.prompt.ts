interface CommandPromptOptions {
	name?: String | number
	showInput?: boolean
	inputPlaceHolder?: String
	inputDefaultText?: String
	options: any[]
	scrollOnTab?: boolean
	closeOnKeyUp?: boolean
	onCompleted?: (x) => void
	onSelected?: (x) => void
	onScrolled?: (x) => void
	defaultOption: number
}

export { CommandPromptOptions }
