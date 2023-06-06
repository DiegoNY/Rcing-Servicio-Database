import { app } from "./server/server";
import { config } from "./config/config";
import { ProcesarArchivos } from "./procesar_documentos/ProcesarArchivo";
import { ProcesarDocuemntos } from "./procesar_documentos/ProcesarDocumentos";
import {
  Documento,
  RespuestaServicio,
  RespuestaSunat,
} from "./types/serviceDoc";
import { Declarar } from "./Declarar";
import { RegistrarEnvio } from "./procesar_documentos/RegistrarEnvio";
import axios from "axios";

const procesos: any = config.procesos;
let DOCS: Documento[] = [];
const directorio = __dirname;

procesos.map((proceso: any) => {
  let documentos_errores: Documento[] = [];

  const LimpiarErrores = () => {
    documentos_errores = [];
  };

  const ValidarInformacion = (data: Documento[]) => {
    documentos_errores.map((docError) => {
      const docIndex = data.findIndex(
        (docData) => docData.CodVenta == docError.CodVenta
      );
      data.splice(docIndex, 1);
    });

    // console.log(data);
    return data;
  };

  setInterval(() => {
    ProcesarArchivos(
      proceso.cabecera,
      proceso.credito,
      proceso.detalle,
      proceso.rta_s,
      directorio
    )
      .then((data) => {
        const documentos = ProcesarDocuemntos(
          data,
          proceso.ruc,
          proceso.idSucursal
        );
        const documentosEnviar = ValidarInformacion(documentos);

        const documentosEnviados: RespuestaSunat[] = [];

        if (documentosEnviar.length != 0) {
          console.log("Declarando");
          Declarar(documentosEnviar)
            .then((rta: any) => {
              const { data } = rta;

              console.log(data);

              data.map((documento: RespuestaServicio) => {
                const indexDoc = documentosEnviar.findIndex(
                  (documentoMock) =>
                    `${documentoMock.CodVenta}-${documentoMock.TipoDoc}` ==
                    documento.documento
                );
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

              RegistrarEnvio(documentosEnviados, __dirname + proceso.rta_s);
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
  }, config.tiempo);

  setInterval(LimpiarErrores, config.limpiar_errores);
});

/**Enviando estado de servicio cada 5 min  */
const ValidateTime = (fecha: string) => {
  /**Cambiar la posicion de los arrays si es que hay un error al enviar la fecha normalmente  el penultimo es 1 y el ultimo es 0 pero si no colocar el penultimo en 0 y el ultimo en 1 */
  const date = fecha.split("/");
  return `${date[2]}-${date[1].padStart(2, "0")}-${date[0].padStart(2, "0")}`;
};

setInterval(async () => {
  try {
    const rta = await axios.post(
      "http://cpe.apufact.com/portal/public/api/MonitoreoServicioApuFact",
      [
        {
          ruc: config.ruc,
          idSucursal: config.idSucursal,
          Fecha: `${ValidateTime(
            new Date().toLocaleDateString().substring(0, 10)
          )} ${new Date().toLocaleTimeString().substring(0, 8)}`,
        },
      ]
    );

    console.log(rta);
  } catch (error) {
    console.log(error);
  }
}, config.tiempo_monitoreo);

/**PROBANDO MOCK */
app.listen(config.port, () => {
  app.get("/", (req, res) => {
    res.send(DOCS);
  });
  console.log(`Server escuchando en http://localhost:${config.port}`);
});
