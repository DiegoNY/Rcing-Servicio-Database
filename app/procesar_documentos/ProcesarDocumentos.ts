import { CrearEstructuraCabecera } from "../crear_estructura/CrearEstructuraCabecera";
import { CrearEstructuraCuotas } from "../crear_estructura/CrearEstructuraCuotas";
import { CrearEstructuraItem } from "../crear_estructura/CrearEstructuraItem";
import { ProcesarArchivoType } from "../types/ProcesarArchivo.type";
import { Documento } from "../types/serviceDoc";
import mock_cabecera from "../test/mocks/mock_cabecera.json";
import mock_item from "../test/mocks/mock_item.json";
import mock_cuotas from "../test/mocks/mock_cuotas.json";
import { config } from "../config/config";

export const ProcesarDocuemntos = (
  data: ProcesarArchivoType,
  ruc: string,
  sucursal: number
) => {
  const DocumentosDeclarar: Documento[] = [];

  const { cabecera, items, cuotas, respuestaSunat } = data;

  cabecera.map((documento) => {
    if (documento.ESTATUS == 1 || documento.ESTATUS == "1") {
      return;
    }

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
    if (!config.ignorar_documentos.includes(documentoEstructurados.CodVenta)) {
      if (index != -1) {
        return;
      }
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
