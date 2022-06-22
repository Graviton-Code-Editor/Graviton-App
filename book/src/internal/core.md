# 🏗️ Core

Graviton is frontend agnostic editor, which means that it's Core can be re-used to build other Editors with different frontend implementations. 

The Core provides a set of components as a base:

- [State](#state)
- [Filesystems](#filesystem)
- [Extensions](#extensions)
- [Basic Modules (Statusbar items, Popups)](#modules)

### State
A [**State**](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/core_api/src/states/state), identified by an ID, is a piece of data that holds the current state of the editor, like opened **Tabs** or configured **Hotkeys**.

They can be persisted if a State Persistor is provided, like a [**File Persistor**](https://github.com/Graviton-Code-Editor/Graviton-App/blob/main/core_api/src/state_persistors/file.rs) or a [**Memory Persistor**](https://github.com/Graviton-Code-Editor/Graviton-App/blob/main/core_api/src/state_persistors/memory.rs).

#### Use Case
In a situation like a desktop code editor, it doesn't make sense to hold multiple States. That's why The Desktop client only uses one. But, using Graviton as a remote service it might make sense to hold multiple states, plus an authentication system.

### Filesystem
States can also load any kind of FileSystem implementation, this makes the work easier for the frontends.

**Examples**:
- [Local FS](https://github.com/Graviton-Code-Editor/Graviton-App/blob/main/core_api/src/filesystems/local.rs)

### Extensions
Extensions are written in Rust. But bindings to other languages can be done, like [`core_deno`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/core_deno) which allows JavaScript/TypeScript extensions to be executed.

**Examples**:
- [Git](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/extensions/git)



### Modules
These set of basic modules are small abstraction over common UI widgets.

Examples
- [StatusBarItem](https://github.com/Graviton-Code-Editor/Graviton-App/blob/main/core_api/src/extensions/modules/statusbar_item.rs)
- [Popup](https://github.com/Graviton-Code-Editor/Graviton-App/blob/main/core_api/src/extensions/modules/popup.rs)