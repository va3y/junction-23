import * as BABYLON from "babylonjs";
import HavokPhysics from "@babylonjs/havok";

export class AppOne {
    engine: BABYLON.WebGPUEngine;
    scene: BABYLON.Scene;

    constructor(
        readonly canvas: HTMLCanvasElement,
        readonly engineParam: BABYLON.WebGPUEngine,
        readonly havokPlugin: BABYLON.HavokPlugin
    ) {
        this.engine = engineParam;
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas, havokPlugin);
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            // this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}

var createScene = function (
    engine: BABYLON.Engine,
    canvas: HTMLCanvasElement,
    physicsPlugin: BABYLON.HavokPlugin
) {
    // this is the default code from the playground:

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    // var camera = new BABYLON.UniversalCamera(
    //     "camera1",
    //     new BABYLON.Vector3(0, 5, -10),
    //     scene
    // );
    var camera = new BABYLON.ArcRotateCamera(
        "Camera",
        0,
        1,
        10,
        new BABYLON.Vector3(0, 0, 0),
        scene
    );
    camera.attachControl(canvas, true);

    var gravityVector = new BABYLON.Vector3(0, -9.81, 0);

    scene.enablePhysics(gravityVector, physicsPlugin);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    // camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
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

    var sphereAggregate = new BABYLON.PhysicsAggregate(
        sphere,
        BABYLON.PhysicsShapeType.SPHERE,
        { mass: 1, restitution: 0.75 },
        scene
    );

    // Create a static box shape.
    var groundAggregate = new BABYLON.PhysicsAggregate(
        ground,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0 },
        scene
    );

    return scene;
};
