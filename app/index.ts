import { app } from "./server/server";
import { DBFFile } from 'dbffile';
import { Apu } from "./services/apu.service";
import { config } from "./config/config";

const procesos: any = config.procesos;

let DOCS: any = [];

procesos.map((proceso: any, index: string) => {
    setInterval(() => {


        let DOCUMENTOS_MOCK: any = [];
        let PRODUCTOS_MOCK: any = [];
        let CUOTAS_MOCK: any = [];
        let CABECERAS_MOCK: any = [];
        let DOCUMENTOS_DECLARADOS: any = []

        function GenerarCodigoVenta(serie: string | any, correlativo: string | any) {
            let correlativoArr = correlativo.split('-');
            const correlativoStr = correlativoArr[1].padStart(8, '0');

            return { codigo: `${serie}-${correlativoStr}`, correlativo: correlativoStr, serie: serie };
        }

        function ValidarPorcentaje(igv: number) {
            let rtaPorcenta = 0;
            if (igv > 0) {
                rtaPorcenta = 18
            }
            return rtaPorcenta;
        }

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
                            productos.push({
                                CodigoItem: produto.CODPRODUCT,
                                Descripcion: produto.PRODUCTO,
                                Unidad: produto.UNIDADMEDI,
                                Cantidad: produto.CANTIDA,
                                Precio: produto.PRECIOUNIT,
                                SubTotal: produto.PRECIOBASE,
                                Igv: produto.MONTOIGV,
                                Descuento: produto.DSCTOPRECI || 0,
                                Total: produto.IMPORTE,
                                Lote: produto.LOTE || null,
                                FechaVcto: new Date(`${produto.FECHAVCTO}`).toISOString().substring(0, 10),
                                Labora: produto.LABORA,
                                Pastilla: produto.PASTILLA,
                                Palote: produto.PALOTE
                            });
                        }
                    })
                    CUOTAS_MOCK.map((cuota: any) => {
                        if (cuota.CORRELATIV == cabecera.CORRELATIV) {
                            cuotas.push({
                                NroCuota: cuota.NRO_CUOTA,
                                FechaCuota: new Date(`${cuota.FECH_CUOTA}`).toISOString().substring(0, 10),
                                MontoCuota: cuota.MONT_CUOTA
                            });
                        }
                    })
                    const { correlativo, codigo, serie } = GenerarCodigoVenta(cabecera.SERIE, cabecera.CORRELATIV);
                    DOCUMENTOS_MOCK.push({
                        CORRELATIV: codigo,
                        cliente: cabecera.CLIENTE,
                        NroDocCliente: cabecera.DOCUMENTO,
                        TipoDocCliente: cabecera.TIPOIDCLI,
                        DirCliente: cabecera.DIRECCION,
                        TipoDoc: cabecera.TIPODCTO,
                        CodVenta: codigo,
                        Serie: serie,
                        Correlativo: correlativo,
                        FechaEmision: new Date(`${cabecera.FECEMISION}`).toISOString().substring(0, 10),
                        HoraEmision: "00:00:00",
                        FechaVencimiento: new Date(`${cabecera.FECEMISION}`).toISOString().substring(0, 10),
                        items: productos,
                        cuotas: cuotas,
                        Moneda: "SOLES",
                        FormaPago: cabecera.TIPOPAGO,
                        Base: cabecera.SUBTOTAL,
                        Igv: cabecera.IGV,
                        MontoExcento: 0,
                        MontoGratuito: 0,
                        Descuento: 0,
                        TotalDocumento: cabecera.TOTAL,
                        Porcentaje: ValidarPorcentaje(Number(cabecera.IGV)),
                        NGuia: 0,
                        TipoCambio: 0,
                        FechaReferencia: null,
                        TipoReferencia: null,
                        DocumentoReferencia: null,
                        CodMotivo: null,
                        Motivo: null,
                        otros: "",
                        Detraccion: 0,
                        PorcDetraccion: 0,
                        MontoDetraccion: 0,
                        RegimenPercepcion: 0,
                        TasaPercepcion: 0,
                        MontoPercepcion: 0,
                        ruc: proceso.ruc,
                        idSucursal: proceso.idSucursal,
                        Estado: 1,
                    });
                }
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
                    return docDeclarado.DOCUMENTO === docLeidos.CodVenta && docDeclarado.ESTATUS === '1' || docDeclarado.DOCUMENTO === docLeidos.CodVenta && docDeclarado.ESTATUS === '2' ;
                })

                if (declarado) {
                    return
                }

                DOCUMENTOS_DECLARAR.push(docLeidos);
            });

            if (DOCUMENTOS_DECLARAR.length != 0) {
                // return console.log(DOCUMENTOS_DECLARADOS);
                const service = new Apu(DOCUMENTOS_DECLARAR);
                service.getRta()
                    .then((rta: any) => {

                        const { data } = rta;

                        console.log(data);
                        data.map((docsRta: any) => {
                            RESPUESTA_SUNAT.push({ DOCUMENTO: docsRta.documento, MENSAJE: docsRta.Message, ESTATUS: `${docsRta.estatus}` })
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



        console.count(`EJECUTANDO PROCESO FECHA : ${new Date().toISOString()} NUMERO : `);
        console.time('DEMORA AL EJECUTAR EL PROCESO ' + index)
        LEYENDO_ARCHIVOS_DBF(
            proceso.cabecera,
            proceso.detalle,
            proceso.credito,
            proceso.rta_s
        )
            .then((rta: any) => {
                if (rta.declare == true) {
                    DECLARANDO(`${proceso.rta_s}`);
                    console.timeEnd('DEMORA AL EJECUTAR EL PROCESO ' + index)
                }
            })
            .catch(error => {
                console.log("HUBO UN ERROR", error)
            });

        DOCS = DOCUMENTOS_MOCK
    }, config.tiempo)
})


/**PROBANDO MOCK */
const port = 3006
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