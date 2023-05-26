const express = require('express');
const bodyParser = require('body-parser');
const reciclagemController = require('../controller/reciclagem-controller');
const usuarioController = require('../controller/usuario-controller');

const router = express.Router();

//habilita o tratamento de requisições no formato JSON
router.use(bodyParser.json());

//Cria uma Reciclagem
router.post('/reciclagem/:id', async(req, res) =>{
    const novo = await reciclagemController.criarReciclagem(req.params.id, req.body.item, req.body.imagem, req.body.peso, req.body.pontos);
    console.log(novo);
    res.json({resultado: 'Reciclagem Cadastrada!!!', reciclagem: novo});
});

router.get('/usuario/:id', async(req, res) => {
    const usuario = await usuarioController.obterUsuario(req.params.id);
    if(usuario){
        res.json({resultado: 'Usuário encontrado!!!', usuario: usuario});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Usuário não encontrado!' });
    }
});

//Lista todos os itens reciclados de um usuário
router.get('/reciclagem/:id', async(req, res) => {
    const reciclagens = await reciclagemController.obterTodasReciclagens();
    if(reciclagens){
        res.json({resultado: 'Reciclagem encontrada!!!', reciclagem: reciclagens});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Não existem reciclagens cadastradas!' });
    }
    
});

//Retorna o total de pontos e pesos de itens reciclados pelo usuário
router.get('/reciclagem/total/:id', async(req, res) => {
    const totais = await reciclagemController.totalPontosPeso();
    if(totais){
        res.json({resultado: 'Reciclagens encontradas!!!', Pontos: totais[0], Peso: totais[1]});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Não existem reciclagens cadastradas!' });
    }
    
});

//Subtrai 1 da quantidade total disponível de um prêmio
router.get('/reciclagem/premio/:id', async(req, res) => {
    const premio = await reciclagemController.attQtdPremio(req.params.id);
    if(premio){
        res.json({resultado: 'Premio atualizado!!!', Premio: premio});
    } else{
        res.status(404).json({resultado: 'ERRO!! O premio não existe!'});
    }
    
});

module.exports = router;

