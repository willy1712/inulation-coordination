import { z } from 'zod';
import type { Entradas } from './tipos';

const pos = z.number().finite().positive();
const noNeg = z.number().finite().nonnegative();

/**
 * Esquema de validación de un proyecto (archivo JSON).
 * Protege la importación: un archivo corrupto o editado a mano no puede
 * inyectar textos en campos numéricos ni valores físicamente inválidos
 * (que producirían NaN o divisiones entre cero silenciosas).
 */
export const EsquemaEntradas = z.object({
  proyecto: z.string(),
  estudio: z.string(),
  revision: z.string(),
  ingeniero: z.string(),

  us: pos,
  factorUm: pos,
  frecuencia: pos,
  altitud: noNeg,
  fugaEspecifica: pos,
  puestaTierra: z.string(),

  r0: z.number().finite(),
  x0: z.number().finite(),
  r1: z.number().finite(),
  x1: pos, // X1 = 0 rompería los ratios R0/X1 y X0/X1

  factorRechazoCarga: pos,
  ue2: pos,
  relacionUp2Ue2: pos,
  kcdFt: pos,
  kcdFf: pos,

  factorCov: pos, // divisor
  factorTov: pos, // divisor
  factorSeguridadR: pos,
  tensionNominalR: pos,
  ups: pos,
  upl: pos,
  descripcionPararrayos: z.string(),

  factorA: pos,
  nLineas: pos, // divisor
  a1: noNeg, a2: noNeg, a3: noNeg, a4: noNeg,
  a1i: noNeg, a2i: noNeg, a3i: noNeg, a4i: noNeg,
  vanoTipico: pos,
  tasaFallasEquipo: pos,
  tasaFallasKm: pos, // divisor
  tasaFallasEquipoInt: pos,
  tasaFallasKmInt: pos, // divisor

  ksInterno: pos,
  ksExterno: pos,
  mFrecInd: pos,
  mManiobra: pos,
  mAtmosferico: pos,

  umNormalizado: pos,
  sdwSeleccionado: pos,
  bilSeleccionado: pos,

  kco: pos, // divisor
  longitudPendiente: pos, // divisor
  margenProteccion: pos,

  factorFiSiwExterno: pos,
  factorFiSiwInterno: pos,
  siwFtSeleccionado: pos,
  siwFfSeleccionado: pos,
}) satisfies z.ZodType<Entradas>;

/** Valida un objeto desconocido como proyecto. Lanza ZodError con detalle si es inválido. */
export function validarProyecto(datos: unknown): Entradas {
  return EsquemaEntradas.parse(datos);
}
