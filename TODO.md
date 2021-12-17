### ideas
- Implement frontend-only extensions (through the Core ?)

# core / core_api
- [x] Make use of the native (OS-builtin) filesystem explorer to open folder and files
- [ ] Also return the language codename or "unknown" when reading a file in the Core
- [ ] Implement a workspace system
- [ ] Implement a frontend-agnostic theme standard
- [ ] Document the Core JSON RPC and WebSockets API
- [ ] Register a new Token::All token on the Core by passing an existing already-used (by another frontend) token, so a new frontend can make use of it (idea)
- [x] Think about using CORS to maximize security of Core
- [x] Setup CI
- [ ] Setup CD (daily beta releases)
- [ ] State shouldn't have a global `opened_tabs` array but insted opened_tabs per folder
- [ ] Implement sub variants for the `enum` Messages, like, `Messages::Module(ModuleMessages::Popup { .. })`
- [ ] Make a Popup builder
- [ ] Ability to close a popup from the extension
- [ ] Random ID generator for the popup id
- [ ] Ability to listen on core messages from any extension (tokio::sync::broadcast might be useful)

### web
- [ ] Make a web-based filesystem explorer component
- [ ] Make the JSON RPC & WebSockets TypeScript client a separate library
- [x] Make the popup module

### web_components
- [ ] Make some useful components of the web-based frontend as a React library