import * as BABYLON from "babylonjs";
import { initPhysics, addPhysicsImposter } from "./physics";

BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = () => {};

let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

const engine = await getEngine();

async function getEngine() {
    const antialias = true;
    const adaptToDeviceRatio = true;

    if (navigator.gpu) {
        const engine = new BABYLON.WebGPUEngine(canvas, {
            antialias,
            adaptToDeviceRatio,
        });
        await engine.initAsync();
        return engine;
    }

    return new BABYLON.Engine(canvas, antialias, {}, adaptToDeviceRatio);
}

const scene = new BABYLON.Scene(engine);
await Promise.all([initPhysics(scene)]);

const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    1,
    10,
    new BABYLON.Vector3(0, 0, 0),
    scene
);

camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

let inspectorReady = false;
let inspectorOpen = true;

if (import.meta.env.MODE === "development") {
    window.addEventListener("keydown", async ({ key }) => {
        if (key.toLowerCase() !== "i") return;

        if (inspectorReady === false) {
            inspectorReady = true;
        }

        if (inspectorOpen === true) {
            localStorage.setItem("inspector", "true");
            scene.debugLayer.hide();
        } else {
            localStorage.removeItem("inspector");
            scene.debugLayer.show();
        }
    });

    if (localStorage.getItem("inspector")) {
        scene.debugLayer.show();
    }
}
var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

// Our built-in 'sphere' shape.
var sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene
);

// Move the sphere upward 1/2 its height
sphere.position.y = 10;

// Our built-in 'ground' shape.
var ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 6 },
    scene
);

new BABYLON.PhysicsAggregate(
    sphere,
    BABYLON.PhysicsShapeType.SPHERE,
    { mass: 1, restitution: 0.75 },
    scene
);

// Create a static box shape.
new BABYLON.PhysicsAggregate(
    ground,
    BABYLON.PhysicsShapeType.BOX,
    { mass: 0 },
    scene
);

engine.runRenderLoop(() => {
    scene.render();
});
