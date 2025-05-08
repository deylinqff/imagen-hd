const sharp = require('sharp');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Método no permitido');
    return;
  }

  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const imageBuffer = Buffer.concat(buffers);
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    const width = 1920;
    const height = Math.round((metadata.height / metadata.width) * width);

    const hdBuffer = await image.resize(width, height).jpeg().toBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.status(200).send(hdBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al procesar la imagen');
  }
};