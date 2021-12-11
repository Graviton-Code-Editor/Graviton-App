# Core

The core is the backend engine of Graviton, it handles all the states and extensions. In a normal situation it would be used by clients through a transport layer.

The core itself, is transport-agnostic. That means that all the messages fro n the cliens can be sent through any transport that implements the trait `TransportHandler`. The Core crate provides two possible transport handlers:

### Local
This is used when you use the Core in the same process as your back, like a desktop editor or a terminal-based editor.

### HTTP
This is handy for situations when the Core is being executed in a remote server. All the messages are sent via HTTP and WebSockets.

Third-party transport handlers can be created.