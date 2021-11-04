
import { useEffect } from 'react'
import RpcClient from './client'
import Configuration from './config'
import { openedTabs } from './atoms'
import { RecoilRoot, useRecoilState, useSetRecoilState } from 'recoil'
import { Tab, TabData } from './state'


/* FLOW
- core starts up
- frontend opens
- frontends logs in the core
- core now knows a frontend logged in and sends him it's current state
- when a state change happens on the frontend it will send it to the core so it's on sync
- Only allow 1 frontend per registered state
*/


function StateManager() {
  const [tabs, setOpenedTabs] = useRecoilState(openedTabs);

  useEffect(() => {
    let config = new Configuration("http://127.0.0.1:50001", "ws://127.0.0.1:8000/echo");
    let client = new RpcClient(config);

    // Listen for any change on the state
    client.on('stateUpdated', function ({ state }) {
      console.log(state)
      // Convert all tab datas into Tab instances
      const openedTabs = state.opened_tabs.map((tabData: TabData) => Tab.fromJson(tabData))
      // Update the atom
      setOpenedTabs(openedTabs)
    })

    // Subscribe for new events on the given state 
    client.on('connected', () => {
      client.listenToState(1);
    })
  }, [])

  return (
    <div>
      {tabs.map((i: any) => <p key={i}>{i}</p>)}
    </div>
  )
}

function App() {
  return (
    <RecoilRoot>
      <StateManager />
    </RecoilRoot>

  )
}

export default App
