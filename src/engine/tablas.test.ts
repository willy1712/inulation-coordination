import { describe, it, expect } from 'vitest';
import {
  TABLA_2, TABLA_3, TABLA_A1, TABLA_A2, TABLA_A3, primeroMayorIgual,
} from './tablas-iec';
import { validarProyecto } from './esquema';
import { ENTRADAS_DEFECTO, ENTRADAS_500KV } from './defaults';

describe('Integridad de las tablas IEC (detecta errores de transcripción)', () => {
  it('Tabla 2: 31 combinaciones, valores estrictamente positivos', () => {
    expect(TABLA_2.length).toBe(31);
    for (const f of TABLA_2) {
      expect(f.um).toBeGreaterThan(0);
      expect(f.sdw).toBeGreaterThan(0);
      expect(f.liw).toBeGreaterThan(f.sdw); // el BIL siempre supera al SDW
    }
  });

  it('Tabla 2: cubre Um 3.6 a 245 y el grupo de 24 kV tiene BIL 95/125/145', () => {
    const ums = [...new Set(TABLA_2.map((f) => f.um))];
    expect(Math.min(...ums)).toBe(3.6);
    expect(Math.max(...ums)).toBe(245);
    expect(TABLA_2.filter((f) => f.um === 24).map((f) => f.liw)).toEqual([95, 125, 145]);
  });

  it('Tabla 3: 38 combinaciones y SIW f-f coherente con SIW f-t × relación (±0.6 kV)', () => {
    expect(TABLA_3.length).toBe(38);
    for (const f of TABLA_3) {
      expect(Math.abs(f.siwFf - f.siwFt * f.relacionFf)).toBeLessThanOrEqual(0.6);
      expect(f.liw).toBeGreaterThan(f.siwFt); // el BIL asociado supera al SIW f-t
    }
  });

  it('Tabla A.1: BIL y distancias monótonamente no decrecientes', () => {
    for (let i = 1; i < TABLA_A1.length; i++) {
      expect(TABLA_A1[i].bil).toBeGreaterThan(TABLA_A1[i - 1].bil);
      expect(TABLA_A1[i].puntaEstructura).toBeGreaterThanOrEqual(TABLA_A1[i - 1].puntaEstructura);
      expect(TABLA_A1[i].conductorEstructura).toBeGreaterThanOrEqual(TABLA_A1[i - 1].conductorEstructura);
      // punta-estructura es la configuración más desfavorable: nunca menor que conductor
      expect(TABLA_A1[i].puntaEstructura).toBeGreaterThanOrEqual(TABLA_A1[i].conductorEstructura);
    }
  });

  it('Tabla A.2: monótona y punta ≥ conductor', () => {
    for (let i = 0; i < TABLA_A2.length; i++) {
      if (i > 0) expect(TABLA_A2[i].siwFt).toBeGreaterThan(TABLA_A2[i - 1].siwFt);
      expect(TABLA_A2[i].puntaEstructura).toBeGreaterThanOrEqual(TABLA_A2[i].conductorEstructura);
    }
  });

  it('Tabla A.3: monótona y punta-conductor ≥ conductor-conductor', () => {
    for (let i = 0; i < TABLA_A3.length; i++) {
      if (i > 0) expect(TABLA_A3[i].siwFf).toBeGreaterThan(TABLA_A3[i - 1].siwFf);
      expect(TABLA_A3[i].puntaConductor).toBeGreaterThanOrEqual(TABLA_A3[i].conductorConductor);
    }
  });

  it('primeroMayorIgual: selección por escalón correcta', () => {
    expect(primeroMayorIgual(TABLA_A1, (f) => f.bil, 125)?.puntaEstructura).toBe(220);
    expect(primeroMayorIgual(TABLA_A1, (f) => f.bil, 126)?.puntaEstructura).toBe(270);
    expect(primeroMayorIgual(TABLA_A1, (f) => f.bil, 9999)).toBeNull();
  });
});

describe('Esquema de validación de proyectos', () => {
  it('acepta los casos por defecto', () => {
    expect(() => validarProyecto(ENTRADAS_DEFECTO)).not.toThrow();
    expect(() => validarProyecto(ENTRADAS_500KV)).not.toThrow();
  });

  it('rechaza texto en un campo numérico', () => {
    expect(() => validarProyecto({ ...ENTRADAS_DEFECTO, us: '22.9' })).toThrow();
  });

  it('rechaza divisores en cero (evita NaN silencioso)', () => {
    expect(() => validarProyecto({ ...ENTRADAS_DEFECTO, tasaFallasKm: 0 })).toThrow();
    expect(() => validarProyecto({ ...ENTRADAS_DEFECTO, nLineas: 0 })).toThrow();
    expect(() => validarProyecto({ ...ENTRADAS_DEFECTO, kco: 0 })).toThrow();
  });

  it('rechaza un objeto incompleto', () => {
    expect(() => validarProyecto({ proyecto: 'X' })).toThrow();
  });
});
