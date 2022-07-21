use crosspty::platforms::new_pty;
use tokio::sync::mpsc::channel;

#[cfg(any(target_os = "windows"))]
#[tokio::test]
async fn boots_up() {
    let (tx, mut rx) = channel::<Vec<u8>>(1);
    let _pty = new_pty("powershell", vec![], tx);
    let res = rx.recv().await.unwrap();
    let res = String::from_utf8_lossy(&res);
    assert!(res.contains("Windows PowerShell"));
    assert!(res.contains("https://aka.ms/PSWindows"));
}
