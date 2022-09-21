import TextEditor from "modules/tabs/text_editor/components/TextEditor";
import { clientState } from "state";
import * as commands from "@codemirror/commands";
import { Tab } from "features/tab/tab";
import { rust } from "@codemirror/lang-rust";
import { dirname } from "path";
import { useEffect, useState } from "react";
import { useLSPClients } from "hooks";
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  KeyBinding,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import {
  bracketMatching,
  foldGutter,
  foldKeymap,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { EditorState, StateCommand } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { useRecoilValue } from "recoil";
import {
  LanguageServerClient,
  languageServerWithClient,
} from "codemirror-languageserver";
import GravitonTransport from "../lib/graviton_lsp_transport";
import { basename } from "utils/path";
import { markdown } from "@codemirror/lang-markdown";
import { TextEditorTab } from "../text_editor";
import { Client } from "services/clients/client.types";
// @ts-ignore
import { tags } from "@lezer/highlight";

interface IFeaturedTextEditorOptions {
  close: () => void;
  setEdited: (state: boolean) => void;
  tab: Tab;
}

/**
 * Full featured Code Editor
 */
export function FeaturedTextEditor({
  close,
  setEdited,
  tab,
}: IFeaturedTextEditorOptions) {
  const textEditorTab = tab as unknown as TextEditorTab;

  const [view, setView] = useState(textEditorTab.view);
  const lspClients = useLSPClients();
  const client = useRecoilValue(clientState);

  useEffect(() => {
    if (view != null) return;

    // Wait until the tab is mounted to read it's content
    textEditorTab.contentResolver.then((initialValue) => {
      if (initialValue != null) {
        createDefaulState(
          initialValue,
          textEditorTab,
          setEdited,
          lspClients,
          client,
        ).then((state) => {
          textEditorTab.view = new EditorView({
            state,
            dispatch: (tx) => {
              if (tx.docChanged) setEdited(true);
              (textEditorTab.view as EditorView).update([tx]);
            },
          });

          // Update the view component
          setView(textEditorTab.view);
        });
      } else {
        // If there is no content to read then just close the tab
        textEditorTab.close();
        close();
      }
    });
  }, [view]);

  const saveScroll = (height: number) => {
    textEditorTab.state.scrollHeight = height;
  };

  if (view) {
    return (
      <TextEditor
        view={view}
        scrollHeight={textEditorTab.state.scrollHeight}
        saveScroll={saveScroll}
      />
    );
  } else {
    return <></>;
  }
}

function getKeymap(
  textEditorTab: TextEditorTab,
  setEdited: (state: boolean) => void,
) {
  // Undo command
  const undo: StateCommand = (target) => {
    commands.undo(target);
    return checkEditStatus(target);
  };

  // Redo command
  const redo: StateCommand = (target) => {
    commands.redo(target);
    return checkEditStatus(target);
  };

  // If the new state doc is the same as the last saved one then set the tab as unedited
  const checkEditStatus: StateCommand = (target) => {
    const currentStateText = target.state.doc.toJSON();

    if (
      textEditorTab.lastSavedStateText.length == currentStateText.length &&
      textEditorTab.lastSavedStateText.every((e, i) => e == currentStateText[i])
    ) {
      setEdited(false);
    } else {
      setEdited(true);
    }

    return false;
  };

  // Define the custom keymap
  const customKeymap: readonly KeyBinding[] = [
    { key: "mod-y", run: redo, preventDefault: true },
    { key: "mod-z", run: undo, preventDefault: true },
  ];

  return keymap.of(customKeymap);
}

// Initialize the CodeMirror State
async function createDefaulState(
  initialValue: string,
  textEditorTab: TextEditorTab,
  setEdited: (state: boolean) => void,
  { find, add }: ReturnType<typeof useLSPClients>,
  client: Client,
): Promise<EditorState> {
  const extensions = [
    getKeymap(textEditorTab, setEdited),
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(
      HighlightStyle.define([
        { tag: tags.meta, class: "meta" },
        { tag: tags.link, class: "link" },
        { tag: tags.heading, class: "heading" },
        { tag: tags.emphasis, class: "emphasis" },
        { tag: tags.strong, class: "strong" },
        { tag: tags.strikethrough, class: "strikethrough" },
        { tag: tags.keyword, class: "keyword" },
        {
          tag: [
            tags.atom,
            tags.bool,
            tags.url,
            tags.contentSeparator,
            tags.labelName,
          ],
          class: "atom",
        },
        { tag: [tags.literal, tags.inserted], class: "literal" },
        { tag: [tags.string, tags.deleted], class: "string" },
        {
          tag: [
            tags.regexp,
            tags.escape,
            tags.special(tags.string),
          ],
          class: "regex",
        },
        {
          tag: tags.definition(tags.variableName),
          class: "variable",
        },
        { tag: [tags.typeName, tags.namespace], class: "type" },
        { tag: tags.className, class: "classname" },
        {
          tag: [tags.special(tags.variableName), tags.macroName],
          class: "macroname",
        },
        {
          tag: tags.definition(tags.propertyName),
          class: "property",
        },
        { tag: tags.comment, class: "comment" },
        { tag: tags.invalid, class: "invalid" },
        { tag: tags.bracket, class: "bracket" },
        { tag: tags.function(tags.name), class: "functionCall" },
      ]),
      { fallback: true },
    ),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
  ];
  let lspLanguage: [string, string] | null = null;

  if (typeof textEditorTab.format !== "string") {
    switch (textEditorTab.format.Text) {
      case "TypeScript":
        lspLanguage = ["typescript", textEditorTab.format.Text];
        extensions.push(javascript({
          jsx: true,
          typescript: true,
        }));
        break;
      case "JavaScript":
        lspLanguage = ["javascript", textEditorTab.format.Text];
        extensions.push(javascript({
          jsx: true,
        }));
        break;
      case "Rust":
        lspLanguage = ["rust", textEditorTab.format.Text];
        extensions.push(rust());
        break;
      case "Markdown":
        extensions.push(markdown());
        break;
      default:
        lspLanguage = null;
    }
  }

  // TODO(marc2332): Remove *somehow* the client if the language server is disabled/closed

  // Use the first language server builder found
  if (lspLanguage != null) {
    const [languageId] = lspLanguage;

    const unixPath = textEditorTab.path.replace(/\\/g, "/");
    const rootUri = `file:///${dirname(unixPath)}`;

    const loadedLsClient = find(languageId);

    if (loadedLsClient) {
      // Reuse existing lsp clients
      const lsPlugin = languageServerWithClient({
        languageId,
        documentUri: `file:///${unixPath}`,
        client: loadedLsClient,
      });

      extensions.push(lsPlugin);
    } else {
      const available_language_servers = await client
        .get_all_language_server_builders();

      if (available_language_servers.Ok) {
        const lang_servers = available_language_servers.Ok;

        for (const lang_server of lang_servers) {
          if (lang_server.id === languageId) {
            // Initialize a language server
            client.create_language_server(languageId);

            // Create a client
            const lsClient = new LanguageServerClient({
              transport: new GravitonTransport(languageId, client),
              rootUri,
              workspaceFolders: [
                {
                  name: basename(dirname(unixPath)),
                  uri: unixPath,
                },
              ],
            });

            // Create a plugin
            const lsPlugin = languageServerWithClient({
              languageId,
              documentUri: `file:///${unixPath}`,
              client: lsClient,
            });

            // Save the client to re use for other editors
            add({
              rootUri,
              languageId,
              client: lsClient,
            });

            extensions.push(lsPlugin);
          }
        }
      }
    }
  }

  const state = EditorState.create({
    extensions,
    doc: initialValue,
  });

  // Leave the just created state as the latest one saved
  textEditorTab.lastSavedStateText = state.doc.toJSON();

  return state;
}
