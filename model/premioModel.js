const mongoose = require('mongoose');

const premioSchema = mongoose.Schema({
        descricao: {type:String, required: true},
        pontos: {type:Number, required: true},
        quantidade: {type: Number, required: true},
        usuario: {type: mongoose.Types.ObjectId, required: true, ref: "Usuario"}
});

const Premio = mongoose.model('Premio', premioSchema);

module.exports = Premio;