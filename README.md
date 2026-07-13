# Coordinación de aislamiento IEC 60071-1/2

Aplicación web para el cálculo de coordinación de aislamiento según IEC 60071-1 e
IEC 60071-2, con soporte de **Rango I** (1 kV < Um ≤ 245 kV) y **Rango II** (Um > 245 kV).
Calcula en vivo y genera un reporte PDF profesional. Todo corre en el navegador: no hay
servidor y no se envía ningún dato a terceros.

## Qué hace

- Cadena completa de cálculo: Urp → Ucw → Urw → conversión a niveles normalizados → distancias mínimas.
- Detección automática de rango según Um.
- Factor de falla a tierra por componentes simétricas (no depende de leer la Figura B.1).
- Selección normalizada automática desde las Tablas 2, 3, A.1, A.2 y A.3.
- Verificaciones CUMPLE / NO CUMPLE en cada paso.
- Reporte PDF con portada, memoria por secciones, tablas y referencias.
- Guardar / abrir proyectos como archivo JSON (para OneDrive, Google Drive o disco local).

El motor de cálculo reproduce la hoja de Excel ya validada; hay **51 pruebas automáticas**:
golden-master contra los resultados conocidos de los casos de 22.9 kV y 500 kV, integridad
de las tablas IEC transcritas (monotonicidad y coherencia interna) y validación del esquema
de proyectos.

## Requisitos

- Node.js 20 o superior.

## Uso en local

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo en http://localhost:5173
npm test         # ejecuta las pruebas del motor de cálculo
npm run build    # genera la versión de producción en dist/
```

## Publicar gratis en GitHub Pages

1. Crea una cuenta en https://github.com si no la tienes.
2. Crea un repositorio nuevo con el nombre que prefieras. La app quedará en
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`. No hay que editar ninguna
   configuración: el flujo de despliegue deriva la ruta base automáticamente del
   nombre del repositorio (y usa la raíz si el repositorio se llama
   `TU-USUARIO.github.io`).
3. Sube el contenido de esta carpeta al repositorio. Desde la terminal:

   ```bash
   git init
   git add .
   git commit -m "Versión inicial"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/NOMBRE-DEL-REPO.git
   git push -u origin main
   ```

4. En el repositorio, entra en **Settings → Pages** y, en **Source**,
   elige **GitHub Actions**.
5. Cada vez que hagas `git push` a la rama `main`, el flujo de trabajo incluido
   (`.github/workflows/deploy.yml`) ejecuta las pruebas, construye la app y la publica.
   El primer despliegue tarda uno o dos minutos; luego la URL queda activa.

No se requiere tarjeta de crédito ni pago. El único costo opcional sería un dominio
propio, que no es necesario: la URL `github.io` funciona perfectamente.

## Estructura

```
src/
  engine/        Motor de cálculo puro (TypeScript, sin dependencias de UI)
    tablas-iec.ts   Tablas 2, 3, A.1, A.2, A.3 normalizadas
    tipos.ts        Tipos de entrada y resultado
    calcular.ts     Función calcular(entradas) → resultados
    esquema.ts      Validación de proyectos importados (Zod)
    defaults.ts     Casos base (22.9 kV y 500 kV)
    calcular.test.ts  Pruebas golden-master contra el Excel
    tablas.test.ts    Integridad de tablas y esquema
  pdf/
    ReportePDF.tsx  Documento PDF con @react-pdf/renderer
  components/
    Campos.tsx      Campos de formulario reutilizables
  App.tsx           Interfaz principal
```

## Nota sobre las tablas de la norma

Los valores de niveles normalizados y distancias mínimas se transcriben de
IEC 60071-1:2006 + Amd.1:2010. **Verifícalos contra la edición vigente de la norma antes
de emitir un estudio para construcción.** El reporte cita siempre la edición usada.
