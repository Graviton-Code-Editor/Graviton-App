use deno_core::error::AnyError;
use deno_core::FsModuleLoader;
use deno_runtime::deno_broadcast_channel::InMemoryBroadcastChannel;
use deno_runtime::deno_web::BlobStore;
use deno_runtime::ops::io::Stdio;
use deno_runtime::permissions::Permissions;
use deno_runtime::worker::{MainWorker, WorkerOptions};
use deno_runtime::BootstrapOptions;
use gveditor_core_api::Mutex;
use std::rc::Rc;
use std::sync::Arc;

use gveditor_core_api::extensions::client::ExtensionClient;

use crate::events_manager::EventsManager;
use crate::exts::{events, statusbar_items};

// Load up the Graviton JavaScript api, aka, fancy wrapper over Deno.core.opSync/opAsync
static GRAVITON_DENO_API: &str = include_str!(concat!(env!("OUT_DIR"), "/graviton.js"));

// Launches a Deno runtime for the specified file, it also embeds the Graviton Deno API
pub async fn create_main_worker(
    main_path: &str,
    client: ExtensionClient,
    events_manager: EventsManager,
    state_id: u8,
) -> MainWorker {
    let worker_handle = Arc::new(Mutex::new(None));

    let module_loader = Rc::new(FsModuleLoader);

    let create_web_worker_cb = Arc::new(|_| {
        todo!("Web workers are not supported");
    });
    let web_worker_preload_module_cb = Arc::new(|_| {
        todo!("Web workers are not supported");
    });

    let main_module = deno_core::resolve_path(main_path).unwrap();

    let options = WorkerOptions {
        bootstrap: BootstrapOptions {
            args: vec![],
            cpu_count: 1,
            debug_flag: false,
            enable_testing_features: false,
            location: Some(main_module.clone()),
            no_color: false,
            runtime_version: "1.21.3".to_string(),
            ts_version: "4.6.2".to_string(),
            unstable: false,
            is_tty: false,
            user_agent: "graviton".to_string(),
        },
        extensions: vec![
            events::new(client.clone(), events_manager, worker_handle.clone()),
            statusbar_items::new(client, state_id),
        ],
        unsafely_ignore_certificate_errors: None,
        root_cert_store: None,
        seed: None,
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
        format_js_error_fn: None,
        source_map_getter: None,
        stdio: Stdio::default(),
    };

    // TODO(marc2332) Add ability to specify what permissions the extension should run with
    let permissions = Permissions::allow_all();

    let mut worker = MainWorker::bootstrap_from_options(main_module.clone(), permissions, options);

    // Save the worker handle
    let handle = worker.js_runtime.handle_scope().thread_safe_handle();
    worker_handle.lock().await.replace(handle);

    // Load the Graviton namespace
    worker
        .execute_script("<graviton>", GRAVITON_DENO_API)
        .unwrap();

    // Load the extension's main module
    worker.execute_main_module(&main_module).await.ok();

    worker
}

fn get_error_class_name(e: &AnyError) -> &'static str {
    deno_runtime::errors::get_error_class_name(e).unwrap_or("Error")
}
