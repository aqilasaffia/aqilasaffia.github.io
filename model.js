import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.getElementById('fyp-3d');

const COLORS = {
  board: 0xc9ab85,
  card: 0xb8966b,
  cardDark: 0x8f7350,
  zone: 0x191919,
  stall: 0xf6f4ee,
  plate: 0x33261f,
  sign: 0x5a3b22,
  label: 0xf2e27a,
  beacon: 0x2aa39a,
  metal: 0x9a9a9a,
};

const px = (x, y) => [(x - 640) / 100, (y - 515) / 100];

function box(w, h, d, color, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function flat(points, color, y) {
  const shape = new THREE.Shape(points.map(([a, b]) => new THREE.Vector2(...px(a, b))));
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(Math.PI / 2);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color, roughness: 0.95, side: THREE.DoubleSide })
  );
  mesh.position.y = y;
  mesh.receiveShadow = true;
  return mesh;
}

function textTexture(lines, background, size = 92, width = 512, height = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `italic 700 ${size}px Georgia, serif`;
  ctx.lineWidth = size * 0.16;
  ctx.lineJoin = 'round';
  lines.forEach((line, i) => {
    const y = height / 2 + (i - (lines.length - 1) / 2) * size * 1.05;
    ctx.strokeStyle = '#8d8d8d';
    ctx.strokeText(line, width / 2 + 4, y + 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(line, width / 2, y);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function stall(x, y, vertical = false, tilt = 0) {
  const group = new THREE.Group();
  const [cx, cz] = px(x, y);
  [0.04, 0.12, 0.2].forEach(h => group.add(box(0.56, 0.035, 0.3, COLORS.stall, 0, h, 0)));
  [[-0.26, -0.13], [0.26, -0.13], [-0.26, 0.13], [0.26, 0.13]].forEach(([a, b]) => {
    group.add(box(0.035, 0.2, 0.035, COLORS.stall, a, 0.11, b));
  });
  group.position.set(cx, 0.03, cz);
  group.rotation.y = (vertical ? Math.PI / 2 : 0) + tilt;
  return group;
}

function row(fromX, toX, y, count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push(stall(fromX + ((toX - fromX) * i) / (count - 1), y));
  }
  return list;
}

function sign(lines, x, y, height = 0.75) {
  const group = new THREE.Group();
  const [cx, cz] = px(x, y);
  const face = new THREE.MeshStandardMaterial({ map: textTexture(lines, '#5a3b22') });
  const side = new THREE.MeshStandardMaterial({ color: COLORS.sign });
  const plate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 0.05), [side, side, side, side, face, face]);
  plate.position.y = height;
  plate.castShadow = true;
  group.add(plate);
  group.add(box(0.05, height, 0.05, COLORS.card, 0, height / 2, 0));
  group.position.set(cx, 0, cz);
  return group;
}

function beaconBox(x, y) {
  const group = new THREE.Group();
  const [cx, cz] = px(x, y);
  group.add(box(0.8, 0.42, 0.5, COLORS.card, 0, 0.23, 0));
  group.add(box(0.5, 0.01, 0.2, COLORS.label, 0, 0.445, 0));
  group.position.set(cx, 0.02, cz);
  return group;
}

function cart(x, y) {
  const group = new THREE.Group();
  const [cx, cz] = px(x, y);
  group.add(box(0.16, 0.1, 0.22, COLORS.metal, 0, 0.1, 0));
  group.position.set(cx, 0.02, cz);
  return group;
}

function buildMarket(scene) {
  const market = new THREE.Group();
  const add = (...items) => market.add(...items.flat());

  add(box(12.1, 0.1, 10.2, COLORS.board, 0, -0.05, 0));
  add(box(12.1, 0.7, 0.07, COLORS.card, 0, 0.3, -5.1));
  add(box(12.1, 0.35, 0.07, COLORS.card, 0, 0.13, 5.1));
  add(box(0.07, 0.7, 10.2, COLORS.cardDark, -6.05, 0.3, 0));
  add(box(0.07, 0.7, 10.2, COLORS.cardDark, 6.05, 0.3, 0));

  add(flat([[150, 125], [1145, 125], [1145, 262], [150, 232]], COLORS.zone, 0.012));
  add(flat([[425, 290], [812, 290], [812, 545], [410, 545]], COLORS.zone, 0.012));
  add(flat([[867, 312], [1015, 312], [1015, 450], [867, 450]], COLORS.zone, 0.012));
  add(flat([[870, 487], [1020, 487], [1020, 628], [870, 628]], COLORS.zone, 0.012));
  add(flat([[197, 435], [372, 445], [358, 695], [630, 770], [905, 697], [908, 825], [590, 915], [162, 770]], COLORS.zone, 0.012));

  const plateShape = [[405, 575], [812, 585], [808, 708], [650, 760], [400, 680]];
  add(flat(plateShape, COLORS.plate, 0.02));
  const title = new THREE.Mesh(
    new THREE.PlaneGeometry(3.1, 1.45),
    new THREE.MeshStandardMaterial({ map: textTexture(['Pasar', 'Payang'], '#33261f', 96), roughness: 0.9 })
  );
  title.rotation.x = -Math.PI / 2;
  const [titleX, titleZ] = px(608, 650);
  title.position.set(titleX, 0.024, titleZ);
  add(title);

  add(row(185, 410, 115, 5), row(490, 815, 115, 6), row(890, 1120, 130, 5));
  add(row(445, 790, 283, 7), row(450, 790, 355, 7), row(430, 780, 470, 7), row(435, 790, 535, 7));

  add(stall(945, 320), stall(888, 365, true), stall(1010, 368, true), stall(955, 425));
  add(stall(950, 492), stall(892, 550, true), stall(1015, 548, true), stall(957, 610));

  [[220, 440], [215, 498], [205, 550], [205, 605], [195, 650], [190, 693], [250, 745]].forEach(([x, y]) => add(stall(x, y)));
  [[335, 440], [328, 487], [328, 535], [325, 585], [322, 628], [318, 672]].forEach(([x, y]) => add(stall(x, y)));
  [[272, 505], [268, 575], [262, 650]].forEach(([x, y]) => add(stall(x, y, true)));
  [[395, 780], [432, 795], [470, 805], [505, 820], [540, 830]].forEach(([x, y]) => add(stall(x, y, true, 0.25)));
  [[650, 825], [692, 832], [730, 822], [768, 822], [815, 808], [860, 785], [900, 770]].forEach(([x, y]) => add(stall(x, y, true, -0.2)));

  add(sign(['Food', 'Zone'], 505, 165));
  add(sign(['Souvenir', 'Zone'], 800, 425, 0.6));
  add(sign(['Jewellery', 'Zone'], 380, 860, 0.6));

  add(beaconBox(330, 62), beaconBox(525, 925));
  add(cart(760, 198), cart(955, 560));

  scene.add(market);
}

function buildRings(scene) {
  const rings = [];
  [[330, 62, 0.5], [525, 925, 0.5], [895, 410, 0.1]].forEach(([x, y, height], beacon) => {
    const [cx, cz] = px(x, y);
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      new THREE.MeshBasicMaterial({ color: COLORS.beacon })
    );
    dot.position.set(cx, height, cz);
    scene.add(dot);
    [0, 0.5].forEach(offset => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.16, 0.2, 40),
        new THREE.MeshBasicMaterial({ color: COLORS.beacon, transparent: true, side: THREE.DoubleSide, depthWrite: false })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(cx, height + 0.02, cz);
      ring.userData.offset = offset + beacon * 0.17;
      scene.add(ring);
      rings.push(ring);
    });
  });
  return rings;
}

function start() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a4238, 1.5));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.4);
  sun.position.set(-6, 12, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, far: 30 });
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  buildMarket(scene);
  const rings = buildRings(scene);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(-4, 18.5, 19);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = 1.35;
  controls.autoRotate = !reduced;
  controls.autoRotateSpeed = 0.7;
  renderer.domElement.style.touchAction = 'pan-y';

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();

  const clock = new THREE.Clock();
  const draw = () => {
    const t = clock.getElapsedTime();
    rings.forEach(ring => {
      const phase = ((t / 2.2) + ring.userData.offset) % 1;
      ring.scale.setScalar(1 + phase * 3.4);
      ring.material.opacity = reduced ? 0.6 : (1 - phase) * 0.9;
    });
    controls.update();
    renderer.render(scene, camera);
  };

  new IntersectionObserver(([entry]) => {
    renderer.setAnimationLoop(entry.isIntersecting ? draw : null);
  }, { threshold: 0.05 }).observe(host);

  draw();
  host.classList.add('ready');
}

if (host) {
  try {
    start();
  } catch (error) {
    host.classList.remove('ready');
  }
}
