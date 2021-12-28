import { useRecoilValue } from "recoil";
import EditorTab from "../modules/editor_tab";
import { editors } from "../utils/atoms";

/*
 * Easily retrieve the best matching editor
 */
export default function useEditor(): (format: string) => typeof EditorTab | undefined  {
    const loadedEditors = useRecoilValue(editors);
    
    return (format: string) => loadedEditors.find(editor => editor.isCompatible(format))
}
