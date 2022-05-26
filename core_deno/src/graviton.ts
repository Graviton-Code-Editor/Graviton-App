
// Graviton namespace for the extensions runtime - WIP

function send(msg: {[key: string]: any}){
    if(typeof msg !== "object") throw new Error("Message can't be parsed.");

    //@ts-ignore
    return Deno.core.opAsync("op_send_message_to_core", msg);
}

async function* listen(){
    while(true){
        //@ts-ignore
        yield Deno.core.opAsync("op_listen_messages_from_core", "");
    }
}

function listenTo(event: string){
    if(typeof event !== "string" ) throw new Error("Event name must be string.");

    //@ts-ignore
    return Deno.core.opAsync("op_listen_messages_from_core", event);
}

function exit(){
    //@ts-ignore
    return Deno.core.opAsync("op_terminate_main_worker")
}

function whenUnload(){
    return listenTo("unload")
}

class StatusBarItem {

    constructor(public itemID: string, public label: string = ""){

    }

    show(){
        //@ts-ignore
        return Deno.core.opAsync("op_show_statusbar_item", this.itemID)
    }

    hide(){
        //@ts-ignore
        return Deno.core.opAsync("op_hide_statusbar_item", this.itemID)
    }

    async onClick(callback: () => void): Promise<never>{
        while(true){
            //@ts-ignore
            await Deno.core.opAsync("op_on_click_statusbar_item", this.itemID)
            callback();
        }
    }

    setLabel(newLabel: String){
        //@ts-ignore
        return Deno.core.opAsync("op_set_statusbar_item_label", this.itemID, newLabel)
    }
}

async function crateStatusbarItem(label: string = ""): Promise<StatusBarItem> {
    //@ts-ignore
    const itemID = await Deno.core.opAsync("op_new_statusbar_item", label);

    return new StatusBarItem(itemID, label);
}

(globalThis as any).Graviton = {
    send,
    listen,
    listenTo,
    exit,
    whenUnload,
    crateStatusbarItem
}


