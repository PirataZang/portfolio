/*
  Cubo mágico do herói do portfólio.

  Chega embaralhado e se resolve sozinho, giro a giro, com estado de verdade
  (cada giro muda onde as peças estão). Enquanto o herói está na tela ele
  vive em loop: resolvido, respira alguns segundos, se embaralha com giros
  rápidos e se resolve de novo. Inclina um pouco seguindo o mouse. A página
  diz onde ele fica e com que força aparece (`Onde`): no herói à direita do
  título, e de novo, mais discreto, ao lado do contato. Entre os dois some.

  A neblina na cor da noite do site afunda a parte de trás do cubo no fundo,
  para ele ler como cenário e não como adesivo colado por cima.
*/
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/* centro do cubo em pixels da tela, escala relativa e o mouse (-1 a 1) */
export type Onde = { x: number; y: number; tam: number; mx?: number; my?: number };
export type Cena = {
  atualizar: (onde: Onde, tempo: number) => void;
  /* avança os giros; `vivo` liga o loop de embaralhar e resolver */
  passo: (dt: number, vivo: boolean) => boolean;
  render: () => void;
  redimensionar: () => void;
  destruir: () => void;
};

const suave = (t: number) => t * t * (3 - 2 * t);

/* paleta do site: anil, roxo, ciano e gelo apagado */
const CORES: [THREE.Vector3Tuple, string][] = [
  [[0, 0, 1], '#4472f7'],
  [[1, 0, 0], '#a259f7'],
  [[0, 1, 0], '#35d6f0'],
  [[0, 0, -1], '#5b2ec4'],
  [[-1, 0, 0], '#2c3f9e'],
  [[0, -1, 0], '#b9c3ec'],
];

const FOV = 35;
const DIST = 14;
const LADO = 0.96;
const EIXOS = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
/* quantos giros ele desfaz ao chegar, e quanto tempo cada um leva */
const EMBARALHO = 8;
const GIRO_S = 0.42;
const FOLGA_S = 0.14;
/* embaralhar é rápido e resolver é calmo: lê como alguém resolvendo */
const GIRO_RAPIDO_S = 0.22;
const RESPIRO_S = 4.5;

type Giro = { eixo: number; camada: number; dir: number };

