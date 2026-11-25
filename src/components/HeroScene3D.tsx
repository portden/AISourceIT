import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface HeroScene3DProps {
  ariaLabel: string;
}

const _pointerTarget = { x: 0, y: 0 };
const _upAxis = new THREE.Vector3(0, 1, 0);
const _tempVec = new THREE.Vector3();
const _shardDummy = new THREE.Object3D();

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0, 34, 68, 0.42)');
    grad.addColorStop(0.55, 'rgba(0, 56, 102, 0.18)');
    grad.addColorStop(1, 'rgba(0, 56, 102, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createRoundedFrameShape(size: number, radius: number, holeRatio: number): THREE.Shape {
  const shape = new THREE.Shape();
  const s = size;
  const r = radius;
  shape.moveTo(-s + r, -s);
  shape.lineTo(s - r, -s);
  shape.quadraticCurveTo(s, -s, s, -s + r);
  shape.lineTo(s, s - r);
  shape.quadraticCurveTo(s, s, s - r, s);
  shape.lineTo(-s + r, s);
  shape.quadraticCurveTo(-s, s, -s, s - r);
  shape.lineTo(-s, -s + r);
  shape.quadraticCurveTo(-s, -s, -s + r, -s);

  const hole = new THREE.Path();
  const h = size * holeRatio;
  const hr = radius * holeRatio;
  hole.moveTo(-h + hr, -h);
  hole.lineTo(h - hr, -h);
  hole.quadraticCurveTo(h, -h, h, -h + hr);
  hole.lineTo(h, h - hr);
  hole.quadraticCurveTo(h, h, h - hr, h);
  hole.lineTo(-h + hr, h);
  hole.quadraticCurveTo(-h, h, -h, h - hr);
  hole.lineTo(-h, -h + hr);
  hole.quadraticCurveTo(-h, -h, -h + hr, -h);
  shape.holes.push(hole);
  return shape;
}

function createChamferedSlabShape(w: number, h: number, c: number): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-w + c, -h);
  shape.lineTo(w - c, -h);
  shape.lineTo(w, -h + c);
  shape.lineTo(w, h - c);
  shape.lineTo(w - c, h);
  shape.lineTo(-w + c, h);
  shape.lineTo(-w, h - c);
  shape.lineTo(-w, -h + c);
  shape.closePath();
  return shape;
}

