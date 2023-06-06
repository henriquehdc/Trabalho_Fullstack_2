const express = require('express');
const bodyParser = require('body-parser');
const premioController = require('../controller/premioController');

const router = express.Router();
router.use(bodyParser.json());

router.get('/premio', async(req, res) => {
    const premios = await premioController.visualizarTodos();
    if(premios){
        res.json({resultado: 'Premio encontrado!!!', premios: premios});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Não existem premio cadastrados!' });
    }
});

router.get('/premio/:id', async(req, res) => {
    const premio = await premioController.visualizar(req.params.id);
    if(premio){
        res.json({resultado: 'Premio encontrado!!!', premio: premio});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Premio não encontrado!' });
    }
});

router.get('/premio/disponivel/:pontos', async(req, res) => {
    const premios = await premioController.visualizarPontos(req.params.pontos);
    if(premios){
        res.json({resultado: 'Premio encontrado!!!', premios: premios});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Não existem premios com essa quantidade de pontos!' });
    }
});

router.post('/premio', async(req, res) =>{
    const novo = await premioController.criar(req.body.descricao, req.body.quantidade,req.body.pontos);
    res.json({resultado: 'Premio Cadastrado!!!', premio: novo});
});

router.put('/premio/:id', async(req, res) =>{
    const att = await premioController.atualizar(req.params.id, req.body.descricao, req.body.pontos, req.body.quantidade);
    res.json({resultado: 'Premio atualizado!!!', premio: att});
});

router.delete('/premio/:id', async(req, res) => {
    const premio = await premioController.deletar(req.params.id);
    if(premio){
        res.json({resultado: 'Premio deletado!!!', premio: premio});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Premio não deletado!' });
    }
});

module.exports = router;

