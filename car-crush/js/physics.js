/**
 * Physics & Simulation Engine for Car Crush (WeCrash)
 * Strictly runs ONE single vehicle at a time (no multiple cars or convoys).
 * When vehicle passes or is crushed, no new car comes automatically.
 * Supports Pause/Resume state and 4D camera impact dynamics.
 */

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];

        this.glassGeom = new THREE.BoxGeometry(0.08, 0.08, 0.03);
        this.glassMat = new THREE.MeshBasicMaterial({
            color: 0xbae6fd,
            transparent: true,
            opacity: 0.95
        });

        this.smokeGeom = new THREE.SphereGeometry(0.2, 6, 6);
        this.smokeMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            transparent: true,
            opacity: 0.45,
            roughness: 1.0
        });
    }

    emitSparks(origin, count = 35) {
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(this.glassGeom, new THREE.MeshBasicMaterial({
                color: Math.random() > 0.3 ? 0xff9900 : 0xffffff
            }));
            mesh.position.copy(origin);
            mesh.position.x += (Math.random() - 0.5) * 0.4;
            mesh.position.y += (Math.random() - 0.5) * 0.4;
            mesh.position.z += (Math.random() - 0.5) * 0.4;

            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 9,
                Math.random() * 8 + 2.5,
                (Math.random() - 0.5) * 9
            );

            this.scene.add(mesh);
            this.particles.push({
                mesh: mesh,
                velocity: velocity,
                gravity: -16,
                life: 0.7 + Math.random() * 0.4,
                maxLife: 1.1,
                type: 'spark'
            });
        }
    }

    emitGlassShards(origin, count = 60) {
        for (let i = 0; i < count; i++) {
            const mesh = new THREE.Mesh(this.glassGeom, this.glassMat.clone());
            mesh.position.copy(origin);
            mesh.position.x += (Math.random() - 0.5) * 0.9;
            mesh.position.y += (Math.random() - 0.5) * 0.5;

            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 11,
                Math.random() * 9 + 2.5,
                (Math.random() - 0.5) * 9 + 2
            );

            const rotSpeed = new THREE.Vector3(
                Math.random() * 20,
                Math.random() * 20,
                Math.random() * 20
            );

            this.scene.add(mesh);
            this.particles.push({
                mesh: mesh,
                velocity: velocity,
                rotSpeed: rotSpeed,
                gravity: -14,
                life: 1.0 + Math.random() * 0.5,
                maxLife: 1.5,
                type: 'glass'
            });
        }
    }

    emitSmoke(origin, count = 20, isSteam = false) {
        for (let i = 0; i < count; i++) {
            const mat = this.smokeMat.clone();
            if (isSteam) {
                mat.color.setHex(0xf1f5f9);
                mat.opacity = 0.45;
            }
            const mesh = new THREE.Mesh(this.smokeGeom, mat);
            mesh.position.copy(origin);
            mesh.position.x += (Math.random() - 0.5) * 0.7;
            mesh.position.y += Math.random() * 0.3;
            mesh.position.z += (Math.random() - 0.5) * 0.7;

            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 3.8 + 1.2,
                (Math.random() - 0.5) * 2
            );

            this.scene.add(mesh);
            this.particles.push({
                mesh: mesh,
                velocity: velocity,
                gravity: 0.6,
                life: 0.85 + Math.random() * 0.6,
                maxLife: 1.45,
                type: 'smoke'
            });
        }
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= delta;

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
                continue;
            }

            p.velocity.y += p.gravity * delta;
            p.mesh.position.addScaledVector(p.velocity, delta);

            if (p.mesh.position.y < 0.05) {
                p.mesh.position.y = 0.05;
                p.velocity.y *= -0.25;
                p.velocity.x *= 0.6;
                p.velocity.z *= 0.6;
            }

            if (p.rotSpeed) {
                p.mesh.rotation.x += p.rotSpeed.x * delta;
                p.mesh.rotation.y += p.rotSpeed.y * delta;
            }

            if (p.mesh.material.opacity !== undefined) {
                p.mesh.material.opacity = (p.life / p.maxLife) * (p.type === 'smoke' ? 0.45 : 0.95);
            }
            if (p.type === 'smoke') {
                const scale = 1 + (1 - p.life / p.maxLife) * 3.5;
                p.mesh.scale.set(scale, scale, scale);
            }
        }
    }

    clear() {
        this.particles.forEach(p => {
            this.scene.remove(p.mesh);
        });
        this.particles = [];
    }
}

