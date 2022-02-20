use deno_core::error::AnyError;
use deno_core::FsModuleLoader;
use deno_runtime::deno_broadcast_channel::InMemoryBroadcastChannel;
use deno_runtime::deno_web::BlobStore;
use deno_runtime::permissions::Permissions;
use deno_runtime::worker::{
    MainWorker,
    WorkerOptions,
};
use deno_runtime::BootstrapOptions;
use std::rc::Rc;
use std::sync::Arc;

use gveditor_core_api::extensions::client::ExtensionClient;

use crate::worker_extension;

static GRAVITON_DENO_API: &str =
    include_str!(concat!(env!("CARGO_MANIFEST_DIR"), "/src/graviton.js"));

pub async fn create_main_worker(main_path: &str, client: ExtensionClient) {
    let module_loader = Rc::new(FsModuleLoader);

    let create_web_worker_cb = Arc::new(|_| {
        todo!("Web workers are not supported in the example");
    });
    let web_worker_preload_module_cb = Arc::new(|_| {
        todo!("Web workers are not supported in the example");
    });

    let options = WorkerOptions {
        bootstrap: BootstrapOptions {
            apply_source_maps: false,
            args: vec![],
            cpu_count: 1,
            debug_flag: false,
            enable_testing_features: false,
            location: None,
            no_color: false,
            runtime_version: "x".to_string(),
            ts_version: "x".to_string(),
            unstable: false,
        },
        extensions: vec![worker_extension::new(client)],
        unsafely_ignore_certificate_errors: None,
        root_cert_store: None,
        user_agent: "graviton".to_string(),
        seed: None,
        js_error_create_fn: None,
        web_worker_preload_module_cb,
        create_web_worker_cb,
        maybe_inspector_server: None,
        should_break_on_first_statement: false,
        module_loader,
        get_error_class_fn: Some(&get_error_class_name),
        origin_storage_dir: None,
        blob_store: BlobStore::default(),
        broadcast_channel: InMemoryBroadcastChannel::default(),
        shared_array_buffer_store: None,
        compiled_wasm_module_store: None,
    };

    let main_module = deno_core::resolve_path(main_path).unwrap();
    let permissions = Permissions::allow_all();

    let mut worker = MainWorker::bootstrap_from_options(main_module.clone(), permissions, options);

    // Load the Graviton namespace
    worker
        .execute_script("<graviton>", GRAVITON_DENO_API)
        .unwrap();

    // Load the extension's main module
    worker.execute_main_module(&main_module).await.unwrap();

    worker.run_event_loop(false).await.unwrap();
}

fn get_error_class_name(e: &AnyError) -> &'static str {
    deno_runtime::errors::get_error_class_name(e).unwrap_or("Error")
}
