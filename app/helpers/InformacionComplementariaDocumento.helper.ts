import { Cabecera } from "../types/serviceDoc";
import { GenerarCodigoDocumento } from "./Documentos.helper";

export const InformacionAdicionalDocumentos = (documento: Cabecera) => {
  let HoraReferencia = null;
  let FechaReferencia = null;
  let DocumentoReferencia = null;
  let CodMotivo = null;
  let Motivo = null;
  let TipoReferencia = null;

  if (documento.TIPODCTO == "01" || documento.TIPODCTO == "02") {
  } else {
    const { codigoDocumento, tipoDocumento } = GenerarCodigoDocumento(
      documento.DCTOREFERE,
      documento.SERIEREFE
    );
    DocumentoReferencia = codigoDocumento;
    HoraReferencia = "00:00:00";
    FechaReferencia = new Date(`${documento.FECHREFERE}`)
      .toISOString()
      .substring(0, 10);
    TipoReferencia = tipoDocumento;
    CodMotivo = documento.CODNOTA;
    Motivo = documento.MOTIVONOTA;
  }

  return {
    HoraReferencia,
    FechaReferencia,
    TipoReferencia,
    DocumentoReferencia,
    CodMotivo,
    Motivo,
  };
};
