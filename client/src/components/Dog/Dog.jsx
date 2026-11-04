import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import s from './Dog.module.css';

// Jojo's rig ships without animation clips, so every pose is built from bone rotations.
// The model faces +Z; bone names come from the SmartRig export.
const LEGS = [
  { top: 'Bone_029', knee: 'Bone_027', front: true, phase: 0 }, // front left
  { top: 'Bone_034', knee: 'Bone_032', front: true, phase: Math.PI }, // front right
  { top: 'Bone_017', knee: 'Bone_016', front: false, phase: Math.PI }, // back left
  { top: 'Bone_022', knee: 'Bone_021', front: false, phase: 0 }, // back right
];
const TAIL = ['Bone_008', 'Bone_007', 'Bone_006', 'Bone_005'];

const TILT = 0.35; // how far the floor tips toward the viewer, in radians
const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const rand = (a, b) => a + Math.random() * (b - a);
const ease = (cur, target, dt, speed = 5) => cur + (target - cur) * (1 - Math.exp(-dt * speed));
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// A bone we rotate about world axes, measured from its rest pose.
function joint(model, name) {
  const bone = model.getObjectByName(name);
  const rest = bone.quaternion.clone();
  const parentInv = bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
  const ax = X.clone().applyQuaternion(parentInv);
  const ay = Y.clone().applyQuaternion(parentInv);
  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();
  return (pitch, yaw = 0) => {
    qa.setFromAxisAngle(ax, pitch);
    qb.setFromAxisAngle(ay, yaw);
    bone.quaternion.copy(qa).multiply(qb).multiply(rest);
  };
}

// What Jojo does next after finishing a state.
function nextState(prev, reduced) {
  if (reduced) return { name: 'lie', time: Infinity };
  if (prev !== 'walk') return { name: 'walk' };
  const r = Math.random();
  if (r < 0.35) return { name: 'idle', time: rand(2, 4) };
  if (r < 0.55) return { name: 'sniff', time: rand(1.5, 3) };
  if (r < 0.78) return { name: 'sit', time: rand(4, 7) };
  if (r < 0.9) return { name: 'lie', time: rand(7, 12) };
  return { name: 'walk' };
}

