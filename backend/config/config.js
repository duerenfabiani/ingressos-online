require('dotenv').config();

module.exports = {
  mercadopagoAccessToken: process.env.MP_ACCESS_TOKEN,
  backUrls: {
    success: process.env.BACK_URL_SUCCESS || 'http://localhost:3000/sucesso',
    failure: process.env.BACK_URL_FAILURE || 'http://localhost:3000/erro',
    pending: process.env.BACK_URL_PENDING || 'http://localhost:3000/pendente',
  }
};
