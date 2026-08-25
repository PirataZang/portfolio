/* node src/scripts/forno-pedido.test.ts */
import assert from 'node:assert/strict';
import { resumir, brl, TAXA_ENTREGA, MINIMO_ENTREGA } from './forno-pedido.ts';

const carta = [
  { slug: 'ragu', nome: 'Tagliatelle al Ragù', preco: 78 },
  { slug: 'tira', nome: 'Tiramisù', preco: 34 },
];

/* retirada não tem taxa nem mínimo */
let r = resumir({ ragu: 2 }, carta, 'retirada');
assert.equal(r.itens, 2);
assert.equal(r.subtotal, 156);
assert.equal(r.taxa, 0);
assert.equal(r.total, 156);
assert.ok(r.podeEnviar);

/* entrega acima do mínimo cobra a taxa */
r = resumir({ ragu: 1, tira: 1 }, carta, 'entrega');
assert.equal(r.subtotal, 112);
assert.equal(r.taxa, TAXA_ENTREGA);
assert.equal(r.total, 112 + TAXA_ENTREGA);
assert.equal(r.faltaMinimo, 0);
assert.ok(r.podeEnviar);

/* entrega abaixo do mínimo trava o envio e diz quanto falta */
r = resumir({ tira: 1 }, carta, 'entrega');
assert.equal(r.faltaMinimo, MINIMO_ENTREGA - 34);
assert.equal(!r.podeEnviar, true);

/* sacola vazia não cobra frete de nada */
r = resumir({}, carta, 'entrega');
assert.deepEqual([r.subtotal, r.taxa, r.total, r.itens], [0, 0, 0, 0]);
assert.equal(r.podeEnviar, false);

/* prato que saiu da carta é ignorado, não vira preço zero */
r = resumir({ fantasma: 3, ragu: 1 }, carta, 'retirada');
assert.equal(r.linhas.length, 1);
assert.equal(r.total, 78);

/* quantidade suja do localStorage não passa */
r = resumir({ ragu: -5, tira: 1.7 }, carta, 'retirada');
assert.equal(r.total, 34);

assert.equal(brl(199).replace(/ /g, ' '), 'R$ 199,00');

console.log('ok — sacola do Forno Antico');
