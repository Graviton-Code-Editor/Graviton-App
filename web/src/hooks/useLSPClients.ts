import { useRecoilState } from "recoil";
import { LanguageServerConfig, lspClients } from "../state/lsp";

export default function useLSPClients() {
  const [clients, setClients] = useRecoilState(lspClients);

  return {
    find: (rootUri: string, languageId: string) => {
      for (const client of clients) {
        if (client.rootUri === rootUri && client.languageId === languageId) {
          return client.client;
        }
      }
    },
    add: (config: LanguageServerConfig) => {
      setClients([...clients, config]);
    },
  };
}
