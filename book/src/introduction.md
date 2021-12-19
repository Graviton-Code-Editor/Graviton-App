# Introduction
Gravitons is a modularized code editor, meaning that the different modules can be used together to build different kind of editors. By design, it's frontend-agnostic, so different frontends (clients), even in different languages, can be built on it.

Modules:
- `core`: The backend engine
- `core-api`: A set of APIs for extensions to use
- `web`: A web-based frontend implementation
- `web-components`: A set of React Components used in Graviton to be used elsewhere
- `languages`: All the translations as NPM package
- Graviton Desktop: A webview-based app that handles running the core and the web frontend
- Graviton Server: A cli launcher for a Graviton HTTP Core + serving the web-based frontend

⚠ All these are WIP. ⚠

## core
The `core` is the engine that handles all the states and extensions. In order for clients to communicate to it, it needs to make use of a transport handler.
Learn more in [Core](./core.md)
### Authentication
The `core` manages the authentication of frontends through tokens. These token allow access to the states on Core, frontends must know what token they need, to make of use of an specific state. For example, since the desktop version uses a the `Local` handler, it already knows what the token is, but in a case where the core is in a remote machine, you might not know it.

