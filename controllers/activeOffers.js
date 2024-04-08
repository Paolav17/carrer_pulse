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

async function activeOffers(req, res) {
    try {
        const user_id = req.user.user_id;
        const ofertas = await conexion.query('SELECT * FROM offers_comp WHERE user_id = ?', [user_id]);
        console.log('Ofertas obtenidas con éxito:', ofertas);
        res.render('ofertas', { ofertas: ofertas });
    } catch (error) {
        console.error('Error al obtener las ofertas del usuario:', error);
        res.status(500).send('Error al obtener las ofertas del usuario');
    }
}

module.exports = activeOffers;