const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');
const mongoose = require('mongoose');
const { Usuario, conectarDB } = require('./mongo');
const mongoDBURY = 'mongodb+srv://pcm0027:12345ppp@cluster0.wnoz9bl.mongodb.net/';
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3000;

const usuarioSchema = new mongoose.Schema({
    nombre: String,
    password: String
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(session({
    secret: 'tu cadena secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Función de autenticación
const auth = function (req, res, next) {
    console.log('Sesión del usuario:', req.session.user);
    if (req.session && req.session.user === "admin" && req.session.admin) {
        return next();
    } else {
        return res.sendStatus(401);
    }
}

app.use(cookieParser('your secret here'));

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeOpenAIAPIRequest = async (userInput, retries = 3) => {
    try {
        return await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: userInput }],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
            },
        });
    } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
            const secondsToWait = Math.pow(2, 4 - retries);
            console.log(`Demasiadas solicitudes. Esperando ${secondsToWait} segundos antes del reintento...`);
            await sleep(secondsToWait * 1000);
            return makeOpenAIAPIRequest(userInput, retries - 1);
        } else {
            throw error;
        }
    }
};

app.get('/', (req, response) => {
    const contenido = fs.readFileSync("public/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});



app.get('/login', (req, response) => {
    const contenido = fs.readFileSync("public/chat.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get('/peticionMEDAC', (req, response) => {
    const contenido = fs.readFileSync("public/peticionMEDAC.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get('/rutaSegura', auth, (req, response) => {
    console.log('Sesión del usuario en la ruta segura:', req.session.user);
    const contenido = fs.readFileSync("public/chat.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});
app.get("/saluda", function (req, res) {
    res.send("Hola mundo");
});

app.get('/registro', (req, response) => {
    const contenido = fs.readFileSync("public/chat.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get('/lista_usuarios', auth, async (req, res) => {
    const contenido = fs.readFileSync("public/lista_usuarios.html");
    res.setHeader("Content-type", "text/html");
    res.send(contenido);
});

app.post('/identificar', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send({ "res": "login failed" });
    } else {
        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.username == req.body.username && usuario.password == req.body.password
        );

        if (usuarioEncontrado) {
            req.session.user = "admin";
            req.session.admin = true;
            return res.send({ "res": "login true" });
        } else {
            res.send({ "res": "usuario no valido" });
        }
    }
});

app.post('/registrar', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send({ "res": "register failed" });
    } else {
        let usuarioExiste = false;
        for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].username == req.body.username) {
                usuarioExiste = true;
            }
        }
        if (usuarioExiste) {
            res.send({ "res": "usuario ya existe" });
        } else {
            var usuario = {
                username: req.body.username,
                password: req.body.password
            }
            usuarios.push(usuario);
            console.log(usuarios);
            guardarUsuarios(usuarios);
            res.send({ "res": "register true" });
        }
    }
});

app.post('/registrarNueva', async function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send({ "res": "register failed" });
    } else {
        try {
            usuarioExistente = await Usuario.findOne({ nombre: req.body.username });
        } catch (err) {
            console.error('Error al cargar los usuarios', err);
        }
        if (usuarioExistente) {
            console.log('Ya existe un usuario con ese nombre');
            res.send({ "res": "usuario ya existe" });
        } else {
            const nuevoUsuario = new Usuario({
                nombre: req.body.username,
                password: req.body.password
            });
            try {
                nuevoUsuario.save();
                console.log('nuevo usuario creado:', nuevoUsuario);
                res.send({ "res": "register true" });
            } catch (err) {
                console.error('error al crear el usuario:', err);
            }
        }
    }
});

app.post('/identificarNuevo', async function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.send({ "res": "login failed" });
    } else {
        try {
            usuarioEncontrado = await Usuario.findOne({ nombre: req.body.username, password: req.body.password });
            if (usuarioEncontrado) {
                req.session.user = "admin";
                req.session.admin = true;
                return res.send({ "res": "login true" });
            } else {
                res.send({ "res": "usuario no valido" });
            }
        } catch (err) {
            console.error('Error al cargar los usuarios', err);
        }
    }
});
    
    app.post('/lista_usuarios', async function (req, res) {
        try {
            lista_usuarios = await Usuario.find({}).select("nombre");
            res.json(lista_usuarios)
        }
        catch (err) {
            console.error('error al buscar usuario', err);
        }
    });
    
    function guardarUsuarios(usuarios) {
        const json = JSON.stringify(usuarios);
        fs.writeFileSync('usuarios.json', json, 'utf8', function (err) {
            if (err) {
                console.log('Ha ocurrido un error al guardar los usuarios', err);
            } else {
                console.log('Usuarios guardados correctamente.');
            }
        });
    }
    
    function cargarUsuarios() {
        try {
            const data = fs.readFileSync('usuarios.json', 'utf8');
            console.log("#######USUARIOS CARGADOS##############");
            console.log(JSON.parse(data));
            return JSON.parse(data);
        } catch (err) {
            console.log('Error al leer los usuarios desde el archivo:', err);
            return [];
        }
    }
    
    const openAIRouter = express.Router();
    
    openAIRouter.post('/tu-servidor', async (req, res) => {
        const userInput = req.body.message;
    
        try {
            const response = await makeOpenAIAPIRequest(userInput);
            res.json(response.data);
        } catch (error) {
            console.error('Error al obtener la respuesta de OpenAI', error);
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
    });
    
    const userRouter = express.Router();
    
    userRouter.post('/registro', (req, res) => {
        const { username, email, password } = req.body;
        console.log(`Nuevo usuario registrado: ${username}`);
        res.status(200).send('Registro exitoso');
    });
    
    app.use('/api/openai', openAIRouter);
    app.use('/api/usuarios', userRouter);
    
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
    
    app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
    });

// Función de conexión a la base de datos.

    conectarDB();