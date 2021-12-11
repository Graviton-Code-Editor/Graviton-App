# Introduction
Gravitons is a modularized code editor, meaning that the different modules can be used together to build different kind of editors. By design, it's a frontend-agnostic editor, so different frontends, even in different languages, can be built on it.

**WIP**

Modules:
- Core: The backend
- Core-api: A set of APIs for extensions to use (WIP)
- Web: A web-based frontend implementation
- Desktop: A webview-based app that handles running the core and the web frontend

## Core
A Core instance handles the states and extensions, it needs also needs of a transport layer.
Learn more in [Core](./core.md)

### Transport layer
There are two transport layers that are included by default, a JSON HTTP RPC Server + WebSockets server, and a Local JSON RPC Server + MPSC channels.

Both JSON RPC Servers included several methods client can use to interact with a state, like reading a file from a filesystem. And the WebSockets and MPSC channels are mainly used to send messages from the core to the client.

## Authentication
The core manages the authentication of frontends through tokens. These token allow access to the states on Core, frontends must know what token they need to make of use of an specific state. For example, since the desktop version uses a the Local JSON RPC Server, it already knows what the token is, but in a case where the core is in a remote machine, you might not know it.

