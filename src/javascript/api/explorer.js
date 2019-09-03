/*
########################################
              MIT License

Copyright (c) 2019 Marc Espin Sanz

License > https://github.com/Graviton-Code-Editor/Graviton-App/blob/master/LICENSE.md

#########################################
*/
'use strict'

module.exports = {
  Explorer: {
    load: (dir, app_id, f_t, callback) => {
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
        workspaces[0] = FirstFolder;
        graviton.setTitle(FirstFolder);
        if (document.getElementById("openFolder") != null)
          document.getElementById("openFolder").remove();
        registerNewProject(dir);
        working_folder = document.createElement("div");
        for (
          i = 0;
          i < document.getElementById(appender_id).children.length;
          i++
        ) {
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
        Number(document.getElementById(appender_id).getAttribute("myPadding")) +
        10; // Add padding
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
             <div title=${path.join(
               dir,
               paths[i]
             )} global=reload dir="${_long_path}"  opened="false" ID="${parent_id}" name="${
              paths[i]
            }" style="padding-left:${paddingListDir}px; vertical-align:middle;">
               <div parent=${parent_id}  ID="${parent_id +
              "_div"}" elementType=directory global=reload dir="${_long_path}"  class="directory" onclick="Explorer.load('${_long_path}','${parent_id}',false)">
                 <img draggable=false file=${
                   paths[i]
                 } class="explorer_file_icon" parent=${parent_id} ID="${parent_id +
              "_img"}" elementType=directory global=reload dir="${_long_path}" style="float:left; padding-right:3px; height:22px; width:24px; " src="${directories.getCustomIcon(
              paths[i],
              "close"
            )}">
                 <p parent=${parent_id} ID="${parent_id +
              "_p"}" elementType=directory global=reload dir="${_long_path}">
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
                <div title=${path.join(
                  dir,
                  paths[i]
                )} parent="${parent_id}" elementType="file" onclick="new Tab({
                id:'${parent_id + "B"}',
                path:'${_long_path}',
                name:'${paths[i]}',
                type:'file'
                })" myPadding="${paddingListDir}" dir="${_long_path}" class="directory" ID="${parent_id}" name="${
              paths[i]
            }" style=" margin-left:${paddingListDir}px; vertical-align:middle;">
                <img draggable=false file=${
                  paths[i]
                } class="explorer_file_icon" parent="${parent_id}" ID="${parent_id +
              "_img"}" dir="${_long_path}" elementType="file" style="float:left; padding-right:3px; height:24px; width:24px;" src="${(function() {
              if (
                themeObject.icons == undefined ||
                (themeObject.icons[getFormat(paths[i]).lang] == undefined &&
                  getFormat(paths[i]).trust == true)
              ) {
                return `src/icons/files/${getFormat(paths[i]).lang}.svg`;
              } else {
                if (
                  themeObject.icons[getFormat(paths[i]).lang] == undefined &&
                  themeObject.icons[getFormat(paths[i]).format] == undefined
                ) {
                  return `src/icons/files/${getFormat(paths[i]).lang}.svg `;
                }
                if (getFormat(paths[i]).trust == true) {
                  return path.join(
                    plugins_folder,
                    themeObject.name,
                    themeObject.icons[getFormat(paths[i]).lang]
                  );
                } else {
                  return path.join(
                    plugins_folder,
                    themeObject.name,
                    themeObject.icons[getFormat(paths[i]).format]
                  );
                }
              }
            })()}">
               <p parent="${parent_id}" ID="${parent_id +
              "_p"}" dir="${_long_path}" elementType="file">
               ${paths[i]}
               </p>
             </div>`;
            working_folder.appendChild(file_temp);
          }
        }
        callback != undefined ? callback() : "";
      });
    }
  }
};
