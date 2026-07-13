/** Esquema de entradas de la coordinación de aislamiento. Espeja la hoja ENTRADAS del Excel. */
export interface Entradas {
  // 1. Proyecto
  proyecto: string;
  estudio: string;
  revision: string;
  ingeniero: string;

  // 2. Sistema eléctrico
  us: number; // Tensión de operación del sistema, kV
  factorUm: number; // Factor de tensión máxima (típ. 1.05)
  frecuencia: number; // Hz
  altitud: number; // m.s.n.m.
  fugaEspecifica: number; // mm/kV
  puestaTierra: string;

  // 3. Impedancias de secuencia (Ω)
  r0: number;
  x0: number;
  r1: number;
  x1: number;

  // 4. Sobretensiones — lecturas de figuras IEC 60071-2
  factorRechazoCarga: number; // p.ej. 1.7 con generador
  ue2: number; // p.u., Figura 1
  relacionUp2Ue2: number; // Figura 2
  kcdFt: number; // Figura 6, curva a
  kcdFf: number; // Figura 6, curva b

  // 5. Pararrayos
  factorCov: number; // To
  factorTov: number; // sobretensión temporal 10 s
  factorSeguridadR: number; // factor de seguridad para R
  tensionNominalR: number; // kV, catálogo
  ups: number; // nivel protección maniobra, kV
  upl: number; // nivel protección rayo, kV
  descripcionPararrayos: string;

  // 6. Frente rápido — Anexo F (externo / interno)
  factorA: number; // Tabla F.2
  nLineas: number; // cantidad mínima de líneas
  a1: number; // conductor pararrayos-línea, m
  a2: number; // conductor pararrayos-tierra, m
  a3: number; // conductor fase pararrayos-equipo, m
  a4: number; // parte activa del pararrayos, m
  a1i: number; // idem interno
  a2i: number;
  a3i: number;
  a4i: number;
  vanoTipico: number; // Lsp, m
  tasaFallasEquipo: number; // Ra externo, 1/año
  tasaFallasKm: number; // Rkm externo, 1/(km·año)
  tasaFallasEquipoInt: number; // Ra interno, 1/año
  tasaFallasKmInt: number; // Rkm interno, 1/(km·año)

  // 7. Factores de seguridad y corrección por altitud
  ksInterno: number;
  ksExterno: number;
  mFrecInd: number; // exponente m
  mManiobra: number;
  mAtmosferico: number;

  // 8. Niveles normalizados seleccionados
  umNormalizado: number; // kV
  sdwSeleccionado: number; // kV rms (Rango I)
  bilSeleccionado: number; // kV pico

  // 9. Distancia máxima de protección del pararrayos
  kco: number; // µs/(kV·m)
  longitudPendiente: number; // L, m
  margenProteccion: number; // sobre el BIL

  // 10. Parámetros adicionales Rango II
  factorFiSiwExterno: number; // 1.4 típico
  factorFiSiwInterno: number; // 2.3 típico
  siwFtSeleccionado: number; // kV pico (solo Rango II)
  siwFfSeleccionado: number; // kV pico (solo Rango II)
}

export type Rango = 'I' | 'II';
export type Verificacion = 'CUMPLE' | 'NO CUMPLE' | 'No aplica';

export interface ResultadoTension {
  faseTierra: number;
  faseFase: number;
}

export interface Resultados {
  rango: Rango;

  // 1. Parámetros
  um: number;
  fugaTotal: number;

  // 2. Urp
  ub: number; // tensión base
  kCalculado: number; // factor de falla a tierra
  kAdoptado: number;
  tovFaseTierraFalla: number;
  tovRechazoFt: number;
  tovRechazoFf: number;
  urpTovFt: number;
  urpTovFf: number;
  uet: number; // truncamiento frente lento f-t
  upt: number; // truncamiento frente lento f-f
  // pararrayos
  cov: number;
  tov: number;
  r1Pararrayos: number;
  r2Pararrayos: number;
  rMinimo: number;
  verificacionPararrayos: Verificacion;
  urpSfFt: number; // frente lento con pararrayos
  urpSfFf: number;

  // 3. Ucw
  ucwTovFt: number;
  ucwTovFf: number;
  ratioEntradaFt: number;
  ratioEntradaFf: number;
  ucwSfFt: number;
  ucwSfFf: number;
  leqExterno: number;
  leqInterno: number;
  ucwFrExterno: number; // frente rápido
  ucwFrInterno: number;

  // 4. Urw + Ka
  kaFrecInd: number;
  kaManiobra: number;
  kaAtmosferico: number;
  urwEntradaLinea: TablaUrw;
  urwOtrosEquipos: TablaUrw;

  // 5-6. Resumen requeridas
  resumen: FilaResumen[];

  // 7. Selección Rango I
  umSugerido: number | string;
  sdwRequerido: number;
  sdwSugerido: number | string;
  verificacionSdw: Verificacion;
  liwRequeridoAtm: number; // requerimiento directo por impulso atmosférico
  liwPorManiobra: number; // LIW exigido por maniobra dado el SDW seleccionado (incluye GIS)
  liwRequerido: number; // total = máx(atmosférico; maniobra)
  liwSugerido: number | string;
  verificacionLiw: Verificacion;
  verificacionManiobra: Verificacion;

  // 8. Distancias Rango I
  distanciaA1: number;

  // 9. Distancia protección pararrayos
  upConMargen: number;
  pendienteFrente: number;
  distanciaMaxProteccion: number;
  distanciaReal: number;
  verificacionDistancia: Verificacion;

  // 10. Selección Rango II
  umSugeridoII: number | string;
  siwFtRequerido: number;
  siwFtSugerido: number | string;
  verificacionSiwFt: Verificacion;
  siwFfRequerido: number;
  siwFfSugerido: number | string;
  verificacionSiwFf: Verificacion;
  liwRequeridoII: number;
  liwSugeridoII: number | string;
  verificacionLiwII: Verificacion;

  // 11. Distancias Rango II
  distanciasII: FilaDistanciaII[];
}

export interface TablaUrw {
  fiFt: { ucwExt: number; ucwInt: number; urwExt: number; urwInt: number };
  fiFf: { ucwExt: number; ucwInt: number; urwExt: number; urwInt: number };
  sfFt: { ucwExt: number; ucwInt: number; urwExt: number; urwInt: number };
  sfFf: { ucwExt: number; ucwInt: number; urwExt: number; urwInt: number };
  atFt: { ucwExt: number; ucwInt: number; urwExt: number; urwInt: number };
  atFf: { ucwExt: number; ucwInt: number; urwExt: number; urwInt: number };
}

export interface FilaResumen {
  solicitacion: string;
  configuracion: string;
  extEntradaLinea: number;
  extOtrosEquipos: number;
  interno: number;
  gis: number | null;
}

export interface FilaDistanciaII {
  configuracion: string;
  detalle: string;
  porRayo: number;
  porManiobra: number;
  adoptada: number;
}
