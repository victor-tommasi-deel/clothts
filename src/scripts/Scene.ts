import * as THREE from 'three';
import Figure from "./Figure";
import Wind from "./Wind";
import C from "cannon";

export default class Scene {
  container: HTMLCanvasElement;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  figure: Figure;
  imageContainer: HTMLImageElement;
  world: C.World;
  wind: Wind;
  ambientLight: THREE.AmbientLight;

  constructor(container: HTMLCanvasElement, imageContainer: HTMLImageElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.world = new C.World();
    this.world.gravity.set(0, -1000, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      alpha: true
    });
    const { innerHeight, innerWidth, devicePixelRatio } = window;
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.ambientLight);
    this.camera = this.initCamera(800);
    this.imageContainer = imageContainer;
    this.figure = new Figure(this.scene, this.imageContainer, this.world);
    this.wind = new Wind(this.figure.mesh);
  }

  initCamera = (perspective: number) => {
    const fov =
      (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;

    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );
    camera.position.set(0, 0, perspective);
    return camera;
  }

  update = () => {
    if (
      this.renderer === undefined ||
      this.scene === undefined ||
      this.camera === undefined
    )
      return;
    
    this.wind.update();
    this.figure.update();
    this.figure.applyWind(this.wind);
    this.world.step(1 / 60);
    this.renderer.render(this.scene, this.camera);
  }
}