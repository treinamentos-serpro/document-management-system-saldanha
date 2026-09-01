const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Usa um diretório de armazenamento temporário e isolado para os testes,
// definido antes de carregar o app (a config de storage lê a env no import).
const tempStorageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dms-storage-'));
process.env.STORAGE_DIR = tempStorageDir;

const app = require('../src/app');

/**
 * Faz uma requisição HTTP contra o app Express usando o servidor em memória.
 */
function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test('POST /upload envia um documento e retorna seus metadados', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const form = new FormData();
    form.append('file', new Blob(['conteúdo de teste']), 'teste.txt');

    const response = await fetch(`http://localhost:${port}/upload`, {
      method: 'POST',
      body: form,
    });

    assert.strictEqual(response.status, 201);
    const body = await response.json();
    assert.ok(body.id, 'deve retornar um id');
    assert.strictEqual(body.originalName, 'teste.txt');
    assert.ok(body.uploadedAt);
  } finally {
    server.close();
  }
});

test('GET /documents lista os documentos enviados', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const form = new FormData();
    form.append('file', new Blob(['outro conteúdo']), 'outro.txt');
    await fetch(`http://localhost:${port}/upload`, { method: 'POST', body: form });

    const response = await fetch(`http://localhost:${port}/documents`);
    assert.strictEqual(response.status, 200);
    const documents = await response.json();
    assert.ok(Array.isArray(documents));
    assert.ok(documents.length > 0);
  } finally {
    server.close();
  }
});

test('GET /documents/:id/download baixa o conteúdo do documento enviado', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const form = new FormData();
    form.append('file', new Blob(['conteúdo para download']), 'download.txt');
    const uploadResponse = await fetch(`http://localhost:${port}/upload`, {
      method: 'POST',
      body: form,
    });
    const { id } = await uploadResponse.json();

    const response = await fetch(`http://localhost:${port}/documents/${id}/download`);
    assert.strictEqual(response.status, 200);
    const text = await response.text();
    assert.strictEqual(text, 'conteúdo para download');
  } finally {
    server.close();
  }
});

test('GET /documents/:id/download retorna 404 para documento inexistente', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const response = await fetch(`http://localhost:${port}/documents/id-inexistente/download`);
    assert.strictEqual(response.status, 404);
  } finally {
    server.close();
  }
});
