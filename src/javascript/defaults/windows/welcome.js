import {puffin} from '@mkenzo_8/puffin'
import Window from '../../constructors/window'
import { Button } from '@mkenzo_8/puffin-drac'
import {openFolder} from '../../utils/filesystem'
import Explorer from '../../constructors/explorer'
import StaticConfig from 'StaticConfig'
import {Card , Titles} from '@mkenzo_8/puffin-drac'
import SideMenu from '../../components/window/side.menu'
import requirePath from '../../utils/require'
import parseDirectory from '../../utils/directory.parser'
import LanguageConfig from 'LanguageConfig'

const listWrapper = puffin.style.css `

    &{
        overflow:auto;
        padding-right:20px;
        min-height:80%;
        max-height:80%;
        display:block;
    }
    & > div{
        min-width:100%;
        max-width:auto;
        white-space:nowrap;
        overflow:hidden;
        padding:20px 25px;
        display:block;
    }
    & > div *{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        left:0;
        margin:6px 2px;
        display:block;
    }

`
function Welcome(){
    const WelcomePage = puffin.element(`
        <SideMenu default="projects">
            <div>
                <H1 lang-string="Welcome"></H1>
                <label to="projects" lang-string="RecentProjects"></label>
                <label to="create_project" lang-string="NewProject"></label>
            </div>
            <div>
                <div href="projects" class="${puffin.style.css`
                    &{
                        display:flex;
                        flex-direction:columns;
                        flex:1;
                        min-height:20%;
                        max-height:50%;
                    }
                `}">
                    <div class="${listWrapper}">
                        ${(function(){
                            let content = "";
                            StaticConfig.data.log.map(({ name, directory })=> {
                            
                                let nameFolder = parseDirectory(directory)

                                content += `
                                    <Card click="$openDirectory" directory="${directory}">
                                        <b>${nameFolder}</b>
                                        <p>${directory}</p>
                                    </Card>
                                `
                            })
                            return content;
                        })()}
                    </div>
                    <div class="${puffin.style.css`
                        &{
                            display:flex;
                            justify-content:flex-end;
                            padding-top:10px;
                        }
                    `}">
                        <Button click="$openDirectoryFromWindow">Open a folder</Button>
                    </div>
                </div>
                <div href="create_project" class="${listWrapper}">
                    <b>Empty.</b>
                </div>
            </div>
        </SideMenu>
    `,{
        addons:{
            lang:puffin.lang(LanguageConfig)
        },
        components:{
            Button,
            Card,
            SideMenu,
            H1:Titles.h1
        },
        methods:{
            openDirectory(){
                new Explorer(this.getAttribute("directory"),document.getElementById("sidepanel"))
                WelcomeWindow.close()
            },
            openDirectoryFromWindow(){
                openFolder().then(function(folder){
                    new Explorer(folder,document.getElementById("sidepanel"))
                    WelcomeWindow.close()
                })
            }
        }
    })

    const WelcomeWindow = new Window({
        component:WelcomePage,
        height:'400px',
        width:'600px'
    })

    return WelcomeWindow
}

export default Welcome

/*


                */