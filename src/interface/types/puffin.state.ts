export interface PuffinEventInstance {
	cancel: () => void
}

export interface PuffinState<EventNames = String[] | String, EventArgs = any> {
	data: any
	on: (eventName: String[] | String, callback?: (data: EventArgs) => void | Promise<void>) => PuffinEventInstance
	once: (eventName: String, callback?: (data: any) => void | Promise<void>) => PuffinEventInstance
	emit: (eventName: String, args?: any) => void
	keyChanged: (keyName: String, callback: (keyValue: any) => void) => PuffinEventInstance
	changed: (callback: (data: any, keyName: String) => void | Promise<void>) => PuffinEventInstance
	triggerChange: () => void
}
