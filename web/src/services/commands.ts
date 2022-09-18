import { setRecoil } from "recoil-nexus";
import { RemoteExplorer } from "windows";
import { showedWindowsState } from "state";

export const isTauri = (globalThis as any).__TAURI__ != null;

/**
 * Launches a filesystem picker, native if Tauri and web-based on browser
 */
export async function openFileSystemPicker(
  filesystem_name: string,
  kind: "folder" | "file",
): Promise<string | null> {
  if (filesystem_name == "local" && isTauri) {
    const { dialog } = await import("@tauri-apps/api");

    // Make use of the native file picker if it's running in Tauri
    return (await dialog.open({
      multiple: false,
      directory: kind === "folder",
    })) as
      | string
      | null;
  } else {
    // Use web-based explorer
    return new Promise((resolve) => {
      function onSelectedItem(itemPath: string) {
        resolve(itemPath);
      }
      setRecoil(showedWindowsState, (val) => [
        ...val,
        new RemoteExplorer({ onSelectedItem, kind }),
      ]);
    });
  }
}
