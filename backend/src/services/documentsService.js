// Regras de negócio relacionadas a documentos.

const crypto = require('node:crypto');
const path = require('node:path');
const documentsRepository = require('../repositories/documentsRepository');

/**
 * Registra os metadados de um documento recém-enviado.
 * @param {object} file - Objeto de arquivo gerado pelo multer.
 * @param {string} owner - Identificador do usuário dono do documento.
 * @returns {object} Metadados do documento criado.
 */
function registerUploadedDocument(file, owner) {
  const document = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: owner || 'anonimo',
  };

  return documentsRepository.save(document);
}

/**
 * Lista todos os documentos cadastrados.
 * @returns {object[]} Lista de metadados de documentos.
 */
function listDocuments() {
  return documentsRepository.findAll();
}

/**
 * Busca um documento pelo identificador e retorna seus metadados e caminho no disco.
 * @param {string} id - Identificador do documento.
 * @param {string} storageDir - Diretório onde os arquivos são gravados.
 * @returns {{document: object, filePath: string}|null} Documento e caminho, ou null se não encontrado.
 */
function getDocumentForDownload(id, storageDir) {
  const document = documentsRepository.findById(id);
  if (!document) {
    return null;
  }

  const filePath = path.join(storageDir, document.storedName);
  return { document, filePath };
}

module.exports = { registerUploadedDocument, listDocuments, getDocumentForDownload };
