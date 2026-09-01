// Repositório de metadados de documentos.
//
// Nesta fase inicial os metadados são mantidos em memória (RNF-02). O
// conteúdo binário dos arquivos é gravado no filesystem local pelo multer
// (diskStorage), configurado na camada de rotas.

const documents = new Map();

/**
 * Salva os metadados de um documento recém-enviado.
 * @param {object} document - Metadados do documento (id, originalName, size, uploadedAt, owner, storedName).
 * @returns {object} O documento salvo.
 */
function save(document) {
  documents.set(document.id, document);
  return document;
}

/**
 * Retorna todos os documentos cadastrados, ordenados do mais recente para o mais antigo.
 * @returns {object[]} Lista de metadados de documentos.
 */
function findAll() {
  return Array.from(documents.values()).sort(
    (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
  );
}

/**
 * Busca um documento pelo identificador.
 * @param {string} id - Identificador do documento.
 * @returns {object|undefined} O documento encontrado ou undefined.
 */
function findById(id) {
  return documents.get(id);
}

module.exports = { save, findAll, findById };
