/*
  Pedras quentes do Ritual das Pétalas — cena 3D do Spa Floral.

  Uma pedra de base e mais uma por etapa do ritual (RITUAL tem quatro). O
  progresso (0 → 1) vem da seção passando pela tela: cada quarto pousa uma
  pedra na pilha, com um assentar curto, e a etapa correspondente acende na
  lista ao lado. As pétalas caem o tempo todo, devagar, e não dependem do
  scroll — é o que deixa a janela viva quando a pessoa para para ler.

  Basalto molhado (escuro, com brilho de verniz), luz de vela quente pela
  frente e contraluz lilás, que é a cor da casa.
*/
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Cena = {
  atualizar: (progresso: number, tempo: number) => void;
  render: () => void;
  redimensionar: () => void;
  destruir: () => void;
};

const trava = (v: number) => Math.min(1, Math.max(0, v));
const faixa = (p: number, a: number, b: number) => trava((p - a) / (b - a));

/* mesmo gerador dos outros 3D do portfólio: pedras iguais em todo carregamento */
function semente(s: number) {
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* pedra de rio: esfera achatada com o contorno levemente irregular */
function geoPedra(rand: () => number) {
  const g = new THREE.SphereGeometry(1, 48, 24);
  const pos = g.attributes.position;
  const f1 = rand() * 6, f2 = rand() * 6;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const a = Math.atan2(v.z, v.x);
    const k = 1 + 0.05 * Math.sin(a * 2 + f1) + 0.03 * Math.sin(a * 3 + f2);
    pos.setXYZ(i, v.x * k, v.y, v.z * k);
  }
  g.computeVertexNormals();
  return g;
}

