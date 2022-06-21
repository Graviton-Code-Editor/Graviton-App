import { extname } from "path";
import { ReactSVG } from "react-svg";

interface FileIconsOptions {
  item: {
    name: string;
    isFile: boolean;
  };
  isOpened: boolean;
}

export default function FileIcon({
  item,
  isOpened,
}: FileIconsOptions) {
  if (item.isFile) {
    switch (extname(item.name)) {
      case ".jsx":
      case ".js":
        return <ReactSVG src="/icons/files/javascript.svg" className="file" />;
      case ".tsx":
      case ".ts":
        return <ReactSVG src="/icons/files/typescript.svg" className="file" />;
      default:
        return <ReactSVG src="/icons/files/unknown.svg" className="file" />;
    }
  } else if (isOpened) {
    return <ReactSVG src="/icons/files/folder_opened.svg" className="file" />;
  } else {
    return <ReactSVG src="/icons/files/folder_closed.svg" className="file" />;
  }
}
