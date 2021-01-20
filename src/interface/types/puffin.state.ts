export interface PuffinEventInstance {
	cancel: () => void
}

export interface PuffinState<Data = any, EventsMap = any> {
	data: Data
	on<eventKey extends keyof EventsMap>(eventName: eventKey | eventKey[], eventListener: (eventArgs: EventsMap[eventKey]) => void): PuffinEventInstance
	once<eventKey extends keyof EventsMap>(eventName: eventKey, eventListener?: (eventArgs: EventsMap[eventKey]) => void | Promise<void>): PuffinEventInstance
	emit<eventKey extends keyof EventsMap>(eventName: eventKey, eventArgs?: any): void
	keyChanged: (keyName: String, listener: (keyValue: any) => void) => PuffinEventInstance
	changed: (listener: (data: any, keyName: String) => void | Promise<void>) => PuffinEventInstance
	triggerChange: () => void
}
