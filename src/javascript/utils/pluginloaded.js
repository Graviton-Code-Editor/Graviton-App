import Window from '../constructors/window'
import Menu from '../constructors/menu'
import {puffin} from '@mkenzo_8/puffin'

function loadPlugin(path){
    require(path).main({Window,puffin,Menu})
}

export default loadPlugin