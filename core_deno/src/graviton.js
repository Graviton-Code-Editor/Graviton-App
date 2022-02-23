
// Graviton namespace for the extensions runtime - WIP

function send(msg){
    if(typeof msg !== "object") throw new Error("Message can't be parsed.");

    return Deno.core.opAsync("send_message_to_core", msg);
}

async function* listen(){
    while(true){
        yield Deno.core.opAsync("listen_messages_from_core", "");
    }
}


function listenTo(event){
    if(typeof event !== "string" ) throw new Error("Event name must be string.");

    return Deno.core.opAsync("listen_messages_from_core", event);
}


globalThis.Graviton = {
    send,
    listen,
    listenTo
}