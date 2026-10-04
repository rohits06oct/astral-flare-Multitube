/**
 * Audio Engine for Car Crush (WeCrash)
 * Rich procedural synthesizer using Web Audio API:
 * - Speed wind whoosh & aerodynamic rush
 * - Engine acceleration & throaty exhaust
 * - Turbo spool whistle & gear shift pops
 * - Tire screech / skid friction
 * - Chain jangle & high tension strain
 * - Emergency car horn honk
 * - Hydraulic compressor pump whine
 * - Multilayered violent metal crusher crunch (deep sub-bass, metallic tear, glass scatter)
 * - Pneumatic steam release blowout
 * - Level victory fanfare
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;

        // Continuous sound nodes
        this.engineOsc = null;
        this.engineGain = null;
        this.engineFilter = null;

        this.windNode = null;
        this.windGain = null;
        this.windFilter = null;

        this.tireNode = null;
        this.tireGain = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    pauseAudio() {
        if (this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
        }
    }

    resumeAudio() {
        if (this.ctx && this.ctx.state === 'suspended' && !this.muted) {
            this.ctx.resume();
        }
    }

    setMuted(muted) {
        this.muted = muted;
        if (muted) {
            if (this.engineGain) this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
            if (this.windGain) this.windGain.gain.setValueAtTime(0, this.ctx.currentTime);
            if (this.tireGain) this.tireGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    // 1. Engine rev & exhaust rumble
    startEngine(baseSpeed = 20) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            if (!this.engineOsc) {
                this.engineOsc = this.ctx.createOscillator();
                this.engineGain = this.ctx.createGain();
                this.engineFilter = this.ctx.createBiquadFilter();

                this.engineOsc.type = 'sawtooth';
                this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime);

                this.engineFilter.type = 'lowpass';
                this.engineFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

                this.engineGain.gain.setValueAtTime(0.09, this.ctx.currentTime);

                this.engineOsc.connect(this.engineFilter);
                this.engineFilter.connect(this.engineGain);
                this.engineGain.connect(this.ctx.destination);

                this.engineOsc.start();
            }

            // Also start background aerodynamic wind rush
            this.startWindRush();
        } catch (e) {
            console.warn('Audio note:', e);
        }
    }

    // 2. Aerodynamic wind rush that scales with car speed
    startWindRush() {
        if (this.muted || this.windNode || !this.ctx) return;

        try {
            const bufferSize = this.ctx.sampleRate * 2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1; // White noise
            }

            this.windNode = this.ctx.createBufferSource();
            this.windNode.buffer = buffer;
            this.windNode.loop = true;

            this.windFilter = this.ctx.createBiquadFilter();
            this.windFilter.type = 'bandpass';
            this.windFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
            this.windFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

            this.windGain = this.ctx.createGain();
            this.windGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

            this.windNode.connect(this.windFilter);
            this.windFilter.connect(this.windGain);
            this.windGain.connect(this.ctx.destination);

            this.windNode.start();
        } catch (e) {}
    }

    updateSpeedAudio(speedRatio) {
        if (this.muted || !this.ctx) return;

        const now = this.ctx.currentTime;
        const normSpeed = Math.min(Math.max(speedRatio, 0.2), 2.2);

        // Scale engine pitch & filter cutoff
        if (this.engineOsc && this.engineFilter) {
            const targetFreq = 42 + normSpeed * 75;
            this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.06);
            this.engineFilter.frequency.setTargetAtTime(180 + normSpeed * 280, now, 0.08);
        }

        // Scale wind whoosh volume and pitch
        if (this.windGain && this.windFilter) {
            const targetWindVol = 0.02 + normSpeed * 0.12;
            const targetWindFreq = 300 + normSpeed * 650;
            this.windGain.gain.setTargetAtTime(targetWindVol, now, 0.08);
            this.windFilter.frequency.setTargetAtTime(targetWindFreq, now, 0.08);
        }
    }

    stopEngine() {
        if (this.ctx) {
            const now = this.ctx.currentTime;
            if (this.engineGain) {
                this.engineGain.gain.setTargetAtTime(0, now, 0.1);
            }
            if (this.windGain) {
                this.windGain.gain.setTargetAtTime(0, now, 0.12);
            }

            setTimeout(() => {
                if (this.engineOsc) {
                    try { this.engineOsc.stop(); this.engineOsc.disconnect(); } catch (e) {}
                    this.engineOsc = null;
                }
                if (this.windNode) {
                    try { this.windNode.stop(); this.windNode.disconnect(); } catch (e) {}
                    this.windNode = null;
                }
            }, 160);
        }
    }

    // 3. Tire skid / screech sound (when cornering or braking at chain)
    playTireSkid(intensity = 0.5) {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        try {
            const now = this.ctx.currentTime;
            const bufferSize = Math.floor(this.ctx.sampleRate * 0.45);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1400 + Math.random() * 400, now);
            filter.Q.setValueAtTime(6.0, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.18 * intensity, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {}
    }

    // 4. Emergency Car Horn Honk (right before striking the chain!)
    playCarHorn() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Dual-tone automotive horn (F & A flat, ~350Hz & 440Hz)
        [370, 440].forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.38);
        });
    }

    // 5. Metallic chain strike & jangle
    playChainHit() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // Metallic cluster clang
        const freqs = [420, 680, 1150, 1680, 2300, 3100];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq + Math.random() * 80, now);
            gain.gain.setValueAtTime(0.2 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + idx * 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.55);
        });
    }

    // 6. Windshield glass shatter
    playGlassShatter() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.09));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3400, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
    }

    // 7. Hydraulic Siren / Motor Whine
    playWarningSiren() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';

        osc.frequency.setValueAtTime(650, now);
        osc.frequency.linearRampToValueAtTime(1050, now + 0.16);
        osc.frequency.linearRampToValueAtTime(650, now + 0.32);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
    }

    // 8. Massive multilayered crusher crunch!
    playCrusherImpact() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Layer 1: Sub-bass shockwave
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(130, now);
        subOsc.frequency.exponentialRampToValueAtTime(22, now + 0.75);
        subGain.gain.setValueAtTime(0.85, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
        subOsc.connect(subGain);
        subGain.connect(this.ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.9);

        // Layer 2: Heavy metallic distortion crunch
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.8);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
        }
        const crunchSource = this.ctx.createBufferSource();
        crunchSource.buffer = buffer;

        const crunchFilter = this.ctx.createBiquadFilter();
        crunchFilter.type = 'bandpass';
        crunchFilter.frequency.setValueAtTime(420, now);
        crunchFilter.Q.setValueAtTime(1.6, now);

        const crunchGain = this.ctx.createGain();
        crunchGain.gain.setValueAtTime(0.65, now);
        crunchGain.gain.exponentialRampToValueAtTime(0.008, now + 0.7);

        crunchSource.connect(crunchFilter);
        crunchFilter.connect(crunchGain);
        crunchGain.connect(this.ctx.destination);
        crunchSource.start(now);

        // Layer 3: Buckling metal screech
        const screech = this.ctx.createOscillator();
        const screechGain = this.ctx.createGain();
        screech.type = 'sawtooth';
        screech.frequency.setValueAtTime(360, now);
        screech.frequency.exponentialRampToValueAtTime(75, now + 0.6);
        screechGain.gain.setValueAtTime(0.3, now);
        screechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        screech.connect(screechGain);
        screechGain.connect(this.ctx.destination);
        screech.start(now);
        screech.stop(now + 0.7);
    }

    // 9. Pneumatic steam release blowout
    playSteamHiss() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.65);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.22));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1900, now);
        filter.Q.setValueAtTime(2.2, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    // 10. Pass success chime
    playPassSuccess() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.5);
        });
    }

    // 11. Level Victory Fanfare (Plays between auto-running levels)
    playLevelVictory() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const chordNotes = [
            { f: 523.25, t: 0 },
            { f: 659.25, t: 0.1 },
            { f: 783.99, t: 0.2 },
            { f: 1046.50, t: 0.3 }
        ];

        chordNotes.forEach(item => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, now + item.t);
            gain.gain.setValueAtTime(0.22, now + item.t);
            gain.gain.exponentialRampToValueAtTime(0.001, now + item.t + 0.65);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + item.t);
            osc.stop(now + item.t + 0.7);
        });
    }
}

window.soundEngine = new SoundEngine();
