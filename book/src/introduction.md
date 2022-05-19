❗ This book is WIP ❗

# Introduction

**Graviton** is a modularized and composable code editor, meaning that the different modules can be used to build other editors, with for example, a different frontend.

Modules:
- `core`: The backend engine
- `core_api`: A set of APIs for extensions to use
- `core_deno`: [Deno](https://deno.land/) runtime for third-party extension
- `web`: A web-based frontend implementation
- `languages`: All the translations as NPM package
- `desktop`: A desktop client for Graviton, powered by [Tauri](https://tauri.studio/)
- `server`: A remote server for Graviton, **unsecure for now**

Learn more:
- [Building](./building.md)
