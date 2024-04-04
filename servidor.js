//paso 1: invocamos express (descargado previamente)
const express = require('express');
const app = express();
const routes = require('./routes'); 
const cookieParset = require('cookie-parser')
//paso 2: seteamos urlencoded para capturar los datos de mi formulario
app.use(express.urlencoded({extended:true}));
app.use (express.json());
//paso 3: invocamos a dotenv = variables de entorno
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });
console.log(process.env.DB_PASSWORD);

//paso 4:  directorio public 
app.use('/resources', express.static('public'));
app.use('/resources',express.static(__dirname + '/public'));
console.log(__dirname);
//paso 5: motor de plantillas
app.set('view engine', 'ejs');
// seteo de la carpeta public de mis archivos estáticos
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteamos las variables de entorno
dotenv.config({path:'/env/.env'})

//para que pueda trabajar con las cookies
app.use(cookieParset())

//procedimiento para borrar caché
app.use(function(req,res,next){
    if(!req.user)
    res.header('cache-contrl', 'private, no-cache, no-store, must-revalidate');
    next();
})

//paso 6: invocar el módulo para el cachin de contraseñas
const bcryptjs =  require('bcryptjs');
//paso 7:  configurar las variables para el inicio de sesión
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave : true,
    saveUninitialized : true,   
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);


//se define el puerto donde debe escuchar
const PUERTO=3001;
app.listen(PUERTO, () => {
    console.log("servidor ejecutandose");
});
