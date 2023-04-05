import { Cabecera, CreditoCuotas, DetalleItems, RespuestaSunat } from "./serviceDoc"

export type ProcesarArchivoType = {
    cabecera: Cabecera[]
    items: DetalleItems[]
    cuotas: CreditoCuotas[]
    respuestaSunat: RespuestaSunat[]
}