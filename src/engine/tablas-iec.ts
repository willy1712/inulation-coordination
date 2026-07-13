/**
 * Tablas normalizadas de IEC 60071-1:2006 + Amd.1:2010.
 * Los valores se transcriben de la norma (adopción IS/IEC de acceso público).
 * IMPORTANTE: verificar contra la edición vigente antes de usar en un proyecto real.
 * La responsabilidad de mantener estos valores sincronizados con la norma es del usuario.
 */

export const EDICION_NORMA = 'IEC 60071-1:2006 + Amd.1:2010 / IEC 60071-2';

/** Tabla 2 — Rango I (1 kV < Um ≤ 245 kV). SDW = frec. industrial; LIW = BIL. */
export interface FilaTabla2 {
  um: number; // kV rms
  sdw: number; // kV rms
  liw: number; // kV pico
}
export const TABLA_2: FilaTabla2[] = [
  { um: 3.6, sdw: 10, liw: 20 }, { um: 3.6, sdw: 10, liw: 40 },
  { um: 7.2, sdw: 20, liw: 40 }, { um: 7.2, sdw: 20, liw: 60 },
  { um: 12, sdw: 28, liw: 60 }, { um: 12, sdw: 28, liw: 75 }, { um: 12, sdw: 28, liw: 95 },
  { um: 17.5, sdw: 38, liw: 75 }, { um: 17.5, sdw: 38, liw: 95 },
  { um: 24, sdw: 50, liw: 95 }, { um: 24, sdw: 50, liw: 125 }, { um: 24, sdw: 50, liw: 145 },
  { um: 36, sdw: 70, liw: 145 }, { um: 36, sdw: 70, liw: 170 },
  { um: 52, sdw: 95, liw: 250 },
  { um: 72.5, sdw: 140, liw: 325 },
  { um: 100, sdw: 150, liw: 380 }, { um: 100, sdw: 185, liw: 450 },
  { um: 123, sdw: 185, liw: 450 }, { um: 123, sdw: 230, liw: 550 },
  { um: 145, sdw: 185, liw: 450 }, { um: 145, sdw: 230, liw: 550 }, { um: 145, sdw: 275, liw: 650 },
  { um: 170, sdw: 230, liw: 550 }, { um: 170, sdw: 275, liw: 650 }, { um: 170, sdw: 325, liw: 750 },
  { um: 245, sdw: 275, liw: 650 }, { um: 245, sdw: 325, liw: 750 },
  { um: 245, sdw: 360, liw: 850 }, { um: 245, sdw: 395, liw: 950 }, { um: 245, sdw: 460, liw: 1050 },
];

