/**
 * Main Controller for Car Crush (WeCrash)
 * Features Auto-Run all levels, instant restart button & 'R' shortcut,
 * mobile-responsive UI management, and custom car studio.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize 3D World & Simulation
    const container = document.getElementById('canvas-container');
    const world = new CanyonWorld(container);
    const sim = new SimulationController(world);

    let currentMode = 'level'; // 'level' or 'sandbox'
    let currentLevelIndex = 0;
    let autoRunEnabled = false; // Strictly 1 car at a time; no auto-sending next car
    let autoRunTimeout = null;
    let previewWorld = null;

    // UI Elements
    const hudStatus = document.getElementById('hud-status');
    const hudTitle = document.getElementById('hud-title');
    const hudSub = document.getElementById('hud-sub');
    const speedVal = document.getElementById('speed-val');
    const clearanceGauge = document.getElementById('clearance-gauge');
    const clearanceVal = document.getElementById('clearance-val');
    const chainHeightSlider = document.getElementById('chain-height-slider');
    const chainHeightVal = document.getElementById('chain-height-val');
    const carSelect = document.getElementById('car-select');
    const levelCardsContainer = document.getElementById('level-cards');
    const soundToggleBtn = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    const soundText = document.getElementById('sound-text');

    // Drawer and Cinema mode
    const drawer = document.getElementById('controls-drawer');
    const btnDrawerToggle = document.getElementById('btn-drawer-toggle');
    const drawerArrow = document.getElementById('drawer-arrow');
    const drawerLabel = document.getElementById('drawer-label');
    const mainUiOverlay = document.getElementById('main-ui-overlay');
    const btnCinemaToggle = document.getElementById('btn-cinema-toggle');
    const cinemaIcon = document.getElementById('cinema-icon');
    const cinemaText = document.getElementById('cinema-text');

    // Pause, Auto-Run, and Restart buttons
    const btnPauseToggle = document.getElementById('btn-pause-toggle');
    const pauseIcon = document.getElementById('pause-icon');
    const btnAutoRunToggle = document.getElementById('btn-autorun-toggle');
    const autorunIcon = document.getElementById('autorun-icon');
    const btnRestartRun = document.getElementById('btn-restart-run');

    // 2. Pause Simulation Toggle
    function togglePause() {
        const isPaused = sim.togglePause();
        if (btnPauseToggle) {
            btnPauseToggle.classList.toggle('btn-paused', isPaused);
        }
        if (pauseIcon) {
            pauseIcon.textContent = isPaused ? '▶️' : '⏸️';
        }
        if (isPaused) {
            window.soundEngine.pauseAudio();
            hudStatus.classList.add('status-impact');
            hudTitle.textContent = 'PAUSED (PRESS P TO RESUME)';
        } else {
            window.soundEngine.resumeAudio();
            hudStatus.classList.remove('status-impact');
            if (sim.state === 'RUNNING' && sim.activeCar) {
                hudTitle.textContent = `${sim.activeCar.def.name.toUpperCase()} • ${sim.activeCar.def.height.toFixed(2)}M`;
            } else if (sim.state === 'PASSED') {
                hudTitle.textContent = 'CLEAR';
            } else if (sim.state === 'CRUSHED') {
                hudTitle.textContent = 'CRUSHED!';
            }
        }
    }

    if (btnPauseToggle) {
        btnPauseToggle.addEventListener('click', togglePause);
    }

    // Stage frame and Aspect Ratio Toggle
    const gameStageFrame = document.getElementById('game-stage-frame');
    const btnAspectToggle = document.getElementById('btn-aspect-toggle');
    const aspectIcon = document.getElementById('aspect-icon');
    const aspectText = document.getElementById('aspect-text');
    let isPortraitMode = true;

    btnAspectToggle.addEventListener('click', () => {
        isPortraitMode = !isPortraitMode;
        gameStageFrame.classList.toggle('portrait-mode', isPortraitMode);
        gameStageFrame.classList.toggle('fullscreen-mode', !isPortraitMode);
        aspectIcon.textContent = isPortraitMode ? '📱' : '🖥️';
        if (aspectText) aspectText.textContent = isPortraitMode ? 'Shorts' : 'Full';

        setTimeout(() => {
            world.onWindowResize();
        }, 100);
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'web' || urlParams.get('mode') === 'full') {
        isPortraitMode = false;
        gameStageFrame.classList.remove('portrait-mode');
        gameStageFrame.classList.add('fullscreen-mode');
        aspectIcon.textContent = '🖥️';
        setTimeout(() => {
            world.onWindowResize();
        }, 120);
    }

    // 3. Auto-Run Toggle Logic (Disabled by default: single car runs)
    if (btnAutoRunToggle) {
        btnAutoRunToggle.addEventListener('click', () => {
            autoRunEnabled = !autoRunEnabled;
            btnAutoRunToggle.classList.toggle('btn-toggle-active', autoRunEnabled);
            if (autorunIcon) autorunIcon.textContent = autoRunEnabled ? '⚡' : '💤';
        });
    }

    // 4. Restart Current Run Button
    function restartCurrentRun() {
        if (autoRunTimeout) {
            clearTimeout(autoRunTimeout);
            autoRunTimeout = null;
        }

        // Unpause if paused
        if (sim.isPaused) {
            togglePause();
        }

        if (currentMode === 'level') {
            selectLevel(currentLevelIndex);
        } else {
            const carId = carSelect.value;
            const carDef = window.carManager.getCarById(carId);
            const chainH = parseFloat(chainHeightSlider.value);
            sim.startRun([carDef], chainH);
        }
    }

    btnRestartRun.addEventListener('click', restartCurrentRun);

    // 5. Collapsible Drawer Toggle Logic
    let isDrawerCollapsed = false;
    function setDrawerCollapsed(collapsed) {
        isDrawerCollapsed = collapsed;
        drawer.classList.toggle('collapsed', collapsed);
        drawerArrow.textContent = collapsed ? '▲' : '▼';
        drawerLabel.textContent = collapsed ? 'Controls & Levels' : 'Hide Controls';
    }

    btnDrawerToggle.addEventListener('click', () => {
        setDrawerCollapsed(!isDrawerCollapsed);
    });

    // On mobile devices, start with drawer collapsed so the 3D scene is fully visible!
    if (window.innerWidth <= 768) {
        setDrawerCollapsed(true);
    }

    // 6. Cinema Mode (Clean View: 100% unobstructed screen)
    let isCinemaMode = false;
    function toggleCinemaMode() {
        isCinemaMode = !isCinemaMode;
        mainUiOverlay.classList.toggle('cinema-hidden', isCinemaMode);
        cinemaIcon.textContent = isCinemaMode ? '❌' : '👁️';
        if (cinemaText) cinemaText.textContent = isCinemaMode ? 'Exit Clean' : 'Clean View';
    }

    btnCinemaToggle.addEventListener('click', toggleCinemaMode);

    // Keyboard Shortcuts: 'P' (Pause), 'Space' (Pause/Resume or Launch), 'R' (Restart), 'C' (Cinema)
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        const key = e.key.toLowerCase();
        if (key === 'p') {
            e.preventDefault();
            togglePause();
        } else if (key === 'r') {
            restartCurrentRun();
        } else if (key === 'c') {
            toggleCinemaMode();
        } else if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            if (sim.state === 'RUNNING' || sim.state === 'CRUSHING') {
                togglePause();
            } else {
                restartCurrentRun();
            }
        }
    });

    // 6. Populate Car Select dropdown
    function refreshCarDropdown() {
        carSelect.innerHTML = '';
        const allCars = window.carManager.getAllCars();

        const optGroupPresets = document.createElement('optgroup');
        optGroupPresets.label = '🏎️ Standard Vehicles';

        const optGroupCustom = document.createElement('optgroup');
        optGroupCustom.label = '🛠️ Custom Built Vehicles';

        allCars.forEach(car => {
            const opt = document.createElement('option');
            opt.value = car.id;
            opt.textContent = `${car.name} (${car.height.toFixed(2)}m tall)`;
            if (car.isCustom) {
                optGroupCustom.appendChild(opt);
            } else {
                optGroupPresets.appendChild(opt);
            }
        });

        carSelect.appendChild(optGroupPresets);
        if (optGroupCustom.children.length > 0) {
            carSelect.appendChild(optGroupCustom);
        }
    }

    refreshCarDropdown();

    // 7. Populate Level Cards
    function renderLevelCards() {
        levelCardsContainer.innerHTML = '';
        window.GAME_LEVELS.forEach((lvl, idx) => {
            const card = document.createElement('div');
            card.className = `level-card ${idx === currentLevelIndex && currentMode === 'level' ? 'active' : ''}`;
            card.innerHTML = `
                <div class="level-card-header">
                    <span class="level-num">0${lvl.id}</span>
                    <span class="chain-badge">⛓️ ${lvl.chainHeight.toFixed(2)}m</span>
                </div>
                <div class="level-card-title">${lvl.title.replace(/Level \d+: /, '')}</div>
                <div class="level-car-icons">
                    ${lvl.carQueue.map(cId => {
                        const c = window.carManager.getCarById(cId);
                        return `<span class="car-pill" style="border-left: 2px solid ${c.bodyColor}">${c.name.split(' ')[0]}</span>`;
                    }).join('')}
                </div>
            `;
            card.addEventListener('click', () => {
                selectLevel(idx);
            });
            levelCardsContainer.appendChild(card);
        });
    }

    renderLevelCards();

    function selectLevel(idx) {
        if (autoRunTimeout) {
            clearTimeout(autoRunTimeout);
            autoRunTimeout = null;
        }

        currentMode = 'level';
        currentLevelIndex = idx;
        const lvl = window.GAME_LEVELS[idx];

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('tab-levels').classList.add('active');
        document.getElementById('levels-panel').style.display = 'block';
        document.getElementById('sandbox-panel').style.display = 'none';

        renderLevelCards();

        chainHeightSlider.value = lvl.chainHeight;
        chainHeightVal.textContent = lvl.chainHeight.toFixed(2) + 'm';

        const carDefs = lvl.carQueue.map(id => window.carManager.getCarById(id));
        sim.startRun(carDefs, lvl.chainHeight);
    }

    // 8. Status HUD Callback & Auto-Run Level Sequencer
    sim.onStatusChange = (info) => {
        hudStatus.classList.remove('status-running', 'status-passed', 'status-impact', 'status-crushed');

        if (info.state === 'RUNNING') {
            hudStatus.classList.add('status-running');
            hudTitle.textContent = `${info.car.name.toUpperCase()} • ${info.car.height.toFixed(2)}M`;

            const clearance = info.chainHeight - info.car.height;
            updateClearanceGauge(clearance);
            speedVal.textContent = Math.round(info.car.speed * 3.6);

        } else if (info.state === 'PASSED') {
            hudStatus.classList.add('status-passed');
            hudTitle.textContent = `CLEAR (+${info.clearanceCm}CM)`;
            clearanceGauge.style.background = '#22c55e';
            clearanceVal.textContent = `+${info.clearanceCm}cm (CLEAR)`;

        } else if (info.state === 'IMPACT') {
            hudStatus.classList.add('status-impact');
            hudTitle.textContent = `STRIKE (-${info.deficitCm}CM)`;
            clearanceGauge.style.background = '#ef4444';
            clearanceVal.textContent = `-${info.deficitCm}cm (STRIKE!)`;

        } else if (info.state === 'CRUSHED') {
            hudStatus.classList.add('status-crushed');
            hudTitle.textContent = 'CRUSHED!';

        } else if (info.state === 'FINISHED') {
            speedVal.textContent = '0';

            // Natural progression: cars come ONE BY ONE smoothly without freezing/pausing
            if (currentMode === 'level') {
                const nextLevelIdx = (currentLevelIndex + 1) % window.GAME_LEVELS.length;
                if (info.isSuccess) {
                    window.soundEngine.playLevelVictory();
                    hudStatus.classList.add('status-passed');
                    hudTitle.textContent = `CLEAR (+${info.clearanceCm || 0}CM) → NEXT CAR`;
                } else {
                    hudStatus.classList.add('status-crushed');
                    hudTitle.textContent = 'CRUSHED! → NEXT CAR';
                }

                autoRunTimeout = setTimeout(() => {
                    if (!sim.isPaused) {
                        selectLevel(nextLevelIdx);
                    }
                }, 2000);
            } else {
                if (info.isSuccess) {
                    hudStatus.classList.add('status-passed');
                    hudTitle.textContent = 'CLEAR! CLICK ▶ TO LAUNCH';
                } else {
                    hudStatus.classList.add('status-crushed');
                    hudTitle.textContent = 'CRUSHED! CLICK ▶ TO LAUNCH';
                }
            }
        }
    };

    function updateClearanceGauge(clearance) {
        if (clearance >= 0) {
            clearanceGauge.style.background = '#22c55e';
            clearanceVal.textContent = `+${Math.round(clearance * 100)}cm (Pass)`;
        } else {
            clearanceGauge.style.background = '#ef4444';
            clearanceVal.textContent = `${Math.round(clearance * 100)}cm (Crush!)`;
        }
    }

    // 9. Chain Height Slider Event
    chainHeightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        chainHeightVal.textContent = val.toFixed(2) + 'm';
        world.updateChainGeometry(val, 0);

        if (sim.activeCar) {
            const clearance = val - sim.activeCar.totalHeight;
            updateClearanceGauge(clearance);
        }
    });

    // 10. Tabs (Levels vs Sandbox)
    document.getElementById('tab-levels').addEventListener('click', () => {
        currentMode = 'level';
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('tab-levels').classList.add('active');
        document.getElementById('levels-panel').style.display = 'block';
        document.getElementById('sandbox-panel').style.display = 'none';
        selectLevel(currentLevelIndex);
    });

    document.getElementById('tab-sandbox').addEventListener('click', () => {
        currentMode = 'sandbox';
        if (autoRunTimeout) {
            clearTimeout(autoRunTimeout);
            autoRunTimeout = null;
        }
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('tab-sandbox').classList.add('active');
        document.getElementById('levels-panel').style.display = 'none';
        document.getElementById('sandbox-panel').style.display = 'block';
        document.querySelectorAll('.level-card').forEach(c => c.classList.remove('active'));
    });

    // 11. Sandbox Buttons (Single car only, no convoys)
    document.getElementById('btn-spawn-car').addEventListener('click', () => {
        currentMode = 'sandbox';
        const carId = carSelect.value;
        const carDef = window.carManager.getCarById(carId);
        const chainH = parseFloat(chainHeightSlider.value);
        sim.startRun([carDef], chainH);
    });

    const btnSandboxRestart = document.getElementById('btn-sandbox-restart');
    if (btnSandboxRestart) {
        btnSandboxRestart.addEventListener('click', restartCurrentRun);
    }

    document.getElementById('btn-manual-crush').addEventListener('click', () => {
        sim.triggerManualCrush();
    });

    // 12. Camera Presets
    document.querySelectorAll('.cam-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            const mode = btn.dataset.cam;
            btn.classList.add('active');
            world.setCameraPreset(mode);
        });
    });

    // 13. Simulation Speed Controls
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const speed = parseFloat(btn.dataset.speed);
            sim.setTimeScale(speed);
        });
    });

    // 14. Sound Toggle
    soundToggleBtn.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        soundIcon.textContent = isMuted ? '🔇' : '🔊';
        soundText.textContent = isMuted ? 'Muted' : 'Sound';
        soundToggleBtn.classList.toggle('muted', isMuted);
    });

    // 15. Custom Car Builder Modal & 3D Live Preview
    const modal = document.getElementById('custom-car-modal');
    const btnOpenBuilder = document.getElementById('btn-open-builder');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const formCustomCar = document.getElementById('custom-car-form');
    const previewContainer = document.getElementById('car-preview-canvas');

    btnOpenBuilder.addEventListener('click', () => {
        modal.classList.add('active');
        initPreviewScene();
        updateCarPreviewFromForm();
    });

    function closeModal() {
        modal.classList.remove('active');
        if (previewWorld && previewWorld.animId) {
            cancelAnimationFrame(previewWorld.animId);
            previewWorld = null;
        }
    }

    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    function initPreviewScene() {
        if (previewWorld) return;

        previewContainer.innerHTML = '';
        const width = previewContainer.clientWidth || 320;
        const height = previewContainer.clientHeight || 240;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f172a);

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
        camera.position.set(3.5, 2.2, 4.5);
        camera.lookAt(0, 0.8, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        previewContainer.appendChild(renderer.domElement);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        const pedGeom = new THREE.CylinderGeometry(2.5, 2.7, 0.2, 32);
        const pedMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
        const ped = new THREE.Mesh(pedGeom, pedMat);
        ped.position.y = -0.1;
        scene.add(ped);

        previewWorld = {
            scene: scene,
            camera: camera,
            renderer: renderer,
            currentMesh: null,
            rotGroup: new THREE.Group()
        };
        scene.add(previewWorld.rotGroup);

        function animatePreview() {
            if (!previewWorld) return;
            previewWorld.animId = requestAnimationFrame(animatePreview);
            previewWorld.rotGroup.rotation.y += 0.012;
            previewWorld.renderer.render(previewWorld.scene, previewWorld.camera);
        }
        animatePreview();
    }

    function updateCarPreviewFromForm() {
        if (!previewWorld) return;

        const carDef = {
            id: 'temp-preview',
            name: document.getElementById('custom-name').value || 'Preview Car',
            type: document.getElementById('custom-type').value,
            height: parseFloat(document.getElementById('custom-height').value),
            width: parseFloat(document.getElementById('custom-width').value),
            length: parseFloat(document.getElementById('custom-length').value),
            bodyColor: document.getElementById('custom-color').value,
            accentColor: document.getElementById('custom-accent').value,
            suspensionHeight: parseFloat(document.getElementById('custom-suspension').value),
            speed: parseFloat(document.getElementById('custom-speed').value),
            spoiler: document.getElementById('custom-spoiler').checked
        };

        document.getElementById('val-height').textContent = carDef.height.toFixed(2) + 'm';
        document.getElementById('val-width').textContent = carDef.width.toFixed(2) + 'm';
        document.getElementById('val-length').textContent = carDef.length.toFixed(2) + 'm';
        document.getElementById('val-suspension').textContent = carDef.suspensionHeight.toFixed(2) + 'm';
        document.getElementById('val-speed').textContent = Math.round(carDef.speed * 3.6) + ' km/h';

        if (previewWorld.currentMesh) {
            previewWorld.rotGroup.remove(previewWorld.currentMesh.root);
        }

        const previewCar = window.carManager.build3DCar(carDef);
        previewWorld.currentMesh = previewCar;
        previewWorld.rotGroup.add(previewCar.root);
    }

    ['custom-type', 'custom-height', 'custom-width', 'custom-length', 'custom-suspension', 'custom-speed', 'custom-color', 'custom-accent', 'custom-spoiler'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateCarPreviewFromForm);
    });

    formCustomCar.addEventListener('submit', (e) => {
        e.preventDefault();
        const carData = {
            name: document.getElementById('custom-name').value,
            type: document.getElementById('custom-type').value,
            height: document.getElementById('custom-height').value,
            width: document.getElementById('custom-width').value,
            length: document.getElementById('custom-length').value,
            suspensionHeight: document.getElementById('custom-suspension').value,
            speed: document.getElementById('custom-speed').value,
            bodyColor: document.getElementById('custom-color').value,
            accentColor: document.getElementById('custom-accent').value,
            spoiler: document.getElementById('custom-spoiler').checked
        };

        const newCar = window.carManager.addCustomCar(carData);
        refreshCarDropdown();
        carSelect.value = newCar.id;

        closeModal();

        document.getElementById('tab-sandbox').click();
        const chainH = parseFloat(chainHeightSlider.value);
        sim.startRun([newCar], chainH);
    });

    // 16. Animation & Render Loop
    let lastTime = performance.now();

    function animate(currentTime) {
        requestAnimationFrame(animate);

        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        sim.update(delta);
        world.render();
    }

    requestAnimationFrame(animate);

    // Initial start
    selectLevel(0);
});
