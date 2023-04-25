export type Item = {
  CodigoItem: string;
  Descripcion: string;
  Cantidad: number;
  Unidad: string;
  Igv: number;
  Precio: number;
  SubTotal: number;
  Total: number;
  Descuento: number;
  Lote: string;
  FechaVcto: string;
  Labora: string;
  Pastilla: null | string;
  Palote: null | string;
};

export type Cuota = {
  MontoCuota: string;
  FechaCuota: string;
  NroCuota: string;
};

export type Documento = {
  CORRELATIV: string;
  items: Item[];
  cuotas: Cuota[];
  cliente: string;
  NroDocCliente: string;
  TipoDocCliente: string;
  DirCliente: string;
  TipoDoc: string;
  CodVenta: string;
  Serie: string;
  Correlativo: string;
  FechaEmision: string;
  HoraEmision: string;
  FechaVencimiento: string;
  Moneda: string;
  FormaPago: string;
  Base: number;
  Igv: number;
  MontoExcento: number;
  MontoGratuito: number;
  Descuento: number;
  TotalDocumento: number;
  Porcentaje: number;
  NGuia: number;
  TipoCambio: number;
  FechaReferencia: null | string;
  TipoReferencia: null | string;
  DocumentoReferencia: null | string;
  CodMotivo: null | string;
  Motivo: null | string;
  otros: string;
  Detraccion: number;
  PorcDetraccion: number;
  MontoDetraccion: number;
  RegimenPercepcion: number;
  TasaPercepcion: number;
  MontoPercepcion: number;
  ruc: string;
  idSucursal: number;
  Estado: number;
  archivoPath?: string;
  archivo?: string;
  placa: null | string;
  HoraReferencia: string;
};

export type RespuestaServicio = {
  estatus: number;
  Message: string;
  documento: string;
};

export type Cabecera = {
  TIPARCHIVO: string;
  TIPODCTO: string;
  IDFACTURA: number;
  CORRELATIV: string;
  FECEMISION: Date | string;
  ESTADO: string;
  OBSERVACIO: string;
  DSTOTAL: string;
  SUBTOTAL: number;
  IGV: number;
  TOTAL: number;
  IDTIPOMONE: number;
  STACTIVO: string;
  TIPOIDCLI: string;
  IDCLIENTE: string;
  CLIENTE: string;
  RAZONSOCIA: string;
  DOCUMENTO: string;
  CONTACTO: string;
  DIRECCION: string;
  IDDOCUMENT: number;
  SERIEREFE: string;
  DCTOREFERE: string;
  FECHREFERE: null | string | number;
  TIPO: string;
  SALDOTOTAL: number;
  TELEFONO: string;
  EMAIL: string;
  SERIE: string;
  CODVENDEDO: string;
  NOMVENDEDO: string;
  TIPOPAGO: string;
  STATUS: string;
  FE_FACTNUM: string;
  MOTIVONOTA: string;
  FORMVTA: string;
  ESTATUS: string;
  CODNOTA: string;
};

export type CreditoCuotas = {
  SERIE: string;
  CORRELATIV: string;
  TIPO_DOCTO: string;
  NRO_CUOTA: number;
  FECH_CUOTA: Date;
  MONT_CUOTA: number;
  STATUS: string;
};

export type DetalleItems = {
  TIPODCTO: string;
  IDFACTUDET: string;
  IDFACTURA: number;
  CORRELATIV: string;
  IDPRODUCTO: number;
  UNIDADMEDI: string;
  CODPRODUCT: string;
  CANTIDA: number;
  PRODUCTO: string;
  PRECIOUNIT: number;
  PRECIOBASE: number;
  MONTOIGV: number;
  IMPORTE: number;
  STACTIVO: string;
  DSCTOPRECI: number;
  LOTE: string;
  FECHAVCTO: Date | string;
  SERIE: string;
  LABORA: string;
  PASTILLA: string;
  A_UNI_DES: string;
  PALOTE: string;
};

export type RespuestaSunat = {
  DOCUMENTO: string;
  MENSAJE: string;
  ESTATUS: string;
  RUC: string;
  SUCURSAL: string;
};
