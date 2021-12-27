# Building 🧰

## Graviton Desktop
Requisites:
- nodejs + npm ([`https://nodejs.org`](https://nodejs.org))
- cargo (**nightly** channel) ([`https://www.rust-lang.org`](https://www.rust-lang.org))
- tauri cli (`cargo install tauri-cli --git https://github.com/tauri-apps/tauri --branch next`)
- yarn (`npm i -g yarn`)

Installing dependencies:
```shell
cd Graviton-App
yarn
```

For developing, run:
```shell
yarn dev_desktop
```

To create a binary / installer, run:
```shell
yarn build_desktop
```

To run automated tests:
```shell
yarn test
```
