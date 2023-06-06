import { LeerArchivo } from "./LeerArchivo";
import { ProcesarArchivoType } from "../types/ProcesarArchivo.type";

export const ProcesarArchivos = async (
  direccionCabecera: string,
  direccionCuota: string,
  direccionItems: string,
  direccionGuardarRespuesta: string,
  directorio: string
): Promise<ProcesarArchivoType> => {
  try {
    const cabecera = await LeerArchivo(direccionCabecera);
    const items = await LeerArchivo(direccionItems);
    /**Si el cliente no maneja cuotas asignar un arreglo vacio a @cuotas */
    const cuotas = await LeerArchivo(direccionCuota);
    const respuestaSunat = await LeerArchivo(
      direccionGuardarRespuesta,
      directorio
    );

    return {
      cabecera,
      items,
      cuotas,
      respuestaSunat,
    };
  } catch (error) {
    throw new Error(`${error}`);
  }
};
