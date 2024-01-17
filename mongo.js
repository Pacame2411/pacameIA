const mongoose = require('mongoose');
const mongoDBURY = 'mongodb+srv://pcm0027:12345ppp@cluster0.wnoz9bl.mongodb.net/';

// Definiendo esquema del usuario.
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    password: String
});

// Creando el modelo.
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Función de conexión a la base de datos.
const conectarDB = async () => {
    try {
        await mongoose.connect(mongoDBURY, {
            useNewUrlParser: true,   // useNewUrlParser es deprecado, pero lo dejamos por ahora
            useUnifiedTopology: true // useUnifiedTopology es deprecado, pero lo dejamos por ahora
        });
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error al conectar a MongoDB', err);
        process.exit(1); // Detiene la aplicación
    }
};

module.exports = { Usuario, conectarDB };
