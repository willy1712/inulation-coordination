import { describe, it, expect } from 'vitest';
import { calcular } from './calcular';
import { ENTRADAS_DEFECTO, ENTRADAS_500KV } from './defaults';

/**
 * Golden-master: los valores esperados provienen de la hoja Excel ya validada
 * (recalculada con LibreOffice). Si el motor coincide, la migración es fiel.
 */
describe('Caso 22.9 kV (Rango I) — reproduce el Excel validado', () => {
  const rr = calcular(ENTRADAS_DEFECTO);
  const cerca = (a: number, b: number, tol = 0.05) => Math.abs(a - b) <= tol;

  it('rango es I', () => expect(rr.rango).toBe('I'));
  it('Um = 24.045 kV', () => expect(cerca(rr.um, 24.045)).toBe(true));
  it('tensión base Ub = 20 kV', () => expect(rr.ub).toBe(20));
  it('k calculado ≈ 1.018', () => expect(cerca(rr.kCalculado, 1.018, 0.002)).toBe(true));
  it('k adoptado = 1.02', () => expect(rr.kAdoptado).toBe(1.02));
  it('TOV falla f-t = 14.2 kV', () => expect(cerca(rr.tovFaseTierraFalla, 14.2)).toBe(true));
  it('rechazo carga f-t ≈ 23.60 kV', () => expect(cerca(rr.tovRechazoFt, 23.6)).toBe(true));
  it('rechazo carga f-f ≈ 40.88 kV', () => expect(cerca(rr.tovRechazoFf, 40.88)).toBe(true));
  it('Uet ≈ 52.75 kV', () => expect(cerca(rr.uet, 52.75)).toBe(true));
  it('Upt ≈ 78.66 kV', () => expect(cerca(rr.upt, 78.66)).toBe(true));
  it('COV ≈ 13.88 kV', () => expect(cerca(rr.cov, 13.88)).toBe(true));
  it('R mínimo ≈ 19.09 kV', () => expect(cerca(rr.rMinimo, 19.09)).toBe(true));
  it('pararrayos CUMPLE', () => expect(rr.verificacionPararrayos).toBe('CUMPLE'));
  it('Urp frente lento f-t = 48.7 kV', () => expect(cerca(rr.urpSfFt, 48.7)).toBe(true));
  it('Urp frente lento f-f ≈ 78.66 kV', () => expect(cerca(rr.urpSfFf, 78.66)).toBe(true));
  it('ratio entrada f-t ≈ 1.054', () => expect(cerca(rr.ratioEntradaFt, 1.054, 0.002)).toBe(true));
  it('Ucw maniobra f-t ≈ 50.06 kV', () => expect(cerca(rr.ucwSfFt, 50.06)).toBe(true));
  it('Ucw frente rápido externo ≈ 68.26 kV', () => expect(cerca(rr.ucwFrExterno, 68.26)).toBe(true));
  it('Ka frecuencia industrial ≈ 1.1482', () => expect(cerca(rr.kaFrecInd, 1.1482, 0.001)).toBe(true));
  it('SDW requerido ≈ 49.28 kV', () => expect(cerca(rr.sdwRequerido, 49.28)).toBe(true));
  it('SDW sugerido = 50', () => expect(rr.sdwSugerido).toBe(50));
  it('verificación SDW CUMPLE', () => expect(rr.verificacionSdw).toBe('CUMPLE'));
  // Los tres valores LIW, verificados contra el Excel:
  // F155 (atm directo) = 82.30 · F156 (por maniobra, incl. GIS) = 113.07 · F157 (total) = 113.07
  it('LIW requerido atmosférico ≈ 82.30 kV', () => expect(cerca(rr.liwRequeridoAtm, 82.3)).toBe(true));
  it('LIW por maniobra (incl. GIS) ≈ 113.07 kV', () => expect(cerca(rr.liwPorManiobra, 113.07)).toBe(true));
  it('LIW requerido total ≈ 113.07 kV', () => expect(cerca(rr.liwRequerido, 113.07)).toBe(true));
  it('LIW sugerido = 125', () => expect(rr.liwSugerido).toBe(125));
  it('verificación LIW CUMPLE', () => expect(rr.verificacionLiw).toBe('CUMPLE'));
  it('verificación maniobra CUMPLE', () => expect(rr.verificacionManiobra).toBe('CUMPLE'));
  it('distancia mínima A.1 = 220 mm', () => expect(rr.distanciaA1).toBe(220));
  it('distancia máx protección ≈ 4.13 m', () => expect(cerca(rr.distanciaMaxProteccion, 4.13)).toBe(true));
  it('verificación distancia CUMPLE', () => expect(rr.verificacionDistancia).toBe('CUMPLE'));
  it('secciones Rango II marcadas No aplica', () => {
    expect(rr.verificacionSiwFt).toBe('No aplica');
    expect(rr.distanciasII.length).toBe(0);
  });
});

describe('Caso 500 kV (Rango II) — camino de rango II', () => {
  const rr = calcular(ENTRADAS_500KV);
  const cerca = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;

  it('rango es II', () => expect(rr.rango).toBe('II'));
  it('Um = 525 kV', () => expect(cerca(rr.um, 525)).toBe(true));
  it('selección Rango I marcada No aplica', () => expect(rr.verificacionSdw).toBe('No aplica'));
  it('Um sugerido Tabla 3 = 550', () => expect(rr.umSugeridoII).toBe(550));
  it('LIW Rango II requerido ≈ 1151 kV, cubierto por BIL 1550', () => {
    expect(cerca(rr.liwRequeridoII, 1151, 2)).toBe(true);
    expect(rr.verificacionLiwII).toBe('CUMPLE');
  });
  // El SIW f-t requerido se dispara por la conversión FI→SIW con el factor de rechazo
  // heredado (1.7): comportamiento correcto que avisa de afinar las hipótesis de TOV en EHV.
  it('SIW f-t requerido supera al seleccionado (hipótesis TOV a revisar)', () =>
    expect(rr.verificacionSiwFt).toBe('NO CUMPLE'));
  it('genera 4 filas de distancias', () => expect(rr.distanciasII.length).toBe(4));
  it('distancia f-t punta = max(rayo, maniobra)', () => {
    const ftPunta = rr.distanciasII[1];
    expect(ftPunta.adoptada).toBe(Math.max(ftPunta.porRayo, ftPunta.porManiobra));
  });
});
