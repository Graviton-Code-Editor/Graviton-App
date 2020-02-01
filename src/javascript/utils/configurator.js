import requirePath from './require'

const electronStore = requirePath('electron-store')

const schema = {
    config:{
        theme:'Arctic',
        fontSize:'16',
        log:[]
    }
}

function initConfiguration(){
    const store = new electronStore();

    Object.keys(schema.config).map(function(key){
        if(!store.has(`config.${key}`)){
            store.set(`config.${key}`,schema.config[key])
        }
    })

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