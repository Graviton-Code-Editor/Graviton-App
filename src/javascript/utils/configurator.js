import requirePath from './require'
import getAppDataPath  from 'appdata-path'
import path from 'path';

const fs = requirePath('fs-extra')

const electronStore = requirePath('electron-store')

const schema = {
    config:{
        theme:'Arctic',
        language:'english',
        fontSize:'16',
        log:[],
        configPath:path.join(getAppDataPath(),'.graviton2')
    }
}

function initConfiguration(){
    const store = new electronStore();

    Object.keys(schema.config).map(function(key){
        if(!store.has(`config.${key}`)){
            store.set(`config.${key}`,schema.config[key])
        }
    })

    if(!fs.existsSync(schema.config.configPath)){
        fs.mkdirSync(schema.config.configPath)
    }
    if(!fs.existsSync(path.join(schema.config.configPath,'plugins'))){
        fs.mkdirSync(path.join(schema.config.configPath,'plugins'))
    }

    return {
        store:store
    }
}

function getConfiguration(){
    
    const {store} = initConfiguration()

    return {
        store:store,
        config:store.get('config')
    }
}

export {initConfiguration,getConfiguration}