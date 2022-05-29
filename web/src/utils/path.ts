import * as paths from "path";

const isWindows = window.navigator.platform === "Win32";

export function basename(path: string): string {
  if (isWindows) {
    path = path.replace(/\\/gm, "/");
    path = paths.basename(path);
    path = path.replace(/\//gm, "\\");
  } else {
    path = paths.basename(path);
  }
  return path;
}
