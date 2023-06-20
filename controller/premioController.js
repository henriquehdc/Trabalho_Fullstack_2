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
                                            pontos:pontos,
                                            usuario: null});

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

    }
}

const atribuirPremio = async (premioID, usuarioID) => {   
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const premio = await Premio.findById(premioID).exec();
        const usuario = await Usuario.findById(usuarioID).exec();


        if(premio.usuario === null){
            await Premio.updateOne({_id: premioID}, {$set: {usuario: usuario, quantidade: premio.quantidade - 1}});
            await Usuario.updateOne({_id: usuarioID}, {$set: {pontos: usuario.pontos + premio.pontos}});
            await session.commitTransaction();
            return 200;
        }else{   
            premio.usuario.forEach ( async result => {
                if(result === usuario._id){
                    await Premio.updateOne({_id: premioID}, {$set: {usuario: usuario, quantidade: premio.quantidade - 1}});
                    await Usuario.updateOne({_id: usuarioID}, {$set: {pontos: usuario.pontos + premio.pontos}});
                    await session.commitTransaction();
                    return 200;
                }           
            });
        }      
        return 400;
    }catch (error){
        console.log(error);
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
            if(premio[i].pontos == pontos){
                premioPontos.push(premio[i]);
            }
        }

        return premioPontos;
    }catch (error){
        console.log(error);
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

            return 200;
        }else{
            return 400
        }
    }catch (error){
        session.abortTransaction();
        
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
            await Premio.deleteOne({_id: premioID});
            await session.commitTransaction();
            return "Premio deletado!";
        }
    }catch (error){
        console.log(error);
    }finally{
        if(session){
            session.endSession();
        }
    }
}

module.exports = {criar, deletar, visualizar, visualizarTodos, visualizarPontos, atualizar,atribuirPremio};