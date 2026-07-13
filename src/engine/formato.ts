import type { Verificacion } from './tipos';

export const fmt = (x: number | string | null, dec = 2): string => {
  if (x === null) return '—';
  if (typeof x === 'string') return x;
  if (!Number.isFinite(x)) return '—'; // evita imprimir NaN o Infinity (división entre cero)
  return x.toLocaleString('es-PE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
};

export const colorVerif = (v: Verificacion): string =>
  v === 'CUMPLE' ? '#0a7d3c' : v === 'NO CUMPLE' ? '#c0392b' : '#8a8a8a';
