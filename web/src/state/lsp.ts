import { LanguageServerClient } from "codemirror-languageserver";
import { atom } from "recoil";

export interface LanguageServerConfig {
  rootUri: string;
  languageId: string;
  client: LanguageServerClient;
}

export const lspClients = atom<Array<LanguageServerConfig>>({
  key: "lspClients",
  default: [],
  dangerouslyAllowMutability: true,
});
