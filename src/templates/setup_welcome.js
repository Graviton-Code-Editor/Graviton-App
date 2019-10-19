`
<div style="min-height:100%;display:flex;justify-content: center;
  align-items: center;">
  <div>
    <div style="display:flex; align-items:center;">
      <h1 style=" font-size:5vh; font-weight:900; margin-right:2vh; " >
       ${getTranslation("WelcomeMessage")}
        <h1 style="color:var(--accentColor);  font-size:5vh;">
          Graviton! 
        </h1>
        <img class="emoji-title"  src="src/openemoji/1F973.svg">
      </h1> 
    </div>
    <br>
    <div style="display:flex; align-items:center;justify-content: center;">
      <button onclick='Setup.navigate("additional_settings");' style=""  class="button1 translate_word" idT="Finish">${getTranslation(
        "GoBack"
      )}</button> 
      <button onclick='Setup.close(); Welcome.open();' style=""  class="button1 translate_word" idT="Finish">${getTranslation(
        "Finish"
      )}</button> 
    </div>
  </div>
</div>
`;