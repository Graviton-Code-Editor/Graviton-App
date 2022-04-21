import { useRecoilValue } from "recoil";
import TextEditorTab from "../tabs/text_editor";
import { FileFormat } from "../types/client";
import { editors } from "../utils/state";

export type EditorFinder = (
  format: FileFormat
) => typeof TextEditorTab | undefined;

/**
 * Easily retrieve the best matching editor
 *
 * @param format The file's format, used to retrieve the best matching editor
 */
export default function useEditor(): EditorFinder {
  const loadedEditors = useRecoilValue(editors);

  return (format: FileFormat) =>
    loadedEditors.find((editor) => editor.isCompatible(format));
}
