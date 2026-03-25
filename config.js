// config.js - Local configuration for EmailJS
// DO NOT commit this file to GitHub
// config.js - Local configuration for EmailJS
// DO NOT commit this file to GitHub
var CONFIG = {
    publicKey: "gv3fHKK0mqX6ajCTk",
    serviceId: "service_roh99nmsij",
    templateId: "template_nowjwvi"
};

// Ensure it's available in all contexts (Window, ServiceWorker, or Node.js)
if (typeof self !== 'undefined') self.CONFIG = CONFIG;
if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof module !== 'undefined' && module.exports) module.exports = { CONFIG };
