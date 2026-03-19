const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8000;
let activeTestProcess = null;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.xml': 'application/xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // API Endpoint for running tests
    if (req.url === '/api/run-tests') {
        if (activeTestProcess) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('ERROR: A test is already running. Please stop it first.');
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Transfer-Encoding': 'chunked',
            'Access-Control-Allow-Origin': '*'
        });

        res.write('>>> INITIALIZING PLAYWRIGHT TEST SUITE...\n');
        res.write('>>> COMMAND: npx playwright test tests/articles.spec.js --config playwright.config.js\n\n');

        // Run from the automation directory where config/dependencies are
        activeTestProcess = spawn('npx', ['playwright', 'test', 'tests/articles.spec.js', '--config', 'playwright.config.js'], {
            shell: true,
            cwd: path.join(__dirname, 'automation')
        });

        activeTestProcess.stdout.on('data', (data) => {
            res.write(data.toString());
        });

        activeTestProcess.stderr.on('data', (data) => {
            res.write('\n[STDERR]: ' + data.toString());
        });

        activeTestProcess.on('close', (code) => {
            res.write(`\n\n>>> Automation finished with exit code ${code}\n`);
            res.end();
            activeTestProcess = null;
        });

        activeTestProcess.on('error', (err) => {
            res.write(`\n\n>>> ERROR STARTING PROCESS: ${err.message}\n`);
            res.end();
            activeTestProcess = null;
        });

        return;
    }

    // API Endpoint for stopping tests
    if (req.url === '/api/stop-tests') {
        res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        if (activeTestProcess) {
            // On Windows, spawned processes might need taskkill to kill the entire tree
            spawn('taskkill', ['/pid', activeTestProcess.pid, '/f', '/t']);
            res.end('>>> Request sent to terminate Playwright process.');
        } else {
            res.end('>>> No active test process to stop.');
        }
        return;
    }

    // Static file serving logic
    let urlPath = req.url.split('?')[0]; // Simple query param strip
    let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `🚀 MultiTube Local Server is running!`);
    console.log(`- App:   http://localhost:${PORT}`);
    console.log(`- Blog:  http://localhost:${PORT}/blog.html`);
    console.log(`- Tests: http://localhost:${PORT}/api/run-tests (API)`);
    console.log('\nPress Ctrl+C to stop the server.');
});
