const express = require('express');
const { createCanvas } = require('canvas');
const cors = require('cors'); 

const app = express();

app.use(cors())

const PORT = process.env.PORT || 3000;

// Función para generar la imagen de la tarjeta
function generateCardBackground() {
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

    return canvas.toBuffer(); // Devolver el buffer de la imagen generada
}

// Ruta para generar la imagen de la tarjeta
app.get('/api/generate-card', async (req, res) => {
    try {
        const cardBuffer = await generateCardBackground();
        
        // Establecer headers
        res.set('Content-Type', 'image/png'); // Tipo de contenido es imagen PNG

        // Enviar la imagen como respuesta
        res.send(cardBuffer);
    } catch (error) {
        console.error('Error al generar la tarjeta:', error);
        res.status(500).json({ error: 'Error al generar la tarjeta' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
