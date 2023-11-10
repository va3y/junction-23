import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";

export default defineConfig(({ command, mode }) => {
    return {
        build: {
            target: "esnext",
        },
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: normalizePath(
                            path.resolve(
                                __dirname,
                                "./node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm"
                            )
                        ),
                        dest: normalizePath(
                            path.resolve(__dirname, "./public")
                        ),
                    },
                ],
            }),
        ],
        resolve: {
            alias: {
                babylonjs:
                    mode === "development"
                        ? "babylonjs/babylon.max"
                        : "babylonjs",
            },
        },

        worker: {
            format: "es",
        },
    };
});
