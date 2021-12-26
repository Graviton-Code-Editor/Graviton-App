❗ This book and general development is WIP ❗

# Introduction
_Note: This book is written for developers._


**Graviton** is a modularized code editor, meaning that the different modules can be used together to build different kind of editors.

 By design, it's frontend-agnostic, so different frontends (clients), even in different languages, can be built on it.

Modules:
- `core`: The backend engine
- `core-api`: A set of APIs for extensions to use
- `web`: A web-based frontend implementation
- `web-components`: A set of React Components used in Graviton to be used elsewhere
- `languages`: All the translations as NPM package
- `Graviton Desktop`: A webview-based app that handles running the core and the web frontend
- `Graviton Server`: A cli launcher for a Graviton HTTP Core + serving the web-based frontend

Learn more:
- [Building](./building.md)
- [Extensions](./extensions.md)
- [Core](./core.md)
