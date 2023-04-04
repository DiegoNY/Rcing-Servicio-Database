import { app } from "./server/server";
import { DBFFile } from 'dbffile';
import { Apu } from "./services/apu.service";
import { config } from "./config/config";

const procesos: any = config.procesos;

let DOCS: any = [];




procesos.map((proceso: any, index: string) => {
    let documentos_errores: any = [];

    setInterval(() => {


        let DOCUMENTOS_MOCK: any = [];
        let PRODUCTOS_MOCK: any = [];
        let CUOTAS_MOCK: any = [];
        let CABECERAS_MOCK: any = [];
        let DOCUMENTOS_DECLARADOS: any = [];

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
                            { name: 'ESTATUS', type: 'C', size: 255 },
                            { name: 'RUC', type: 'C', size: 255 },
                            { name: 'SUCURSAL', type: 'C', size: 255 },
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
                        placa: null,
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
                    return docDeclarado.DOCUMENTO === `${docLeidos.CodVenta}-${docLeidos.TipoDoc}` && docDeclarado.ESTATUS === '1';
                })

                const contiene_errores = documentos_errores.find((documento: any) => {
                    return documento.DOCUMENTO == `${docLeidos.CodVenta}-${docLeidos.TipoDoc}`;
                })

                if (contiene_errores) {
                    return
                }
                if (declarado) {
                    return
                }
                DOCUMENTOS_DECLARAR.push(docLeidos);
            });


            if (DOCUMENTOS_DECLARAR.length != 0) {
                // console.log(DOCUMENTOS_DECLARAR);
                const service = new Apu(DOCUMENTOS_DECLARAR);
                service.getRta()
                    .then((rta: any) => {

                        const { data } = rta;

                        console.count(`EJECUTANDO PROCESO  NUMERO : `);
                        console.log(`FECHA : ${new Date().toISOString()}`);
                        console.table(data);
                        data.map((docsRta: any) => {

                            if (docsRta.estatus == 2) {
                                documentos_errores.push({
                                    DOCUMENTO: docsRta.documento, MENSAJE: docsRta.Message,
                                    ESTATUS: `${docsRta.estatus}`, RUC: `${proceso.ruc}`,
                                    SUCURSAL: `${proceso.idSucursal}`,
                                })
                            } else {
                                RESPUESTA_SUNAT.push({
                                    DOCUMENTO: docsRta.documento, MENSAJE: docsRta.Message,
                                    ESTATUS: `${docsRta.estatus}`, RUC: `${proceso.ruc}`,
                                    SUCURSAL: `${proceso.idSucursal}`,
                                })
                            }
                        })

                        sunatAnswerDBF.appendRecords(RESPUESTA_SUNAT);

                        DOCUMENTOS_MOCK = [];
                        PRODUCTOS_MOCK = [];
                        CUOTAS_MOCK = [];
                        CABECERAS_MOCK = [];
                        DOCUMENTOS_DECLARADOS = [];

                    })
                    .catch((error: any) => {
                        console.log(`FECHA : ${new Date().toISOString()}`);
                        console.log("Hubo en error al declarar", error)
                    })
            }

        }

        /**CREAR EL ARCHIVO DE RECEPCION RESPUESTA */
        const CREAR_DBF = async (descripcion: any, rta: string) => {
            let descrip: any = descripcion;
            await DBFFile.create(rta, descrip);
        }

        LEYENDO_ARCHIVOS_DBF(
            proceso.cabecera,
            proceso.detalle,
            proceso.credito,
            proceso.rta_s
        )
            .then((rta: any) => {
                if (rta.declare == true) {
                    DECLARANDO(`${proceso.rta_s}`);
                }
            })
            .catch(error => {
                console.log("HUBO UN ERROR EN LA LECTURA", error)
            });

        DOCS = DOCUMENTOS_MOCK
    }, config.tiempo)

    setInterval(() => {
        documentos_errores = [];
    }, config.limpiar_errores)
})


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