import { useEffect, useRef, useState } from "react";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import React from "react";

function defaultState({ initialValue }: { initialValue: string }): EditorState {
  return EditorState.create({
    extensions: [basicSetup, javascript()],
    doc: initialValue,
  });
}

interface CodeMirrorOptions {
  state?: EditorState;
  initialValue: string;
  scrollPos: number;
  onUpdate: (view: EditorView) => void;
  onScroll: (scroll: number, view: EditorView) => void;
}

export default function CodeMirror({
  state,
  initialValue,
  onUpdate,
  scrollPos,
  onScroll,
}: CodeMirrorOptions) {
  const ref = useRef(null);
  /* eslint-disable */
  let [editorView, setEditorView] = useState<EditorView | null>(null);

  function onEventScroll() {
    if (editorView != null) {
      onScroll(editorView.scrollDOM.scrollTop, editorView);
    }
  }

  useEffect(() => {
    if (ref.current) {
      // Create the CodeMirror instance in the container
      const editor = new EditorView({
        state:
          state ||
          defaultState({
            initialValue,
          }),
        parent: ref.current,
        dispatch: (txs) => {
          editor.update([txs]);
          onUpdate(editor);
        },
      });

      editorView = editor;
      setEditorView(editor);

      if (editor.scrollDOM != null) {
        editor.scrollDOM.addEventListener("scroll", onEventScroll);
      }

      return () => {
        editor.scrollDOM.removeEventListener("scroll", onEventScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (editorView && editorView.dom && editorView.dom.lastChild) {
      let container = editorView.dom.lastChild as HTMLElement;
      container.scrollTo(0, scrollPos);
    }
  }, [scrollPos]);

  return <div ref={ref} style={{ height: "100%", width: "100%" }} />;
}
