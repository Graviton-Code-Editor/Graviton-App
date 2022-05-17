### ideas
- Implement frontend-only extensions (through the Core ?)

# Docs 
- [ ] book: Write a guide to create an extension
- [ ] docs.rs: Document the Core JSON RPC and WebSockets API

# core / core_api
- [x] Make use of the native (OS-builtin) filesystem explorer to open folder and files
- [ ] Implement a workspace system
- [ ] Implement a frontend-agnostic theme standard
- [x] Use CORS to maximize security of Core with HTTP transport
- [x] Setup CI
- [ ] Setup CD (daily beta releases)
- [x] Implement  ExtensionMessages
- [ ] Make a Popup, StatusBarItem builder
- [ ] Ability to close a popup from the extension
- [x] Random ID generator for the the modules
- [x] Ability to listen on core messages from any extension (tokio::sync::broadcast might be useful)
- [x] Make Graviton web decide what editor should be opened depending on the file format
- [x] Create StatusBarItem module
- [x] Desktop: Load extensions from the <HOME_DIR>/.graviton/extensions/
- [ ] Save `tracing`'s logs in a file (with `tracing_subscriber`)
- [ ] Implement Theme extensions support
- [ ] Add `ProjectOpened` message event (useful for the git extension)
- [x] Ability to write files (XD)
- [x] Make it possible to persist states
- [x] Manifest files in TOML (Not Cargo.toml, but just for Graviton extensions)
- [ ] Add support for buttons in popup module

# core_deno
- [x] Send messages to the Core
- [ ] Extension Modules:
    - StatusBarItems
        - [x] Show
        - [x] Hide
        - [ ] Support onClick
    - [ ] Popups
- [x] Extension messages listener using async function generators
- [x] Unload event
- [x] Unit tests
### web

WIP = Work in progress, aka exists but is not finished

- [ ] Make a web-based filesystem explorer component (WIP)
- [ ] Make the JSON RPC & WebSockets TypeScript client a separate library
- [ ] Make the popup module (WIP)
- [ ] Add file icons support (WIP)
- [ ] Configure CodeMirror properly (WIP)
- [ ] Create a settings tab (WIP)
- [x] Add a custom hook to easily open a tab 
- [ ] Experimental LSP support (https://github.com/FurqanSoftware/codemirror-languageserver) (WIP)
- [x] Ability to create multiple panels
- [ ] Avoid use recoil-nexus
### server
- [ ] Use JSON Web Woken
