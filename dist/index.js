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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const dbffile_1 = require("dbffile");
const apu_service_1 = require("./services/apu.service");
const config_1 = require("./config/config");
const procesos = config_1.config.procesos;
procesos.map((procesos, index) => {
    setInterval(() => {
        let DOCUMENTOS_MOCK = [];
        let PRODUCTOS_MOCK = [];
        let CUOTAS_MOCK = [];
        let CABECERAS_MOCK = [];
        let DOCUMENTOS_DECLARADOS = [];
        function LEYENDO_ARCHIVOS_DBF(cabecera, items, cuotas, rta) {
            var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j, _k, e_4, _l, _m;
            return __awaiter(this, void 0, void 0, function* () {
                let CABECERA = yield dbffile_1.DBFFile.open(cabecera, {});
                // console.log(`DBF file contains ${CABECERA.recordCount} records.`);
                // console.log(`Field names: ${CABECERA.fields.map(f => f.name).join(', ')}`);
                let ITEMS = yield dbffile_1.DBFFile.open(items);
                try {
                    for (var _o = true, ITEMS_1 = __asyncValues(ITEMS), ITEMS_1_1; ITEMS_1_1 = yield ITEMS_1.next(), _a = ITEMS_1_1.done, !_a;) {
                        _c = ITEMS_1_1.value;
                        _o = false;
                        try {
                            const item = _c;
                            PRODUCTOS_MOCK.push(item);
                        }
                        finally {
                            _o = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_o && !_a && (_b = ITEMS_1.return)) yield _b.call(ITEMS_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                ;
                let CUOTAS = yield dbffile_1.DBFFile.open(cuotas);
                try {
                    for (var _p = true, CUOTAS_1 = __asyncValues(CUOTAS), CUOTAS_1_1; CUOTAS_1_1 = yield CUOTAS_1.next(), _d = CUOTAS_1_1.done, !_d;) {
                        _f = CUOTAS_1_1.value;
                        _p = false;
                        try {
                            const cuota = _f;
                            CUOTAS_MOCK.push(cuota);
                        }
                        finally {
                            _p = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_p && !_d && (_e = CUOTAS_1.return)) yield _e.call(CUOTAS_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                ;
                /**LEYENDO RESPUESTA DE SUNAT */
                let sunatAnswerDBF = yield dbffile_1.DBFFile.open(rta)
                    .then((rta) => { return rta; })
                    .catch(error => {
                    console.error("ERROR AL LEER MOCK SUNAT", error);
                    CREAR_DBF([
                        { name: 'DOCUMENTO', type: 'C', size: 255 },
                        { name: 'MENSAJE', type: 'C', size: 255 },
                        { name: 'ESTATUS', type: 'C', size: 255 }
                    ], rta);
                });
                try {
                    for (var _q = true, sunatAnswerDBF_1 = __asyncValues(sunatAnswerDBF), sunatAnswerDBF_1_1; sunatAnswerDBF_1_1 = yield sunatAnswerDBF_1.next(), _g = sunatAnswerDBF_1_1.done, !_g;) {
                        _j = sunatAnswerDBF_1_1.value;
                        _q = false;
                        try {
                            const sunat = _j;
                            DOCUMENTOS_DECLARADOS.push(sunat);
                        }
                        finally {
                            _q = true;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_q && !_g && (_h = sunatAnswerDBF_1.return)) yield _h.call(sunatAnswerDBF_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                try {
                    for (var _r = true, CABECERA_1 = __asyncValues(CABECERA), CABECERA_1_1; CABECERA_1_1 = yield CABECERA_1.next(), _k = CABECERA_1_1.done, !_k;) {
                        _m = CABECERA_1_1.value;
                        _r = false;
                        try {
                            const cabecera = _m;
                            const productos = [];
                            const cuotas = [];
                            if (cabecera.STATUS != 1) {
                                PRODUCTOS_MOCK.map((produto) => {
                                    if (produto.CORRELATIV == cabecera.CORRELATIV) {
                                        productos.push(produto);
                                    }
                                });
                                CUOTAS_MOCK.map((cuota) => {
                                    if (cuota.CORRELATIV == cabecera.CORRELATIV) {
                                        cuotas.push(cuota);
                                    }
                                });
                                DOCUMENTOS_MOCK.push(Object.assign(Object.assign({}, cabecera), { ITEMS: productos, CUOTAS: cuotas, RUC: '23023031' }));
                            }
                            CABECERAS_MOCK.push(cabecera);
                        }
                        finally {
                            _r = true;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (!_r && !_k && (_l = CABECERA_1.return)) yield _l.call(CABECERA_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                ;
                return { declare: true };
            });
        }
        const DECLARANDO = (sunat) => __awaiter(void 0, void 0, void 0, function* () {
            const DOCUMENTOS_DECLARAR = [];
            const RESPUESTA_SUNAT = [];
            let sunatAnswerDBF = yield dbffile_1.DBFFile.open(sunat)
                .then((rta) => { return rta; })
                .catch((error) => console.error(error));
            DOCUMENTOS_MOCK.map((docLeidos) => {
                const declarado = DOCUMENTOS_DECLARADOS.find((docDeclarado) => {
                    return docDeclarado.DOCUMENTO === docLeidos.CORRELATIV && docDeclarado.ESTATUS === '1';
                });
                if (declarado) {
                    return; //console.log("DECLARADO");
                }
                //console.log('DECLARAR');
                DOCUMENTOS_DECLARAR.push(docLeidos);
            });
            if (DOCUMENTOS_DECLARAR.length != 0) {
                const service = new apu_service_1.Apu(DOCUMENTOS_DECLARAR);
                service.getRta()
                    .then((rta) => {
                    const { data } = rta;
                    // console.log(data);
                    console.table(data);
                    data.map((docsRta) => {
                        RESPUESTA_SUNAT.push({ DOCUMENTO: docsRta.documento, MENSAJE: docsRta.Message, ESTATUS: `${docsRta.status}` });
                    });
                    sunatAnswerDBF.appendRecords(RESPUESTA_SUNAT);
                    DOCUMENTOS_MOCK = [];
                    PRODUCTOS_MOCK = [];
                    CUOTAS_MOCK = [];
                    CABECERAS_MOCK = [];
                    DOCUMENTOS_DECLARADOS = [];
                })
                    .catch((error) => console.log(error));
            }
        });
        /**CREAR EL ARCHIVO DE RECEPCION RESPUESTA */
        const CREAR_DBF = (descripcion, rta) => __awaiter(void 0, void 0, void 0, function* () {
            let descrip = descripcion;
            yield dbffile_1.DBFFile.create(rta, descrip);
        });
        console.count("EJECUTANDO PROCESO");
        console.time('DEMORA AL EJECUTAR EL PROCESO ' + index);
        LEYENDO_ARCHIVOS_DBF(procesos.cabecera, procesos.detalle, procesos.credito, procesos.rta_s)
            .then((rta) => {
            if (rta.declare == true) {
                DECLARANDO(`${procesos.rta_s}`);
                console.timeEnd('DEMORA AL EJECUTAR EL PROCESO ' + index);
            }
        })
            .catch(error => {
            console.log("HUBO UN ERROR", error);
        });
    }, 5000);
});
/**PROBANDO MOCK */
server_1.app.listen(3005, () => {
    console.log('Server escuchando en http://localhost:3005');
});
