
// Graviton namespace for the extensions runtime - WIP

function send(msg: {[key: string]: any}){
    if(typeof msg !== "object") throw new Error("Message can't be parsed.");

    //@ts-ignore
    return Deno.core.opAsync("send_message_to_core", msg);
}

async function* listen(){
    while(true){
        //@ts-ignore
        yield Deno.core.opAsync("listen_messages_from_core", "");
    }
}

function listenTo(event: string){
    if(typeof event !== "string" ) throw new Error("Event name must be string.");

    //@ts-ignore
    return Deno.core.opAsync("listen_messages_from_core", event);
}

function exit(){
    //@ts-ignore
    return Deno.core.opAsync("terminate_main_worker")
}

function whenUnload(){
    return listenTo("unload")
}

(globalThis as any).Graviton = {
    send,
    listen,
    listenTo,
    exit,
    whenUnload,
}

