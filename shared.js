/**
 * MultiTube Pro - Shared Business Logic
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
    }
};

// Auto-init shared UI elements
document.addEventListener('DOMContentLoaded', () => {
    MultiTubeApp.initPremiumUI();
});

window.MultiTubeApp = MultiTubeApp;
