const express = require('express');

const app = express();


app.get('/', (request, response) => {
    return response.json({message: 'ta ai a api severgnini'});
})

app.listen(3333);