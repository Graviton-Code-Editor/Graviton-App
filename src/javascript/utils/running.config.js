import {puffin} from '@mkenzo_8/puffin'
import {initConfiguration , getConfiguration} from './configurator'

initConfiguration()
const cachedConfiguration = getConfiguration()

let Config = {
    focusedPanel:null
}

const RunningConfig = puffin.state(Config)

export default RunningConfig