import * as THREE from 'three';
import { TweenMax as TM } from "gsap";
import C from 'cannon';
import Wind from './Wind';

const size = 8;
const mass = 1;

export default class Figure {
  $image: HTMLImageElement;
  scene: THREE.Scene;
  loader: THREE.TextureLoader;
  image: THREE.Texture;
  sizes: THREE.Vector2;
  offset: THREE.Vector2;
  mouse: THREE.Vector2;
  bufferV: any;
  geometry: THREE.PlaneBufferGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh;
  world: C.World;
  stitches: Array<C.Body>;
  bufferV2: C.Vec3;

  constructor(scene: THREE.Scene, imageContainer: HTMLImageElement, world: C.World) {
    this.$image = imageContainer;
    this.$image.style.opacity = '0';

    this.scene = scene;
    this.world = world;

    this.loader = new THREE.TextureLoader();

    this.image = this.loader.load(this.$image.src);

    this.sizes = new THREE.Vector2(0, 0);
    this.offset = new THREE.Vector2(0, 0);
    this.mouse = new THREE.Vector2(0, 0);
    this.bufferV = new THREE.Vector3();
    this.bufferV2 = new C.Vec3();

    this.getSizes();

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, size, size);
    this.material = new THREE.MeshBasicMaterial({
      map: this.image
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);;

    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

    this.scene.add(this.mesh);

    this.stitches = [];
    this.createStitches();
  }

  getSizes = () => {
    const { width, height, top, left } = this.$image.getBoundingClientRect();
    this.sizes.set(width, height);
    this.offset.set(
      left - window.innerWidth / 2 + width / 2,
      -top + window.innerHeight / 2 - height / 2
    );
  }

  createStitches = () => {
    const particleShape = new C.Particle();
    const position = this.geometry.getAttribute("position");
    const { x: width, y: height } = this.sizes;

    for (let i = 0; i < position.count; i++) {
      const row = Math.floor(i / (size + 1));

      const pos = new C.Vec3(
        position.getX(i) * width,
        position.getY(i) * height,
        position.getZ(i)
      );

      const stitch = new C.Body({
        mass: row === 0 ? 0 : mass / position.count,
        linearDamping: 0.8,
        position: pos,
        shape: particleShape,
        velocity: new C.Vec3(0, 0, -300)
      });

      this.stitches.push(stitch);
      this.world.addBody(stitch);
    }

    for (let i = 0; i < position.count; i++) {
      const col = i % (size + 1);
      const row = Math.floor(i / (size + 1));

      if (col < size) this.connect(i, i + 1);
      if (row < size) this.connect(i, i + size + 1);
    }
  }

  connect = (i: number, j: number) => {
    // @ts-ignore
    const c = new C.DistanceConstraint(this.stitches[i], this.stitches[j]);

    this.world.addConstraint(c);
  }

  onMouseMove = (event: any) => {
    TM.to(this.mouse, 0.5, {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1
    });

    TM.to(this.mesh.rotation, 0.5, {
      x: -this.mouse.y * 0.3,
      y: this.mouse.x * (Math.PI / 6)
    });
  }

  applyWind = (wind: Wind) => {
    const position = this.geometry.getAttribute("position");

    for (let i = 0; i < position.count; i++) {
      const stitch = this.stitches[i];

      const windNoise = wind.flowfield[i];
      const tempPosPhysic = this.bufferV2.set(
        windNoise.x,
        windNoise.y,
        windNoise.z
      );

      stitch.applyForce(tempPosPhysic, C.Vec3.ZERO);
    }
  }

  update = () => {
    const position = this.geometry.getAttribute("position");
    const { x: width, y: height } = this.sizes;

    for (let i = 0; i < position.count; i++) {
      const p = this.bufferV.copy(this.stitches[i].position);
      position.setXYZ(i, p.x / width, p.y / height, p.z);
    }
    (position as THREE.BufferAttribute).needsUpdate = true;
  }
}