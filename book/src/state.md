# State
A `state` is basically a unity of configuration, like a profile. A core can have multiple states loaded, that's up to the developer. For example, the desktop only uses one state at the moment. There might be some cases like where you want to have different and isolated configurations, maybe in a remote Core, where this might be useful.

The states which are saved in the Core's host machine, should be in sync with the frontends in order to avoid losing data if it ever lost the connection.