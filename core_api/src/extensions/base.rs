/// Extensions structure
pub trait Extension {
    /// Init method of the extension
    /// This will be called when the extension is loaded
    fn init(&mut self);
}
