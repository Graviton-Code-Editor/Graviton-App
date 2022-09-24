// Graviton namespace for the extensions runtime - WIP

// deno-lint-ignore no-namespace
namespace Graviton {
  export function send<T>(msg: Record<string, T>) {
    if (typeof msg !== "object") throw new Error("Message can't be parsed.");
  
    //@ts-ignore: Deno core usage
    return Deno.core.opAsync("op_send_message_core_tx", msg);
  }
  
  export async function* listen() {
    while (true) {
      //@ts-ignore: Deno core usage
      yield Deno.core.opAsync("op_listen_messages_core_rx", "");
    }
  }
  
  export function listenTo(event: string) {
    if (typeof event !== "string") throw new Error("Event name must be string.");
  
    //@ts-ignore: Deno core usage
    return Deno.core.opAsync("op_listen_messages_core_rx", event);
  }
  
  export function exit() {
    //@ts-ignore: Deno core usage
    return Deno.core.opAsync("op_terminate_main_worker");
  }
  
  export function whenUnload() {
    return listenTo("unload");
  }
  
  export class StatusBarItem {
    constructor(public itemID: string, public label: string = "") {
    }
  
    show() {
      //@ts-ignore: Deno core usage
      return Deno.core.opAsync("op_show_statusbar_item", this.itemID);
    }
  
    hide() {
      //@ts-ignore: Deno core usage
      return Deno.core.opAsync("op_hide_statusbar_item", this.itemID);
    }
  
    async onClick(callback: () => void): Promise<never> {
      while (true) {
        //@ts-ignore: Deno core usage
        await Deno.core.opAsync("op_on_click_statusbar_item", this.itemID);
        callback();
      }
    }
  
    setLabel(newLabel: string) {
      //@ts-ignore: Deno core usage
      return Deno.core.opAsync(
        "op_set_statusbar_item_label",
        this.itemID,
        newLabel,
      );
    }
  }
  
  export async function crateStatusbarItem(label = ""): Promise<StatusBarItem> {
    //@ts-ignore: Deno core usage
    const itemID = await Deno.core.opAsync("op_new_statusbar_item", label);
  
    return new StatusBarItem(itemID, label);
  }
}

// deno-lint-ignore no-explicit-any
(globalThis as any).Graviton = Graviton;
