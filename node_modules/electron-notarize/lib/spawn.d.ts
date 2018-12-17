/// <reference types="node" />
import { SpawnOptions } from 'child_process';
export interface SpawnResult {
    code: number;
    output: string;
}
export declare const spawn: (cmd: string, args?: string[], opts?: SpawnOptions) => Promise<SpawnResult>;