export function criarCubo(canvas: HTMLCanvasElement): Cena | null {
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
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.set(0, 0, DIST);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const amb = pmrem.fromScene(new RoomEnvironment(), 0.04);
  cena.environment = amb.texture;
  cena.environmentIntensity = 0.5;
  const luz = new THREE.DirectionalLight(0xdfe6ff, 1.5);
  luz.position.set(-5, 8, 9);
  cena.add(luz, new THREE.AmbientLight(0x8090ff, 0.22));
  cena.fog = new THREE.Fog(0x07080f, 11, 19);

  /* ---------- peças ---------- */
  const corpoGeo = new RoundedBoxGeometry(LADO, LADO, LADO, 3, 0.09);
  const arestaGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(LADO * 1.002, LADO * 1.002, LADO * 1.002));
  const adesivo = (() => {
    const s = 0.4, r = 0.11, f = new THREE.Shape();
    f.moveTo(-s + r, -s);
    f.lineTo(s - r, -s); f.quadraticCurveTo(s, -s, s, -s + r);
    f.lineTo(s, s - r); f.quadraticCurveTo(s, s, s - r, s);
    f.lineTo(-s + r, s); f.quadraticCurveTo(-s, s, -s, s - r);
    f.lineTo(-s, -s + r); f.quadraticCurveTo(-s, -s, -s + r, -s);
    return new THREE.ShapeGeometry(f, 4);
  })();
  const corpoMat = new THREE.MeshStandardMaterial({ color: 0x121629, roughness: 0.42, metalness: 0.35 });
  const peleMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.32, metalness: 0.05 });
  const bordaMat = new THREE.LineBasicMaterial({ color: 0x4472f7, transparent: true, opacity: 0.3 });

  const grupo = new THREE.Group();
  cena.add(grupo);

  /* halo roxo atrás do cubo: destaca do fundo sem contorno duro */
  const haloTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(162, 89, 247, 0.55)');
    r.addColorStop(0.45, 'rgba(68, 114, 247, 0.18)');
    r.addColorStop(1, 'rgba(68, 114, 247, 0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const haloMat = new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
  const halo = new THREE.Sprite(haloMat);
  cena.add(halo);
  /* contraluz roxa: desenha a silhueta do cubo contra a noite */
  const contra = new THREE.DirectionalLight(0xa259f7, 2.2);
  contra.position.set(6, 3, -8);
  cena.add(contra);
  const pecas: { g: THREE.Group; pos: THREE.Vector3; rot: THREE.Quaternion }[] = [];
  const geos: THREE.BufferGeometry[] = [];

  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        if (!x && !y && !z) continue;
        const partes: THREE.BufferGeometry[] = [];
        for (const [n, cor] of CORES) {
          if (n[0] * x + n[1] * y + n[2] * z !== 1) continue;
          const g = adesivo.clone();
          const normal = new THREE.Vector3(...n);
          g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal));
          g.translate(...normal.multiplyScalar(LADO / 2 + 0.004).toArray());
          const c = new THREE.Color(cor);
          const cores = new Float32Array(g.attributes.position.count * 3);
          for (let i = 0; i < cores.length; i += 3) c.toArray(cores, i);
          g.setAttribute('color', new THREE.BufferAttribute(cores, 3));
          partes.push(g);
        }
        const peleGeo = mergeGeometries(partes);
        geos.push(peleGeo);
        const g = new THREE.Group();
        g.add(new THREE.Mesh(corpoGeo, corpoMat), new THREE.Mesh(peleGeo, peleMat), new THREE.LineSegments(arestaGeo, bordaMat));
        grupo.add(g);
        pecas.push({ g, pos: new THREE.Vector3(x, y, z), rot: new THREE.Quaternion() });
      }

  /* ---------- giros ---------- */
  const qGiro = new THREE.Quaternion();
  const naCamada = (pos: THREE.Vector3, m: Giro) => Math.round(pos.getComponent(m.eixo)) === m.camada;
  const aplicar = (m: Giro) => {
    qGiro.setFromAxisAngle(EIXOS[m.eixo], (m.dir * Math.PI) / 2);
    for (const pc of pecas)
      if (naCamada(pc.pos, m)) {
        pc.pos.applyQuaternion(qGiro).round();
        pc.rot.premultiply(qGiro);
      }
  };

  /* embaralha na criação; a pilha guarda o caminho de volta */
  const pilha: Giro[] = [];
  for (let i = 0; i < EMBARALHO; i++) {
    const ultimo = pilha[pilha.length - 1];
    let eixo = Math.floor(Math.random() * 3);
    if (ultimo && eixo === ultimo.eixo) eixo = (eixo + 1) % 3;
    const m = { eixo, camada: Math.random() < 0.5 ? -1 : 1, dir: Math.random() < 0.5 ? -1 : 1 };
    aplicar(m);
    pilha.push({ ...m, dir: -m.dir });
  }
  let giro: Giro | null = null;
  let volta = false;
  let tGiro = 0;
  let espera = 0.7;
  /* resolvendo → parado (respira) → embaralhando → resolvendo … */
  let modo: 'resolvendo' | 'parado' | 'embaralhando' = 'resolvendo';
  let faltam = 0;

  const sortear = (): Giro => {
    const ultimo = pilha[pilha.length - 1];
    let eixo = Math.floor(Math.random() * 3);
    if (ultimo && eixo === ultimo.eixo) eixo = (eixo + 1) % 3;
    return { eixo, camada: Math.random() < 0.5 ? -1 : 1, dir: Math.random() < 0.5 ? -1 : 1 };
  };

  const passo = (dt: number, vivo: boolean) => {
    if (!giro) {
      if (modo === 'parado') {
        if (!vivo) return false;
        espera -= dt;
        if (espera > 0) return false;
        modo = 'embaralhando';
        faltam = 6;
      }
      if (modo === 'embaralhando' && faltam > 0) {
        giro = sortear();
        volta = false;
        faltam--;
      } else {
        if (modo === 'embaralhando') { modo = 'resolvendo'; espera = 0.5; }
        if (!pilha.length) { modo = 'parado'; espera = RESPIRO_S; return false; }
        espera -= dt;
        if (espera > 0) return true;
        giro = pilha.pop()!;
        volta = true;
      }
      tGiro = 0;
    }
    tGiro += dt / (volta ? GIRO_S : GIRO_RAPIDO_S);
    if (tGiro >= 1) {
      aplicar(giro);
      /* giro de embaralhar empilha o caminho de volta */
      if (!volta) pilha.push({ ...giro, dir: -giro.dir });
      giro = null;
      espera = volta ? FOLGA_S : 0.04;
    }
    return true;
  };

  /* ---------- tela → mundo no plano z = 0 ---------- */
  let L = 1, A = 1, visH = 1, visW = 1;
  const meia = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * DIST;
  const redimensionar = () => {
    L = canvas.clientWidth || 1;
    A = canvas.clientHeight || 1;
    renderer.setSize(L, A, false);
    camera.aspect = L / A;
    camera.updateProjectionMatrix();
    visH = meia * 2;
    visW = visH * camera.aspect;
  };
  redimensionar();

  const qA = new THREE.Quaternion();
  const euler = new THREE.Euler();
  let mx = 0, my = 0;

  const atualizar = (onde: Onde, tempo: number) => {
    grupo.position.set((onde.x / L - 0.5) * visW, -(onde.y / A - 0.5) * visH, 0);
    grupo.scale.setScalar(0.6 * onde.tam);
    halo.position.set(grupo.position.x, grupo.position.y, -3);
    halo.scale.setScalar(9 * onde.tam);
    /* o mouse inclina o cubo, com atraso: segue a mão sem tremer */
    mx += ((onde.mx ?? 0) - mx) * 0.06;
    my += ((onde.my ?? 0) - my) * 0.06;
    /* três-quartos, girando devagar e balançando um pouco no eixo x */
    grupo.quaternion.setFromEuler(euler.set(0.44 + 0.06 * Math.sin(tempo * 0.4) + my * 0.28, -0.7 + tempo * 0.12 + mx * 0.4, 0));
    for (const pc of pecas) {
      qA.identity();
      pc.g.position.copy(pc.pos).multiplyScalar(LADO + 0.04);
      if (giro && naCamada(pc.pos, giro)) {
        qA.setFromAxisAngle(EIXOS[giro.eixo], ((giro.dir * Math.PI) / 2) * suave(Math.min(1, tGiro)));
        pc.g.position.applyQuaternion(qA);
      }
      pc.g.quaternion.copy(qA).multiply(pc.rot);
    }
  };

  return {
    atualizar,
    passo,
    render: () => renderer.render(cena, camera),
    redimensionar,
    destruir: () => {
      renderer.dispose();
      amb.dispose();
      pmrem.dispose();
      corpoGeo.dispose();
      arestaGeo.dispose();
      adesivo.dispose();
      geos.forEach((g) => g.dispose());
      [corpoMat, peleMat, bordaMat, haloMat, haloTex].forEach((m) => m.dispose());
    },
  };
}
