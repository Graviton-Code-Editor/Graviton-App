import { ReactElement } from "react";

/*
 * Panel API
 */
export abstract class Panel {
    public name: string;
    public container: () => ReactElement;
    public icon: () => ReactElement<any>;

    constructor(name: string){
        this.name = name;
        this.container = () => <div/>
        this.icon = () => <div/>
    }
}