class SimulationController {
    constructor(world) {
        this.world = world;
        this.particles = new ParticleSystem(world.scene);

        this.userTimeScale = 1.0;
        this.effectiveTimeScale = 1.0;
        this.activeCar = null;
        this.currentCarDef = null;
        this.isPaused = false; // Pause toggle support

        this.state = 'IDLE'; // 'IDLE', 'RUNNING', 'IMPACT', 'CRUSHING', 'RETRACTING', 'FINISHED'
        this.stateTimer = 0;
        this.hornTriggered = false;
        this.skidTriggered = false;
        this.crushSoundTriggered = false;

        this.shakeIntensity = 0;
        this.shakeDecay = 4.0;

        this.onStatusChange = null;
        this.onCarComplete = null;
    }

    triggerShake(intensity = 0.4) {
        this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
    }

    setTimeScale(scale) {
        this.userTimeScale = scale;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        return this.isPaused;
    }

    /**
     * Start a simulation run for ONE vehicle
     */
    startRun(carDefs, chainHeight = null) {
        this.clearActiveRun();

        if (chainHeight !== null) {
            this.world.chainHeight = chainHeight;
            this.world.updateChainGeometry(chainHeight, 0);
        }

        // Take only ONE car definition for the run
        const carDef = Array.isArray(carDefs) ? carDefs[0] : carDefs;
        this.currentCarDef = carDef;
        this.spawnCar(carDef);
    }

    restartCurrent() {
        if (!this.currentCarDef) return;
        this.startRun(this.currentCarDef, this.world.chainHeight);
    }

    spawnCar(carDef) {
        if (this.activeCar) {
            this.world.scene.remove(this.activeCar.root);
            this.activeCar = null;
        }

        this.activeCar = window.carManager.build3DCar(carDef);

        // Position single car high on mountain highway (Z = -85m)
        const startZ = -85;
        this.setCarPositionOnRoad(this.activeCar, startZ);
        this.world.scene.add(this.activeCar.root);

        // Reset crusher drums to parked open position
        this.world.leftCrusher.group.position.x = this.world.leftCrusher.baseX;
        this.world.rightCrusher.group.position.x = this.world.rightCrusher.baseX;
        this.world.updateChainGeometry(this.world.chainHeight, 0);

        this.state = 'RUNNING';
        this.stateTimer = 0;
        this.crushSoundTriggered = false;
        this.hornTriggered = false;
        this.skidTriggered = false;
        this.effectiveTimeScale = this.userTimeScale;

        // Reset camera
        if (this.world.cameraMode === 'screenshot') {
            this.world.camera.position.copy(this.world.cameraBasePos);
            this.world.camera.lookAt(this.world.cameraBaseTarget);
        }

        if (!this.isPaused) {
            window.soundEngine.startEngine(carDef.speed);
        }

        if (this.onStatusChange) {
            this.onStatusChange({
                state: 'RUNNING',
                car: carDef,
                chainHeight: this.world.chainHeight
            });
        }
    }

    setCarPositionOnRoad(car, z) {
        const x = this.world.getRoadCenterlineX(z);
        const y = this.world.getRoadHeight(z);
        car.root.position.set(x, y, z);

        const tangent = this.world.getRoadTangent(z);
        const yaw = Math.atan2(tangent.x, tangent.z);
        const pitch = -Math.atan2(tangent.y, Math.hypot(tangent.x, tangent.z));
        car.root.rotation.set(pitch, yaw, 0);
    }

    clearActiveRun() {
        if (this.activeCar) {
            this.world.scene.remove(this.activeCar.root);
            this.activeCar = null;
        }
        this.particles.clear();
        window.soundEngine.stopEngine();
        this.state = 'IDLE';
    }

