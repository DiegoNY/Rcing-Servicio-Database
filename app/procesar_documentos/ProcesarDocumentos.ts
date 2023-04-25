import { CrearEstructuraCabecera } from "../crear_estructura/CrearEstructuraCabecera";
import { CrearEstructuraCuotas } from "../crear_estructura/CrearEstructuraCuotas";
import { CrearEstructuraItem } from "../crear_estructura/CrearEstructuraItem";
import { ProcesarArchivoType } from "../types/ProcesarArchivo.type";
import { Documento } from "../types/serviceDoc";
import mock_cabecera from "../config/mock_cabecera.json";
import mock_item from "../config/mock_item.json";

export const ProcesarDocuemntos = (
  data: ProcesarArchivoType,
  ruc: string,
  sucursal: number
) => {
  const DocumentosDeclarar: Documento[] = [];

  const { cabecera, items, cuotas, respuestaSunat } = data;

  cabecera.map((documento) => {
    const documentoEstructurados = CrearEstructuraCabecera(
      documento,
      ruc,
      sucursal
    );
    const index = respuestaSunat.findIndex(
      (documentoDeclarado) =>
        documentoDeclarado.DOCUMENTO ==
          `${documentoEstructurados.CodVenta}-${documentoEstructurados.TipoDoc}` &&
        documentoDeclarado.ESTATUS == "1"
    );

    // console.log(index);
    if (index != -1) {
      return;
    }
    // console.log("paso");
    const itemEstructurados = CrearEstructuraItem(items, documento.CORRELATIV);
    const cuotasEstructuradas = CrearEstructuraCuotas(
      cuotas,
      documento.CORRELATIV
    );

    DocumentosDeclarar.push({
      ...documentoEstructurados,
      items: itemEstructurados,
      cuotas: cuotasEstructuradas,
    });
  });

  return DocumentosDeclarar;
};
