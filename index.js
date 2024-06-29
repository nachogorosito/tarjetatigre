const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const cors = require('cors'); 
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

// Función para generar la imagen de la tarjeta y devolver la URL
async function generateCardBackground() {
    const canvas = createCanvas(600, 400); // Ancho y alto del lienzo
    const ctx = canvas.getContext('2d');

    // Dibujar fondo rojo
    ctx.fillStyle = '#ff0000'; // Color rojo
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Rellenar todo el lienzo

    // Dibujar el texto "SOY TIGRE"
    ctx.fillStyle = '#ffffff'; // Color blanco para el texto
    ctx.font = '30px Arial'; // Fuente y tamaño del texto
    ctx.textAlign = 'center'; // Alineación centrada
    ctx.fillText('SOY TIGRE', canvas.width / 2, 50); // Posición y texto

    // Dibujar el subtítulo "TARJETA DE BENEFICIOS"
    ctx.font = '20px Arial'; // Tamaño del subtítulo
    ctx.fillText('TARJETA DE BENEFICIOS', canvas.width / 2, 90); // Posición y texto

    // Generar un nombre único para la imagen
    const imageName = `card-${Date.now()}.png`;
    const imagePath = path.join(__dirname, 'public', 'images', imageName);

    // Guardar la imagen en el servidor
    const out = fs.createWriteStream(imagePath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    return new Promise((resolve, reject) => {
        out.on('finish', () => {
            // Construir la URL completa de la imagen
            const imageUrl = `http://localhost:${PORT}/images/${imageName}`; // Cambiar según tu configuración de servidor
            resolve(imageUrl);
        });

        out.on('error', (err) => {
            reject(err);
        });
    });
}

// Ruta para generar la URL de la imagen de la tarjeta
app.get('/', async (req, res) => {
    try {
        const imageUrl = await generateCardBackground();

        // Devolver la URL de la imagen como respuesta
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error al generar la tarjeta:', error);
        res.status(500).json({ error: 'Error al generar la tarjeta' });
    }
});

// Servir las imágenes estáticas desde el directorio 'public'
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
