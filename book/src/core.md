# Core

The `Server` is the engine that handles all the states and extensions. In order for clients to communicate to it, it needs to make use of a transport handler.

### Authentication
The `server` manages the authentication of frontends through tokens. These token allow access to the states on Core, frontends must know what token they need, to make of use of an specific state. For example, since the desktop version uses a the `Local` handler, it already knows what the token is, but in a case where the core is in a remote machine, you might not know it.


Learn more:
- [Transports handlers](./transports.md)
- [State](./state.md)