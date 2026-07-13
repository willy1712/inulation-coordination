import {
  Document, Page, Text, View, StyleSheet,
} from '@react-pdf/renderer';
import type { Entradas } from '../engine/tipos';
import type { Resultados } from '../engine/tipos';
import { EDICION_NORMA } from '../engine/tablas-iec';
import { fmt } from '../engine/formato';

// Colores de la identidad (coinciden con la UI)
const C = {
  tinta: '#12212e',
  azul: '#1f4e78',
  azulClaro: '#e8eef5',
  gris: '#5a6672',
  linea: '#c3ccd6',
  cumple: '#0a7d3c',
  noCumple: '#c0392b',
  papel: '#ffffff',
  franja: '#f4f6f9',
};

const s = StyleSheet.create({
  page: { paddingTop: 54, paddingBottom: 56, paddingHorizontal: 46, fontSize: 8.5, color: C.tinta, fontFamily: 'Helvetica' },
  // portada
  portadaMarco: { flex: 1, justifyContent: 'space-between', paddingVertical: 40 },
  eyebrow: { fontSize: 9, letterSpacing: 3, color: C.azul, fontFamily: 'Helvetica-Bold' },
  titulo: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: C.tinta, marginTop: 16, lineHeight: 1.15 },
  subtitulo: { fontSize: 13, color: C.gris, marginTop: 10 },
  reglaGruesa: { height: 3, backgroundColor: C.azul, width: 90, marginTop: 22 },
  metaGrid: { marginTop: 40 },
  metaRow: { flexDirection: 'row', borderTopWidth: 0.6, borderColor: C.linea, paddingVertical: 7 },
  metaLabel: { width: 150, color: C.gris, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  metaValue: { flex: 1, fontSize: 9.5 },
  portadaPie: { fontSize: 7.5, color: C.gris, lineHeight: 1.5 },
  // encabezado/pie de páginas de contenido
  header: { position: 'absolute', top: 22, left: 46, right: 46, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: C.gris, borderBottomWidth: 0.6, borderColor: C.linea, paddingBottom: 6 },
  footer: { position: 'absolute', bottom: 26, left: 46, right: 46, flexDirection: 'row', justifyContent: 'space-between', fontSize: 7, color: C.gris, borderTopWidth: 0.6, borderColor: C.linea, paddingTop: 6 },
  // secciones
  seccion: { backgroundColor: C.azul, color: '#fff', fontFamily: 'Helvetica-Bold', fontSize: 9.5, paddingVertical: 4, paddingHorizontal: 7, marginTop: 16, marginBottom: 8 },
  sub: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: C.azul, marginTop: 8, marginBottom: 4 },
  // filas etiqueta-valor
  fila: { flexDirection: 'row', paddingVertical: 2.5, borderBottomWidth: 0.4, borderColor: C.franja },
  etq: { flex: 1, paddingRight: 8 },
  val: { width: 78, textAlign: 'right', fontFamily: 'Helvetica-Bold' },
  unidad: { width: 40, color: C.gris, paddingLeft: 5 },
  nota: { fontSize: 7, color: C.gris, fontStyle: 'italic', marginTop: 3, lineHeight: 1.4 },
  // tablas
  th: { flexDirection: 'row', backgroundColor: C.azulClaro, borderBottomWidth: 0.6, borderColor: C.azul },
  thc: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, padding: 3, color: C.azul },
  tr: { flexDirection: 'row', borderBottomWidth: 0.4, borderColor: C.linea },
  td: { fontSize: 7.5, padding: 3 },
  badge: { fontFamily: 'Helvetica-Bold', fontSize: 7.5 },
});

function Fila({ etq, val, unidad, dec = 2 }: { etq: string; val: number | string | null; unidad?: string; dec?: number }) {
  return (
    <View style={s.fila}>
      <Text style={s.etq}>{etq}</Text>
      <Text style={s.val}>{fmt(val, dec)}</Text>
      <Text style={s.unidad}>{unidad ?? ''}</Text>
    </View>
  );
}

function Verif({ v }: { v: string }) {
  const color = v === 'CUMPLE' ? C.cumple : v === 'NO CUMPLE' ? C.noCumple : C.gris;
  return <Text style={[s.badge, { color }]}>{v}</Text>;
}

function HeaderFooter({ r }: { r: Resultados }) {
  return (
    <>
      <View style={s.header} fixed>
        <Text>Coordinación de aislamiento · IEC 60071-1/2</Text>
        <Text>Rango {r.rango}</Text>
      </View>
      <View style={s.footer} fixed>
        <Text>{EDICION_NORMA}</Text>
        <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
      </View>
    </>
  );
}

