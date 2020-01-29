import {puffin} from '@mkenzo_8/puffin'
import Window from '../constructors/window'
import { Button } from '@mkenzo_8/puffin-drac'
import {openFolder} from '../utils/filesystem'
import Explorer from '../constructors/explorer'

const WelcomePage = puffin.element(`
    <div>
        <Button click="$openFolder">Open a folder</Button>
        <p>This is an alpha version of Graviton remake (Graviton 2).</p>
    </div>
`,{
    components:{
        Button
    },
    methods:{
        openFolder(){
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