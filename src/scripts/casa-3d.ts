/*
  Da planta ao habite-se — cena 3D dirigida pelo scroll.

  A geometria toda sai de casa-plano.ts: as mesmas paredes que o SVG desenha
  em planta são extrudadas aqui. O progresso (0→1) percorre as etapas de obra
  na ordem em que elas acontecem no canteiro:

    locação → fundação → pilares → alvenaria → laje → cobertura → esquadrias → acabamento

  A casa gira 360° enquanto sobe. Um box unitário é reaproveitado por todos os
  volumes: o que muda é escala e posição, não geometria. O telhado é a exceção
  — são telhas de verdade, assentadas uma a uma num InstancedMesh.
*/
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { H, LARG, PROF, LIM, PILARES, TODOS_BLOCOS, TODOS_VAOS, BEIRAL, INCL, RUN, SUBIDA, Y_LAJE, Y_TELHA } from './casa-plano';

export type Cena = {
  atualizar: (progresso: number) => void;
  render: () => void;
  redimensionar: () => void;
  destruir: () => void;
};

const trava = (v: number) => Math.min(1, Math.max(0, v));
const faixa = (p: number, a: number, b: number) => trava((p - a) / (b - a));
const suave = (t: number) => t * t * (3 - 2 * t);

/* gerador determinístico: textura e variação de telha iguais em todo carregamento */
function semente(s: number) {
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/*
  Grão de reboco. Vira roughnessMap e bumpMap: a parede deixa de ser um plano
  chapado e passa a devolver luz de forma irregular, que é o que o olho lê
  como "textura" antes de ler qualquer desenho.
*/
function texturaGrao(tam = 256) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = tam;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(tam, tam);
  const r = semente(90218);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 150 + r() * 105;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // manchas largas por cima: reboco não tem grão uniforme
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 26; i++) {
    const g = ctx.createRadialGradient(r() * tam, r() * tam, 2, r() * tam, r() * tam, 20 + r() * 60);
    g.addColorStop(0, r() > 0.5 ? '#fff' : '#8c8c8c');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, tam, tam);
  }
  return cv;
}

/* malha do terreno: o gabarito continua visível debaixo da casa */
function texturaTerreno(tam = 512) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = tam;
  const ctx = cv.getContext('2d')!;
  ctx.clearRect(0, 0, tam, tam);
  ctx.strokeStyle = 'rgba(27,79,214,0.16)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= tam; i += tam / 16) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, tam); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(tam, i); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(27,79,214,0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= tam; i += tam / 4) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, tam); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(tam, i); ctx.stroke();
  }
  return cv;
}

/* telhado: quantas telhas por água. Ordem de assentamento: beiral → cumeeira */
const COLS = 16;
const LINHAS = 7;
const POR_AGUA = COLS * LINHAS;

const CAIXA = new THREE.BoxGeometry(1, 1, 1);
const CONCRETO = new THREE.Color(0xc4bfb6);

/*
  Enquadramento. A casa é um retângulo de 10,40 × 8,00 com 60 cm de beiral em
  volta, e ela gira 360°: a largura que precisa caber na tela vai de 9,2 m
  (fachada de frente) a 14,8 m (na diagonal). Com distância fixa é preciso
  reservar sempre o pior caso — e no celular, onde a largura é o gargalo, isso
  deixa a casa pequena e sobrando céu por todo lado.

  Então a câmera recua conforme o giro. Não até o ajuste exato, que faria a
  casa "respirar" de tamanho a cada volta: mistura com o pior caso, o quadro
  fica cheio e o tamanho aparente quase constante.
*/
const MEIA_X = LARG / 2 + BEIRAL;
const MEIA_Z = PROF / 2 + BEIRAL;
const MEIA_MAX = Math.hypot(MEIA_X, MEIA_Z);
const AJUSTE = 0.85;                            // 0 = distância fixa, 1 = ajuste exato
const FOV = 32;
const TG = Math.tan((FOV * Math.PI) / 360);     // tangente da meia-abertura vertical
const ALTURA = 5.4;                             // casa com telhado, já com folga

