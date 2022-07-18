use tokio::sync::mpsc::Sender;

use crate::Pty;

#[cfg(any(target_os = "windows"))]
pub mod win;

#[cfg(not(windows))]
pub mod unix;

// TODO(marc2332): Add a size parameter

pub fn new_pty(
    command: &str,
    args: Vec<&str>,
    sender: Sender<Vec<u8>>,
) -> Box<dyn Pty + Send + Sync> {
    #[cfg(any(target_os = "windows"))]
    return Box::new(win::PtyWin::new(command, args, sender));

    #[cfg(not(windows))]
    return Box::new(unix::PtyUnix::new());
}
