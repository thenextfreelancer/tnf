const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const STATIC_DIR = '/app/static-site';

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8'
};

const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

const server = http.createServer((req, res) => {
    // Sanitize URL - prevent directory traversal
    let urlPath = decodeURIComponent(req.url).split('?')[0].split('#')[0];
    urlPath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
    
    // Block suspicious paths
    if (urlPath.includes('..') || urlPath.includes('\0')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    let filePath = path.join(STATIC_DIR, urlPath);
    
    // Default to index.html for directory requests
    if (urlPath === '/' || urlPath === '') {
        filePath = path.join(STATIC_DIR, 'index.html');
    }
    
    // Ensure we're still within the static directory
    if (!filePath.startsWith(STATIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Try appending .html
            const htmlPath = filePath + '.html';
            fs.stat(htmlPath, (err2, stats2) => {
                if (!err2 && stats2.isFile()) {
                    serveFile(htmlPath, res);
                } else {
                    // Try index.html in directory
                    const indexPath = path.join(filePath, 'index.html');
                    fs.stat(indexPath, (err3, stats3) => {
                        if (!err3 && stats3.isFile()) {
                            serveFile(indexPath, res);
                        } else {
                            // 404
                            Object.entries(securityHeaders).forEach(([k, v]) => res.setHeader(k, v));
                            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                            res.end(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>404 | TheNextFreelancer</title></head><body style="background:#0A0A0A;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0"><div style="text-align:center"><h1 style="font-size:4rem;margin:0;color:#FF3366">404</h1><p style="color:#A1A1AA">Page not found</p><a href="/" style="color:#FF3366">Go Home</a></div></body></html>`);
                        }
                    });
                }
            });
            return;
        }
        
        serveFile(filePath, res);
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        
        const headers = {
            'Content-Type': contentType,
            ...securityHeaders
        };
        
        // Cache static assets longer
        if (['.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.woff', '.woff2'].includes(ext)) {
            headers['Cache-Control'] = 'public, max-age=86400';
        } else {
            headers['Cache-Control'] = 'public, max-age=3600';
        }
        
        res.writeHead(200, headers);
        res.end(content);
    });
}

server.listen(PORT, '0.0.0.0', () => {
    console.log(`TheNextFreelancer static server running on port ${PORT}`);
    console.log(`Serving files from: ${STATIC_DIR}`);
});
