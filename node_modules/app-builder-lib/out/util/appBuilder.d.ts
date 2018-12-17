export declare function executeAppBuilderAsJson<T>(args: Array<string>): Promise<T>;
export declare function objectToArgs(to: Array<string>, argNameToValue: {
    [key: string]: string | null;
}): void;
