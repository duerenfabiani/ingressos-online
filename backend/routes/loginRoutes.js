const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

// POST /api/login
router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM organizadores WHERE email_responsavel = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    const usuario = rows[0];

    if (!usuario.senha) {
      return res.status(401).json({ message: 'Senha não cadastrada. Use recuperação de conta.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome_responsavel,
      email: usuario.email_responsavel
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor ao tentar logar.' });
  }
});

module.exports = router;
