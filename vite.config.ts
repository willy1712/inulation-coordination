import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La base por defecto es '/' (útil en desarrollo local). En GitHub Actions
// el flujo de despliegue pasa --base=/NOMBRE-DEL-REPO/ automáticamente,
// así que la app funciona sin importar cómo se llame el repositorio.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
});
