export interface PuffinEventInstance {
	cancel: () => void
}

export interface PuffinState {
	data: any
	on: (eventName: string | string[], callback?: (data) => void) => PuffinEventInstance
	once: (eventName: string, callback: (data) => void) => void
	emit: (eventName: string, args?: any) => PuffinEventInstance
	keyChanged: (keyName: string, callback: (keyValue) => void) => PuffinEventInstance
	changed: (callback: (data: any, keyName: string) => void) => PuffinEventInstance
	triggerChange: () => void
}
