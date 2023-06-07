require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 3019,
  url: process.env.SERVICE || "",
  ruc: "20600534883",
  idSucursal: 43,
  tiempo: 15000,
  limpiar_errores: 190000,
  tiempo_monitoreo: 300000,
  procesos: [
    {
      cabecera: "D:/SOFTFENIX/DBFARMA/cabecera.dbf",
      detalle: "D:/SOFTFENIX/DBFARMA/detalle.dbf",
      credito: "D:/SOFTFENIX/DBFARMA/DETCREDITO.dbf",
      rta_s: "/sent/sunat_answer.dbf",
      ruc: "20600534883",
      idSucursal: 43,
    },
  ],
  ignorar_documentos: [""],
  validar_serie_switch: false,
  validar_series: [{ id_sucursal: 1, ruc: "20600534883", series: ["F006"] }],
};

export { config };
