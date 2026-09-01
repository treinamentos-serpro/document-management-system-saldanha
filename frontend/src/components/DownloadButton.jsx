// Componente de botão para download de um documento pelo identificador.

import { getDownloadUrl } from '../services/documentsService';

export default function DownloadButton({ documentId, fileName }) {
  return (
    <a href={getDownloadUrl(documentId)} download={fileName}>
      Baixar
    </a>
  );
}
