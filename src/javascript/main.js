/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/

"use strict"

const g_version = {
    date: "190822",
    version: "1.1.0",
    state: "Beta"
};
const os = require("os"),
    {
        shell
    } = require("electron"),
    fs = require("fs-extra"),
    {
        dialog
    } = require("electron").remote,
    remote = require("electron").remote,
    BrowserWindow = require("electron").BrowserWindow,
    app = require("electron").remote,
    getAppDataPath = require("appdata-path"),
    {
        webFrame
    } = require("electron"),
    g_window = require("electron").remote.getCurrentWindow(),
    {
        systemPreferences
    } = require("electron").remote,
    url = require("url"),
    marked = require("marked"),
    fit = require("./node_modules/xterm/lib/addons/fit/fit.js"),
    CodeMirror = require("codemirror"),
    semver = require("semver");

require(path.join(__dirname, 'src', 'javascript', 'api', 'codemirror-langs.js')).langs() //Load CodeMirror files
const { loadLanguage, getTranslation } = require(path.join(__dirname, 'src', 'javascript', 'api', 'languages.js'));
const { getFormat, getLanguageName, updateCodeMode } = require(path.join(__dirname, 'src', 'javascript', 'api', 'format.js'));
const screens = require(path.join(__dirname, 'src', 'javascript', 'api', 'screens.js'));
const updater = require(path.join(__dirname, 'src', 'javascript', 'api', 'updater.js'));
graviton.setTheme = require(path.join(__dirname, "src", "javascript", "api", "theming.js")).setTheme;

let current_screen,
    dir_path,
    i,
    b,
    DataFolderDir = path.join(path.join(__dirname, ".."), ".graviton"),
    tabs = [],
    FirstFolder = null,
    editingTab,
    plang = "",
    _notifications = [],
    filepath = null,
    editors = [],
    editor,
    editorID,
    editor_mode = "normal",
    g_highlighting = "activated",
    log = [],
    themes = [],
    themeObject = {
        colors: {
            accentColor: getComputedStyle(document.documentElement).getPropertyValue(
                "--accentColor"
            ),
            accentLightColor: getComputedStyle(
                document.documentElement
            ).getPropertyValue("--accentLightColor"),
            accentDarkColor: getComputedStyle(
                document.documentElement
            ).getPropertyValue("--accentDarkColor")
        }
    },
    new_update = false,
    mouseClicked = false,
    touchingResizerValue = false,
    editor_screens = [],
    languages = [],
    dictionary = autocomplete,
    Mousetrap = require('mousetrap');

let templates = {};

if (graviton.isProduction()) {
    DataFolderDir = path.join(getAppDataPath(), ".graviton");
}

if (!fs.existsSync(DataFolderDir)) fs.mkdirSync(DataFolderDir); // Create .graviton if it doesn't exist

/* Set path for graviton's files and dirs */
let logDir = path.join(DataFolderDir, "log.json"),
    configDir = path.join(DataFolderDir, "config.json"),
    plugins_folder = path.join(DataFolderDir, "plugins"),
    plugins_db = path.join(DataFolderDir, "plugins_db"),
    market_file = path.join(DataFolderDir, "market.json");

document.addEventListener(
    "mousedown",
    function(event) {
        if (event.which) mouseClicked = true;
    },
    true
);

document.addEventListener(
    "mouseup",
    function(event) {
        if (event.which) mouseClicked = false;
    },
    true
);
document.addEventListener(
    "mousemove",
    function(event) {
        if (mouseClicked && touchingResizerValue) {
            const explorer = document.getElementById("explorer_app");
            explorer.style = `width: ${event.clientX - 3}px`;
            for (i = 0; i < editors.length; i++) {
                editors[i].object.blur()
            }
            graviton.resizeTerminals();
        }
    },
    true
);

window.onload = function() {
    fs.readdir(path.join(__dirname, "src", "javascript", "templates"), (err, paths) => {
        let temporal_count = 0;
        paths.forEach((dir,index) => {
            fs.readFile(path.join(__dirname, "src", "javascript", "templates", dir), "utf8", function(
                err,
                data
            ) {
                templates[path.basename(dir, ".html")] = data;
                temporal_count++;
                if(temporal_count == paths.length){
                  fs.readdir(path.join(__dirname, "languages"), (err, paths) => {
                    paths.forEach(dir => {
                        fs.readFile(path.join(__dirname, "languages", dir), "utf8", function(
                            err,
                            data
                        ) {
                            if (err) throw err;
                            try {
                                JSON.parse(data);
                            } catch {
                                return;
                            }
                            languages.push(JSON.parse(data)); // Push the language
                            if (languages.length === paths.length) {
                                graviton.loadControlButtons();
                                loadConfig();
                                graviton.consoleInfo("Templates has been loaded.")
                            }
                        });
                    });
                });
                }
                
            });
        });
    });
}

