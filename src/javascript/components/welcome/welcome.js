const { puffin } = require("@mkenzo_8/puffin");

function retrieve(page) {
  const emptyProjectsPanel = puffin.element(`
    <div style="display:flex; align-content: center; justify-content:center; min-height:auto;">
      <div style="position:relative; top:100px; min-height:100%;">
        <img style="margin-left:30px; " draggable="false" class="emoji-title" src="src/openemoji/1F622.svg"/>       
        <br/>   
        <p>${getTranslation("NoRecentProjects")}</p>   
      </div>  
    </div>
  `);

  const cardProject = puffin.element(
    `
    <div click="$loadMe" class="section-2" >
      <h3 class="card_title">{{name}}</h3>
      <p class="card_path">{{path}}</p>
    </div>
  `,
    {
      props: [
        "name","path"
      ],
      methods: [
        function loadMe() {
          Explorer.load(this.getAttribute("path"), "g_directories", true);
          closeWindow("welcome_window");
        }
      ]
    }
  );

  const cardService = puffin.element(
    `
    <div click="$loadMe" class="section-2">
      <h3 class="card_title">{{name}}</h3>
      <p class="card_description">{{description}}</p>
    </div>
  `,
    {
      props: [
        "name","description","index"
      ],
      methods: [
        function loadMe() {
          projectServices[this.getAttribute("index")].onclick();
          closeWindow("welcome_window");
        }
      ]
    }
  );

  const welcomePage = puffin.element(
    `
    <gv-navpanel>
      <gv-navbar>
        <gv-navtitle>${getTranslation("Welcome")}</gv-navtitle>
        <gv-navbutton href="recent_projects" ${page=="Recents"?"default=''":''} >${getTranslation(
          "RecentProjects"
        )}</gv-navbutton>
        <gv-navbutton href="new_project" ${page=="NewProject"?"default=''":''}>${getTranslation(
          "NewProject"
        )}</gv-navbutton>
      </gv-navbar>
      <gv-navcontent>
          <gv-navpage href="recent_projects" ${page=="Recents"?"default=''":''}>
            <div id="recent_projects" style="min-height:260px; max-height:260px; padding-right:10px; overflow:auto;">
              ${(function() {
                let content = "";
                log.forEach(function(currentLog) {
                  content += `<cardProject name="${currentLog.Name}" path="${currentLog.Path}"/>`;
                });
                if (log.length === 0) {
                  return "<emptyProjectsPanel/>";
                } else {
                  return content;
                }
              })()}
            </div>
          <div style="display:flex; justify-content:flex-end; margin-top:20px;">
            <button onclick="openFolder(); closeWindow('welcome_window');" id='open_folder_welcome' class=" button1 translate_word" idT="OpenFolder">${getTranslation(
              "OpenFolder"
            )}</button> 
          </div>
          </gv-navpage>
          <gv-navpage href="new_project" ${page=="NewProject"?"default=''":''}>
              ${(() => {
                let content = "";
                projectServices.map((service, index) => {
                  content += `<cardService index="${index}" name="${service.name}" description="${service.description}"/>`;
                });
                return content;
              })()}
          </gv-navpage>
      </gv-navcontent>
    </gv-navpanel>
    `,
    {
      methods: [],
      components: {
        cardProject,
        emptyProjectsPanel,
        cardService
      }
    }
  );
  return welcomePage;
}
module.exports = retrieve;
