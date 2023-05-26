const express = require("express")
const bodyParser = require("body-parser")
const { body, validationResult} = require("express-validator")
const usuarioController = require('../controller/usuario-controller');

const router = express.Router();

//habilita o tratamento de requisições no formato JSON
router.use(bodyParser.json());

//Cria um usuario
router.post('/usuario', body('senha').isLength({min: 6}).withMessage("A senha deve ter pelo menos 6 digitos"), async(req, res) =>{
    const validacao = validationResult(req).array();
        if (validacao.length === 0) {
            const novo = await usuarioController.criarUsuario(req.body.username, req.body.senha, req.body.pontos, req.body.latitude, req.body.longitude);
            res.json({resultado: 'Usuario Cadastrado!!!', usuario: novo});
        } else{
            res.status(401).json(validacao);
        }
});

//Retorna um usuário
router.get('/usuario/:id', async(req, res) => {
    const usuario = await usuarioController.obterUsuario(req.params.id);
    if(usuario){
        res.json({resultado: 'Usuário encontrado!!!', usuario: usuario});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Usuário não encontrado!' });
    }
});

//Atualiza um usuário
router.put('/usuario/:id', body('senha').isLength({min: 6}).withMessage("A senha deve ter pelo menos 6 digitos"), async(req, res) =>{
    const validacao = validationResult(req).array();
    if (validacao.length === 0) {
        const att = await usuarioController.atualizarUsuario(req.params.id, req.body.username, req.body.senha, req.body.pontos, req.body.latitude, req.body.longitude);
        res.json({resultado: 'Usuario atualizado!!!', usuario: att});
    } else{
        res.status(401).json(validacao);
    }
});

//Remove um usuário
router.delete('/usuario/:id', async(req, res) => {
    const usuario = await usuarioController.deletarUsuario(req.params.id);
    if(usuario){
        res.json({resultado: 'Usuário deletado!!!', usuario: usuario});
    } else{
        res.status(404).json({ resultado: 'ERRO!! Usuário não deletado!' });
    }
});

//Efetua o login do usuário
// router.post('/usuario/login/', (req, res) => {
//     if(usuarioController.login(req.body.username, req.body.senha)) {
//         res.json({resultado: 'Login OK!'});
//     } else res.status(401).json({resultado: 'Usuário / Senha inválidos!'});
// });


// router.put('/usuario/novasenha/:username', (req, res) => {
//     const username = req.params.username;
//     const novaSenha = req.body.senha;
//     console.log(username);
//     if(usuarioController.alterarSenha(username, novaSenha)){
//         res.json({resultado: 'Senha alterada com sucesso'});
//     } else res.status(400).json({resultado: 'Problemas para alterar a senha!'});
// })

module.exports = router;

