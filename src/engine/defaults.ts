import type { Entradas } from './tipos';

/** Caso base validado: SE TUPURI, 22.9 kV (Rango I). Espeja la hoja ENTRADAS del Excel. */
export const ENTRADAS_DEFECTO: Entradas = {
  proyecto: 'SE TUPURI',
  estudio: 'Coordinación de aislamiento en 22.9 kV',
  revision: 'A',
  ingeniero: '',

  us: 22.9,
  factorUm: 1.05,
  frecuencia: 60,
  altitud: 2126,
  fugaEspecifica: 31,
  puestaTierra: 'Sólido',

  r0: 1.299,
  x0: 11.113,
  r1: 2.994,
  x1: 12.095,

  factorRechazoCarga: 1.7,
  ue2: 2.31,
  relacionUp2Ue2: 1.511,
  kcdFt: 1.028,
  kcdFf: 1.0,

  factorCov: 0.8,
  factorTov: 1.06,
  factorSeguridadR: 1.1,
  tensionNominalR: 21,
  ups: 48.7,
  upl: 63.3,
  descripcionPararrayos: 'Descargador de óxido de zinc POLIM-K, clase 2',

  factorA: 900,
  nLineas: 1,
  a1: 0.1, a2: 3, a3: 2.4, a4: 0.4,
  a1i: 0.1, a2i: 3, a3i: 2.4, a4i: 0.4,
  vanoTipico: 70,
  tasaFallasEquipo: 0.01,
  tasaFallasKm: 0.01,
  tasaFallasEquipoInt: 0.01,
  tasaFallasKmInt: 0.01,

  ksInterno: 1.15,
  ksExterno: 1.05,
  mFrecInd: 1,
  mManiobra: 1,
  mAtmosferico: 1,

  umNormalizado: 24,
  sdwSeleccionado: 50,
  bilSeleccionado: 125,

  kco: 0.0000015,
  longitudPendiente: 500,
  margenProteccion: 0.8,

  factorFiSiwExterno: 1.4,
  factorFiSiwInterno: 2.3,
  siwFtSeleccionado: 850,
  siwFfSeleccionado: 1275,
};

/** Caso de prueba Rango II: sistema 500 kV (Um 525). */
export const ENTRADAS_500KV: Entradas = {
  ...ENTRADAS_DEFECTO,
  proyecto: 'Prueba Rango II',
  estudio: 'Coordinación de aislamiento en 500 kV',
  us: 500,
  factorUm: 1.05,
  umNormalizado: 550,
  tensionNominalR: 420,
  ups: 858,
  upl: 950,
  bilSeleccionado: 1550,
  siwFtSeleccionado: 1175,
  siwFfSeleccionado: 1763,
};