/** cresce da base para cima, como parede subindo fiada por fiada */
function erguer(m: THREE.Object3D, base: number, alt: number, k: number) {
  const kk = Math.max(0.0015, k);
  m.visible = k > 0.002;
  m.scale.y = kk * alt;
  m.position.y = base + (alt * kk) / 2;
}

export function criarCasa(canvas: HTMLCanvasElement): Cena | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const cena = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const amb = pmrem.fromScene(new RoomEnvironment(), 0.04);
  cena.environment = amb.texture;

  const sol = new THREE.DirectionalLight(0xfff4e6, 2.0);
  sol.position.set(7, 13, 6);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  sol.shadow.camera.near = 1;
  sol.shadow.camera.far = 42;
  sol.shadow.camera.left = -11;
  sol.shadow.camera.right = 11;
  sol.shadow.camera.top = 11;
  sol.shadow.camera.bottom = -11;
  sol.shadow.bias = -0.0012;
  sol.shadow.radius = 4;
  cena.add(sol, new THREE.AmbientLight(0xdce6f5, 0.34));

  const terreno = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.ShadowMaterial({ opacity: 0.2 }),
  );
  terreno.rotation.x = -Math.PI / 2;
  terreno.position.y = -0.62;
  terreno.receiveShadow = true;
  cena.add(terreno);

  const grupo = new THREE.Group();
  cena.add(grupo);

  /* ---------- texturas ---------- */
  const grao = new THREE.CanvasTexture(texturaGrao());
  grao.wrapS = grao.wrapT = THREE.RepeatWrapping;
  grao.repeat.set(3, 3);

  const malha = new THREE.CanvasTexture(texturaTerreno());
  malha.colorSpace = THREE.SRGBColorSpace;

  /* ---------- materiais (um por etapa: a opacidade é por fase) ---------- */
  const mat = {
    fund: new THREE.MeshStandardMaterial({ color: 0xa8a49c, roughness: 0.96, metalness: 0, roughnessMap: grao }),
    pilar: new THREE.MeshStandardMaterial({ color: 0xc4bfb6, roughness: 0.9, metalness: 0, roughnessMap: grao }),
    parede: new THREE.MeshStandardMaterial({
      color: 0xa9705a, roughness: 0.95, metalness: 0,
      roughnessMap: grao, bumpMap: grao, bumpScale: 0.4,
    }),
    viga: new THREE.MeshStandardMaterial({ color: 0xc4bfb6, roughness: 0.9, metalness: 0, roughnessMap: grao }),
    telha: new THREE.MeshStandardMaterial({ color: 0xb2604f, roughness: 0.78, metalness: 0, roughnessMap: grao }),
    madeiramento: new THREE.MeshStandardMaterial({ color: 0x6d6257, roughness: 0.9, metalness: 0, transparent: true, opacity: 0 }),
    oitao: new THREE.MeshStandardMaterial({ color: 0xb08b6a, roughness: 0.95, metalness: 0, roughnessMap: grao, transparent: true, opacity: 0 }),
    vidro: new THREE.MeshPhysicalMaterial({
      color: 0x9fd0e8, roughness: 0.04, metalness: 0.15,
      transparent: true, opacity: 0, envMapIntensity: 2.2,
    }),
    caixilho: new THREE.MeshStandardMaterial({ color: 0x2e3238, roughness: 0.5, metalness: 0.55, transparent: true, opacity: 0 }),
    madeira: new THREE.MeshStandardMaterial({ color: 0x7d6247, roughness: 0.6, metalness: 0, transparent: true, opacity: 0 }),
    piso: new THREE.MeshStandardMaterial({ color: 0xd6d0c6, roughness: 0.72, metalness: 0, roughnessMap: grao }),
  };

  const box = (m: THREE.Material, l: number, a: number, p: number, ang = 0) => {
    const o = new THREE.Mesh(CAIXA, m);
    o.scale.set(l, a, p);
    o.rotation.y = ang;
    o.castShadow = true;
    o.receiveShadow = true;
    grupo.add(o);
    return o;
  };

  /* ---------- 1. locação: terreno demarcado e eixos riscados ---------- */
  const lote = new THREE.Mesh(
    new THREE.PlaneGeometry(LARG + 7, PROF + 6),
    new THREE.MeshBasicMaterial({ map: malha, transparent: true, opacity: 0, depthWrite: false }),
  );
  lote.rotation.x = -Math.PI / 2;
  lote.position.y = -0.6;
  grupo.add(lote);

  const pts: number[] = [];
  for (const b of TODOS_BLOCOS()) pts.push(b.ax, 0.02, b.az, b.bx, 0.02, b.bz);
  const geoLinhas = new THREE.BufferGeometry();
  geoLinhas.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const matLinhas = new THREE.LineBasicMaterial({ color: 0x1b62c9, transparent: true, opacity: 0 });
  const linhas = new THREE.LineSegments(geoLinhas, matLinhas);
  grupo.add(linhas);

  // gabarito: estacas do canteiro
  const gabarito = PILARES.map(([x, z]) => {
    const o = box(mat.fund, 0.1, 0.9, 0.1);
    o.position.set(x, 0, z);
    return o;
  });

  /* ---------- 2. fundação: sapatas, baldrame e contrapiso ---------- */
  const sapatas = PILARES.map(([x, z]) => {
    const o = box(mat.fund, 0.75, 0.3, 0.75);
    o.position.set(x, 0, z);
    return o;
  });

  const baldrame = TODOS_BLOCOS()
    .filter((b) => b.y0 === 0)
    .map((b) => {
      const o = box(mat.fund, b.comp, 0.35, b.esp + 0.08, b.ang);
      o.position.set(b.cx, 0, b.cz);
      return o;
    });

  const contrapiso = box(mat.piso, LARG + 0.3, 0.16, PROF + 0.3);
  contrapiso.position.set((LIM.x1 + LIM.x2) / 2, 0, (LIM.z1 + LIM.z2) / 2);

  /* ---------- 3. estrutura: pilares ---------- */
  const pilares = PILARES.map(([x, z]) => {
    const o = box(mat.pilar, 0.22, H, 0.22);
    o.position.set(x, 0, z);
    return o;
  });

  /* ---------- 4. alvenaria ---------- */
  const alvenaria = TODOS_BLOCOS().map((b) => {
    const o = box(mat.parede, b.comp, b.alt, b.esp, b.ang);
    o.position.set(b.cx, 0, b.cz);
    return { o, b };
  });

  /* ---------- 5. vigas de respaldo + laje ---------- */
  const vigas = TODOS_BLOCOS()
    .filter((b) => b.y0 === 0)
    .map((b) => {
      const o = box(mat.viga, b.comp, 0.2, b.esp + 0.04, b.ang);
      o.position.set(b.cx, 0, b.cz);
      return o;
    });

  const laje = box(mat.viga, LARG + 0.1, 0.12, PROF + 0.1);
  laje.position.set(0, 0, 0);

  /* ---------- 6. cobertura: madeiramento + telha por telha ---------- */
  const telhado = new THREE.Group();
  grupo.add(telhado);

  const compAgua = RUN / Math.cos(INCL);
  const largAgua = LARG + BEIRAL * 2;
  const tw = largAgua / COLS;
  const tl = compAgua / LINHAS;
  const rnd = semente(31337);

  const telhas: THREE.InstancedMesh[] = [];
  const mAux = new THREE.Matrix4();
  const qAux = new THREE.Quaternion();
  const vPos = new THREE.Vector3();
  const vEsc = new THREE.Vector3();

  for (const lado of [1, -1]) {
    const agua = new THREE.Group();
    agua.position.set(0, Y_TELHA + SUBIDA / 2, (lado * RUN) / 2);
    agua.rotation.x = lado * INCL;
    telhado.add(agua);

    // ripamento: o que sustenta a telha, entra antes dela
    const base = new THREE.Mesh(CAIXA, mat.madeiramento);
    base.scale.set(largAgua - 0.1, 0.07, compAgua - 0.06);
    base.castShadow = true;
    base.receiveShadow = true;
    agua.add(base);

    const im = new THREE.InstancedMesh(CAIXA, mat.telha, POR_AGUA);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    im.castShadow = true;
    im.receiveShadow = true;
    // cada telha queima diferente no forno: a variação de tom é o que dá textura ao pano
    const cor = new THREE.Color();
    for (let i = 0; i < POR_AGUA; i++) {
      cor.setHSL(0.028 + rnd() * 0.02, 0.34 + rnd() * 0.12, 0.42 + rnd() * 0.1);
      im.setColorAt(i, cor);
    }
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    agua.add(im);
    telhas.push(im);
  }

  // oitões: o triângulo de alvenaria que fecha a empena
  const oitao = new THREE.Shape();
  oitao.moveTo(-PROF / 2, 0);
  oitao.lineTo(PROF / 2, 0);
  oitao.lineTo(0, SUBIDA);
  oitao.closePath();
  const geoOitao = new THREE.ExtrudeGeometry(oitao, { depth: 0.15, bevelEnabled: false });
  for (const lado of [1, -1]) {
    const o = new THREE.Mesh(geoOitao, mat.oitao);
    o.rotation.y = (lado * Math.PI) / 2;
    o.position.set(lado * (LARG / 2 + 0.075), Y_TELHA, 0);
    o.castShadow = true;
    telhado.add(o);
  }

  /* ---------- 7. esquadrias ---------- */
  const esquadrias = TODOS_VAOS().map((v) => {
    const alt = v.y1 - v.y0;
    const madeira = v.tipo === 'porta';
    // o vidro é menor em vão e mais fundo que o caixilho: sobra o quadro por fora
    const o = box(
      madeira ? mat.madeira : mat.vidro,
      v.larg - (madeira ? 0.04 : 0.11), madeira ? alt : alt - 0.11, madeira ? 0.05 : 0.12,
      v.ang,
    );
    o.position.set((v.ax + v.bx) / 2, v.y0 + alt / 2, (v.az + v.bz) / 2);
    o.castShadow = false;
    let quadro: THREE.Mesh | null = null;
    if (v.tipo === 'janela') {
      quadro = box(mat.caixilho, v.larg, alt, 0.07, v.ang);
      quadro.position.copy(o.position);
      quadro.castShadow = false;
    }
    return { o, quadro, base: v.y0, alt, aberto: v.tipo === 'passagem' };
  });

  /* ---------- 8. acabamento ---------- */
  const calcada = box(mat.piso, LARG + 2.4, 0.1, PROF + 2.4);
  calcada.position.set(0, -0.32, 0);
  calcada.castShadow = false;

  /* ------------------------------------------------------------------ */

  let telhaPassoAnterior = -1;

  const atualizar = (p: number) => {
    const pr = trava(p);

    // 1. locação
    const loc = suave(faixa(pr, 0.0, 0.08));
    const someLoc = suave(faixa(pr, 0.2, 0.34));
    matLinhas.opacity = loc * (1 - someLoc) * 0.95;
    (lote.material as THREE.MeshBasicMaterial).opacity = loc * (1 - someLoc * 0.45);
    gabarito.forEach((g, i) => erguer(g, -0.45, 0.9, suave(faixa(pr, i * 0.002, 0.06 + i * 0.002)) * (1 - someLoc)));

    // 2. fundação
    sapatas.forEach((s, i) => erguer(s, -0.6, 0.3, suave(faixa(pr, 0.08 + i * 0.003, 0.17 + i * 0.003))));
    baldrame.forEach((b, i) => erguer(b, -0.3, 0.35, suave(faixa(pr, 0.12 + (i % 9) * 0.004, 0.22 + (i % 9) * 0.004))));
    erguer(contrapiso, -0.16, 0.16, suave(faixa(pr, 0.17, 0.25)));

    // 3. estrutura
    pilares.forEach((c, i) => erguer(c, 0, H, suave(faixa(pr, 0.22 + i * 0.004, 0.34 + i * 0.004))));

    // 4. alvenaria — a verga só depois do peitoril
    alvenaria.forEach(({ o, b }, i) => {
      const atraso = (b.y0 / H) * 0.06 + (i % 11) * 0.004;
      erguer(o, b.y0, b.alt, suave(faixa(pr, 0.36 + atraso, 0.5 + atraso)));
    });

    // 5. laje
    vigas.forEach((v, i) => erguer(v, H, 0.2, suave(faixa(pr, 0.54 + (i % 7) * 0.004, 0.62 + (i % 7) * 0.004))));
    erguer(laje, Y_LAJE, 0.12, suave(faixa(pr, 0.6, 0.67)));

    // 6. cobertura: ripamento e, sobre ele, telha por telha do beiral à cumeeira
    const estrutura = suave(faixa(pr, 0.635, 0.685));
    mat.madeiramento.opacity = estrutura;
    mat.oitao.opacity = suave(faixa(pr, 0.65, 0.72));
    telhado.visible = estrutura > 0.01;

    // remontar a matriz de 224 telhas todo quadro é desperdício: só quando muda
    const passoTelha = Math.round(faixa(pr, 0.665, 0.775) * 240);
    if (telhado.visible && passoTelha !== telhaPassoAnterior) {
      telhaPassoAnterior = passoTelha;
      const avanco = passoTelha / 240;
      telhas.forEach((im, n) => {
        const lado = n === 0 ? 1 : -1;
        for (let i = 0; i < POR_AGUA; i++) {
          const linha = Math.floor(i / COLS);
          const col = i % COLS;
          const ordem = i / POR_AGUA;
          const k = suave(trava((avanco - ordem * 0.86) / 0.14));
          vPos.set(
            -largAgua / 2 + tw / 2 + col * tw,
            0.06 + (1 - k) * 0.5,
            lado * (compAgua / 2 - tl / 2 - linha * tl),
          );
          vEsc.set(k * tw * 0.94, k * 0.07, k * tl * 0.9);
          mAux.compose(vPos, qAux, vEsc);
          im.setMatrixAt(i, mAux);
        }
        im.instanceMatrix.needsUpdate = true;
      });
    }

    // 7. esquadrias
    const esq = suave(faixa(pr, 0.78, 0.89));
    mat.vidro.opacity = esq * 0.93;
    mat.caixilho.opacity = esq;
    mat.madeira.opacity = esq;
    esquadrias.forEach(({ o, quadro, base, alt, aberto }, i) => {
      if (aberto) { o.visible = false; if (quadro) quadro.visible = false; return; }
      const k = suave(faixa(pr, 0.78 + (i % 8) * 0.005, 0.87 + (i % 8) * 0.005));
      erguer(o, base + 0.055, alt - 0.11, k);
      if (quadro) erguer(quadro, base, alt, k);
    });

    // 8. acabamento — bloco cerâmico recebe reboco e pintura
    const acab = suave(faixa(pr, 0.87, 1));
    mat.parede.color.setHSL(0.042 + acab * 0.05, 0.44 - acab * 0.25, 0.44 + acab * 0.19);
    mat.parede.roughness = 0.95 - acab * 0.32;
    mat.parede.bumpScale = 0.4 - acab * 0.26;
    mat.oitao.color.copy(mat.parede.color);
    // o reboco cobre pilar e viga junto com a alvenaria: sem listra branca na fachada
    mat.pilar.color.copy(CONCRETO).lerp(mat.parede.color, acab);
    mat.viga.color.copy(mat.pilar.color);
    erguer(calcada, -0.42, 0.1, suave(faixa(pr, 0.88, 0.98)));

    // giro de 360° e câmera que vai abrindo conforme a casa cresce
    const giro = -0.55 + pr * Math.PI * 2;
    grupo.rotation.y = giro;
    camera.position.y = alturaOlho + suave(pr) * (alturaOlho * 1.05);
    camera.position.z = distancia(giro);
    camera.lookAt(desloc, mira + suave(pr) * 0.6, 0);
  };

  /* recuo necessário para o giro atual caber no quadro, com a folga do formato */
  let folga = 1.74;
  let alturaOlho = 4.2;
  let mira = 1.2;      // ponto que fica no centro da tela: mais baixo, casa mais alta no quadro
  let desloc = 0;   // no desktop o card cobre a esquerda: joga a casa para a direita
  const distancia = (giro: number) => {
    const c = Math.abs(Math.cos(giro));
    const s = Math.abs(Math.sin(giro));
    const meiaL = MEIA_X * c + MEIA_Z * s;   // meia-largura da pegada girada
    const meiaP = MEIA_Z * c + MEIA_X * s;   // meia-profundidade: o quanto a quina vem para a frente
    // amortece o vaivém do recuo: mistura o giro atual com o pior caso
    const enq = MEIA_MAX + (meiaL - MEIA_MAX) * AJUSTE;
    /*
      O `+ meiaP` é a perspectiva. A conta de enquadramento vale para um plano
      na distância medida, mas a quina da frente está meiaP mais perto da
      câmera e projeta maior — sem isso o beiral estoura a borda da tela.
    */
    const porLargura = (enq * folga) / (TG * camera.aspect) + meiaP;
    const porAltura = (ALTURA * folga) / (2 * TG) + meiaP;
    return Math.max(porLargura, porAltura, 14);
  };

  const redimensionar = () => {
    // mede a própria caixa: no celular o canvas ocupa só a faixa de cima do sticky
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    /*
      Retrato é o quadro da casa: enquadra apertado, porque ela é o assunto.
      Paisagem sobra céu — o card do HUD mora ali na esquerda e a prancha
      precisa do ar em volta para continuar parecendo prancha.
    */
    folga = camera.aspect < 0.95 ? 0.99 : camera.aspect < 1.3 ? 1.12 : 1.3;
    alturaOlho = camera.aspect < 0.95 ? 3.4 : 4.2;
    // retrato: mira mais baixa sobe a casa no quadro e tira o vazio entre ela e a folha
    mira = camera.aspect < 0.95 ? 0.35 : 1.2;
    desloc = camera.aspect > 1.4 ? -1.4 : 0;
    camera.position.z = distancia(grupo.rotation.y);
    camera.updateProjectionMatrix();
  };

  const destruir = () => {
    grupo.traverse((o) => {
      if ((o instanceof THREE.Mesh || o instanceof THREE.InstancedMesh) && o.geometry !== CAIXA) o.geometry.dispose();
    });
    geoLinhas.dispose();
    geoOitao.dispose();
    lote.geometry.dispose();
    Object.values(mat).forEach((m) => m.dispose());
    matLinhas.dispose();
    grao.dispose();
    malha.dispose();
    terreno.geometry.dispose();
    (terreno.material as THREE.Material).dispose();
    amb.texture.dispose();
    pmrem.dispose();
    renderer.dispose();
  };

  redimensionar();
  camera.position.set(0, alturaOlho, distancia(-0.55));
  atualizar(0);

  return { atualizar, render: () => renderer.render(cena, camera), redimensionar, destruir };
}
