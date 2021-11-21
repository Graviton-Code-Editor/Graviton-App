# Introduction
Gravitons is a modularized code editor, meaning that the different modules can be used together to build different kind of editors. By design, it's a frontend-agnostic editor, so multiple frontends can be built on it.

**WIP**

Modules:
- Core: The backend
- Web: A web-based frontend implementation
- Desktop: A webview-based app that handles running the core and the web frontend
- Cli: a CLI to easily launch and manage a core instance )

## Core
The core is a Rust crate that:
- Opens a JSON RPC HTTP Server 
- Opens a WebSockets server
- Loads and save states
- Runs extensions (wip)
- Manage authentication

### JSON RPC Server
This is a JSON RPC server that frontends can use to execute remote procedures, like, reading a file through a filesystem implementation, mutate a state, load a state, etc...

### WebSockets server
This is mainly used for the Core to notify of certains events to all frontends who are listening. 

## Authentication
The core manages the authentication of frontends through tokens. These token allow access to the states on Core, frontends must know what token they need to make of use of an specific state. 

For frontends running on the same machine, they can get a token that will allow them to make use of a "default" state, in the file `$HOME/graviton_local_token`. This protects it against for example, websites you access through your browser, because they don't know the token of any state. For example, the desktop-web version made with Tauri passes the generated token through a command invocation to the web frontend.
