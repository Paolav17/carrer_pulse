const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const conexion = require('../db/db');
const jwt  = require ('jsonwebtoken');
const {promisify} = require ('util');
const { error } = require('console');
const { resume } = require('../db/db');
const config = require('./config'); 
const routes = require ('../routes')
const { getUserData } = require('../servidor');

 exports.offers = async (req, res, next) => {
     try {

         if (req.session.user_id) {
             const user_id = req.session.user_id;
             console.log('Este es el ID del usuario:', user_id);
             console.log('Solicitud POST recibida en companyControler');
             const { offers_name, offers_description, offers_degree, offers_skills } = req.body;

             console.log(offers_name, offers_description, offers_degree, offers_skills);

             await conexion.query('INSERT INTO offers_comp SET ?', {
                 user_id: user_id,
                 offers_name: offers_name,
                 offers_description: offers_description,
                 offers_degree: offers_degree,
                 offers_skills: offers_skills
             });
            
             return console.log('registro exitoso')
         } else {
             return console.log(req.session.user)
                
         }
     } catch (error) {
         console.error('Error al generar registro de ofertas', error);
         return res.status(500).json({ error: 'Error al generar registro de ofertas' });
     }
 };


//  exports.showOff = async (req, res) => {
//     try {
//         const user_id = req.user.user_id;
//         const ofertas = await conexion.query('SELECT * FROM offers_comp WHERE user_id = ?', [user_id]);
//         console.log (ofertas)
//         res.render('ofertas', { ofertas: ofertas });
//     } catch (error) {
//         console.error('Error al obtener las ofertas del usuario:', error);
//         return console.log("Error al obtener las ofertas del usuario");
//     }
// };

exports.showOff = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const ofertas = await conexion.query('SELECT * FROM offers_comp WHERE user_id = ?', [user_id]);
        console.log('Ofertas obtenidas con éxito:', ofertas);
        res.render('ofertas', { ofertas: ofertas });
    } catch (error) {
        console.error('Error al obtener las ofertas del usuario:', error);
        res.status(500).send('Error al obtener las ofertas del usuario');
    }
};