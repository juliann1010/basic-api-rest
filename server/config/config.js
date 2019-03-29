// =====================
// Puerto 
// =====================

process.env.PORT = process.env.PORT || 3000; //Si definen esta variable en Heroku será entonces el valor de PORT, en caso contrario será 3000

// =====================
// Entorno
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =============================
// Tiempo de validez del token
// =============================

process.env.TOKEN_EXPIRATION_DATE = 60 * 60 * 24 * 30;

// =====================
// TOKEN SEED
// =====================

process.env.SEED = process.env.SEED || 'this-is-a-seed';

// =====================
// Base de datos
// =====================

let urlDB;

if(process.env.NODE_ENV === 'dev'){ //Conexion local
    urlDB = 'mongodb://localhost:27017/cafe';
}
else{ //Conexion con mongo db Atlas
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// =====================
// Google client ID
// =====================

process.env.CLIENT_ID = process.env.CLIENT_ID || "775097927956-6sla1q68fl9dl4g7bqhnid4p1t2jimgt.apps.googleusercontent.com"