/*
  Basalto: grão fino e poros, pintados num canvas. Vai como mapa de cor e de
  relevo; sem isso a pedra lê como plástico liso.
*/
function texturaBasalto(rand: () => number) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 118 + (rand() - 0.5) * 70;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  /* poros: pontos escuros espalhados */
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(0,0,0,${0.25 + rand() * 0.45})`;
    g.beginPath();
    g.arc(rand() * 256, rand() * 256, 0.6 + rand() * 1.8, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  return t;
}

/* vapor: uma mancha macia que sobe e some */
function texturaVapor() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,0.55)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

/* pétala: um plano curvado em concha */
function geoPetala() {
  const g = new THREE.PlaneGeometry(0.22, 0.3, 6, 6);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    /* ponta mais estreita e borda que levanta */
    pos.setX(i, x * (1 - 0.45 * (y / 0.3 + 0.5)));
    pos.setZ(i, (x * x) * 3.2 - y * 0.25);
  }
  g.computeVertexNormals();
  return g;
}

/* largura, altura e giro de cada pedra, de baixo para cima */
const PILHA = [
  { r: 1.15, h: 0.42, giro: 0.2 },
  { r: 0.92, h: 0.36, giro: -0.4 },
  { r: 0.74, h: 0.32, giro: 0.7 },
  { r: 0.58, h: 0.28, giro: -0.2 },
  { r: 0.42, h: 0.24, giro: 0.5 },
];

export function criarPedras(canvas: HTMLCanvasElement): Cena | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 2.3, 9.4);
  camera.lookAt(0, 1.45, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const amb = pmrem.fromScene(new RoomEnvironment(), 0.04);
  cena.environment = amb.texture;
  cena.environmentIntensity = 0.45;
  const vela = new THREE.PointLight(0xffb36b, 26, 12, 1.6);
  vela.position.set(1.6, 1.2, 2.6);
  const contra = new THREE.DirectionalLight(0xc59bff, 2.4);
  contra.position.set(-3, 4, -4);
  cena.add(vela, contra, new THREE.AmbientLight(0xe6d6ff, 0.25));

  const rand = semente(11);
  const grao = texturaBasalto(rand);
  const basalto = new THREE.MeshPhysicalMaterial({
    color: 0x3a3640, map: grao, bumpMap: grao, bumpScale: 1.4,
    roughness: 0.62, roughnessMap: grao, metalness: 0,
    /* pedra quente com óleo: um verniz fino, não plástico */
    clearcoat: 0.35, clearcoatRoughness: 0.45,
  });
  const descarte: { dispose: () => void }[] = [amb, pmrem, basalto, grao];

  /* altura em que cada pedra assenta: a soma das de baixo */
  let topo = 0;
  const pedras = PILHA.map((d) => {
    const geo = geoPedra(rand);
    descarte.push(geo);
    const m = new THREE.Mesh(geo, basalto);
    m.scale.set(d.r, d.h, d.r * 0.86);
    const y = topo + d.h * 0.92;
    topo = y + d.h * 0.92;
    m.rotation.y = d.giro;
    cena.add(m);
    return { m, y, d };
  });

  /* pétalas: rosa, lírio e jasmim do ritual */
  const petalaGeo = geoPetala();
  descarte.push(petalaGeo);
  const cores = [0xf7b6c8, 0xffffff, 0xf3d7ff, 0xe88aa6];
  const petalas = Array.from({ length: 16 }, (_, i) => {
    const mat = new THREE.MeshStandardMaterial({ color: cores[i % cores.length], roughness: 0.6, side: THREE.DoubleSide });
    descarte.push(mat);
    const m = new THREE.Mesh(petalaGeo, mat);
    cena.add(m);
    return {
      m,
      x: (rand() - 0.5) * 3.6,
      z: (rand() - 0.5) * 2.2,
      vel: 0.18 + rand() * 0.16,
      fase: rand() * 10,
      giro: new THREE.Vector3(rand(), rand(), rand()).multiplyScalar(1.4),
    };
  });

  /* sombra de contato: a pilha assenta numa superfície, não flutua */
  const sombraTex = texturaVapor();
  const sombraMat = new THREE.MeshBasicMaterial({ map: sombraTex, color: 0x000000, transparent: true, opacity: 0.75, depthWrite: false });
  const sombra = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.6), sombraMat);
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.y = 0.01;
  cena.add(sombra);
  descarte.push(sombraTex, sombraMat, sombra.geometry);

  /* vapor saindo do topo da pilha */
  const vaporTex = texturaVapor();
  descarte.push(vaporTex);
  const vapores = Array.from({ length: 7 }, (_, i) => {
    const mat = new THREE.SpriteMaterial({ map: vaporTex, transparent: true, depthWrite: false, opacity: 0 });
    descarte.push(mat);
    const sp = new THREE.Sprite(mat);
    cena.add(sp);
    return { sp, mat, fase: i / 7 };
  });

  const redimensionar = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  redimensionar();

  const ALTO = 4.2; // de onde as pedras caem

  const atualizar = (p: number, tempo: number) => {
    pedras.forEach(({ m, y, d }, i) => {
      /* a base já está lá; as outras quatro pousam uma por etapa */
      const t = i === 0 ? 1 : faixa(p, 0.08 + (i - 1) * 0.22, 0.08 + (i - 1) * 0.22 + 0.16);
      /* queda com um assentar: passa um pouco do ponto e volta */
      const cai = t < 0.8 ? (t / 0.8) ** 2 : 1 + Math.sin(((t - 0.8) / 0.2) * Math.PI) * 0.035;
      m.position.y = y + (1 - Math.min(1, cai)) * ALTO - (cai > 1 ? (cai - 1) * d.h : 0);
      m.visible = t > 0;
      m.rotation.y = d.giro + (1 - t) * 1.2;
    });
    /* a pilha inteira respira: gira bem devagar */
    const giro = tempo * 0.12;
    pedras.forEach(({ m, d }) => (m.rotation.y += giro * (0.5 + d.r * 0.3)));

    /* vapor só quando a pilha está completa: é o calor da última pedra */
    const quente = faixa(p, 0.8, 0.95);
    vapores.forEach((v) => {
      const t = (tempo * 0.12 + v.fase) % 1;
      v.sp.position.set(Math.sin(t * 6 + v.fase * 9) * 0.25, topo + 0.1 + t * 1.6, 0.2);
      v.sp.scale.setScalar(0.5 + t * 1.1);
      v.mat.opacity = Math.sin(t * Math.PI) * 0.22 * quente;
    });

    petalas.forEach((pt) => {
      const queda = ((tempo * pt.vel + pt.fase) % 1.0);
      pt.m.position.set(
        pt.x + Math.sin(tempo * 0.7 + pt.fase) * 0.35,
        4.2 - queda * 4.6,
        pt.z + Math.cos(tempo * 0.5 + pt.fase) * 0.2,
      );
      pt.m.rotation.set(tempo * pt.giro.x + pt.fase, tempo * pt.giro.y, tempo * pt.giro.z);
    });
  };

  return {
    atualizar,
    render: () => renderer.render(cena, camera),
    redimensionar,
    destruir: () => {
      renderer.dispose();
      descarte.forEach((d) => d.dispose());
    },
  };
}
