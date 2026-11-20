// The 3D gallery: a long museum hall built from content.js.
// Scrolling moves the camera along a path of "waypoints", one per exhibit,
// turning to face each frame as it passes.
import * as THREE from "three";

const HALL_W = 9;          // hall width (x from -4.5 to 4.5)
const HALL_H = 5;          // ceiling height
const WALL_X = HALL_W / 2;
const EYE = 1.7;           // camera height
const ITEM_GAP = 5.5;      // distance between exhibits
const FRAME_W = 2.6;
const FRAME_H = 1.8;

const COLORS = {
  bg: 0xefebe4,
  wall: 0xebe5dc,
  ceiling: 0xf6f3ee,
  trim: 0x2a2622,
  frame: 0x1f1c19,
  paper: "#fbf9f5",
  ink: "#1d1b18",
  muted: "#6b655c",
};

// ---------- small helpers ----------
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
function wrapLines(ctx, text, maxWidth, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else line = test;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(last + "…").width > maxWidth && last.length) last = last.slice(0, -1);
    lines[maxLines - 1] = last.trimEnd() + "…";
  }
  return lines;
}
function makeTexture(canvas, renderer) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

// ---------- canvas artwork ----------
function drawArtwork(ctx, x, y, w, h, accent, seed) {
  const rnd = hashString(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = accent;
  ctx.fillRect(x, y, w, h);
  // layered abstract shapes, unique per exhibit
  const shapes = 5 + Math.floor(rnd() * 4);
  for (let i = 0; i < shapes; i++) {
    ctx.globalAlpha = 0.18 + rnd() * 0.35;
    ctx.fillStyle = rnd() > 0.5 ? COLORS.paper : COLORS.ink;
    const cx = x + rnd() * w, cy = y + rnd() * h, r = 40 + rnd() * h * 0.7;
    const kind = rnd();
    ctx.beginPath();
    if (kind < 0.45) ctx.arc(cx, cy, r, 0, Math.PI * 2);
    else if (kind < 0.75) ctx.rect(cx - r / 2, cy - r / 4, r, r / 2);
    else {
      ctx.moveTo(cx, cy - r / 2);
      ctx.lineTo(cx + r / 2, cy + r / 2);
      ctx.lineTo(cx - r / 2, cy + r / 2);
      ctx.closePath();
    }
    ctx.fill();
  }
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = COLORS.paper;
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x, y + rnd() * h);
    ctx.bezierCurveTo(x + w * 0.3, y + rnd() * h, x + w * 0.7, y + rnd() * h, x + w, y + rnd() * h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawExhibit(item, section, image) {
  const W = 1300, H = Math.round((W * FRAME_H) / FRAME_W);
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, W, H);

  const artW = Math.round(W * 0.42);
  if (image) {
    const s = Math.max(artW / image.width, H / image.height);
    const iw = image.width * s, ih = image.height * s;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, artW, H); ctx.clip();
    ctx.drawImage(image, (artW - iw) / 2, (H - ih) / 2, iw, ih);
    ctx.restore();
  } else {
    drawArtwork(ctx, 0, 0, artW, H, section.accent, item.title + section.id);
  }

  const x = artW + 64, maxW = W - x - 60;
  let y = 96;
  ctx.fillStyle = section.accent;
  ctx.font = '600 24px Inter, sans-serif';
  ctx.letterSpacing = "5px";
  ctx.fillText(section.label.toUpperCase(), x, y);
  ctx.letterSpacing = "0px";

  y += 70;
  ctx.fillStyle = COLORS.ink;
  ctx.font = '600 66px "Cormorant Garamond", Georgia, serif';
  for (const line of wrapLines(ctx, item.title, maxW, 2)) { ctx.fillText(line, x, y); y += 66; }

  if (item.subtitle) {
    y += 4;
    ctx.fillStyle = COLORS.muted;
    ctx.font = '500 27px Inter, sans-serif';
    for (const line of wrapLines(ctx, item.subtitle, maxW, 2)) { ctx.fillText(line, x, y); y += 36; }
  }

  y += 30;
  ctx.fillStyle = COLORS.ink;
  ctx.font = '400 29px Inter, sans-serif';
  for (const line of wrapLines(ctx, item.summary, maxW, 4)) { ctx.fillText(line, x, y); y += 44; }

  if (item.tags?.length) {
    y += 22;
    ctx.font = '500 22px Inter, sans-serif';
    let tx = x;
    for (const tag of item.tags) {
      const tw = ctx.measureText(tag).width + 36;
      if (tx + tw > W - 60) { tx = x; y += 52; }
      if (y > H - 50) break;
      ctx.strokeStyle = "#cfc7b9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tx, y - 30, tw, 42, 21);
      ctx.stroke();
      ctx.fillStyle = COLORS.ink;
      ctx.fillText(tag, tx + 18, y - 2);
      tx += tw + 12;
    }
  }

  ctx.fillStyle = COLORS.muted;
  ctx.font = '500 21px Inter, sans-serif';
  ctx.letterSpacing = "3px";
  ctx.fillText("CLICK TO VIEW", x, H - 48);
  ctx.letterSpacing = "0px";
  return c;
}

