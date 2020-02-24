import { puffin } from '@mkenzo_8/puffin'
import { getWorkspaceConfig } from '../../utils/filesystem'
import { Button } from '@mkenzo_8/puffin-drac'
import { openFolder } from '../../utils/filesystem'
import { LanguageState } from 'LanguageConfig'
import { Card , Titles } from '@mkenzo_8/puffin-drac'
import SideMenu from '../../components/window/side.menu'
import parseDirectory from '../../utils/directory.parser'
import RunningConfig from 'RunningConfig'
import StaticConfig from 'StaticConfig'
import CardsListContainer from '../../components/welcome/cards.list'
import ContextMenu from '../../constructors/contextmenu'
import Window from '../../constructors/window'

function Welcome(){
    const WelcomePage = puffin.element(`
        <SideMenu default="projects">
            <div>
                <H1 lang-string="Welcome"></H1>
                <label to="projects" lang-string="RecentProjects"></label>
                <label to="workspaces">Recent workspaces</label>
                <label to="create_project" lang-string="NewProject"></label>
            </div>
            <div>
                <CardsListContainer href="workspaces">
                    <div>
                        ${(function(){
                            let content = "";
                            StaticConfig.data.recentWorkspaces.map((workspacePath)=> {
                                const { name, folders = [] } = getWorkspaceConfig(workspacePath)
                                let listContent = "";

                                folders.map(({name,path})=>{
                                    listContent += `<li>· ${parseDirectory(name)}</li>`
                                })

                                content += `
                                    <Card click="$openWorkspace" directory="${workspacePath}" contextmenu="$contextMenuWorkspace">
                                        <b>${name}</b>
                                        <ul>
                                            ${listContent}
                                        </ul>
                                    </Card>
                                `
                            })
                            return content;
                        })()}
                    </div>
                </CardsListContainer>
                <CardsListContainer href="projects">
                    <div>
                        ${(function(){
                            let content = "";
                            StaticConfig.data.log.map(({ name, directory })=> {
                            
                                const nameFolder = parseDirectory(directory)

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
                </CardsListContainer>
                <CardsListContainer href="create_project">
                    <b>Empty.</b>
                </CardsListContainer>
            </div>
        </SideMenu>
    `,{
        addons:{
            lang:puffin.lang(LanguageState)
        },
        components:{
            Button,
            Card,
            SideMenu,
            H1:Titles.h1,
            CardsListContainer
        },
        methods:{
            contextMenuWorkspace(event){
                new ContextMenu({
                    list:[
                        {
                            label:'Rename',
                            action:()=>{
                                RunningConfig.emit('renameWorkspaceDialog',{
                                    path:this.getAttribute("directory"),
                                    onFinished:(newName)=>{
                                        this.children[0].textContent = newName
                                    }
                                }) 
                            }
                        },
                        {
                            label:'Remove from here',
                            action:()=>{
                                RunningConfig.emit('removeWorkspaceFromLog',{
                                    path:this.getAttribute("directory")
                                })
                                this.remove()
                            }
                        }
                    ],
                    event,
                    parent:this
                })
                
            },
            openWorkspace(){
                RunningConfig.emit('setWorkspace',{
                    path:this.getAttribute("directory")
                })
                WelcomeWindow.close()
            },
            openDirectory(){
                RunningConfig.emit('addFolderToRunningWorkspace',{
                    folderPath:this.getAttribute("directory"),
                    replaceOldExplorer:true
                })
                WelcomeWindow.close()
            },
            openDirectoryFromWindow(){
                openFolder().then(function(folder){
                    RunningConfig.emit('addFolderToWorkspace',{
                        path:folder
                    })
                    WelcomeWindow.close()
                })
            }
        }
    })

    const WelcomeWindow = new Window({
        title:'welcome',
        component:WelcomePage,
        height:'400px',
        width:'600px'
    })

    return WelcomeWindow
}

export default Welcome

/*


                */