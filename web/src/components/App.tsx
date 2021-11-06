
import { PropsWithChildren, useEffect } from 'react'
import RpcClient from '../utils/client'
import Configuration from '../utils/config'
import { openedTabsState, clientState } from '../utils/atoms'
import { RecoilRoot, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus';
import RecoilNexus from 'recoil-nexus'
import { Tab, TabData } from '../modules/tab'
import Panels from './panels'
import Tabs from './tabs'


function StateManager() {
  const config = new Configuration("http://127.0.0.1:50001", "ws://127.0.0.1:8000/echo");
  const client = new RpcClient(config);

  // Listen for any change on the state
  client.on('stateUpdated', function ({ state }) {
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

function ClientRoot({ children }: PropsWithChildren<any>) {

  const client = useRecoilValue(clientState);

  return (
    <div>
      {client && children}
    </div>
  )
}

function App() {

  useEffect(() => {
    StateManager();
  }, [])

  return (
    <RecoilRoot>
      <RecoilNexus />
      <ClientRoot>
        <Panels/>
        <Tabs/>
      </ClientRoot>
    </RecoilRoot>
  )
}

export default App