/** Tabla 3 — Rango II (Um > 245 kV). SIW = impulso de maniobra. */
export interface FilaTabla3 {
  um: number; // kV rms
  siwFt: number; // SIW fase-tierra, kV pico
  relacionFf: number; // relación f-f / f-t
  siwFf: number; // SIW fase-fase, kV pico
  liw: number; // BIL, kV pico
}
export const TABLA_3: FilaTabla3[] = [
  { um: 300, siwFt: 750, relacionFf: 1.5, siwFf: 1125, liw: 850 },
  { um: 300, siwFt: 750, relacionFf: 1.5, siwFf: 1125, liw: 950 },
  { um: 300, siwFt: 850, relacionFf: 1.5, siwFf: 1275, liw: 950 },
  { um: 300, siwFt: 850, relacionFf: 1.5, siwFf: 1275, liw: 1050 },
  { um: 362, siwFt: 850, relacionFf: 1.5, siwFf: 1275, liw: 950 },
  { um: 362, siwFt: 850, relacionFf: 1.5, siwFf: 1275, liw: 1050 },
  { um: 362, siwFt: 950, relacionFf: 1.5, siwFf: 1425, liw: 1050 },
  { um: 362, siwFt: 950, relacionFf: 1.5, siwFf: 1425, liw: 1175 },
  { um: 420, siwFt: 850, relacionFf: 1.6, siwFf: 1360, liw: 1050 },
  { um: 420, siwFt: 850, relacionFf: 1.6, siwFf: 1360, liw: 1175 },
  { um: 420, siwFt: 950, relacionFf: 1.5, siwFf: 1425, liw: 1175 },
  { um: 420, siwFt: 950, relacionFf: 1.5, siwFf: 1425, liw: 1300 },
  { um: 420, siwFt: 1050, relacionFf: 1.5, siwFf: 1575, liw: 1300 },
  { um: 420, siwFt: 1050, relacionFf: 1.5, siwFf: 1575, liw: 1425 },
  { um: 550, siwFt: 950, relacionFf: 1.7, siwFf: 1615, liw: 1175 },
  { um: 550, siwFt: 950, relacionFf: 1.7, siwFf: 1615, liw: 1300 },
  { um: 550, siwFt: 1050, relacionFf: 1.6, siwFf: 1680, liw: 1300 },
  { um: 550, siwFt: 1050, relacionFf: 1.6, siwFf: 1680, liw: 1425 },
  { um: 550, siwFt: 1175, relacionFf: 1.5, siwFf: 1763, liw: 1425 },
  { um: 550, siwFt: 1175, relacionFf: 1.5, siwFf: 1763, liw: 1550 },
  { um: 800, siwFt: 1300, relacionFf: 1.7, siwFf: 2210, liw: 1675 },
  { um: 800, siwFt: 1300, relacionFf: 1.7, siwFf: 2210, liw: 1800 },
  { um: 800, siwFt: 1425, relacionFf: 1.7, siwFf: 2423, liw: 1800 },
  { um: 800, siwFt: 1425, relacionFf: 1.7, siwFf: 2423, liw: 1950 },
  { um: 800, siwFt: 1550, relacionFf: 1.6, siwFf: 2480, liw: 1950 },
  { um: 800, siwFt: 1550, relacionFf: 1.6, siwFf: 2480, liw: 2100 },
  { um: 1100, siwFt: 1550, relacionFf: 1.7, siwFf: 2635, liw: 2100 },
  { um: 1100, siwFt: 1550, relacionFf: 1.7, siwFf: 2635, liw: 2250 },
  { um: 1100, siwFt: 1675, relacionFf: 1.65, siwFf: 2764, liw: 2250 },
  { um: 1100, siwFt: 1675, relacionFf: 1.65, siwFf: 2764, liw: 2400 },
  { um: 1100, siwFt: 1800, relacionFf: 1.6, siwFf: 2880, liw: 2400 },
  { um: 1100, siwFt: 1800, relacionFf: 1.6, siwFf: 2880, liw: 2550 },
  { um: 1200, siwFt: 1675, relacionFf: 1.7, siwFf: 2848, liw: 2100 },
  { um: 1200, siwFt: 1675, relacionFf: 1.7, siwFf: 2848, liw: 2250 },
  { um: 1200, siwFt: 1800, relacionFf: 1.65, siwFf: 2970, liw: 2250 },
  { um: 1200, siwFt: 1800, relacionFf: 1.65, siwFf: 2970, liw: 2400 },
  { um: 1200, siwFt: 1950, relacionFf: 1.6, siwFf: 3120, liw: 2550 },
  { um: 1200, siwFt: 1950, relacionFf: 1.6, siwFf: 3120, liw: 2700 },
];

/** Tabla A.1 — BIL vs distancia mínima en aire (mm). */
export interface FilaA1 {
  bil: number; // kV pico
  puntaEstructura: number; // mm
  conductorEstructura: number; // mm
}
export const TABLA_A1: FilaA1[] = [
  { bil: 20, puntaEstructura: 60, conductorEstructura: 60 },
  { bil: 40, puntaEstructura: 60, conductorEstructura: 60 },
  { bil: 60, puntaEstructura: 90, conductorEstructura: 90 },
  { bil: 75, puntaEstructura: 120, conductorEstructura: 120 },
  { bil: 95, puntaEstructura: 160, conductorEstructura: 160 },
  { bil: 125, puntaEstructura: 220, conductorEstructura: 220 },
  { bil: 145, puntaEstructura: 270, conductorEstructura: 270 },
  { bil: 170, puntaEstructura: 320, conductorEstructura: 320 },
  { bil: 200, puntaEstructura: 380, conductorEstructura: 380 },
  { bil: 250, puntaEstructura: 480, conductorEstructura: 480 },
  { bil: 325, puntaEstructura: 630, conductorEstructura: 630 },
  { bil: 380, puntaEstructura: 750, conductorEstructura: 750 },
  { bil: 450, puntaEstructura: 900, conductorEstructura: 900 },
  { bil: 550, puntaEstructura: 1100, conductorEstructura: 1100 },
  { bil: 650, puntaEstructura: 1300, conductorEstructura: 1300 },
  { bil: 750, puntaEstructura: 1500, conductorEstructura: 1500 },
  { bil: 850, puntaEstructura: 1700, conductorEstructura: 1600 },
  { bil: 950, puntaEstructura: 1900, conductorEstructura: 1700 },
  { bil: 1050, puntaEstructura: 2100, conductorEstructura: 1900 },
  { bil: 1175, puntaEstructura: 2350, conductorEstructura: 2200 },
  { bil: 1300, puntaEstructura: 2600, conductorEstructura: 2400 },
  { bil: 1425, puntaEstructura: 2850, conductorEstructura: 2600 },
  { bil: 1550, puntaEstructura: 3100, conductorEstructura: 2900 },
  { bil: 1675, puntaEstructura: 3350, conductorEstructura: 3100 },
  { bil: 1800, puntaEstructura: 3600, conductorEstructura: 3300 },
  { bil: 1950, puntaEstructura: 3900, conductorEstructura: 3600 },
  { bil: 2100, puntaEstructura: 4200, conductorEstructura: 3900 },
  { bil: 2250, puntaEstructura: 4500, conductorEstructura: 4150 },
  { bil: 2400, puntaEstructura: 4800, conductorEstructura: 4450 },
  { bil: 2550, puntaEstructura: 5100, conductorEstructura: 4700 },
  { bil: 2700, puntaEstructura: 5400, conductorEstructura: 5000 },
];

