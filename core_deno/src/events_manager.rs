use std::collections::HashMap;
use std::sync::Arc;

use gveditor_core_api::messaging::ExtensionMessages;
use tokio::sync::mpsc::error::SendError;
use tokio::sync::mpsc::Sender;
use tokio::sync::Mutex;
use uuid::Uuid;

type EventGroup = HashMap<Uuid, Sender<ExtensionMessages>>;

/**
 * Manages the events bridge from Deno to Rust
 */
#[derive(Clone, Default)]
pub struct EventsManager {
    listeners: Arc<Mutex<HashMap<String, EventGroup>>>,
}

impl EventsManager {
    pub fn new() -> Self {
        Self::default()
    }

    /**
     * Listen on an event emitted by Rust
     */
    pub async fn listen_on(
        &self,
        name: String,
        listener_id: Uuid,
        listener: Sender<ExtensionMessages>,
    ) {
        // Add event group if doesn't exist
        if !self.listeners.lock().await.contains_key(&name) {
            self.listeners
                .lock()
                .await
                .insert(name.clone(), HashMap::new());
        }

        self.listeners
            .lock()
            .await
            .get_mut(&name)
            .unwrap()
            .insert(listener_id, listener.clone());
    }

    /**
     * Remove listener by it's id
     */
    pub async fn unlisten_from(&self, name: String, listener_id: Uuid) {
        self.listeners
            .lock()
            .await
            .get_mut(&name)
            .unwrap()
            .remove(&listener_id);

        // It should also remove the event group if it's empty
    }

    /**
     * Send an event from Deno to Rust
     */
    pub async fn send(
        &self,
        message: ExtensionMessages,
    ) -> Result<(), SendError<ExtensionMessages>> {
        let name = message.get_name();
        let all_listeners = self.listeners.lock().await;
        let listeners = all_listeners.get(name);
        if let Some(listeners) = listeners {
            for listener in listeners.values() {
                listener.send(message.clone()).await?;
            }
        }
        Ok(())
    }
}
