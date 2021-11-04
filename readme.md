# Graviton Rewrite

The main idea behind this possible rewrite is to have different re-usable modules which can be used to build different types of Graviton Instances. I think that it will  highly improve the scalability, maintainability and make it easier for people to contribute to. Also, I need to make an effort to make a better documentation.

There will not be any more NodeJS (except for developing purposes such as using NPM) or ElectronJS. 
Instead, there will be a backend written in Rust and then frontends that will communicate to the backend. These frontends could be written in any language that supports HTTP requests and WebSockets connections.

The modules would be something like:
- Graviton Core Library: the backend that would ultimately be used to access the filesystem, run processes, etc...
- Graviton Core CLI: A cli to easily run a Graviton Core as a service
- Graviton Web: A web-based frontend implementation that would connect to a Graviton Core
- Graviton Desktop: Graviton Core Library + Graviton Web, a desktop version that would ship the backend and the web frontend through for example a webview (tauri).
- Graviton Server: A service that would run a Graviton Core and host a Graviton Web in an HTTP server

## Graviton Core
Graviton core will be written in Rust for speed and safety. It will have a JSON RPC HTTP server for normal method calls and a WebSockets server to emit events from the core to the connected frontends.

It will also persist all the frontend states, so they could reconnect and still have the previous session as it was.

### Example situation
There could be a Graviton Core service running in a server and multiple frontends that could connect to it as if it was in the same machine. This would be like connecting to an external machine but with zero overhead, because that's how it already works.

### Piece table
It would be great to have a `Piece Table` system where changes could be tracked and then when saving a file from a frontend, instead of sending the whole new file to the core, the changes from the `piece table` would be sent. And then, in the Core, properly apply the received `piece table` to the original file. This will make it faster when communicating the Core and the frontend with large files.

More about `Piece table`:
- https://gaetgu.github.io/org/2021-11-03-Text%20Editors:%20Part%20One.html by @gaetgu
- https://darrenburns.net/posts/piece-table/

## Graviton Web
This will be written in React ;)

## Graviton Extensions
All extensions would be installed in the Graviton Core and loaded in the corresponding frontend state in the backend. Extensions would make use of an API that has the ability to create widgets / components that they are then interpreted into the corresponding frontend. So there is no need to every frontend load the extension itself, and therefore, it only needs to support the API.

## Running
Run a core:
```rust
cargo run --example demo
```

Run the web:
```rust
yarn dev
```

wip.