const express = require('express');
const sharp = require('sharp');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Obtener la imagen desde el cuerpo de la solicitud
      const imageBuffer = req.body;

      // Usar sharp para procesar la imagen
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      // Establecer el tamaño deseado (resolución HD)
      const width = 1920;
      const height = Math.round((metadata.height / metadata.width) * width);

      const hdImageBuffer = await image.resize(width, height).toBuffer();

      // Configurar el tipo de contenido y enviar la imagen procesada
      res.setHeader('Content-Type', 'image/jpeg');
      res.status(200).send(hdImageBuffer);
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      res.status(500).send('Error interno del servidor');
    }
  } else {
    // Si el método no es POST
    res.status(405).send('Método no permitido');
  }
};