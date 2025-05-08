const sharp = require('sharp');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Método no permitido');
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const width = 1920;
    const height = Math.round((metadata.height / metadata.width) * width);

    const hdBuffer = await image.resize(width, height).jpeg().toBuffer();

    res.setHeader('Content-Type', 'image/jpeg');
    res.status(200).send(hdBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al procesar la imagen');
  }
};