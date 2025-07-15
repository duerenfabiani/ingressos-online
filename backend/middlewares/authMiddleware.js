const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

  if (!token)
    return res.status(401).json({ erro: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};
