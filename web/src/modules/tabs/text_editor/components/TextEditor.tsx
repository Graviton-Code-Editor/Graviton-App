import { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import styled from "styled-components";

// I could have used EditorView.theme(),
// but since the theme is loaded from the StyledComponents provider,
// it couldn't access the theme in a non-component context.
// But, anyway, applying the theme via a styled-components component shouldn't give any issue
const CodeMirrorStyler = styled.div`
  & {
    background: ${({ theme }) => theme.elements.textEditor.background};
    box-shadow: inset 0px 5px 10px rgba(0, 0, 0, 0.1);
  }
  & .cm-editor {
    outline: none !important;
  }
  & .keyword {
    color: ${({ theme }) => theme.elements.textEditor.keyword.color};
  }
  & .string {
    color: ${({ theme }) => theme.elements.textEditor.string.color};
  }
  & .functionCall {
    color: ${({ theme }) => theme.elements.textEditor.functionCall.color};
  }
  & .property {
    color: ${({ theme }) => theme.elements.textEditor.property.color};
  }
  & .literal {
    color: ${({ theme }) => theme.elements.textEditor.literal.color};
  }
  & .definion {
    color: ${({ theme }) => theme.elements.textEditor.def.color};
  }
  & .keyword {
    color: ${({ theme }) => theme.elements.textEditor.keyword.color};
  }
  & .comment {
    color: ${({ theme }) => theme.elements.textEditor.comment.color};
  }
  & .bracket {
    color: ${({ theme }) => theme.elements.textEditor.bracket.color};
  }
  & .variable {
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
  & .cm-tooltip {
   border-radius: 5px;
   background: ${({ theme }) => theme.elements.textEditor.tooltip.background};
   color: ${({ theme }) => theme.elements.textEditor.tooltip.color};
   border: 1px solid ${({ theme }) => theme.elements.textEditor.tooltip.border};
   & li {
    height: 25px;
    display: flex;
    align-items: center;
   }
   & li:first-child {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
   }
   & li:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
   }
  }
  & ::-webkit-scrollbar {
    height: 10px;
    width: 10px;
  }
  & ::-webkit-scrollbar-thumb {
    border-radius: 2px;
  }
`;

interface TextEditorOptions {
  view: EditorView;
  scrollHeight: number;
  saveScroll: (height: number) => void;
}

/**
 * Simple Wrapper over CodeMirror
 */
export default function TextEditor({
  view,
  saveScroll,
  scrollHeight,
}: TextEditorOptions) {
  const ref = useRef(null);

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

      // This will make the cursor appear again
      view.focus();

      return () => {
        view.scrollDOM.removeEventListener("scroll", onEventScroll);
      };
    }
  }, []);

  return (
    <CodeMirrorStyler ref={ref} style={{ height: "100%", width: "100%" }} />
  );
}
