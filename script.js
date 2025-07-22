/**
 * Busca y extrae el contenido específico del evangelio desde un bloque HTML.
 * @param {string} html - El contenido HTML del feed RSS.
 * @returns {string|null} El HTML del evangelio o null si no se encuentra.
 */
function getSpecificContent(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const paragraphs = Array.from(tempDiv.getElementsByTagName('p'));
    let result = '';
    let found = false;
    const searchString = "Lectura del santo evangelio";

    for (const p of paragraphs) {
        if (found || p.textContent.trim().toLowerCase().includes(searchString.toLowerCase())) {
            result += p.outerHTML;
            found = true;
        }
    }
    return found ? result : null;
}

/**
 * Muestra el último elemento del feed RSS en la página.
 * @param {Array} items - Un array de elementos del feed.
 */
function displayLatestRSSItem(items) {
    const rssFeedContainer = document.getElementById('rss-feed');
    rssFeedContainer.innerHTML = ''; // Limpiar el mensaje de "Cargando..."

    if (!items || items.length === 0) {
        rssFeedContainer.textContent = 'No se pudo cargar el evangelio.';
        return;
    }

    const latestItem = items[0];
    const rssItem = document.createElement('div');
    rssItem.classList.add('rss-item');

    const title = document.createElement('div');
    title.classList.add('rss-title');
    title.textContent = latestItem.title;

    const content = document.createElement('div');
    content.classList.add('rss-content');
    const specificContent = getSpecificContent(latestItem.description);

    if (specificContent) {
        content.innerHTML = specificContent;
    } else {
        content.innerHTML = `<p><em>No se encontró el contenido específico del evangelio.</em></p><br><h3>Contenido completo:</h3>${latestItem.description}`;
    }

    rssItem.appendChild(title);
    rssItem.appendChild(content);
    rssFeedContainer.appendChild(rssItem);
}

/**
 * Obtiene y procesa el feed RSS.
 */
async function fetchRSSFeed() {
    // La URL ahora apunta a nuestra función de Netlify, no a la API externa directamente.
    const functionUrl = '/.netlify/functions/fetch-gospel';
    try {
        const response = await fetch(functionUrl);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        displayLatestRSSItem(data.items);
    } catch (error) {
        console.error('Error al obtener el feed RSS:', error);
        document.getElementById('rss-feed').textContent = 'Error al cargar el contenido. Por favor, inténtalo de nuevo más tarde.';
    }
}

// Iniciar la carga del feed cuando el DOM esté listo.
document.addEventListener('DOMContentLoaded', fetchRSSFeed);