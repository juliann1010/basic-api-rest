// =====================
// Puerto 
// =====================

process.env.PORT = process.env.PORT || 3000; //Si definen esta variable en Heroku será entonces el valor de PORT, en caso contrario será 3000

// =====================
// Entorno
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
// Base de datos
// =====================

let urlDB;

if(process.env.NODE_ENV === 'dev'){ //Conexion local
    urlDB = 'mongodb://localhost:27017/cafe';
}
else{ //Conexion con mongo db Atlas
    urlDB = 'mongodb+srv://juliann1010:u16k0I7cZcN1qaZq@cluster0-ydx6j.mongodb.net/test'
}

process.env.URLDB = urlDB;