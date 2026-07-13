import {
  TABLA_2, TABLA_3, TABLA_A1, TABLA_A2, TABLA_A3, primeroMayorIgual,
} from './tablas-iec';
import type {
  Entradas, Resultados, Rango, Verificacion, TablaUrw, FilaResumen, FilaDistanciaII,
} from './tipos';

const SQRT3 = Math.sqrt(3);

/** Módulo de un complejo. */
function cabs(re: number, im: number): number {
  return Math.hypot(re, im);
}
/** División compleja (a+bi)/(c+di). */
function cdiv(ar: number, ai: number, br: number, bi: number): [number, number] {
  const den = br * br + bi * bi;
  return [(ar * br + ai * bi) / den, (ai * br - ar * bi) / den];
}

/**
 * Factor de falla a tierra k por componentes simétricas (falla monofásica, Z2 = Z1).
 * Replica el bloque IMDIV/IMABS de la hoja: k = máx(|Vb|, |Vc|) de las fases sanas.
 */
function factorFallaTierra(r0: number, x0: number, r1: number, x1: number): number {
  // término = (Z0 - Z1) / (2·Z1 + Z0)
  const z0r = r0, z0i = x0, z1r = r1, z1i = x1;
  const numR = z0r - z1r, numI = z0i - z1i;
  const denR = 2 * z1r + z0r, denI = 2 * z1i + z0i;
  const [tr, ti] = cdiv(numR, numI, denR, denI);
  // Operadores de fase a² y a
  const a2r = -0.5, a2i = -SQRT3 / 2;
  const ar = -0.5, ai = SQRT3 / 2;
  const vb = cabs(a2r - tr, a2i - ti);
  const vc = cabs(ar - tr, ai - ti);
  return Math.max(vb, vc);
}

function verif(cumple: boolean): Verificacion {
  return cumple ? 'CUMPLE' : 'NO CUMPLE';
}

/** Redondeo a n decimales, evitando errores de coma flotante en comparaciones. */
function r(x: number, n = 6): number {
  const f = 10 ** n;
  return Math.round(x * f) / f;
}

