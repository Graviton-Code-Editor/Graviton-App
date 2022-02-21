# Building 🧰

## Graviton Desktop
Requisites:
- nodejs + npm ([`https://nodejs.org`](https://nodejs.org))
- cargo (**nightly** channel) ([`https://www.rust-lang.org`](https://www.rust-lang.org))
- tauri cli (`cargo install tauri-cli --git https://github.com/tauri-apps/tauri --branch next`)
- tauri os-specific dependencies (See [this](https://tauri.studio/docs/getting-started/prerequisites/))
- yarn (`npm i -g yarn`)
- (Optional, just for tests): [nextest](https://nexte.st/) (`cargo install cargo-nextest`)

Installing dependencies:
```shell
cd Graviton-App
yarn
```

To develop, run:
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

To lint all the code:
```shell
yarn lint
```
