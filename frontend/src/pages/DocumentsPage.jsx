// Página principal: gerencia o estado dos documentos e integra os componentes
// de upload e listagem.

import { useCallback, useEffect, useState } from 'react';
import UploadComponent from '../components/UploadComponent';
import DocumentList from '../components/DocumentList';
import { uploadDocument, fetchDocuments } from '../services/documentsService';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const loadDocuments = useCallback(async () => {
    try {
      const data = await fetchDocuments();
      setDocuments(data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Não foi possível carregar a lista de documentos.');
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  async function handleUploaded(file, owner) {
    await uploadDocument(file, owner);
    await loadDocuments();
  }

  return (
    <section>
      <UploadComponent onUploaded={handleUploaded} />
      <h2>Documentos enviados</h2>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <DocumentList documents={documents} />
    </section>
  );
}