export function calcular(e: Entradas): Resultados {
  // ---------- 1. Parámetros ----------
  const um = e.us * e.factorUm;
  const rango: Rango = um > 245 ? 'II' : 'I';
  const fugaTotal = e.fugaEspecifica * um;

  // ---------- 2. Urp ----------
  const ub = Math.round(Math.sqrt(2 / 3) * um); // tensión base redondeada
  const kCalculado = r(factorFallaTierra(e.r0, e.x0, e.r1, e.x1), 3);
  const kAdoptado = r(kCalculado, 2);

  const tovFaseTierraFalla = r(kAdoptado * (um / SQRT3), 1);
  const tovRechazoFt = e.factorRechazoCarga * (um / SQRT3);
  const tovRechazoFf = e.factorRechazoCarga * um;
  const urpTovFt = Math.max(tovFaseTierraFalla, tovRechazoFt);
  const urpTovFf = tovRechazoFf;

  // frente lento
  const up2 = e.relacionUp2Ue2 * e.ue2;
  const uet = (1.25 * e.ue2 - 0.25) * ub;
  const upt = (1.25 * up2 - 0.43) * ub;

  // pararrayos
  const cov = r(um / SQRT3, 2);
  const tov = kAdoptado * cov;
  const r1Pararrayos = cov / e.factorCov;
  const r2Pararrayos = tov / e.factorTov;
  const rMinimo = e.factorSeguridadR * Math.max(r1Pararrayos, r2Pararrayos);
  const verificacionPararrayos = verif(e.tensionNominalR >= rMinimo);

  const urpSfFt = Math.min(e.ups, uet);
  const urpSfFf = Math.min(2 * e.ups, upt);

  // ---------- 3. Ucw ----------
  const ucwTovFt = 1 * urpTovFt;
  const ucwTovFf = 1 * urpTovFf;

  const ratioEntradaFt = r(e.ups / (e.ue2 * ub), 3);
  const ratioEntradaFf = r((2 * e.ups) / (up2 * ub), 3);
  const ucwSfFt = e.kcdFt * urpSfFt;
  const ucwSfFf = e.kcdFf * urpSfFf;

  const leqExterno = (e.tasaFallasEquipo / e.tasaFallasKm) * 1000;
  const leqInterno = (e.tasaFallasEquipoInt / e.tasaFallasKmInt) * 1000;
  const lExterno = e.a1 + e.a2 + e.a3 + e.a4;
  const lInterno = e.a1i + e.a2i + e.a3i + e.a4i;
  const ucwFrExterno = e.upl + (e.factorA / e.nLineas) * (lExterno / (e.vanoTipico + leqExterno));
  const ucwFrInterno = e.upl + (e.factorA / e.nLineas) * (lInterno / (e.vanoTipico + leqInterno));

  // ---------- 4. Urw + Ka ----------
  const ka = (m: number) => Math.exp(m * ((e.altitud - 1000) / 8150));
  const kaFrecInd = ka(e.mFrecInd);
  const kaManiobra = ka(e.mManiobra);
  const kaAtmosferico = ka(e.mAtmosferico);

  const construirUrw = (): TablaUrw => {
    const fila = (ucwExt: number, ucwInt: number, kaSel: number) => ({
      ucwExt, ucwInt,
      urwExt: ucwExt * e.ksExterno * kaSel,
      urwInt: ucwInt * e.ksInterno,
    });
    return {
      fiFt: fila(ucwTovFt, ucwTovFt, kaFrecInd),
      fiFf: fila(ucwTovFf, ucwTovFf, kaFrecInd),
      sfFt: fila(ucwSfFt, ucwSfFt, kaManiobra),
      sfFf: fila(ucwSfFf, ucwSfFf, kaManiobra),
      atFt: fila(ucwFrExterno, ucwFrInterno, kaAtmosferico),
      atFf: fila(ucwFrExterno, ucwFrInterno, kaAtmosferico),
    };
  };
  const urwEntradaLinea = construirUrw();
  const urwOtrosEquipos = construirUrw(); // mismas fórmulas; se separan para claridad de reporte

  // ---------- 5. Conversión a SDW/LIW (Rango I) ----------
  const el = urwEntradaLinea;
  const ot = urwOtrosEquipos;
  // SDW
  const sdwExtFt = (u: number) => u * (0.6 + u / 8500);
  const sdwExtFf = (u: number) => u * (0.6 + u / 12700);
  // LIW
  const liwExtFf = (u: number) => u * (1.05 + u / 9000);

  const sdwEntFt = sdwExtFt(el.sfFt.urwExt);
  const sdwEntFf = sdwExtFf(el.sfFf.urwExt);
  const sdwOtFt = sdwExtFt(ot.sfFt.urwExt);
  const sdwOtFf = sdwExtFf(ot.sfFf.urwExt);
  const sdwIntFt = 0.5 * ot.sfFt.urwInt;
  const sdwIntFf = 0.5 * ot.sfFf.urwInt;
  const sdwGisFt = 0.7 * ot.sfFt.urwInt;
  const sdwGisFf = 0.7 * ot.sfFf.urwInt;

  const liwEntFt = 1.3 * el.sfFt.urwExt;
  const liwEntFf = liwExtFf(el.sfFf.urwExt);
  const liwOtFt = 1.3 * ot.sfFt.urwExt;
  const liwOtFf = liwExtFf(ot.sfFf.urwExt);
  const liwIntFt = 1.1 * ot.sfFt.urwInt;
  const liwIntFf = 1.1 * ot.sfFf.urwInt;
  const liwGisFt = 1.25 * ot.sfFt.urwInt;
  const liwGisFf = 1.25 * ot.sfFf.urwInt;

  // ---------- 6. Resumen ----------
  const resumen: FilaResumen[] = [
    {
      solicitacion: 'Frecuencia industrial', configuracion: 'Fase-tierra',
      extEntradaLinea: Math.max(el.fiFt.urwExt, sdwEntFt),
      extOtrosEquipos: Math.max(ot.fiFt.urwExt, sdwOtFt),
      interno: Math.max(ot.fiFt.urwInt, sdwIntFt), gis: sdwGisFt,
    },
    {
      solicitacion: 'Frecuencia industrial', configuracion: 'Fase-fase',
      extEntradaLinea: Math.max(el.fiFf.urwExt, sdwEntFf),
      extOtrosEquipos: Math.max(ot.fiFf.urwExt, sdwOtFf),
      interno: Math.max(ot.fiFf.urwInt, sdwIntFf), gis: sdwGisFf,
    },
    {
      solicitacion: 'Impulso de maniobra', configuracion: 'Fase-tierra',
      extEntradaLinea: el.sfFt.urwExt, extOtrosEquipos: ot.sfFt.urwExt,
      interno: ot.sfFt.urwInt, gis: null,
    },
    {
      solicitacion: 'Impulso de maniobra', configuracion: 'Fase-fase',
      extEntradaLinea: el.sfFf.urwExt, extOtrosEquipos: ot.sfFf.urwExt,
      interno: ot.sfFf.urwInt, gis: null,
    },
    {
      solicitacion: 'Impulso atmosférico', configuracion: 'Fase-tierra',
      extEntradaLinea: Math.max(el.atFt.urwExt, liwEntFt),
      extOtrosEquipos: Math.max(ot.atFt.urwExt, liwOtFt),
      interno: Math.max(ot.atFt.urwInt, liwIntFt), gis: liwGisFt,
    },
    {
      solicitacion: 'Impulso atmosférico', configuracion: 'Fase-fase',
      extEntradaLinea: Math.max(el.atFf.urwExt, liwEntFf),
      extOtrosEquipos: Math.max(ot.atFf.urwExt, liwOtFf),
      interno: Math.max(ot.atFf.urwInt, liwIntFf), gis: liwGisFf,
    },
  ];

  // ---------- 7. Selección Rango I ----------
  const filaUm1 = primeroMayorIgual(TABLA_2, (f) => f.um, um);
  const umSugerido = rango === 'II' ? 'Rango II: ver §10' : filaUm1 ? filaUm1.um : 'Um insuficiente';

  // SDW requerido: máximo de los Urw directos a frecuencia industrial (F150 del Excel,
  // que lee las columnas Urw(s) directas, no el máximo con el valor convertido).
  const sdwRequerido = Math.max(
    el.fiFt.urwExt, ot.fiFt.urwExt, ot.fiFt.urwInt,
    el.fiFf.urwExt, ot.fiFf.urwExt, ot.fiFf.urwInt
  );
  const filaSdw = TABLA_2
    .filter((f) => f.um === e.umNormalizado)
    .sort((a, b) => a.sdw - b.sdw)
    .find((f) => f.sdw >= sdwRequerido);
  const sdwSugerido = rango === 'II' ? 'No aplica (Rango II)'
    : filaSdw ? filaSdw.sdw : 'Um insuficiente';
  const verificacionSdw: Verificacion = rango === 'II' ? 'No aplica'
    : verif(e.sdwSeleccionado >= sdwRequerido);

  // Requerimiento directo por impulso atmosférico (F155 del Excel: Urw directos, sin GIS)
  const liwRequeridoAtm = Math.max(
    el.atFt.urwExt, ot.atFt.urwExt, ot.atFt.urwInt,
    el.atFf.urwExt, ot.atFf.urwExt, ot.atFf.urwInt
  );
  // LIW exigido por maniobra: si el SDW seleccionado no cubre la conversión, el LIW debe
  // cubrirla. Incluye los pares GIS, igual que el helper G118:H123 del Excel.
  const conv = [
    { sdw: sdwEntFt, liw: liwEntFt }, { sdw: sdwEntFf, liw: liwEntFf },
    { sdw: sdwOtFt, liw: liwOtFt }, { sdw: sdwOtFf, liw: liwOtFf },
    { sdw: sdwIntFt, liw: liwIntFt }, { sdw: sdwIntFf, liw: liwIntFf },
    { sdw: sdwGisFt, liw: liwGisFt }, { sdw: sdwGisFf, liw: liwGisFf },
  ];
  const liwPorManiobra = Math.max(
    ...conv.map((c) => (c.sdw <= e.sdwSeleccionado ? 0 : c.liw)), 0
  );
  const liwRequeridoTotal = Math.max(liwRequeridoAtm, liwPorManiobra);
  const filaLiw = TABLA_2
    .filter((f) => f.um === e.umNormalizado)
    .sort((a, b) => a.liw - b.liw)
    .find((f) => f.liw >= liwRequeridoTotal);
  const liwSugerido = rango === 'II' ? 'No aplica (Rango II)'
    : filaLiw ? filaLiw.liw : 'Um insuficiente';
  // Verificación atmosférica: BIL ≥ requerimiento directo (F160 del Excel)
  const verificacionLiw: Verificacion = rango === 'II' ? 'No aplica'
    : verif(e.bilSeleccionado >= liwRequeridoAtm);
  // Maniobra cubierta caso a caso por SDW o LIW (SUMPRODUCT del Excel, incluye GIS)
  const maniobraCubierta = conv.every(
    (c) => c.sdw <= e.sdwSeleccionado || c.liw <= e.bilSeleccionado
  );
  const verificacionManiobra: Verificacion = rango === 'II' ? 'No aplica' : verif(maniobraCubierta);

  // ---------- 8. Distancias Rango I ----------
  const filaDistA1 = primeroMayorIgual(TABLA_A1, (f) => f.bil, e.bilSeleccionado);
  const distanciaA1 = filaDistA1 ? filaDistA1.puntaEstructura : 0;

  // ---------- 9. Distancia máxima de protección ----------
  const upConMargen = e.margenProteccion * e.bilSeleccionado;
  const pendienteFrente = 1 / (e.nLineas * e.kco * e.longitudPendiente);
  const distanciaMaxProteccion = (300 * (upConMargen - e.upl)) / (2 * pendienteFrente);
  const distanciaReal = e.a1 + e.a3;
  const verificacionDistancia = verif(distanciaReal <= distanciaMaxProteccion);

  // ---------- 10. Selección Rango II ----------
  const esII = rango === 'II';
  const filaUm2 = primeroMayorIgual(TABLA_3, (f) => f.um, um);
  const umSugeridoII = !esII ? 'No aplica' : filaUm2 ? filaUm2.um : 'Um insuficiente';

  const siwFtRequerido = Math.max(
    el.sfFt.urwExt, ot.sfFt.urwExt, el.sfFt.urwInt, ot.sfFt.urwInt,
    e.factorFiSiwExterno * Math.max(el.fiFt.urwExt, ot.fiFt.urwExt),
    e.factorFiSiwInterno * Math.max(el.fiFt.urwInt, ot.fiFt.urwInt)
  );
  const filaSiwFt = TABLA_3
    .filter((f) => f.um === e.umNormalizado)
    .sort((a, b) => a.siwFt - b.siwFt)
    .find((f) => f.siwFt >= siwFtRequerido);
  const siwFtSugerido = !esII ? 'No aplica' : filaSiwFt ? filaSiwFt.siwFt : 'Um insuficiente';
  const verificacionSiwFt: Verificacion = !esII ? 'No aplica'
    : verif(e.siwFtSeleccionado >= siwFtRequerido);

  const siwFfRequerido = Math.max(
    el.sfFf.urwExt, ot.sfFf.urwExt, el.sfFf.urwInt, ot.sfFf.urwInt,
    e.factorFiSiwExterno * Math.max(el.fiFf.urwExt, ot.fiFf.urwExt),
    e.factorFiSiwInterno * Math.max(el.fiFf.urwInt, ot.fiFf.urwInt)
  );
  const filaSiwFf = TABLA_3
    .filter((f) => f.um === e.umNormalizado)
    .sort((a, b) => a.siwFf - b.siwFf)
    .find((f) => f.siwFf >= siwFfRequerido);
  const siwFfSugerido = !esII ? 'No aplica' : filaSiwFf ? filaSiwFf.siwFf : 'Um insuficiente';
  const verificacionSiwFf: Verificacion = !esII ? 'No aplica'
    : verif(e.siwFfSeleccionado >= siwFfRequerido);

  const liwRequeridoII = liwRequeridoAtm;
  const filaLiwII = TABLA_3
    .filter((f) => f.um === e.umNormalizado)
    .sort((a, b) => a.liw - b.liw)
    .find((f) => f.liw >= liwRequeridoII);
  const liwSugeridoII = !esII ? 'No aplica' : filaLiwII ? filaLiwII.liw : 'Um insuficiente';
  const verificacionLiwII: Verificacion = !esII ? 'No aplica'
    : verif(e.bilSeleccionado >= liwRequeridoII);

  // ---------- 11. Distancias Rango II ----------
  const lkup = <T,>(tabla: T[], campo: (f: T) => number, valor: number, salida: (f: T) => number) => {
    const f = primeroMayorIgual(tabla, campo, valor);
    return f ? salida(f) : 0;
  };
  const distanciasII: FilaDistanciaII[] = esII
    ? [
        {
          configuracion: 'Fase-tierra', detalle: 'Conductor-estructura',
          porRayo: lkup(TABLA_A1, (f) => f.bil, e.bilSeleccionado, (f) => f.conductorEstructura),
          porManiobra: lkup(TABLA_A2, (f) => f.siwFt, e.siwFtSeleccionado, (f) => f.conductorEstructura),
          adoptada: 0,
        },
        {
          configuracion: 'Fase-tierra', detalle: 'Punta-estructura',
          porRayo: lkup(TABLA_A1, (f) => f.bil, e.bilSeleccionado, (f) => f.puntaEstructura),
          porManiobra: lkup(TABLA_A2, (f) => f.siwFt, e.siwFtSeleccionado, (f) => f.puntaEstructura),
          adoptada: 0,
        },
        {
          configuracion: 'Fase-fase', detalle: 'Conductor-conductor paralelo',
          porRayo: lkup(TABLA_A1, (f) => f.bil, e.bilSeleccionado, (f) => f.puntaEstructura),
          porManiobra: lkup(TABLA_A3, (f) => f.siwFf, e.siwFfSeleccionado, (f) => f.conductorConductor),
          adoptada: 0,
        },
        {
          configuracion: 'Fase-fase', detalle: 'Punta-conductor',
          porRayo: lkup(TABLA_A1, (f) => f.bil, e.bilSeleccionado, (f) => f.puntaEstructura),
          porManiobra: lkup(TABLA_A3, (f) => f.siwFf, e.siwFfSeleccionado, (f) => f.puntaConductor),
          adoptada: 0,
        },
      ].map((d) => ({ ...d, adoptada: Math.max(d.porRayo, d.porManiobra) }))
    : [];

  return {
    rango, um, fugaTotal, ub, kCalculado, kAdoptado,
    tovFaseTierraFalla, tovRechazoFt, tovRechazoFf, urpTovFt, urpTovFf, uet, upt,
    cov, tov, r1Pararrayos, r2Pararrayos, rMinimo, verificacionPararrayos, urpSfFt, urpSfFf,
    ucwTovFt, ucwTovFf, ratioEntradaFt, ratioEntradaFf, ucwSfFt, ucwSfFf,
    leqExterno, leqInterno, ucwFrExterno, ucwFrInterno,
    kaFrecInd, kaManiobra, kaAtmosferico, urwEntradaLinea, urwOtrosEquipos,
    resumen,
    umSugerido, sdwRequerido, sdwSugerido, verificacionSdw,
    liwRequeridoAtm, liwPorManiobra, liwRequerido: liwRequeridoTotal,
    liwSugerido, verificacionLiw, verificacionManiobra,
    distanciaA1,
    upConMargen, pendienteFrente, distanciaMaxProteccion, distanciaReal, verificacionDistancia,
    umSugeridoII, siwFtRequerido, siwFtSugerido, verificacionSiwFt,
    siwFfRequerido, siwFfSugerido, verificacionSiwFf,
    liwRequeridoII, liwSugeridoII, verificacionLiwII,
    distanciasII,
  };
}
