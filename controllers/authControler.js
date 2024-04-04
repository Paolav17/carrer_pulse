const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const conexion = require('../db/db');
const jwt  = require ('jsonwebtoken')
const {promisify} = require ('util');
const { error } = require('console');
const { resume } = require('../db/db');


exports.auth = async (req, res, next) => {
    try {
        console.log('Solicitud POST recibida en /auth');
        const { doc_type, num_doc, name_user, lastname_user, rol_user, email_user, pass, city_user } = req.body;
        
        // Realizar la consulta para verificar si el usuario ya está registrado
        const existingUserQuery = 'SELECT * FROM user_register WHERE id_num_user = ? OR email_user = ?';
        conexion.query(existingUserQuery, [num_doc, email_user], async (error, results) => {
            if (error) {
                console.error('Error al verificar usuario existente:', error);
                return res.status(500).json({ error: 'Error al verificar usuario existente' });
            }

            if (results.length > 0) {
                // Si el usuario ya está registrado, enviar una respuesta y detener la ejecución
                return res.render('register', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Ya existe un usuario registrado con ese número de documento o correo electrónico.",
                    alertIcon: 'Error',
                    showConfirmButton: true,
                    timer: 2500,
                    ruta: 'register'
                });
            }
        }); 
        if (!doc_type || !num_doc || !name_user || !lastname_user || !rol_user || !email_user || !pass || !city_user) {
            return res.render('register', {
                alert: true,
                alertTitle: "Información incorrecta",
                alertMessage: "Debe llenar todos los campos!",
                alertIcon: 'Error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'register'
            });
        }

        if (doc_type === 'select' || rol_user === 'select') {
            return res.render('register', {
                alert: true,
                alertTitle: "Información incorrecta",
                alertMessage: "Debe seleccionar su número de documento y tipo de registro",
                alertIcon: 'Error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'register'
            });
        }
        if (isNaN(num_doc)) {
            return res.render('register', {
                alert: true,
                alertTitle: "Información incorrecta",
                alertMessage: "Número de documento debe ser numérico",
                alertIcon: 'Error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'register'
            });
        }
        if (!isNaN(name_user) || !isNaN(lastname_user) || !isNaN(email_user)) {
            return res.render('register', {
                alert: true,
                alertTitle: "Información incorrecta",
                alertMessage: "Su nombre completo y correo deben ser datos reales",
                alertIcon: 'Error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'register'
            });
        }
        if (!passwordVali(pass)) {
            return res.render('register', {
                alert: true,
                alertTitle: "Información incorrecta",
                alertMessage: "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.",
                alertIcon: 'Error',
                showConfirmButton: true,
                timer: 2500,
                ruta: 'register'
            });
        }

        const passwordHash = await bcryptjs.hash(pass, 8);

        conexion.query('INSERT INTO user_register SET ?', {
            doc_type: doc_type,
            id_num_user: num_doc,
            name_user: name_user,
            lastname_user: lastname_user,
            rol_user: rol_user,
            email_user: email_user,
            pass_user: passwordHash,
            city_user: city_user
        }, (error, results) => {
            if (error) {
                console.error('Error al generar registro', error);
                return res.status(500).json({ error: 'Error al generar registro' });
            } else {
                // Si el registro fue exitoso, redirigir al usuario
                res.redirect('/');
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM user_register WHERE email_user = ?', [decodificada.email_user], (error, results) => {
                if (error) {
                    console.error("Error al ejecutar la consulta:", error);
                    return res.status(500).send("Error al obtener la información del usuario");
                }

                console.log('Usuario autenticado:', results[0]); // Aquí deberías imprimir los resultados de la consulta
                req.user = results[0]; // Asigna los resultados a req.user

                return next();
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send("Error en la verificación del token");
        }
    } else {
        res.redirect('/');
    }
};

// exports.isAuthenticated = async (req, res, next) => {
//     if (req.cookies.jwt) {
//         try {
//             const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
//             conexion.query('SELECT * FROM user_register WHERE email_user = ?', [decodificada.email_user], (error, results) => {
//                 console.log('Usuario autenticado:', req.email_user);
//                 if (!results) {
//                     return next();
//                 }
//                 req.email_user = results[0];
//                 return next();
//             });
//         } catch (error) {
//             console.log(error);
//             return next();
//         }
//     } else {
//         res.redirect('/');
//     }
// };

function passwordVali(pass) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
}