/** Tabla A.2 — SIW fase-tierra vs distancia mínima f-t (mm), Rango II. */
export interface FilaA2 {
  siwFt: number;
  puntaEstructura: number;
  conductorEstructura: number;
}
export const TABLA_A2: FilaA2[] = [
  { siwFt: 750, puntaEstructura: 1900, conductorEstructura: 1600 },
  { siwFt: 850, puntaEstructura: 2400, conductorEstructura: 1800 },
  { siwFt: 950, puntaEstructura: 2900, conductorEstructura: 2200 },
  { siwFt: 1050, puntaEstructura: 3400, conductorEstructura: 2600 },
  { siwFt: 1175, puntaEstructura: 4100, conductorEstructura: 3100 },
  { siwFt: 1300, puntaEstructura: 4800, conductorEstructura: 3600 },
  { siwFt: 1425, puntaEstructura: 5600, conductorEstructura: 4200 },
  { siwFt: 1550, puntaEstructura: 6400, conductorEstructura: 4900 },
  { siwFt: 1675, puntaEstructura: 7400, conductorEstructura: 5600 },
  { siwFt: 1800, puntaEstructura: 8300, conductorEstructura: 6300 },
  { siwFt: 1950, puntaEstructura: 9500, conductorEstructura: 7200 },
];

/** Tabla A.3 — SIW fase-fase vs distancia mínima f-f (mm), Rango II. */
export interface FilaA3 {
  siwFf: number;
  conductorConductor: number; // paralelo
  puntaConductor: number;
}
export const TABLA_A3: FilaA3[] = [
  { siwFf: 1125, conductorConductor: 2300, puntaConductor: 2600 },
  { siwFf: 1275, conductorConductor: 2600, puntaConductor: 3100 },
  { siwFf: 1360, conductorConductor: 2900, puntaConductor: 3400 },
  { siwFf: 1425, conductorConductor: 3100, puntaConductor: 3600 },
  { siwFf: 1575, conductorConductor: 3600, puntaConductor: 4200 },
  { siwFf: 1615, conductorConductor: 3700, puntaConductor: 4300 },
  { siwFf: 1680, conductorConductor: 3900, puntaConductor: 4600 },
  { siwFf: 1763, conductorConductor: 4200, puntaConductor: 5000 },
  { siwFf: 2210, conductorConductor: 6100, puntaConductor: 7400 },
  { siwFf: 2423, conductorConductor: 7200, puntaConductor: 9000 },
  { siwFf: 2480, conductorConductor: 7600, puntaConductor: 9400 },
  { siwFf: 2635, conductorConductor: 8400, puntaConductor: 10000 },
  { siwFf: 2764, conductorConductor: 9100, puntaConductor: 10900 },
  { siwFf: 2848, conductorConductor: 9600, puntaConductor: 11400 },
  { siwFf: 2880, conductorConductor: 9800, puntaConductor: 11600 },
  { siwFf: 2970, conductorConductor: 10300, puntaConductor: 12300 },
  { siwFf: 3120, conductorConductor: 11200, puntaConductor: 13300 },
];

/** Devuelve la primera fila cuyo `campo` es ≥ valor (selección normalizada por escalón). */
export function primeroMayorIgual<T>(
  filas: T[],
  campo: (f: T) => number,
  valor: number
): T | null {
  const ordenadas = [...filas].sort((a, b) => campo(a) - campo(b));
  for (const f of ordenadas) {
    if (campo(f) >= valor) return f;
  }
  return null;
}
