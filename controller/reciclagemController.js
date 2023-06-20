const mongoose = require('mongoose');
const Reciclagem = require('../model/reciclagemModel');
const Usuario = require('../model/usuarioModel');
const Premio = require('../model/premioModel');
const usuarioController = require ("../controller/usuarioController");

const criar = async (usuarioID, item, imagem, peso, pontos) => {
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

            usuarioController.atualizarPontos(usuario, reciclagem.pontos);

            await usuario.save({session: session});
            await session.commitTransaction();

            return reciclagem;
        }
        
    } catch (error) {

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

    }
}

const visualizarTodos = async (usuarioID) => {   
    try{
        const usuario = await Usuario.findById(usuarioID).exec();
        const reciclagem = await Reciclagem.find({usuario: usuario});

        return reciclagem;
    }catch (error){
        console.log(error);
       
    }
}

const visualizarPontosPeso = async () => {   
    try{
        const reciclagem = await Reciclagem.find().exec();

        var pontos = 0;
        var peso = 0;
        for(var i = 0; i < reciclagem.length; i++){
            pontos += reciclagem[i].pontos;
            peso += reciclagem[i].peso;
        }
        const totais = [pontos, peso];
        return totais;

    }catch (error){
        console.log(error);
        
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
        
    }finally{
        if(session){
            session.endSession();
        }
    }
}

const atualizarQuantidadePremio = async (premioID) => {    
    let session;
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        var premio = await Premio.findById(premioID).exec();
        if(premio){
            const quantidade = premio.quantidade - 1;
            await Premio.updateOne({_id: premioID}, {$set: {quantidade: quantidade}});
            await session.commitTransaction();
            return quantidade;
        }
    }catch (error){
        console.log(error);
        session.abortTransaction();
        
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
        
    }finally{
        if(session){
            session.endSession();
        }
    }
}

module.exports = {criar, deletar, visualizar, visualizarTodos, visualizarPontosPeso ,atualizar,atualizarQuantidadePremio};