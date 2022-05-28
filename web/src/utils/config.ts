/**
 * Base configuration for the Core Client
 */
class Configuration<T> {
  public http_uri: T;
  public ws_uri: T;
  public state_id: number;
  public token: string;

  /**
   * @param http_uri - HTTP endpoint, if needed
   * @param ws_uri - WS endpoint, if needed
   * @param state_id - State's ID
   * @param token - Token identifier
   */
  constructor(http_uri: T, ws_uri: T, state_id: number, token: string) {
    this.http_uri = http_uri;
    this.ws_uri = ws_uri;
    this.state_id = state_id;
    this.token = token;
  }
}

export default Configuration;
