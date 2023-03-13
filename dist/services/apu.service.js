"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Apu = void 0;
const axios_1 = __importDefault(require("axios"));
class Apu {
    constructor(data) {
        this.rta = this.sendData(data);
    }
    sendData(data) {
        const rta = axios_1.default.post('http://192.168.1.32:8282/Portal/public/api/InsertDocumento', data)
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
exports.Apu = Apu;
