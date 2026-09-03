/*
  Cena 3D da marmoraria — Three.js, sem rede.

  Sobrou uma cena: a chapa virando bancada com a cuba recortada de verdade.
  A página amortece o progresso antes de repassar (ver `ligarCenas` no
  index.astro), por isso o movimento não segue o scroll 1:1.

  O tampo usa foto de Calacatta (public/img/marmore-branco.jpg) como albedo,
  recortada fora do reflexo de estúdio — reflexo baked em albedo vira mancha
  branca que não acompanha a luz da cena. Os acabamentos viraram foto trocada
  por CSS, sem 3D nenhum.
*/
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type Cena = {
  atualizar: (progresso: number) => void;
  render: () => void;
  redimensionar: () => void;
  destruir: () => void;
};

/** todo mesh do grupo projeta sombra no plano de chão */
function lancarSombra(raiz: THREE.Object3D) {
  raiz.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
}

const trava = (v: number) => Math.min(1, Math.max(0, v));
const faixa = (p: number, a: number, b: number) => trava((p - a) / (b - a));
const suave = (t: number) => t * t * (3 - 2 * t);

/* ---------- base compartilhada ---------- */

type Base = {
  renderer: THREE.WebGLRenderer;
  cena: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pedra: THREE.MeshPhysicalMaterial;
  redimensionar: (meiaL: number, meiaP: number, folga?: number) => void;
  destruirBase: () => void;
};

function montarBase(canvas: HTMLCanvasElement, chaoY = -1.35): Base | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // branco sobre fundo branco satura fácil; exposição menor guarda o degradê
  // das quinas, que é a única coisa que descreve a forma
  renderer.toneMappingExposure = 0.88;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 1.5, 4.6);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const amb = pmrem.fromScene(new RoomEnvironment(), 0.04);
  cena.environment = amb.texture;

  const luz = new THREE.DirectionalLight(0xffffff, 1.75);
  luz.position.set(1.5, 5.4, 1.9);
  luz.castShadow = true;
  luz.shadow.mapSize.set(1024, 1024);
  luz.shadow.camera.near = 0.5;
  luz.shadow.camera.far = 18;
  luz.shadow.camera.left = -4;
  luz.shadow.camera.right = 4;
  luz.shadow.camera.top = 4;
  luz.shadow.camera.bottom = -4;
  luz.shadow.bias = -0.0012;
  luz.shadow.radius = 7;
  // preenchimento fraco de propósito: é a diferença entre as faces que
  // desenha o volume da peça branca
  cena.add(luz, new THREE.AmbientLight(0xffffff, 0.2));

  // plano que só recebe sombra — dá o contato com o chão
  const chao = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.ShadowMaterial({ opacity: 0.19 }),
  );
  chao.rotation.x = -Math.PI / 2;
  chao.position.y = chaoY;
  chao.receiveShadow = true;
  cena.add(chao);

  // mármore polido: verniz alto e rugosidade baixa. O `map` entra em
  // criarBancada, que é onde as medidas do tampo existem para corrigir o UV.
  const pedra = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.24,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.0,
  });

  /*
    A distância saía de dois números fixos, um para retrato e um para paisagem.
    Em tela estreita o de retrato não bastava: a chapa tem 2,75 m de largura e
    sangrava pelas duas bordas, cortada justamente onde o veio conta a história.

    Agora o recuo é calculado: quanto a câmera precisa andar para a peça caber
    na largura disponível, com `+ meiaP` somando a perspectiva — a quina da
    frente está mais perto da lente e projeta maior que o centro.
  */
  const redimensionar = (meiaL: number, meiaP: number, folga = 1.06) => {
    // o canvas mede a si mesmo: no celular ele divide o sticky com a folha
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tg = Math.tan((camera.fov * Math.PI) / 360);
    // retrato é o quadro da peça: enquadra mais apertado, porque ela é o assunto
    const f = camera.aspect < 0.95 ? folga * 0.93 : folga;
    const porLargura = (meiaL * f) / (tg * camera.aspect) + meiaP;
    const porAltura = (meiaL * 0.62 * f) / tg + meiaP;
    camera.position.z = Math.max(porLargura, porAltura, 3.4);
    /*
      `lookAt` é rotação, não vínculo: rodava uma vez na montagem e ficava
      valendo a inclinação daquele z. Ao recuar a câmera, a mesma inclinação
      passava a apontar para baixo da peça e ela subia no quadro. Reapontar
      aqui mantém a bancada no centro em qualquer distância.
    */
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };

  const destruirBase = () => {
    cena.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const m = o.material;
        Array.isArray(m) ? m.forEach((x) => x.dispose()) : m.dispose();
      }
    });
    amb.texture.dispose();
    pmrem.dispose();
    renderer.dispose();
  };

  return { renderer, cena, camera, pedra, redimensionar, destruirBase };
}


/* ==================================================================
   CHAPA → BANCADA COM CUBA
   ================================================================== */

