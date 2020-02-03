import {puffin} from '@mkenzo_8/puffin'
import Window from '../constructors/window'
import { Button } from '@mkenzo_8/puffin-drac'
import {openFolder} from '../utils/filesystem'
import Explorer from '../constructors/explorer'
import StaticConfig from 'StaticConfig'
import {Card , Titles} from '@mkenzo_8/puffin-drac'
import SideMenu from '../components/window/side.menu'
import requirePath from '../utils/require'

const path = requirePath("path")

const listWrapper = puffin.style.css `

    &{
        overflow:auto;
        padding-right:20px;
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

const WelcomePage = puffin.element(`
    <SideMenu default="projects">
        <div>
            <H1>Welcome</H1>
            <label to="projects">Projects</label>
            <label to="create_project">Create project</label>
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
                           
                            let nameFolder = path.basename(directory)

                            if(process.platform == "win32"){
                                 nameFolder = path.basename(directory.replace(/\\/g,'\\\\'))
                            }

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
    components:{
        Button,
        Card,
        SideMenu,
        H1:Titles.h1
    },
    methods:{
        openDirectory(){
            new Explorer(this.getAttribute("directory"),document.getElementById("sidepanel"))
        },
        openDirectoryFromWindow(){
            openFolder().then(function(folder){
                new Explorer(folder,document.getElementById("sidepanel"))
            })
        }
    }
})

const Welcome = new Window({
    component:WelcomePage,
    height:'400px',
    width:'600px'
})

export default Welcome

/*


                */