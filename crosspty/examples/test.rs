use std::io::{Read, Write, BufReader, stdout};

fn main() {
    let proc = conpty::spawn("powershell").unwrap();
    let mut writer = proc.input().unwrap();
    let reader = proc.output().unwrap();
    let r = BufReader::new(reader);

    println!("Process has pid={}", proc.pid());

    writer.write_all("echo hi".as_bytes()).unwrap();

    for a in r.bytes() {
        print!("{}", String::from_utf8_lossy(&[a.unwrap()]));
        stdout().flush().unwrap();
    }
}