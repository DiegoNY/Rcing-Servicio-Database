export const GenerarCodigoVenta = (serie: string, correlativo: string) => {
  let correlativoArr = correlativo.split("-");
  const correlativoStr = correlativoArr[1].padStart(8, "0");

  return {
    codigo: `${serie}-${correlativoStr}`,
    correlativo: correlativoStr,
    serie: serie,
  };
};

export const ValidarTipoDocumento = (serie: string) => {
  let tipoDocumento = "";
  switch (serie) {
    case "FA":
      tipoDocumento = "01";
      break;
    case "BV":
      tipoDocumento = "03";
      break;

    default:
      break;
  }

  return tipoDocumento;
};

export const GenerarCodigoDocumento = (codigo: string, serie: string) => {
  const correlativoArr = codigo.split("-");
  const correlativoFormats = correlativoArr[1]?.padStart(8, "0");
  const tipoDocumento = ValidarTipoDocumento(correlativoArr[0]);

  return {
    codigoDocumento: `${serie}-${correlativoFormats}`,
    tipoDocumento,
    correlativo: correlativoFormats,
    serie: serie,
  };
};

export const ValidarPorcentaje = (igv: number) => {
  let rtaPorcenta = 0;
  if (igv > 0) {
    rtaPorcenta = 18;
  }
  return rtaPorcenta;
};
