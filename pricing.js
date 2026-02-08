// pricing.js - Pricing & Subscription Logic for MultiTube Pro

(function () {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', function () {
        this.disabled = true;
        this.textContent = 'Redirecting to Stripe...';

        // Mock Payment Flow
        setTimeout(() => {
            const confirmUpgrade = confirm("This is a demo of the Stripe Checkout flow.\nWould you like to simulate a successful payment?");
            if (confirmUpgrade) {
                if (window.MultiTubeApp && typeof window.MultiTubeApp.setState === 'function') {
                    window.MultiTubeApp.setState({ isPremium: true });
                }
                alert("Payment Successful! Your account has been upgraded to Pro.");
                window.location.href = 'index.html';
            } else {
                alert("Payment Canceled.");
                this.disabled = false;
                this.textContent = 'Upgrade to Pro';
            }
        }, 800);
    });
})();
