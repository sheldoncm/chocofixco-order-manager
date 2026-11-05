// ChocoFixCo MongoDB REST API configuration.
const API_BASE_URL = (() => {
    const host = window.location.hostname;
    const match = host.match(/^(.*)-\d+\.app\.github\.dev$/);

    if (match) {
        return `https://${match[1]}-3000.app.github.dev`;
    }

    return `http://${host || "localhost"}:3000`;
})();

const API_ORDERS_URL = `${API_BASE_URL}/orders`;
