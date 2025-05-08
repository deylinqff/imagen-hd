const express = require('express');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Endpoint para convertir la imagen a HD
app.post('/convertir-hd', express.raw({ type: 'image/*', limit: '10mb' }), async (req, res) => {
  try {
    // Obtener la imagen de la solicitud
    const imageBuffer = req.body;

    // Usar sharp para convertir la imagen
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Ajustar la resolución para obtener un formato HD (1920x1080 por ejemplo)
    const width = 1920;
    const height = Math.round((metadata.height / metadata.width) * width);

    const hdImageBuffer = await image.resize(width, height).toBuffer();

    // Configurar el tipo de contenido y enviar la imagen
    res.set('Content-Type', 'image/jpeg');
    res.send(hdImageBuffer);
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).send('Error al procesar la imagen');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor de API escuchando en el puerto ${port}`);
});