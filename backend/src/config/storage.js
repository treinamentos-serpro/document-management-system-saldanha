// Configuração do diretório de armazenamento local (12-Factor: via variável de ambiente).

const path = require('node:path');

const STORAGE_DIR = process.env.STORAGE_DIR
  ? path.resolve(process.env.STORAGE_DIR)
  : path.join(__dirname, '..', '..', 'storage');

module.exports = STORAGE_DIR;
