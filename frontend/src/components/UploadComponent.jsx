// Componente de formulário para envio (upload) de documentos.

import { useState } from 'react';

export default function UploadComponent({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setErrorMessage('Selecione um arquivo antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await onUploaded(file, owner);
      setFile(null);
      event.target.reset();
    } catch (error) {
      setErrorMessage('Não foi possível enviar o documento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enviar documento</h2>
      <div>
        <label htmlFor="owner">Usuário</label>
        <input
          id="owner"
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Identificador do usuário"
        />
      </div>
      <div>
        <label htmlFor="file">Arquivo</label>
        <input
          id="file"
          type="file"
          onChange={(event) => setFile(event.target.files[0])}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </form>
  );
}
