// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: '/src/main.jsx', 
    },
  },
});

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import babel from 'vite-plugin-babel';

// export default defineConfig({
//   plugins: [
//     react(),
//     babel(),
//   ],
//   build: {
//     manifest: true,
//     rollupOptions: {
//       input: '/src/main.jsx', 
//     },
//   },
// });
