import { ReactElement } from "react";

/*
 * Panel API
 */
export abstract class Panel {
    public name: string;
    public container: () => ReactElement;

    constructor(name: string){
        this.name = name;
        this.container = () => <div/>
    }
}