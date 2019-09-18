`
<h2 idT="Welcome" class='translate_word window_title'>${ getTranslation("Welcome") }
</h2>
<div style="height:70%;" class="flex">
   <div id="recent_projects" class="horizontal">
      <elastic-container>
         <div class="flex-2">
            <h2 idT="RecentProjects" class="translate_word">${ getTranslation("RecentProjects") }
            </h2>
            <div style="float:right; right:0; position:relative; top:16px; margin:4px; margin-left:auto; margin-right:0;">
               <button style=display:none id=clear_log onclick="graviton.deleteLog(); closeWindow('welcome_window')" class=button3>Clear</button>
            </div>
         </div>
      </elastic-container>
   </div>
   <div id="notes" class="horizontal">
      <h2 idT="Notes" class='translate_word title2'>${ getTranslation("Notes") }
      </h2>
      <p> ${getTranslation("Version")}: ${GravitonInfo.version} (${ GravitonInfo.date }) - ${GravitonInfo.state}</p>
      <p> OS: ${graviton.currentOS().name}</p>
      <p idT="Changelog" class="translate_word link" onclick="graviton.dialogChangelog()">${ getTranslation("Changelog") }
      </p>
   </div>
</div>
<div class='welcomeButtons'>
   <button onclick="openFolder(); closeWindow('welcome_window');" id='open_folder_welcome' class=" button1 translate_word" idT="OpenFolder">${
      getTranslation("OpenFolder")
    }</button>
   <button onclick="closeWindow('welcome_window')" id='skip_welcome' class=" button1 translate_word" idT="Skip">${
      getTranslation("Skip")
    }</button>
</div>`