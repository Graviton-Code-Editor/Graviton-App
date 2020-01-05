
function loadKeyshortcuts(){

    const { shortcutJS } = require("shortcutjs");
    
    const shorcuts = graviton.getConfiguration().shortCuts

    function isCorrect(shortcuts){
        let error = false;
        try{    
            shortcutJS.loadFromJson(shorcuts,{
                debug: false,
            })
        }catch{
            error = true
            
        }
        return !error
    }
    
    function init(shortcuts,callback = ()=>{}){
        if(!isCorrect(shortcuts)) {
            new Notification({
                title:"Issue",
                content:"Key binds are not well configured."
            })
            return;
        }
        shortcutJS.loadFromJson(shorcuts,{
            debug: false,
        })
        shortcutJS.subscribe('Save File', ev => graviton.saveFile())
        shortcutJS.subscribe('Split screen', ev => screens.add())
        shortcutJS.subscribe('Close screen', ev => screens.remove(current_screen.id))
        shortcutJS.subscribe('Zen Mode', ev => graviton.toggleZenMode())
        shortcutJS.subscribe('Open terminal', ev => {
            if (terminal != null) {
                commanders.show(terminal.id)
                return
            }
            commanders.terminal()
        })
        shortcutJS.subscribe('Close terminal', ev => commanders.closeTerminal())
        shortcutJS.subscribe('Hide terminal', ev =>{
            if (terminal != null) {
                commanders.hide(terminal.id)
            }
        })
        shortcutJS.subscribe('Fullscreen', ev => graviton.toggleFullScreen())
        shortcutJS.subscribe('Menu bar', ev => graviton.toggleMenus())
        shortcutJS.subscribe('Commander', ev => GravitonCommander.open())
        shortcutJS.subscribe('Close all windows', ev => graviton.cancelPrompts())
        shortcutJS.subscribe('Switch tabs', ev => GravitonCommander.trigger("Switch tabs"))
        callback()
    }
    init(shorcuts)

    GravitonState.on("KeyShortCutsChanged",function(newShortCuts){
        shortcutJS.reset()
        init(newShortCuts)
        GravitonState.emit("ConfigurationChanged")
    })
}

module.exports = loadKeyshortcuts