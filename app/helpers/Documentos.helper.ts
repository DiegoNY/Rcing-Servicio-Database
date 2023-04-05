export const GenerarCodigoVenta = (serie: string, correlativo: string) => {
    let correlativoArr = correlativo.split('-');
    const correlativoStr = correlativoArr[1].padStart(8, '0');

    return { codigo: `${serie}-${correlativoStr}`, correlativo: correlativoStr, serie: serie };
}

export const ValidarPorcentaje = (igv: number) => {
    let rtaPorcenta = 0;
    if (igv > 0) {
        rtaPorcenta = 18
    }
    return rtaPorcenta;
}