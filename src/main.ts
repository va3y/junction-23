import { AppOne as App } from "./AppOne";
import * as BABYLON from "babylonjs";
import HavokPhysics from "@babylonjs/havok";

console.log(`main.ts starting ${App.name}`);
window.addEventListener("DOMContentLoaded", async () => {
    let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const physicsEngine = await initPhysics();
    const engine = new BABYLON.WebGPUEngine(canvas);
    await engine.initAsync();
    let app = new App(canvas, engine, physicsEngine);
    app.run();
});

export const initPhysics = async () => {
    const response = await fetch(
        import.meta.env.DEV
            ? "node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm"
            : "HavokPhysics.wasm"
    );
    const wasmBinary = await response.arrayBuffer();
    const havokInstance = await HavokPhysics({ wasmBinary });
    return new BABYLON.HavokPlugin(true, havokInstance);
};
