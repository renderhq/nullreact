import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'NullReact',
            formats: ['es'],
            fileName: 'index'
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 5,
                pure_getters: true,
                unsafe: true,
                drop_console: true,
            },
            mangle: {
                toplevel: true
            },
            format: {
                comments: false
            }
        },
        target: 'esnext',
        reportCompressedSize: true
    }
});
