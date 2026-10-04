/**
 * Cars System for Car Crush (WeCrash)
 * Features high-fidelity procedural 3D vehicles, metallic automotive paint,
 * front facias with license plates, windshield glass fracture decals,
 * and authentic crush deformation matching BeamNG / WeCrash style.
 */

function createCrackedGlassTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Translucent glass base
    ctx.fillStyle = 'rgba(215, 235, 255, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Spiderweb impact fractures (matching Screenshot 2 & 3)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 2.5;

    const centers = [
        { x: 190, y: 135 },
        { x: 320, y: 125 }
    ];

    centers.forEach(c => {
        // Shatter concentric rings
        for (let r = 12; r < 145; r += 16 + Math.random() * 8) {
            ctx.beginPath();
            const segments = 14;
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                const dist = r + (Math.random() * 8 - 4);
                const x = c.x + Math.cos(angle) * dist * 1.35;
                const y = c.y + Math.sin(angle) * dist * 0.8;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Radial fracture lines
        const numSpokes = 32;
        for (let i = 0; i < numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
            ctx.beginPath();
            ctx.moveTo(c.x, c.y);
            let curX = c.x;
            let curY = c.y;
            const length = 75 + Math.random() * 150;
            const steps = 7;
            for (let s = 1; s <= steps; s++) {
                curX += (Math.cos(angle) * length) / steps + (Math.random() * 10 - 5);
                curY += (Math.sin(angle) * length * 0.7) / steps + (Math.random() * 10 - 5);
                ctx.lineTo(curX, curY);
            }
            ctx.stroke();
        }
    });

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

const PRESET_CARS = [
    {
        id: 'white-wedge',
        name: 'Alpine Wedge Racer',
        type: 'wedge',
        tagline: 'Ultra-low wedge aerodynamic profile (Passes Low Chains!)',
        height: 1.12,
        width: 1.95,
        length: 4.40,
        bodyColor: '#f8fafc',
        accentColor: '#1e293b',
        suspensionHeight: 0.18,
        speed: 24,
        weight: 1200,
        spoiler: true,
        plate: 'WEDGE 88',
        description: 'Sleek 80s supercar wedge designed to slide under low hanging barriers with millimeters of clearance.'
    },
    {
        id: 'blue-hypercar',
        name: 'Apex Cyan Hypercar',
        type: 'supercar',
        tagline: 'Streamlined exotic mid-engine racer (Passes easily)',
        height: 1.18,
        width: 2.05,
        length: 4.65,
        bodyColor: '#0284c7',
        accentColor: '#0f172a',
        suspensionHeight: 0.20,
        speed: 28,
        weight: 1350,
        spoiler: true,
        plate: 'APEX 01',
        description: 'Blisteringly fast and extremely low road-hugging hypercar matching the blue racer in Screenshot 1.'
    },
    {
        id: 'black-targa',
        name: 'Shadow Targa GT',
        type: 'targa',
        tagline: 'Low-slung grand tourer sports car',
        height: 1.25,
        width: 1.90,
        length: 4.35,
        bodyColor: '#18181b',
        accentColor: '#f59e0b',
        suspensionHeight: 0.22,
        speed: 22,
        weight: 1400,
        spoiler: false,
        plate: 'SHADOW 7',
        description: 'Low-slung classic sports coupe matching the front black car in Screenshot 1.'
    },
    {
        id: 'blue-van',
        name: 'Workforce Cargo Van',
        type: 'van',
        tagline: 'Tall utility van (Hits chain & gets CRUSHED!)',
        height: 2.12,
        width: 1.98,
        length: 5.10,
        bodyColor: '#1d4ed8',
        accentColor: '#94a3b8',
        suspensionHeight: 0.35,
        speed: 18,
        weight: 2300,
        spoiler: false,
        plate: 'YZQ 40R', // Exact license plate from Screenshot 2 & 3!
        description: 'The iconic heavy utility delivery van from the screenshot! High roof strikes chains below 2.1m and triggers catastrophic crusher squash.'
    },
    {
        id: 'red-suv',
        name: 'Titanium Trail SUV',
        type: 'suv',
        tagline: 'Tall family SUV with roof rack',
        height: 1.88,
        width: 2.08,
        length: 4.85,
        bodyColor: '#b91c1c',
        accentColor: '#18181b',
        suspensionHeight: 0.38,
        speed: 19,
        weight: 2200,
        spoiler: false,
        plate: 'TRAIL 4X',
        description: 'Rugged all-wheel-drive SUV with substantial ground clearance and tall cab.'
    },
    {
        id: 'monster-truck',
        name: 'Colossus Monster 4x4',
        type: 'monster',
        tagline: 'Massive lifted truck with huge wheels',
        height: 2.75,
        width: 2.45,
        length: 5.40,
        bodyColor: '#ea580c',
        accentColor: '#171717',
        suspensionHeight: 0.85,
        speed: 16,
        weight: 3800,
        spoiler: false,
        plate: 'MONSTER',
        description: 'Giant lifted off-roader towering over standard vehicles.'
    },
    {
        id: 'city-bus',
        name: 'Metro City Express Bus',
        type: 'bus',
        tagline: 'Huge long transit bus',
        height: 3.15,
        width: 2.50,
        length: 8.20,
        bodyColor: '#eab308',
        accentColor: '#0f172a',
        suspensionHeight: 0.40,
        speed: 14,
        weight: 8500,
        spoiler: false,
        plate: 'METRO 99',
        description: 'Massive public transport vehicle.'
    }
];

class CarManager {
    constructor() {
        this.customCars = this.loadCustomCars();
        this.crackedTexture = null;
    }

    getCrackedTexture() {
        if (!this.crackedTexture) {
            this.crackedTexture = createCrackedGlassTexture();
        }
        return this.crackedTexture;
    }

    loadCustomCars() {
        try {
            const data = localStorage.getItem('wecrash_custom_cars');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    saveCustomCars() {
        try {
            localStorage.setItem('wecrash_custom_cars', JSON.stringify(this.customCars));
        } catch (e) {
            console.error('Failed to save custom cars:', e);
        }
    }

    getAllCars() {
        return [...PRESET_CARS, ...this.customCars];
    }

    getCarById(id) {
        return this.getAllCars().find(c => c.id === id) || PRESET_CARS[0];
    }

    addCustomCar(carData) {
        const car = {
            id: 'custom-' + Date.now(),
            name: carData.name || 'Custom Vehicle',
            type: carData.type || 'supercar',
            tagline: `Custom Build (Height: ${Number(carData.height).toFixed(2)}m)`,
            height: Math.max(0.75, Math.min(3.6, parseFloat(carData.height) || 1.4)),
            width: Math.max(1.4, Math.min(2.8, parseFloat(carData.width) || 2.0)),
            length: Math.max(3.2, Math.min(8.5, parseFloat(carData.length) || 4.5)),
            bodyColor: carData.bodyColor || '#2563eb',
            accentColor: carData.accentColor || '#1e293b',
            suspensionHeight: Math.max(0.12, Math.min(0.9, parseFloat(carData.suspensionHeight) || 0.25)),
            speed: Math.max(12, Math.min(35, parseFloat(carData.speed) || 22)),
            weight: Math.round(parseFloat(carData.weight) || 1500),
            spoiler: !!carData.spoiler,
            plate: 'CUSTOM',
            isCustom: true
        };
        this.customCars.push(car);
        this.saveCustomCars();
        return car;
    }

    deleteCustomCar(id) {
        this.customCars = this.customCars.filter(c => c.id !== id);
        this.saveCustomCars();
    }

    /**
     * Builds a detailed procedural 3D vehicle facing oncoming (+Z forward)
     */
    build3DCar(carDef) {
        const group = new THREE.Group();
        group.name = 'Car_' + carDef.id;

        const bodyColor = new THREE.Color(carDef.bodyColor);
        const accentColor = new THREE.Color(carDef.accentColor || '#1e293b');

        // Premium automotive clearcoat paint shader
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: bodyColor,
            metalness: 0.72,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });

        const accentMaterial = new THREE.MeshStandardMaterial({
            color: accentColor,
            roughness: 0.5,
            metalness: 0.4
        });

        const chromeMaterial = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            metalness: 0.96,
            roughness: 0.08
        });

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x93c5fd,
            transmission: 0.65,
            opacity: 0.8,
            transparent: true,
            roughness: 0.08,
            ior: 1.52
        });

        const tireMaterial = new THREE.MeshStandardMaterial({
            color: 0x18181b,
            roughness: 0.9
        });

        const headlampGlassMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xfffae0,
            emissiveIntensity: 0.8
        });

        const amberMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xd97706,
            emissiveIntensity: 0.6
        });

        const L = carDef.length;
        const W = carDef.width;
        const H = carDef.height;
        const susp = carDef.suspensionHeight;

        const crushRoot = new THREE.Group();
        crushRoot.name = 'CrushRoot';
        group.add(crushRoot);

        const bodyGroup = new THREE.Group();
        bodyGroup.name = 'BodyMeshGroup';
        crushRoot.add(bodyGroup);

        // Lower chassis
        const chassisH = Math.max(0.35, H * 0.32);
        const chassisGeom = new THREE.BoxGeometry(W * 0.96, chassisH, L * 0.96);
        const chassis = new THREE.Mesh(chassisGeom, bodyMaterial);
        chassis.position.y = susp + chassisH / 2;
        chassis.castShadow = true;
        chassis.receiveShadow = true;
        bodyGroup.add(chassis);

        let cabinMesh = null;
        let windshieldMesh = null;
        const cabinH = H - chassisH - susp;

        if (carDef.type === 'van' || carDef.type === 'bus') {
            // Boxy tall van/bus style (matches Screenshot 2 & 3)
            const cabinL = L * 0.76;
            const cabinGeom = new THREE.BoxGeometry(W * 0.92, cabinH, cabinL, 6, 6, 8);
            cabinMesh = new THREE.Mesh(cabinGeom, bodyMaterial);
            cabinMesh.position.set(0, susp + chassisH + cabinH / 2, -L * 0.08);
            cabinMesh.castShadow = true;
            bodyGroup.add(cabinMesh);

            // Front Windshield (tilted forward facing +Z)
            const wsW = W * 0.84;
            const wsH = cabinH * 0.78;
            const wsGeom = new THREE.PlaneGeometry(wsW, wsH, 3, 3);
            windshieldMesh = new THREE.Mesh(wsGeom, glassMaterial.clone());
            windshieldMesh.rotation.x = THREE.MathUtils.degToRad(-15);
            windshieldMesh.position.set(0, susp + chassisH + cabinH * 0.46, cabinMesh.position.z + cabinL / 2 + 0.05);
            bodyGroup.add(windshieldMesh);

            // Front hood / nose
            const hoodL = L * 0.24;
            const hoodH = chassisH * 0.65;
            const hoodGeom = new THREE.BoxGeometry(W * 0.92, hoodH, hoodL);
            const hood = new THREE.Mesh(hoodGeom, bodyMaterial);
            hood.position.set(0, susp + chassisH + hoodH / 2 - 0.05, cabinMesh.position.z + cabinL / 2 + hoodL / 2);
            bodyGroup.add(hood);

            // Front chrome grille with dual horizontal bars (Screenshot 2)
            const grilleGeom = new THREE.BoxGeometry(W * 0.88, chassisH * 0.72, 0.12);
            const grille = new THREE.Mesh(grilleGeom, chromeMaterial);
            grille.position.set(0, susp + chassisH * 0.45, L * 0.5);
            bodyGroup.add(grille);

            // Front License Plate (Screenshot 2: "YZQ 40R")
            const plateCanvas = document.createElement('canvas');
            plateCanvas.width = 256;
            plateCanvas.height = 80;
            const pctx = plateCanvas.getContext('2d');
            pctx.fillStyle = '#ffffff';
            pctx.fillRect(0, 0, plateCanvas.width, plateCanvas.height);
            pctx.strokeStyle = '#1e293b';
            pctx.lineWidth = 4;
            pctx.strokeRect(4, 4, plateCanvas.width - 8, plateCanvas.height - 8);
            pctx.fillStyle = '#0f172a';
            pctx.font = 'bold 44px monospace';
            pctx.textAlign = 'center';
            pctx.textBaseline = 'middle';
            pctx.fillText(carDef.plate || 'YZQ 40R', 128, 42);

            const plateTex = new THREE.CanvasTexture(plateCanvas);
            const plateGeom = new THREE.PlaneGeometry(0.55, 0.18);
            const plateMesh = new THREE.Mesh(plateGeom, new THREE.MeshBasicMaterial({ map: plateTex }));
            plateMesh.position.set(0, susp + chassisH * 0.22, L * 0.51);
            bodyGroup.add(plateMesh);

        } else if (carDef.type === 'wedge' || carDef.type === 'supercar' || carDef.type === 'targa') {
            // Low, sleek wedge supercar (Screenshot 1 white wedge / blue supercar)
            const cabinL = L * 0.46;
            const cabinGeom = new THREE.BoxGeometry(W * 0.82, cabinH, cabinL, 4, 3, 5);
            cabinMesh = new THREE.Mesh(cabinGeom, bodyMaterial);
            cabinMesh.position.set(0, susp + chassisH + cabinH / 2, -L * 0.05);
            cabinMesh.castShadow = true;
            bodyGroup.add(cabinMesh);

            const wsW = W * 0.78;
            const wsH = Math.sqrt(cabinH * cabinH + (L * 0.32) * (L * 0.32));
            const wsGeom = new THREE.PlaneGeometry(wsW, wsH, 3, 3);
            windshieldMesh = new THREE.Mesh(wsGeom, glassMaterial.clone());
            windshieldMesh.rotation.x = THREE.MathUtils.degToRad(-35);
            windshieldMesh.position.set(0, susp + chassisH + cabinH * 0.5, cabinMesh.position.z + cabinL / 2 + 0.22);
            bodyGroup.add(windshieldMesh);

            // Low wedge nose
            const noseL = L * 0.45;
            const noseGeom = new THREE.ConeGeometry(W * 0.55, noseL, 4);
            const nose = new THREE.Mesh(noseGeom, bodyMaterial);
            nose.rotation.x = Math.PI / 2;
            nose.rotation.y = Math.PI / 4;
            nose.scale.set(1.3, 0.4, 0.4);
            nose.position.set(0, susp + chassisH * 0.4, L * 0.3);
            bodyGroup.add(nose);

            if (carDef.spoiler) {
                const wingGeom = new THREE.BoxGeometry(W * 0.85, 0.05, 0.3);
                const wing = new THREE.Mesh(wingGeom, accentMaterial);
                wing.position.set(0, susp + chassisH + cabinH * 0.9, -L * 0.46);
                bodyGroup.add(wing);

                const strutGeom = new THREE.CylinderGeometry(0.02, 0.02, cabinH * 0.5);
                const strutL = new THREE.Mesh(strutGeom, accentMaterial);
                strutL.position.set(-W * 0.3, susp + chassisH + cabinH * 0.65, -L * 0.46);
                const strutR = strutL.clone();
                strutR.position.x = W * 0.3;
                bodyGroup.add(strutL, strutR);
            }
        } else {
            // SUV / Standard body
            const cabinL = L * 0.6;
            const cabinGeom = new THREE.BoxGeometry(W * 0.88, cabinH, cabinL, 4, 3, 5);
            cabinMesh = new THREE.Mesh(cabinGeom, bodyMaterial);
            cabinMesh.position.set(0, susp + chassisH + cabinH / 2, -L * 0.08);
            cabinMesh.castShadow = true;
            bodyGroup.add(cabinMesh);

            const wsW = W * 0.8;
            const wsH = cabinH * 0.8;
            const wsGeom = new THREE.PlaneGeometry(wsW, wsH);
            windshieldMesh = new THREE.Mesh(wsGeom, glassMaterial.clone());
            windshieldMesh.rotation.x = THREE.MathUtils.degToRad(-25);
            windshieldMesh.position.set(0, susp + chassisH + cabinH * 0.45, cabinMesh.position.z + cabinL / 2 + 0.15);
            bodyGroup.add(windshieldMesh);

            const hoodGeom = new THREE.BoxGeometry(W * 0.88, chassisH * 0.6, L * 0.35);
            const hood = new THREE.Mesh(hoodGeom, bodyMaterial);
            hood.position.set(0, susp + chassisH * 0.8, L * 0.32);
            bodyGroup.add(hood);
        }

        // Headlights & Amber Turn Signals (facing oncoming viewer +Z)
        const hlGeom = new THREE.BoxGeometry(W * 0.16, 0.12, 0.08);
        const hlL = new THREE.Mesh(hlGeom, headlampGlassMat);
        hlL.position.set(-W * 0.36, susp + chassisH * 0.65, L * 0.5);
        const hlR = hlL.clone();
        hlR.position.x = W * 0.36;
        bodyGroup.add(hlL, hlR);

        // Amber turn signal indicators (Screenshot 1 & 2)
        const amL = new THREE.Mesh(new THREE.BoxGeometry(W * 0.12, 0.06, 0.06), amberMat);
        amL.position.set(-W * 0.36, susp + chassisH * 0.35, L * 0.5);
        const amR = amL.clone();
        amR.position.x = W * 0.36;
        bodyGroup.add(amL, amR);

        // Wheels
        const wheelRadius = carDef.type === 'monster' ? 0.62 : Math.max(0.28, susp * 1.05);
        const wheelWidth = carDef.type === 'monster' ? 0.48 : 0.28;
        const wheelGeom = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
        wheelGeom.rotateZ(Math.PI / 2);

        const rimGeom = new THREE.CylinderGeometry(wheelRadius * 0.6, wheelRadius * 0.6, wheelWidth + 0.02, 16);
        rimGeom.rotateZ(Math.PI / 2);

        const wheelOffsets = [
            { x: -W * 0.48, y: wheelRadius, z: L * 0.33, isLeft: true },
            { x: W * 0.48, y: wheelRadius, z: L * 0.33, isLeft: false },
            { x: -W * 0.48, y: wheelRadius, z: -L * 0.33, isLeft: true },
            { x: W * 0.48, y: wheelRadius, z: -L * 0.33, isLeft: false },
        ];

        if (carDef.type === 'bus') {
            wheelOffsets.push(
                { x: -W * 0.48, y: wheelRadius, z: -L * 0.1, isLeft: true },
                { x: W * 0.48, y: wheelRadius, z: -L * 0.1, isLeft: false }
            );
        }

        const wheelMeshes = [];
        const wheelsGroup = new THREE.Group();
        wheelsGroup.name = 'WheelsGroup';
        crushRoot.add(wheelsGroup);

        wheelOffsets.forEach(pos => {
            const wGroup = new THREE.Group();
            wGroup.position.set(pos.x, pos.y, pos.z);

            const tire = new THREE.Mesh(wheelGeom, tireMaterial);
            tire.castShadow = true;
            wGroup.add(tire);

            const rim = new THREE.Mesh(rimGeom, chromeMaterial);
            wGroup.add(rim);

            wheelsGroup.add(wGroup);
            wheelMeshes.push({
                group: wGroup,
                isLeft: pos.isLeft,
                originalX: pos.x,
                originalY: pos.y
            });
        });

        // Store original cabin vertices for high-detail crumple deformation
        let originalCabinVertices = null;
        if (cabinMesh && cabinMesh.geometry.attributes.position) {
            originalCabinVertices = cabinMesh.geometry.attributes.position.array.slice();
        }

        return {
            root: group,
            crushRoot: crushRoot,
            bodyGroup: bodyGroup,
            cabinMesh: cabinMesh,
            windshieldMesh: windshieldMesh,
            wheels: wheelMeshes,
            def: carDef,
            wheelRadius: wheelRadius,
            totalHeight: H,
            totalWidth: W,
            totalLength: L,
            isDamaged: false,
            crushedAmount: 0,

            spinWheels(distanceTraveled) {
                const angle = distanceTraveled / wheelRadius;
                wheelMeshes.forEach(w => {
                    w.group.rotation.x = angle;
                });
            },

            applyChainDamage() {
                if (this.isDamaged) return;
                this.isDamaged = true;

                if (this.windshieldMesh) {
                    const texture = window.carManager.getCrackedTexture();
                    this.windshieldMesh.material.map = texture;
                    this.windshieldMesh.material.opacity = 0.96;
                    this.windshieldMesh.material.needsUpdate = true;
                }

                // Front nose pitch down slightly on impact
                this.bodyGroup.rotation.x = THREE.MathUtils.degToRad(3.2);
            },

            applySquash(progress) {
                this.crushedAmount = progress;
                const p = Math.min(Math.max(progress, 0), 1);

                // 1. Extreme width compression (pancaked horizontally as seen in Screenshot 3!)
                const scaleX = 1 - p * 0.8;
                this.bodyGroup.scale.x = scaleX;

                // 2. Buckle & crumple: vertical extrusion & jagged roof ridge
                const buckleY = 1 + Math.sin(p * Math.PI) * 0.32;
                this.bodyGroup.scale.y = buckleY;

                // 3. Deform cabin vertices (roof peaks upward like a folded taco in Screenshot 3)
                if (this.cabinMesh && originalCabinVertices) {
                    const posAttr = this.cabinMesh.geometry.attributes.position;
                    const arr = posAttr.array;
                    for (let i = 0; i < arr.length; i += 3) {
                        const origX = originalCabinVertices[i];
                        const origY = originalCabinVertices[i + 1];
                        const origZ = originalCabinVertices[i + 2];

                        arr[i] = origX * (1 - p * 0.78);

                        // Center roof ridge buckles upward
                        const distFromCenter = Math.abs(origX) / (W * 0.5);
                        const pinch = Math.sin((origZ / L) * Math.PI * 4 + p * 3) * 0.22 * p;
                        arr[i + 1] = origY + (distFromCenter < 0.4 ? p * 0.48 : -p * 0.18) + pinch;

                        arr[i + 2] = origZ + Math.cos(origY * 5) * 0.18 * p;
                    }
                    posAttr.needsUpdate = true;
                    this.cabinMesh.geometry.computeVertexNormals();
                }

                // 4. Wheels buckle inward under extreme crusher pressure
                this.wheels.forEach(w => {
                    const dir = w.isLeft ? 1 : -1;
                    w.group.position.x = w.originalX * (1 - p * 0.74);
                    w.group.rotation.z = dir * p * 0.6;
                    w.group.position.y = w.originalY + p * 0.14;
                });
            },

            reset() {
                this.isDamaged = false;
                this.crushedAmount = 0;
                this.bodyGroup.scale.set(1, 1, 1);
                this.bodyGroup.rotation.set(0, 0, 0);

                if (this.windshieldMesh) {
                    this.windshieldMesh.material.map = null;
                    this.windshieldMesh.material.opacity = 0.8;
                    this.windshieldMesh.material.needsUpdate = true;
                }

                if (this.cabinMesh && originalCabinVertices) {
                    const posAttr = this.cabinMesh.geometry.attributes.position;
                    posAttr.array.set(originalCabinVertices);
                    posAttr.needsUpdate = true;
                    this.cabinMesh.geometry.computeVertexNormals();
                }

                this.wheels.forEach(w => {
                    w.group.position.set(w.originalX, w.originalY, w.group.position.z);
                    w.group.rotation.set(0, 0, 0);
                });
            }
        };
    }
}

window.carManager = new CarManager();
