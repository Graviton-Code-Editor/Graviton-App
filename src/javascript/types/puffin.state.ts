interface EventInstance {
	cancel: () => void
}

interface PuffinState {
	data: any
	on: (eventName: string | string[], callback: (data) => void) => EventInstance
	once: (eventName: string, callback: (data) => void) => void
	emit: (eventName: string, args?: any) => EventInstance
	keyChanged: (keyName: string, callback: (keyValue) => void) => EventInstance
	changed: (callback: (data: any, keyName: string) => void) => EventInstance
	triggerChange: () => void
}
export default PuffinState
