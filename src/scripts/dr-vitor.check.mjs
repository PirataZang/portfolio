/*
  Checagem da calculadora de orçamento e do agendamento da demo Dr. Vitor.
  Precisa do container de pé (localhost:4322) e do Chromium do Playwright no host.
  Rodar: node src/scripts/dr-vitor.check.mjs  →  PASS ou FAIL
*/
import { spawn } from 'node:child_process';
const p = spawn(`${process.env.HOME}/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`, ['--headless=new','--remote-debugging-port=9915','--no-sandbox','about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws; for (let i = 0; i < 40; i++) { try { const l = await (await fetch('http://127.0.0.1:9915/json')).json(); const pg = l.find(t => t.type === 'page'); if (pg) { ws = new WebSocket(pg.webSocketDebuggerUrl); break; } } catch {} await sleep(250); }
await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map(); const erros = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } else if (d.method === 'Runtime.exceptionThrown') erros.push(d.params.exceptionDetails.exception?.description); };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Runtime.enable'); await send('Page.enable');
await send('Page.navigate', { url: 'http://localhost:4322/sites/dr-vitor/' }); await sleep(3500);
const r = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async () => {
  const o = {}; let aberto = null; window.open = (u) => { aberto = u; };
  const calc = document.getElementById('calc');
  const min = () => document.getElementById('calc-min').textContent, max = () => document.getElementById('calc-max').textContent;
  o.lentes8 = [min(), max()];
  calc.querySelector('[data-proc="lentes"] [data-passo="1"]').click(); o.lentes9 = [min(), max()];
  const q = calc.querySelector('#q-lentes'); q.value = '99'; q.dispatchEvent(new Event('blur')); o.lentesLimite = q.value;
  const imp = calc.querySelector('input[value="implante"]'); imp.checked = true; imp.dispatchEvent(new Event('change', { bubbles: true }));
  o.implante1 = [min(), max()]; o.detalheVisivel = !calc.querySelector('[data-proc="implante"]').hidden && calc.querySelector('[data-proc="lentes"]').hidden;
  const cl = calc.querySelector('input[value="clareamento"]'); cl.checked = true; cl.dispatchEvent(new Event('change', { bubbles: true }));
  const comb = calc.querySelector('input[value="combinado"]'); comb.checked = true; comb.dispatchEvent(new Event('change', { bubbles: true }));
  o.clareamento = [min(), max()];
  calc.requestSubmit(); o.msgCalc = decodeURIComponent((aberto || '').split('text=')[1] || '');
  document.querySelectorAll('.linha')[3].click(); o.abertos = document.querySelectorAll('.item.aberto').length; o.fotoAtiva = [...document.querySelectorAll('.vitrine-foto')].findIndex(f => f.classList.contains('ativa')); o.nomeDet = document.getElementById('vit-nome').textContent; document.querySelector('.item.aberto [data-abrir-agenda]').click();
  const f = document.getElementById('form-agenda');
  o.trat = f.trat.value;
  f.nome.value = 'Paulo'; f.nome.dispatchEvent(new Event('input', { bubbles: true }));
  f.requestSubmit(); o.erroDia = document.getElementById('e-dia').textContent;
  f.dia.value = f.dia.options[1].value; f.dia.dispatchEvent(new Event('input', { bubbles: true }));
  f.requestSubmit(); o.msg = decodeURIComponent((aberto || '').split('text=')[1] || ''); o.fechou = !document.getElementById('agenda').open;
  o.previa = document.getElementById('previa').textContent;
  return o; })()` });
const v = r.result.value; console.log(JSON.stringify(v, null, 1), erros.length ? erros : 'sem erros');
const ok = v.lentes8[0] === 'R$ 14.400' && v.lentes8[1] === 'R$ 20.000' && v.lentes9[0] === 'R$ 16.200' && v.lentesLimite === '20'
  && v.implante1[0] === 'R$ 3.200' && v.detalheVisivel && v.clareamento[0] === 'R$ 1.300' && v.clareamento[1] === 'R$ 1.600'
  && v.msgCalc.includes('Clareamento (Combinado: consultório e caseiro)') && v.abertos === 1 && v.fotoAtiva === 3 && v.nomeDet === 'Lentes de contato dental' && v.trat === 'Lentes de contato dental' && v.erroDia
  && v.msg.startsWith('Olá, Dr. Vitor! Meu nome é Paulo e gostaria de agendar: Lentes de contato dental.') && v.fechou && v.msg === v.previa && !erros.length;
console.log(ok ? 'PASS' : 'FAIL'); ws.close(); p.kill(); process.exit(ok ? 0 : 1);
