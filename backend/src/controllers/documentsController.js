// Tratamento de entrada/saída HTTP e validação básica para documentos.

const fs = require('node:fs');
const documentsService = require('../services/documentsService');

const STORAGE_DIR = require('../config/storage');

/**
 * Trata o envio (upload) de um documento.
 */
function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ mensagem: 'Nenhum arquivo foi enviado.' });
  }

  const owner = req.body.owner || req.headers['x-user-id'];
  const document = documentsService.registerUploadedDocument(req.file, owner);

  return res.status(201).json(document);
}

/**
 * Trata a listagem de documentos.
 */
function list(req, res) {
  const documents = documentsService.listDocuments();
  return res.json(documents);
}

/**
 * Trata o download de um documento pelo identificador.
 */
function download(req, res) {
  const { id } = req.params;
  const result = documentsService.getDocumentForDownload(id, STORAGE_DIR);

  if (!result) {
    return res.status(404).json({ mensagem: 'Documento não encontrado.' });
  }

  const { document, filePath } = result;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ mensagem: 'Arquivo do documento não encontrado no armazenamento.' });
  }

  return res.download(filePath, document.originalName);
}

module.exports = { upload, list, download };
