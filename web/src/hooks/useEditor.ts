import { useRecoilValue } from "recoil";
import { TextEditorTab } from "modules/tabs";
import { FileFormat } from "../services/clients/client.types";
import { editors } from "state";

export type EditorFinder = (
  format: FileFormat,
) => typeof TextEditorTab | undefined;

/**
 * Easily retrieve the best matching editor
 */
export function useEditor(): EditorFinder {
  const loadedEditors = useRecoilValue(editors);

  return (format: FileFormat) =>
    loadedEditors.find((editor) => editor.isCompatible(format));
}
