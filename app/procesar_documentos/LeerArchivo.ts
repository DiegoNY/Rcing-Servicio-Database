import { DBFFile } from "dbffile";
import { config } from "../config/config";
import { CREAR_DBF } from "../helpers/CrearDBF.helpers";

export const LeerArchivo = async (ruta: string, directorio?: string) => {
  let rutaLectura = ruta;

  if (directorio) {
    rutaLectura = directorio + ruta;
  }

  let data: any = [];
  try {
    const dataArchivo: any = await DBFFile.open(rutaLectura);

    for await (const dataObtnenida of dataArchivo) {
      data.push(dataObtnenida);
    }
    // console.log(data);
    return data;
  } catch (error) {
    const send = config?.procesos?.find((proceso) => proceso.rta_s == ruta);
    if (send) {
      console.log("Creando Historial de envios");
      CREAR_DBF(
        [
          { name: "DOCUMENTO", type: "C", size: 255 },
          { name: "MENSAJE", type: "C", size: 255 },
          { name: "ESTATUS", type: "C", size: 255 },
          { name: "RUC", type: "C", size: 255 },
          { name: "SUCURSAL", type: "C", size: 255 },
        ],
        rutaLectura
      );
      throw new Error("Hubo un error al leer historial");
    }

    console.log(error);
    throw new Error("Error de lectura");
  }
};