function drawBanner(section, index) {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 360;
  const ctx = c.getContext("2d");
  ctx.fillStyle = section.accent;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = '600 34px Inter, sans-serif';
  ctx.letterSpacing = "10px";
  ctx.textAlign = "center";
  ctx.fillText(`ROOM ${String(index + 1).padStart(2, "0")}`, c.width / 2, 110);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = "#fff";
  ctx.font = '600 150px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(section.label, c.width / 2, 270);
  return c;
}

function drawFinale(content) {
  const c = document.createElement("canvas");
  c.width = 1600; c.height = 900;
  const ctx = c.getContext("2d");
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.muted;
  ctx.font = '600 30px Inter, sans-serif';
  ctx.letterSpacing = "10px";
  ctx.fillText("THANK YOU FOR VISITING", 800, 250);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = COLORS.ink;
  ctx.font = '600 150px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(content.name, 800, 430);
  ctx.font = 'italic 500 56px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(content.title, 800, 520);
  ctx.fillStyle = "#c2643b";
  ctx.fillRect(700, 590, 200, 3);
  ctx.fillStyle = COLORS.ink;
  ctx.font = '500 32px Inter, sans-serif';
  ctx.letterSpacing = "4px";
  ctx.fillText("CLICK TO GET IN TOUCH", 800, 690);
  return c;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,236,205,0.85)");
  g.addColorStop(0.45, "rgba(255,236,205,0.3)");
  g.addColorStop(1, "rgba(255,236,205,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function floorTexture(renderer) {
  const c = document.createElement("canvas");
  c.width = 512; c.height = 1024;
  const ctx = c.getContext("2d");
  const rnd = hashString("floor");
  const plank = 64;
  for (let x = 0; x < c.width; x += plank) {
    let y = -rnd() * 400;
    while (y < c.height) {
      const len = 260 + rnd() * 300;
      const l = 64 + rnd() * 8;
      ctx.fillStyle = `hsl(32, 28%, ${l}%)`;
      ctx.fillRect(x, y, plank, len);
      ctx.fillStyle = "rgba(60,40,20,0.18)";
      ctx.fillRect(x, y, 2, len);
      ctx.fillRect(x, y, plank, 2);
      y += len;
    }
  }
  const t = makeTexture(c, renderer);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// ---------- the gallery ----------
export async function createGallery(canvas, content, hooks = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  scene.fog = new THREE.Fog(COLORS.bg, 10, 40);

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8c8ae, 2.4));
  for (const x of [-3, 3]) {
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.8);
    fill.position.set(x, 6, 2);
    scene.add(fill);
  }

  const glowTex = glowTexture();
  const glowMat = new THREE.MeshBasicMaterial({
    map: glowTex, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, opacity: 0.55, fog: false,
  });

  // --- layout: build waypoints + exhibits ---
  const waypoints = [];
  const exhibits = [];   // clickable meshes
  const frames = [];     // groups, for hover animation
  let z = 0;

  waypoints.push({
    pos: new THREE.Vector3(0, EYE, 7),
    target: new THREE.Vector3(0, 2.1, -6),
    room: -1,
  });

  const makeFrame = (item, section, side, fz) => {
    const group = new THREE.Group();
    group.position.set(side * (WALL_X - 0.06), 2.05, fz);
    group.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;

    const outer = new THREE.Mesh(
      new THREE.BoxGeometry(FRAME_W + 0.26, FRAME_H + 0.26, 0.08),
      new THREE.MeshStandardMaterial({ color: COLORS.frame, roughness: 0.5, metalness: 0.1 })
    );
    group.add(outer);
    const mat = new THREE.Mesh(
      new THREE.PlaneGeometry(FRAME_W + 0.12, FRAME_H + 0.12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    mat.position.z = 0.041;
    group.add(mat);

    const artMat = new THREE.MeshBasicMaterial({ map: makeTexture(drawExhibit(item, section), renderer) });
    const art = new THREE.Mesh(new THREE.PlaneGeometry(FRAME_W, FRAME_H), artMat);
    art.position.z = 0.043;
    art.userData = { item, section };
    group.add(art);
    exhibits.push(art);
    frames.push(group);

    if (item.image) {
      const img = new Image();
      img.onload = () => {
        artMat.map.dispose();
        artMat.map = makeTexture(drawExhibit(item, section, img), renderer);
        artMat.needsUpdate = true;
      };
      img.src = item.image;
    }

    // warm light pool on the wall and floor
    const wallGlow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4.2), glowMat);
    wallGlow.position.set(side * (WALL_X - 0.02), 2.4, fz);
    wallGlow.rotation.y = group.rotation.y;
    scene.add(wallGlow);
    const floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), glowMat);
    floorGlow.rotation.x = -Math.PI / 2;
    floorGlow.position.set(side * (WALL_X - 1.2), 0.012, fz);
    scene.add(floorGlow);

    // spotlight fixture on the ceiling
    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.14, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: COLORS.trim, roughness: 0.4 })
    );
    lamp.position.set(side * (WALL_X - 1.1), HALL_H - 0.15, fz);
    scene.add(lamp);

    scene.add(group);
  };

  content.sections.forEach((section, si) => {
    z -= 3;
    // hanging room banner
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 0.92),
      new THREE.MeshBasicMaterial({ map: makeTexture(drawBanner(section, si), renderer), side: THREE.DoubleSide })
    );
    banner.position.set(0, HALL_H - 0.95, z);
    scene.add(banner);
    for (const rx of [-2.3, 2.3]) {
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.5, 6),
        new THREE.MeshBasicMaterial({ color: COLORS.trim })
      );
      rod.position.set(rx, HALL_H - 0.25, z);
      scene.add(rod);
    }
    waypoints.push({
      pos: new THREE.Vector3(0, EYE, z + 4.2),
      target: new THREE.Vector3(0, HALL_H - 1.6, z - 4),
      room: si,
    });
    z -= 3.5;

    section.items.forEach((item, ii) => {
      const side = ii % 2 === 0 ? -1 : 1;
      makeFrame(item, section, side, z);
      waypoints.push({
        pos: new THREE.Vector3(side * 0.95, EYE, z),
        target: new THREE.Vector3(side * WALL_X, 2.0, z),
        room: si,
        exhibit: { item, section },
      });
      z -= ITEM_GAP;
    });
  });

  // finale wall + front desk
  const endZ = z - 4;
  const finale = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 2.59),
    new THREE.MeshBasicMaterial({ map: makeTexture(drawFinale(content), renderer) })
  );
  finale.position.set(0, 2.55, endZ + 0.04);
  finale.userData = { finale: true };
  exhibits.push(finale);
  const finaleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 2.79, 0.06),
    new THREE.MeshStandardMaterial({ color: COLORS.frame, roughness: 0.5 })
  );
  finaleFrame.position.set(0, 2.55, endZ);
  scene.add(finaleFrame, finale);
  const endGlow = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), glowMat);
  endGlow.position.set(0, 2.6, endZ + 0.01);
  scene.add(endGlow);
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.95, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.6 })
  );
  desk.position.set(0, 0.475, endZ + 2.6);
  scene.add(desk);
  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.7, 0.05, 0.9),
    new THREE.MeshStandardMaterial({ color: COLORS.trim, roughness: 0.3 })
  );
  deskTop.position.set(0, 0.975, endZ + 2.6);
  scene.add(deskTop);
  waypoints.push({
    pos: new THREE.Vector3(0, EYE, endZ + 6.8),
    target: new THREE.Vector3(0, 2.3, endZ),
    room: content.sections.length,
    finale: true,
  });

  // --- the hall itself ---
  const startZ = 12;
  const len = startZ - endZ;
  const midZ = (startZ + endZ) / 2;
  const wallMat = new THREE.MeshStandardMaterial({ color: COLORS.wall, roughness: 0.95, emissive: 0x5a554d, emissiveIntensity: 0.35 });
  const ftex = floorTexture(renderer);
  ftex.repeat.set(HALL_W / 4, len / 8);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(HALL_W, len),
    new THREE.MeshStandardMaterial({ map: ftex, roughness: 0.55 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, midZ);
  scene.add(floor);
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(HALL_W, len),
    new THREE.MeshStandardMaterial({ color: COLORS.ceiling, roughness: 1, emissive: 0x8a857c, emissiveIntensity: 0.45 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, HALL_H, midZ);
  scene.add(ceiling);
  for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(len, HALL_H), wallMat);
    wall.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    wall.position.set(side * WALL_X, HALL_H / 2, midZ);
    scene.add(wall);
    const skirting = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.16, len),
      new THREE.MeshStandardMaterial({ color: COLORS.trim, roughness: 0.6 })
    );
    skirting.position.set(side * (WALL_X - 0.02), 0.08, midZ);
    scene.add(skirting);
    // light track along the ceiling
    const track = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.04, len),
      new THREE.MeshBasicMaterial({ color: COLORS.trim })
    );
    track.position.set(side * (WALL_X - 1.1), HALL_H - 0.02, midZ);
    scene.add(track);
  }
  for (const wz of [startZ, endZ]) {
    const end = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, HALL_H), wallMat);
    end.position.set(0, HALL_H / 2, wz);
    if (wz === startZ) end.rotation.y = Math.PI;
    scene.add(end);
  }
  // skylight strip
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, len - 2),
    new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false })
  );
  sky.rotation.x = Math.PI / 2;
  sky.position.set(0, HALL_H - 0.01, midZ);
  scene.add(sky);

  // --- motion ---
  const last = waypoints.length - 1;
  let segPx = 1;
  let targetP = 0, currentP = 0;
  const mouse = new THREE.Vector2(), mouseSmooth = new THREE.Vector2();
  const tmpPos = new THREE.Vector3(), tmpTarget = new THREE.Vector3();
  let running = false, lastTime = 0, lastRoom = null, hovered = null;

  function layout() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 70 : 52;
    camera.updateProjectionMatrix();
    segPx = h * 0.9;
    document.getElementById("scroll-space").style.height = `${last * segPx + h}px`;
  }

  function pose(p, outPos, outTarget) {
    const i = clamp(Math.floor(p), 0, last - 1);
    const u = smooth(0.12, 0.88, p - i); // dwell at each exhibit
    const a = waypoints[i], b = waypoints[i + 1];
    outPos.lerpVectors(a.pos, b.pos, u);
    outTarget.lerpVectors(a.target, b.target, u);
    // gentle sway while walking
    const walk = Math.sin(u * Math.PI);
    outPos.y += Math.sin(p * Math.PI * 2) * 0.03 * walk;
  }

  const raycaster = new THREE.Raycaster();
  function pick(clientX, clientY) {
    const v = new THREE.Vector2((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(v, camera);
    const hit = raycaster.intersectObjects(exhibits, false)[0];
    return hit && hit.distance < 12 ? hit.object : null;
  }

  function onScroll() { targetP = clamp(window.scrollY / segPx, 0, last); }
  function onMove(e) {
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    hovered = pick(e.clientX, e.clientY);
    document.body.classList.toggle("hovering-frame", !!hovered);
  }
  function onClick(e) {
    const obj = pick(e.clientX, e.clientY);
    if (!obj) return;
    if (obj.userData.finale) hooks.onFinale?.();
    else hooks.onOpen?.(obj.userData.item, obj.userData.section);
  }

  function frame(time) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min((time - lastTime) / 1000 || 0, 0.1);
    lastTime = time;

    currentP += (targetP - currentP) * (1 - Math.exp(-dt * 3.2));
    if (Math.abs(targetP - currentP) < 0.0005) currentP = targetP;
    mouseSmooth.lerp(mouse, 1 - Math.exp(-dt * 3));

    pose(currentP, tmpPos, tmpTarget);
    camera.position.copy(tmpPos);
    tmpTarget.x += mouseSmooth.x * 0.35;
    tmpTarget.y -= mouseSmooth.y * 0.2;
    camera.lookAt(tmpTarget);

    for (const g of frames) {
      const isHover = hovered && hovered.parent === g;
      const s = g.scale.x + ((isHover ? 1.035 : 1) - g.scale.x) * (1 - Math.exp(-dt * 10));
      g.scale.setScalar(s);
    }

    const wp = waypoints[Math.round(currentP)];
    if (wp.room !== lastRoom) {
      lastRoom = wp.room;
      hooks.onRoomChange?.(wp.room);
    }
    hooks.onProgress?.(currentP / last, wp);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", layout);
  window.addEventListener("scroll", onScroll, { passive: true });
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("click", onClick);

  return {
    waypoints,
    start() {
      layout();
      onScroll();
      currentP = targetP;
      if (!running) { running = true; lastTime = performance.now(); requestAnimationFrame(frame); }
    },
    stop() { running = false; },
    goTo(index) {
      window.scrollTo({ top: clamp(index, 0, last) * segPx, behavior: "instant" });
    },
    roomStart(room) { return waypoints.findIndex((w) => w.room === room); },
    currentIndex() { return Math.round(currentP); },
  };
}
