# Transport
The core itself, is transport-agnostic. That means that all the messages from the clients can be sent to any transport handler that implements the trait `TransportHandler`. 

To facilitate, the `core` crate provides two possible transport handlers:

- Local
- HTTP (with WebSockets)
#### Local
This is used when you use the Core in the same process as your frontend, like a desktop editor or a terminal-based editor.

#### HTTP
This is handy for situations where the Core is being executed in a remote server. JSON RPC calls are sent via HTTP and bidirectional messages are sent through WebSockets.

As said before, these two handlers are optional, so, third-party transport handlers can be used.
