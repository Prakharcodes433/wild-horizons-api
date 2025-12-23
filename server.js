import http from 'node:http'
import { getDataFromDB } from './db.js'
const PORT = 8000;

const server = http.createServer(async (req, res) => {
    const destinations = await getDataFromDB();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    if (req.url === '/api' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify(destinations));

    } else if (req.url.startsWith('/api/continent/') && req.method === 'GET') {
        const continent = decodeURIComponent(req.url.split('/').pop());
        const filterData = destinations.filter((dest) => 
            dest.continent.toLowerCase() === continent.toLowerCase()
        );
        res.statusCode = 200;
        res.end(JSON.stringify(filterData));

    } else if (req.url.startsWith('/api/country/') && req.method === 'GET') {
        const country = decodeURIComponent(req.url.split('/').pop());
        const filterCountryData = destinations.filter((dest) => 
            dest.country.toLowerCase() === country.toLowerCase()
        );
        res.statusCode = 200;
        res.end(JSON.stringify(filterCountryData));

    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ 
            error: "Not Found", 
            message: "The requested route is not valid" 
        }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});