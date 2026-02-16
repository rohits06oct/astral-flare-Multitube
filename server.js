// server.js - Backend Proxy for EmailJS
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.static('./')); // Serve static files from the root directory

// Secure configuration (Try to load from config.js)
let CONFIG;
try {
    CONFIG = require('./config.js').CONFIG;
} catch (e) {
    // config.js might not be available in all contexts
}

const appConfig = (typeof CONFIG !== 'undefined' && CONFIG !== null) ? CONFIG : {
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID"
};

console.log('Server: Using configuration:', {
    publicKey: appConfig.publicKey.substring(0, 4) + '...',
    serviceId: appConfig.serviceId,
    templateId: appConfig.templateId
});

// API Endpoint for sending emails
app.post('/api/send-email', async (req, res) => {
    try {
        const templateParams = req.body;

        const payload = {
            service_id: appConfig.serviceId,
            template_id: appConfig.templateId,
            user_id: appConfig.publicKey,
            template_params: templateParams
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Origin': 'https://youtubemulti.online/',
                'Referer': 'https://youtubemulti.online/contact.html'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else {
            const errorText = await response.text();
            res.status(response.status).json({ message: 'EmailJS Error', error: errorText });
        }
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Email proxy endpoint active at /api/send-email`);
});
