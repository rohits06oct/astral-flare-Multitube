/**
 * 3D / 4D Scene Environment & Visual Assets for Car Crush (WeCrash)
 * Features solid cliff-anchored hydraulic housings with telescopic chrome pistons,
 * realistic brushed-steel crusher drums, sagging chain, "WeCrash" road stencil,
 * and canyon mountain environment that looks pristine in both Web Mode (widescreen)
 * and Mobile Mode (portrait).
 */

class CanyonWorld {
    constructor(canvasContainer) {
        this.container = canvasContainer;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        // Visual elements
        this.leftCrusher = null;
        this.rightCrusher = null;
        this.chainGroup = null;
        this.chainLinks = [];
        this.chainHeight = 1.75;
        this.dustParticles = null;

        // Dynamic 4D Camera variables
        this.cameraBasePos = new THREE.Vector3(0, 3.8, 10.5);
        this.cameraBaseTarget = new THREE.Vector3(0, 1.4, -3.5);
        this.cameraTarget = new THREE.Vector3().copy(this.cameraBaseTarget);
        this.cameraMode = 'screenshot';

        this.init();
    }

    init() {
        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x9bc2e6); // Desert blue sky
        this.scene.fog = new THREE.FogExp2(0xc89874, 0.005); // Warm canyon haze