export default function Dog() {
  const canvasRef = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tag = tagRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;
    let frame = 0;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    // Pixel-unit camera: 1 world unit = 1 CSS pixel of the canvas.
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -10000, 10000);
    const stage = new THREE.Group(); // the floor, tipped toward the viewer
    stage.rotation.x = TILT;
    scene.add(stage);

    const dog = new THREE.Group(); // position and heading on the floor
    const body = new THREE.Group(); // hops and crouches
    dog.add(body);
    stage.add(dog);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    dog.add(shadow);

    let width = 0;
    let height = 0;
    let size = 0; // pixels per model unit
    let target = null;
    // Floor depth for a screen row (CSS px from the top); the floor's middle sits mid-screen.
    const floorZ = (y) => (y - height / 2) / Math.sin(TILT);
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      size = width < 600 ? 38 : 52;
      renderer.setSize(width, height);
      Object.assign(camera, { left: 0, right: width, top: height, bottom: 0 });
      camera.updateProjectionMatrix();
      stage.position.y = height / 2;
      dog.scale.setScalar(size);
      dog.position.x = THREE.MathUtils.clamp(dog.position.x, size * 1.4, width - size * 1.4);
      dog.position.z = THREE.MathUtils.clamp(dog.position.z, floorZ(size * 2.4), floorZ(height - size * 0.6));
      target = null;
    };
    // Somewhere on the desk, preferring spots off the book so Jojo doesn't park on the text.
    const pickTarget = () => {
      const book = document.querySelector('[data-book]')?.getBoundingClientRect();
      for (let i = 0; i < 30; i++) {
        const x = rand(size * 1.4, width - size * 1.4);
        const y = rand(size * 2.4, height - size * 0.6);
        const onBook = book && x > book.left - size && x < book.right + size && y > book.top && y < book.bottom + size;
        if (!onBook) return { x, z: floorZ(y) };
      }
      return { x: rand(size * 1.4, width - size * 1.4), z: floorZ(height - size * 0.6) };
    };
    resize();
    dog.position.set(width * 0.2, 0, floorZ(height - size * 0.8));
    dog.rotation.y = Math.PI / 2; // start in profile, facing right
    window.addEventListener('resize', resize);

    let rig = null;
    new GLTFLoader().load('/models/jojo.glb', (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse((o) => {
        if (!o.isMesh) return;
        // The texture already has lighting baked in, so skip scene lights.
        o.material = new THREE.MeshBasicMaterial({ map: o.material.map });
        o.frustumCulled = false;
      });
      model.updateMatrixWorld(true);
      rig = {
        root: joint(model, 'Bone_000'),
        neck: joint(model, 'Bone_009'),
        head: joint(model, 'Bone_023'),
        legs: LEGS.map((l) => ({ ...l, top: joint(model, l.top), knee: joint(model, l.knee) })),
        tail: TAIL.map((n) => joint(model, n)),
      };
      body.add(model);
    });

    // Blended pose weights, eased toward the current state's targets.
    const pose = { walk: 0, sit: 0, lie: 0, sniff: 0, look: 0, wag: 0.4 };
    let state = reduced ? { name: 'lie', time: Infinity } : { name: 'idle', time: 1.5 };
    let gait = 0;
    let hop = -1; // seconds into a hop, or -1
    let talk = 0; // seconds left on the speech bubble
    let clock = 0;
    let last = performance.now();

    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;

      if (state.name === 'walk') {
        if (!target) target = pickTarget();
        const dx = target.x - dog.position.x;
        const dz = target.z - dog.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 6) {
          target = null;
          state = nextState('walk', reduced);
        } else {
          dog.rotation.y += wrapAngle(Math.atan2(dx, dz) - dog.rotation.y) * Math.min(1, dt * 4);
          const step = Math.min(dist, size * 2 * dt);
          dog.position.x += Math.sin(dog.rotation.y) * step;
          dog.position.z += Math.cos(dog.rotation.y) * step;
          gait += dt * 9;
        }
      } else if ((state.time -= dt) <= 0) {
        state = nextState(state.name, reduced);
      }

      const n = state.name;
      pose.walk = ease(pose.walk, n === 'walk' ? 1 : 0, dt, 8);
      pose.sit = ease(pose.sit, n === 'sit' ? 1 : 0, dt, 4);
      pose.lie = ease(pose.lie, n === 'lie' ? 1 : 0, dt, 2.5);
      pose.sniff = ease(pose.sniff, n === 'sniff' ? 1 : 0, dt, 4);
      pose.look = ease(pose.look, n === 'idle' || n === 'sit' ? 1 : 0, dt, 2);
      pose.wag = ease(pose.wag, hop >= 0 ? 1 : n === 'lie' ? 0.04 : 0.45, dt, 4);

      let lift = 0;
      if (hop >= 0) {
        hop += dt;
        const u = hop / 0.55;
        if (u >= 1) hop = -1;
        else lift = 0.7 * 4 * u * (1 - u);
      }
      const breathe = reduced ? 0 : Math.sin(clock * 2) * 0.012 * pose.lie;
      body.position.y = lift - 0.3 * pose.sit - 0.5 * pose.lie + breathe;
      shadow.scale.set(0.55, 1.3, 1).multiplyScalar(1 - lift * 0.4);

      if (rig) {
        const { walk, sit, lie, sniff, look } = pose;
        rig.root(-0.4 * sit + Math.sin(gait * 2) * 0.03 * walk);
        for (const leg of rig.legs) {
          const swing = Math.sin(gait + leg.phase);
          const bend = Math.max(0, Math.cos(gait + leg.phase));
          if (leg.front) {
            leg.top(-0.45 * swing * walk - 0.3 * sit - 1.35 * lie, 0);
            leg.knee(0.6 * bend * walk + 0.25 * lie);
          } else {
            leg.top(-0.4 * swing * walk - 0.9 * sit - 1.1 * lie);
            leg.knee(-0.5 * bend * walk + 1.5 * sit + 1.9 * lie);
          }
        }
        const sniffBob = Math.sin(clock * 14) * 0.06 * sniff;
        rig.neck(0.45 * sniff + 0.25 * lie + 0.3 * sit);
        rig.head(0.3 * sniff + sniffBob + 0.2 * lie - 0.2 * sit, Math.sin(clock * 0.8) * 0.55 * look);
        const wagSpeed = hop >= 0 ? 22 : 10;
        rig.tail.forEach((t, i) => t(-0.1 * lie, pose.wag * Math.sin(clock * wagSpeed - i * 0.6)));
      }
      renderer.render(scene, camera);

      // The name tag floats above Jojo; after a click it opens into a speech bubble for a few seconds.
      if (rig) {
        const [x, y] = toScreen(0, 1.9 + lift);
        tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
        tag.dataset.ready = '';
        if (talk > 0 && (talk -= dt) <= 0) delete tag.dataset.talk;
      }
    };
    frame = requestAnimationFrame(tick);

    // A point on Jojo (in model units) to CSS pixels; the canvas fills the viewport.
    const point = new THREE.Vector3();
    const toScreen = (x, y) => {
      dog.localToWorld(point.set(x, y, 0)).project(camera);
      return [((point.x + 1) / 2) * width, ((1 - point.y) / 2) * height];
    };

    // The canvas ignores the pointer so the book stays clickable; hit-test clicks against Jojo instead.
    const onPointer = (e) => {
      if (!rig) return;
      const [px, py] = toScreen(0, 0.8);
      if (Math.hypot(e.clientX - px, e.clientY - py) > size * 1.1) return;
      hop = 0;
      talk = 5;
      tag.dataset.talk = '';
      if (!reduced) state = { name: 'idle', time: 1.5 };
    };
    window.addEventListener('pointerdown', onPointer);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointer);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={s.dog} aria-hidden="true" />
      <p ref={tagRef} className={s.tag}>
        <span className={s.name}>Jojo</span>
        <span className={s.bubble}>Woof! I'm Jojo, Karl's dog. He made this 3D model of me.</span>
      </p>
    </>
  );
}
