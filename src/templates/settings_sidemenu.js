`
<gv-sidemenu>
    <side-menu>
        <side-title class="translate_word" idT="Settings">${getTranslation("Settings")}</side-title>
        <menu-button href=Customization onclick="Settings.navigate('customization')" class="translate_word" idT="Customization" default >${getTranslation("Customization")}</menu-button>
        <menu-button href=Languages onclick="Settings.navigate('languages');" class="translate_word" idT="Languages">${getTranslation("Languages")}</menu-button>
        <menu-button href=Editor onclick="Settings.navigate('editor');" class="translate_word" idT="Editor">${getTranslation("Editor")}</menu-button>
        <menu-button href=Advanced onclick="Settings.navigate('advanced');" class="translate_word" idT="Editor">${getTranslation("Advanced")}</menu-button>
        <menu-button href=About onclick="Settings.navigate('about');" class="translate_word" idT="About">${getTranslation("About")}</menu-button>
    </side-menu>
    <side-content id=settings_content>
        <side-page id=settings.customization href=Customization default></side-page>
        <side-page id=settings.languages href=Languages></side-page>
        <side-page id=settings.editor href=Editor></side-page>
        <side-page id=settings.advanced href=Advanced></side-page>
        <side-page id=settings.about href=About></side-page>
    </side-content>
</gv-sidemenu>`