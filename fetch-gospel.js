const fetch = require('node-fetch');

// La URL del feed se mantiene aquí, pero la API key se obtiene de las variables de entorno de Netlify.
const RSS_FEED_URL = 'https://www.vaticannews.va/es/evangelio-de-hoy.rss.xml';
const API_KEY = process.env.RSS2JSON_API_KEY; // Se leerá de las variables de entorno de Netlify

exports.handler = async function(event, context) {
  // Construimos la URL de la API de rss2json
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEED_URL)}&api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Si la respuesta no es exitosa, devolvemos un error.
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    // Devolvemos los datos en formato JSON con un código de éxito.
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error en la función serverless:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error al obtener el feed RSS' }) };
  }
};