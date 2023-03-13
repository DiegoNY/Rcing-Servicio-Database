import { app } from "./server/server";
import { DBFFile } from 'dbffile';
import { Apu } from "./services/apu.service";
import { config } from "./config/config";

const procesos: any = config.procesos;

procesos.map((procesos: any, index: string) => {
    setInterval(() => {


        let DOCUMENTOS_MOCK: any = [];
        let PRODUCTOS_MOCK: any = [];
        let CUOTAS_MOCK: any = [];
        let CABECERAS_MOCK: any = [];
        let DOCUMENTOS_DECLARADOS: any = []


        async function LEYENDO_ARCHIVOS_DBF(cabecera: string, items: string, cuotas: string, rta: string) {

            let CABECERA = await DBFFile.open(cabecera, {});
            // console.log(`DBF file contains ${CABECERA.recordCount} records.`);
            // console.log(`Field names: ${CABECERA.fields.map(f => f.name).join(', ')}`);

            let ITEMS = await DBFFile.open(items);
            for await (const item of ITEMS) {
                PRODUCTOS_MOCK.push(item);
            };

            let CUOTAS = await DBFFile.open(cuotas);
            for await (const cuota of CUOTAS) {
                CUOTAS_MOCK.push(cuota);
            };
            /**LEYENDO RESPUESTA DE SUNAT */
            let sunatAnswerDBF = await DBFFile.open(rta)
                .then((rta: any) => { return rta })
                .catch(error => {
                    console.error("ERROR AL LEER MOCK SUNAT", error);
                    CREAR_DBF(
                        [
                            { name: 'DOCUMENTO', type: 'C', size: 255 },
                            { name: 'MENSAJE', type: 'C', size: 255 },
                            { name: 'ESTATUS', type: 'C', size: 255 }
                        ],
                        rta
                    )
                });

            for await (const sunat of sunatAnswerDBF) {
                DOCUMENTOS_DECLARADOS.push(sunat);
            }

            for await (const cabecera of CABECERA) {

                const productos: any = [];
                const cuotas: any = [];

                if (cabecera.STATUS != 1) {

                    PRODUCTOS_MOCK.map((produto: any) => {
                        if (produto.CORRELATIV == cabecera.CORRELATIV) {
                            productos.push(produto);
                        }
                    })
                    CUOTAS_MOCK.map((cuota: any) => {
                        if (cuota.CORRELATIV == cabecera.CORRELATIV) {
                            cuotas.push(cuota);
                        }
                    })
                    DOCUMENTOS_MOCK.push({ ...cabecera, ITEMS: productos, CUOTAS: cuotas, RUC: '23023031' });
                }
                CABECERAS_MOCK.push(cabecera);
            };

            return { declare: true }

        }


        const DECLARANDO = async (sunat: string) => {


            const DOCUMENTOS_DECLARAR: any = [];
            const RESPUESTA_SUNAT: any = [];
            let sunatAnswerDBF = await DBFFile.open(sunat)
                .then((rta: any) => { return rta })
                .catch((error: any) => console.error(error));

            DOCUMENTOS_MOCK.map((docLeidos: any) => {
                const declarado = DOCUMENTOS_DECLARADOS.find((docDeclarado: any) => {
                    return docDeclarado.DOCUMENTO === docLeidos.CORRELATIV && docDeclarado.ESTATUS === '1';
                })

                if (declarado) {
                    return //console.log("DECLARADO");
                }
                //console.log('DECLARAR');
                DOCUMENTOS_DECLARAR.push(docLeidos);
            });

            if (DOCUMENTOS_DECLARAR.length != 0) {
                const service = new Apu(DOCUMENTOS_DECLARAR);

                service.getRta()
                    .then((rta: any) => {

                        const { data } = rta;
                        // console.log(data);
                        console.table(data);
                        data.map((docsRta: any) => {
                            RESPUESTA_SUNAT.push({ DOCUMENTO: docsRta.documento, MENSAJE: docsRta.Message, ESTATUS: `${docsRta.status}` })
                        })

                        sunatAnswerDBF.appendRecords(RESPUESTA_SUNAT);

                        DOCUMENTOS_MOCK = [];
                        PRODUCTOS_MOCK = [];
                        CUOTAS_MOCK = [];
                        CABECERAS_MOCK = [];
                        DOCUMENTOS_DECLARADOS = [];

                    })
                    .catch((error: any) => console.log(error))
            }

        }

        /**CREAR EL ARCHIVO DE RECEPCION RESPUESTA */
        const CREAR_DBF = async (descripcion: any, rta: string) => {
            let descrip: any = descripcion;
            await DBFFile.create(rta, descrip);
        }



        console.count("EJECUTANDO PROCESO");
        console.time('DEMORA AL EJECUTAR EL PROCESO ' + index)
        LEYENDO_ARCHIVOS_DBF(
            procesos.cabecera,
            procesos.detalle,
            procesos.credito,
            procesos.rta_s
        )
            .then((rta: any) => {
                if (rta.declare == true) {
                    DECLARANDO(`${procesos.rta_s}`);
                    console.timeEnd('DEMORA AL EJECUTAR EL PROCESO ' + index)
                }
            })
            .catch(error => {
                console.log("HUBO UN ERROR", error)
            });

    }, 5000)
})


/**PROBANDO MOCK */

app.listen(3005, () => {
    console.log('Server escuchando en http://localhost:3005')
})