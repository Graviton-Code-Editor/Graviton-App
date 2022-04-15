import { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/basic-setup";
import styled from "styled-components";

// I could have used EditorView.theme(),
// but since the theme is loaded from the StyledComponents provider,
// it couldn't access the theme in a non-component context.
// But, anyway, applying the theme via a styled-components component shouldn't give any issue
const CodeMirrorStyler = styled.div`
  & {
    background: ${({ theme }) => theme.elements.textEditor.background};
    box-shadow: inset 0px 5px 10px rgba(0,0,0, 0.1);
  }
  & .ͼa {
    color: ${({ theme }) => theme.elements.textEditor.keyword.color};
  }
  & .ͼf {
    color: ${({ theme }) => theme.elements.textEditor.def.color};
  }
  & .ͼd,
  .ͼe {
    color: ${({ theme }) => theme.elements.textEditor.string.color};
  }
  & .ͼk {
    color: ${({ theme }) => theme.elements.textEditor.property.color};
  }
  & .ͼc {
    color: ${({ theme }) => theme.elements.textEditor.number.color};
  }
  & .ͼl {
    color: ${({ theme }) => theme.elements.textEditor.comment.color};
  }
  & .ͼb {
    color: ${({ theme }) => theme.elements.textEditor.atom.color};
  }
  & .ͼh {
    color: ${({ theme }) => theme.elements.textEditor.variable.color};
  }
  & .cm-gutters {
    padding-left: 25px;
    user-select: none;
    background: ${({ theme }) => theme.elements.textEditor.gutters.background};
    border: none;
  }
  & .cm-gutterElement {
    color: ${({ theme }) => theme.elements.textEditor.gutters.gutter.color};
  }
  & .cm-activeLineGutter {
    color: ${({ theme }) =>
      theme.elements.textEditor.gutters.gutter.active.color};
    background: transparent;
  }
  & .cm-content {
    color: ${({ theme }) => theme.elements.textEditor.color};
  }
  & * {
    caret-color: ${({ theme }) => theme.elements.textEditor.color};
  }
  & .cm-cursor {
    border-color: ${({ theme }) => theme.elements.textEditor.color};
  }
  & .cm-line {
    line-height: 26px;
  }
  & .cm-activeLine {
    background: ${({ theme }) =>
      theme.elements.textEditor.activeLine.background};
  }
  & .cm-matchingBracket {
    background: ${({ theme }) =>
      theme.elements.textEditor.matchingBracket.background};
  }
  & .cm-selectionBackground {
    background: ${({ theme }) =>
      theme.elements.textEditor.selection.background} !important;
    border-radius: 2px;
  }
`;

interface TextEditorOptions {
  view: EditorView;
  scrollHeight: number;
  saveScroll: (height: number) => void;
}

export default function TextEditor({
  view,
  saveScroll,
  scrollHeight,
}: TextEditorOptions) {
  const ref = useRef(null);

  /*
   * Save the scroll position
   */
  function onEventScroll() {
    saveScroll(view.scrollDOM.scrollTop);
  }

  useEffect(() => {
    if (ref.current) {
      // Append the CM node to the new tab
      const container = ref.current as HTMLElement;
      container.appendChild(view.dom);

      // Scroll to the saved position,
      // No need to scroll if it's 0
      if (scrollHeight != 0) {
        view.scrollDOM.scrollTo(0, scrollHeight);
      }

      if (view.scrollDOM != null) {
        view.scrollDOM.addEventListener("scroll", onEventScroll);
      }

      return () => {
        view.scrollDOM.removeEventListener("scroll", onEventScroll);
      };
    }
  }, []);

  return (
    <CodeMirrorStyler ref={ref} style={{ height: "100%", width: "100%" }} />
  );
}
