use gveditor_core_api::Extension;

struct GitExtension {
    state: Option<u8>,
}

impl Extension for GitExtension {
    fn init(&mut self) {
        self.state = Some(1);
        println!("Hey ! {:?}", self.state);
    }
}

#[allow(improper_ctypes_definitions)]
#[no_mangle]
pub extern "C" fn main() -> Box<dyn Extension> {
    Box::new(GitExtension { state: None })
}
