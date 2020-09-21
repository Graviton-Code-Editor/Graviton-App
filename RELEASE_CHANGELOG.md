### 🔝 Important changes

- LSP integration
- Improved Workspaces
- Iconpacks support
- New translated languages

### ✔ Changes

- Menu bar is now native in MacOS and GNU/Linux distributions
- General UI improvements
- Remove projects from the log
- Tabs show file's icon
- Added support for new languages:
  - F#
  - Lua
  - Shell
  - Less
  - Golang
- Added an smooth cursor plugin built-in
- Improved NPM inspector
- New shortcuts:
  - Ctrl+Q: closes the app (Only in MacOS by default)
- Notifications sent by plugins will not indicate who were they sent from
- Smoother animations when opening windows, dialogs, or items in the explorer panel
- Improved NPM Project Inspector

### 😁 Fixes

- Fixed command prompt's size when it's overflowing
- NPM Project service will now notify you if the opened folder doesn't have a valid name.

### 🤓 Core

- Using Emotion instead of PuffinStyle
- Slowly moving from JavaScript to TypeScript
- Using webpack instead of parcel
- Added Unit tests
- Updated to Electron v10
- Added a ExplorerProvider API, which could allow Graviton to access, read and modify other FileSystems rather than the local of the machine.
