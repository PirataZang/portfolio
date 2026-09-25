/*
  Checagem do modal de agendamento da demo Spa Floral.
  Precisa do container de pé (localhost:4322) e do Chromium do Playwright no host.
  Rodar: node src/scripts/spa-agenda.check.mjs  →  PASS ou FAIL
*/
import { spawn } from 'node:child_process';
const chrome = `${process.env.HOME}/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`;
const p = spawn(chrome, ['--headless=new', '--remote-debugging-port=9911', '--no-sandbox', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws; for (let i = 0; i < 40; i++) { try { const l = await (await fetch('http://127.0.0.1:9911/json')).json(); const pg = l.find(t => t.type === 'page'); if (pg) { ws = new WebSocket(pg.webSocketDebuggerUrl); break; } } catch {} await sleep(250); }
await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value;
await send('Page.enable'); await send('Page.navigate', { url: 'http://localhost:4322/sites/spa-floral/' }); await sleep(3000);
const r = await ev(`(async () => {
  const o = {}; let aberto = null; window.open = (u) => { aberto = u; };
  document.querySelector('.plano-destaque [data-abrir-agenda]').click();
  const m = document.getElementById('agenda'); o.abriu = m.open;
  const f = document.getElementById('form-agenda');
  o.obs = f.obs.value; o.nDias = f.dia.options.length - 1;
  o.fechados = [...f.dia.options].filter(x => x.value && new Date(x.value + 'T12:00').getDay() === 0).length;
  f.requestSubmit(); o.erros = [...f.querySelectorAll('.erro')].map(e => e.textContent).filter(Boolean).length;
  f.nome.value = 'Carla'; f.nome.dispatchEvent(new Event('input', { bubbles: true }));
  f.dia.value = f.dia.options[2].value; f.dia.dispatchEvent(new Event('input', { bubbles: true }));
  f.requestSubmit(); o.url = aberto; o.msg = decodeURIComponent((aberto || '').split('text=')[1] || ''); o.fechou = !m.open;
  o.previa = document.getElementById('previa').textContent;
  return o; })()`);
console.log(JSON.stringify(r, null, 1));
const ok = r.abriu && r.obs === 'Quero assinar o plano Equilíbrio.' && r.nDias === 12 && r.fechados === 0 && r.erros === 2 && r.fechou
  && r.msg.startsWith('Olá! Meu nome é Carla e gostaria de agendar uma visita ao Spa Floral para ') && r.msg.endsWith('\n\nObservação:\nQuero assinar o plano Equilíbrio.') && r.previa === r.msg;
console.log(ok ? 'PASS' : 'FAIL'); ws.close(); p.kill(); process.exit(ok ? 0 : 1);
