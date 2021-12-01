//@ts-ignore
import * as simple_jsonrpc from 'simple-jsonrpc-js'
import Configuration from './config';
import { StateData } from './state';
import Emittery from 'emittery'

interface WebSocketsMessage {
    trigger: string,
    msg_type: string
}
interface CoreResponse<T> {
    Err?: any,
    Ok?: T
}

export interface DirItemInfo {
    path: string,
    name: string,
    is_file: boolean
}

export interface FileInfo {
    content: string,
    format: string
}

/*
 * Internal RPC Client to connect to a backend
 */
class RpcClient extends Emittery {

    // Internal rpc client
    private rpc: simple_jsonrpc;
    // Internal websockets client
    private socket: WebSocket;
    private config: Configuration;

    constructor(config: Configuration) {
        super();
        this.rpc = simple_jsonrpc.connect_xhr(config.http_uri);
        this.socket = new WebSocket(config.ws_uri);
        this.config = config;

        this.socket.onmessage = (ev) => {
            const message: WebSocketsMessage = JSON.parse(ev.data);
            this.emit(message.msg_type, message);
        }

        this.socket.onopen = () => {
            this.emit('connected');
        }
    }

    /*
     * Implemented in the Core
     * @JsonRpcMethod
     */
    public get_state_by_id(): Promise<StateData> {
        return this.rpc.call('get_state_by_id', [this.config.state_id, this.config.token]);
    }

    /*
     * Implemented in the Core
     * @JsonRpcMethod
     */
    public set_state_by_id(state: StateData): Promise<void> {
        return this.rpc.call('set_state_by_id', [this.config.state_id, state, this.config.token]);
    }

    /*
     * Implemented in the Core
     * @JsonRpcMethod
     */
    public read_file_by_path(path: string, filesystem_name: string,): Promise<CoreResponse<FileInfo>> {
        return this.rpc.call('read_file_by_path', [path, filesystem_name, this.config.state_id, this.config.token]);
    }

    /*
     * Implemented in the Core
     * @JsonRpcMethod
     */
    public list_dir_by_path(path: string, filesystem_name: string): Promise<CoreResponse<Array<DirItemInfo>>> {
        return this.rpc.call('list_dir_by_path', [path, filesystem_name, this.config.state_id, this.config.token]);
    }

    /*
     * Listen for any mess in the websockets connection
     * @WSCommand
     */
    public listenToState() {
        this.socket.send(JSON.stringify({
            trigger: 'client',
            msg_type: 'ListenToState',
            state_id: this.config.state_id
        }))
    }

}

export default RpcClient;