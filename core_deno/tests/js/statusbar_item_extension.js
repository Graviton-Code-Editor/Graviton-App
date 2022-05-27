const item = await Graviton.crateStatusbarItem("test");
item.onClick(async () => {
    await item.hide();
})
await item.show();
