const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const conexion = require('../db/db');
const jwt  = require ('jsonwebtoken')
const {promisify} = require ('util');
const { error } = require('console');
const { resume } = require('../db/db');


exports.login = async (req, res, next) => {
    const user = req.body.user;
    const pass = req.body.pass;

    // Validar si el usuario y la contraseña se proporcionaron
    if (!user || !pass) {
        return res.render('index', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y contraseña no proporcionados",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 2000,
            ruta: ''
        });
    }
    
    // Consultar si el usuario existe en la base de datos
    conexion.query('SELECT * FROM user_register WHERE email_user = ?', [user], async (error, results) => {
        if (error) {
            console.error('Error en la consulta de usuario:', error);
            return res.status(500).send('Error en el servidor');
        }
        console.log("Consultando usuario con correo electrónico:", user);
        console.log("Resultados de la consulta a la base de datos:", results);
    
        // Si no se encontró ningún usuario con el correo electrónico proporcionado
        if (results.length === 0) {
            return res.render('index', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario no encontrado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 5000,
                ruta: ''
            });
        }
    
        // Si se encontró el usuario, continuar con la verificación de la contraseña
        const usuario = results[0];
        const hashedPassword = usuario.pass_user;
    
        try {
            const passwordMatch = await bcryptjs.compare(pass, hashedPassword); 
            
            if (!passwordMatch) {
                // Si la contraseña no coincide, mostrar un mensaje de error
                return res.render('index', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 5000,
                    ruta: ''
                });
            }
    
            // Generar un token JWT
            const id = usuario.id;
            const token = jwt.sign({ email_user: usuario.email_user }, process.env.JWT_SECRETO, {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA
            });
    
            // Establecer la cookie con el token JWT
            const cookiesOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie('jwt', token, cookiesOptions);

            if (usuario.rol_user === 'student') {
                return res.redirect('/student');
            } else if (usuario.rol_user === 'company') {
                return res.redirect('/company');
            } else {
                return res.status(400).send('Rol inválido');
            }
        } catch (error) {
            console.error('Error al comparar contraseñas:', error);
            return res.status(500).send('Error en el servidor');
        }
    });
};
