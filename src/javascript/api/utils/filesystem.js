function saveFileAs() {
    const { dialog } = remote;
    dialog
      .showSaveDialog(g_window)
      .then(result => {
        if (result.canceled) return;
        fs.writeFile(result.filePath, editor.getValue())
          .then(() => {
            filepath = result.filePath;
            new Notification({
              title: "Graviton",
              content: `The file has been succesfully saved in ${result.filePath}`
            });
          })
          .catch(err => {
            if (err) {
              alert(`An error ocurred creating the file ${err.message}`);
              return;
            }
          });
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  function openFile() {
    const { dialog } = remote;
    dialog
      .showOpenDialog(g_window, {
        properties: ["openFile", "multiSelections"]
      })
      .then(result => {
        if (result.canceled) return;
        result.filePaths.forEach(file => {
          new Tab({
            id: Math.random() + file.replace(/\\/g, "") + "B",
            path: file,
            name: file,
            type: "file"
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
  function openFolder() {
    const { dialog } = remote;
    dialog
      .showOpenDialog(g_window, {
        properties: ["openDirectory"]
      })
      .then(result => {
        if (result.canceled) return;
        Explorer.load(result.filePaths[0], "g_directories", true);
      })
      .catch(err => {
        console.error(err);
      });
  }
  
  function saveFile() {
    if(graviton.getCurrentEditor() != null && graviton.getCurrentEditorInstance() != null){
      fs.writeFile(filepath, graviton.getCurrentEditor().execute("getValue"))
      .then(() => {
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
      })
      .catch(err => {
        console.err(err);
      });
    }
  }

  module.exports = { saveFile,saveFileAs, openFile, openFolder}