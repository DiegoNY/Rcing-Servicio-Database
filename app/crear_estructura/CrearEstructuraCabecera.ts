import {
  GenerarCodigoDocumento,
  GenerarCodigoVenta,
  ValidarPorcentaje,
} from "../helpers/Documentos.helper";
import { InformacionAdicionalDocumentos } from "../helpers/InformacionComplementariaDocumento.helper";
import { Cabecera, Documento } from "../types/serviceDoc";

export const CrearEstructuraCabecera = (
  documento: Cabecera,
  ruc: string,
  sucursal: number
): Documento => {
  const { correlativo, codigoDocumento, serie } = GenerarCodigoDocumento(
    documento.CORRELATIV,
    documento.SERIE
  );

  const {
    CodMotivo,
    DocumentoReferencia,
    FechaReferencia,
    HoraReferencia,
    Motivo,
    TipoReferencia,
  } = InformacionAdicionalDocumentos(documento);

  // console.log(documento);
  const documentoDeclarar: Documento = {
    CORRELATIV: codigoDocumento,
    cliente: documento.CLIENTE,
    NroDocCliente: documento.DOCUMENTO,
    TipoDocCliente: documento.TIPOIDCLI,
    DirCliente: documento.DIRECCION,
    TipoDoc: documento.TIPODCTO,
    CodVenta: codigoDocumento,
    Serie: serie,
    Correlativo: correlativo,
    FechaEmision: new Date(`${documento.FECEMISION}`)
      .toISOString()
      .substring(0, 10),
    HoraEmision: "00:00:00",
    FechaVencimiento: new Date(`${documento.FECEMISION}`)
      .toISOString()
      .substring(0, 10),
    items: [],
    cuotas: [],
    Moneda: "SOLES",
    FormaPago: documento.TIPOPAGO,
    Base: documento.IGV == 0 ? 0 : documento.SUBTOTAL,
    Igv: documento.IGV,
    MontoExcento: documento.IGV == 0 ? documento.TOTAL : 0,
    MontoGratuito: 0,
    Descuento: 0,
    TotalDocumento: documento.TOTAL,
    Porcentaje: ValidarPorcentaje(Number(documento.IGV)),
    NGuia: 0,
    TipoCambio: 0,
    HoraReferencia: HoraReferencia,
    FechaReferencia: FechaReferencia,
    TipoReferencia: TipoReferencia,
    DocumentoReferencia: DocumentoReferencia,
    CodMotivo: CodMotivo,
    Motivo: Motivo,
    otros: "",
    Detraccion: 0,
    PorcDetraccion: 0,
    MontoDetraccion: 0,
    RegimenPercepcion: 0,
    TasaPercepcion: 0,
    MontoPercepcion: 0,
    ruc: ruc,
    idSucursal: sucursal,
    placa: null,
    Estado: 1,
  };

  return documentoDeclarar;
};
