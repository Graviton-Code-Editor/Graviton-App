# Extensions

WARNING: This is work in progress.

At the core, extensions are language-agnostic as long there are is a wrapper for the language. Extensions are written in Rust, but because of Rust nature, it  makes it difficult for developers to run their extensions in multiple platforms safely. Not FFI can avoid this. Because of this, the Graviton project maintains a wrapper around [Deno](https://deno.land/) that allows extensions to be made in JavaScript/TypeScript. Rust extensions are still used for built-in extensions.

## Deno extension

WIP :)

## Rust extension

A extension has a public function called `entry`, this method is used to create the extension runtime. 

Example:
```rust
// * `manager`   - Manages the extensions manager
// * `sender`    - A Tokio's mpsc sender that points to the core server
// * `state_id`  - The ID of the state in which this extension was loaded in
pub fn entry(manager: &mut ExtensionsManager, sender: Sender<Messages>, state_id: u8) {
    manager.register(parent_id, extension); // This method registers the instance of your extension
}
```

This is how you would define your extension structure:

```rust
// Define the data that the extension will hold
struct SampleExtension {
    whatever_internal_state: u8
};

// Every extension's runtime should implement some common methods
impl Extension for SampleExtension {
    // This needs to return the information about the extension
    fn get_info(&self) -> ExtensionInfo {
        ExtensionInfo {
            name: "SampleExtension".to_string(),
            id: "sample-extension".to_string(),
        }
    }

    // This is the entrypoint of the extension's runtime, this method will be called when it's loaded
    fn init(&mut self) {
        
    }

    // This method will be called for every message sent to the core
    // The extension might react on some message
    fn notify(&mut self, message: ExtensionMessages) {
        
    }
}
```

Now the entry function would look like something like this:

```rust
pub fn entry(manager: &mut ExtensionsManager, sender: Sender<Messages>, state_id: u8) {
    // Create an extension's instance
    let extension = Extension {
        whatever_internal_state: 10
    };
    // Register the extension's instance
    manager.register(parent_id, extension); 
}