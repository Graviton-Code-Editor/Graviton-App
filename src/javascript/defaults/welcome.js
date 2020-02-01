import {puffin} from '@mkenzo_8/puffin'
import Window from '../constructors/window'
import { Button } from '@mkenzo_8/puffin-drac'
import {openFolder} from '../utils/filesystem'
import Explorer from '../constructors/explorer'
import StaticConfig from 'StaticConfig'
import {Card} from '@mkenzo_8/puffin-drac'

const WelcomePage = puffin.element(`
    <div>
        <Button click="$openDirectoryFromWindow">Open a folder</Button>
        <p>This is an alpha version of Graviton remake (Graviton 2).</p>
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
`,{
    components:{
        Button,
        Card
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
    component:WelcomePage
})

export default Welcome