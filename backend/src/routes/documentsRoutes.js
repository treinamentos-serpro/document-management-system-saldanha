// Rotas de documentos: upload, listagem e download.
//
// O multer é configurado aqui com diskStorage, gravando os arquivos
// diretamente na pasta backend/storage (armazenamento estritamente local).

const express = require('express');
const fs = require('node:fs');
const multer = require('multer');
const crypto = require('node:crypto');
const path = require('node:path');

const documentsController = require('../controllers/documentsController');
const STORAGE_DIR = require('../config/storage');

fs.mkdirSync(STORAGE_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('file'), documentsController.upload);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;
