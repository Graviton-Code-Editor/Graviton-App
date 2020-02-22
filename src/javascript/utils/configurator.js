import requirePath from './require'
import path from 'path';

const fs = requirePath('fs-extra')
const electronStore = requirePath('electron-store')
const getAppDataPath = requirePath('appdata-path')

const defaultConfiguration = {
    config:{
        theme:'Arctic',
        language:'english',
        fontSize:'16',
        log:[],
        configPath:path.join(getAppDataPath(),'.graviton2')
    }
}

function initConfiguration(){
    const configurationStore = new electronStore();
    console.log(configurationStore)

    Object.keys(defaultConfiguration.config).map(function(key){
        
        if(!configurationStore.has(`config.${key}`)){

            configurationStore.set(
                `config.${key}`,
                defaultConfiguration.config[key]
            )

        }
    })

    if(!fs.existsSync(defaultConfiguration.config.configPath)){
        fs.mkdirSync(defaultConfiguration.config.configPath)
    }
    if(!fs.existsSync(path.join(defaultConfiguration.config.configPath,'plugins'))){
        fs.mkdirSync(path.join(defaultConfiguration.config.configPath,'plugins'))
    }

    return {
        store:configurationStore
    }
}

function getConfiguration(){
    
    const { store } = initConfiguration()

    return {
        store:store,
        config:store.get('config')
    }
}

export {initConfiguration,getConfiguration}