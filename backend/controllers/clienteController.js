// /backend/controllers/clienteController.js
const jwt = require('jsonwebtoken');

exports.loginComGoogle = async (req, res) => {
  try {
    const { nome, email, googleId } = req.body;

    if (!nome || !email || !googleId) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    // TODO: Verificar se existe no banco e salvar/retornar
    const token = jwt.sign({ email }, 'seuSegredoJWT', { expiresIn: '1h' });
    res.json({ message: 'Login com Google realizado com sucesso.', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no login com Google.' });
  }
};


exports.loginComApple = async (req, res) => {
  try {
    const { nome, email, appleId } = req.body;

    if (!nome || !email || !appleId) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    // TODO: Verificar se existe no banco e salvar/retornar
    const token = jwt.sign({ email }, 'seuSegredoJWT', { expiresIn: '1h' });
    res.json({ message: 'Login com Apple realizado com sucesso.', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no login com Apple.' });
  }
};
