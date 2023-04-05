require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    url: process.env.SERVICE || '',
    idSucursal: 1,
    tiempo: 15000,
    procesos: [
        // {
        //     cabecera: '../../SERVICIO_DBF/DBF_DIEGO/documentos/cabecera.dbf',
        //     detalle: '../../SERVICIO_DBF/DBF_DIEGO/documentos/DETALLE.dbf',
        //     credito: '../../SERVICIO_DBF/DBF_DIEGO/documentos/detcredito.dbf',
        //     rta_s: './app/mock/sunat_answer.dbf',
        //     ruc: "10704012964",
        //     idSucursal: 1,
        // },
        // {
        //     cabecera: 'C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/cabecera.dbf',
        //     detalle: 'C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/DETALLE.dbf',
        //     credito: 'C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/detcredito.dbf',
        //     rta_s: './app/mock/sunat_answer2.dbf',
        //     ruc: "10704012964",
        //     idSucursal: 1,
        // },
        {
            cabecera: 'C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/cabecera.dbf',
            detalle: 'C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/DETALLE.dbf',
            credito: 'C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/detcredito.dbf',
            rta_s: '/sent/sunat_answer.dbf',
            ruc: "10704012964",
            idSucursal: 1,
        },
    ],
    limpiar_errores: 60000,
}



export { config }