# Building 🧰

## Graviton Desktop
Requisites:
- nodejs + npm ([`https://nodejs.org`](https://nodejs.org))
- cargo (**stable** channel) ([`https://www.rust-lang.org`](https://www.rust-lang.org))
- tauri cli (`cargo install tauri-cli --version 1.0.0-rc.10`)
- tauri os-specific dependencies (See [this](https://tauri.studio/v1/guides/getting-started/prerequisites/#installing))
- pnpm (`npm i -g pnpm`)
- deno (See [this](https://deno.land/#installation))
- (Optional, just for tests): [nextest](https://nexte.st/) (`cargo install cargo-nextest`)

Installing dependencies:
```shell
cd Graviton-App
pnpm install
```

To develop, run:
```shell
pnpm run dev_desktop
```

To create a binary / installer, run:
```shell
pnpm run build_desktop
```

To run automated tests:
```shell
pnpm test
```

To lint all the code:
```shell
pnpm run lint
```


To format all the code:
```shell
pnpm run format
```
