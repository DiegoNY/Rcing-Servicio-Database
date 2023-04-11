import { app } from "./server/server";
import { config } from "./config/config";
import { ProcesarArchivos } from "./procesar_documentos/ProcesarArchivo";
import { ProcesarDocuemntos } from "./procesar_documentos/ProcesarDocumentos";
import { Documento, RespuestaServicio, RespuestaSunat } from "./types/serviceDoc";
import { Declarar } from "./Declarar";
import { RegistrarEnvio } from "./procesar_documentos/RegistrarEnvio";
import { senStatus } from "./service/apu.service";

const procesos: any = config.procesos;
let DOCS: Documento[] = [];
const directorio = __dirname;


procesos.map((proceso: any) => {
    let documentos_errores: Documento[] = [];

    const LimpiarErrores = () => {
        documentos_errores = [];
    }

    const ValidarInformacion = (data: Documento[]) => {
        documentos_errores.map(docError => {
            const docIndex = data.findIndex(docData => docData.CodVenta == docError.CodVenta)
            data.splice(docIndex, 1);
        })

        // console.log(data);
        return data
    }

    setInterval(() => {

        ProcesarArchivos(proceso.cabecera, proceso.credito, proceso.detalle, proceso.rta_s, directorio)
            .then(data => {
                const documentos = ProcesarDocuemntos(data, proceso.ruc, proceso.idSucursal)
                const documentosEnviar = ValidarInformacion(documentos);

                const documentosEnviados: RespuestaSunat[] = []

                if (documentosEnviar.length != 0) {
                    console.log("Declarando")
                    Declarar(documentosEnviar)
                        .then((rta: any) => {
                            const { data } = rta;

                            console.log(data);

                            data.map((documento: RespuestaServicio) => {
                                const indexDoc = documentosEnviar.findIndex(documentoMock => `${documentoMock.CodVenta}-${documentoMock.TipoDoc}` == documento.documento)


                                if (documento.estatus == 1) {
                                    documentosEnviados.push({
                                        DOCUMENTO: documento.documento,
                                        MENSAJE: documento.Message,
                                        ESTATUS: `${documento.estatus}`,
                                        RUC: proceso.ruc,
                                        SUCURSAL: `${proceso.idSucursal}`
                                    })
                                    return
                                }

                                documentos_errores.push(documentosEnviar[indexDoc])
                                console.log("Registrndo error" + documento.documento)
                            })

                            RegistrarEnvio(documentosEnviados, __dirname + proceso.rta_s)
                        })
                        .catch(error => {
                            console.log(error)
                        })
                }

                DOCS = documentos
            })
            .catch(error => {
                console.log(error);
            });

    }, config.tiempo)

    setInterval(LimpiarErrores, config.limpiar_errores)
})

/**Enviando estado de servicio cada 5 min  */

setInterval(async () => {
    try {
        const rta = await senStatus();
        console.log(rta);
    } catch (error) {
        console.log(error);
    }
}, 300000)

/**PROBANDO MOCK */
const port = 3015
app.listen(port, () => {
    app.get('/docs/:ctr', (req, res) => {
        const { ctr } = req.params;

        if (ctr == 'ctr') {
            res.send(DOCS)
        } else {
            res.send({ error: "unauthorized" })
        }

    })
    console.log(`Server escuchando en http://localhost:${port}`)
})