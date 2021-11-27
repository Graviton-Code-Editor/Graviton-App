# Building 🧰

## Graviton Desktop
Requisites:
- nodejs + npm ([`https://nodejs.org`](https://nodejs.org))
- cargo ([`https://www.rust-lang.org`](https://www.rust-lang.org))
- cargo-make (`cargo install cargo-make`)
- tauri cli (`cargo install tauri`)
- yarn (`npm i -g yarn`)


For developing, run:
```shell
cd Graviton-App
yarn
cargo make dev_desktop
```

To create a binary / installer, run:
```shell
cd Graviton-App
yarn
cargo make dev_desktop
```
