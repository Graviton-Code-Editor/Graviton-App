import { getRecoil } from "recoil-nexus";
import EditorTab from "../modules/editor_tab";
import { editors } from "../utils/atoms";
import { FileFormat } from "../utils/client";

/*
 * Easily retrieve the best matching editor
 */
export default function useEditor(): (
  format: FileFormat
) => typeof EditorTab | undefined {
  const loadedEditors = getRecoil(editors);

  return (format: FileFormat) =>
    loadedEditors.find((editor) => editor.isCompatible(format));
}
