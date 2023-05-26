const mongoose = require('mongoose');
const Reciclagem = require('../model/reciclagemModel');
const Usuario = require('../model/usuarioModel');
const UsuarioController = require('../controller/usuarioController');

const criar = async (item, imagem, peso, pontos, usuarioID) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        const usuario = await Usuario.findById(usuarioID).exec();
        if(usuario){      
             let reciclagem = new Reciclagem({item: item, 
                                        imagem:imagem,
                                        peso:peso,
                                        data: new Date(),
                                        pontos:pontos,
                                        usuario:usuario});

            reciclagem = await reciclagem.save({session: session});
            usuario.reciclagem.push(reciclagem);

            UsuarioController.usuario.atualizarPontos(usuario, reciclagem.pontos);

            await usuario.save({session: session});
            await session.commitTransaction();

            return reciclagem;
        }
        
    } catch (error) {
        console.log(error);
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

const visualizar = async (reciclagemID) => {   
    try{
        const reciclagem = await Reciclagem.findById(reciclagemID).exec();

        return reciclagem;
    }catch (error){
        console.log(error);
        console.log("Reciclagem não encontrada!!");
    }
}

const atualizar = async (reciclagemID,item, imagem, peso, pontos) => {    
    let session;
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const reciclagem = await Reciclagem.findById(reciclagemID).exec();
        if (reciclagem){
            const reciclagem = await Reciclagem.updateOne({_id: reciclagemID}, {$set: {item: item, imagem: imagem, peso: peso, pontos: pontos, data: new Date()}});
            await session.commitTransaction();
            return "reciclagem atualizada!";
        }
    }catch (error){
        console.log(error);
        session.abortTransaction();
        console.log('Reciclagem não encontrada!!');
    }finally{
        if(session){
            session.endSession();
        }
    }
}

const deletar = async (reciclagemID) => 
{   
    let session;
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const reciclagem = await Reciclagem.findById(reciclagemID).exec();
        if (reciclagem){

            const usuarioDelete = await Usuario.findById(reciclagem.usuario).exec();
            await usuarioDelete.reciclagem.pull(reciclagem);
            await Reciclagem.deleteOne({_id: reciclagemID});
            await usuarioDelete.save({session: session});    
            await session.commitTransaction();
        
            return "reciclagem deletada!";
        }
    }catch (error){
        console.log(error);
        session.abortTransaction();
        console.log('Reciclagem não encontrada!!')
    }finally{
        if(session){
            session.endSession();
        }
    }
}

module.exports.reciclagem = {criar, deletar, visualizar, atualizar};