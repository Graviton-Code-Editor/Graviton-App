import { useRecoilValue } from "recoil";
import StatusBarItemContainer from "../components/StatusBarItem";
import { clientState } from "../utils/state";
import { StatusBarItemClicked, UIEvent } from "../types/messaging";

function StatusBarItemElement({ options }: { options: StatusBarItemOptions }) {
  const client = useRecoilValue(clientState);

  function onClick() {
    client.emitMessage<UIEvent<StatusBarItemClicked>>({
      UIEvent: {
        msg_type: "StatusBarItemClicked",
        state_id: client.config.state_id,
        id: options.statusbar_item_id,
      },
    });
  }

  return (
    <StatusBarItemContainer onClick={onClick}>
      <div>
        <span>{options.label}</span>
      </div>
    </StatusBarItemContainer>
  );
}

export interface StatusBarItemOptions {
  statusbar_item_id: string;
  label: string;
}

/**
 * A button located in the Statusbar
 */
export class StatusBarItem {
  public id: string;
  public options: StatusBarItemOptions;

  constructor(options: StatusBarItemOptions) {
    this.id = options.statusbar_item_id;
    this.options = options;
  }

  public container({ options }: { options: StatusBarItemOptions }) {
    return <StatusBarItemElement options={options} />;
  }
}
