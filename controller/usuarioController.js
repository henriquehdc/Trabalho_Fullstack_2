const mongoose = require('mongoose');
const Usuario = require('../model/usuarioModel');
const Premio = require('../model/premioModel');
const ReciclagemController = require('./reciclagemController');
const jsonwebtoken = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const PremioController = require('./premioController');
const NodeGeocoder = require('node-geocoder');
const axios = require('axios');


const criar = async (nome, senha) => {

    const options = {
        provider: 'openstreetmap'
    };     

    const geocoder = NodeGeocoder(options);    

    const getCoordinates = async () => {
        let latitude = 'Não informado';
        let longitude = 'Não informado';

        const response = await axios.get('http://ip-api.com/json');
        const { lat, lon } = response.data;

        const res = await geocoder.reverse({ lat, lon });
        if (res.length > 0) {
            latitude = lat;
            longitude = lon;
        };
        return {latitude, longitude}
    }  
    const geo = await getCoordinates();

    const usuario = new Usuario({nome: nome, 
                                senha:senha,
                                pontos:0,
                                latitude: geo.latitude,
                                longitude: geo.longitude});
    
    return await usuario.save();
}

const login = async (nome, senha) => {
    const user = await Usuario.findOne({nome: nome, senha: senha});
    if (user) {
        if (senha === user.senha) {
            return {user};
        }else {
            return null;
        }
    } else {
        return null;
    }
}

const visualizar = async (usuarioID) => {   
    try{
        const usuario = await Usuario.findById(usuarioID).exec();
        
        return usuario;
    }catch (error){
        return null;
    }
}

const atualizar = async (usuarioID,nome, senha) => {    
    try{
        session = await mongoose.startSession();
        session.startTransaction();
        const usuario = await Usuario.findById(usuarioID).exec();
        
        if (usuario){
            await Usuario.updateOne({_id: usuarioID}, {$set: {nome: nome, senha: senha}});
            await session.commitTransaction();
 
            return usuario.nome + " atualizado!";
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

const atualizarPontos = async (usuario, pontos) => {    
    try{
        session = await mongoose.startSession();
        session.startTransaction();

        usuario.pontos = usuario.pontos + pontos;        
        
        await session.commitTransaction();
               
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
        
    }finally{
        if(session){
            session.endSession();
        }
    }
}

module.exports = {criar, deletar, visualizar, atualizar,atualizarPontos,login};