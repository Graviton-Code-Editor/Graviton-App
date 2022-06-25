import { useRecoilValue } from "recoil";
import TextEditorTab from "../tabs/text_editor/text_editor";
import { FileFormat } from "../services/clients/client.types";
import { editors } from "../state/state";

export type EditorFinder = (
  format: FileFormat,
) => typeof TextEditorTab | undefined;

/**
 * Easily retrieve the best matching editor
 */
export default function useEditor(): EditorFinder {
  const loadedEditors = useRecoilValue(editors);

  return (format: FileFormat) =>
    loadedEditors.find((editor) => editor.isCompatible(format));
}
