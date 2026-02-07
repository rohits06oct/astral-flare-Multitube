/**
 * MultiTube Pro - Execution Engine
 */

let _p = []; // Active players
let _ready = false;

window.onYouTubeIframeAPIReady = function () {
    _ready = true;
    _up('API Ready', 'playing');
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

document.addEventListener('DOMContentLoaded', () => {
    const gBtn = document.getElementById('generateBtn');
    const rBtn = document.getElementById('hardResetBtn');
    const fBtn = document.getElementById('forcePlayAllBtn');
    const uIn = document.getElementById('videoUrls');
    const sIn = document.getElementById('screenCount');
    const stage = document.getElementById('displayArea');

    if (!gBtn) return; // Not on home page

    gBtn.addEventListener('click', () => {
        const raw = uIn.value.trim();
        const count = parseInt(sIn.value) || 1;

        if (!raw) return alert('Please enter at least one YouTube URL.');

        const list = raw.split(/[\n,;]+/).map(s => s.trim()).filter(s => s.length > 0);

        // Subscription Limit Enforcement
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
            window.location.reload();
        }
    });

    fBtn.addEventListener('click', () => {
        document.querySelectorAll('iframe').forEach(i => {
            try { i.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*'); } catch (e) { }
        });
        _p.forEach(p => { try { p.playVideo(); } catch (e) { } });
    });

    function _getId(u) {
        const m = u.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : (u.length === 11 ? u : '');
    }

    function _start(urls, num, stage) {
        _up('Generating Grid...', '');

        // Cleanup old players
        _p.forEach(p => { try { p.destroy(); } catch (e) { } });
        _p = [];
        stage.innerHTML = '';
        _count(0);

        const ids = urls.map(u => ({ id: _getId(u), original: u })).filter(item => item.id !== '');
        if (ids.length === 0) return alert('No valid YouTube IDs found in your input.');

        const host = window.location.protocol + '//' + window.location.host;

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
            hook.innerHTML = `<div style="display:flex; height:100%; align-items:center; justify-content:center; color:var(--text-dim); font-size:0.8rem;">Loading Slot ${i + 1}...</div>`;

            box.appendChild(hook);
            stage.appendChild(box);

            // Staggered initialization for better performance
            setTimeout(() => {
                _initHook(hookId, vid, host, i);
            }, i * 150);
        }

        _count(num);
        _up('Active', 'playing');
    }

    function _initHook(hid, vid, src, idx) {
        if (_ready && typeof YT !== 'undefined' && YT.Player) {
            try {
                const player = new YT.Player(hid, {
                    height: '100%', width: '100%', videoId: vid,
                    playerVars: {
                        'autoplay': 1, 'mute': 1, 'controls': 1, 'rel': 0,
                        'enablejsapi': 1, 'origin': src, 'playlist': vid
                    },
                    events: {
                        'onReady': (event) => {
                            console.log(`[MultiTube Pro] Slot ${idx} Ready`);
                            event.target.playVideo();
                        },
                        'onError': () => _fallback(hid, vid, src)
                    }
                });
                _p.push(player);
            } catch (e) { _fallback(hid, vid, src); }
        } else {
            _fallback(hid, vid, src);
        }
    }

    function _fallback(hid, vid, src) {
        const el = document.getElementById(hid);
        if (!el) return;
        const ifr = document.createElement('iframe');
        ifr.src = `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&enablejsapi=1&origin=${encodeURIComponent(src)}&playlist=${vid}`;
        ifr.allow = "autoplay; encrypted-media";
        ifr.style.border = "none";
        el.innerHTML = '';
        el.appendChild(ifr);
    }
});
