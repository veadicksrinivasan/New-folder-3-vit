import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            // Fallback proxy to 5002 if 5001 fallback was used
            console.log('Proxy error, attempting fallback to port 5002...');
          });
        }
      }
    }
  }
});
