
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
import Theme from '../utils/theme_provider'
import View from './view'

function StateManager() {
  const token = new URL(location.toString()).searchParams.get("token");
  if (token !== null) {
    const config = new Configuration("http://127.0.0.1:50001", `ws://127.0.0.1:8000/listen?token=${token}&state=1`, 1, token);
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
      client.listenToState();
      setRecoil(clientState, client)
    })
  }
}

function ClientRoot({ children }: PropsWithChildren<any>) {

  const client = useRecoilValue(clientState);

  return (
    <View>
      {client && children}
    </View>
  )
}

function App() {

  useEffect(() => {
    StateManager();
  }, [])

  return (
    <RecoilRoot>
      <RecoilNexus />
      <Theme>
        <ClientRoot>
          <Panels />
          <Tabs />
        </ClientRoot>
      </Theme>
    </RecoilRoot>
  )
}

export default App
