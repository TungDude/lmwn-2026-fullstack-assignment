import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from '@vitejs/plugin-react';

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(srcPath),
        },
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './src/tests/setup.ts',
        css: true,
    },
});