const mongoose = require('mongoose');
const Premio = require('../model/premioModel');
const Usuario = require('../model/usuarioModel');

const criar = async (descricao, quantidade,usuarioID) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        const usuario = await Usuario.findById(usuarioID).exec();
        if(usuario){      
            let premio = new Premio({descricao: descricao, 
                                        quantidade:quantidade,
                                        pontos:usuario.pontos , 
                                        usuario: usuario});

            premio = await premio.save({session: session});
            await session.commitTransaction();

            return usuario.nome + premio;
        }
        
    } catch (error) {
        console.log(error);
        session.abortTransaction();
    } finally {
        if (session) {
            session.endSession();
        }
    }
}

const visualizar = async (premioID) => {   
    try{
        const premio = await Premio.findById(premioID).exec();

        return premio;
    }catch (error){
        console.log(error);
        console.log("Premio não encontrado!!");
    }
}

const atualizar = async (premioID,descricao,quantidade,usuarioID) => {    
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const premio = await Premio.findById(premioID).exec();
        const usuario = await Usuario.findById(usuarioID).exec();
        if (premio && usuario){
            const premio = await Premio.updateOne({_id: premioID}, {$set: {descricao: descricao, quantidade: quantidade, pontos: usuario.pontos, usuario: usuario}});
            await session.commitTransaction();

            return "Premio atualizado!";
        }
    }catch (error){
        console.log(error);
        session.abortTransaction();
        console.log('Premio não encontrado!!');
    }finally{
        if(session){
            session.endSession();
        }
    }
}

const deletar = async (premioID) => 
{   
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const premio = await Premio.findById(premioID).exec();
        if (premio){
            const premio = await Premio.deleteOne({_id: premioID});
            await session.commitTransaction();
            
            return "Premio deletado!";
        }
    }catch (error){
        console.log(error);
        console.log('Premio não encontrado!!')
    }finally{
        if(session){
            session.endSession();
        }
    }
}

module.exports.premio = {criar, deletar, visualizar, atualizar};