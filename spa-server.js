const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = 3001;

// Servir archivos estáticos desde /build
app.use(express.static(path.join(__dirname, 'build')));

// Para cualquier otra ruta, servir index.html (SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configurar HTTPS
const options = {
  key: fs.readFileSync('/app/secrets/pulgashopkey.pem'),
  cert: fs.readFileSync('/app/secrets/pulgashopcert.pem')
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on https://localhost:${PORT}`);
});
