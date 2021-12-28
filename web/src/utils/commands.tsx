import { setRecoil } from "../components/ExternalState";
import { RemoteExplorer } from "../modules/remote_explorer";
import { showedWindows } from "./atoms";

export const isTauri = (globalThis as any).__TAURI__ != null;

/**
 * Launches a filesystem picker, native if Tauri and web-based if not
 */
export async function openFolderPicker(
  filesystem_name: string
): Promise<string | null> {
  const { dialog } = await import("@tauri-apps/api");

  if (filesystem_name == "local" && isTauri) {
    // Make use of the native file picker if it's running in Tauri
    return (await dialog.open({ multiple: false, directory: true })) as
      | string
      | null;
  } else {
    // Use web-based explorer
    return new Promise((resolve) => {
      function onSelectedFolder(folderPath: string) {
        resolve(folderPath);
      }
      setRecoil(showedWindows, (val) => [
        ...val,
        new RemoteExplorer({ onSelectedFolder }),
      ]);
    });
  }
}