        // 2. Camera: calibrated for both web widescreen and portrait shorts
        const aspect = width / height;
        const fov = aspect < 1.0 ? 66 : 46;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.2, 1200);
        this.setCameraPreset('screenshot');

        // 3. Renderer with high-end tone mapping & soft shadows
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
            stencil: false
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        // 4. Orbit Controls (for free inspection)
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
            this.controls.minDistance = 3;
            this.controls.maxDistance = 150;
            this.controls.enabled = false;
        }

        // 5. Lighting
        this.setupLighting();

        // 6. Sky & Canyon Terrain
        this.buildAtmosphericSky();
        this.buildCanyonTerrain();

        // 7. Mountain Highway with WeCrash stencil
        this.buildLongCurvedRoad();

        // 8. Foreground Crusher Machinery (Solid, cliff-grounded telescopic hydraulics)
        this.buildCrushers();
        this.buildChain();

        // 9. Floating dust motes
        this.buildAtmosphericDust();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x8a5538, 0.75);
        this.scene.add(hemiLight);

        const sun = new THREE.DirectionalLight(0xfffaec, 1.7);
        sun.position.set(-35, 55, 30);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        sun.shadow.camera.near = 2;
        sun.shadow.camera.far = 180;
        sun.shadow.camera.left = -25;
        sun.shadow.camera.right = 25;
        sun.shadow.camera.top = 30;
        sun.shadow.camera.bottom = -30;
        sun.shadow.bias = -0.0004;
        this.scene.add(sun);

        const rim = new THREE.DirectionalLight(0xf59e0b, 0.5);
        rim.position.set(35, 25, -45);
        this.scene.add(rim);
    }

    buildAtmosphericSky() {
        const skyGeo = new THREE.SphereGeometry(600, 32, 15);
        const skyMat = new THREE.MeshBasicMaterial({
            color: 0x86bfee,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    }

    buildCanyonTerrain() {
        const terrainGeom = new THREE.PlaneGeometry(600, 600, 90, 90);
        terrainGeom.rotateX(-Math.PI / 2);

        const pos = terrainGeom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const roadX = this.getRoadCenterlineX(z);
            const distFromRoad = Math.abs(x - roadX);
            const roadY = this.getRoadHeight(z);

            if (distFromRoad < 3.2) {
                // Road bed foundation: smoothly underneath road
                pos.setY(i, roadY - 0.04);
            } else if (distFromRoad < 8.0) {
                // Smooth road shoulders sloping gently away
                const t = (distFromRoad - 3.2) / 4.8;
                pos.setY(i, roadY - 0.04 - t * 0.18);
            } else {
                // Natural sweeping desert canyon terrain
                const d = distFromRoad - 8.0;
                const rise = Math.pow(Math.min(d / 45, 1.0), 1.6) * 7.5;
                const gentleHills = (Math.sin(x * 0.03 + 1.2) * Math.cos(z * 0.025) + Math.cos(x * 0.018)) * 3.2;
                pos.setY(i, roadY - 0.22 + Math.max(0, rise + gentleHills));
            }
        }
        terrainGeom.computeVertexNormals();

        const terrainMat = new THREE.MeshStandardMaterial({
            color: 0xba6842, // Warm desert sand & clay
            roughness: 0.94,
            metalness: 0.02,
            flatShading: true
        });

        const terrain = new THREE.Mesh(terrainGeom, terrainMat);
        terrain.receiveShadow = true;
        this.scene.add(terrain);

        this.createBackdropMesas();
        this.createDesertProps();
    }

    createBackdropMesas() {
        const mesaMat = new THREE.MeshStandardMaterial({
            color: 0xa85633,
            roughness: 0.96,
            metalness: 0.02
        });

        const mesaCoords = [
            { x: -140, y: 35, z: -200, w: 90, h: 50, d: 80 },
            { x: 0, y: 30, z: -230, w: 120, h: 45, d: 70 },
            { x: 140, y: 40, z: -190, w: 100, h: 55, d: 90 },
            { x: -80, y: 25, z: -140, w: 60, h: 35, d: 50 },
            { x: 100, y: 28, z: -150, w: 70, h: 38, d: 60 }
        ];

        mesaCoords.forEach(m => {
            const geom = new THREE.BoxGeometry(m.w, m.h, m.d);
            const mesh = new THREE.Mesh(geom, mesaMat);
            mesh.position.set(m.x, m.y / 2, m.z);
            this.scene.add(mesh);
        });
    }

    createDesertProps() {
        const propGroup = new THREE.Group();
        propGroup.name = 'DesertProps';

        const rockMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.95 });
        const rockGeoms = [
            new THREE.DodecahedronGeometry(0.8, 1),
            new THREE.DodecahedronGeometry(1.2, 0),
            new THREE.DodecahedronGeometry(0.6, 1)
        ];

        for (let z = -95; z <= 15; z += 7.5) {
            [-3.8, 3.8].forEach((sideOffset, sIdx) => {
                if (Math.random() < 0.6) {
                    const cx = this.getRoadCenterlineX(z);
                    const cy = this.getRoadHeight(z);
                    const geom = rockGeoms[(z + sIdx) % rockGeoms.length];
                    const rock = new THREE.Mesh(geom, rockMat);
                    rock.position.set(cx + sideOffset + (Math.random() - 0.5) * 0.8, cy + 0.35, z);
                    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
                    rock.scale.set(1 + Math.random() * 0.4, 0.7 + Math.random() * 0.5, 1 + Math.random() * 0.4);
                    rock.castShadow = true;
                    propGroup.add(rock);
                }
            });
        }

        const bushMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.9 });
        const bushGeom = new THREE.SphereGeometry(0.45, 6, 5);

        for (let z = -90; z <= 10; z += 5) {
            [-4.4, 4.4].forEach(sideOffset => {
                if (Math.random() < 0.55) {
                    const cx = this.getRoadCenterlineX(z);
                    const cy = this.getRoadHeight(z);
                    const bush = new THREE.Mesh(bushGeom, bushMat);
                    bush.position.set(cx + sideOffset + (Math.random() - 0.5), cy + 0.3, z);
                    bush.scale.set(1 + Math.random() * 0.5, 0.7 + Math.random() * 0.3, 1 + Math.random() * 0.5);
                    propGroup.add(bush);
                }
            });
        }

        this.scene.add(propGroup);
    }

    buildAtmosphericDust() {
        const dustCount = 80;
        const geom = new THREE.BufferGeometry();
        const positions = [];

        for (let i = 0; i < dustCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 16,
                Math.random() * 6 + 0.5,
                (Math.random() - 0.5) * 60 - 20
            );
        }

        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xfde68a,
            size: 0.08,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        this.dustParticles = new THREE.Points(geom, mat);
        this.scene.add(this.dustParticles);
    }

    getRoadCenterlineX(z) {
        if (z > 5) return 0;
        if (z > -14) return 0;
        const t = (-z - 14) / 95;
        return Math.sin(t * Math.PI * 1.5) * 3.6;
    }

    getRoadHeight(z) {
        if (z >= 0) return 0;
        const t = Math.min(Math.max(-z / 110, 0), 1);
        return Math.pow(t, 1.25) * 8.2;
    }

    getRoadTangent(z) {
        const dz = 0.5;
        const x1 = this.getRoadCenterlineX(z - dz);
        const y1 = this.getRoadHeight(z - dz);
        const x2 = this.getRoadCenterlineX(z + dz);
        const y2 = this.getRoadHeight(z + dz);

        return new THREE.Vector3(x2 - x1, y2 - y1, 2 * dz).normalize();
    }

    buildLongCurvedRoad() {
        const roadGroup = new THREE.Group();
        roadGroup.name = 'LongCurvedRoad';

        const totalSegments = 160;
        const minZ = -115;
        const maxZ = 25;
        const roadWidth = 5.2;

        const roadMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.88,
            metalness: 0.08
        });

        const roadGeom = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (let i = 0; i <= totalSegments; i++) {
            const t = i / totalSegments;
            const z = minZ + t * (maxZ - minZ);
            const cx = this.getRoadCenterlineX(z);
            const cy = this.getRoadHeight(z);

            const tangent = this.getRoadTangent(z);
            const normal = new THREE.Vector3(0, 1, 0);
            const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();

            const leftX = cx - binormal.x * (roadWidth / 2);
            const leftY = cy + 0.02;
            const leftZ = z - binormal.z * (roadWidth / 2);

            const rightX = cx + binormal.x * (roadWidth / 2);
            const rightY = cy + 0.02;
            const rightZ = z + binormal.z * (roadWidth / 2);

            vertices.push(leftX, leftY, leftZ);
            vertices.push(rightX, rightY, rightZ);

            normals.push(0, 1, 0, 0, 1, 0);
            uvs.push(0, t * 40, 1, t * 40);

            if (i < totalSegments) {
                const base = i * 2;
                indices.push(base, base + 1, base + 2);
                indices.push(base + 1, base + 3, base + 2);
            }
        }

        roadGeom.setIndex(indices);
        roadGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        roadGeom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        roadGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        const roadMesh = new THREE.Mesh(roadGeom, roadMat);
        roadMesh.receiveShadow = true;
        roadGroup.add(roadMesh);

        // Center Double Yellow Lines
        const yellowMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
        const yellowGeom = new THREE.BufferGeometry();
        const yVerts = [];
        const yIndices = [];
        const lineW = 0.12;

        for (let i = 0; i <= totalSegments; i++) {
            const t = i / totalSegments;
            const z = minZ + t * (maxZ - minZ);
            const cx = this.getRoadCenterlineX(z);
            const cy = this.getRoadHeight(z) + 0.025;

            yVerts.push(cx - lineW, cy, z);
            yVerts.push(cx + lineW, cy, z);

            if (i < totalSegments) {
                const base = i * 2;
                yIndices.push(base, base + 1, base + 2);
                yIndices.push(base + 1, base + 3, base + 2);
            }
        }

        yellowGeom.setIndex(yIndices);
        yellowGeom.setAttribute('position', new THREE.Float32BufferAttribute(yVerts, 3));
        const yellowLine = new THREE.Mesh(yellowGeom, yellowMat);
        roadGroup.add(yellowLine);

        // "WeCrash" Road Surface Markings Stencil
        this.addWeCrashStencil(roadGroup);

        // Skid marks on tarmac right before chain
        this.addBrakeSkidMarks(roadGroup);

        // Roadside yellow chevron signs (< and >)
        this.addRoadsideChevronSigns(roadGroup);

        this.scene.add(roadGroup);
    }

    addWeCrashStencil(parentGroup) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.font = '900 68px "Arial Black", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 6;
        ctx.fillText('WeCrash', canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const stencilMat = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.92
        });

        const stencilGeom = new THREE.PlaneGeometry(3.6, 0.95);
        stencilGeom.rotateX(-Math.PI / 2);
        stencilGeom.rotateY(Math.PI);

        const stencilMesh = new THREE.Mesh(stencilGeom, stencilMat);
        stencilMesh.position.set(0, 0.035, -2.8);
        parentGroup.add(stencilMesh);
    }

    addBrakeSkidMarks(parentGroup) {
        const skidMat = new THREE.MeshBasicMaterial({
            color: 0x18181b,
            transparent: true,
            opacity: 0.65
        });

        [-0.9, 0.9].forEach(xOffset => {
            const skidGeom = new THREE.PlaneGeometry(0.24, 4.5);
            skidGeom.rotateX(-Math.PI / 2);
            const skid = new THREE.Mesh(skidGeom, skidMat);
            skid.position.set(xOffset, 0.03, -1.8);
            parentGroup.add(skid);
        });
    }

    addRoadsideChevronSigns(parentGroup) {
        const signZCoords = [-18, -32, -48, -66, -84, -98];
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
        const blackMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

        signZCoords.forEach((z, idx) => {
            const cx = this.getRoadCenterlineX(z);
            const cy = this.getRoadHeight(z);
            const side = idx % 2 === 0 ? 1 : -1;
            const x = cx + side * 3.3;

            const group = new THREE.Group();
            group.position.set(x, cy, z);

            const poleGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.8);
            const pole = new THREE.Mesh(poleGeom, poleMat);
            pole.position.y = 0.9;
            pole.castShadow = true;
            group.add(pole);

            const diamondGeom = new THREE.BoxGeometry(0.5, 0.5, 0.04);
            const diamond = new THREE.Mesh(diamondGeom, yellowMat);
            diamond.rotation.z = Math.PI / 4;
            diamond.position.y = 1.6;
            diamond.castShadow = true;
            group.add(diamond);

            const arrowGeom = new THREE.BoxGeometry(0.2, 0.07, 0.05);
            const arrow = new THREE.Mesh(arrowGeom, blackMat);
            arrow.rotation.z = side > 0 ? -Math.PI / 4 : Math.PI / 4;
            arrow.position.set(0, 1.6, 0.025);
            group.add(arrow);

            parentGroup.add(group);
        });
    }

    /**
     * Build the massive industrial hydraulic crusher drums matching the screenshots!
     * Corrected for Web Mode (widescreen) and Mobile Mode:
     * - Firmly grounded cliff abutments flanking both sides of the road.
     * - Fixed outer hydraulic cylinder sleeve firmly rooted in the rock cliff.
     * - Telescopic chrome piston rod attached to the drum that slides cleanly into the sleeve.
     */
    buildCrushers() {
        const radius = 2.15;
        const depth = 1.35;

        const hazardTexture = this.createHazardStripeTexture();

        // 1. Build Left & Right Crusher Drums
        this.leftCrusher = this.createCrusherDrum(radius, depth, hazardTexture, true);
        this.rightCrusher = this.createCrusherDrum(radius, depth, hazardTexture, false);

        this.leftCrusher.baseX = -3.25;
        this.rightCrusher.baseX = 3.25;

        this.leftCrusher.group.position.set(this.leftCrusher.baseX, radius * 0.86, 0);
        this.rightCrusher.group.position.set(this.rightCrusher.baseX, radius * 0.86, 0);

        this.scene.add(this.leftCrusher.group);
        this.scene.add(this.rightCrusher.group);

    }

    createHazardStripeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Bright industrial safety orange base
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reflective silver bands (matching Screenshot 1, 2, 3)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 16, canvas.width, 18);
        ctx.fillRect(0, 54, canvas.width, 18);
        ctx.fillRect(0, 92, canvas.width, 18);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let x = 0; x < canvas.width; x += 14) {
            for (let y = 0; y < canvas.height; y += 14) {
                ctx.beginPath();
                ctx.arc(x + (y % 28 === 0 ? 7 : 0), y, 2.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(8, 1);
        return texture;
    }

    createCrusherDrum(radius, depth, hazardTexture, isLeft) {
        const group = new THREE.Group();
        group.name = isLeft ? 'LeftCrusher' : 'RightCrusher';

        const steelFaceMat = new THREE.MeshStandardMaterial({
            color: 0x9ca3af,
            metalness: 0.9,
            roughness: 0.22
        });

        const rimMat = new THREE.MeshStandardMaterial({
            map: hazardTexture,
            roughness: 0.35,
            metalness: 0.4
        });

        const darkSteelMat = new THREE.MeshStandardMaterial({
            color: 0x1f2937,
            metalness: 0.95,
            roughness: 0.15
        });

        const hexBoltMat = new THREE.MeshStandardMaterial({
            color: 0x111827,
            metalness: 0.98,
            roughness: 0.1
        });

        // 1. Solid closed outer rim cylinder (openEnded: false prevents see-through hollow tube)
        const rimGeom = new THREE.CylinderGeometry(radius, radius, depth, 48, 1, false);
        rimGeom.rotateZ(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeom, rimMat);
        rim.castShadow = true;
        group.add(rim);

        // 2. Crushing inner face (faces toward the road and car)
        const faceGeom = new THREE.CircleGeometry(radius * 0.98, 48);
        if (isLeft) {
            faceGeom.rotateY(Math.PI / 2);
        } else {
            faceGeom.rotateY(-Math.PI / 2);
        }
        const innerFace = new THREE.Mesh(faceGeom, steelFaceMat);
        innerFace.position.x = isLeft ? depth / 2 + 0.005 : -depth / 2 - 0.005;
        innerFace.receiveShadow = true;
        group.add(innerFace);

        // 3. Sealed outer back face (faces outward towards canyon - solid closed finish)
        const backFaceGeom = new THREE.CircleGeometry(radius * 0.98, 48);
        if (isLeft) {
            backFaceGeom.rotateY(-Math.PI / 2);
        } else {
            backFaceGeom.rotateY(Math.PI / 2);
        }
        const outerFace = new THREE.Mesh(backFaceGeom, steelFaceMat);
        outerFace.position.x = isLeft ? -depth / 2 - 0.005 : depth / 2 + 0.005;
        outerFace.receiveShadow = true;
        group.add(outerFace);

        // 4. Hexagonal industrial bolts around inner crushing circumference (Screenshot 1 & 2)
        const numBolts = 8;
        const boltRadius = radius * 0.76;
        for (let i = 0; i < numBolts; i++) {
            const angle = (i / numBolts) * Math.PI * 2;
            const boltGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.09, 6);
            boltGeom.rotateZ(Math.PI / 2);
            const bolt = new THREE.Mesh(boltGeom, hexBoltMat);
            const faceX = isLeft ? depth / 2 + 0.045 : -depth / 2 - 0.045;
            bolt.position.set(faceX, Math.sin(angle) * boltRadius, Math.cos(angle) * boltRadius);
            group.add(bolt);
        }

        // 5. Center hub & mounting shackle for chain
        const hubGeom = new THREE.CylinderGeometry(0.38, 0.38, depth + 0.15, 24);
        hubGeom.rotateZ(Math.PI / 2);
        const hub = new THREE.Mesh(hubGeom, darkSteelMat);
        group.add(hub);

        const shackleGeom = new THREE.TorusGeometry(0.24, 0.07, 12, 24);
        shackleGeom.rotateY(Math.PI / 2);
        const shackle = new THREE.Mesh(shackleGeom, darkSteelMat);
        shackle.position.set(isLeft ? depth / 2 + 0.12 : -depth / 2 - 0.12, 0, 0);
        group.add(shackle);

        return {
            group: group,
            isLeft: isLeft,
            baseX: 0,
            shacklePos: shackle.position
        };
    }

    buildChain() {
        if (this.chainGroup) {
            this.scene.remove(this.chainGroup);
        }

        this.chainGroup = new THREE.Group();
        this.chainGroup.name = 'ChainBarrier';
        this.chainLinks = [];

        const linkMat = new THREE.MeshStandardMaterial({
            color: 0x27272a,
            metalness: 0.94,
            roughness: 0.25
        });

        const linkRadius = 0.13;
        const tubeRadius = 0.042;
        const linkGeom = new THREE.TorusGeometry(linkRadius, tubeRadius, 10, 20);

        const numLinks = 28;
        for (let i = 0; i < numLinks; i++) {
            const mesh = new THREE.Mesh(linkGeom, linkMat);
            mesh.castShadow = true;
            this.chainGroup.add(mesh);
            this.chainLinks.push(mesh);
        }

        this.scene.add(this.chainGroup);
        this.updateChainGeometry(this.chainHeight, 0);
    }

    updateChainGeometry(centerHeight, impactTension = 0) {
        this.chainHeight = centerHeight;
        if (!this.chainLinks.length || !this.leftCrusher || !this.rightCrusher) return;

        const leftX = this.leftCrusher.group.position.x + 0.8;
        const rightX = this.rightCrusher.group.position.x - 0.8;
        const anchorY = this.leftCrusher.group.position.y;

        const span = rightX - leftX;
        const sagAmount = Math.max(0.1, (anchorY - centerHeight) * (1 - impactTension * 0.85));

        const numLinks = this.chainLinks.length;
        for (let i = 0; i < numLinks; i++) {
            const t = (i + 0.5) / numLinks;
            const x = leftX + t * span;

            const normX = (t - 0.5) * 2;
            const y = centerHeight + (normX * normX) * sagAmount;
            const z = impactTension > 0 ? -Math.sin(t * Math.PI) * 0.45 * impactTension : 0;

            const link = this.chainLinks[i];
            link.position.set(x, y, z);

            const tangentAngle = Math.atan2(normX * sagAmount * 2, span / 2);
            link.rotation.z = tangentAngle;
            link.rotation.y = i % 2 === 0 ? 0 : Math.PI / 2;
            link.rotation.x = impactTension * 0.3;
        }
    }

    setCameraPreset(mode) {
        this.cameraMode = mode;

        if (this.controls) {
            this.controls.enabled = (mode === 'free');
        }

        switch (mode) {
            case 'screenshot':
                this.cameraBasePos.set(0, 3.8, 10.5);
                this.cameraBaseTarget.set(0, 1.4, -3.5);
                this.camera.position.copy(this.cameraBasePos);
                this.cameraTarget.copy(this.cameraBaseTarget);
                this.camera.lookAt(this.cameraTarget);
                break;

            case 'side':
                this.camera.position.set(-6.8, 2.4, 2.0);
                this.cameraTarget.set(0, 1.3, 0);
                this.camera.lookAt(this.cameraTarget);
                break;

            case 'hood':
                this.camera.position.set(0, 7.5, 12.0);
                this.cameraTarget.set(0, 1.2, -10.0);
                this.camera.lookAt(this.cameraTarget);
                break;

            case 'free':
                if (this.controls) {
                    this.controls.target.copy(this.cameraTarget);
                }
                break;
        }
    }

    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;

        this.camera.aspect = aspect;
        this.camera.fov = aspect < 1.0 ? 66 : 46;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    render() {
        if (this.controls && this.controls.enabled) {
            this.controls.update();
        }

        if (this.dustParticles) {
            this.dustParticles.rotation.y += 0.0008;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

window.CanyonWorld = CanyonWorld;
