const mongoose = require('mongoose');
const Usuario = require('../model/usuarioModel');
const Premio = require('../model/premioModel');
const ReciclagemController = require('./reciclagemController');
const PremioController = require('./premioController');


const criar = async (nome, senha, pontos, latitude, longitude) => {
    const usuario = new Usuario({nome: nome, 
                                senha:senha,
                                pontos:pontos,
                                latitude:latitude,
                                longitude:longitude});

    return await usuario.save();
}

const visualizar = async (usuarioID) => {   
    try{
        const usuario = await Usuario.findById(usuarioID).exec();

        return usuario;
    }catch (error){
        console.log(error);
        console.log("Usuario não encontrado!!");
    }
}

const atualizar = async (usuarioID,nome, senha, pontos, latitude, longitude) => {    
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const usuario = await Usuario.findById(usuarioID).exec();
        if (usuario){
            await Usuario.updateOne({_id: usuarioID}, {$set: {nome: nome, senha: senha, pontos: pontos, latitude: latitude, longitude: longitude}});
            await session.commitTransaction();
 
            return usuario.nome + " atualizado!";
        }
    }catch (error){
        console.log(error);
        session.abortTransaction();
        console.log('Usuario não encontrado!!');
    }finally{
        if(session){
            session.endSession();
        }
    }
}

const atualizarPontos = async (usuario, pontos) => {    
    try{
        session = await mongoose.startSession();
        session.startTransaction();

        usuario.pontos = usuario.pontos + pontos;        
        
        await session.commitTransaction();
        console.log (usuario.nome +", Pontos atuais: " + usuario.pontos);
        
    }catch (error){
        console.log(error);
        session.abortTransaction();
    }finally{
        if(session){
            session.endSession();
        }
    }
}

const deletar = async (usuarioID) => 
{   
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const usuario = await Usuario.findById(usuarioID).exec();
        if (usuario){

            let nome = usuario.nome;
            if (usuario.reciclagem.length > 0){
                usuario.reciclagem.forEach(reciclagem => {
                    ReciclagemController.reciclagem.deletar(reciclagem._id);                   
                }); 
            }
            
            await Premio.deleteOne({usuario: usuarioID});  
            await Usuario.deleteOne({_id: usuarioID});
            await session.commitTransaction();
        
        return nome + " deletado!";
        }
    }catch (error){
        console.log(error);
        console.log('Usuario não encontrado!!')
    }finally{
        if(session){
            session.endSession();
        }
    }
}

module.exports.usuario = {criar, deletar, visualizar, atualizar,atualizarPontos};