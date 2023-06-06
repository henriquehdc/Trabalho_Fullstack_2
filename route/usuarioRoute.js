const express = require("express")
const bodyParser = require("body-parser")
const { body, validationResult} = require("express-validator")
const usuarioController = require ("../controller/usuarioController");

const router = express.Router();
router.use(bodyParser.json());

router.get('/usuario/:id', async(req, res) => {
    const usuario = await usuarioController.visualizar(req.params.id);
    if(usuario){
        res.json({resultado: 'Usuário encontrado!!!', usuario: usuario});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Usuário não encontrado!' });
    }
});

router.put('/usuario/:id', body('senha').isLength({min: 6}).withMessage("A senha deve ter pelo menos 6 digitos"), async(req, res) =>{
    const validacao = validationResult(req).array();
    if (validacao.length === 0) {
        const att = await usuarioController.atualizar(req.params.id, req.body.username, req.body.senha, req.body.pontos, req.body.latitude, req.body.longitude);
        res.json({resultado: 'Usuario atualizado!!!', usuario: att});
    } else{
        res.status(401).json(validacao);
    }
});

router.post('/usuario', body('senha').isLength({min: 6}).withMessage("A senha deve ter pelo menos 6 digitos"), async(req, res) =>{
    const validacao = validationResult(req).array();
        if (validacao.length === 0) {
            const novo = await usuarioController.criar(req.body.username, req.body.senha, req.body.pontos, req.body.latitude, req.body.longitude);
            res.json({resultado: 'Usuario Cadastrado!!!', usuario: novo});
        } else{
            res.status(401).json(validacao);
        }
});

router.post('/usuario/login', async(req, res) => {
    const login = await usuarioController.login(req.body.username, req.body.senha);
    if (login.valido) {
        res.json(login);
    } else res.status(401).json(login);
});

router.delete('/usuario/:id', async(req, res) => {
    const usuario = await usuarioController.deletar(req.params.id);
    if(usuario){
        res.json({resultado: 'Usuário deletado!!!', usuario: usuario});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Usuário não deletado!' });
    }
});

// router.put('/usuario/novasenha/:username', (req, res) => {
//     const username = req.params.username;
//     const novaSenha = req.body.senha;
//     console.log(username);
//     if(usuarioController.alterarSenha(username, novaSenha)){
//         res.json({resultado: 'Senha alterada com sucesso'});
//     } else res.status(400).json({resultado: 'Problemas para alterar a senha!'});
// })

module.exports = router;

