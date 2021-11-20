import { dialog } from "@tauri-apps/api"

const isTauri = (window as any).__TAURI__ != null;

export async function openFolderPicker(): Promise<string | null>{
    if(isTauri) {
        const res: string  = await dialog.open({ multiple: false, directory: true }) as string;
        return res;
    } else {
        // Use custom prompt
        return null;
    }
}