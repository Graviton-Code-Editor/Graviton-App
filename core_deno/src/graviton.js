
// Graviton namespace for the extensions runtime - WIP

function send(msg){
    if(typeof msg !== "object") throw new Error("Message can't be parsed.");

    Deno.core.opSync("send_message_to_core", msg);
}

globalThis.Graviton = {
    send
}