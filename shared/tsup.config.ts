import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'index.ts',
        'types/**/*.ts',
        'schemas/**/*.ts', 
        'tests/**/*.ts'
    ],
    format: ['cjs', 'esm'],
    dts: true,
    target: 'es2022',
    clean: true,
    outDir: 'dist',
    sourcemap: true,
});