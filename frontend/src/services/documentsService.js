// Serviço de comunicação com a API de documentos do backend.
// Todas as chamadas usam o prefixo /api, que o Vite proxyeia para o backend.

const API_BASE = '/api';

/**
 * Envia um arquivo para o backend.
 * @param {File} file - Arquivo selecionado pelo usuário.
 * @param {string} owner - Identificador do usuário dono do documento.
 * @returns {Promise<object>} Metadados do documento criado.
 */
export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  if (owner) {
    formData.append('owner', owner);
  }

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar o documento.');
  }

  return response.json();
}

/**
 * Busca a lista de documentos cadastrados.
 * @returns {Promise<object[]>} Lista de metadados de documentos.
 */
export async function fetchDocuments() {
  const response = await fetch(`${API_BASE}/documents`);

  if (!response.ok) {
    throw new Error('Falha ao listar os documentos.');
  }

  return response.json();
}

/**
 * Monta a URL de download de um documento pelo identificador.
 * @param {string} id - Identificador do documento.
 * @returns {string} URL de download.
 */
export function getDownloadUrl(id) {
  return `${API_BASE}/documents/${id}/download`;
}
