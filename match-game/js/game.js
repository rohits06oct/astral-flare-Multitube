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
      this.enabled = true;
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

    playSelect() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }

    playMatch() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [
        { freq: 523.25, time: 0 },       // C5
        { freq: 659.25, time: 0.08 },    // E5
        { freq: 783.99, time: 0.16 },    // G5
        { freq: 1046.50, time: 0.24 }    // C6
      ].forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now + note.time);
        gain.gain.setValueAtTime(0.18, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + note.time);
        osc.stop(now + note.time + 0.25);
      });
    }

    playError() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    playVictory() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [
        { f: 440, t: 0 },
        { f: 554.37, t: 0.1 },
        { f: 659.25, t: 0.2 },
        { f: 880, t: 0.3 },
        { f: 783.99, t: 0.42 },
        { f: 880, t: 0.54 }
      ];
      const now = this.ctx.currentTime;
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.2, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.01, now + n.t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.35);
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
      this.maxLevels = 5;
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
      this.loadLevel(this.currentLevel);
    }

    initEvents() {
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

      // Global Mouse / Touch Move & Up for Drag Line
      window.addEventListener('mousemove', (e) => this.handleDragMove(e));
      window.addEventListener('mouseup', (e) => this.handleDragEnd(e));
      window.addEventListener('touchmove', (e) => this.handleDragMove(e), { passive: false });
      window.addEventListener('touchend', (e) => this.handleDragEnd(e));

      // Window resize recalculates all drawn lines
      window.addEventListener('resize', () => this.refreshAllLines());
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.refreshAllLines(), 150);
      });

      // Victory Modal Buttons
      document.getElementById('btn-next-level').addEventListener('click', () => {
        this.closeModal(this.victoryModal);
        if (this.currentLevel < this.maxLevels) {
          this.loadLevel(this.currentLevel + 1);
        } else {
          this.loadLevel(1);
        }
      });
      document.getElementById('btn-replay-level').addEventListener('click', () => {
        this.closeModal(this.victoryModal);
        this.restartLevel();
      });

      // Pause Modal Buttons
      const btnResume = document.getElementById('btn-resume');
      if (btnResume) btnResume.addEventListener('click', () => this.closeModal(this.pauseModal));

      const btnPauseRestart = document.getElementById('btn-pause-restart');
      if (btnPauseRestart) {
        btnPauseRestart.addEventListener('click', () => {
          this.closeModal(this.pauseModal);
          this.restartLevel();
        });
      }

      const btnOpenCust = document.getElementById('btn-open-customizer');
      if (btnOpenCust) {
        btnOpenCust.addEventListener('click', () => {
          this.closeModal(this.pauseModal);
          this.openCustomizerModal();
        });
      }

      // Footer Level Dots
      this.renderLevelDots();

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

    // --- LEVEL MANAGEMENT ---
    loadLevel(levelNum) {
      this.currentLevel = levelNum;
      this.connectedPairs = [];
      this.currentOrderIndex = 0;
      this.selectedLeftCard = null;

      // Check localStorage for customized level override, else fallback to window.LEVEL_CONFIG[levelNum]
      const savedConfig = localStorage.getItem(`match_game_custom_level_${levelNum}`);
      if (savedConfig) {
        try {
          this.levelData = JSON.parse(savedConfig);
        } catch (e) {
          this.levelData = (window.LEVEL_CONFIG && window.LEVEL_CONFIG[levelNum]) || null;
        }
      } else {
        this.levelData = (window.LEVEL_CONFIG && window.LEVEL_CONFIG[levelNum]) || null;
      }

      if (!this.levelData) {
        this.showToast(`Level ${levelNum} configuration not found!`);
        return;
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
      dots.forEach((dot, idx) => {
        const lvl = idx + 1;
        dot.classList.remove('active');
        if (lvl === this.currentLevel) {
          dot.classList.add('active');
        }
      });
    }

    updateOrderIndicator() {
      if (!this.levelData.enforceMatchingOrder) {
        this.orderIndicator.innerHTML = `<span>${this.levelData.hintText || 'Match all items!'}</span>`;
        return;
      }

      const orderList = this.levelData.matchingOrder || [];
      const totalSteps = orderList.length;
      const currentStep = Math.min(this.currentOrderIndex + 1, totalSteps);

      if (this.currentOrderIndex < totalSteps) {
        const currentPair = orderList[this.currentOrderIndex];
        const leftItem = this.levelData.leftItems.find(it => it.id === currentPair.leftId);
        const name = leftItem ? leftItem.name : `Item ${currentStep}`;
        this.orderIndicator.innerHTML = `
          <div class="order-badge-step">
            <span class="dot"></span>
            <span>Target ${currentStep}/${totalSteps}: <strong>${name}</strong></span>
          </div>
        `;
      } else {
        this.orderIndicator.innerHTML = `<span>All matched in correct order! 🎉</span>`;
      }
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

        // Card image
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name || item.id;
        card.appendChild(img);

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

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name || item.id;
        card.appendChild(img);

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
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
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
      if (e.type === 'touchstart') {
        // Prevent default only if touch
      }

      this.sound.playSelect();
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
      if (e.type === 'touchmove') e.preventDefault();

      const pointer = this.getPointerPos(e);
      const dist = Math.hypot(pointer.x - this.dragOriginX, pointer.y - this.dragOriginY);

      if (dist > 8 && !this.hasDragMoved) {
        this.hasDragMoved = true;
        // Create drag line
        const startPos = this.getCardAnchorPos(this.dragStartCard, 'left');
        this.dragTempLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.dragTempLine.setAttribute('class', 'connection-line active-drag');
        this.dragTempLine.setAttribute('x1', startPos.x);
        this.dragTempLine.setAttribute('y1', startPos.y);
        this.dragTempLine.setAttribute('x2', pointer.x);
        this.dragTempLine.setAttribute('y2', pointer.y);
        this.svgOverlay.appendChild(this.dragTempLine);
      }

      if (this.dragTempLine) {
        this.dragTempLine.setAttribute('x2', pointer.x);
        this.dragTempLine.setAttribute('y2', pointer.y);
      }
    }

    handleDragEnd(e) {
      if (!this.isDragging) return;
      this.isDragging = false;

      const pointer = this.getPointerPos(e);
      let targetRightCard = null;

      if (this.hasDragMoved) {
        const elem = document.elementFromPoint(pointer.clientX, pointer.clientY);
        if (elem) {
          targetRightCard = elem.closest('.column-right .match-card');
        }
      }

      if (this.dragTempLine) {
        this.dragTempLine.remove();
        this.dragTempLine = null;
      }

      if (targetRightCard && this.dragStartCard) {
        this.evaluateMatch(this.dragStartCard, targetRightCard);
      }
    }

    handleLeftCardClick(e, card) {
      if (card.classList.contains('matched')) return;
      // Already selected in handleLeftCardStart
      document.querySelectorAll('.column-left .match-card').forEach(c => {
        if (!c.classList.contains('matched')) c.classList.remove('selected');
      });
      card.classList.add('selected');
      this.selectedLeftCard = card;
    }

    handleRightCardClick(e, card) {
      if (card.classList.contains('matched')) return;

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
        // Wrong match!
        this.sound.playError();
        this.triggerMismatchFeedback(leftCard, rightCard, "Not a match! Try again.");
        return;
      }

      // Check ORDER ENFORCEMENT
      if (this.levelData.enforceMatchingOrder) {
        const requiredPair = matchingList[this.currentOrderIndex];
        if (requiredPair && (requiredPair.leftId !== leftId || requiredPair.rightId !== rightId)) {
          // Out of order!
          this.sound.playError();
          const targetLeft = this.levelData.leftItems.find(it => it.id === requiredPair.leftId);
          const targetName = targetLeft ? targetLeft.name : `Step ${this.currentOrderIndex + 1}`;
          this.triggerMismatchFeedback(leftCard, rightCard, `Wrong order! Match "${targetName}" first.`);
          return;
        }
      }

      // MATCH SUCCESS!
      this.sound.playMatch();
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
      this.sound.playVictory();
      this.confetti.explode(90);

      const titleEl = document.getElementById('victory-title');
      const subtitleEl = document.getElementById('victory-subtitle');
      const nextBtn = document.getElementById('btn-next-level');

      if (this.currentLevel < this.maxLevels) {
        titleEl.textContent = 'Congratulations!';
        subtitleEl.textContent = `You cleared Quiz ${this.currentLevel} with perfect matching order!`;
        nextBtn.textContent = `Next Level (Quiz ${this.currentLevel + 1}) →`;
      } else {
        titleEl.textContent = 'Awesome! All Levels Won!';
        subtitleEl.textContent = 'You successfully solved all 5 Quizzes in perfect order!';
        nextBtn.textContent = 'Play from Quiz 1 🔄';
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