    update(rawDelta) {
        // Pause check
        if (this.isPaused) return;

        // Slow-motion time dilation during crusher crunch
        if (this.state === 'CRUSHING') {
            this.effectiveTimeScale = THREE.MathUtils.lerp(this.effectiveTimeScale, 0.45 * this.userTimeScale, 0.1);
        } else {
            this.effectiveTimeScale = THREE.MathUtils.lerp(this.effectiveTimeScale, this.userTimeScale, 0.12);
        }

        const delta = Math.min(rawDelta, 0.1) * this.effectiveTimeScale;

        this.particles.update(delta);

        // Screen shake
        if (this.shakeIntensity > 0.001) {
            this.shakeIntensity -= this.shakeDecay * delta;
            if (this.world.cameraMode !== 'free') {
                const ox = (Math.random() - 0.5) * this.shakeIntensity;
                const oy = (Math.random() - 0.5) * this.shakeIntensity;
                this.world.camera.position.x += ox;
                this.world.camera.position.y += oy;
            }
        }

        if (!this.activeCar) return;

        const car = this.activeCar;
        const speed = car.def.speed;

        switch (this.state) {
            case 'RUNNING': {
                const moveDist = speed * delta;
                const newZ = car.root.position.z + moveDist;
                this.setCarPositionOnRoad(car, newZ);
                car.spinWheels(moveDist);

                window.soundEngine.updateSpeedAudio(speed / 18);

                // Tire skid sound on road curves
                const roadTangentX = Math.abs(this.world.getRoadTangent(newZ).x);
                if (roadTangentX > 0.18 && Math.random() < 0.04) {
                    window.soundEngine.playTireSkid(0.4);
                }

                // Road dust trail
                if (Math.random() < 0.28) {
                    const dustPos = new THREE.Vector3(
                        car.root.position.x + (Math.random() - 0.5) * 1.5,
                        car.root.position.y + 0.1,
                        car.root.position.z - car.totalLength * 0.4
                    );
                    this.particles.emitSmoke(dustPos, 2);
                }

                const currentZ = car.root.position.z;
                const clearance = this.world.chainHeight - car.totalHeight;
                const frontZ = currentZ + (car.totalLength * 0.45);

                // Emergency car horn honk right before chain if too tall!
                if (clearance < 0.0 && frontZ >= -14 && !this.hornTriggered) {
                    this.hornTriggered = true;
                    window.soundEngine.playCarHorn();
                }

                // Emergency skid screech sound right before impact
                if (clearance < 0.0 && frontZ >= -5 && !this.skidTriggered) {
                    this.skidTriggered = true;
                    window.soundEngine.playTireSkid(0.85);
                }

                // Reach chain barrier at Z = 0
                if (frontZ >= 0.0) {
                    if (clearance >= 0.0) {
                        this.state = 'PASSED';
                        this.stateTimer = 0;
                        window.soundEngine.playPassSuccess();
                        if (this.onStatusChange) {
                            this.onStatusChange({
                                state: 'PASSED',
                                car: car.def,
                                clearanceCm: Math.round(clearance * 100)
                            });
                        }
                    } else {
                        this.state = 'IMPACT';
                        this.stateTimer = 0;

                        window.soundEngine.playChainHit();
                        window.soundEngine.playGlassShatter();
                        window.soundEngine.stopEngine();

                        car.applyChainDamage();
                        this.world.updateChainGeometry(this.world.chainHeight, 1.0);

                        const impactPoint = new THREE.Vector3(0, this.world.chainHeight, 0);
                        this.particles.emitGlassShards(impactPoint, 50);
                        this.particles.emitSparks(impactPoint, 35);
                        this.particles.emitSmoke(new THREE.Vector3(0, 0.4, 0), 18);

                        this.triggerShake(0.38);

                        if (this.onStatusChange) {
                            this.onStatusChange({
                                state: 'IMPACT',
                                car: car.def,
                                deficitCm: Math.round(Math.abs(clearance) * 100)
                            });
                        }
                    }
                }
                break;
            }

            case 'PASSED': {
                const moveDist = speed * delta;
                const newZ = car.root.position.z + moveDist;
                this.setCarPositionOnRoad(car, newZ);
                car.spinWheels(moveDist);

                this.stateTimer += delta;
                if (this.stateTimer > 2.2 || car.root.position.z > 22) {
                    // Car passed successfully: STOP! DO NOT send multiple cars or cars together!
                    this.finishCarRun(true);
                }
                break;
            }

            case 'IMPACT': {
                this.stateTimer += delta;
                if (this.stateTimer > 0.15 && this.stateTimer < 0.22) {
                    window.soundEngine.playWarningSiren();
                }

                if (this.stateTimer > 0.36) {
                    this.state = 'CRUSHING';
                    this.stateTimer = 0;
                }
                break;
            }

            case 'CRUSHING': {
                this.stateTimer += delta;
                const crushDuration = 0.52;
                const progress = Math.min(this.stateTimer / crushDuration, 1.0);
                const easeProgress = Math.pow(progress, 1.8);

                const startX = 3.25;
                const minTargetX = 0.42;
                const curOffset = startX - (startX - minTargetX) * easeProgress;

                this.world.leftCrusher.group.position.x = -curOffset;
                this.world.rightCrusher.group.position.x = curOffset;
                this.world.updateChainGeometry(this.world.chainHeight, 0.35);

                car.applySquash(easeProgress);

                if (this.world.cameraMode === 'screenshot') {
                    const punchDist = easeProgress * 1.5;
                    this.world.camera.position.z = this.world.cameraBasePos.z - punchDist;
                }

                if (progress > 0.3 && progress < 0.95 && Math.random() < 0.6) {
                    const sparkX = (Math.random() - 0.5) * curOffset * 2;
                    this.particles.emitSparks(new THREE.Vector3(sparkX, 1.2, 0), 6);
                }

                if (progress >= 0.45 && !this.crushSoundTriggered) {
                    this.crushSoundTriggered = true;
                    window.soundEngine.playCrusherImpact();
                    this.triggerShake(0.8);

                    this.particles.emitGlassShards(new THREE.Vector3(0, 1.4, 0), 60);
                    this.particles.emitSparks(new THREE.Vector3(0, 1.2, 0), 50);
                    this.particles.emitSmoke(new THREE.Vector3(0, 0.8, 0), 32);
                }

                if (progress >= 1.0) {
                    if (this.stateTimer > crushDuration + 0.9) {
                        this.state = 'RETRACTING';
                        this.stateTimer = 0;
                        this.crushSoundTriggered = false;
                        window.soundEngine.playSteamHiss();
                        this.particles.emitSmoke(new THREE.Vector3(-1.2, 1.5, 0), 16, true);
                        this.particles.emitSmoke(new THREE.Vector3(1.2, 1.5, 0), 16, true);

                        if (this.onStatusChange) {
                            this.onStatusChange({
                                state: 'CRUSHED',
                                car: car.def
                            });
                        }
                    }
                }
                break;
            }

            case 'RETRACTING': {
                this.stateTimer += delta;
                const retractDuration = 1.0;
                const progress = Math.min(this.stateTimer / retractDuration, 1.0);
                const easeRetract = 1 - Math.cos((progress * Math.PI) / 2);

                const minTargetX = 0.42;
                const startX = 3.25;
                const curOffset = minTargetX + (startX - minTargetX) * easeRetract;

                this.world.leftCrusher.group.position.x = -curOffset;
                this.world.rightCrusher.group.position.x = curOffset;
                this.world.updateChainGeometry(this.world.chainHeight, 0);

                if (this.world.cameraMode === 'screenshot') {
                    this.world.camera.position.z = THREE.MathUtils.lerp(
                        this.world.camera.position.z,
                        this.world.cameraBasePos.z,
                        0.08
                    );
                }

                if (progress >= 1.0) {
                    // Car crushed: STOP! Stays crushed as scrap on road! NO new car comes!
                    this.finishCarRun(false);
                }
                break;
            }
        }
    }

    finishCarRun(isSuccess) {
        this.state = 'FINISHED';

        if (this.onCarComplete) {
            this.onCarComplete({
                car: this.activeCar ? this.activeCar.def : null,
                isSuccess: isSuccess
            });
        }

        if (this.onStatusChange) {
            this.onStatusChange({
                state: 'FINISHED',
                isSuccess: isSuccess,
                car: this.activeCar ? this.activeCar.def : null
            });
        }
    }

    triggerManualCrush() {
        if (this.state === 'RUNNING' || this.state === 'IMPACT') {
            this.state = 'CRUSHING';
            this.stateTimer = 0;
            this.crushSoundTriggered = false;
        }
    }
}

window.SimulationController = SimulationController;
