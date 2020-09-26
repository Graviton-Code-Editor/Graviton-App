interface CommandPromptOptions {
	name?: String | number
	showInput?: boolean
	inputPlaceHolder?: String
	inputDefaultText?: String
	options: any[]
	scrollOnTab?: boolean
	closeOnKeyUp?: boolean
	closeOnTab?: boolean
	onCompleted?: (x) => void
	onSelected?: (a, b) => void
	onWriting?: (a, b) => void
	onScrolled?: (a, b) => void
	onTabPressed?: (a, b) => void
	defaultOption: number
}

export { CommandPromptOptions }
