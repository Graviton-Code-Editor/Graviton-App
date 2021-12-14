class Configuration<T> {
  public http_uri: T;
  public ws_uri: T;
  public state_id: number;
  public token: string;

  constructor(http_uri: T, ws_uri: T, state_id: number, token: string) {
    this.http_uri = http_uri;
    this.ws_uri = ws_uri;
    this.state_id = state_id;
    this.token = token;
  }
}

export default Configuration;
