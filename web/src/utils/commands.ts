import { dialog } from "@tauri-apps/api"

export const isTauri = (window as any).__TAURI__ != null;

/*
 * Launches a filesystem picker
 */
export async function openFolderPicker(filesystem_name: string): Promise<string | null>{
    if(filesystem_name == 'local' && isTauri) {
        const res: string  = await dialog.open({ multiple: false, directory: true }) as string;
        return res;
    } else {
        // Use custom prompt
        return null;
    }
}