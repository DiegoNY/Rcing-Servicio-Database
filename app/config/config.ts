require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 3019,
  url: process.env.SERVICE || "",
  ruc: "10704012964",
  idSucursal: 1,
  tiempo: 15000,
  limpiar_errores: 190000,
  tiempo_monitoreo: 300000,
  procesos: [
    {
      cabecera:
        "C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/cabecera.dbf",
      detalle:
        "C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/DETALLE.dbf",
      credito:
        "C:/Users/Desarrollo05/Desktop/SERVICIO_DBF/documentos2/detcredito.dbf",
      rta_s: "/sent/sunat_answer.dbf",
      ruc: "10704012964",
      idSucursal: 1,
    },
  ],
  ignorar_documentos: [""],
};

export { config };
