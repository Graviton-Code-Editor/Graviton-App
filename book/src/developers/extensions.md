# Extensions

## Introduction

Third-party extensions run in a sandboxed JavaScript environment. Powered by a embedded runtime of [Deno](https://deno.land/). 

They are loaded pn startup from a specific folder of the user's system:

| Name    | Description                   |
|---------|-------------------------------|
| Windows | $HOME\\.graviton\\extensions  |
| Linux   | $USER/.graviton/extensions    |
| MacOS   | $USER/.graviton/extensions    |

## Creating a basic extension

Let's create a folder in our `.graviton/extensions` and go inside it:

```bash
mkdir my_extension
cd my_extension
```

Then, we need to create a manifest file called `Graviton.toml` in [TOML](https://toml.io/en/), this file contains some identification and description metadata about the extension.

```toml
[extension]
name = "My Extension"
id = "my-extension"
author = "Jack Sparrow"
version = "0.1.0"
repository = "https://github.com/JackSparrow/graviton-extension"
main = "main.js"
```

And finally, we need to create the entrypoint of our extension that will be run by Graviton, let's name it `main.js`, as we specified above in the manifest file:

```js
const item = await Graviton.crateStatusbarItem("Click me!");

await item.show();

item.onClick(() => {
    item.setLabel("You clicked me!")
})

Graviton.whenUnload().then(() => Graviton.exit())
```

Now open Graviton and you should see a new statusbar item with the text "Click me!". For each change you make you will need to reload Graviton as it doesn't provide hot reloading, yet.
