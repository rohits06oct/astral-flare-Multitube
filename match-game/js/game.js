/**
 * ============================================================================
 * MATCHING GAME ENGINE
 * Handles drag/click connections, order enforcement, audio, confetti & modals
 * ============================================================================
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API - Zero External Dependencies) ---
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.compressor = null;
      this.masterGain = null;
      this.noiseBuffer = null;
      this.drawingNodes = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          // Dynamics compressor prevents distortion and ensures powerful, clean loud audio
          this.compressor = this.ctx.createDynamicsCompressor();
          this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
          this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
          this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
          this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
          this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

          // Much louder volume (0.90 master gain)
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);

          this.compressor.connect(this.masterGain);
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    getDestination() {
      return this.compressor || (this.ctx ? this.ctx.destination : null);
    }

    getNoiseBuffer() {
      if (this.noiseBuffer) return this.noiseBuffer;
      if (!this.ctx) return null;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
      return buffer;
    }

    // 1. Crisp, loud tile tap sound on EVERY item click
    playTap() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const dest = this.getDestination();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.055);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.85, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.06);
    }

    playSelect() {
      this.playTap();
    }

    // 2. Line drawing sound - continuous swoosh while dragging
    startDrawingSound() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.drawingNodes) return;

      const now = this.ctx.currentTime;
      const dest = this.getDestination();

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(3, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.40, now + 0.04);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(dest);

      osc.start(now);
      this.drawingNodes = { osc, oscGain, filter };
    }

    updateDrawingSound(dist) {
      if (!this.drawingNodes || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = 420 + Math.min(dist * 1.5, 480);
      try {
        this.drawingNodes.osc.frequency.cancelScheduledValues(now);
        this.drawingNodes.osc.frequency.linearRampToValueAtTime(freq, now + 0.04);
      } catch (e) { }
    }

    stopDrawingSound() {
      if (!this.drawingNodes || !this.ctx) return;
      const { osc, oscGain } = this.drawingNodes;
      const now = this.ctx.currentTime;
      try {
        oscGain.gain.cancelScheduledValues(now);
        oscGain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
            oscGain.disconnect();
          } catch (e) { }
        }, 50);
      } catch (e) { }
      this.drawingNodes = null;
    }

    // 3. Try Again / Wrong Match sound
    playTryAgain() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const dest = this.getDestination();

      // Two-tone descending "Uh-oh / Try Again" boing
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(360, now);
      osc1.frequency.linearRampToValueAtTime(290, now + 0.12);
      gain1.gain.setValueAtTime(0.75, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(now);
      osc1.stop(now + 0.15);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(260, now + 0.15);
      osc2.frequency.linearRampToValueAtTime(160, now + 0.36);
      gain2.gain.setValueAtTime(0.80, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.005, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.4);
    }

    playError() {
      this.playTryAgain();
    }

    // 4. Clapping sound when user matches correct tiles
    playClapping() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const dest = this.getDestination();
      const noiseBuf = this.getNoiseBuffer();

      // Synthesize 10 rapid handclaps
      const clapTimes = [0, 0.07, 0.14, 0.20, 0.26, 0.32, 0.39, 0.46, 0.54, 0.62];
      clapTimes.forEach(delay => {
        const t = now + delay;
        if (noiseBuf) {
          const src = this.ctx.createBufferSource();
          src.buffer = noiseBuf;
          const bpf = this.ctx.createBiquadFilter();
          bpf.type = 'bandpass';
          bpf.frequency.setValueAtTime(1150 + (Math.random() * 200 - 100), t);
          bpf.Q.setValueAtTime(2.8, t);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.75, t + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.005, t + 0.045);

          src.connect(bpf);
          bpf.connect(gain);
          gain.connect(dest);

          src.start(t);
          src.stop(t + 0.05);
        }
      });

      // Joyful match chime chord arpeggio
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const t = now + (idx * 0.07);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.75, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.36);
      });
    }

    playMatch() {
      this.playClapping();
    }

    // 5. Firecrackers celebration sound when user wins the match
    playFirecrackers() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const dest = this.getDestination();
      const noiseBuf = this.getNoiseBuffer();

      // Rocket whistle launching upward
      const whistleOsc = this.ctx.createOscillator();
      const whistleGain = this.ctx.createGain();
      whistleOsc.type = 'triangle';
      whistleOsc.frequency.setValueAtTime(320, now);
      whistleOsc.frequency.exponentialRampToValueAtTime(2500, now + 0.38);
      whistleGain.gain.setValueAtTime(0.01, now);
      whistleGain.gain.linearRampToValueAtTime(0.70, now + 0.22);
      whistleGain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      whistleOsc.connect(whistleGain);
      whistleGain.connect(dest);
      whistleOsc.start(now);
      whistleOsc.stop(now + 0.41);

      // Explosive Thuds / Booms
      [0.40, 0.85, 1.35].forEach((boomTime, i) => {
        const t = now + boomTime;
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(150 - (i * 20), t);
        subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
        subGain.gain.setValueAtTime(0.90, t);
        subGain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
        subOsc.connect(subGain);
        subGain.connect(dest);
        subOsc.start(t);
        subOsc.stop(t + 0.46);

        if (noiseBuf) {
          const boomSrc = this.ctx.createBufferSource();
          boomSrc.buffer = noiseBuf;
          const lpf = this.ctx.createBiquadFilter();
          lpf.type = 'lowpass';
          lpf.frequency.setValueAtTime(380, t);
          lpf.frequency.linearRampToValueAtTime(80, t + 0.4);
          const boomNoiseGain = this.ctx.createGain();
          boomNoiseGain.gain.setValueAtTime(0.90, t);
          boomNoiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
          boomSrc.connect(lpf);
          lpf.connect(boomNoiseGain);
          boomNoiseGain.connect(dest);
          boomSrc.start(t);
          boomSrc.stop(t + 0.46);
        }
      });

      // String of firecracker crackles & pops (30 rapid bursts)
      if (noiseBuf) {
        for (let c = 0; c < 30; c++) {
          const crackleTime = now + 0.42 + (Math.random() * 1.6);
          const crackleSrc = this.ctx.createBufferSource();
          crackleSrc.buffer = noiseBuf;
          const hpf = this.ctx.createBiquadFilter();
          hpf.type = 'highpass';
          hpf.frequency.setValueAtTime(1800 + Math.random() * 1400, crackleTime);
          const crackleGain = this.ctx.createGain();
          crackleGain.gain.setValueAtTime(0.60 + Math.random() * 0.35, crackleTime);
          crackleGain.gain.exponentialRampToValueAtTime(0.01, crackleTime + 0.025);
          crackleSrc.connect(hpf);
          hpf.connect(crackleGain);
          crackleGain.connect(dest);
          crackleSrc.start(crackleTime);
          crackleSrc.stop(crackleTime + 0.03);
        }
      }

      // Victory fanfare brass
      const fanfareNotes = [
        { f: 523.25, t: 0.42, d: 0.16 }, // C5
        { f: 659.25, t: 0.58, d: 0.16 }, // E5
        { f: 783.99, t: 0.74, d: 0.22 }, // G5
        { f: 1046.50, t: 0.96, d: 0.55 }, // C6
        { f: 880.00, t: 1.55, d: 0.18 }, // A5
        { f: 1046.50, t: 1.75, d: 0.70 } // C6 Victory!
      ];
      fanfareNotes.forEach(n => {
        const t = now + n.t;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.85, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, t + n.d);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + n.d + 0.05);
      });
    }

    playVictory() {
      this.playFirecrackers();
    }

    // 6. Game Loader Sound Effect (Ascending synth chimes, swoosh & completion chime over 4-5s)
    startLoadingSound(durationMs = 4500) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const dest = this.getDestination();

      // Step count across duration (every ~0.3s)
      const stepCount = 14;
      const interval = (durationMs / 1000) / stepCount;
      const scale = [
        261.63, // C4
        293.66, // D4
        329.63, // E4
        392.00, // G4
        440.00, // A4
        523.25, // C5
        587.33, // D5
        659.25, // E5
        783.99, // G5
        880.00, // A5
        1046.50, // C6
        1174.66, // D6
        1318.51, // E6
        1567.98  // G6
      ];

      for (let i = 0; i < stepCount; i++) {
        const t = now + (i * interval);
        const noteFreq = scale[i % scale.length];

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(noteFreq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.65, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(t);
        osc.stop(t + 0.30);
      }

      // Rising swoosh near completion (at ~80% of loading time)
      const finishTime = now + (durationMs / 1000) - 0.9;
      if (finishTime > now) {
        const swooshOsc = this.ctx.createOscillator();
        const swooshGain = this.ctx.createGain();
        swooshOsc.type = 'sine';
        swooshOsc.frequency.setValueAtTime(380, finishTime);
        swooshOsc.frequency.exponentialRampToValueAtTime(1400, finishTime + 0.75);

        swooshGain.gain.setValueAtTime(0.001, finishTime);
        swooshGain.gain.linearRampToValueAtTime(0.55, finishTime + 0.4);
        swooshGain.gain.exponentialRampToValueAtTime(0.001, finishTime + 0.8);

        swooshOsc.connect(swooshGain);
        swooshGain.connect(dest);
        swooshOsc.start(finishTime);
        swooshOsc.stop(finishTime + 0.82);
      }

      // Final celebratory completion chime
      const doneTime = now + (durationMs / 1000);
      [783.99, 1046.50, 1318.51].forEach((f, idx) => {
        const dt = doneTime + (idx * 0.06);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, dt);
        gain.gain.setValueAtTime(0.001, dt);
        gain.gain.linearRampToValueAtTime(0.80, dt + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, dt + 0.42);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(dt);
        osc.stop(dt + 0.45);
      });
    }
  }

  // --- CONFETTI PARTICLE SYSTEM ---
  class ConfettiSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    explode(count = 65) {
      this.resize();
      const colors = ['#5ee432', '#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#9b59b6'];
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.7) * 16,
          size: Math.random() * 8 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 15,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.01
        });
      }
      if (!this.animId) {
        this.loop();
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles = this.particles.filter(p => p.alpha > 0);

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.ctx.restore();
      });

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // --- CORE GAME APPLICATION ---
  class MatchingGame {
    constructor() {
      this.currentLevel = 1;
      this.maxLevels = 16;
      this.levelData = null;
      this.connectedPairs = [];
      this.currentOrderIndex = 0;
      this.selectedLeftCard = null;

      // Drag connection state
      this.isDragging = false;
      this.dragStartCard = null;
      this.dragTempLine = null;

      // Audio & Confetti
      this.sound = new SoundManager();
      this.confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));

      // DOM Elements
      this.container = document.querySelector('.game-container');
      this.levelSelectScreen = document.getElementById('level-select-screen');
      this.gameplayView = document.getElementById('gameplay-view');
      this.levelCardsGrid = document.getElementById('level-cards-grid');
      this.playArea = document.querySelector('.game-play-area');
      this.leftColumn = document.getElementById('left-column');
      this.rightColumn = document.getElementById('right-column');
      this.svgOverlay = document.getElementById('connection-svg');
      this.levelBadgeText = document.getElementById('level-badge-text');
      this.orderIndicator = document.getElementById('order-indicator');
      this.toastEl = document.getElementById('toast-msg');

      // Modals
      this.victoryModal = document.getElementById('victory-modal');
      this.pauseModal = document.getElementById('pause-modal');
      this.customizerModal = document.getElementById('customizer-modal');

      this.initEvents();
      this.renderLevelSelectCards();

      // Show 3D Level Selection Screen before actual level starts
      this.showLevelSelectScreen();

      // Initial Game Loader with gametanieshak floating style (3 sec)
      this.triggerGameLoader(3000, () => {
        this.showLevelSelectScreen();
      });
    }

    // --- GAME LOADER ("gametanieshak" in floating style + loading sound) ---
    triggerGameLoader(durationMs = 3000, onComplete = null) {
      const screen = document.getElementById('game-loader-screen');
      const bar = document.getElementById('loader-progress-bar');
      const percentNum = document.getElementById('loader-percent-num');
      const statusText = document.getElementById('loader-status-text');

      if (!screen || !bar) {
        if (onComplete) onComplete();
        return;
      }

      // Reset and display loader screen
      screen.classList.remove('fade-out');
      screen.classList.add('active');
      bar.style.width = '0%';
      if (percentNum) percentNum.textContent = '0%';

      const statusPhrases = [
        'Matching Words & Puzzles...',
        'Preparing Level Challenge...',
        'Ready to Play!'
      ];

      // Play loading sound effect
      this.sound.startLoadingSound(durationMs);

      const startTime = performance.now();

      const updateProgress = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const pct = Math.floor(progress * 100);

        bar.style.width = `${pct}%`;
        if (percentNum) percentNum.textContent = `${pct}%`;

        if (statusText) {
          const phraseIdx = Math.min(Math.floor(progress * statusPhrases.length), statusPhrases.length - 1);
          statusText.textContent = statusPhrases[phraseIdx];
        }

        if (progress < 1) {
          requestAnimationFrame(updateProgress);
        } else {
          // Finished loading (4.6 seconds)
          setTimeout(() => {
            screen.classList.add('fade-out');
            if (onComplete) onComplete();
            setTimeout(() => {
              screen.classList.remove('active');
            }, 520);
          }, 200);
        }
      };

      requestAnimationFrame(updateProgress);
    }

    initEvents() {
      // Unlock Web Audio API on first user gesture
      const unlockAudio = () => {
        this.sound.init();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('click', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });

      // Pause & Restart Header Buttons
      document.getElementById('btn-pause').addEventListener('click', () => this.openPauseModal());
      document.getElementById('btn-restart').addEventListener('click', () => {
        const btn = document.getElementById('btn-restart');
        btn.style.transform = 'rotate(360deg)';
        btn.style.transition = 'transform 0.4s ease';
        setTimeout(() => {
          btn.style.transform = '';
          btn.style.transition = '';
        }, 400);
        this.restartLevel();
      });

      // Close Game (Fullscreen / Direct / Modal) Header Button
      const btnCloseGame = document.getElementById('btn-close-game');
      if (btnCloseGame) {
        btnCloseGame.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleCloseGame();
        });
      }

      // Escape key to exit fullscreen / close game
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.pauseModal && this.pauseModal.classList.contains('open')) {
            this.closeModal(this.pauseModal);
          } else if (this.customizerModal && this.customizerModal.classList.contains('open')) {
            this.closeModal(this.customizerModal);
          } else if (this.victoryModal && this.victoryModal.classList.contains('open')) {
            this.closeModal(this.victoryModal);
          } else {
            this.handleCloseGame();
          }
        }
      });

      // Global Mouse / Touch Move & Up for Drag Line
      window.addEventListener('mousemove', (e) => this.handleDragMove(e));
      window.addEventListener('mouseup', (e) => this.handleDragEnd(e));
      window.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
      window.addEventListener('touchend', (e) => this.handleDragEnd(e));
      window.addEventListener('touchcancel', (e) => this.handleDragEnd(e));

      // Window resize recalculates all drawn lines
      window.addEventListener('resize', () => this.refreshAllLines());
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.refreshAllLines(), 150);
      });

      // Close button on Level Selection Screen
      const btnCloseLevelSelect = document.getElementById('btn-close-level-select');
      if (btnCloseLevelSelect) {
        btnCloseLevelSelect.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleCloseGame();
        });
      }

      // Back to Level Select button in gameplay header
      const btnBackToLevels = document.getElementById('btn-back-to-levels');
      if (btnBackToLevels) {
        btnBackToLevels.addEventListener('click', (e) => {
          e.preventDefault();
          this.sound.playTap();
          this.showLevelSelectScreen();
        });
      }

      // Clickable Level badge in gameplay header to change levels
      const levelBadgeClickable = document.getElementById('level-badge-clickable');
      if (levelBadgeClickable) {
        levelBadgeClickable.addEventListener('click', () => {
          this.sound.playTap();
          this.showLevelSelectScreen();
        });
      }

      // Victory Modal Buttons
      document.getElementById('btn-next-level').addEventListener('click', () => {
        this.closeModal(this.victoryModal);
        const nextLvl = this.currentLevel < this.maxLevels ? this.currentLevel + 1 : 1;
        // Trigger game loader with gametanieshak floating style for 4s
        this.triggerGameLoader(4000, () => {
          this.startLevel(nextLvl);
        });
      });

      const btnVictoryLevels = document.getElementById('btn-victory-levels');
      if (btnVictoryLevels) {
        btnVictoryLevels.addEventListener('click', () => {
          this.closeModal(this.victoryModal);
          this.showLevelSelectScreen();
        });
      }

      document.getElementById('btn-replay-level').addEventListener('click', () => {
        this.closeModal(this.victoryModal);
        this.restartLevel();
      });

      // Pause Modal Buttons
      const btnResume = document.getElementById('btn-resume');
      if (btnResume) btnResume.addEventListener('click', () => this.closeModal(this.pauseModal));

      const btnPauseSelectLevel = document.getElementById('btn-pause-select-level');
      if (btnPauseSelectLevel) {
        btnPauseSelectLevel.addEventListener('click', () => {
          this.closeModal(this.pauseModal);
          this.showLevelSelectScreen();
        });
      }

      const btnPauseRestart = document.getElementById('btn-pause-restart');
      if (btnPauseRestart) {
        btnPauseRestart.addEventListener('click', () => {
          this.closeModal(this.pauseModal);
          this.restartLevel();
        });
      }

      const btnPauseExit = document.getElementById('btn-pause-exit');
      if (btnPauseExit) {
        btnPauseExit.addEventListener('click', () => {
          this.closeModal(this.pauseModal);
          this.handleCloseGame();
        });
      }

      const btnOpenCust = document.getElementById('btn-open-customizer');
      if (btnOpenCust) {
        btnOpenCust.addEventListener('click', () => {
          this.closeModal(this.pauseModal);
          this.openCustomizerModal();
        });
      }

      // Customizer Modal Buttons
      const btnCloseCust = document.getElementById('btn-close-customizer');
      if (btnCloseCust) {
        btnCloseCust.addEventListener('click', () => this.closeModal(this.customizerModal));
      }

      const btnFooterCust = document.getElementById('btn-footer-customizer');
      if (btnFooterCust) {
        btnFooterCust.addEventListener('click', () => this.openCustomizerModal());
      }

      const custSelect = document.getElementById('customizer-level-select');
      if (custSelect) {
        custSelect.addEventListener('change', (e) => {
          this.renderCustomizerContent(parseInt(e.target.value, 10));
        });
      }
    }

    // --- 3D LEVEL SELECTION SCREEN SYSTEM ---
    renderLevelSelectCards() {
      if (!this.levelCardsGrid) return;
      this.levelCardsGrid.innerHTML = '';

      for (let lvl = 1; lvl <= this.maxLevels; lvl++) {
        const title = `Level ${lvl}`;

        const card = document.createElement('div');
        card.className = `level-card-3d theme-level-${lvl}`;
        card.dataset.level = lvl;

        card.innerHTML = `
          <div class="level-card-top">
            <div class="level-orb-3d">
              <span class="level-orb-number">${lvl}</span>
            </div>
            <div class="level-meta">
              <div class="level-difficulty-badge">★ ★ ★</div>
              <h3 class="level-title">${title}</h3>
            </div>
          </div>

          <button class="btn-level-play-3d" aria-label="Play Level ${lvl}">
            <span class="btn-play-icon">▶</span>
            <span class="btn-play-text">START LEVEL ${lvl}</span>
          </button>
        `;

        card.addEventListener('click', () => {
          this.sound.playTap();
          this.startLevel(lvl);
        });

        this.levelCardsGrid.appendChild(card);
      }
    }

    showLevelSelectScreen() {
      if (this.levelSelectScreen) this.levelSelectScreen.style.display = 'flex';
      if (this.gameplayView) this.gameplayView.style.display = 'none';
      if (this.pauseModal) this.closeModal(this.pauseModal);
      if (this.victoryModal) this.closeModal(this.victoryModal);

      const scrollBody = document.querySelector('.level-select-body');
      if (scrollBody) scrollBody.scrollTop = 0;
    }

    startLevel(levelNum) {
      if (this.levelSelectScreen) this.levelSelectScreen.style.display = 'none';
      if (this.gameplayView) this.gameplayView.style.display = 'flex';
      this.loadLevel(levelNum);
      setTimeout(() => this.refreshAllLines(), 80);
    }

    // --- CLOSE / EXIT GAME HANDLER (Fullscreen, Mobile, Tablet, Web Modes) ---
    handleCloseGame() {
      // 1. Audio feedback tap
      try {
        if (this.sound) this.sound.playTap();
      } catch (e) { }

      // 2. If the browser is in HTML5 Fullscreen mode, exit it
      const doc = document;
      if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) {
        try {
          if (doc.exitFullscreen) {
            doc.exitFullscreen().catch(() => {});
          } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
          } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
          } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
          }
        } catch (e) { }
      }

      // 3. If running inside an iframe (e.g. Games modal on games.html), notify parent
      const isInsideIframe = window.self !== window.top;
      if (isInsideIframe) {
        try {
          window.parent.postMessage('close-game-modal', '*');
          window.parent.postMessage({ type: 'close-game-modal' }, '*');
          return;
        } catch (e) { }
      }

      // 4. If opened via window.open / popup, close the window/tab
      if (window.opener && !window.opener.closed) {
        try {
          window.close();
          return;
        } catch (e) { }
      }

      // 5. If document referrer leads to games.html, return there
      if (document.referrer && (document.referrer.includes('games.html') || document.referrer.includes('games'))) {
        window.location.href = document.referrer;
        return;
      }

      // 6. Default fallback: navigate cleanly to parent Games hub
      window.location.href = '../games.html';
    }

    // --- LEVEL MANAGEMENT ---
    loadLevel(levelNum) {
      this.currentLevel = levelNum;
      this.connectedPairs = [];
      this.currentOrderIndex = 0;
      this.selectedLeftCard = null;

      // Sync window.LEVEL_CONFIG if not already done
      window.LEVEL_CONFIG = window.LEVEL_CONFIG || {};
      if (!window.LEVEL_CONFIG[levelNum] && window[`LEVEL_${levelNum}_CONFIG`]) {
        window.LEVEL_CONFIG[levelNum] = window[`LEVEL_${levelNum}_CONFIG`];
      }

      // Check localStorage for customized level override, else fallback to window.LEVEL_CONFIG[levelNum] or window[`LEVEL_${levelNum}_CONFIG`]
      let rawConfig = null;
      const savedConfig = localStorage.getItem(`match_game_custom_level_${levelNum}`);
      if (savedConfig) {
        try {
          rawConfig = JSON.parse(savedConfig);
        } catch (e) {
          rawConfig = (window.LEVEL_CONFIG && window.LEVEL_CONFIG[levelNum]) || window[`LEVEL_${levelNum}_CONFIG`] || null;
        }
      } else {
        rawConfig = (window.LEVEL_CONFIG && window.LEVEL_CONFIG[levelNum]) || window[`LEVEL_${levelNum}_CONFIG`] || null;
      }

      if (!rawConfig) {
        this.showToast(`Level ${levelNum} configuration not found!`);
        return;
      }

      // Deep clone so working level state is isolated
      this.levelData = JSON.parse(JSON.stringify(rawConfig));

      // Guarantee that in every level, matching items on left and right NEVER line up straight horizontally across
      if (this.levelData.leftItems && this.levelData.rightItems && this.levelData.rightItems.length > 1) {
        const leftIds = this.levelData.leftItems.map(it => it.id);
        const hasDirectParallel = this.levelData.rightItems.some((it, idx) => it.id === leftIds[idx]);
        if (hasDirectParallel) {
          const right = [...this.levelData.rightItems];
          const n = right.length;
          for (let shift = 1; shift < n; shift++) {
            const candidate = right.map((_, i) => right[(i + shift) % n]);
            if (!candidate.some((it, i) => it.id === leftIds[i])) {
              this.levelData.rightItems = candidate;
              break;
            }
          }
        }
      }

      // Update Header & Badge
      this.levelBadgeText.textContent = this.levelData.title || `Quiz ${levelNum}`;
      this.updateOrderIndicator();
      this.updateLevelDots();

      // Clear SVG Lines
      this.svgOverlay.innerHTML = '';

      // Render Left & Right Items
      this.renderCards();
    }

    restartLevel() {
      this.connectedPairs = [];
      this.currentOrderIndex = 0;
      this.selectedLeftCard = null;
      this.svgOverlay.innerHTML = '';
      this.updateOrderIndicator();

      document.querySelectorAll('.match-card').forEach(card => {
        card.classList.remove('matched', 'selected', 'shake');
      });

      this.showToast('Level restarted!');
    }

    renderLevelDots() {
      const container = document.getElementById('level-dots-container');
      if (!container) return;
      container.innerHTML = '';
      for (let i = 1; i <= this.maxLevels; i++) {
        const dot = document.createElement('div');
        dot.className = `level-dot ${i === this.currentLevel ? 'active' : ''}`;
        dot.textContent = i;
        dot.title = `Go to Quiz ${i}`;
        dot.addEventListener('click', () => this.loadLevel(i));
        container.appendChild(dot);
      }
    }

    updateLevelDots() {
      const dots = document.querySelectorAll('.level-dot');
      if (!dots || dots.length === 0) return;
      dots.forEach((dot, idx) => {
        const lvl = idx + 1;
        dot.classList.remove('active');
        if (lvl === this.currentLevel) {
          dot.classList.add('active');
        }
      });
    }

    updateOrderIndicator() {
      const totalPairs = (this.levelData.matchingOrder || []).length;
      const matchedCount = this.connectedPairs.length;

      if (matchedCount >= totalPairs && totalPairs > 0) {
        this.orderIndicator.innerHTML = `<span>All items matched! 🎉</span>`;
        return;
      }

      if (this.levelData.enforceMatchingOrder) {
        const orderList = this.levelData.matchingOrder || [];
        const currentStep = Math.min(this.currentOrderIndex + 1, totalPairs);
        if (this.currentOrderIndex < totalPairs) {
          const currentPair = orderList[this.currentOrderIndex];
          const leftItem = this.levelData.leftItems.find(it => it.id === currentPair.leftId);
          const name = leftItem ? leftItem.name : `Item ${currentStep}`;
          this.orderIndicator.innerHTML = `
            <div class="order-badge-step">
              <span class="dot"></span>
              <span>Target ${currentStep}/${totalPairs}: <strong>${name}</strong></span>
            </div>
          `;
          return;
        }
      }

      // Default: Match in any order progress display
      const hint = this.levelData.hintText || 'Match items in any order!';
      this.orderIndicator.innerHTML = `
        <div class="order-badge-step">
          <span class="dot"></span>
          <span>${hint} (<strong>${matchedCount}/${totalPairs}</strong> matched)</span>
        </div>
      `;
    }

    // --- CARD RENDERING & INTERACTION ---
    renderCards() {
      this.leftColumn.innerHTML = '';
      this.rightColumn.innerHTML = '';

      // Left Column
      (this.levelData.leftItems || []).forEach(item => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.dataset.id = item.id;
        card.dataset.side = 'left';
        if (item.bgColor) card.style.backgroundColor = item.bgColor;

        // Card content: Text or Image
        if (item.text) {
          const letterSpan = document.createElement('span');
          letterSpan.className = item.text.length > 2 ? 'card-calc-text' : 'card-letter-text';
          letterSpan.textContent = item.text;
          card.appendChild(letterSpan);
        } else if (item.image) {
          const img = document.createElement('img');
          img.src = item.image;
          img.alt = item.name || item.id;
          card.appendChild(img);
        }

        // Anchor dot for visual connection
        const dot = document.createElement('span');
        dot.className = 'anchor-dot';
        card.appendChild(dot);

        // Interaction listeners (Click & Drag)
        card.addEventListener('mousedown', (e) => this.handleLeftCardStart(e, card));
        card.addEventListener('touchstart', (e) => this.handleLeftCardStart(e, card), { passive: false });
        card.addEventListener('click', (e) => this.handleLeftCardClick(e, card));

        this.leftColumn.appendChild(card);
      });

      // Right Column
      (this.levelData.rightItems || []).forEach(item => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.dataset.id = item.id;
        card.dataset.side = 'right';
        if (item.bgColor) card.style.backgroundColor = item.bgColor;

        // Card content: Text or Image
        if (item.text) {
          const letterSpan = document.createElement('span');
          letterSpan.className = item.text.length > 2 ? 'card-calc-text' : 'card-letter-text';
          letterSpan.textContent = item.text;
          card.appendChild(letterSpan);
        } else if (item.image) {
          const img = document.createElement('img');
          img.src = item.image;
          img.alt = item.name || item.id;
          card.appendChild(img);
        }

        const dot = document.createElement('span');
        dot.className = 'anchor-dot';
        card.appendChild(dot);

        card.addEventListener('click', (e) => this.handleRightCardClick(e, card));

        this.rightColumn.appendChild(card);
      });
    }

    // --- CONNECTION & DRAG SYSTEM ---
    getPointerPos(e) {
      const rect = this.playArea.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if (e.clientX !== undefined) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        clientX,
        clientY
      };
    }

    getCardAnchorPos(card, side) {
      const playRect = this.playArea.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();

      let x = side === 'left' ? cardRect.right - playRect.left : cardRect.left - playRect.left;
      let y = cardRect.top + cardRect.height / 2 - playRect.top;
      return { x, y };
    }

    handleLeftCardStart(e, card) {
      if (card.classList.contains('matched')) return;
      if (e.type === 'touchstart' && e.cancelable) {
        e.preventDefault();
      }

      // Tap sound on every tile click
      this.sound.playTap();
      this.isDragging = true;
      this.hasDragMoved = false;
      this.dragStartCard = card;

      const pointer = this.getPointerPos(e);
      this.dragOriginX = pointer.x;
      this.dragOriginY = pointer.y;

      // Select this card visually
      document.querySelectorAll('.column-left .match-card').forEach(c => {
        if (!c.classList.contains('matched')) c.classList.remove('selected');
      });
      card.classList.add('selected');
      this.selectedLeftCard = card;
    }

    handleDragMove(e) {
      if (!this.isDragging || !this.dragStartCard) return;
      if (e.type === 'touchmove' && e.cancelable) {
        e.preventDefault();
      }

      const pointer = this.getPointerPos(e);
      const dist = Math.hypot(pointer.x - this.dragOriginX, pointer.y - this.dragOriginY);

      if (dist > 8) {
        if (!this.hasDragMoved) {
          this.hasDragMoved = true;
          // Line drawing audio starts
          this.sound.startDrawingSound();

          // Clean up any stray temp lines first
          if (this.dragTempLine) {
            this.dragTempLine.remove();
            this.dragTempLine = null;
          }

          const startPos = this.getCardAnchorPos(this.dragStartCard, 'left');
          this.dragTempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          this.dragTempLine.setAttribute('class', 'connection-line active-drag');
          this.dragTempLine.setAttribute('x1', startPos.x);
          this.dragTempLine.setAttribute('y1', startPos.y);
          this.dragTempLine.setAttribute('x2', pointer.x);
          this.dragTempLine.setAttribute('y2', pointer.y);
          this.svgOverlay.appendChild(this.dragTempLine);
        }

        // Modulate line drawing audio as user draws
        this.sound.updateDrawingSound(dist);
      }

      if (this.dragTempLine) {
        this.dragTempLine.setAttribute('x2', pointer.x);
        this.dragTempLine.setAttribute('y2', pointer.y);
      }
    }

    handleDragEnd(e) {
      if (!this.isDragging) return;
      this.isDragging = false;

      let targetRightCard = null;
      const startCard = this.dragStartCard;

      try {
        const pointer = this.getPointerPos(e);

        if (this.hasDragMoved) {
          // 1. Precise element detection under touch point
          const elem = document.elementFromPoint(pointer.clientX, pointer.clientY);
          if (elem) {
            targetRightCard = elem.closest('.column-right .match-card');
          }

          // 2. Touch proximity tolerance (in case finger is slightly outside border on mobile)
          if (!targetRightCard) {
            const rightCards = document.querySelectorAll('.column-right .match-card:not(.matched)');
            for (const rCard of rightCards) {
              const rRect = rCard.getBoundingClientRect();
              if (
                pointer.clientX >= rRect.left - 24 &&
                pointer.clientX <= rRect.right + 24 &&
                pointer.clientY >= rRect.top - 24 &&
                pointer.clientY <= rRect.bottom + 24
              ) {
                targetRightCard = rCard;
                break;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Touch drag error:', err);
      } finally {
        // Stop line drawing sound
        this.sound.stopDrawingSound();

        // ALWAYS remove temporary drag lines - guarantee no leftover stray lines
        if (this.dragTempLine) {
          this.dragTempLine.remove();
          this.dragTempLine = null;
        }

        const strayLines = this.svgOverlay.querySelectorAll('.connection-line.active-drag');
        strayLines.forEach(l => l.remove());

        this.dragStartCard = null;
        this.hasDragMoved = false;

        if (targetRightCard && startCard) {
          this.evaluateMatch(startCard, targetRightCard);
        }
      }
    }

    handleLeftCardClick(e, card) {
      if (card.classList.contains('matched')) return;
      // Tap sound on every tile click
      this.sound.playTap();

      document.querySelectorAll('.column-left .match-card').forEach(c => {
        if (!c.classList.contains('matched')) c.classList.remove('selected');
      });
      card.classList.add('selected');
      this.selectedLeftCard = card;
    }

    handleRightCardClick(e, card) {
      if (card.classList.contains('matched')) return;

      // Tap sound on every tile click
      this.sound.playTap();

      if (!this.selectedLeftCard) {
        this.showToast('Select an item on the left first!');
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 450);
        return;
      }

      this.evaluateMatch(this.selectedLeftCard, card);
    }

    // --- MATCH EVALUATION & ORDER VERIFICATION ---
    evaluateMatch(leftCard, rightCard) {
      const leftId = leftCard.dataset.id;
      const rightId = rightCard.dataset.id;

      // Check if left card is already matched
      if (this.connectedPairs.some(p => p.leftId === leftId || p.rightId === rightId)) {
        return;
      }

      const matchingList = this.levelData.matchingOrder || [];

      // Check if this pair exists in the valid matching pairs
      const validPair = matchingList.find(p => p.leftId === leftId && p.rightId === rightId);

      if (!validPair) {
        // Wrong match - Play try again sound
        this.sound.playTryAgain();
        this.triggerMismatchFeedback(leftCard, rightCard, "Not a match! Try again.");
        return;
      }

      // Check ORDER ENFORCEMENT
      if (this.levelData.enforceMatchingOrder) {
        const requiredPair = matchingList[this.currentOrderIndex];
        if (requiredPair && (requiredPair.leftId !== leftId || requiredPair.rightId !== rightId)) {
          // Out of order - Play try again sound
          this.sound.playTryAgain();
          const targetLeft = this.levelData.leftItems.find(it => it.id === requiredPair.leftId);
          const targetName = targetLeft ? targetLeft.name : `Step ${this.currentOrderIndex + 1}`;
          this.triggerMismatchFeedback(leftCard, rightCard, `Wrong order! Match "${targetName}" first.`);
          return;
        }
      }

      // MATCH SUCCESS!
      // 1. Clapping applause sound
      this.sound.playClapping();
      // 2. Clapping tile badge animation appears
      this.spawnClappingBadge(leftCard, rightCard);

      leftCard.classList.remove('selected');
      leftCard.classList.add('matched');
      rightCard.classList.add('matched');
      this.selectedLeftCard = null;

      // Draw permanent lime-green connecting line
      const line = this.drawPermanentLine(leftCard, rightCard);
      this.connectedPairs.push({
        leftId,
        rightId,
        leftCard,
        rightCard,
        lineEl: line
      });

      this.currentOrderIndex++;
      this.updateOrderIndicator();

      // Check if all pairs are matched!
      if (this.connectedPairs.length >= matchingList.length) {
        setTimeout(() => this.triggerVictory(), 400);
      }
    }

    triggerMismatchFeedback(leftCard, rightCard, message) {
      leftCard.classList.add('shake');
      rightCard.classList.add('shake');
      this.showToast(message);

      // Draw momentary red line
      const p1 = this.getCardAnchorPos(leftCard, 'left');
      const p2 = this.getCardAnchorPos(rightCard, 'right');
      const errLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      errLine.setAttribute('class', 'connection-line wrong-match');
      errLine.setAttribute('x1', p1.x);
      errLine.setAttribute('y1', p1.y);
      errLine.setAttribute('x2', p2.x);
      errLine.setAttribute('y2', p2.y);
      this.svgOverlay.appendChild(errLine);

      setTimeout(() => {
        leftCard.classList.remove('shake');
        rightCard.classList.remove('shake');
        errLine.remove();
      }, 500);
    }

    drawPermanentLine(leftCard, rightCard) {
      const p1 = this.getCardAnchorPos(leftCard, 'left');
      const p2 = this.getCardAnchorPos(rightCard, 'right');

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'connection-line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);

      this.svgOverlay.appendChild(line);
      return line;
    }

    spawnClappingBadge(leftCard, rightCard) {
      const playArea = this.playArea;
      if (!playArea) return;
      const pRect = playArea.getBoundingClientRect();
      const lRect = leftCard.getBoundingClientRect();
      const rRect = rightCard.getBoundingClientRect();

      const midX = ((lRect.left + lRect.right) / 2 + (rRect.left + rRect.right) / 2) / 2 - pRect.left;
      const midY = ((lRect.top + lRect.bottom) / 2 + (rRect.top + rRect.bottom) / 2) / 2 - pRect.top;

      const badge = document.createElement('div');
      badge.className = 'clapping-badge';
      badge.style.left = `${midX}px`;
      badge.style.top = `${midY}px`;
      badge.innerHTML = `<span class="clapping-icon">👏</span><span>Great Match!</span>`;

      playArea.appendChild(badge);
      setTimeout(() => badge.remove(), 1350);
    }

    refreshAllLines() {
      this.connectedPairs.forEach(pair => {
        if (pair.leftCard && pair.rightCard && pair.lineEl) {
          const p1 = this.getCardAnchorPos(pair.leftCard, 'left');
          const p2 = this.getCardAnchorPos(pair.rightCard, 'right');
          pair.lineEl.setAttribute('x1', p1.x);
          pair.lineEl.setAttribute('y1', p1.y);
          pair.lineEl.setAttribute('x2', p2.x);
          pair.lineEl.setAttribute('y2', p2.y);
        }
      });
    }

    // --- VICTORY & CONGRATULATIONS POPUP ---
    triggerVictory() {
      // Grand celebration sound with firecrackers and fanfare
      this.sound.playFirecrackers();
      this.confetti.explode(110);

      const titleEl = document.getElementById('victory-title');
      const subtitleEl = document.getElementById('victory-subtitle');
      const nextBtn = document.getElementById('btn-next-level');

      if (this.currentLevel < this.maxLevels) {
        titleEl.textContent = 'Congratulations! 🎆';
        subtitleEl.textContent = `You cleared Level ${this.currentLevel}! All items matched!`;
        nextBtn.textContent = `Next Level (Level ${this.currentLevel + 1}) →`;
      } else {
        titleEl.textContent = 'Awesome! All Levels Won! 🎆🎇';
        subtitleEl.textContent = `You successfully solved all ${this.maxLevels} Levels!`;
        nextBtn.textContent = 'Play from Level 1 🔄';
      }

      this.openModal(this.victoryModal);
    }

    // --- TOAST NOTIFICATIONS ---
    showToast(msg) {
      this.toastEl.textContent = msg;
      this.toastEl.classList.add('show');
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.toastEl.classList.remove('show');
      }, 2500);
    }

    // --- MODAL UTILITIES ---
    openModal(modal) {
      modal.classList.add('open');
    }

    closeModal(modal) {
      modal.classList.remove('open');
    }

    openPauseModal() {
      this.openModal(this.pauseModal);
    }

    // --- LEVEL CUSTOMIZER & IMAGE UPLOADER MODAL ---
    openCustomizerModal() {
      const select = document.getElementById('customizer-level-select');
      select.value = this.currentLevel;
      this.renderCustomizerContent(this.currentLevel);
      this.openModal(this.customizerModal);
    }

    renderCustomizerContent(levelNum) {
      const container = document.getElementById('customizer-items-container');
      container.innerHTML = '';

      // Load config (saved or original)
      let config = null;
      const savedConfig = localStorage.getItem(`match_game_custom_level_${levelNum}`);
      if (savedConfig) {
        try { config = JSON.parse(savedConfig); } catch (e) { }
      }
      if (!config) {
        config = JSON.parse(JSON.stringify(window.LEVEL_CONFIG[levelNum]));
      }

      // Title & Options
      const metaDiv = document.createElement('div');
      metaDiv.innerHTML = `
        <div style="margin-bottom: 12px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #475569;">Level Title:</label>
          <input type="text" id="cust-level-title" class="item-input" value="${config.title || 'Quiz ' + levelNum}" style="width: 100%; margin-top: 4px;" />
        </div>
        <div style="margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="cust-enforce-order" ${config.enforceMatchingOrder ? 'checked' : ''} style="width: 18px; height: 18px;" />
          <label for="cust-enforce-order" style="font-size: 0.85rem; font-weight: 600; color: #334155; cursor: pointer;">
            Enforce strict matching order (Player must connect in defined order)
          </label>
        </div>
      `;
      container.appendChild(metaDiv);

      // Section: Left Items
      const leftHeader = document.createElement('div');
      leftHeader.className = 'customizer-section-title';
      leftHeader.textContent = 'Left Column Items (Upload Image & Name)';
      container.appendChild(leftHeader);

      config.leftItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'item-config-row';
        row.innerHTML = `
          <div class="item-config-preview" style="background-color: ${item.bgColor || '#fff'}">
            <img src="${item.image}" id="preview-left-${index}" alt="item" />
          </div>
          <div class="item-config-inputs">
            <input type="text" class="item-input cust-left-name" data-index="${index}" value="${item.name}" placeholder="Item name" />
            <div style="display: flex; gap: 8px; align-items: center;">
              <label class="upload-btn-label">
                📷 Upload Image
                <input type="file" accept="image/*" class="cust-file-input" data-side="left" data-index="${index}" style="display: none;" />
              </label>
              <input type="color" class="cust-left-color" data-index="${index}" value="${this.rgbOrHexToHex(item.bgColor) || '#ffffff'}" title="Card Color" style="width: 28px; height: 26px; border: none; cursor: pointer;" />
            </div>
          </div>
        `;
        container.appendChild(row);
      });

      // Section: Right Items
      const rightHeader = document.createElement('div');
      rightHeader.className = 'customizer-section-title';
      rightHeader.textContent = 'Right Column Items (Upload Image & Name)';
      container.appendChild(rightHeader);

      config.rightItems.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'item-config-row';
        row.innerHTML = `
          <div class="item-config-preview" style="background-color: ${item.bgColor || '#fff'}">
            <img src="${item.image}" id="preview-right-${index}" alt="item" />
          </div>
          <div class="item-config-inputs">
            <input type="text" class="item-input cust-right-name" data-index="${index}" value="${item.name}" placeholder="Item name" />
            <div style="display: flex; gap: 8px; align-items: center;">
              <label class="upload-btn-label">
                📷 Upload Image
                <input type="file" accept="image/*" class="cust-file-input" data-side="right" data-index="${index}" style="display: none;" />
              </label>
              <input type="color" class="cust-right-color" data-index="${index}" value="${this.rgbOrHexToHex(item.bgColor) || '#ffffff'}" title="Card Color" style="width: 28px; height: 26px; border: none; cursor: pointer;" />
            </div>
          </div>
        `;
        container.appendChild(row);
      });

      // Section: Matching Pairs & Order
      const orderHeader = document.createElement('div');
      orderHeader.className = 'customizer-section-title';
      orderHeader.textContent = 'Matching Order (1st, 2nd, 3rd... Pair to Match)';
      container.appendChild(orderHeader);

      const orderContainer = document.createElement('div');
      orderContainer.id = 'cust-order-container';

      config.matchingOrder.forEach((pair, pairIdx) => {
        const pRow = document.createElement('div');
        pRow.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 0.85rem;';

        // Select Left Item
        let leftOptions = config.leftItems.map(it =>
          `<option value="${it.id}" ${it.id === pair.leftId ? 'selected' : ''}>${it.name || it.id}</option>`
        ).join('');

        // Select Right Item
        let rightOptions = config.rightItems.map(it =>
          `<option value="${it.id}" ${it.id === pair.rightId ? 'selected' : ''}>${it.name || it.id}</option>`
        ).join('');

        pRow.innerHTML = `
          <span style="font-weight: 700; width: 44px; color: #475569;">#${pairIdx + 1}:</span>
          <select class="item-input cust-order-left" data-index="${pairIdx}" style="flex: 1;">${leftOptions}</select>
          <span style="color: #64748b; font-weight: 700;">➜</span>
          <select class="item-input cust-order-right" data-index="${pairIdx}" style="flex: 1;">${rightOptions}</select>
        `;
        orderContainer.appendChild(pRow);
      });
      container.appendChild(orderContainer);

      // Bind File Input Readers (Image Upload)
      container.querySelectorAll('.cust-file-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (re) => {
            const dataUrl = re.target.result;
            const side = input.dataset.side;
            const idx = parseInt(input.dataset.index, 10);
            if (side === 'left') {
              config.leftItems[idx].image = dataUrl;
              document.getElementById(`preview-left-${idx}`).src = dataUrl;
            } else {
              config.rightItems[idx].image = dataUrl;
              document.getElementById(`preview-right-${idx}`).src = dataUrl;
            }
          };
          reader.readAsDataURL(file);
        });
      });

      // Actions Toolbar
      const actionsDiv = document.createElement('div');
      actionsDiv.style.cssText = 'display: flex; flex-direction: column; gap: 8px; margin-top: 20px;';
      actionsDiv.innerHTML = `
        <button class="btn-primary" id="btn-save-cust" style="margin-bottom: 0;">💾 Save & Test In Game</button>
        <div style="display: flex; gap: 8px;">
          <button class="btn-secondary" id="btn-export-cust" style="flex: 1;">📥 Download level${levelNum}.js</button>
          <button class="btn-secondary" id="btn-reset-cust" style="flex: 1; color: #c0392b;">↺ Reset Default</button>
        </div>
      `;
      container.appendChild(actionsDiv);

      // Save Handler
      document.getElementById('btn-save-cust').addEventListener('click', () => {
        config.title = document.getElementById('cust-level-title').value.trim();
        config.enforceMatchingOrder = document.getElementById('cust-enforce-order').checked;

        // Names & Colors
        container.querySelectorAll('.cust-left-name').forEach(inp => {
          config.leftItems[inp.dataset.index].name = inp.value.trim();
        });
        container.querySelectorAll('.cust-left-color').forEach(inp => {
          config.leftItems[inp.dataset.index].bgColor = inp.value;
        });
        container.querySelectorAll('.cust-right-name').forEach(inp => {
          config.rightItems[inp.dataset.index].name = inp.value.trim();
        });
        container.querySelectorAll('.cust-right-color').forEach(inp => {
          config.rightItems[inp.dataset.index].bgColor = inp.value;
        });

        // Matching Order
        const leftSelects = container.querySelectorAll('.cust-order-left');
        const rightSelects = container.querySelectorAll('.cust-order-right');
        config.matchingOrder = [];
        leftSelects.forEach((sel, i) => {
          config.matchingOrder.push({
            leftId: sel.value,
            rightId: rightSelects[i].value,
            label: `${sel.options[sel.selectedIndex].text} with ${rightSelects[i].options[rightSelects[i].selectedIndex].text}`
          });
        });

        localStorage.setItem(`match_game_custom_level_${levelNum}`, JSON.stringify(config));
        this.closeModal(this.customizerModal);
        this.loadLevel(levelNum);
        this.showToast(`Level ${levelNum} updated!`);
      });

      // Export / Download levelX.js file
      document.getElementById('btn-export-cust').addEventListener('click', () => {
        const fileContent = `/**
 * LEVEL ${levelNum} CONFIGURATION
 */
window.LEVEL_CONFIG = window.LEVEL_CONFIG || {};

window.LEVEL_CONFIG[${levelNum}] = ${JSON.stringify(config, null, 2)};
`;
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `level${levelNum}.js`;
        a.click();
        URL.revokeObjectURL(a.href);
      });

      // Reset to original file defaults
      document.getElementById('btn-reset-cust').addEventListener('click', () => {
        localStorage.removeItem(`match_game_custom_level_${levelNum}`);
        this.renderCustomizerContent(levelNum);
        this.loadLevel(levelNum);
        this.showToast(`Reset Quiz ${levelNum} to defaults.`);
      });
    }

    rgbOrHexToHex(color) {
      if (!color) return '#ffffff';
      if (color.startsWith('#')) return color;
      return '#ffffff';
    }
  }

  // Launch Game on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    window.game = new MatchingGame();
  });
})();
