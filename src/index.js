const express = require('express');
const routes = require('./routes');

const cors = require('cors');

const http = require('http');
const { setupWebSocket } = require('./webshocket');

require('./config/database');


const app = express();
const server = http.Server(app);
setupWebSocket(server);

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333, () => {
  console.log('Rodando!!!');
});
