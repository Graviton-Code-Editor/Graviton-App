import { getRecoil } from "recoil-nexus";
import EditorTab from "../modules/editor_tab";
import { FileFormat } from "../types/client";
import { editors } from "../utils/atoms";

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
