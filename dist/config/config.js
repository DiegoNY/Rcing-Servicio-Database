"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require('dotenv').config();
const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    url: process.env.SERVICE || '',
    procesos: process.env.PROCESOS || [
        {
            cabecera: '../../SERVICIO_DBF/DBF_DIEGO/documentos/cabecera.dbf',
            detalle: '../../SERVICIO_DBF/DBF_DIEGO/documentos/DETALLE.dbf',
            credito: '../../SERVICIO_DBF/DBF_DIEGO/documentos/detcredito.dbf',
            rta_s: './app/mock/sunat_answer.dbf',
        },
    ]
};
exports.config = config;
