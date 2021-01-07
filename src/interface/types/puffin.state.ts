export interface PuffinEventInstance {
	cancel: () => void
}

interface PuffinState2<EventNames = String[] | String, EventArgs = any> {
	data: any
	on: (eventName: String[] | String, callback?: (data: EventArgs) => void | Promise<void>) => PuffinEventInstance
	once: (eventName: String, callback?: (data: any) => void | Promise<void>) => PuffinEventInstance
	emit: (eventName: String, args?: any) => void
	keyChanged: (keyName: String, callback: (keyValue: any) => void) => PuffinEventInstance
	changed: (callback: (data: any, keyName: String) => void | Promise<void>) => PuffinEventInstance
	triggerChange: () => void
}

export interface PuffinState<EventsMap = any> {
	data: any
	on<eventKey extends keyof EventsMap>(eventName: eventKey | eventKey[], eventListener: (eventArgs: EventsMap[eventKey]) => void): PuffinEventInstance
	once<eventKey extends keyof EventsMap>(eventName: eventKey, listener?: (data: any) => void | Promise<void>): PuffinEventInstance
	emit<eventKey extends keyof EventsMap>(eventName: eventKey, args?: any): void
	keyChanged: (keyName: String, listener: (keyValue: any) => void) => PuffinEventInstance
	changed: (listener: (data: any, keyName: String) => void | Promise<void>) => PuffinEventInstance
	triggerChange: () => void
}
