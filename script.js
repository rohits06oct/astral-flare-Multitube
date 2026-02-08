/**
 * MultiTube Pro - Execution Engine
 */

let _p = []; // Active players
let _ready = false;
let _loadQueue = [];
let _loadInProgress = false;

const observerOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
};

const _observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const hid = entry.target.dataset.hookId;
            const vid = entry.target.dataset.vid;
            const host = entry.target.dataset.host;
            const idx = entry.target.dataset.idx;

            if (hid && !_loadQueue.some(q => q.hid === hid)) {
                _loadQueue.push({ hid, vid, host, idx });
                _processQueue();
            }
            _observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function _processQueue() {
    if (_loadInProgress || _loadQueue.length === 0) return;
    _loadInProgress = true;

    const next = _loadQueue.shift();
    _initHook(next.hid, next.vid, next.host, next.idx);

    setTimeout(() => {
        _loadInProgress = false;
        _processQueue();
    }, 1000); // Reduced to 1s stagger (with Lazy Loading this is safe and better UX)
}

// Global API callbacks and utilities
window.onYouTubeIframeAPIReady = function () {
    _ready = true;
    _up('Ready', 'playing');
};

function _up(m, t) {
    const el = document.getElementById('overallStatus');
    if (el) {
        el.textContent = m;
        el.className = t || '';
    }
}

function _count(n) {
    const el = document.getElementById('activeCount');
    if (el) el.textContent = n;
}

function _getId(u) {
    const m = u.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : (u.length === 11 ? u : '');
}

function _start(urls, num, stage) {
    _up('Preparing Grid...', '');

    // Cleanup old players
    _p.forEach(p => { try { p.destroy(); } catch (e) { } });
    _p = [];
    _loadQueue = [];
    _loadInProgress = false;
    stage.innerHTML = '';
    _count(0);

    const ids = urls.map(u => ({ id: _getId(u), original: u })).filter(item => item.id !== '');
    if (ids.length === 0) return alert('No valid YouTube IDs found in your input.');

    // Clean Origin (No trailing slash)
    const host = window.location.origin;

    for (let i = 0; i < num; i++) {
        const item = ids[i % ids.length];
        const vid = item.id;
        const originalUrl = item.original;

        const box = document.createElement('div');
        box.className = 'item-box';
        if (originalUrl.includes('/shorts/')) box.classList.add('short');

        const hookId = `slot-node-${i}`;
        const hook = document.createElement('div');
        hook.id = hookId;
        hook.className = 'slot-placeholder';
        hook.innerHTML = `<span>Waiting for Viewport...</span>`;

        // Data for Observer
        box.dataset.hookId = hookId;
        box.dataset.vid = vid;
        box.dataset.host = host;
        box.dataset.idx = i;

        box.appendChild(hook);
        stage.appendChild(box);

        // Observe this box for lazy loading
        _observer.observe(box);
    }

    _count(num);
    _up('Ready (Lazy Loading Enabled)', 'playing');
}

window._initHook = function (hid, vid, src, idx) {
    const el = document.getElementById(hid);
    if (el) {
        el.className = 'slot-placeholder';
        el.innerHTML = `<span>Loading Slot ${idx + 1}...</span>`;
    }

    // Sanitize origin: Ensure no trailing slash for the handshake
    const appOrigin = window.location.origin;
    console.log(`[MultiTube Pro] Slot ${idx} Init | Origin: ${appOrigin}`);

    if (_ready && typeof YT !== 'undefined' && YT.Player) {
        try {
            const player = new YT.Player(hid, {
                height: '100%', width: '100%', videoId: vid,
                host: 'https://www.youtube-nocookie.com',
                playerVars: {
                    'autoplay': 0,
                    'mute': 0,
                    'controls': 1,
                    'rel': 0,
                    'enablejsapi': 1,
                    'origin': appOrigin,
                    'widget_referrer': appOrigin,
                    'playlist': vid
                },
                events: {
                    'onReady': (event) => {
                        console.log(`[MultiTube Pro] Slot ${idx} Ready (${vid})`);
                    },
                    'onError': (e) => {
                        console.warn(`[MultiTube Pro] Slot ${idx} API Error:`, e.data);
                        _fallback(hid, vid, appOrigin);
                    }
                }
            });
            _p.push(player);
        } catch (e) {
            console.error('[MultiTube Pro] Constructor Error, falling back:', e);
            _fallback(hid, vid, appOrigin);
        }
    } else {
        _fallback(hid, vid, appOrigin);
    }
}

function _fallback(hid, vid, src) {
    const el = document.getElementById(hid);
    if (!el) return;
    const ifr = document.createElement('iframe');
    const appOrigin = window.location.origin;
    ifr.src = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=0&mute=0&enablejsapi=1&origin=${encodeURIComponent(appOrigin)}`;
    ifr.allow = "autoplay; encrypted-media; picture-in-picture";
    ifr.className = "fallback-iframe";
    el.innerHTML = '';
    el.className = '';
    el.appendChild(ifr);
}

// Side-effects: Visibility & Focus
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('[MultiTube Pro] Tab hidden - Pausing all active players for compliance');
        _p.forEach(p => {
            try {
                if (p && typeof p.pauseVideo === 'function') p.pauseVideo();
            } catch (e) { }
        });
        document.querySelectorAll('iframe').forEach(i => {
            try { i.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); } catch (e) { }
        });
    }
});

// Main Loop: Bind UI events
document.addEventListener('DOMContentLoaded', () => {
    const gBtn = document.getElementById('generateBtn');
    const rBtn = document.getElementById('hardResetBtn');
    const fBtn = document.getElementById('forcePlayAllBtn');
    const uIn = document.getElementById('videoUrls');
    const sIn = document.getElementById('screenCount');
    const stage = document.getElementById('displayArea');

    if (!gBtn) return;

    gBtn.addEventListener('click', () => {
        const raw = uIn.value.trim();
        const count = parseInt(sIn.value) || 1;
        if (!raw) return alert('Please enter at least one YouTube URL.');
        const list = raw.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 0);

        const check = window.MultiTubeApp.checkPermission(list.length, count);
        if (!check.allowed) {
            alert(check.error);
            window.location.href = 'subscription.html';
            return;
        }

        _start(list, count, stage);
    });

    rBtn.addEventListener('click', () => {
        if (confirm('Clear all screens and reset?')) {
            _p.forEach(p => { try { p.destroy(); } catch (e) { } });
            _p = [];
            _loadQueue = [];
            _loadInProgress = false;
            stage.innerHTML = `<div class="empty-state"><p>Your multi-screen view will appear here.</p></div>`;
            uIn.value = '';
            sIn.value = '4';
            _count(0);
            _up('Ready', 'playing');
        }
    });

    fBtn.addEventListener('click', () => {
        document.querySelectorAll('iframe').forEach(i => {
            try { i.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*'); } catch (e) { }
        });
        _p.forEach(p => { try { p.playVideo(); } catch (e) { } });
    });
});
