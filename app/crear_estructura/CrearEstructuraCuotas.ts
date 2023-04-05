import { CreditoCuotas, Cuota } from "../types/serviceDoc";

export const CrearEstructuraCuotas = (cuotas: CreditoCuotas[], codigo: string): Cuota[] => {
    const CuotasDeclarar: Cuota[] = [];

    cuotas.map(cuota => {
        if (cuota.CORRELATIV == codigo) {
            CuotasDeclarar.push({
                NroCuota: `${cuota.NRO_CUOTA}`,
                FechaCuota: new Date(`${cuota.FECH_CUOTA}`).toISOString().substring(0, 10),
                MontoCuota: `${cuota.MONT_CUOTA}`
            })
        }
    })

    return CuotasDeclarar;
}