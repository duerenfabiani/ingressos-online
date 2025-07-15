const axios = require('axios');

const asaasClient = axios.create({
    baseURL: 'https://www.asaas.com/api/v3',
    headers: {
        'Authorization': `Bearer ${process.env.ASAAS_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

module.exports = asaasClient;
