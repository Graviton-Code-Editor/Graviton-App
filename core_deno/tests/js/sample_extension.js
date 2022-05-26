const send = () => {
    Graviton.send({
        ServerMessage: {
            msg_type: "ShowPopup",
            state_id: 0,
            popup_id: "...",
            content: "...",
            title: "...",
        }
    })
}

Graviton.listenTo("listDir").then(() => send())

Graviton.whenUnload().then(async () => {
    await send();
    await Graviton.exit()
})

send()



