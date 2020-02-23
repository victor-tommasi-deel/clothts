import SimplexNoise from "simplex-noise";
import * as THREE from 'three';
import gsap from "gsap";
import { Clock } from "three";

const noise = new SimplexNoise();
const baseForce = 1000;
const off = 0.05;

export default class Wind {
  figure: any;
  force: number;
  clock: Clock;
  direction: THREE.Vector3;
  flowfield: Array<THREE.Vector3>;

  constructor(figure: any) {
    const { count } = figure.geometry.getAttribute("position");
    this.figure = figure;

    this.force = baseForce / count;

    this.clock = new Clock();
    this.direction = new THREE.Vector3(0.5, 0, -1);
    this.flowfield = new Array(count);

    this.update();

    this.bindEvents();
  }

  bindEvents = () => {
    window.addEventListener("mousemove", this.onMouseMove);
  }

  onMouseMove = (e: any) => {
    const { clientX: x, clientY: y } = e;
    const { innerWidth: W, innerHeight: H } = window;

    gsap.to(this.direction, {
      duration: 0.8,
      x: x / W - 0.5,
      y: -(y / H) + 0.5
    });
  }

  update = () => {
    const time = this.clock.getElapsedTime();

    const position = this.figure.geometry.getAttribute("position");
    const size = this.figure.geometry.parameters.widthSegments;

    for (let i = 0; i < position.count; i++) {
      const col = i % (size + 1);
      const row = Math.floor(i / (size + 1));

      const force =
        (noise.noise3D(row * off, col * off, time) * 0.5 + 0.5) * this.force;

      this.flowfield[i] = this.direction.clone().multiplyScalar(force);
    }
  }

}