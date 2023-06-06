const mongoose = require('mongoose');
const Premio = require('../model/premioModel');
const Usuario = require('../model/usuarioModel');

const criar = async (descricao, quantidade, pontos) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();   
        let premio = new Premio({descricao: descricao, 
                                            quantidade:quantidade,
                                            pontos:pontos});

         premio = await premio.save({session: session});
        await session.commitTransaction();

        return  premio;     
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

const visualizarTodos = async () => {   
    try{
        const premio = await Premio.find().exec();

        return premio;
    }catch (error){
        console.log(error);
        console.log("Premio não encontrado!!");
    }
}

const visualizarPontos = async (pontos) => {   
    try{
        const premio = await Premio.find().exec();
        var premioPontos = [];
        for (var i = 0; i < premio.length; i++){
            console.log(premio[i].pontos , pontos)
            if(premio[i].pontos == pontos){
                premioPontos.push(premio[i]);
            }
        }

        return premioPontos;
    }catch (error){
        console.log(error);
        console.log("Premio não encontrado!!");
    }
}

const atualizar = async (premioID,descricao,quantidade, pontos) => {    
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const premio = await Premio.findById(premioID).exec();
        if (premio){
            const premio = await Premio.updateOne({_id: premioID}, {$set: {descricao: descricao, quantidade: quantidade, pontos: pontos}});
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

module.exports = {criar, deletar, visualizar, visualizarTodos, visualizarPontos, atualizar};