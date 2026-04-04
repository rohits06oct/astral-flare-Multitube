/**
 * YoutubeMulti Pro - Execution Engine
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
            const info = entry.target.dataset.mediaInfo;
            const idx = entry.target.dataset.idx;

            if (hid && !_loadQueue.some(q => q.hid === hid)) {
                _loadQueue.push({ hid, info, idx });
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
    _initHook(next.hid, next.info, null, next.idx);

    setTimeout(() => {
        _loadInProgress = false;
        _processQueue();
    }, 100); // Increased to 2s stagger to ensure security handshakes complete
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

function _getMediaInfo(u) {
    // YouTube
    let m = u.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    if (m || u.length === 11) return { id: m ? m[1] : u, platform: 'youtube', type: u.includes('/shorts/') ? 'short' : 'long', url: u };

    // TikTok
    m = u.match(/tiktok\.com\/.*video\/(\d+)/) || u.match(/tiktok\.com\/t\/(\w+)/);
    if (m) return { id: m[1], platform: 'tiktok', type: 'short', url: u };

    // Instagram
    m = u.match(/instagram\.com\/(?:p|reels|reel)\/([a-zA-Z0-9_-]+)/);
    if (m) return { id: m[1], platform: 'instagram', type: 'short', url: u };

    // Facebook
    if (u.includes('facebook.com')) return { id: encodeURIComponent(u), platform: 'facebook', type: 'long', url: u };

    // Vimeo
    m = u.match(/vimeo\.com\/(\d+)/);
    if (m) return { id: m[1], platform: 'vimeo', type: 'long', url: u };

    // Dailymotion
    m = u.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
    if (m) return { id: m[1], platform: 'dailymotion', type: 'long', url: u };

    // Twitch
    m = u.match(/twitch\.tv\/([a-zA-Z0-9_-]+)/);
    if (m) {
        const isVideo = u.includes('/videos/');
        return { id: m[1], platform: 'twitch', type: 'long', url: u, subType: isVideo ? 'video' : 'channel' };
    }

    // Snapchat
    m = u.match(/snapchat\.com\/.*spotlight\/([a-zA-Z0-9_-]+)/);
    if (m) return { id: m[1], platform: 'snapchat', type: 'short', url: u };

    // Moj
    if (u.includes('mojapp.in')) return { id: encodeURIComponent(u), platform: 'moj', type: 'short', url: u };

    return null;
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

    const items = urls.map(u => _getMediaInfo(u)).filter(item => item !== null);
    if (items.length === 0) return alert('No valid Video URLs found in your input. Supported: YouTube, TikTok, FB, IG, Vimeo, etc.');

    for (let i = 0; i < num; i++) {
        const info = items[i % items.length];
        const box = document.createElement('div');
        box.className = 'item-box';
        if (info.type === 'short') box.classList.add('short');

        const hookId = `slot-node-${i}`;
        const hook = document.createElement('div');
        hook.id = hookId;
        hook.className = 'slot-placeholder';
        hook.innerHTML = `<span>Waiting for Viewport...</span>`;

        // Data for Observer
        box.dataset.hookId = hookId;
        box.dataset.mediaInfo = JSON.stringify(info);
        box.dataset.idx = i;

        box.appendChild(hook);
        stage.appendChild(box);

        // Observe this box for lazy loading
        _observer.observe(box);
    }

    _count(num);
    _up('Ready (Multi-Platform Enabled)', 'playing');
}

window._initHook = function (hid, infoRaw, _, idx) {
    const info = typeof infoRaw === 'string' ? JSON.parse(infoRaw) : infoRaw;
    const el = document.getElementById(hid);
    if (el) {
        el.className = 'slot-placeholder';
        el.innerHTML = `<span>Loading ${info.platform} ${idx + 1}...</span>`;
    }

    const appOrigin = window.location.origin;
    const hostname = window.location.hostname;

    if (info.platform === 'youtube') {
        if (_ready && typeof YT !== 'undefined' && YT.Player) {
            try {
                const player = new YT.Player(hid, {
                    height: '100%', width: '100%', videoId: info.id,
                    host: 'https://www.youtube.com',
                    playerVars: {
                        'autoplay': 1, 'mute': 1, 'controls': 1, 'rel': 0, 'enablejsapi': 1,
                        'origin': appOrigin, 'widget_referrer': appOrigin, 'playlist': info.id
                    },
                    events: {
                        'onReady': () => console.log(`[MultiTube Pro] Slot ${idx} Ready (YT:${info.id})`),
                        'onError': () => _fallback(hid, info)
                    }
                });
                _p.push(player);
                return;
            } catch (e) { console.warn('YT API Error:', e); }
        }
    }

    // Non-YouTube or YT Fallback
    _fallback(hid, info);
}

function _fallback(hid, info) {
    const el = document.getElementById(hid);
    if (!el) return;
    const ifr = document.createElement('iframe');
    const appOrigin = window.location.origin;
    const hostname = window.location.hostname;
    let embedSrc = '';

    switch (info.platform) {
        case 'youtube':
            embedSrc = `https://www.youtube.com/embed/${info.id}?autoplay=1&mute=1&enablejsapi=1&origin=${encodeURIComponent(appOrigin)}`;
            break;
        case 'tiktok':
            embedSrc = `https://www.tiktok.com/embed/v2/${info.id}`; // TikTok doesn't easily support autoplay via URL
            break;
        case 'instagram':
            embedSrc = `https://www.instagram.com/reels/${info.id}/embed`;
            break;
        case 'facebook':
            embedSrc = `https://www.facebook.com/plugins/video.php?href=${info.id}&show_text=0&autoplay=1&mute=1`;
            break;
        case 'vimeo':
            embedSrc = `https://player.vimeo.com/video/${info.id}?autoplay=1&muted=1`;
            break;
        case 'dailymotion':
            embedSrc = `https://www.dailymotion.com/embed/video/${info.id}?autoplay=1&mute=1`;
            break;
        case 'twitch':
            const typeParam = info.subType === 'video' ? `video=${info.id[1]}` : `channel=${info.id}`;
            embedSrc = `https://player.twitch.tv/?${typeParam}&parent=${hostname}&autoplay=true&muted=true`;
            break;
        case 'snapchat':
            embedSrc = `https://www.snapchat.com/embed/spotlight/${info.id}`;
            break;
        case 'moj':
            embedSrc = decodeURIComponent(info.id); // Direct if possible
            break;
        default:
            embedSrc = info.url;
    }

    ifr.src = embedSrc;
    ifr.allow = "autoplay; encrypted-media; picture-in-picture; web-share";
    ifr.allowFullscreen = true;
    ifr.className = "fallback-iframe";
    el.innerHTML = '';
    el.className = '';
    el.appendChild(ifr);
}

// Side-effects: Visibility & Focus
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('[YoutubeMulti Pro] Tab hidden - Pausing players via API');
        _p.forEach(p => {
            try {
                if (p && typeof p.pauseVideo === 'function' && p.getPlayerState) {
                    p.pauseVideo();
                }
            } catch (e) { }
        });
        // We no longer use wildcard postMessage(*) to avoid origin mismatch errors.
        // Compliance is handled strictly by the tracked API players.
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
        if (!raw) return alert('Please enter at least one URL (YouTube, Facebook, TikTok, etc.).');
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
        _p.forEach(p => {
            try {
                if (p && typeof p.playVideo === 'function' && p.getPlayerState) {
                    p.playVideo();
                }
            } catch (e) { }
        });
    });
});