export function HeroScene3D({ ariaLabel }: HeroScene3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        preserveDrawingBuffer: isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const initWidth = Math.max(container.clientWidth, 300);
    const initHeight = Math.max(container.clientHeight, 300);
    renderer.setSize(initWidth, initHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      36,
      initWidth / initHeight,
      0.1,
      60
    );
    camera.position.set(0, 1.35, 7.6);
    camera.lookAt(0, -0.05, 0);

    // Three-point studio rig
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x004e82, 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.35);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const orangePoint = new THREE.PointLight(0xff8c24, 5.2, 16, 1.3);
    orangePoint.position.set(-2.5, 1.2, 3.4);
    scene.add(orangePoint);

    const rimLight = new THREE.DirectionalLight(0x8ae0ff, 1.9);
    rimLight.position.set(-4.5, 1.5, -4.5);
    scene.add(rimLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const pureWhiteCeramic = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.14,
      metalness: 0.06,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
    });

    const satinIceMetal = new THREE.MeshStandardMaterial({
      color: 0xe6f7fe,
      roughness: 0.24,
      metalness: 0.42,
    });

    const skyOpticalGlass = new THREE.MeshPhysicalMaterial({
      color: 0x26c6ff,
      roughness: 0.08,
      metalness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transmission: isSoftwareGl ? 0 : 0.72,
      transparent: true,
      opacity: isSoftwareGl ? 0.8 : 1,
      ior: 1.52,
      thickness: 0.95,
    });

    const deepSkyMetal = new THREE.MeshStandardMaterial({
      color: 0x005896,
      roughness: 0.18,
      metalness: 0.78,
    });

    const vibrantOrangeCore = new THREE.MeshPhysicalMaterial({
      color: 0xf58220,
      emissive: 0xff7700,
      emissiveIntensity: 0.46,
      roughness: 0.14,
      metalness: 0.24,
      clearcoat: 1.0,
    });

    materials.push(
      pureWhiteCeramic,
      satinIceMetal,
      skyOpticalGlass,
      deepSkyMetal,
      vibrantOrangeCore
    );

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Grounded Octagonal Architectural Pedestal
    const plinthGroup = new THREE.Group();
    plinthGroup.position.y = -1.72;

    const lowerPlinthGeo = new THREE.CylinderGeometry(2.25, 2.48, 0.22, 8);
    const lowerPlinth = new THREE.Mesh(lowerPlinthGeo, pureWhiteCeramic);
    lowerPlinth.receiveShadow = true;
    plinthGroup.add(lowerPlinth);

    const energyRingGeo = new THREE.TorusGeometry(1.96, 0.055, 16, 64);
    const energyRing = new THREE.Mesh(energyRingGeo, vibrantOrangeCore);
    energyRing.rotation.x = Math.PI / 2;
    energyRing.position.y = 0.13;
    plinthGroup.add(energyRing);

    const upperPlinthGeo = new THREE.CylinderGeometry(1.48, 1.66, 0.2, 8);
    const upperPlinth = new THREE.Mesh(upperPlinthGeo, deepSkyMetal);
    upperPlinth.position.y = 0.21;
    upperPlinth.receiveShadow = true;
    plinthGroup.add(upperPlinth);

    const shadowTex = createContactShadowTexture();
    const shadowPlaneGeo = new THREE.PlaneGeometry(5.6, 5.6);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.14;
    plinthGroup.add(shadowPlane);

    geometries.push(lowerPlinthGeo, energyRingGeo, upperPlinthGeo, shadowPlaneGeo);
    materials.push(shadowPlaneMat);
    textures.push(shadowTex);
    rootGroup.add(plinthGroup);

    // 2. Sculptural AI Core & Interlocking Architectural Portals
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.y = 0.24;
    rootGroup.add(sculptureGroup);

    const innerCoreGeo = new THREE.OctahedronGeometry(0.66, 1);
    const innerCore = new THREE.Mesh(innerCoreGeo, vibrantOrangeCore);
    innerCore.castShadow = !isSoftwareGl;
    sculptureGroup.add(innerCore);

    const gyroRingGeo = new THREE.TorusGeometry(0.9, 0.068, 20, 64);
    const gyroRingA = new THREE.Mesh(gyroRingGeo, pureWhiteCeramic);
    gyroRingA.rotation.set(Math.PI / 3, 0.2, 0);
    gyroRingA.castShadow = !isSoftwareGl;
    sculptureGroup.add(gyroRingA);

    const gyroRingB = new THREE.Mesh(gyroRingGeo, satinIceMetal);
    gyroRingB.scale.setScalar(1.1);
    gyroRingB.rotation.set(-Math.PI / 4, 0.9, 0.4);
    sculptureGroup.add(gyroRingB);

    const portalShape = createRoundedFrameShape(1.18, 0.24, 0.72);
    const portalGeo = new THREE.ExtrudeGeometry(portalShape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.05,
      bevelSegments: 3,
    });
    portalGeo.center();

    const portalWhite = new THREE.Mesh(portalGeo, pureWhiteCeramic);
    portalWhite.scale.setScalar(1.18);
    portalWhite.rotation.set(-0.48, -0.42, 0.65);
    portalWhite.castShadow = !isSoftwareGl;
    sculptureGroup.add(portalWhite);

    const portalGlass = new THREE.Mesh(portalGeo, skyOpticalGlass);
    portalGlass.scale.setScalar(0.98);
    portalGlass.rotation.set(0.42, 0.56, -0.18);
    sculptureGroup.add(portalGlass);

    // Helix blades & nodes
    const helixGroup = new THREE.Group();
    sculptureGroup.add(helixGroup);

    const bladeShape = createChamferedSlabShape(0.22, 0.34, 0.07);
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    bladeGeo.center();

    const hexNodeGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.54, 6);
    const orangeOrbGeo = new THREE.SphereGeometry(0.17, 24, 24);
    const strutGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8);

    const helixNodes: Array<{
      pos: [number, number, number];
      kind: 'blade' | 'hex' | 'orb';
    }> = [
      { pos: [1.82, 0.55, 0.38], kind: 'blade' },
      { pos: [-1.8, -0.45, 0.55], kind: 'blade' },
      { pos: [0.48, 1.62, -0.68], kind: 'blade' },
      { pos: [-0.55, -1.28, -0.58], kind: 'blade' },
      { pos: [1.28, -0.88, 0.92], kind: 'hex' },
      { pos: [-1.35, 1.08, -0.42], kind: 'hex' },
      { pos: [0.05, 1.88, 0.72], kind: 'orb' },
      { pos: [1.9, -0.08, -0.78], kind: 'orb' },
      { pos: [-1.62, 0.32, 1.18], kind: 'orb' },
    ];

    const animatedNodes: THREE.Mesh[] = [];

    helixNodes.forEach((node, idx) => {
      const geo =
        node.kind === 'blade'
          ? bladeGeo
          : node.kind === 'hex'
          ? hexNodeGeo
          : orangeOrbGeo;
      const mat =
        node.kind === 'blade'
          ? pureWhiteCeramic
          : node.kind === 'hex'
          ? deepSkyMetal
          : vibrantOrangeCore;

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...node.pos);
      mesh.rotation.set(idx * 0.55, idx * 0.85, 0.25);
      mesh.castShadow = !isSoftwareGl;
      helixGroup.add(mesh);
      animatedNodes.push(mesh);

      _tempVec.set(...node.pos);
      const len = _tempVec.length();
      const strut = new THREE.Mesh(strutGeo, satinIceMetal);
      strut.scale.y = len;
      strut.position.copy(_tempVec).multiplyScalar(0.5);
      strut.quaternion.setFromUnitVectors(_upAxis, _tempVec.clone().normalize());
      helixGroup.add(strut);
    });

    // Instanced floating shards
    const shardGeo = new THREE.OctahedronGeometry(0.08, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
    });
    const shardCount = 18;
    const shardInstanced = new THREE.InstancedMesh(shardGeo, shardMat, shardCount);
    const shardPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xf58220),
      new THREE.Color(0x9be4ff),
    ];

    for (let i = 0; i < shardCount; i++) {
      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 2.25 + (i % 3) * 0.35;
      const y = ((i % 5) - 2) * 0.5;
      _shardDummy.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius * 0.65 - 0.5
      );
      _shardDummy.rotation.set(i * 0.4, i * 0.7, 0.2);
      _shardDummy.scale.setScalar(0.75 + (i % 4) * 0.16);
      _shardDummy.updateMatrix();
      shardInstanced.setMatrixAt(i, _shardDummy.matrix);
      shardInstanced.setColorAt(i, shardPalette[i % shardPalette.length]);
    }
    shardInstanced.instanceMatrix.needsUpdate = true;
    if (shardInstanced.instanceColor) shardInstanced.instanceColor.needsUpdate = true;
    shardInstanced.computeBoundingSphere();
    rootGroup.add(shardInstanced);

    geometries.push(
      innerCoreGeo,
      gyroRingGeo,
      portalGeo,
      bladeGeo,
      hexNodeGeo,
      orangeOrbGeo,
      strutGeo,
      shardGeo
    );
    materials.push(shardMat);

    // Pointer interaction
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      _pointerTarget.x = ((e.clientX - rect.left) / rect.width - 0.5) * 0.5;
      _pointerTarget.y = ((e.clientY - rect.top) / rect.height - 0.5) * 0.25;

      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        dragOffsetX += dx * 0.0085;
        dragOffsetY = THREE.MathUtils.clamp(
          dragOffsetY + dy * 0.006,
          -0.45,
          0.45
        );
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(entry.contentRect.width, 200);
      const h = Math.max(entry.contentRect.height, 200);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    let frameId = 0;
    let disposed = false;
    const startTimeMs = performance.now();
    let lastTimeMs = startTimeMs;

    function afterDraw(cb: () => void) {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const nowMs = performance.now();
      const delta = Math.min((nowMs - lastTimeMs) / 1000, 0.1);
      lastTimeMs = nowMs;
      const elapsed = (nowMs - startTimeMs) / 1000;

      if (!prefersReducedMotion) {
        sculptureGroup.position.y = 0.24 + Math.sin(elapsed * 1.45) * 0.1;
        innerCore.rotation.y += delta * 0.65;
        innerCore.rotation.x += delta * 0.3;
        gyroRingA.rotation.z += delta * 0.45;
        gyroRingB.rotation.x -= delta * 0.38;
        portalGlass.rotation.z += delta * 0.25;
        portalWhite.rotation.y -= delta * 0.2;
        helixGroup.rotation.y += delta * 0.24;
        shardInstanced.rotation.y -= delta * 0.08;

        animatedNodes.forEach((m, idx) => {
          m.rotation.x += delta * (0.35 + idx * 0.04);
          m.rotation.y += delta * 0.42;
        });
      }

      const targetRotY = _pointerTarget.x + dragOffsetX;
      const targetRotX = _pointerTarget.y + dragOffsetY;

      rootGroup.rotation.y = THREE.MathUtils.damp(
        rootGroup.rotation.y,
        targetRotY,
        5,
        delta
      );
      rootGroup.rotation.x = THREE.MathUtils.damp(
        rootGroup.rotation.x,
        targetRotX,
        5,
        delta
      );

      renderer.render(scene, camera);

      if (prefersReducedMotion && !isDragging) {
        return;
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    renderer.render(scene, camera);
    if (!prefersReducedMotion) {
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tex) => tex.dispose());
      envTarget.dispose();
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="hero-3d-canvas"
      role="img"
      aria-label={ariaLabel}
      className="h-full w-full cursor-grab active:cursor-grabbing select-none"
    />
  );
}
