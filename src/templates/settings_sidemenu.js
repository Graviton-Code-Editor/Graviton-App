`
<gv-navpanel>
    <gv-navbar>
        <gv-navtitle class="translate_word" idT="Settings">${getTranslation("Settings")}</gv-navtitle>
        <gv-navbutton href=Customization onclick="Settings.navigate('customization')" class="translate_word" idT="Customization" default >${getTranslation("Customization")}</gv-navbutton>
        <gv-navbutton href=Languages onclick="Settings.navigate('languages');" class="translate_word" idT="Languages">${getTranslation("Languages")}</gv-navbutton>
        <gv-navbutton href=Editor onclick="Settings.navigate('editor');" class="translate_word" idT="Editor">${getTranslation("Editor")}</gv-navbutton>
        <gv-navbutton href=Advanced onclick="Settings.navigate('advanced');" class="translate_word" idT="Editor">${getTranslation("Advanced")}</gv-navbutton>
        <gv-navbutton href=About onclick="Settings.navigate('about');" class="translate_word" idT="About">${getTranslation("About")}</gv-navbutton>
    </gv-navbar>
    <gv-navcontent id=settings_content>
        <gv-navpage id=settings.customization href=Customization default></gv-navpage>
        <gv-navpage id=settings.languages href=Languages></gv-navpage>
        <gv-navpage id=settings.editor href=Editor></gv-navpage>
        <gv-navpage id=settings.advanced href=Advanced></gv-navpage>
        <gv-navpage id=settings.about href=About></gv-navpage>
    </gv-navcontent>
</gv-navpanel>`