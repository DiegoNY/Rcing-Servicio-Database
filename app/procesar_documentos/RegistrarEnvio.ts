import { DBFFile } from "dbffile";
import { RespuestaSunat } from "../types/serviceDoc";

export const RegistrarEnvio = async (documentos: RespuestaSunat[], ruta: string) => {
    console.log(documentos);
    const archivo_respuesta = await DBFFile.open(ruta);
    archivo_respuesta.appendRecords(documentos);
}