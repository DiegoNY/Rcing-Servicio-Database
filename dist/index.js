"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const config_1 = require("./config/config");
const ProcesarArchivo_1 = require("./procesar_documentos/ProcesarArchivo");
const ProcesarDocumentos_1 = require("./procesar_documentos/ProcesarDocumentos");
const Declarar_1 = require("./Declarar");
const RegistrarEnvio_1 = require("./procesar_documentos/RegistrarEnvio");
const axios_1 = __importDefault(require("axios"));
const procesos = config_1.config.procesos;
let DOCS = [];
const directorio = __dirname;
procesos.map((proceso) => {
    let documentos_errores = [];
    const LimpiarErrores = () => {
        documentos_errores = [];
    };
    const ValidarInformacion = (data) => {
        documentos_errores.map((docError) => {
            const docIndex = data.findIndex((docData) => docData.CodVenta == docError.CodVenta);
            data.splice(docIndex, 1);
        });
        // console.log(data);
        return data;
    };
    setInterval(() => {
        (0, ProcesarArchivo_1.ProcesarArchivos)(proceso.cabecera, proceso.credito, proceso.detalle, proceso.rta_s, directorio)
            .then((data) => {
            const documentos = (0, ProcesarDocumentos_1.ProcesarDocuemntos)(data, proceso.ruc, proceso.idSucursal);
            const documentosEnviar = ValidarInformacion(documentos);
            const documentosEnviados = [];
            if (documentosEnviar.length != 0) {
                console.log("Declarando");
                (0, Declarar_1.Declarar)(documentosEnviar)
                    .then((rta) => {
                    const { data } = rta;
                    console.log(data);
                    data.map((documento) => {
                        const indexDoc = documentosEnviar.findIndex((documentoMock) => `${documentoMock.CodVenta}-${documentoMock.TipoDoc}` ==
                            documento.documento);
                        /**Puedes cambiar o agregar informacion a la condicion para que se registren los documentos que no deseas que sean enviados al portal  */
                        if (documento.estatus == 1) {
                            documentosEnviados.push({
                                DOCUMENTO: documento.documento,
                                MENSAJE: documento.Message,
                                ESTATUS: `${documento.estatus}`,
                                RUC: proceso.ruc,
                                SUCURSAL: `${proceso.idSucursal}`,
                            });
                            return;
                        }
                        documentos_errores.push(documentosEnviar[indexDoc]);
                        console.log("Registrndo error" + documento.documento);
                    });
                    (0, RegistrarEnvio_1.RegistrarEnvio)(documentosEnviados, __dirname + proceso.rta_s);
                })
                    .catch((error) => {
                    console.log(error);
                });
            }
            DOCS = documentos;
        })
            .catch((error) => {
            console.log(error);
        });
    }, config_1.config.tiempo);
    setInterval(LimpiarErrores, config_1.config.limpiar_errores);
});
/**Enviando estado de servicio cada 5 min  */
const ValidateTime = (fecha) => {
    /**Cambiar la posicion de los arrays si es que hay un error al enviar la fecha normalmente  el penultimo es 1 y el ultimo es 0 pero si no colocar el penultimo en 0 y el ultimo en 1 */
    const date = fecha.split("/");
    return `${date[2]}-${date[1].padStart(2, "0")}-${date[0].padStart(2, "0")}`;
};
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rta = yield axios_1.default.post("http://cpe.apufact.com/portal/public/api/MonitoreoServicioApuFact", [
            {
                ruc: config_1.config.ruc,
                idSucursal: config_1.config.idSucursal,
                Fecha: `${ValidateTime(new Date().toLocaleDateString().substring(0, 10))} ${new Date().toLocaleTimeString().substring(0, 8)}`,
            },
        ]);
        console.log(rta);
    }
    catch (error) {
        console.log(error);
    }
}), config_1.config.tiempo_monitoreo);
/**PROBANDO MOCK */
server_1.app.listen(config_1.config.port, () => {
    server_1.app.get("/", (req, res) => {
        res.send(DOCS);
    });
    console.log(`Server escuchando en http://localhost:${config_1.config.port}`);
});
