console.log('[MultiTube v4.0] System Booting...');

let _p = []; // Obfuscated players list
let _ready = false;

window.onYouTubeIframeAPIReady = function () {
    _ready = true;
    console.log('[MultiTube v4.0] Core API: READY');
    _up('API Ready', 'playing');
};

function _up(m, t) {
    const el = document.getElementById('overallStatus');
    if (el) { el.textContent = m; el.className = t || ''; }
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

    gBtn.addEventListener('click', () => {
        const raw = uIn.value.trim();
        const count = parseInt(sIn.value) || 1;
        if (!raw) return alert('Input required');

        const list = raw.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 0);
        _start(list, count);
    });

    rBtn.addEventListener('click', () => window.location.reload(true));

    fBtn.addEventListener('click', () => {
        console.log('[MultiTube v4.0] Emergency Start Override');
        document.querySelectorAll('iframe').forEach(i => {
            try { i.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*'); } catch (e) { }
        });
        _p.forEach(p => { try { p.playVideo(); } catch (e) { } });
    });

    function _getId(u) {
        const m = u.match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
        return m ? m[1] : (u.length === 11 ? u : '');
    }

    function _start(urls, num) {
        console.log('[MultiTube v4.0] Execution Engine Starting...');
        _up('Processing...', '');

        // Wipe clean
        _p.forEach(p => { try { p.destroy(); } catch (e) { } });
        _p = [];
        stage.innerHTML = '';
        _count(0);

        const ids = urls.map(u => _getId(u)).filter(i => i !== '');
        if (ids.length === 0) return alert('No valid IDs');

        const host = window.location.protocol + '//' + window.location.host;

        for (let i = 0; i < num; i++) {
            const vid = ids[i % ids.length];

            // OBfuscated naming to prevent extension interference
            const box = document.createElement('div');
            box.className = 'item-box';
            if (urls[i % urls.length].includes('/shorts/')) box.classList.add('short');

            const hookId = `v4-node-${i}`;
            const hook = document.createElement('div');
            hook.id = hookId;
            hook.innerHTML = `<center style="margin-top:20px;color:#333">Slot ${i + 1}</center>`;

            box.appendChild(hook);
            stage.appendChild(box);

            setTimeout(() => {
                _initHook(hookId, vid, host, i);
            }, i * 200);
        }
        _count(num);
        _up('Screens Generated', 'playing');
    }

    function _initHook(hid, vid, src, idx) {
        if (_ready && typeof YT !== 'undefined') {
            try {
                const player = new YT.Player(hid, {
                    height: '100%', width: '100%', videoId: vid,
                    playerVars: {
                        'autoplay': 1, 'mute': 1, 'controls': 1, 'rel': 0,
                        'enablejsapi': 1, 'origin': src, 'playlist': vid
                    },
                    events: {
                        'onReady': () => console.log(`[MultiTube v4.0] Slot ${idx} Ready`),
                        'onError': () => _fallback(hid, vid, src)
                    }
                });
                _p.push(player);
            } catch (e) { _fallback(hid, vid, src); }
        } else { _fallback(hid, vid, src); }
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
