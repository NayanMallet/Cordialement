const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { app, server } = require('../src/server.js');
const corporatePhrases = require('../src/data/corporate.json');

const makeRequest = (path, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
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
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
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

  await t.test('POST /api/translate - retourne 200 et la traduction corporate', async () => {
    const res = await makeRequest('/api/translate', 'POST', { text: 'Je suis fatigué de ce projet' });
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.translated);
    assert.ok(corporatePhrases.includes(res.body.translated));
    assert.equal(res.body.original, 'Je suis fatigué de ce projet');
  });

  t.after(() => {
    server.close();
  });
});
