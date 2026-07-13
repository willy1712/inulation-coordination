import { useState, useMemo, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { calcular } from './engine/calcular';
import { ENTRADAS_DEFECTO } from './engine/defaults';
import type { Entradas } from './engine/tipos';
import { fmt } from './engine/formato';
import { EDICION_NORMA } from './engine/tablas-iec';
import { Num, Txt, Res, Badge } from './components/Campos';
import { validarProyecto } from './engine/esquema';
import { ReportePDF } from './pdf/ReportePDF';
import './styles/app.css';

export default function App() {
  const [e, setE] = useState<Entradas>(ENTRADAS_DEFECTO);
  const [generando, setGenerando] = useState(false);

  const r = useMemo(() => calcular(e), [e]);

  // helper tipado para actualizar un campo
  const set = useCallback(
    <K extends keyof Entradas>(k: K) =>
      (v: Entradas[K]) =>
        setE((prev) => ({ ...prev, [k]: v })),
    []
  );

  const descargarPDF = useCallback(async () => {
    setGenerando(true);
    try {
      const blob = await pdf(<ReportePDF e={e} r={r} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Coordinacion_aislamiento_${e.proyecto.replace(/\s+/g, '_')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerando(false);
    }
  }, [e, r]);

  const exportarJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(e, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${e.proyecto.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [e]);

  const importarJSON = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const datos = validarProyecto(JSON.parse(String(reader.result)));
        setE(datos);
      } catch {
        alert('El archivo no es un proyecto válido: revise que sea un JSON exportado por esta aplicación y que todos los campos numéricos tengan valores físicos válidos.');
      }
    };
    reader.readAsText(file);
    ev.target.value = '';
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <div className="eyebrow">IEC 60071-1 / 60071-2</div>
        <h1>Coordinación de aislamiento</h1>
        <div className="sub">Rangos I y II — cálculo en vivo y reporte PDF</div>
        <div className="hero-meta">
          <span>Um <b>{fmt(r.um, 3)} kV</b></span>
          <span>Ub <b>{fmt(r.ub, 0)} kV</b></span>
          <span>k <b>{fmt(r.kAdoptado, 2)}</b></span>
          <span className="rango-pill">Rango {r.rango}</span>
        </div>
      </header>

      <div className="actions">
        <button className="btn" onClick={descargarPDF} disabled={generando}>
          {generando ? 'Generando…' : 'Descargar PDF'}
        </button>
        <button className="btn ghost" onClick={exportarJSON}>Guardar proyecto</button>
        <label className="btn ghost" style={{ cursor: 'pointer' }}>
          Abrir proyecto
          <input type="file" accept="application/json" onChange={importarJSON} style={{ display: 'none' }} />
        </label>
        <div className="spacer" />
        <button className="btn ghost" onClick={() => setE(ENTRADAS_DEFECTO)}>Restablecer</button>
      </div>

      <div className="aviso">
        Los niveles normalizados y distancias provienen de las tablas de {EDICION_NORMA}.
        Verifíquelos contra la edición vigente antes de emitir para construcción. Las celdas
        color mostaza corresponden a lecturas de figuras de la norma que deben ingresarse a mano.
      </div>

      <div className="grid">
        {/* ===================== ENTRADAS ===================== */}
        <div>
          <section className="card">
            <h2>Datos de entrada</h2>
            <div className="card-body">
              <div className="card-sub">Proyecto</div>
              <Txt label="Proyecto / subestación" value={e.proyecto} onChange={set('proyecto')} />
              <Txt label="Estudio" value={e.estudio} onChange={set('estudio')} />
              <Txt label="Revisión" value={e.revision} onChange={set('revision')} />
              <Txt label="Ingeniero responsable" value={e.ingeniero} onChange={set('ingeniero')} />

              <div className="card-sub">Sistema eléctrico</div>
              <Num label="Tensión de operación, Us" value={e.us} unit="kV" step={0.1} onChange={set('us')} />
              <Num label="Factor de tensión máxima" value={e.factorUm} onChange={set('factorUm')} />
              <Num label="Frecuencia" value={e.frecuencia} unit="Hz" step={1} onChange={set('frecuencia')} />
              <Num label="Altitud, H" value={e.altitud} unit="m.s.n.m." step={1} onChange={set('altitud')} />
              <Num label="Distancia de fuga específica" value={e.fugaEspecifica} unit="mm/kV" step={1} onChange={set('fugaEspecifica')} />
              <Txt label="Puesta a tierra del sistema" value={e.puestaTierra} onChange={set('puestaTierra')} />

              <div className="card-sub">Impedancias de secuencia (Ω)</div>
              <Num label="R0" value={e.r0} unit="Ω" step={0.001} onChange={set('r0')} />
              <Num label="X0" value={e.x0} unit="Ω" step={0.001} onChange={set('x0')} />
              <Num label="R1" value={e.r1} unit="Ω" step={0.001} onChange={set('r1')} />
              <Num label="X1" value={e.x1} unit="Ω" step={0.001} onChange={set('x1')} />

              <div className="card-sub">Sobretensiones — lecturas de figuras IEC</div>
              <Num label="Factor de rechazo de carga" value={e.factorRechazoCarga} onChange={set('factorRechazoCarga')} />
              <Num label="ue2 — frente lento f-t (Figura 1)" value={e.ue2} figura onChange={set('ue2')} />
              <Num label="Relación up2/ue2 (Figura 2)" value={e.relacionUp2Ue2} figura onChange={set('relacionUp2Ue2')} />
              <Num label="Kcd f-t (Figura 6)" value={e.kcdFt} figura onChange={set('kcdFt')} />
              <Num label="Kcd f-f (Figura 6)" value={e.kcdFf} figura onChange={set('kcdFf')} />
              <div className="figura-hint">
                Ratios de entrada a la Figura 6: f-t = {fmt(r.ratioEntradaFt, 3)} · f-f = {fmt(r.ratioEntradaFf, 3)}
              </div>

              <div className="card-sub">Pararrayos</div>
              <Num label="Factor COV (To)" value={e.factorCov} onChange={set('factorCov')} />
              <Num label="Factor sobretensión temporal" value={e.factorTov} onChange={set('factorTov')} />
              <Num label="Factor de seguridad para R" value={e.factorSeguridadR} onChange={set('factorSeguridadR')} />
              <Num label="Tensión nominal R (catálogo)" value={e.tensionNominalR} unit="kV" step={1} onChange={set('tensionNominalR')} />
              <Num label="Ups — protección maniobra" value={e.ups} unit="kV" step={0.1} onChange={set('ups')} />
              <Num label="Upl — protección rayo" value={e.upl} unit="kV" step={0.1} onChange={set('upl')} />
              <Txt label="Descripción del pararrayos" value={e.descripcionPararrayos} onChange={set('descripcionPararrayos')} />

              <div className="card-sub">Frente rápido (Anexo F)</div>
              <Num label="Factor A (Tabla F.2)" value={e.factorA} step={1} onChange={set('factorA')} />
              <Num label="Cantidad mínima de líneas, n" value={e.nLineas} step={1} onChange={set('nLineas')} />
              <Num label="a1 conductor pararrayos-línea" value={e.a1} unit="m" onChange={set('a1')} />
              <Num label="a2 conductor pararrayos-tierra" value={e.a2} unit="m" onChange={set('a2')} />
              <Num label="a3 fase pararrayos-equipo" value={e.a3} unit="m" onChange={set('a3')} />
              <Num label="a4 parte activa del pararrayos" value={e.a4} unit="m" onChange={set('a4')} />
              <Num label="a1 interno" value={e.a1i} unit="m" onChange={set('a1i')} />
              <Num label="a2 interno" value={e.a2i} unit="m" onChange={set('a2i')} />
              <Num label="a3 interno" value={e.a3i} unit="m" onChange={set('a3i')} />
              <Num label="a4 interno" value={e.a4i} unit="m" onChange={set('a4i')} />
              <Num label="Vano típico, Lsp" value={e.vanoTipico} unit="m" step={1} onChange={set('vanoTipico')} />
              <Num label="Tasa de fallas equipo, Ra" value={e.tasaFallasEquipo} unit="1/año" step={0.001} onChange={set('tasaFallasEquipo')} />
              <Num label="Tasa de fallas 1er km, Rkm" value={e.tasaFallasKm} unit="1/km·a" step={0.001} onChange={set('tasaFallasKm')} />
              <Num label="Ra interno" value={e.tasaFallasEquipoInt} unit="1/año" step={0.001} onChange={set('tasaFallasEquipoInt')} />
              <Num label="Rkm interno" value={e.tasaFallasKmInt} unit="1/km·a" step={0.001} onChange={set('tasaFallasKmInt')} />

              <div className="card-sub">Factores de seguridad y altitud</div>
              <Num label="Ks interno" value={e.ksInterno} onChange={set('ksInterno')} />
              <Num label="Ks externo" value={e.ksExterno} onChange={set('ksExterno')} />
              <Num label="Exponente m — frec. industrial" value={e.mFrecInd} onChange={set('mFrecInd')} />
              <Num label="Exponente m — maniobra" value={e.mManiobra} onChange={set('mManiobra')} />
              <Num label="Exponente m — atmosférico" value={e.mAtmosferico} onChange={set('mAtmosferico')} />

              <div className="card-sub">Niveles normalizados seleccionados</div>
              <Num label="Um normalizado" value={e.umNormalizado} unit="kV" step={0.1} onChange={set('umNormalizado')} />
              <Num label="SDW seleccionado (Rango I)" value={e.sdwSeleccionado} unit="kV rms" step={1} onChange={set('sdwSeleccionado')} />
              <Num label="BIL seleccionado" value={e.bilSeleccionado} unit="kV" step={1} onChange={set('bilSeleccionado')} />

              <div className="card-sub">Distancia de protección</div>
              <Num label="Constante de corona, Kco" value={e.kco} unit="µs/kV·m" step={0.0000001} onChange={set('kco')} />
              <Num label="Longitud para pendiente, L" value={e.longitudPendiente} unit="m" step={1} onChange={set('longitudPendiente')} />
              <Num label="Margen sobre el BIL" value={e.margenProteccion} onChange={set('margenProteccion')} />

              {r.rango === 'II' && (
                <>
                  <div className="card-sub">Rango II (Um &gt; 245 kV)</div>
                  <Num label="Factor FI→SIW externo" value={e.factorFiSiwExterno} onChange={set('factorFiSiwExterno')} />
                  <Num label="Factor FI→SIW interno" value={e.factorFiSiwInterno} onChange={set('factorFiSiwInterno')} />
                  <Num label="SIW f-t seleccionado" value={e.siwFtSeleccionado} unit="kV" step={1} onChange={set('siwFtSeleccionado')} />
                  <Num label="SIW f-f seleccionado" value={e.siwFfSeleccionado} unit="kV" step={1} onChange={set('siwFfSeleccionado')} />
                </>
              )}
            </div>
          </section>
        </div>

        {/* ===================== RESULTADOS ===================== */}
        <div>
          <section className="card">
            <h2>Resultados</h2>
            <div className="card-body">
              <div className="card-sub">Sobretensiones representativas</div>
              <Res label="Factor de falla a tierra k" value={fmt(r.kCalculado, 3)} />
              <Res label="TOV falla a tierra, f-t" value={fmt(r.tovFaseTierraFalla)} unit="kV" />
              <Res label="Urp TOV f-t" value={fmt(r.urpTovFt)} unit="kV" />
              <Res label="Urp TOV f-f" value={fmt(r.urpTovFf)} unit="kV" />
              <Res label="Truncamiento Uet / Upt" value={`${fmt(r.uet)} / ${fmt(r.upt)}`} unit="kV" />
              <div className="res-row">
                <span className="rlabel">Pararrayos (Rmín {fmt(r.rMinimo)} kV)</span>
                <Badge v={r.verificacionPararrayos} />
              </div>

              <div className="card-sub">Coordinación (Ucw)</div>
              <Res label="Frente lento f-t / f-f" value={`${fmt(r.ucwSfFt)} / ${fmt(r.ucwSfFf)}`} unit="kV" />
              <Res label="Frente rápido ext / int" value={`${fmt(r.ucwFrExterno)} / ${fmt(r.ucwFrInterno)}`} unit="kV" />

              <div className="card-sub">Corrección por altitud</div>
              <Res label="Ka FI / maniobra / atm." value={`${fmt(r.kaFrecInd, 3)} / ${fmt(r.kaManiobra, 3)} / ${fmt(r.kaAtmosferico, 3)}`} />

              <div className="card-sub">Resumen de tensiones requeridas (Urw)</div>
              <table className="resumen">
                <thead>
                  <tr>
                    <th>Solicitación</th><th>Config.</th>
                    <th>Ext. lín.</th><th>Ext. otros</th><th>Int.</th><th>GIS</th>
                  </tr>
                </thead>
                <tbody>
                  {r.resumen.map((f, i) => (
                    <tr key={i}>
                      <td>{f.solicitacion}</td>
                      <td>{f.configuracion}</td>
                      <td>{fmt(f.extEntradaLinea)}</td>
                      <td>{fmt(f.extOtrosEquipos)}</td>
                      <td>{fmt(f.interno)}</td>
                      <td>{fmt(f.gis)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {r.rango === 'I' ? (
                <>
                  <div className="card-sub">Selección normalizada — Rango I</div>
                  <Res label="SDW requerido" value={fmt(r.sdwRequerido)} unit="kV" />
                  <Res label="SDW sugerido" value={fmt(r.sdwSugerido, 0)} unit="kV" />
                  <div className="res-row"><span className="rlabel">Verificación frecuencia industrial</span><Badge v={r.verificacionSdw} /></div>
                  <Res label="LIW req. atmosférico" value={fmt(r.liwRequeridoAtm)} unit="kV" />
                  <Res label="LIW exigido por maniobra" value={fmt(r.liwPorManiobra)} unit="kV" />
                  <Res label="LIW / BIL requerido total" value={fmt(r.liwRequerido)} unit="kV" />
                  <Res label="LIW / BIL sugerido" value={fmt(r.liwSugerido, 0)} unit="kV" />
                  <div className="res-row"><span className="rlabel">Verificación impulso atmosférico</span><Badge v={r.verificacionLiw} /></div>
                  <div className="res-row"><span className="rlabel">Verificación de maniobra</span><Badge v={r.verificacionManiobra} /></div>
                  <Res label="Distancia mínima (A.1)" value={fmt(r.distanciaA1, 0)} unit="mm" />
                </>
              ) : (
                <>
                  <div className="card-sub">Selección normalizada — Rango II</div>
                  <Res label="Um sugerido (Tabla 3)" value={fmt(r.umSugeridoII, 0)} unit="kV" />
                  <Res label="SIW f-t requerido / sugerido" value={`${fmt(r.siwFtRequerido)} / ${fmt(r.siwFtSugerido, 0)}`} unit="kV" />
                  <div className="res-row"><span className="rlabel">Verificación SIW f-t</span><Badge v={r.verificacionSiwFt} /></div>
                  <Res label="SIW f-f requerido / sugerido" value={`${fmt(r.siwFfRequerido)} / ${fmt(r.siwFfSugerido, 0)}`} unit="kV" />
                  <div className="res-row"><span className="rlabel">Verificación SIW f-f</span><Badge v={r.verificacionSiwFf} /></div>
                  <Res label="LIW / BIL requerido / sugerido" value={`${fmt(r.liwRequeridoII)} / ${fmt(r.liwSugeridoII, 0)}`} unit="kV" />
                  <div className="res-row"><span className="rlabel">Verificación LIW</span><Badge v={r.verificacionLiwII} /></div>

                  <div className="card-sub">Distancias mínimas — Rango II (mm)</div>
                  <table className="resumen">
                    <thead>
                      <tr><th>Config.</th><th>Detalle</th><th>Rayo</th><th>Maniobra</th><th>Adoptada</th></tr>
                    </thead>
                    <tbody>
                      {r.distanciasII.map((d, i) => (
                        <tr key={i}>
                          <td>{d.configuracion}</td><td>{d.detalle}</td>
                          <td>{fmt(d.porRayo, 0)}</td><td>{fmt(d.porManiobra, 0)}</td>
                          <td><b>{fmt(d.adoptada, 0)}</b></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <div className="card-sub">Distancia máxima de protección</div>
              <Res label="D máxima" value={fmt(r.distanciaMaxProteccion)} unit="m" />
              <Res label="Distancia real (a1+a3)" value={fmt(r.distanciaReal)} unit="m" />
              <div className="res-row"><span className="rlabel">Verificación: real ≤ D</span><Badge v={r.verificacionDistancia} /></div>
            </div>
          </section>
        </div>
      </div>

      <div className="footer-note">
        Herramienta de cálculo conforme a {EDICION_NORMA}. El motor de cálculo reproduce la hoja
        de Excel validada (39 pruebas automáticas). Los proyectos se guardan como archivo JSON que
        puede almacenarse en OneDrive o Google Drive. El PDF se genera íntegramente en el navegador:
        no se envía ningún dato a un servidor.
      </div>
    </div>
  );
}
