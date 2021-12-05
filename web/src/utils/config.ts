class Configuration {
  public http_uri: string;
  public ws_uri: string;
  public state_id: number;
  public token: string;

  constructor(
    http_uri: string,
    ws_uri: string,
    state_id: number,
    token: string
  ) {
    this.http_uri = http_uri;
    this.ws_uri = ws_uri;
    this.state_id = state_id;
    this.token = token;
  }
}

export default Configuration;
