const express = require('express');
const router = express.Router();
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* ========================= GET /api/eventos ========================= */
router.get('/', async (req, res) => {
  try {
    let sql = 'SELECT * FROM eventos WHERE 1=1';
    const params = [];

    const filtroPorProdutor = !!req.query.criado_por;

    if (filtroPorProdutor) {
      sql += ' AND criado_por = ?';
      params.push(req.query.criado_por);
    }

    if (req.query.status) {
      sql += ' AND status = ?';
      params.push(req.query.status);
    } else if (!filtroPorProdutor) {
      sql += ' AND status = 1';
    }

    if (req.query.date) {
      sql += ' AND DATE(data_inicio) = ?';
      params.push(req.query.date);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar eventos.' });
  }
});

/* ========================= GET /api/eventos/:id ========================= */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM eventos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Evento não encontrado.' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar evento por ID:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar evento.' });
  }
});

/* ========================= POST /api/eventos ========================= */
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      categoria,
      tag,
      data_inicio,
      data_fim,
      local,
      status,
      criado_por
    } = req.body;

    const banner_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = `
      INSERT INTO eventos 
      (titulo, descricao, categoria, tag, data_inicio, data_fim, local, status, criado_por, banner_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      titulo,
      descricao,
      categoria,
      tag,
      data_inicio,
      data_fim,
      local,
      status || 0,
      criado_por || null,
      banner_url
    ];

    const [result] = await db.query(sql, values);
    res.json({ id: result.insertId, mensagem: 'Evento criado com sucesso.' });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ erro: 'Erro interno ao criar evento.' });
  }
});

/* ========================= PUT /api/eventos/:id ========================= */
const uploadMultiple = upload.fields([
  { name: 'flyer', maxCount: 1 },
  { name: 'mapa', maxCount: 1 }
]);

router.put('/:id', uploadMultiple, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      categoria,
      tag,
      local,
      data_inicio,
      data_fim,
      status
    } = req.body;

    let flyerPath = null;
    let mapaPath = null;

    if (req.files.flyer) {
      flyerPath = `/uploads/${req.files.flyer[0].filename}`;
    }

    if (req.files.mapa) {
      mapaPath = `/uploads/${req.files.mapa[0].filename}`;
    }

    const campos = [];
    const valores = [];

    if (titulo) { campos.push('titulo = ?'); valores.push(titulo); }
    if (categoria) { campos.push('categoria = ?'); valores.push(categoria); }
    if (tag) { campos.push('tag = ?'); valores.push(tag); }
    if (local) { campos.push('local = ?'); valores.push(local); }
    if (data_inicio) { campos.push('data_inicio = ?'); valores.push(data_inicio); }
    if (data_fim) { campos.push('data_fim = ?'); valores.push(data_fim); }
    if (status !== undefined) { campos.push('status = ?'); valores.push(status); }
    if (flyerPath) { campos.push('flyer_url = ?'); valores.push(flyerPath); }
    if (mapaPath) { campos.push('mapa_url = ?'); valores.push(mapaPath); }

    if (campos.length === 0) {
      return res.status(400).json({ erro: 'Nenhum campo fornecido para atualização.' });
    }

    const sql = `UPDATE eventos SET ${campos.join(', ')} WHERE id = ?`;
    valores.push(id);

    await db.query(sql, valores);

    res.json({ mensagem: 'Evento atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ erro: 'Erro interno ao atualizar evento.' });
  }
});

module.exports = router;
