
import { useEffect, useRef, useState } from 'react'
import RpcClient from '../utils/client'
import Configuration from '../utils/config'
import { openedTabsState, clientState } from '../utils/atoms'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { Tab, TabData } from '../utils/state'
import { setRecoil } from 'recoil-nexus';
import RecoilNexus  from 'recoil-nexus'


/* FLOW
- core starts up
- frontend opens
- frontends logs in the core
- core now knows a frontend logged in and sends him it's current state
- when a state change happens on the frontend it will send it to the core so it's on sync
- Only allow 1 frontend per registered state
*/


function StateManager() {
  const config = new Configuration("http://127.0.0.1:50001", "ws://127.0.0.1:8000/echo");
  const client = new RpcClient(config);

  // Listen for any change on the state
  client.on('stateUpdated', function ({ state }) {
    console.log(state)
    // Convert all tab datas into Tab instances
    const openedTabs = state.opened_tabs.map((tabData: TabData) => Tab.fromJson(tabData))
    // Update the atom
    setRecoil(openedTabsState, openedTabs)
  })

  // Subscribe for new events on the given state 
  client.on('connected', () => {
    client.listenToState(1);
  })

  setRecoil(clientState, client)
}

function Body() {

  useEffect(() => {
    StateManager();
  }, [])

  const refInput: any = useRef(null);
  const [text, setText] = useState("default");
  const useClient = useRecoilValue(clientState);

  async function openFile() {

    try {
      const fileContent = await useClient.read_file_by_path(refInput.current.value, "local", 1);
      if(fileContent.Ok) {
        setText(fileContent.Ok);
      } else {
        setText("err");
      }
      
    } catch(err) {
      console.log(1, err)
    }
  }

  return (
    <div>
      <input ref={refInput} defaultValue="path"></input>
      <button onClick={openFile}>open</button>
      <textarea value={text} readOnly/>
    </div>
  )
}

function App() {

  return (
    <RecoilRoot>
      <RecoilNexus/>    
      <Body />
    </RecoilRoot>
  )
}

export default App
