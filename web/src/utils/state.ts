import RpcClient from "./client";
import BaseEditor from "../editors/base";
import TextEditor from "../editors/text";

export interface TabData {
    title: string
}

export interface StateData {
    opened_tabs: Array<TabData>
}

export class Tab implements TabData {

    public title: string;

    constructor(title: string){
        this.title = title;
    }

    public static fromJson(data: TabData): Tab {
        const tab = new Tab(data.title);

        return tab;
    }
}

export class State {

    // Internal clients
    private client: RpcClient;
    private id: number;

    // Shared state data
    public state: StateData;

    // Available file editors
    private editors: typeof BaseEditor[];

    constructor(client: RpcClient, id: number){
        this.client = client;
        this.id = id;
        this.state = {
            opened_tabs: []
        };
        this.editors = [
            TextEditor
        ];
    }

    /*
     * Save the current state into the backend
     */
    public async save(){
        await this.client.set_state_by_id(this.id, this.state);
    }
}
