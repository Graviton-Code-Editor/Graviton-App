declare namespace Graviton {
    function send<T>(msg: Record<string, T>): any;
    function listen(): AsyncGenerator<any, void, unknown>;
    function listenTo(event: string): any;
    function exit(): any;
    function whenUnload(): any;
    class StatusBarItem {
        itemID: string;
        label: string;
        constructor(itemID: string, label?: string);
        show(): any;
        hide(): any;
        onClick(callback: () => void): Promise<never>;
        setLabel(newLabel: string): any;
    }
    function crateStatusbarItem(label?: string): Promise<StatusBarItem>;
}
