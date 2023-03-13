import axios from "axios";

class Apu {

    rta: any;
    constructor(data: any) {
        this.rta = this.sendData(data);
    }
    sendData(data: any) {

        const rta = axios.post('http://192.168.1.32:8282/Portal/public/api/InsertDocumento', data)
            .then(response => {
                return response;
            })
            .catch(error => {
                return console.error(error);
            });

        return rta;
    }

    getRta() {
        return this.rta;
    }
}

export { Apu }