graviton.setTitle(`v${g_version.version}`); //Initial title
const loadEditor = info => {
    if (
        document.getElementById(info.dir.replace(/\\/g, "") + "_editor") ==
        undefined
    ) {
        switch (info.type) {
            case "text":
                const text_container = document.createElement("div");
                text_container.classList = "code-space";
                text_container.setAttribute(
                    "id",
                    info.dir.replace(/\\/g, "") + "_editor"
                );
                text_container.setAttribute("path", info.dir);
                document
                    .getElementById(current_screen.id)
                    .children[1].appendChild(text_container);
                let codemirror = CodeMirror(
                    document.getElementById(text_container.id), {
                        value: info.data,
                        mode: "text/plain",
                        htmlMode: false,
                        theme: themeObject["highlight"] != undefined ?
                            themeObject["highlight"] : "default",
                        lineNumbers: true,
                        autoCloseTags: true,
                        indentUnit: 2,
                        id: info.dir,
                        screen: info.screen,
                        styleActiveLine: true,
                        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                        lineWrapping: current_config["lineWrappingPreferences"] == "activated"

                    }
                );
                codemirror.focus()
                const new_editor_text = {
                    object: text_container,
                    id: text_container.id,
                    editor: codemirror,
                    path: info.dir,
                    screen: info.screen,
                    type: info.type
                };
                codemirror.on("cursorActivity", function(a) {
                    for (i = 0; i < editor_screens.length; i++) {
                        if (editor_screens[i].id == a.options.screen) {
                            current_screen.id = a.options.screen;
                            current_screen.terminal = editor_screens[i].terminal;
                            graviton.refreshStatusBarLinesAndChars(current_screen.id)
                        }
                    }
                });
                text_container.focus();
                elasticContainer.append(text_container.children[0].children[Number(text_container.children[0].children.length - 1)])
                editors.push(new_editor_text);
                if (g_highlighting == "activated") updateCodeMode(codemirror, info.dir);
                for (i = 0; i < editors.length; i++) {
                    if (
                        editors[i].screen == info.screen &&
                        document.getElementById(editors[i].id) != null
                    ) {
                        document.getElementById(editors[i].id).style.display = "none";
                    }
                }
                text_container.addEventListener("wheel", function(e) {
                    if (e.ctrlKey) {
                        if (e.deltaY < 0) {
                            graviton.setEditorFontSize(`${Number(current_config.fontSizeEditor) + 1}`);
                        } else if (e.deltaY > 0) {
                            graviton.setEditorFontSize(`${Number(current_config.fontSizeEditor) - 1}`);
                        }
                    }
                });
                editorID = new_editor_text.id;
                editor = new_editor_text.editor;
                graviton.changeLanguageStatusBar(getLanguageName(
                    getFormat(path.basename(info.dir)).lang != "unknown" ?
                    getFormat(path.basename(info.dir)).lang :
                    path
                    .basename(info.dir)
                    .split(".")
                    .pop()
                ), info.screen);
                text_container.style.display = "block";
                codemirror.on("focus", function(a) {
                    for (i = 0; i < editors.length; i++) {
                        if (editors[i].id == a.options.id.replace(/[\\\s]/g, "") + "_editor") {
                            editor = editors[i].editor;
                            editorID = editors[i].id;
                            for (let b = 0; b < tabs.length; b++) {
                                if (
                                    tabs[b].getAttribute("screen") == editors[i].screen &&
                                    tabs[b].classList.contains("selected")
                                ) {
                                    editingTab = tabs[b].id;
                                    filepath = tabs[b].getAttribute("longpath");
                                }
                            }
                        }
                    }
                });
                graviton.refreshStatusBarLinesAndChars(info.screen)
                break;
            case "image":
                const image_container = document.createElement("div");
                image_container.classList = "code-space";
                image_container.setAttribute(
                    "id",
                    `${info.dir.replace(/\\/g, "")}_editor`
                );
                image_container.innerHTML = `<img src="${info.dir}">`;
                document
                    .getElementById(current_screen.id)
                    .children[1].appendChild(image_container);
                const new_editor_image = {
                    object: image_container,
                    id: info.dir.replace(/\\/g, "") + "_editor",
                    editor: undefined,
                    path: info.dir,
                    screen: info.screen
                };
                for (i = 0; i < editors.length; i++) {
                    if (
                        editors[i].screen == info.screen &&
                        document.getElementById(editors[i].id) != null
                    ) {
                        document.getElementById(editors[i].id).style.display = "none";
                    }
                }
                editors.push(new_editor_image);
                document.getElementById(
                    info.dir.replace(/\\/g, "") + "_editor"
                ).style.display = "block";
                editorID = new_editor_image.id;
                graviton.changeLanguageStatusBar("Image", info.screen)
                break;
            case "free":
                const free_id = "free_tab" + Math.random();
                const free_container = document.createElement("div");
                free_container.classList = "code-space";
                free_container.setAttribute(
                    "id",
                    `${info.dir.replace(/\\/g, "")}_editor`
                );
                free_container.innerHTML = info.data != undefined ? info.data : "";
                document
                    .getElementById(current_screen.id)
                    .children[1].appendChild(free_container);
                const new_editor_free = {
                    object: free_container,
                    id: info.dir.replace(/\\/g, "") + "_editor",
                    editor: null,
                    path: null,
                    screen: info.screen,
                    type: "free"
                };
                for (i = 0; i < editors.length; i++) {
                    if (
                        editors[i].screen == info.screen &&
                        document.getElementById(editors[i].id) != null
                    ) {
                        document.getElementById(editors[i].id).style.display = "none";
                    }
                }
                editors.push(new_editor_free);
                document.getElementById(
                    info.dir.replace(/\\/g, "") + "_editor"
                ).style.display = "block";
                editorID = new_editor_free.id;
                graviton.changeLanguageStatusBar("", info.screen);
                break;
        }
    } else {
        // Editor exists
        for (i = 0; i < editors.length; i++) {
            if (
                editors[i].screen == info.screen &&
                document.getElementById(editors[i].id) != null
            ) {
                document.getElementById(editors[i].id).style.display = "none";
            }
            if (editors[i].id == info.dir.replace(/\\/g, "") + "_editor") {
                if (editors[i].editor != undefined) {
                    // Editors
                    editor = editors[i].editor;
                    graviton.changeLanguageStatusBar(getLanguageName(
                        getFormat(path.basename(info.dir)).lang != "unknown" ?
                        getFormat(path.basename(info.dir)).lang :
                        path
                        .basename(info.dir)
                        .split(".")
                        .pop()
                    ), info.screen);
                    graviton.refreshStatusBarLinesAndChars(info.screen)
                } else if (info.type != "free") {
                    // Images
                    graviton.changeLanguageStatusBar("Image", info.screen);
                } else {
                    //Free tabs (custom)
                    graviton.changeLanguageStatusBar("", info.screen);
                }
                editorID = editors[i].id;
                document.getElementById(editorID).style.display = "block";
                if (editor != undefined) editor.refresh();
            }
        }
    }

    function filterIt(arr, searchKey, cb) {
        var list = [];
        for (var i = 0; i < arr.length; i++) {
            var curr = arr[i];
            Object.keys(curr).some(function(key) {
                if (typeof curr[key] === "string" && curr[key].includes(searchKey)) {
                    list.push(curr);
                }
            });
        }
        return cb(list);
    }
    if (editor != undefined) {
        editor.on("change", function() {
            const close_icon = document.getElementById(editingTab);
            close_icon.setAttribute("file_status", "unsaved");
            close_icon.children[1].innerHTML = icons["unsaved"];
            document
                .getElementById(editingTab)
                .setAttribute("data", editor.getValue());
            if (current_config["autoCompletionPreferences"] == "activated") {
                elasticContainer.append(document.getElementById('context'))
                const cursorPos = editor.cursorCoords();
                const A1 = editor.getCursor().line;
                const A2 = editor.getCursor().ch;
                const B1 = editor.findWordAt({
                    line: A1,
                    ch: A2
                }).anchor.ch;
                const B2 = editor.findWordAt({
                    line: A1,
                    ch: A2
                }).head.ch;
                const lastWord = editor.getRange({
                    line: A1,
                    ch: B1
                }, {
                    line: A1,
                    ch: B2
                });
                const context = document.getElementById("context");
                if (context.style.display == "block") return;
                const selectedLangNum = (function() {
                    for (i = 0; i < dictionary.length; i++) {
                        if (
                            dictionary[i].name ==
                            path
                            .basename(graviton.getCurrentFile().path)
                            .split(".")
                            .pop()
                        ) {
                            return i;
                        }
                    }
                })();
                if (selectedLangNum == undefined) return;
                let dic = dictionary[selectedLangNum].list;
                const vars = checkVariables(
                    editor.getValue()
                    .replace(/(\r\n|\n|\r)/gm, ' ')
                    .split(
                        /\s|(\()([\w\s!?="`[<>,\/*':&.;_-{}]+)(\))|\s|(\<)([\w\s!?="`[,\/*()':&.;_-{}]+)(\>)|\s|(\()([\w\s!?="<>`[,'+:&.;_-{}]+)(\))\s|(\B\$)(\w+)|\s(\/\*)([\w\s!?()="<>`[':.;_-{}]+)(\*\/)|("[\w\s!?():=`.;_-{}]+")\s|(%%)([\w\s!?()="+<>`[\/'*,.;_-{}]+)(%%)|("[\w\s!?()='.`;_-{}]+")/g
                    ).filter(Boolean)
                )
                dic = dic.concat(vars)
                filterIt(dic, lastWord, function(
                    filterResult
                ) {
                    if (filterResult.length > 0 && lastWord.length >= 3) {
                        let contextOptions;
                        for (var i = 0; i < filterResult.length; i++) {
                            const id = Math.random();
                            contextOptions +=
                                `<button id=${id} class=option >
                ${filterResult[i]._name}
                </button>`;
                            contextOptions = contextOptions.replace("undefined", "");
                            context.innerHTML = contextOptions;
                            sleeping(1).then(() => {
                                if (document.getElementById(id) == null) return;
                                document.getElementById(id).onclick = function() {
                                    const A1 = editor.getCursor().line;
                                    const A2 = editor.getCursor().ch;
                                    const B1 = editor.findWordAt({
                                        line: A1,
                                        ch: A2
                                    }).anchor.ch;
                                    const B2 = editor.findWordAt({
                                        line: A1,
                                        ch: A2
                                    }).head.ch;
                                    const selected = this.innerText;
                                    editor.replaceRange(
                                        selected, {
                                            line: A1,
                                            ch: B1
                                        }, {
                                            line: A1,
                                            ch: B2
                                        }
                                    );
                                    context.parentElement.style.display = "none";
                                    context.innerHTML = "";
                                };
                            });
                        }
                        context.parentElement.style = `top:${cursorPos.top + 30}px; left:${
              cursorPos.left
            }px; display:block;`;
                        if (cursorPos.top < window.innerHeight / 2) {} //Cursor is above the mid height
                        context.children[0].classList.add("hover");
                    } else if (filterResult.length === 0 || lastWord.length < 3) {
                        context.parentElement.style.display = "none";
                        context.innerHTML = "";
                    }
                });
            }
        });
        editor.on("keydown", function(editor, e) {
            if (
                document.getElementById("context").parentElement.style.display != "none"
            ) {
                editor.setOption("extraKeys", {
                    Up: function() {
                        return CodeMirror.PASS;
                    },
                    Down: function() {
                        return CodeMirror.PASS;
                    },
                    Enter: function() {
                        return CodeMirror.PASS;
                    },
                    Tab: function() {
                        return CodeMirror.PASS;
                    },
                });
            } else {
                editor.setOption("extraKeys", {
                    Up: "goLineUp",
                    Down: "goLineDown"
                });
            }
            const context = document.getElementById("context");
            const childs = context.querySelectorAll(".option");
            for (i = 0; i < childs.length; i++) {
                if (childs[i].classList.contains("hover")) {
                    if (
                        e.keyCode === 40 &&
                        i != childs.length - 1 &&
                        context.style.display != "none"
                    ) {
                        //DOWN
                        childs[i].classList.remove("hover");
                        childs[i + 1].classList.add("hover");
                        context.scrollBy(0, 30);
                        return false;
                    } else if (
                        e.keyCode === 38 &&
                        i != 0 &&
                        context.style.display != "none"
                    ) {
                        //UP
                        childs[i].classList.remove("hover");
                        childs[i - 1].classList.add("hover");
                        context.scrollBy(0, -30);
                        return false;
                    }
                    if (e.keyCode === 9 || e.keyCode === 13) {
                        //9 = Tab & 13 = Enter
                        const A1 = editor.getCursor().line;
                        const A2 = editor.getCursor().ch;
                        const B1 = editor.findWordAt({
                            line: A1,
                            ch: A2
                        }).anchor.ch;
                        const B2 = editor.findWordAt({
                            line: A1,
                            ch: A2
                        }).head.ch;
                        const selected = (function() {
                            for (i = 0; i < childs.length; i++) {
                                if (childs[i].classList.contains("hover")) {
                                    return childs[i].innerText;
                                }
                            }
                        })();
                        editor.replaceRange(
                            selected, {
                                line: A1,
                                ch: B1
                            }, {
                                line: A1,
                                ch: B2
                            }
                        );
                        context.innerHTML = "";
                        setTimeout(function() {
                            context.parentElement.style.display = "none";
                            context.innerHTML = "";
                        }, 1);
                    }
                }
            }
        });
        editor.addKeyMap({
            "Ctrl-S": function(cm) {
                saveFile();
            },
            "Ctrl-N": function(cm) {
                screens.add();
            },
            "Ctrl-L": function(cm) {
                screens.remove(current_screen.id);
            },
            "Ctrl-E": function(cm) {
                graviton.toggleZenMode();
            },
            "Ctrl-T": function(cm) {
                if (current_screen.terminal != undefined) {
                    commanders.show(current_screen.terminal.id);
                    return;
                }
                commanders.terminal();
            },
            "Ctrl-U": function(cm) {
                commanders.closeTerminal();
            },
            "Ctrl-H": function(cm) {
                if (current_screen.terminal != undefined) {
                    commanders.hide(current_screen.terminal.id);
                }
            },
            'F11': function(cm) {
                !g_window.isFullScreen() ? g_window.setFullScreen(true) : g_window.setFullScreen(false);
            },
            "Ctrl-Tab": function(cm) {
                graviton.toggleMenus();
            },
            "Ctrl-Up": function(cm) {
                graviton.setEditorFontSize(`${Number(current_config.fontSizeEditor) + 2}`);
            },
            "Ctrl-Down": function(cm) {
                graviton.setEditorFontSize(`${Number(current_config.fontSizeEditor) - 2}`);
            }
        });
    }
};
const appendBinds = () => {
    Mousetrap.bind("mod+s", function() {
        saveFile();
    });
    Mousetrap.bind("mod+n", function() {
        screens.add();
    });
    Mousetrap.bind("mod+l", function() {
        screens.remove(current_screen.id);
    });
    Mousetrap.bind("mod+e", function() {
        graviton.toggleZenMode();
    });
    Mousetrap.bind("mod+t", function() {
        if (current_screen.terminal != undefined) {
            commanders.show(current_screen.terminal.id);
            return;
        }
        commanders.terminal();
    });
    Mousetrap.bind("mod+u", function() {
        commanders.closeTerminal();
    });
    Mousetrap.bind("mod+h", function() {
        if (current_screen.terminal != undefined) {
            commanders.hide(current_screen.terminal.id);
        }
    });
    Mousetrap.bind("f11", function() {
        graviton.toggleFullScreen();
    });
    Mousetrap.bind("mod+tab", function() {
        graviton.toggleMenus();
    });
};

function saveFileAs() {
    dialog.showSaveDialog(fileName => {
        fs.writeFile(fileName, editor.getValue(), err => {
            if (err) {
                alert(`An error ocurred creating the file ${err.message}`);
                return;
            }
            filepath = fileName;
            new Notification({
                title: "Graviton",
                content: `The file has been succesfully saved in ${fileName}`
            });
        });
    });
}

function openFile() {
    dialog.showOpenDialog(fileNames => {
        // fileNames is an array that contains all the selected files
        if (fileNames === undefined) {
            return;
        }
        new Tab({
            id: Math.random() + fileNames[0].replace(/\\/g, "") + "B",
            path: fileNames[0],
            name: fileNames[0],
            type: "file"
        });
    });
}

function openFolder() {
    dialog.showOpenDialog({
        properties: ["openDirectory"]
    }, selectedFiles => {
        if (selectedFiles === undefined) return;
        loadDirs(selectedFiles[0], "g_directories", true);
    });
}

function saveFile() {
    if (graviton.getCurrentEditor().editor != undefined) {
        fs.writeFile(filepath, editor.getValue(), err => {
            if (err) return err;
            document.getElementById(editingTab).setAttribute("file_status", "saved");
            document
                .getElementById(editingTab)
                .children[1].setAttribute(
                    "onclick",
                    document
                    .getElementById(editingTab)
                    .children[1].getAttribute("onclose")
                );
            document.getElementById(editingTab).children[1].innerHTML =
                icons["close"];
            const file_saved_event = new CustomEvent("file_saved", {
                data: {
                    object: graviton.getCurrentEditor().object
                }
            });
            document.dispatchEvent(file_saved_event);
        });
    }
}

function loadDirs(dir, app_id, f_t, callback) {
    const first_time =
        f_t == (true || "true") ? true : f_t == "reload" ? false : f_t;
    if (!fs.existsSync(dir)) {
        graviton.throwError(getTranslation("DirectoryDoesntExist"));
        return;
    }
    const appender_id = app_id.replace(/\\/g, "");
    if (appender_id == "g_directories") {
        document.getElementById(
            "explorer_app"
        ).innerHTML = `<div global=true dir="${dir}" id="g_directories"></div>`;
        dir_path = dir;
    }
    let working_folder;
    FirstFolder = dir;
    const appender = document.getElementById(appender_id);
    if (f_t == "reload") {
        appender.setAttribute("opened", "true");
        appender.children[0].children[0].setAttribute(
            "src",
            directories.getCustomIcon(path.basename(FirstFolder), "close")
        );
        appender.children[1].innerHTML = "";
        const click = document.getElementById(appender_id).children[0];
        click.children[0].setAttribute(
            "src",
            directories.getCustomIcon(path.basename(FirstFolder), "open")
        );
    } else {
        if (appender.getAttribute("opened") == "true") {
            appender.setAttribute("opened", "false");
            appender.children[0].children[0].setAttribute(
                "src",
                directories.getCustomIcon(path.basename(FirstFolder), "close")
            );
            appender.children[1].innerHTML = "";
            return;
        } else {
            document.getElementById(appender_id).setAttribute("opened", "true");
            if (first_time == false) {
                const click = document.getElementById(appender_id).children[0];
                click.children[0].setAttribute(
                    "src",
                    directories.getCustomIcon(path.basename(FirstFolder), "open")
                );
            }
        }
    }
    if (first_time) {
        graviton.setTitle(FirstFolder);
        if (document.getElementById("openFolder") != null)
            document.getElementById("openFolder").remove();
        registerNewProject(dir);
        working_folder = document.createElement("div");
        for (i = 0; i < document.getElementById(appender_id).children.length; i++) {
            document.getElementById(appender_id).children[i].remove();
        }
        document.getElementById(appender_id).setAttribute("opened", "false");
        working_folder.setAttribute("id", "g_directory");
        working_folder.setAttribute("myPadding", "50");
        working_folder.innerHTML = `
      <div>
        <p global=true id=directory_${path.basename(
          dir
        )} parent=g_directories elementType=directory dir=${FirstFolder}>${path.basename(
      dir
    )}</p>
      </div>`;
        document.getElementById(appender_id).appendChild(working_folder);
    } else {
        working_folder = document.getElementById(appender_id).children[1];
    }
    const paddingListDir =
        Number(document.getElementById(appender_id).getAttribute("myPadding")) + 7; // Add padding
    fs.readdir(dir, (err, paths) => {
                if (paths == undefined || err) {
                    graviton.throwError(
                        "Cannot read files on the directory :" +
                        FirstFolder +
                        ". Check the permissions."
                    );
                    return;
                }
                for (i = 0; i < paths.length; i++) {
                    let _long_path = path.join(dir, paths[i]);
                    if (graviton.currentOS().codename == "win32") {
                        _long_path = _long_path.replace(/\\/g, "\\\\");
                    }
                    const stats = fs.statSync(_long_path);
                    if (stats.isDirectory()) {
                        const directory_temp = document.createElement("div");
                        const parent_id = _long_path.replace(/[\\\s]/g, "") + "_div";
                        directory_temp.innerHTML += `
        <div title=${path.join(dir, paths[i])} global=reload dir="${_long_path}"  opened="false" ID="${parent_id}" name="${
          paths[i]
        }" style="padding-left:${paddingListDir}px; vertical-align:middle;">
          <div parent=${parent_id}  ID="${parent_id +"_div"}" elementType=directory global=reload dir="${_long_path}"  class="directory" onclick="loadDirs('${_long_path}','${parent_id}',false)">
            <img file=${paths[i]} class="explorer_file_icon" parent=${parent_id} ID="${parent_id+ "_img"}" elementType=directory global=reload dir="${_long_path}" style="float:left; padding-right:3px; height:22px; width:24px; " src="${directories.getCustomIcon(
              paths[i],
              "close"
            )}">
            <p parent=${parent_id} ID="${parent_id+ "_p"}" elementType=directory global=reload dir="${_long_path}">
            ${paths[i]}
            </p>
          </div>
          <div myPadding="${paddingListDir}" dir="${_long_path}"></div>
        </div>`;
                        working_folder.appendChild(directory_temp);
                    }
                }
                for (i = 0; i < paths.length; i++) {
                    let _long_path = path.join(dir, paths[i]);
                    if (graviton.currentOS().codename == "win32") {
                        _long_path = _long_path.replace(/\\/g, "\\\\");
                    }
                    const stats = fs.statSync(_long_path);
                    if (stats.isFile()) {
                        const file_temp = document.createElement("div");
                        const parent_id = _long_path.replace(/[\\\s]/g, "") + "_div";
                        file_temp.innerHTML += `
        <div title=${path.join(dir, paths[i])} parent="${parent_id}" elementType="file" onclick="new Tab({
          id:'${parent_id + "B"}',
          path:'${_long_path}',
          name:'${paths[i]}',
          type:'file'
        })" myPadding="${paddingListDir}" dir="${_long_path}" class="directory" ID="${parent_id}" name="${
          paths[i]
        }" style=" margin-left:${paddingListDir}px; vertical-align:middle;">
          <img file=${paths[i]} class="explorer_file_icon" parent="${parent_id}" ID="${parent_id +"_img"}" dir="${_long_path}" elementType="file" style="float:left; padding-right:3px; height:24px; width:24px;" src="${
            (function(){
              if(themeObject.icons == undefined  ||(themeObject.icons[getFormat(paths[i]).lang]==undefined  && getFormat(paths[i]).trust==true ) ){
                return `src/icons/files/${getFormat(
                  paths[i]
                ).lang}.svg`
              }else{
                if(themeObject.icons[getFormat(paths[i]).lang] == undefined  && themeObject.icons[getFormat(paths[i]).format] == undefined){
                  return `
        src / icons / files / $ {
          getFormat(
            paths[i]
          ).lang
        }.svg `
                }
                if(getFormat(paths[i]).trust==true){
                  return path.join(plugins_folder,themeObject.name,themeObject.icons[getFormat(paths[i]).lang])
                }else{
                  return path.join(plugins_folder,themeObject.name,themeObject.icons[getFormat(paths[i]).format])
                }
              }
            })()
          }">
          <p parent="${parent_id}" ID="${parent_id+"_p"}" dir="${_long_path}" elementType="file">
          ${paths[i]}
          </p>
        </div>`;
        working_folder.appendChild(file_temp);
      }
    }
    callback != undefined ? callback() : "";
  });
}
const create = {
  folder: function (id, value) {
    const element = document.getElementById(id)
    const dir = path.join(element.getAttribute('dir'), value)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      loadDirs(
        element.getAttribute('dir'),
        element.id,
        element.getAttribute("global"),
        function () {
          //Created the new folder
        });
    } else {
      new Notification({
        title: "Graviton",
        content: getTranslation("ExplorerError2")
      })
    }
  },
  file: function (id, value) {
    const element = document.getElementById(id)
    const dir = path.join(element.getAttribute('dir'), value)
    if (!fs.existsSync(dir)) {
      fs.writeFile(dir, "", function () {
        loadDirs(
          element.getAttribute('dir'),
          element.id,
          element.getAttribute("global"),
          function () {
            //callback
          });
      })
    } else {
      new Notification({
        title: "Graviton",
        content: getTranslation("ExplorerError1")
      })
    }
  }
}

const directories = {
  newFolder: function (object) {
    new Dialog({
      id: "new_folder",
      title: getTranslation("Dialog.RenameTo"),
      content: "<div  id='rename_dialog' class='section-1' contentEditable> New Folder </div>",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            create.folder(object, document.getElementById('rename_dialog').innerText)
          },
          important: true
        }
      }
    });
    document.getElementById("rename_dialog").focus()
  },
  newFile: function (object) {
    new Dialog({
      id: "new_file",
      title: getTranslation("Dialog.RenameTo"),
      content: "<div id='rename_dialog' class='section-1' contentEditable> New File.txt </div>",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            create.file(object, document.getElementById('rename_dialog').innerText);
          },
          important: true
        }
      }
    });
    document.getElementById("rename_dialog").focus()
  },
  removeFileDialog: function (object) {
    new Dialog({
      id: "remove_file",
      title: getTranslation("Dialog.AreYouSure"),
      content: "",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            directories.removeFile(object.id);
          }
        }
      }
    });
  },
  removeFolderDialog: function (object) {
    new Dialog({
      id: "remove_folder",
      title: getTranslation("Dialog.AreYouSure"),
      content: "",
      buttons: {
        [getTranslation("Cancel")]: {},
        [getTranslation(
          "Accept"
        )]: {
          click: () => {
            directories.removeFolder(object.id);
          }
        }
      }
    });
  },
  removeFile: function (id) {
    const object = document.getElementById(id);
    fs.unlink(object.getAttribute("dir"), function (err) {
      if (err) graviton.throwError(err);
      object.remove();
    });
  },
  removeFolder: function (id) {
    const rimraf = require("rimraf");
    const object = document.getElementById(id);
    rimraf.sync(object.getAttribute("dir"))
    object.remove();
  },
  getCustomIcon: function (dir, state) {
    if (themeObject.icons == undefined || dir == "node_modules" || dir == ".git" || (themeObject.icons["folder_closed"] == undefined && state == "close") || (themeObject.icons["folder_opened"] == undefined && state == "open")) {
      switch (dir) {
        case "node_modules":
          return "src/icons/custom_icons/node_modules.svg";
          break;
        case ".git":
          return "src/icons/custom_icons/git.svg";
          break;
        default:
          if (state == "close") {
            return "src/icons/folder_closed.svg";
          } else {
            return "src/icons/folder_opened.svg";
          }
      }

    } else {
      switch (dir) {
        case "node_modules":
          return path.join(themeObject.name, themeObject.icons["node_modules"])
          break;
        case ".git":
          return path.join(themeObject.name, themeObject.icons["git"])
          break;
        default:
          if (state == "close") {
            return path.join(themeObject.name, themeObject.icons["folder_closed"])
          } else {
            return path.join(themeObject.name, themeObject.icons["folder_opened"])
          }
      }
    }

  }
};

