# Building 🧰

## Graviton Desktop
Requisites:
- nodejs + npm ([`https://nodejs.org`](https://nodejs.org))
- cargo (**nightly** channel) ([`https://www.rust-lang.org`](https://www.rust-lang.org))
- tauri cli (`cargo install tauri-cli --version ^1.0.0-beta`)
- yarn (`npm i -g yarn`)


For developing, run:
```shell
cd Graviton-App
yarn
yarn dev_desktop
```

To create a binary / installer, run:
```shell
cd Graviton-App
yarn
yarn build_desktop
```
