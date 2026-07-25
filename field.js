/* Ambient Verification Field Animation */
(function () {
  const canvas = document.getElementById('field');
  if (!canvas || typeof THREE === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 26;

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true,
  });
  renderer.setClearColor(0x000000, 0);

  const TEAL = new THREE.Color(0x0E7C6B);
  const TEAL_DEEP = new THREE.Color(0x0A5A4E);
  const GOLD = new THREE.Color(0xC9922A);

  const COUNT = 140;
  const FLAGGED = 8;
  const group = new THREE.Group();
  scene.add(group);

  const barGeo = new THREE.PlaneGeometry(0.34, 0.9);

  const marks = [];
  for (let i = 0; i < COUNT; i++) {
    const flagged = i < FLAGGED;
    const base = flagged ? GOLD : (Math.random() > 0.5 ? TEAL : TEAL_DEEP);
    const mat = new THREE.MeshBasicMaterial({
      color: base,
      transparent: true,
      opacity: flagged ? 0.55 : (0.10 + Math.random() * 0.16),
      depthWrite: false,
    });
    const m = new THREE.Mesh(barGeo, mat);

    m.position.set(
      (Math.random() - 0.5) * 60,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20
    );
    m.userData = {
      driftY: 0.004 + Math.random() * 0.010,
      swayAmp: 0.3 + Math.random() * 0.8,
      swayFreq: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      flagged,
      pulse: 0.5 + Math.random(),
    };
    group.add(m);
    marks.push(m);
  }

  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  if (!reduced) {
    window.addEventListener('pointermove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();

  function frame() {
    const t = clock.getElapsedTime();

    for (const m of marks) {
      const u = m.userData;
      m.position.y += u.driftY;
      if (m.position.y > 21) m.position.y = -21;
      m.position.x += Math.sin(t * u.swayFreq + u.phase) * 0.003 * u.swayAmp;
      if (u.flagged) {
        m.material.opacity = 0.4 + Math.sin(t * u.pulse + u.phase) * 0.18;
      }
    }

    curX += (targetX - curX) * 0.03;
    curY += (targetY - curY) * 0.03;
    group.rotation.y = curX * 0.12;
    group.rotation.x = -curY * 0.08;

    renderer.render(scene, camera);
    if (!reduced) requestAnimationFrame(frame);
  }

  if (reduced) {
    renderer.render(scene, camera);
  } else {
    frame();
  }
})();
