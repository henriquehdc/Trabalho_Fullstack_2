const express = require('express');
const mongoose = require('mongoose');
const premioRoute = require ('./route/premioRoute');
const usuarioRoute = require('./route/usuarioRoute');
const reciclagemRoute = require('./route/reciclagemRoute');

const url = "mongodb+srv://HenriqueDC:HenriqueDC@cluster0.jd6clep.mongodb.net/reciclagem?retryWrites=true&w=majority";

const app = express();

app.use(premioRoute);
app.use(usuarioRoute);
app.use(reciclagemRoute);

app.use((req, res) => {
    res.status(404).json({msg: "Endpoint inexistente!"})
})

mongoose.connect(url).then(() => {
    app.listen(3000, () => console.log('Servidor iniciado...'));
}).catch((err) => console.log(err));
