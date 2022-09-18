import { useRecoilState } from "recoil";
import { LanguageServerConfig, lspClients } from "state";

export function useLSPClients() {
  const [clients, setClients] = useRecoilState(lspClients);

  return {
    find: (languageId: string) => {
      for (const client of clients) {
        if (client.languageId === languageId) {
          return client.client;
        }
      }
    },
    add: (config: LanguageServerConfig) => {
      setClients([...clients, config]);
    },
    dispose: (languageId: string) => {
      setClients((clients) => {
        // Find any client running with the specified language ID
        const client = clients.find((client) =>
          client.languageId === languageId
        );

        if (client) {
          // Close the client
          client.client.close();

          // Remove the client
          const clientIndex = clients.indexOf(client);
          const newClients = [...clients];
          newClients.splice(clientIndex, 1);

          return newClients;
        }
        return clients;
      });
    },
  };
}
