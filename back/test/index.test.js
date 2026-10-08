const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { app, server, excuses } = require('../src/index.js');

const makeRequest = (path) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const req = http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(data)
        });
      });
    });
    req.on('error', reject);
  });
};

test('Backend API Suite', async (t) => {
  await t.test('GET /api/health - retourne 200 et les informations de santé', async () => {
    const res = await makeRequest('/api/health');
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.status, 'ok');
    assert.ok(typeof res.body.uptime === 'number');
    assert.ok(typeof res.body.timestamp === 'string');
  });

  await t.test('GET /api/excuse - retourne 200 et une excuse valide de la liste', async () => {
    const res = await makeRequest('/api/excuse');
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.excuse);
    assert.ok(excuses.includes(res.body.excuse));
    assert.ok(typeof res.body.id === 'number');
  });

  t.after(() => {
    server.close();
  });
});
