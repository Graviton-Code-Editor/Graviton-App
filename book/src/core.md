# Core

The `core` is the engine that handles all the states and extensions. In order for clients to communicate to it, it needs to make use of a transport handler.

The core itself, is transport-agnostic. That means that all the messages from the clients can be sent to any transport handler that implements the trait `TransportHandler`. 
To facilitate, the `core` crate provides two possible transport handlers:

### Local
This is used when you use the Core in the same process as your back, like a desktop editor or a terminal-based editor.

### HTTP
This is handy for situations when the Core is being executed in a remote server. All the messages are sent via HTTP and WebSockets.

Third-party transport handlers can be created.