export function ReportePDF({ e, r }: { e: Entradas; r: Resultados }) {
  const hoy = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document
      title={`Coordinación de aislamiento — ${e.proyecto}`}
      author={e.ingeniero || 'Ingeniería eléctrica'}
      subject="Memoria de cálculo IEC 60071-1/2"
    >
      {/* ---------- PORTADA ---------- */}
      <Page size="A4" style={s.page}>
        <View style={s.portadaMarco}>
          <View>
            <Text style={s.eyebrow}>MEMORIA DE CÁLCULO</Text>
            <Text style={s.titulo}>Coordinación de{'\n'}aislamiento</Text>
            <View style={s.reglaGruesa} />
            <Text style={s.subtitulo}>{e.estudio}</Text>
          </View>

          <View style={s.metaGrid}>
            <View style={s.metaRow}><Text style={s.metaLabel}>PROYECTO</Text><Text style={s.metaValue}>{e.proyecto}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>TENSIÓN NOMINAL</Text><Text style={s.metaValue}>{fmt(e.us, 1)} kV</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>TENSIÓN MÁXIMA Um</Text><Text style={s.metaValue}>{fmt(r.um, 3)} kV · Rango {r.rango}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>ALTITUD</Text><Text style={s.metaValue}>{fmt(e.altitud, 0)} m.s.n.m.</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>REVISIÓN</Text><Text style={s.metaValue}>{e.revision}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>RESPONSABLE</Text><Text style={s.metaValue}>{e.ingeniero || '—'}</Text></View>
            <View style={s.metaRow}><Text style={s.metaLabel}>FECHA</Text><Text style={s.metaValue}>{hoy}</Text></View>
          </View>

          <View>
            <View style={{ height: 0.6, backgroundColor: C.linea, marginBottom: 10 }} />
            <Text style={s.portadaPie}>
              Cálculo conforme a {EDICION_NORMA}.{'\n'}
              Los niveles normalizados y distancias mínimas se toman de las Tablas 2, 3, A.1, A.2 y A.3 de la norma.
              Verificar los valores contra la edición vigente antes de emitir para construcción.
            </Text>
          </View>
        </View>
      </Page>

      {/* ---------- CONTENIDO ---------- */}
      <Page size="A4" style={s.page}>
        <HeaderFooter r={r} />

        <Text style={s.seccion}>1 · Parámetros del sistema</Text>
        <Fila etq="Tensión de operación, Us" val={e.us} unidad="kV" dec={1} />
        <Fila etq="Tensión máxima, Um = Us · factor" val={r.um} unidad="kV" dec={3} />
        <Fila etq="Rango IEC (I: hasta 245 kV · II: mayor a 245 kV)" val={`Rango ${r.rango}`} />
        <Fila etq="Frecuencia nominal" val={e.frecuencia} unidad="Hz" dec={0} />
        <Fila etq="Altitud de instalación, H" val={e.altitud} unidad="m.s.n.m." dec={0} />
        <Fila etq="Puesta a tierra del sistema" val={e.puestaTierra} />
        <Fila etq="Distancia de fuga total requerida" val={r.fugaTotal} unidad="mm" dec={1} />

        <Text style={s.seccion}>2 · Sobretensiones representativas (Urp)</Text>
        <Text style={s.sub}>Tensión base y factor de falla a tierra</Text>
        <Fila etq="Tensión base, Ub = (2/3)^0.5 · Um" val={r.ub} unidad="kV" dec={0} />
        <Fila etq="Factor de falla a tierra k (comp. simétricas)" val={r.kCalculado} dec={3} />
        <Fila etq="k adoptado" val={r.kAdoptado} dec={2} />
        <Text style={s.sub}>Temporales (TOV)</Text>
        <Fila etq="Falla a tierra, f-t = k · Um/(3^0.5)" val={r.tovFaseTierraFalla} unidad="kV" />
        <Fila etq="Rechazo de carga, f-t" val={r.tovRechazoFt} unidad="kV" />
        <Fila etq="Rechazo de carga, f-f" val={r.tovRechazoFf} unidad="kV" />
        <Fila etq="Urp TOV f-t = máx(falla; rechazo)" val={r.urpTovFt} unidad="kV" />
        <Fila etq="Urp TOV f-f" val={r.urpTovFf} unidad="kV" />
        <Text style={s.sub}>Frente lento y pararrayos</Text>
        <Fila etq="Truncamiento f-t, Uet" val={r.uet} unidad="kV" />
        <Fila etq="Truncamiento f-f, Upt" val={r.upt} unidad="kV" />
        <Fila etq="Tensión nominal mínima del pararrayos" val={r.rMinimo} unidad="kV" />
        <View style={s.fila}>
          <Text style={s.etq}>Verificación del pararrayos seleccionado</Text>
          <Verif v={r.verificacionPararrayos} />
        </View>
        <Fila etq="Urp frente lento con pararrayos, f-t" val={r.urpSfFt} unidad="kV" />
        <Fila etq="Urp frente lento con pararrayos, f-f" val={r.urpSfFf} unidad="kV" />
      </Page>

      {/* ---------- Ucw, Urw ---------- */}
      <Page size="A4" style={s.page}>
        <HeaderFooter r={r} />

        <Text style={s.seccion}>3 · Tensiones de coordinación (Ucw)</Text>
        <Fila etq="Ucw temporal f-t" val={r.ucwTovFt} unidad="kV" />
        <Fila etq="Ucw temporal f-f" val={r.ucwTovFf} unidad="kV" />
        <Fila etq="Ucw frente lento f-t" val={r.ucwSfFt} unidad="kV" />
        <Fila etq="Ucw frente lento f-f" val={r.ucwSfFf} unidad="kV" />
        <Fila etq="Ucw frente rápido, aisl. externo" val={r.ucwFrExterno} unidad="kV" />
        <Fila etq="Ucw frente rápido, aisl. interno" val={r.ucwFrInterno} unidad="kV" />

        <Text style={s.seccion}>4 · Corrección por altitud (Ka)</Text>
        <Fila etq="Ka frecuencia industrial" val={r.kaFrecInd} dec={4} />
        <Fila etq="Ka impulso de maniobra" val={r.kaManiobra} dec={4} />
        <Fila etq="Ka impulso atmosférico" val={r.kaAtmosferico} dec={4} />

        <Text style={s.seccion}>5 · Resumen de tensiones requeridas (Urw)</Text>
        <View style={s.th}>
          <Text style={[s.thc, { flex: 2 }]}>Solicitación</Text>
          <Text style={[s.thc, { flex: 1.4 }]}>Config.</Text>
          <Text style={[s.thc, { flex: 1, textAlign: 'right' }]}>Ext. línea</Text>
          <Text style={[s.thc, { flex: 1, textAlign: 'right' }]}>Ext. otros</Text>
          <Text style={[s.thc, { flex: 1, textAlign: 'right' }]}>Interno</Text>
          <Text style={[s.thc, { flex: 1, textAlign: 'right' }]}>GIS</Text>
        </View>
        {r.resumen.map((f, i) => (
          <View style={[s.tr, i % 2 ? { backgroundColor: C.franja } : {}]} key={i}>
            <Text style={[s.td, { flex: 2 }]}>{f.solicitacion}</Text>
            <Text style={[s.td, { flex: 1.4 }]}>{f.configuracion}</Text>
            <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{fmt(f.extEntradaLinea)}</Text>
            <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{fmt(f.extOtrosEquipos)}</Text>
            <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{fmt(f.interno)}</Text>
            <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{fmt(f.gis)}</Text>
          </View>
        ))}
        <Text style={s.nota}>Valores en kV rms para frecuencia industrial; kV pico para impulsos. Incluye el máximo entre el requerimiento directo y el valor convertido a SDW/LIW.</Text>
      </Page>

      {/* ---------- Selección normalizada + distancias ---------- */}
      <Page size="A4" style={s.page}>
        <HeaderFooter r={r} />

        {r.rango === 'I' ? (
          <>
            <Text style={s.seccion}>6 · Selección del nivel normalizado — Rango I (Tabla 2)</Text>
            <Fila etq="SDW requerido (frecuencia industrial)" val={r.sdwRequerido} unidad="kV rms" />
            <Fila etq="SDW normalizado sugerido" val={r.sdwSugerido} unidad="kV rms" dec={0} />
            <Fila etq="SDW seleccionado" val={e.sdwSeleccionado} unidad="kV rms" dec={0} />
            <View style={s.fila}><Text style={s.etq}>Verificación frecuencia industrial</Text><Verif v={r.verificacionSdw} /></View>
            <Fila etq="LIW requerido por impulso atmosférico" val={r.liwRequeridoAtm} unidad="kV pico" />
            <Fila etq="LIW exigido por maniobra (dado el SDW)" val={r.liwPorManiobra} unidad="kV pico" />
            <Fila etq="LIW / BIL requerido total" val={r.liwRequerido} unidad="kV pico" />
            <Fila etq="LIW / BIL normalizado sugerido" val={r.liwSugerido} unidad="kV pico" dec={0} />
            <Fila etq="LIW / BIL seleccionado" val={e.bilSeleccionado} unidad="kV pico" dec={0} />
            <View style={s.fila}><Text style={s.etq}>Verificación impulso atmosférico</Text><Verif v={r.verificacionLiw} /></View>
            <View style={s.fila}><Text style={s.etq}>Verificación de maniobra (cubierta por SDW o LIW)</Text><Verif v={r.verificacionManiobra} /></View>

            <Text style={s.seccion}>7 · Distancia mínima en el aire (Tabla A.1)</Text>
            <Fila etq="BIL seleccionado" val={e.bilSeleccionado} unidad="kV" dec={0} />
            <Fila etq="Distancia mínima f-t / f-f (punta-estructura)" val={r.distanciaA1} unidad="mm" dec={0} />
          </>
        ) : (
          <>
            <Text style={s.seccion}>6 · Selección del nivel normalizado — Rango II (Tabla 3)</Text>
            <Fila etq="Um normalizado sugerido" val={r.umSugeridoII} unidad="kV" dec={0} />
            <Fila etq="SIW f-t requerido" val={r.siwFtRequerido} unidad="kV pico" />
            <Fila etq="SIW f-t sugerido" val={r.siwFtSugerido} unidad="kV pico" dec={0} />
            <Fila etq="SIW f-t seleccionado" val={e.siwFtSeleccionado} unidad="kV pico" dec={0} />
            <View style={s.fila}><Text style={s.etq}>Verificación SIW f-t</Text><Verif v={r.verificacionSiwFt} /></View>
            <Fila etq="SIW f-f requerido" val={r.siwFfRequerido} unidad="kV pico" />
            <Fila etq="SIW f-f sugerido" val={r.siwFfSugerido} unidad="kV pico" dec={0} />
            <Fila etq="SIW f-f seleccionado" val={e.siwFfSeleccionado} unidad="kV pico" dec={0} />
            <View style={s.fila}><Text style={s.etq}>Verificación SIW f-f</Text><Verif v={r.verificacionSiwFf} /></View>
            <Fila etq="LIW / BIL requerido" val={r.liwRequeridoII} unidad="kV pico" />
            <Fila etq="LIW / BIL sugerido" val={r.liwSugeridoII} unidad="kV pico" dec={0} />
            <View style={s.fila}><Text style={s.etq}>Verificación LIW</Text><Verif v={r.verificacionLiwII} /></View>

            <Text style={s.seccion}>7 · Distancias mínimas — Rango II (máx. rayo/maniobra)</Text>
            <View style={s.th}>
              <Text style={[s.thc, { flex: 1.4 }]}>Configuración</Text>
              <Text style={[s.thc, { flex: 1.8 }]}>Detalle</Text>
              <Text style={[s.thc, { flex: 1, textAlign: 'right' }]}>Rayo</Text>
              <Text style={[s.thc, { flex: 1, textAlign: 'right' }]}>Maniobra</Text>
              <Text style={[s.thc, { flex: 1, textAlign: 'right' }]}>Adoptada</Text>
            </View>
            {r.distanciasII.map((d, i) => (
              <View style={[s.tr, i % 2 ? { backgroundColor: C.franja } : {}]} key={i}>
                <Text style={[s.td, { flex: 1.4 }]}>{d.configuracion}</Text>
                <Text style={[s.td, { flex: 1.8 }]}>{d.detalle}</Text>
                <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{fmt(d.porRayo, 0)}</Text>
                <Text style={[s.td, { flex: 1, textAlign: 'right' }]}>{fmt(d.porManiobra, 0)}</Text>
                <Text style={[s.td, { flex: 1, textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>{fmt(d.adoptada, 0)}</Text>
              </View>
            ))}
            <Text style={s.nota}>mm. Anexo A.3: f-t = máx(A.1; A.2) · f-f = máx(A.1 punta; A.3).</Text>
          </>
        )}

        <Text style={s.seccion}>8 · Distancia máxima de protección del pararrayos</Text>
        <Fila etq="Tensión soportada con margen, Up = margen·BIL" val={r.upConMargen} unidad="kV" dec={1} />
        <Fila etq="Pendiente del frente, S" val={r.pendienteFrente} unidad="kV/us" dec={1} />
        <Fila etq="Distancia máxima de protección, D" val={r.distanciaMaxProteccion} unidad="m" />
        <Fila etq="Distancia real pararrayos-equipo (a1+a3)" val={r.distanciaReal} unidad="m" />
        <View style={s.fila}><Text style={s.etq}>Verificación: distancia real menor o igual a D</Text><Verif v={r.verificacionDistancia} /></View>

        <Text style={s.seccion}>9 · Referencias</Text>
        <Text style={{ fontSize: 8, lineHeight: 1.6 }}>
          [1] IEC 60071-1, Insulation co-ordination — Part 1: Definitions, principles and rules.{'\n'}
          [2] IEC 60071-2, Insulation co-ordination — Part 2: Application guidelines.{'\n'}
          [3] IEC 60099-4, Surge arresters — Metal-oxide surge arresters without gaps for a.c. systems.
        </Text>
      </Page>
    </Document>
  );
}
