import { DetalleItems, Item } from "../types/serviceDoc";

export const CrearEstructuraItem = (
  items: DetalleItems[],
  codigo: string
): Item[] => {
  const ItemsDeclarar: Item[] = [];

  items.map((item) => {
    if (item.CORRELATIV == codigo) {
      ItemsDeclarar.push({
        CodigoItem: item.CODPRODUCT,
        Descripcion: item.PRODUCTO,
        Unidad: item.UNIDADMEDI,
        Cantidad: item.CANTIDA,
        Precio: item.PRECIOUNIT,
        SubTotal: item.PRECIOBASE,
        Igv: item.MONTOIGV,
        Descuento: item.DSCTOPRECI || 0,
        Total: item.IMPORTE,
        Lote: item.LOTE,
        FechaVcto: item.FECHAVCTO == null || item.FECHAVCTO == '' ? null : new Date(`${item.FECHAVCTO}`).toISOString().substring(0, 10),
        Labora: item.LABORA,
        Pastilla: item.PASTILLA,
        Palote: item.PALOTE,
      });
    }
  });

  return ItemsDeclarar;
};
