const express = require('express');
const mongoose = require("mongoose");
const userRoutes = require('./routes');
const http = require('http');
require('dotenv').config({path: './.env'});
const app = express();
const cors = require("cors")
const path = require('path');
app.use(express.json());

app.use(cors({origin: process.env.CLIENT_URL}));

//routes
app.use('/api', userRoutes);
app.use('/image', express.static(path.join(__dirname, 'image')));

mongoose.set('strictQuery', true);
mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.8y46nkw.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//vérifie que le port est correct
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };

const port = normalizePort(process.env.PORT);
app.set('port', port);

const server = http.createServer(app);

server.listen(port);


//contrôle erreur
  const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };


//  écouter les événements du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});