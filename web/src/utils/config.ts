
class Configuration {

    public http_uri: string;
    public ws_uri: string;

    constructor(http_uri: string, ws_uri: string){
        this.http_uri = http_uri;
        this.ws_uri = ws_uri;
    }
}

export default Configuration;
