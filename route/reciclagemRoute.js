const express = require('express');
const bodyParser = require('body-parser');
const { usuarioController } = require ("../controller/usuarioController");
const  reciclagemController  = require ("../controller/reciclagemController");

const router = express.Router();
router.use(bodyParser.json());

router.get('/reciclagem/:id', async(req, res) => {
    const reciclagens = await reciclagemController.visualizarTodos(req.params.id);
    if(reciclagens){
        res.json({resultado: 'Reciclagem encontrada!!!', reciclagem: reciclagens});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Não existem reciclagens cadastradas!' });
    }
    
});

router.get('/reciclagem/total/:id', async(req, res) => {
    const totais = await reciclagemController.visualizarPontosPeso();
    if(totais){
        res.json({resultado: 'Reciclagens encontradas!!!', Pontos: totais[0], Peso: totais[1]});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Não existem reciclagens cadastradas!' });
    }
    
});

router.get('/reciclagem/premio/:id', async(req, res) => {
    const premio = await reciclagemController.atualizarQuantidadePremio(req.params.id);
    if(premio){
        res.json({resultado: 'Premio atualizado!!!', Premio: premio});
    } else{
        res.status(404).json({resultado: 'ERRO!! O premio não existe!'});
    }
    
});

router.post('/reciclagem/:id', async(req, res) =>{
    const novo = await reciclagemController.criar(req.params.id, req.body.item, req.body.imagem, req.body.peso, req.body.pontos);
    console.log(novo);
    res.json({resultado: 'Reciclagem Cadastrada!!!', reciclagem: novo});
});

module.exports = router;

