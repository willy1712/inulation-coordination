import type { ChangeEvent } from 'react';

interface NumProps {
  label: string;
  value: number;
  unit?: string;
  step?: number;
  figura?: boolean;
  onChange: (v: number) => void;
}

export function Num({ label, value, unit, step = 0.01, figura, onChange }: NumProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    onChange(Number.isNaN(v) ? 0 : v);
  };
  return (
    <div className={`field${figura ? ' figura' : ''}`}>
      <label>{label}</label>
      <input type="number" value={value} step={step} onChange={handle} />
      <span className="unit">{unit ?? ''}</span>
    </div>
  );
}

interface TxtProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

export function Txt({ label, value, onChange }: TxtProps) {
  return (
    <div className="field wide">
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function Res({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="res-row">
      <span className="rlabel">{label}</span>
      <span className="rval">{value}</span>
      <span className="runit">{unit ?? ''}</span>
    </div>
  );
}

export function Badge({ v }: { v: string }) {
  const cls = v === 'CUMPLE' ? 'cumple' : v === 'NO CUMPLE' ? 'no-cumple' : 'no-aplica';
  return <span className={`badge ${cls}`}>{v}</span>;
}
