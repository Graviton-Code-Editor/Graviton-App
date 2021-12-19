### ideas
- Implement frontend-only extensions (through the Core ?)
- Move the built-in transport handlers from the `core` crate into their own crate

# core / core_api
- [x] Make use of the native (OS-builtin) filesystem explorer to open folder and files
- [ ] Also return the language codename or "unknown" when reading a file in the Core
- [ ] Implement a workspace system
- [ ] Implement a frontend-agnostic theme standard
- [ ] Document the Core JSON RPC and WebSockets API
- [x] Think about using CORS to maximize security of Core
- [x] Setup CI
- [ ] Setup CD (daily beta releases)
- [ ] State shouldn't have a global `opened_tabs` array but insted opened_tabs per folder
- [x] Implement  ExtensionMessages
- [ ] Make a Popup builder
- [ ] Ability to close a popup from the extension
- [ ] Random ID generator for the popup id
- [ ] Ability to listen on core messages from any extension (tokio::sync::broadcast might be useful)
- [ ] Build git extension with `--release` when building the binary / installer
- [ ] Document all what needs to be documented in the book
- [ ] Make Graviton web decide what editor should be opened depending on the file format

### web
- [ ] Make a web-based filesystem explorer component
- [ ] Make the JSON RPC & WebSockets TypeScript client a separate library
- [ ] Make the popup module, WIP

### web_components
- [ ] Make some useful components of the web-based frontend as a React library