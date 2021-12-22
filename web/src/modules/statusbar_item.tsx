import { ReactElement } from "react";
import { atom, RecoilState, useRecoilValue } from "recoil";
import StatusBarItemContainer from "../components/StatusBarItem";

function StatusBarItemElement({
  state,
}: {
  state: RecoilState<StatusBarItemOptions>;
}) {
  const options = useRecoilValue(state);
  return (
    <StatusBarItemContainer>
      <span>{options.label}</span>
    </StatusBarItemContainer>
  );
}

export interface StatusBarItemOptions {
  statusbar_item_id: number;
  label: string;
}

/**
 * A button located in the Statusbar
 */
export class StatusBarItem {
  public container: () => ReactElement = () => <div />;
  public state: RecoilState<StatusBarItemOptions>;
  public id: number;

  constructor(options: StatusBarItemOptions) {
    this.id = options.statusbar_item_id;
    this.state = atom<StatusBarItemOptions>({
      key: `statusbar_item${this.id}`,
      default: options,
    });
    this.container = () => <StatusBarItemElement state={this.state} />;
  }
}
