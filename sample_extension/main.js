const item = await Graviton.crateStatusbarItem("Click me!");

await item.show();

item.onClick(() => {
    item.setLabel(Math.random().toString())
})

Graviton.whenUnload().then(() => Graviton.exit())