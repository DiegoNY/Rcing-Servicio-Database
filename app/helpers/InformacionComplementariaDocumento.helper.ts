import { config } from "../config/config";
import { Cabecera } from "../types/serviceDoc";
import { GenerarCodigoDocumento } from "./Documentos.helper";

export const InformacionAdicionalDocumentos = (documento: Cabecera) => {
  let HoraReferencia = null;
  let FechaReferencia = null;
  let DocumentoReferencia = null;
  let CodMotivo = null;
  let Motivo = null;
  let TipoReferencia = null;

  if (
    documento.TIPODCTO == "01" ||
    documento.TIPODCTO == "02" ||
    documento.TIPODCTO == "03"
  ) {
  } else {
    const { codigoDocumento, tipoDocumento } = GenerarCodigoDocumento(
      documento.DCTOREFERE,
      documento.SERIEREFE
    );
    DocumentoReferencia = codigoDocumento;
    HoraReferencia = "00:00:00";
    FechaReferencia =
      documento.FECHREFERE == null || documento.FECHREFERE == ""
        ? null
        : new Date(`${documento.FECHREFERE}`).toISOString().substring(0, 10);
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

export const ValidarSerie = (serie: string) => {
  let ruc_v = config.ruc;
  let sucursal_v = config.idSucursal;
  for (const se of config.validar_series) {
    if (se.series.includes(serie)) {
      ruc_v = se.ruc;
      sucursal_v = se.id_sucursal;
    }
  }

  return { ruc_v, sucursal_v };
};
