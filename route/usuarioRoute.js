const express = require("express")
const bodyParser = require("body-parser")
const { body, validationResult} = require("express-validator")
const usuarioController = require ("../controller/usuarioController");

const router = express.Router();
router.use(bodyParser.json());

router.get('/usuario/:id', async(req, res) => {
    const usuario = await usuarioController.visualizar(req.params.id);
    console.log(usuario)
    if(usuario){
        res.json({status: 200, usuario: usuario});
    } else{
        res.status(404).json({ status: 400 });
    }
});

router.put('/usuario/:id', body('senha').isLength({min: 6}).withMessage("A senha deve ter pelo menos 6 digitos"), async(req, res) =>{
    const validacao = validationResult(req).array();
    if (validacao.length === 0) {
        const att = await usuarioController.atualizar(req.params.id, req.body.username, req.body.senha);
        res.json({resultado: 'Usuario atualizado!!!', usuario: att});
    } else{
        res.status(401).json(validacao);
    }
});

router.post('/usuario', body('senha').isLength({min: 6}).withMessage("A senha deve ter pelo menos 6 digitos"), async(req, res) =>{
    const validacao = validationResult(req).array();
        if (validacao.length === 0) {
            const novo = await usuarioController.criar(req.body.username, req.body.senha);
            res.json({status: 200, usuario: novo});
        } else{
            res.json({status: 400});
        }
});

router.post('/usuario/login', async(req, res) => {
    const usuario = await usuarioController.login(req.body.username, req.body.senha);
    if (usuario) {
        res.json({status: 200 , usuario: usuario});
    } else res.json({status: 400 , usuario: usuario});
});

router.delete('/usuario/:id', async(req, res) => {
    const usuario = await usuarioController.deletar(req.params.id);
    if(usuario){
        res.json({resultado: 'Usuário deletado!!!', usuario: usuario});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Usuário não deletado!' });
    }
});



module.exports = router;

