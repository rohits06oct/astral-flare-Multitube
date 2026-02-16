// api/send-email.js - Vercel Serverless Function
const fetch = require('node-fetch');

// Secure configuration
// In production, these should be set as Environment Variables in Vercel
const CONFIG = {
    publicKey: process.env.EMAILJS_PUBLIC_KEY || "gv3fHKK0mqX6ajCTk",
    serviceId: process.env.EMAILJS_SERVICE_ID || "service_roh99nmsij",
    templateId: process.env.EMAILJS_TEMPLATE_ID || "template_nowjwvi"
};

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const templateParams = req.body;

        const payload = {
            service_id: CONFIG.serviceId,
            template_id: CONFIG.templateId,
            user_id: CONFIG.publicKey,
            template_params: templateParams
        };

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Vercel-Serverless)',
                'Origin': 'https://youtubemulti.online'
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
        console.error('Serverless Function Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
