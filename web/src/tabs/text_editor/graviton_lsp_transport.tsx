import { JSONRPCError } from "@open-rpc/client-js";
import { ERR_UNKNOWN } from "@open-rpc/client-js/build/Error";
import {
  getNotifications,
  JSONRPCRequestData,
} from "@open-rpc/client-js/build/Request";
import { Transport } from "@open-rpc/client-js/build/transports/Transport";
import Emittery from "emittery";
import { Client } from "../../services/clients/client.types";
import {
  LanguageServerNotification,
  NotifyLanguageServers,
} from "../../types/messaging";

export default class GravitonTransport extends Transport {
  closeListener?: Emittery.UnsubscribeFn;

  constructor(private languageId: string, private client: Client) {
    super();
  }

  public async connect(): Promise<void> {
    this.closeListener = this.client.on(
      "NotifyLanguageServersClient",
      (data) => {
        if (data.language === this.languageId) {
          this.transportRequestManager.resolveResponse(data.content, false);
        }
      },
    );
  }

  public sendData(
    data: JSONRPCRequestData,
    timeout: number | null = 5000,
  ): Promise<any> {
    const parsedData = this.parseData(data);
    let prom = this.transportRequestManager.addRequest(data, timeout);
    const notifications = getNotifications(data);
    try {
      this.client.emitMessage<
        NotifyLanguageServers<LanguageServerNotification>
      >({
        NotifyLanguageServers: {
          state_id: this.client.config.state_id,
          msg_type: "Notification",
          id: this.languageId,
          content: JSON.stringify(JSON.stringify(parsedData)),
        },
      }).then(() => {
        this.transportRequestManager.settlePendingRequest(
          notifications,
        );
      });
    } catch (err) {
      const jsonError = new JSONRPCError(
        "failed parsing json",
        ERR_UNKNOWN,
        err,
      );
      this.transportRequestManager.settlePendingRequest(
        notifications,
        jsonError,
      );
      prom = Promise.reject(jsonError);
    }
    return prom;
  }

  public close(): void {
    if (this.closeListener) this.closeListener();
  }
}
