# Graviton Changelog

This file contains "important" commits, small ones will probably not be added.

### 200616 - 1 [1.0.2]
- Indexed code
- Remove fs as dependecie 

### 200616 - 1 [1.0.2]
- Enabled node integration by default

### 200615 - 2 [1.0.2]
- Added an exit file in the File dropmenu
- Improved the dropmenus API
- Improved the Readme

### 200615 - 1 [1.0.2]
- Updated API
- Updated how the changelog works

### 200614 - 1 [1.0.2]
- New method to create whatever you want under the status bar.(Will be in docs)

### 200613 - 2 [1.0.2]
- Now you can remove files by right clicking them and clicking on remove

### 200613 - 1 [1.0.2]
- Fixed, cannot close a file if it has been opened by the "Open File" button on the dropmenu "File".

### 200613 - 1 [1.0.2]
- Fiendlier OS name

### 200612 - 3 [1.0.1]
- Fixed, having 0 plugins installeds threw an error

### 200612 - 2 [1.0.1]
- Added a shadow in tabs
- Updated codemirror

### 200612 - 1 [1.0.1]
- Fixed, some icons weren't broken

### 200611 - 1 [1.0.1]
- Fixed, closing an  opened but not activated from another screen wasn't working properly.

### 200610 - 2 [1.0.1]
- Now, you can open the dropmenus of top bar by clicking one and hovering on the others (bit unstable)
- Now, you can unmaximize too (Windows)
- Now, unrecognized file formats will be showed as well on the status bar

### 200610 - 1 [1.0.1]
- Added key shortcuts : CTRL+N (Add screen) & CTRL+L (remove the current screen)
- Added an info icon on the help dropmenu in "About"
- Removing screens is now more accurate

### 200609 - 2 [1.0.1]
- New removing screens dialog design

### 200609 - 1 [1.0.1]
- Fixed, the current screen wasn't changed when it was deleted
- Added icons to the dropmenus
- Added Default view button 
- If something is not translated to your language it will be showed in English.
- Fixed, now you can press "Ctrl+S" to save the current editing file
- Will throw a notification in case you are trying to load a directory which doesn't exist.
- Desactivated autocompletion by default cause it's so unstable
- Fixed MacOS icon
- Now Graviton will probably not throw any error after updating to a new version

### 200608 - 2 [1.0.1]
- Fixed, starting background color wasn't the right one.

### 200608 - 1 [1.0.0]
- Preparing for Beta launch! (v1.0.0)

### 200607 - 1 [0.7.7]
- If you open a file which already has an opened tha it will laod it's tab

### 200606 - 1 [0.7.7]
- Added transparency to all scrollbars (new css variable)
- Improved the screens design with more shadows and a rounded corner
- Fixed zen mode
- Now the status bar shows the language name and not the format.

### 200605 - 1 [0.7.7]
- Made a CarbonaraLive transcompiler plugin (testing)
- Improved API, now plugins can create Tabs with custom content, there is also a method which you can use to change the tab's content on live.
- Improved the code readibility
- Fixed, removing screens weren't working properly

### 200604 - 1 [0.7.7]
- Fixed, now themes cannot override the scalation css variable when the animations are off
- Improved stability
- Fixed, resizing fonts wasn't working properly
-	Fixed the dark highlighting theme selecting color transparency was so bad
- Fixed, it wasn't saving properly the files

### 200603 - 1 [0.7.7]
- Fixed, single status bar for every editor opened
- Fixed, now when you edit a file the right tab is changed
- Fixed the autocompletion windows wasn't showring properly

### 200602 - 2 [0.7.7]
- Testing with multiple tabs openeds at the same time

### 200602 - 1 [0.7.7]
- Redesigned plugins page
- Fixed, toolbar button weren't focusing
- Better directories explorer resizer

