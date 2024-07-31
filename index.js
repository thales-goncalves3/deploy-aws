const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json()); 

async function getCepData(cep) {
  try {
    const response = await axios.post(`https://viacep.com.br/ws/${cep}/json/`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar o CEP: ' + error.message);
  }
}

app.get('/', (request, response) => {
  return response.json({ message: 'tsdasdi' });
});

app.post('/cepdosguri/', async (request, response) => {
  const { cep } = request.body;

  if (!cep) {
    return response.status(400).json({ error: 'CEP não fornecido' });
  }

  try {
    const data = await getCepData(cep);
    return response.json(data);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
});
