
import { PropsWithChildren, useEffect } from 'react'
import RpcClient from '../utils/client'
import Configuration from '../utils/config'
import { openedTabsState, clientState, prompts, prompt } from '../utils/atoms'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus';
import RecoilNexus from 'recoil-nexus'
import { Tab, TabData } from '../modules/tab'
import Panels from './panels'
import Tabs from './tabs'
import Theme from '../utils/theme_provider'
import View from './view'
import { SplitPane } from 'react-multi-split-pane'
import { useHotkeys } from 'react-hotkeys-hook'
import { isTauri } from '../utils/commands'

async function getToken() {
  if(isTauri) {
    const { invoke } = await import("@tauri-apps/api")
    // Invoke the tauri command to retrieve the token
    return await invoke<string>('get_token');
  } else {
    // Or query the URL to get the token
    return new URL(location.toString()).searchParams.get('token');
  }
}

async function StateManager() {
  const token = await getToken();
  if (token !== null) {
    const config = new Configuration("http://127.0.0.1:50001", `ws://127.0.0.1:7700/listen?token=${token}&state=1`, 1, token);
    const client = new RpcClient(config);

    // Listen for any change on the state
    client.on('stateUpdated', function ({ state }) {
      // Convert all tab datas into Tab instances
      const openedTabs = state.opened_tabs.map((tabData: TabData) => Tab.fromJson(tabData))
      // Update the atom
      if (openedTabs.length > 0) {
        setRecoil(openedTabsState, openedTabs)
      }

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

  const usePrompts = useRecoilValue(prompts);
  const [displayedPrompt, setDisplayedPrompt] = useRecoilState(prompt);

  // Register all shortcuts
  usePrompts.forEach((prompt) => {
    if(prompt.shortcut){
      useHotkeys(prompt.shortcut, () => {
        const promptContainer = prompt.container;
        setDisplayedPrompt(promptContainer)
      });
    }
  })

  useHotkeys('esc', () => {
    setDisplayedPrompt(null)
  });

  useEffect(() => {
    // Connect the client
    StateManager();
  }, [])

  return (
    <View>
      {client && children}
      {displayedPrompt}
    </View>
  )
}

function App() {


  return (
    <RecoilRoot>
      <RecoilNexus />
      <Theme>
        <ClientRoot>
          <SplitPane split="vertical" minSize={250}>
            <Panels />
            <Tabs />
          </SplitPane>
        </ClientRoot>
      </Theme>
    </RecoilRoot>
  )
}

export default App
