import { useEffect, useRef, useState } from "react";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { javascript } from "@codemirror/lang-javascript";
import { useTheme } from "styled-components";

function getCodeMirrorThemeExtensions(theme: any) {
  return EditorView.theme({
    "&": {
      background: theme.elements.textEditor.background,
    },
    "& .ͼa": {
      color: theme.elements.textEditor.keyword.color,
    },
    "& .ͼf": {
      color: theme.elements.textEditor.def.color,
    },
    "& .ͼd, .ͼe": {
      color: theme.elements.textEditor.string.color,
    },
    "& .ͼk": {
      color: theme.elements.textEditor.property.color,
    },
    "& .ͼc": {
      color: theme.elements.textEditor.number.color,
    },
    "& .ͼl": {
      color: theme.elements.textEditor.comment.color,
    },
    "& .ͼb": {
      color: theme.elements.textEditor.atom.color,
    },
    "& .cm-gutters": {
      "padding-left": "25px",
      "user-select": "none",
      background: theme.elements.textEditor.gutters.background,
      border: "none",
      "& .cm-gutterElement": {
        color: theme.elements.textEditor.gutters.gutter.color,
      },
      "& .cm-activeLineGutter": {
        color: theme.elements.textEditor.gutters.gutter.active.color,
        background: "transparent",
      },
    },
    "& .cm-content": {
      color: theme.elements.textEditor.color,
    },
    "& *": {
      "caret-color": theme.elements.textEditor.color,
    },
    "& .cm-cursor": {
      "border-color": theme.elements.textEditor.color,
    },
    "& .cm-line": {
      "line-height": "26px",
    },
    "& .cm-activeLine": {
      background: theme.elements.textEditor.activeLine.background,
    },
    "& .cm-matchingBracket": {
      background: theme.elements.textEditor.matchingBracket.background,
    },
  });
}

function defaultState({
  initialValue,
  theme,
}: {
  initialValue: string;
  theme: any;
}): EditorState {
  return EditorState.create({
    extensions: [basicSetup, javascript(), getCodeMirrorThemeExtensions(theme)],
    doc: initialValue,
  });
}

interface TextEditorOptions {
  state?: EditorState;
  initialValue: string;
  scrollPos: number;
  onUpdate: (view: EditorView) => void;
  onScroll: (scroll: number, view: EditorView) => void;
}

export default function TextEditor({
  state,
  initialValue,
  onUpdate,
  scrollPos,
  onScroll,
}: TextEditorOptions) {
  const ref = useRef(null);
  const theme = useTheme();
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
            theme,
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
      const container = editorView.dom.lastChild as HTMLElement;
      container.scrollTo(0, scrollPos);
    }
  }, [scrollPos]);
  return <div ref={ref} style={{ height: "100%", width: "100%" }} />;
}
