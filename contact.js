// contact.js - Contact Form Logic for YoutubeMulti

(function () {
    // Initialize EmailJS
    // NOTE: These values are replaced during deployment or can be set in a config.js file
    const appConfig = typeof CONFIG !== 'undefined' ? CONFIG : {
        publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
        serviceId: "YOUR_EMAILJS_SERVICE_ID",
        templateId: "YOUR_EMAILJS_TEMPLATE_ID"
    };

    emailjs.init({
        publicKey: appConfig.publicKey,
    });

    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const wordCountDisplay = document.getElementById('wordCount');
    const WORD_LIMIT = 1000;

    if (!form) return;

    // Word Counter Implementation
    function getWordCount(str) {
        return str.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    // Validation Helper
    function validateField(id, condition) {
        const input = document.getElementById(id);
        const error = document.getElementById(id + 'Error');
        if (condition) {
            input.classList.remove('invalid');
            error.classList.remove('visible');
            return true;
        } else {
            input.classList.add('invalid');
            error.classList.add('visible');
            return false;
        }
    }

    // Field Specific Validation Functions
    const validations = {
        name: () => validateField('name', nameInput.value.trim().length >= 3),
        email: () => validateField('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)),
        phone: () => validateField('phone', phoneInput.value.trim().length > 0 && /^[\d\s\+\-\(\)]+$/.test(phoneInput.value)),
        message: () => {
            const count = getWordCount(messageInput.value);
            return validateField('message', count > 0 && count <= WORD_LIMIT);
        }
    };

    // Real-time Listeners
    nameInput.addEventListener('input', validations.name);
    emailInput.addEventListener('input', validations.email);
    phoneInput.addEventListener('input', validations.phone);
    messageInput.addEventListener('input', function () {
        const count = getWordCount(this.value);
        wordCountDisplay.textContent = `Words: ${count} / ${WORD_LIMIT}`;

        if (count > WORD_LIMIT) {
            wordCountDisplay.classList.add('limit-reached');
        } else {
            wordCountDisplay.classList.remove('limit-reached');
        }
        validations.message();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const isNameValid = validations.name();
        const isEmailValid = validations.email();
        const isPhoneValid = validations.phone();
        const isMessageValid = validations.message();

        if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
            const firstInvalid = form.querySelector('.invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const status = document.getElementById('form-status');
        const btn = e.target.querySelector('button');

        btn.disabled = true;
        btn.textContent = 'Sending...';

        const randomId = Math.floor(1000 + Math.random() * 9000);
        const currentTime = new Date().toLocaleString('en-US', { timeZoneName: 'short' });

        const emailBody = `Full name : ${nameInput.value}\nEmail Address: ${emailInput.value}\nContact number: ${phoneInput.value}\nWhy you want to connect with us: \n${messageInput.value}\n\nThank you`;

        const templateParams = {
            email_subject: `${randomId} ${nameInput.value} ${phoneInput.value}`,
            time: currentTime,
            email_body: emailBody,
            name: nameInput.value,
            email: emailInput.value,
            lib_version: '@emailjs/browser@4',
            service_id: appConfig.serviceId,
            template_id: appConfig.templateId,
            user_id: appConfig.publicKey
        };

        emailjs.send(appConfig.serviceId, appConfig.templateId, templateParams)
            .then(function () {
                status.textContent = 'Message sent successfully! We will get back to you soon.';
                status.className = 'success';
                btn.textContent = 'Message Sent';
                form.reset();
                wordCountDisplay.textContent = `Words: 0 / ${WORD_LIMIT}`;
                btn.disabled = false;
                setTimeout(() => {
                    if (btn.textContent === 'Message Sent') {
                        btn.textContent = 'Send Message';
                    }
                }, 3000);
            }, function (error) {
                console.error('EmailJS Error:', error);
                status.textContent = 'Failed to send message. Please try again or contact us directly.';
                status.className = 'error';
                btn.disabled = false;
                btn.textContent = 'Send Message';
            });
    });
})();