/*
 * Used for loading it's icon in the explorer menu
 * Not recognized formats will have the unknown icon as default
 */


const registerNewProject = function (dir) {
  // Add a new directory to the history if it is the first time it has been opened in the editor
  for (i = 0; i < log.length + 1; i++) {
    if (i != log.length) {
      if (log[i].Path == dir) {
        return;
      }
    } else if (i == log.length) {
      log.unshift({
        Name: path.basename(dir),
        Path: dir
      });
      fs.writeFile(logDir, JSON.stringify(log));
      return;
    }
  }
};

const HTML_template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>New Project</title>
    <meta name="description" content="Graviton Project">
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>
`;
const createNewProject = function (template) {
  dialog.showOpenDialog({
    properties: ["openDirectory"]
  }, selectedFiles => {
    if (selectedFiles !== undefined) {
      switch (template) {
        case "html":
          const g_project_dir = path.join(
            selectedFiles[0],
            ".GravitonProject " + Date.now()
          );
          fs.mkdirSync(g_project_dir);
          fs.writeFile(
            path.join(g_project_dir, "index.html"),
            HTML_template,
            err => {
              if (err) {
                return err;
              }
              loadDirs(g_project_dir, "g_directories", true);
            }
          );
          break;
      }
    }
  });
};
const NewProject = () => {
  const new_projects_window = new Window({
    id: "new_projects_window",
    content: `
      <h2 class="window_title">${getTranslation("Templates")}</h2>
      <div onclick="createNewProject('html'); closeWindow('new_projects_window');" class="section-2">
        <p>HTML</p>
      </div>`
  });
  new_projects_window.launch();
};
const preload = array => {
  // Preload images when booting
  for (i = 0; i < array.length; i++) {
    document.body.innerHTML += `
    <img id="${array[i]}"src="${array[i]}" style="visibility:hidden;"></img>`;
    document.getElementById(array[i]).remove();
  }
};
const touchingResizer = type => {
  if (type == false) {
    if (!mouseClicked) {
      touchingResizerValue = false;
    }
  } else {
    touchingResizerValue = true;
  }
};

function checkVariables(text) {
  let _variables = [];
  for (i = 0; i < text.length; i++) {
    switch (editor.getMode().name) {
      case "javascript":
        switch (text[i]) {
          case "let":
          case "var":
          case "const":
            _variables.push({
              _name: text[i + 1]
            });
            break;
        }
        break;
      case "java":
        switch (text[i]) {
          case "int":
          case "char":
          case "float":
            _variables.push({
              _name: text[i + 1]
            });
            break;
        }
        break;
    }
  }
  return _variables;
}

class elasticContainerComponent extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const container = this;
    container.id = "elastic" + Math.random()
    const related = (function () {
      if (container.getAttribute("related") == "parent" || container.getAttribute("related") == undefined) {
        return container.parentElement;
      }
      if (container.getAttribute("related") == "child") {
        return container.children[0];
      }
      if (container.getAttribute("related") == "self") {
        return container;
      }
    })()
    const el = this.parentElement;
    el.onscroll = function () {
      if (Number(el.getAttribute("toleft")) != el.scrollLeft) return;
      el.setAttribute("toleft", el.scrollLeft)
      if (current_config.bouncePreferences == "desactivated") return;
      if (related == null || related == undefined) {
        return;
      }
      if (related.id != undefined) {
        if (document.getElementById(related.id) == undefined) {
          return;
        }
      }
      if (el.scrollTop == 0) {
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_top")
        this.insertBefore(spacer, this.children[0])
        setTimeout(function () {
          spacer.remove()
        }, 360)
      }
      if (el.scrollHeight - 1 <= el.scrollTop + el.clientHeight) {
        if (document.getElementsByClassName("bounce_bottom").length != 0 || related == null) return;
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_bottom")
        this.appendChild(spacer)
        setTimeout(function () {
          spacer.remove()
        }, 360)
      }
    }
  }
}
window.customElements.define("elastic-container", elasticContainerComponent);

const elasticContainer = {
  append: function (el) {
    el.onscroll = function () {
      if (Number(el.getAttribute("toleft")) != el.scrollLeft) return;
      el.setAttribute("toleft", el.scrollLeft)
      if (current_config.bouncePreferences == "desactivated") return;
      if (el.scrollTop >= 0 && el.scrollTop < 1) {
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_top")
        this.insertBefore(spacer, this.children[0])
        setTimeout(function () {
          spacer.remove()
        }, 360)
      }
      if (el.scrollHeight - 1 <= el.scrollTop + el.clientHeight) {
        if (document.getElementsByClassName("bounce_bottom").length != 0) return;
        const spacer = document.createElement("div")
        spacer.classList.add("bounce_bottom")
        this.appendChild(spacer)
        setTimeout(function () {
          spacer.remove()
        }, 360)
      }
    }
  }
}