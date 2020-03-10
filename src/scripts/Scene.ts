import * as THREE from 'three';
import Figure from "./Figure";
import Wind from "./Wind";
import C from "cannon";

interface Figures { figure: Figure, wind: Wind };

export default class Scene {
  container: HTMLCanvasElement;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  // figure: Figure;
  figures: Array<Figures>;
  imageContainers: Array<HTMLImageElement>;
  world: C.World;
  // wind: Wind;
  // winds: Array<Wind>;
  ambientLight: THREE.AmbientLight;

  constructor(container: HTMLCanvasElement, imageContainers: Array<HTMLImageElement>) {
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
    this.imageContainers = imageContainers;
    this.figures = this.initFigures();
  }

  initFigures = () => {
    const figures = [];
    for (let index = 0; index < this.imageContainers.length; index++) {
      const imageContainer = this.imageContainers[index];
      const figure = new Figure(this.scene, imageContainer, this.world);
      const wind = new Wind(figure.mesh);
      const obj = {
        figure,
        wind
      }
      figures.push(obj);
    }
    return figures;
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

  getFigures = () => this.figures;

  getWorld = () => this.world;

  getScene = () => this.scene;

  updateFigures = () => {
    for (let index = 0; index < this.figures.length; index++) {
      const { figure, wind } = this.figures[index];
      wind.update();
      figure.update();
      figure.applyWind(wind);
    }
  }

  update = () => {
    if (
      this.renderer === undefined ||
      this.scene === undefined ||
      this.camera === undefined
    )
      return;

    this.updateFigures();
    this.world.step(1 / 60);
    this.renderer.render(this.scene, this.camera);
  }
}