### 200601 - 1 [0.7.7]
- Now you can expand the files explorer from left to right by clicking on top right of it and moving the cursor
- **FINALLY** removed that white square on corners of scrollbars
- Correct the editors heights
- If you reduces the window's size it will still show the dropmenus
- Added an image icon for some image formats
- Minifided code for the directories and filed indexer
- Added a CSS variable for scalation effect
- Fixed minimize, close and maximize buttons margin
- Fixed, now you can open files as new tabs (previously weren't working)

### 200530 - 1 [0.7.6]
- Fixed, linux-based distros throwed error when turning on "Use system's accent color"
- "New Project" window now uses the API, so the performance and stability is better

### 200529 - 2 [0.7.6]
- New light theme
- And other fixes

### 200529 - 1 [0.7.6]
- Fixed, content wasn't loading after clicking on an opened tab

### 200526 - 1 [0.7.6]
- Fixed editors height after loading a tab
- Redesigned the setup!
- More levels on the zoom app slider!
- Moved the highlighting switch under Editor settings
- Faster boot performance!
- Improved editor's infrastructure
- Added a "ignore" button in error boot menu

### 200525 - 1 [0.7.5]
- Added an option to use the system's accent color if is available
- Added a reboot button in boot error message
- Added a  CSS color shadows variable
- Added an option to enable line wrapping
- Redesigned the settings page!
- Load system's language if it's supported when setuping Graviton
- Updated the website link! www.graviton.ml
- Added scale effect on clicking directories and files in the explorer menu
- Faster startup!
- Testing a DrebleJS plugin
- Added a Window constructor to the API.

### 200517 - 1 [0.7.4]
- Some design changes

### 200430 - 1 [0.7.4]
- Updated build commands
- Added credits to the Readme.md
- Added a translation on Settings > Editor > Auto-Completion
- Updated version on package.json
- Fixed, weren't loading the image format properly on bottom bar
- Fixed, the bottom bar content weren't showing properly with Zen mode activated (hiding the explorer panel)
- Faster speed at switching between tabs
- Updated license
- Better image viewer

### 200429 - 1 [0.7.4]
- Added animation at :active buttons of context menu
- Fixed, unsaved icon on tabs are not showing properly
- Updated themes
- Improved Building instructions (BUILDING.md)

### 200426 - 1 [0.7.4]
- I'm crazy

### 200425 - 2 [0.7.4]
- Fixed, scrolling down with keys while on autocompletion cause to jump line

### 200425 - 1 [0.7.4]
- Fixed, notifcation X button wasn't showing properly
- Faster animation on hovering elements on the project-explorer
- Fixed, error at clicking a column on TimeFlow
- Fixed, the factory reset were throwing error
- Added a final page when setuping for the firs time, it says "Thanks for installing Graviton"
- Added changelog button on Settings
- Translated "Check for updates" button Settings 
- Fixed, directory-explorer on zen mode was showing a bottom scroll bar 
- Fixed, throwing error when disabling or enabling syntax highlighting when images are opened on tabs
- Added Coffescript, vue, rust, swift, perl, python, haskell, django syntax support

### 200423 - 1 [0.7.4]
- Now the X on tabs is only showed on selected and when hovering
- Fixed showing welcome page from the toolbar takes a long delay

### 200422 - 1 [0.7.4]
- Better code format

### 200421 - 1 [0.7.4]
- Unified welcome's page and setting's CSS
- Fixed, now you can save a file whereever you want (Save as)
- Preload images for a better UX
- Testing Git plugin which gives you the last commit of your **local** project
- Smalled code of control buttons

### 190419 - 1 [0.7.4]
- Translated welcome message to spanish and catalan
- Improved dialogs API

### 190418 - 3 [0.7.4]
- Fixed from (190418), linux and MacOS were showing the menu bar 
- More round buttons 
- Fixed, wrong path for the windows's icon on package.json
- Fixed from (190418), the backround element was in front of all
- Fixed from (190418), wrong configuration about Windows on package.json

### 190418 - 2 [0.7.4]
- Fixed throws error when changing font-size with any file opened
- Added changelog dialog inside the app
- Small improvements

### 190418 - 1 [0.7.4]
- Added MacOS support!!
- Translated to catalan
- Deprecated ukranian (probably temporally)
- Improved readme.md

### 190417 - 1 [0.7.4]
- Translated to spanish
- Added a building instructions on building.md

### 190416 - 2 [0.7.3]
- New image(example.jpg) for the readme

### 190416 - 1 [0.7.3]
- Now the top bar is higher
- Added scale animation on pressing dropmenu's and dialog's buttons
- Added an image viewer, when you open an image it will show it instead of showing the code
- Added a toggle for DevTools on Settings > Advanced > Developers
- Added the data tag number on the about dialog
- Added OS info on Settings > About > Current Version
- Added a button to cancel (continue editing file) on the dialog which appears when you try to close a file which is not saved.

### 190415 - 3 [0.7.3]
- Bootanimation background color is now darkgray
- If Graviton detects an error when booting it will show up a button which will clean config and logs(As a factory reset).
- Fixed Window's icon (icon.ico)

### 190415 - 2 [0.7.3]
- Added icon on linux

### 190415 - 1 [0.7.3]
- Native top bar for Linux. (Windows top bar is part of the electron window)
- Now, you can open dev tools even on production state
- Now, language's name will be stored as "g_l" instead of "Name" so, "Name" would be able to be translated literally.
- Added the logo icon to build

### 190414 - 1 [0.7.3]
- Fixed (already added) auto-completion switch on editor page on Settings.
- Fixed, now you can save a file when there is even only one tab opened.
- New logo!
- Small bug fixes

### 190413 - 1 [0.7.3]
- Unified all the configurations in one object
- Cleaned up code
- Added a new message on the editors part
- New Dark theme highlighting (forked from Michael Kaminsky)
- Enabled MarkDown for codemirror
- Small bug fixes
- Compressed codemirror

### 190412 - 1 [0.7.3]
- Fixed "close" (X) button is hidding when the zoom was the smallest one.
- Cleaned up code
- Improved the updates detect infrastructure
- Added links to the buttons on the About page on Settings
- Created changelog.md

This changelog didn't start when the project did so, don't expect all commits info to be here.