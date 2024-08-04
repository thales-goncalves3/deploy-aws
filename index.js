const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const SECRET_KEY = 'my_super_secret_key_for_testing';

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  
  if (username === 'usuario' && password === 'hahaha') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extrair o token do formato 'Bearer TOKEN'

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Token não fornecido' });
  }
};

app.get('/consultar/:cep', authenticateJWT, async (req, res) => {
  const { cep } = req.params;

  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao consultar o CEP', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});