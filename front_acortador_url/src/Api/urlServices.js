export const BASE_URL = 'http://localhost:5062';

const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    return await response.json();
};

export const shortenUrl = (originalUrl) => 
    apiRequest('/api/urls', 'POST', { originalUrl });

export const getStats = (shortCode) => 
    apiRequest(`/api/urls/${shortCode}/stats`);