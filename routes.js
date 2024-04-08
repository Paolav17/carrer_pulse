const express = require('express');
const authControler = require('./controllers/authControler');
const loginControler = require('./controllers/loginControler')
const companyControler = require('./controllers/companyControler')
const activeOffers = require ('./controllers/activeOffers')
const router = express.Router();
const bcryptjs = require('bcryptjs');
const conexion = require('./db/db');
const jwt  = require ('jsonwebtoken')
const {promisify} = require ('util')


// Manejar la solicitudes Post
router.post('/auth', authControler.auth)
router.post('/login', loginControler.login )
router.post('/offers', companyControler.offers )
// router.post('/company/activate', activeOffers)

    

// Ruta GET para la página de estudiante
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/auth', authControler.isAuthenticated, (req, res) => {
    res.render('index');
});

router.get('/student', authControler.isAuthenticated, (req, res) => {
    console.log(req.user); // Log the user object
    res.render('student', { user: req.user });
});


// //     console.log("Se ha accedido a la ruta /student");
// //     // Verificar si el usuario está autenticado
// //     if (req.email_user && req.email_user.email_user) {
// //         // Si el usuario está autenticado, obtener su información desde la base de datos
// //         conexion.query('SELECT * FROM user_register WHERE email_user = ?', [req.email_user.email_user], (error, results) => {
// //             if (error) {
// //                 console.error("Error al ejecutar la consulta:", error);
// //                 // Manejar el error adecuadamente
// //                 return res.status(500).send("Error al obtener la información del usuario");
// //             } else {
// //                 console.log("Resultados de la consulta:", results);
// //                 // Renderizar la plantilla EJS y pasar la información del usuario como variable
// //                 const user = results.length > 0 ? results[0] : null;
// //                 // Renderizar la plantilla EJS y pasar la información del usuario como variable
// //                 return res.render('student', { user: user });
            
// //             }
// //         });
// //     } else {
// //         // Si el usuario no está autenticado, renderizar la plantilla EJS sin la información del usuario
// //         return res.render('student');
// //     }
// // });
// router.get('/student', authControler.isAuthenticated, (req, res) => {
//     res.render('student', { user:req.user });
// });

// Ruta GET para la página de registro
router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/company', authControler.isAuthenticated, async (req, res) => {
    try {
        console.log('Está llegando hasta el usuario');
        console.log(req.user);
        const user_id = req.user.user_id;
        req.session.user_id = user_id;

        // try {
        //     const ofertas = await conexion.query('SELECT * FROM offers_comp WHERE user_id = ?', [user_id]);
        //     console.log(ofertas);
        //     res.render('company', { user: req.user, ofertas: ofertas });
        // } catch (error) {
        //     console.error('Error al obtener las ofertas del usuario:', error);
        //     return res.status(500).json({ error: 'Error al obtener las ofertas del usuario' });
        // }
    } catch (error) {
        console.error('Error en la ruta /company:', error);
        return res.status(500).json({ error: 'Error en la ruta /company' });
    }
});




router.get('/logout', (req, res) => {
    const token = jwt.sign({}, process.env.JWT_SECRETO); 
    res.clearCookie('jwt');
    console.log ('si elimino' + token)
    res.redirect('/');
});
module.exports = router;
