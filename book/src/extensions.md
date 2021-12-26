# Extensions
Graviton extensions are [Shared Libraries (or Dynamic Libraries)](https://en.wikipedia.org/wiki/Library_(computing)#Shared_libraries). This means, that they need to be build for every OS that Graviton runs in. 

A extension has a public function called `entry`, this method is used to create the extension runtime. 

Example:
```rust
// * `manager`   - Manages the extension's runtimes
// * `sender`    - A tokio's mpsc sender that points to the core server
// * `state_id`  - The ID of the state in which this extension was loaded in
#[no_mangle]
pub fn entry(manager: &mut ExtensionsManager, sender: AsyncSender<Messages>, state_id: u8) {
    manager.register(parent_id, extension); // This method should register the runtime of your extension
}
```

But, what exactly is the runtime of the extension?

Example:
```rust
// This defines what data will hold my extension's runtime
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

    // This is the entrypoint of your extension's runtime, when it loads up, this method will be called
    fn init(&mut self) {
        
    }

    // This method will be called for every message sent to the core
    // This could maybe react somehow on some type of message, like, the client opened a folder
    fn notify(&mut self, _message: ExtensionMessages) {
        
    }
}
```

Now the entry function would look like something like this:

```rust
// * `manager`   - Manages the extension's runtimes
// * `sender`    - A tokio's mpsc sender that points to the core server
// * `state_id`  - The ID of the state in which this extension was loaded in
#[no_mangle]
pub fn entry(manager: &mut ExtensionsManager, sender: AsyncSender<Messages>, state_id: u8) {
    // Create an Extension's runtime
    let extension = Extension {
        whatever_internal_state: 10
    };
    // Register the extension's runtime
    manager.register(parent_id, extension); 
}