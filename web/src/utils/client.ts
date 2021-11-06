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

/*
 * Internal RPC Client to connect to a backend
 */
class RpcClient extends Emittery {

    // Internal rpc client
    private rpc: simple_jsonrpc;
    // Internal websockets client
    private socket: WebSocket;

    constructor(config: Configuration) {
        super();
        this.rpc = simple_jsonrpc.connect_xhr(config.http_uri);
        this.socket = new WebSocket(config.ws_uri);

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
    public get_state_by_id(id: number): Promise<StateData> {
        return this.rpc.call('get_state_by_id', [id]);
    }

    /*
     * Implemented in the Core
     * @JsonRpcMethod
     */
    public set_state_by_id(id: number, state: StateData): Promise<void> {
        return this.rpc.call('set_state_by_id', [id, state]);
    }

    /*
     * Implemented in the Core
     * @JsonRpcMethod
     */
    public read_file_by_path(path: string, filesystem_name: string, state_id: number): Promise<CoreResponse<string>> {
        return this.rpc.call('read_file_by_path', [path, filesystem_name, state_id]);
    }

    /*
     * Implemented in the Core
     * @JsonRpcMethod
     */
    public list_dir_by_path(path: string, filesystem_name: string, state_id: number): Promise<CoreResponse<Array<string>>> {
        return this.rpc.call('list_dir_by_path', [path, filesystem_name, state_id]);
    }

    /*
     * Listen for any mess in the websockets connection
     * @WSCommand
     */
    public listenToState(id: number) {
        this.socket.send(JSON.stringify({
            trigger: 'client',
            msg_type: 'ListenToState',
            state_id: id
        }))
    }

}

export default RpcClient;