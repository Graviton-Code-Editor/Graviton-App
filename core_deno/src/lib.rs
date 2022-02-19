use async_trait::async_trait;
use gveditor_core_api::extensions::base::{
    Extension,
    ExtensionInfo,
};
use gveditor_core_api::extensions::client::ExtensionClient;
use gveditor_core_api::extensions::manager::{
    ExtensionsManager,
    LoadedExtension,
};
use gveditor_core_api::messaging::ExtensionMessages;

/// DenoExtension is a wrapper around Graviton extension api that makes use of deno_runtime to execute the extensions
#[allow(dead_code)]
struct DenoExtension {
    location: String,
    info: ExtensionInfo,
    client: ExtensionClient,
    state_id: u8,
}

impl DenoExtension {
    pub fn new(path: &str, info: ExtensionInfo, client: ExtensionClient, state_id: u8) -> Self {
        Self {
            location: path.to_string(),
            info,
            client,
            state_id,
        }
    }
}

impl Extension for DenoExtension {
    fn init(&mut self) {}

    fn notify(&mut self, _message: ExtensionMessages) {}

    fn get_info(&self) -> ExtensionInfo {
        self.info.clone()
    }
}

/// Add support for a special method that allows core invokers to execute Deno extensions
#[async_trait]
pub trait DenoExtensionSupport {
    async fn load_extension_with_deno(
        &mut self,
        path: &str,
        info: ExtensionInfo,
        state_id: u8,
    ) -> &mut ExtensionsManager;
}

#[async_trait]
impl DenoExtensionSupport for ExtensionsManager {
    async fn load_extension_with_deno(
        &mut self,
        path: &str,
        info: ExtensionInfo,
        state_id: u8,
    ) -> &mut ExtensionsManager {
        let client = ExtensionClient::new(&info.name, self.sender.clone());
        let deno_extension = Box::new(DenoExtension::new(path, info.clone(), client, state_id));
        self.register(&info.id, deno_extension);
        self.extensions
            .push(LoadedExtension::ManifestBuiltin { info });
        self
    }
}
