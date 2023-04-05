import { DBFFile } from 'dbffile';
import { EstructuraDbf } from '../types/Dbf.type';

export const CREAR_DBF = async (descripcion: EstructuraDbf[], ruta: string) => {
    console.log(ruta);
    let descrip: any = descripcion;
    await DBFFile.create(ruta, descrip);
    return true;
}
