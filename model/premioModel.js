const mongoose = require('mongoose');

const premioSchema = mongoose.Schema({
        descricao: {type:String, required: true},
        pontos: {type:Number, required: true},
        quantidade: {type: Number, required: true}
});

const Premio = mongoose.model('Premio', premioSchema);

module.exports = Premio;