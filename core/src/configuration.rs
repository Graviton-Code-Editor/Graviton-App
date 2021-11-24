use jsonrpc_http_server::{AccessControlAllowOrigin, DomainsValidation};


pub struct Configuration {
    pub json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>
}

impl Configuration {
    pub fn new(json_rpc_http_cors: DomainsValidation<AccessControlAllowOrigin>) -> Self {
        Self {
            json_rpc_http_cors
        }
    }
}
