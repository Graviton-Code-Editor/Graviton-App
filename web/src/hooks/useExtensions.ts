import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { ManifestInfo } from "../services/clients/client.types";
import { clientState } from "state";

/**
 * Easily retrieve the extensions using the client
 *
 * @returns All the loaded extensions manifests
 */
export function useExtensions() {
  const [extensions, setExtensions] = useState<ManifestInfo[]>([]);
  const client = useRecoilValue(clientState);

  useEffect(() => {
    client.get_ext_list().then(async (response) => {
      if (response.Ok) {
        const extesions_list = response.Ok;
        const extensions_info_list = await Promise.all(
          extesions_list.map(async (id) => {
            const info_response = await client.get_ext_info_by_id(id);
            return info_response.Ok as ManifestInfo;
          }),
        );
        setExtensions(extensions_info_list);
      }
    });
  }, []);

  return extensions;
}
