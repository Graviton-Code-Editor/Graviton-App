### ideas
- Implement frontend-only extensions (through the Core ?)
- Move the built-in transport handlers from the `core` crate into their own crate

# Docs 
- [ ] book: Write a guide to create an extension
- [ ] docs.rs: Document the Core JSON RPC and WebSockets API

# core / core_api
- [x] Make use of the native (OS-builtin) filesystem explorer to open folder and files
- [ ] Also return the language codename or "unknown" when reading a file in the Core
- [ ] Implement a workspace system
- [ ] Implement a frontend-agnostic theme standard
- [x] Think about using CORS to maximize security of Core
- [x] Setup CI
- [ ] Setup CD (daily beta releases)
- [x] Implement  ExtensionMessages
- [ ] Make a Popup, StatusBarItem builder
- [ ] Ability to close a popup from the extension
- [x] Random ID generator for the the modules
- [x] Ability to listen on core messages from any extension (tokio::sync::broadcast might be useful)
- [ ] Build git extension with `--release` when building the binary / installer
- [x] Make Graviton web decide what editor should be opened depending on the file format
- [x] Create StatusBarItem module
- [x] Desktop: Load extensions from the <HOME_DIR>/.graviton/extensions/
- [ ] Save `tracing`'s logs in a file (with `tracing_subscriber`)
- [ ] Implement Theme extensions support
- [ ] Add `ProjectOpened` message event (useful for the git extension)
- [x] Ability to write files (XD)
- [ ] State shouldn't have a global `opened_tabs` array but a opened_tabs per folder
- [x] Make it possible to persist states
- [ ] Add tests for extensions loaded from shared libraries

### web
- [ ] Make a web-based filesystem explorer component (WIP)
- [ ] Make the JSON RPC & WebSockets TypeScript client a separate library
- [ ] Make the popup module (WIP)
- [ ] Add file icons support
- [ ] Configure CodeMirror  (WIP)
- [ ] Create a settings tab (WIP)
- [x] Add a custom hook to easily open a tab 
- [ ] LSP support (https://github.com/FurqanSoftware/codemirror-languageserver)

### web_components
- [ ] Publish to npm ?

### server
- [ ] Use a random-generated token for it's state
