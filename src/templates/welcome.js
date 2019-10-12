`
<gv-navpanel>
    <gv-navbar>
        <gv-navtitle>${getTranslation("Welcome")}</gv-navtitle>
        <gv-navbutton href=recent_projects default >${getTranslation("RecentProjects")}</gv-navbutton>
        <gv-navbutton href=new_project >${getTranslation("NewProject")}</gv-navbutton>
    </gv-navbar>
    <gv-navcontent>
        <gv-navpage href=recent_projects default>
          <div id="recent_projects" style="max-height:260px; padding-right:10px; overflow:auto;">
            ${(function() {
              let list_projects = "";
              for (i = 0; i < log.length; i++) {
                const project = document.createElement("div");
                project.setAttribute("class", "section-2");
                project.setAttribute(
                  "onclick",
                  `Explorer.load('${log[i].Path.replace(
                    /\\/g,
                    "\\\\"
                  )}','g_directories','yes'); closeWindow('welcome_window'); `
                );
                project.innerText = log[i].Name;
                project.innerHTML = `
                  <h3>${log[i].Name}</h3>
                  <p>${log[i].Path}</p>
                `;
                list_projects += project.outerHTML;
              }
              return list_projects;
            })()}
          
          </div>
        <div style="display:flex; justify-content:flex-end; margin-top:20px;">
          <button onclick="openFolder(); closeWindow('welcome_window');" id='open_folder_welcome' class=" button1 translate_word" idT="OpenFolder">${getTranslation(
            "OpenFolder"
          )}</button> 
        </div>
        </gv-navpage>
        <gv-navpage href=new_project>
            ${(() => {
              let content = "";
              projectServices.map((service, index) => {
                content += `
                    <div  class="section-2" onclick="projectServices[${index}].onclick()">
                      <h3>${service.name}</h3>
                      <p>${service.description}</p>
                    </div>
                `;
              });
              return content;
            })()}
        </gv-navpage>
    </gv-navcontent>
</gv-navpanel>`;
