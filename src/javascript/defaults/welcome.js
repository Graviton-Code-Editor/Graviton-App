import {puffin} from '@mkenzo_8/puffin'
import Window from '../constructors/window'
import { Button } from '@mkenzo_8/puffin-drac'
import {openFolder} from '../utils/filesystem'
import Explorer from '../constructors/explorer'
import StaticConfig from 'StaticConfig'
import {Card , Titles} from '@mkenzo_8/puffin-drac'
import SideMenu from '../components/window/side.menu'

const listWrapper = puffin.style.css `

    &{
        padding:5px;
        overflow:auto;
        height:80%;
    }
    & > div{
        min-width:95%;
        white-space:nowrap;
        padding:
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
            <div href="projects">
                <div class="${listWrapper}">
                    ${(function(){
                        let content = "";
                        StaticConfig.data.log.map(({directory})=> {
                            content += `
                                <Card click="$openDirectory" directory="${directory}">
                                    <p>${directory}</p>
                                </Card>
                            `
                        })
                        return content;
                    })()}
                </div>
                <Button click="$openDirectoryFromWindow">Open a folder</Button>
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