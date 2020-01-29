import requirePath from './require'

const electronStore = requirePath('electron-store')

const schema = {
    log:[

    ],
    editor: {
        theme:'Arctic',
        fontSize:'16'
    },
    theme:{

    }
}

function initConfiguration(){
    const store = new electronStore();

    if(!store.has('editor')){
        store.set(schema);
    }

    return {
        store:store
    }
}

function getConfiguration(){
    
    const store = new electronStore();

    Object.keys(schema).map((section)=>{
        Object.keys(schema[section]).map((key)=>{
            if(!store.has(`${section}.${key}`)){
             store.set(`${section}.${key}`,schema[section][key])
            }
         })
    })
    

    return {
        store:store,
        editor:store.get('editor')
    }
}

export {initConfiguration,getConfiguration}