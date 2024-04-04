const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const conexion = require('../db/db');
const jwt  = require ('jsonwebtoken')
const {promisify} = require ('util');
const { error } = require('console');
const { resume } = require('../db/db');


exports.login = async (req, res, next) =>{
    const user = req.body.user;
        const pass = req.body.pass;

        if (!user || !pass) {
            return res.render('index', {
                alert:true,
                alertTitle : "Error",
                alertMessage : "Usuario y contraseña no proporcionados",
                alertIcon: 'error',
                showConfirmButton : true,
                timer: 2000,
                ruta: ''
            });
        }
        
        conexion.query('SELECT * FROM user_register WHERE email_user = ?', [user], async (error, results) => {
            if (error) {
                console.error('Error en la consulta de usuario:', error);
                return res.status(500).send('Error en el servidor');
            }

            if (results.length === 0) {
                return res.render('index', {
                    alert:true,
                    alertTitle : "Error",
                    alertMessage : "Usuario no encontrado",
                    alertIcon: 'error',
                    showConfirmButton : true,
                    timer: 5000,
                    ruta: ''
                });
            }
            else{
                console.log("si llega a acá")
                const id = results [0].id
                const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                });
                console.log("TOKEN: " + token + " para el usuario: " + user);
                const cookiesOptions = {
                    expires : new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly : true
                }
                res.cookie('jwt',token, cookiesOptions)

            }

            const hashedPassword = results[0].pass_user;

            // Comparar contraseña 
            const passwordMatch = await bcryptjs.compare(pass, hashedPassword);

            if (!passwordMatch) {

                return res.render('index', {
                    alert:true,
                    alertTitle : "Error",
                    alertMessage : "Usuario y/o contraseña incorrecta",
                    alertIcon: 'error',
                    showConfirmButton : true,
                    timer: 5000,
                    ruta: ''
                });
            }

            const userRole = results[0].rol_user;
                // inicios de sesión de los usuarios
            if (userRole === 'student') {
                return res.redirect('/student');
            } else if (userRole === 'company') {
                return res.redirect('/company');
            } else {
                return res.status(400).send('Rol inválido');
            }
        });
        

            // return res.render('index', {
            //     alert:true,
            //     alertTitle : "Conexión exitosa",
            //     alertMessage : "Ingreso correcto",
            //     alertIcon: 'success',
            //     showConfirmButton : false,
            //     timer: 5000,
            //     ruta: ''
            // });
        };