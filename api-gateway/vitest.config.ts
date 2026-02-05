import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(srcPath),
        },
    },
    test: {
        environment: "node",
        coverage: {
            reporter: ["text", "lcov"],
        },
    },
});