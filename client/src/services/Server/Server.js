import { CONFIG } from "../../config";

class Server {

    constructor() {
        this.HOST = CONFIG.HOST;
        this.check();
    }

    async request(method, params = {})  {
        try {
            params.method = method;

            const response = await fetch(`${this.HOST}/?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`);

            const answer = await response.json();
            console.log(answer);
            if (answer.result === 'ok' && answer.data) {
                return answer.data;
            }
            return null;
        } catch (e) {
            console.log(e);
            // this.setError({
            //     code: 9000,
            //     text: 'Unknown error',
            // });
            return null;
        }
    }

    check() {
        this.request("/");
    }

}

export default Server;