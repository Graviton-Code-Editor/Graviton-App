
// Graviton namespace for the extensions runtime - WIP

function send(msg){
    if(typeof msg !== "object") throw new Error("Message can't be parsed.");

    return Deno.core.opAsync("send_message_to_core", msg);
}

globalThis.Graviton = {
    send
}