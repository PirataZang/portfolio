/*
  Checagem do agendamento da demo Lâmina (estética automotiva).
  Precisa do container de pé (localhost:4322) e do Chromium do Playwright no host.
  Rodar: node src/scripts/estetica-agenda.check.mjs  →  PASS ou FAIL
*/
import { spawn } from 'node:child_process';
const chrome = `${process.env.HOME}/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`;
const port = 9900;
const p = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, '--no-sandbox', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws; for (let i = 0; i < 40; i++) { try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const pg = l.find(t => t.type === 'page'); if (pg) { ws = new WebSocket(pg.webSocketDebuggerUrl); break; } } catch {} await sleep(250); }
await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value;
await send('Page.enable'); await send('Page.navigate', { url: 'http://localhost:4322/sites/estetica-automotiva/' }); await sleep(3000);
const r = await ev(`(async () => {
  const out = {}; let aberto = null; window.open = (u) => { aberto = u; };
  const f = document.getElementById('form-agenda');
  const set = (n, v) => { const el = f.elements.namedItem(n); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
  const marca = (n, i) => { const el = [...f.querySelectorAll('input[name="' + n + '"]:not(:disabled)')][i]; el.checked = true; el.dispatchEvent(new Event('change', { bubbles: true })); return el.value; };
  f.requestSubmit(); out.vazio = { aberto, erros: [...f.querySelectorAll('.campo-erro')].map(e => e.textContent) };
  const dias = [...f.querySelectorAll('input[name="dia"]')].map(i => new Date(i.value + 'T12:00').getDay());
  out.diasFechados = dias.filter(d => d === 0 || d === 1).length; out.nDias = dias.length;
  set('nome', 'Ana'); set('carro', 'Corolla 2021');
  marca('dia', dias.length - 1);
  f.requestSubmit(); out.semHora = { aberto, erro: document.getElementById('e-horario').textContent };
  out.hora = marca('hora', 2); set('msg', 'Tem um risco na porta');
  f.requestSubmit(); out.ok = decodeURIComponent((aberto||'').split('text=')[1] || ''); out.url = (aberto||'').split('?')[0];
  out.previa = document.getElementById('previa').textContent;
  return out; })()`);
console.log(JSON.stringify(r, null, 2));
const ok = r.vazio.aberto === null && r.vazio.erros.filter(Boolean).length === 3 && r.nDias === 6 && r.diasFechados === 0
  && r.semHora.aberto === null && /hora/.test(r.semHora.erro)
  && r.ok.startsWith('olá me chamo Ana Gostaria de fazer o agendamento de limpeza para o meu carro: Corolla 2021\nHorário: ') && r.ok.includes(' às ' + r.hora.replace(':', 'h'))
  && r.ok.endsWith('\n\nObservação:\nTem um risco na porta') && r.url === 'https://wa.me/5599999999999' && r.previa === r.ok;
console.log(ok ? 'PASS' : 'FAIL'); ws.close(); p.kill(); process.exit(ok ? 0 : 1);
