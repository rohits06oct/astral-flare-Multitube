/**
 * YoutubeMulti - Shared Business Logic
 */

const MultiTubeApp = {
    config: {
        free: {
            maxUrls: 10,
            maxScreens: 20
        },
        paid: {
            maxUrls: 30,
            maxScreens: 50
        }
    },

    getState() {
        const saved = localStorage.getItem('multitube_pro_state');
        return saved ? JSON.parse(saved) : { isPremium: false };
    },

    setState(newState) {
        localStorage.setItem('multitube_pro_state', JSON.stringify(newState));
    },

    getLimits() {
        const state = this.getState();
        return state.isPremium ? this.config.paid : this.config.free;
    },

    checkPermission(urlCount, screenCount) {
        const limits = this.getLimits();
        if (urlCount > limits.maxUrls) {
            return { allowed: false, error: `Limit exceeded: Maximum ${limits.maxUrls} video URLs allowed for your plan.` };
        }
        if (screenCount > limits.maxScreens) {
            return { allowed: false, error: `Limit exceeded: Maximum ${limits.maxScreens} screens allowed for your plan.` };
        }
        return { allowed: true };
    },

    initPremiumUI() {
        const state = this.getState();
        if (state.isPremium) {
            document.body.classList.add('premium-active');
            // Hide "Upgrade" links if already premium
            document.querySelectorAll('.upgrade-link').forEach(el => el.style.display = 'none');
        }
    },

    initMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const overlay = document.getElementById('mobileMenuOverlay');
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

        if (!hamburgerBtn || !overlay) return;

        const toggleMenu = () => {
            document.documentElement.classList.toggle('mobile-menu-active');
        };

        const closeMenu = () => {
            document.documentElement.classList.remove('mobile-menu-active');
        };

        hamburgerBtn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    },

    renderSharedElements() {
        // Detect if we are in the article subdirectory
        const isArticle = window.location.pathname.includes('/article/');
        const prefix = isArticle ? '../' : '';
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const headerHTML = `
            <div class="container">
                <nav>
                    <a href="${prefix}index.html" class="logo">
                        <svg width="250" height="50" viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid meet" style="display: block; height: 100%; width: auto;">
                        <rect width="500" height="120" rx="20" fill="#FF0000" />
                        <g transform="translate(20,20)">
                            <rect x="0" y="0" width="80" height="80" fill="#000" rx="8" />
                            <rect x="6" y="6" width="34" height="34" fill="#FF0000" />
                            <rect x="40" y="6" width="34" height="34" fill="#FFF" />
                            <rect x="6" y="40" width="34" height="34" fill="#FFF" />
                            <rect x="40" y="40" width="34" height="34" fill="#FF0000" />
                            <polygon points="32,25 48,40 32,55" fill="#FFF" />
                        </g>
                        <text x="110" y="60" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="900"
                            fill="#FFF">YoutubeMulti</text>
                        <text x="110" y="100" font-family="Arial, Helvetica, sans-serif" font-size="24"
                            font-weight="400" fill="#FFF">Multi Video Viewer</text>
                    </svg>
                    </a>
                    <div class="nav-links">
                        <a href="${prefix}index.html" class="${currentPath === 'index.html' ? 'active' : ''}">Home</a>
                        <a href="${prefix}about.html" class="${currentPath === 'about.html' ? 'active' : ''}">About</a>
                        <a href="${prefix}contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Contact</a>
                        <a href="${prefix}blog.html" class="${currentPath === 'blog.html' || isArticle ? 'active' : ''}">Blog</a>
                        <a href="${prefix}subscription.html" class="${currentPath === 'subscription.html' ? 'upgrade-link' : 'upgrade-link'}">Pricing</a>
                    </div>
                    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle Navigation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </div>
        `;

        const mobileMenuHTML = `
            <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
            <div class="mobile-menu-container">
                <div class="mobile-nav-links">
                    <a href="${prefix}index.html" class="${currentPath === 'index.html' ? 'active' : ''}">Home</a>
                    <a href="${prefix}about.html" class="${currentPath === 'about.html' ? 'active' : ''}">About</a>
                    <a href="${prefix}contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Contact</a>
                    <a href="${prefix}blog.html" class="${currentPath === 'blog.html' || isArticle ? 'active' : ''}">Blog</a>
                    <a href="${prefix}subscription.html" class="upgrade-link">Pricing</a>
                </div>
            </div>
        `;

        // const footerHTML = `
        //     <div class="container">
        //         <p>&copy; 2026 YoutubeMulti. All rights reserved.</p>
        //         <div class="footer-links">
        //             <a href="${prefix}index.html">Home</a>
        //             <a href="${prefix}about.html">About YoutubeMulti</a>
        //             <a href="${prefix}contact.html">Contact Support</a>
        //             <a href="${prefix}blog.html">Blog</a>
        //             <a href="${prefix}subscription.html">Subscription Plans</a>
        //         </div>
        //     </div>
        // `;

        // Inject Header
        let siteHeader = document.getElementById('site-header');
        if (!siteHeader) {
            siteHeader = document.createElement('header');
            siteHeader.id = 'site-header';
            document.body.prepend(siteHeader);
        }
        siteHeader.innerHTML = headerHTML;

        // Inject Mobile Menu (if not present)
        if (!document.getElementById('mobileMenuOverlay')) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = mobileMenuHTML;
            document.body.appendChild(tempDiv.firstElementChild);
            document.body.appendChild(tempDiv.lastElementChild);
        }

        // Inject Footer
        let siteFooter = document.getElementById('site-footer');
        if (!siteFooter) {
            siteFooter = document.createElement('footer');
            siteFooter.id = 'site-footer';
            document.body.appendChild(siteFooter);
        }
        siteFooter.innerHTML = footerHTML;

        // Re-initialize mobile menu after injection
        this.initMobileMenu();
        this.initPremiumUI();
    },

    injectTranslator() {
        if (document.getElementById('google_translate_element')) return;

        const translateContainer = document.createElement('div');
        translateContainer.id = 'google_translate_container';
        translateContainer.style.cssText = 'text-align: right; padding: 10px 20px; background: var(--bg-card, #1e1e1e); border-bottom: 1px solid var(--border, #333); margin-bottom: 20px; border-radius: 8px; display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 10px;';

        const translateDiv = document.createElement('div');
        translateDiv.id = 'google_translate_element';
        translateDiv.style.display = 'inline-block';

        const label = document.createElement('span');
        label.innerText = 'Translate: ';
        label.style.fontWeight = 'bold';
        label.style.color = 'var(--text-main, #fff)';

        translateContainer.appendChild(label);
        translateContainer.appendChild(translateDiv);

        const articleContainer = document.querySelector('.article-container');
        const blogContainer = document.querySelector('.blog-container');
        const header = document.getElementById('site-header') || document.querySelector('header');

        if (articleContainer) {
            articleContainer.prepend(translateContainer);
        } else if (blogContainer) {
            blogContainer.prepend(translateContainer);
        } else if (header) {
            header.after(translateContainer);
        } else {
            document.body.prepend(translateContainer);
        }

        window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es,fr,de,pl,zh-CN,hi,pt,ru,ja,ar,bn,ur,ko',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        };

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    }
};

// Auto-init shared UI elements
function initSharedUI() {
    const isArticle = window.location.pathname.includes('/article/');

    if (isArticle) {
        MultiTubeApp.renderSharedElements();
    } else {
        MultiTubeApp.initPremiumUI();
        MultiTubeApp.initMobileMenu();
    }

    // Inject the translator on all pages
    MultiTubeApp.injectTranslator();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedUI);
} else {
    initSharedUI();
}

window.MultiTubeApp = MultiTubeApp;

