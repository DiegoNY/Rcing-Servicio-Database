import {
  GenerarCodigoVenta,
  ValidarPorcentaje,
} from "../helpers/Documentos.helper";
import { Cabecera, Documento } from "../types/serviceDoc";

export const CrearEstructuraCabecera = (
  documento: Cabecera,
  ruc: string,
  sucursal: number
): Documento => {
  const { correlativo, codigo, serie } = GenerarCodigoVenta(
    documento.SERIE,
    documento.CORRELATIV
  );
  // console.log(documento);
  const documentoDeclarar: Documento = {
    CORRELATIV: codigo,
    cliente: documento.CLIENTE,
    NroDocCliente: documento.DOCUMENTO,
    TipoDocCliente: documento.TIPOIDCLI,
    DirCliente: documento.DIRECCION,
    TipoDoc: documento.TIPODCTO,
    CodVenta: codigo,
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
    Base: documento.SUBTOTAL,
    Igv: documento.IGV,
    MontoExcento: 0,
    MontoGratuito: 0,
    Descuento: 0,
    TotalDocumento: documento.TOTAL,
    Porcentaje: ValidarPorcentaje(Number(documento.IGV)),
    NGuia: 0,
    TipoCambio: 0,
    HoraReferencia: "00:00:00",
    FechaReferencia:
      documento.TIPODCTO == "07" || documento.TIPODCTO == "08"
        ? new Date(`${documento.FECHREFERE}`).toISOString().substring(0, 10)
        : null,
    TipoReferencia: null,
    DocumentoReferencia:
      documento.DCTOREFERE.length > 0 ? documento.DCTOREFERE : null,
    CodMotivo:
      documento.TIPODCTO == "07" || documento.TIPODCTO == "08"
        ? documento.CODNOTA
        : null,
    Motivo:
      documento.TIPODCTO == "07" || documento.TIPODCTO == "08"
        ? documento.MOTIVONOTA
        : null,
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
