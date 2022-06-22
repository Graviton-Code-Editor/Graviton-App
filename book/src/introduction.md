❗ This book is WIP ❗

# Introduction

**Graviton** is a modularized and composable code editor, meaning that the different modules can be used to build other editors, with for example, a different frontend.

Modules:
- [`core`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/core): Graviton core engine
- [`core_api`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/core_api): Shared API for core and extensions
- [`core_deno`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/core_deno): [Deno](https://deno.land/) Deno runtime for Graviton extensions
- [`web`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/web): A web-based frontend implementation
- [`languages`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/languages): All the translations as NPM package
- [`desktop`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/desktop): A desktop client for Graviton, powered by [Tauri](https://tauri.studio/)
- [`server`](https://github.com/Graviton-Code-Editor/Graviton-App/tree/main/server): A remote server for Graviton, **unsecure for now**

Learn more:
- [Building](./building.md)
