const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 6060;

// Servir archivos estáticos desde /static-build
app.use(express.static('/static-build'));

// Para cualquier otra ruta, index.html del build copiado
app.use((req, res) => {
  res.sendFile('/static-build/index.html');
});

// Configurar HTTPS
const options = {
  key: fs.readFileSync('/app/secrets/pulgashopkey.pem'),
  cert: fs.readFileSync('/app/secrets/pulgashopcert.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});