function retanguloArredondado(c: THREE.Shape | THREE.Path, larg: number, prof: number, raio: number, cx = 0, cy = 0) {
  const x = cx - larg / 2;
  const y = cy - prof / 2;
  const r = Math.min(raio, larg / 2, prof / 2);
  c.moveTo(x + r, y);
  c.lineTo(x + larg - r, y);
  c.quadraticCurveTo(x + larg, y, x + larg, y + r);
  c.lineTo(x + larg, y + prof - r);
  c.quadraticCurveTo(x + larg, y + prof, x + larg - r, y + prof);
  c.lineTo(x + r, y + prof);
  c.quadraticCurveTo(x, y + prof, x, y + prof - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
}

const TAMPO_L = 2.75;
const TAMPO_P = 1.35;
const CUBA_L = 0.92;
const CUBA_P = 0.58;
const CUBA_X = -0.42;

function geoTampo(abertura: number, espessura: number) {
  const forma = new THREE.Shape();
  retanguloArredondado(forma, TAMPO_L, TAMPO_P, 0.06);
  if (abertura > 0.02) {
    const furo = new THREE.Path();
    retanguloArredondado(furo, CUBA_L * abertura, CUBA_P * abertura, 0.09 * abertura, CUBA_X, 0);
    forma.holes.push(furo);
  }
  const g = new THREE.ExtrudeGeometry(forma, {
    depth: espessura,
    bevelEnabled: true,
    bevelSize: 0.007,
    bevelThickness: 0.007,
    bevelSegments: 3,
    curveSegments: 18,
  });
  g.rotateX(-Math.PI / 2);
  g.center();
  return g;
}

export function criarBancada(canvas: HTMLCanvasElement): Cena | null {
  const b = montarBase(canvas);
  if (!b) return null;

  const render = () => b.renderer.render(b.cena, b.camera);

  // `render` no onLoad: com prefers-reduced-motion a cena desenha uma vez só,
  // e sem isso ela desenharia antes da foto chegar e ficaria sem veio.
  const mapa = new THREE.TextureLoader().load('/img/marmore-branco.jpg', render);
  mapa.colorSpace = THREE.SRGBColorSpace;
  mapa.wrapS = mapa.wrapT = THREE.RepeatWrapping;
  mapa.anisotropy = b.renderer.capabilities.getMaxAnisotropy();
  /*
    ExtrudeGeometry gera UV a partir das coordenadas do desenho (metros), não
    de 0–1. Sem corrigir, a foto repetiria 2,75× no comprimento da chapa e a
    emenda apareceria. repeat = 1/medida e offset 0,5 encaixam a foto uma vez
    só — que é justamente como a chapa real é cortada: uma peça, um veio.
  */
  mapa.repeat.set(1 / TAMPO_L, 1 / TAMPO_P);
  mapa.offset.set(0.5, 0.5);
  b.pedra.map = mapa;
  b.pedra.needsUpdate = true;

  const grupo = new THREE.Group();
  b.cena.add(grupo);

  let passoFuro = -1;
  const tampo = new THREE.Mesh(geoTampo(0, 0.05), b.pedra);
  grupo.add(tampo);

  const cuba = new THREE.Mesh(
    new THREE.BoxGeometry(CUBA_L - 0.04, 0.32, CUBA_P - 0.04),
    new THREE.MeshStandardMaterial({
      color: 0xc9cbcf,
      metalness: 0.45,
      roughness: 0.3,
      side: THREE.BackSide,
      envMapIntensity: 1.2,
    }),
  );
  cuba.position.set(CUBA_X, -0.9, 0);
  grupo.add(cuba);

  const rodabanca = new THREE.Mesh(new THREE.BoxGeometry(TAMPO_L, 0.3, 0.055), b.pedra);
  rodabanca.position.set(0, 0, -TAMPO_P / 2 + 0.03);
  rodabanca.scale.y = 0.001;
  grupo.add(rodabanca);
  lancarSombra(grupo);

  const atualizar = (p: number) => {
    const pr = trava(p);
    const abertura = suave(faixa(pr, 0.3, 0.6));
    const espessura = 0.05 + suave(faixa(pr, 0.05, 0.38)) * 0.045;

    const passo = Math.round(abertura * 34);
    if (passo !== passoFuro) {
      passoFuro = passo;
      tampo.geometry.dispose();
      tampo.geometry = geoTampo(passo / 34, espessura);
    }

    const subida = suave(faixa(pr, 0.52, 0.8));
    cuba.position.y = -0.9 + subida * 0.72;
    cuba.visible = subida > 0.02;

    const rb = suave(faixa(pr, 0.74, 0.97));
    rodabanca.scale.y = Math.max(0.001, rb);
    rodabanca.position.y = (0.3 * rb) / 2 + 0.02;

    grupo.rotation.y = -1.15 + pr * 1.75;
    grupo.rotation.x = 0.42 - suave(faixa(pr, 0.1, 1)) * 0.24;
    grupo.position.y = -0.12 + Math.sin(pr * Math.PI) * 0.06;
  };

  /*
    A peça gira de -1,15 a +0,60 rad. A maior largura projetada nesse intervalo
    é quase a diagonal da chapa — enquadrar por ela é o que garante que nenhum
    giro corte o tampo, com a mesma escala em todo o percurso.
  */
  const MEIA_L = Math.hypot(TAMPO_L / 2, TAMPO_P / 2);
  const MEIA_P = TAMPO_P / 2;
  const enquadrar = () => b.redimensionar(MEIA_L, MEIA_P);

  enquadrar();
  atualizar(0);

  // dispose de material não solta textura: a foto tem que sair na mão
  const destruir = () => {
    mapa.dispose();
    b.destruirBase();
  };

  return { atualizar, render, redimensionar: enquadrar, destruir };
}
