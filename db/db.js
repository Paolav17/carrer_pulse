

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: "root",
    password: "",
    database: "carrer_pulse"
});

connection.connect((error) => {
    if (error) {
        console.error('Error de conexión a la base de datos:', error);
        console.error('Detalles de conexión:');
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

module.exports = connection;