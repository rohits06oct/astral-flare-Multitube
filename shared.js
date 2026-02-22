/**
 * YoutubeMulti Pro - Shared Business Logic
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
                    <a href="${prefix}index.html" class="logo">YoutubeMulti</a>
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

        const footerHTML = `
            <div class="container">
                <p>&copy; 2026 YoutubeMulti Pro. All rights reserved.</p>
                <div class="footer-links">
                    <a href="${prefix}about.html">About YoutubeMulti</a>
                    <a href="${prefix}contact.html">Contact Support</a>
                    <a href="${prefix}blog.html">Blog</a>
                    <a href="${prefix}subscription.html">Subscription Plans</a>
                </div>
            </div>
        `;

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
    }
};

// Auto-init shared UI elements
document.addEventListener('DOMContentLoaded', () => {
    // If the page is NOT index or blog (which have hardcoded headers for SEO/performance), 
    // or if we explicitly want to standardise them, we can call renderSharedElements.
    // However, for articles, we definitely want it.
    const isArticle = window.location.pathname.includes('/article/');
    if (isArticle) {
        MultiTubeApp.renderSharedElements();
    } else {
        // For root pages, just init the existing elements
        MultiTubeApp.initPremiumUI();
        MultiTubeApp.initMobileMenu();
    }
});

window.MultiTubeApp = MultiTubeApp;

