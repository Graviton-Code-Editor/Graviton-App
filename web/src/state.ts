import RpcClient from "./client";

export interface TabData {
    
}

export interface StateData {
    opened_tabs: Array<TabData>
}

export class Tab implements TabData {

    public static fromJson(data: TabData): Tab {
        const tab = new Tab();

        return tab;
    }
}

export class State {

    private client: RpcClient;
    private id: number;

    // Internal state data
    public state: StateData;

    constructor(client: RpcClient, id: number){
        this.client = client;
        this.id = id;
        this.state = {
            opened_tabs: []
        };
    }

    /*
     * Save the current state into the backend
     */
    public async save(){
        await this.client.set_state_by_id(this.id, this.state);
    }
}
