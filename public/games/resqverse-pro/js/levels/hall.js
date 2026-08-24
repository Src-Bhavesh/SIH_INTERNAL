import { Player } from '../engine/player.js';
import { World } from '../engine/world.js';

export class HallLevel {
  constructor(canvas, onEnterPortal) {
    this.canvas = canvas;
    this.world = new World(canvas);
    this.onEnterPortal = onEnterPortal;
    this.player = new Player(80, 320);
    this.input = { left: false, right: false, up: false, down: false, jump: false, shift: false, interact: false };
    this.levelWidth = 1350; // Compact - all 3 visible at once
    this.levelHeight = 600;
    this.nearPortal = null;
    this.time = 0;
    this.running = false;
    this.animationId = null;

    this.platforms = [
      { x: 0, y: 500, w: 1350, h: 100, type: 'ground' },
      { x: 180, y: 400, w: 110, h: 14, type: 'oneway' },
      { x: 580, y: 400, w: 110, h: 14, type: 'oneway' },
      { x: 980, y: 400, w: 110, h: 14, type: 'oneway' },
    ];

    this.portals = [
      { id: 'earthquake', x: 180, y: 220, w: 110, h: 280, color: '#ff7a3a', label: 'EARTHQUAKE', sub: 'Classroom • Library', icon: '🏚️', key: '1', desc: '7.8 magnitude, 3 zones' },
      { id: 'fire', x: 600, y: 220, w: 110, h: 280, color: '#ff4a4a', label: 'FIRE', sub: '3 Floors • Rescue', icon: '🔥', key: '2', desc: 'Smoke, extinguisher, rescue' },
      { id: 'tsunami', x: 1020, y: 220, w: 110, h: 280, color: '#3aa0ff', label: 'TSUNAMI', sub: 'Beach • Mountain', icon: '🌊', key: '3', desc: '4 zones, rising water' },
    ];

    this.decor = [
      { x: 50, y: 340, w: 18, h: 160, color: '#2a203a' },
      { x: 400, y: 340, w: 18, h: 160, color: '#2a203a' },
      { x: 800, y: 340, w: 18, h: 160, color: '#2a203a' },
      { x: 1200, y: 340, w: 18, h: 160, color: '#2a203a' },
    ];

    this.lights = [
      { x: 235, y: 90, color: '#ffe8a0' },
      { x: 655, y: 90, color: '#ffe8a0' },
      { x: 1075, y: 90, color: '#ffe8a0' },
    ];

    this.bindInput();
    this.setupQuickSelect();
  }

  setupQuickSelect() {
    const overlay = document.getElementById('hallOverlay');
    overlay.innerHTML = '';
    overlay.style.pointerEvents = 'none';

    // Controls hint only - removed the 3 quick-select cards as requested
    const hint = document.createElement('div');
    hint.className = 'hall-controls-hint';
    hint.innerHTML = `<span><b>WASD</b> or <b>Arrows</b> to move</span> <span>•</span> <span><b>W / SPACE</b> to jump</span> <span>•</span> <span><b>E</b> to enter portal</span>`;
    overlay.appendChild(hint);
  }

  bindInput() {
    this.keydown = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = true;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = true;
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
        this.input.jump = true;
        this.input.up = true;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.down = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.input.shift = true;
      if (e.code === 'KeyE') this.handleInteract();
      // Quick select 1,2,3
      if (e.code === 'Digit1') this.onEnterPortal('earthquake');
      if (e.code === 'Digit2') this.onEnterPortal('fire');
      if (e.code === 'Digit3') this.onEnterPortal('tsunami');
    };
    this.keyup = (e) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.input.left = false;
      if (e.code === 'KeyD' || e.code === 'ArrowRight') this.input.right = false;
      if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
        this.input.jump = false;
        this.input.up = false;
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') this.input.down = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.input.shift = false;
    };
  }

  start() {
    this.running = true;
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup);
    this.loop();
  }

  stop() {
    this.running = false;
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('keyup', this.keyup);
    if (this.animationId) cancelAnimationFrame(this.animationId);
    // Clear overlay
    const overlay = document.getElementById('hallOverlay');
    if (overlay) overlay.innerHTML = '';
  }

  handleInteract() {
    if (this.nearPortal) {
      this.onEnterPortal(this.nearPortal.id);
    }
  }

  loop() {
    if (!this.running) return;
    this.animationId = requestAnimationFrame(() => this.loop());
    this.update();
    this.draw();
  }

  update() {
    this.time++;
    this.player.update(this.input, this.platforms, this.world);
    this.input.jump = false;

    this.nearPortal = null;
    let pc = this.player.getCenter();
    for (let portal of this.portals) {
      let dx = pc.x - (portal.x + portal.w/2);
      let dy = pc.y - (portal.y + portal.h/2);
      if (Math.abs(dx) < 85 && Math.abs(dy) < 160) {
        this.nearPortal = portal;
      }
    }

    this.world.updateCamera(this.player, this.levelWidth, this.levelHeight);
    this.world.updateParticles();

    if (this.time % 4 === 0) {
      this.world.addParticle({
        x: Math.random() * this.levelWidth,
        y: Math.random() * 380,
        vx: (Math.random()-0.5)*0.4,
        vy: Math.random()*0.4,
        size: Math.random()*1.8+0.5,
        color: `rgba(255,255,255,${Math.random()*0.18})`,
        life: 240, maxLife: 240, alpha: 1, gravity: 0, shape: 'circle'
      });
    }
  }

  draw() {
    let ctx = this.world.ctx;
    let cam = this.world.camera;

    this.world.clear('#13102a');
    this.world.drawBackground('hall', this.time);

    // Subtle grid
    ctx.fillStyle = 'rgba(255,255,255,0.015)';
    for (let x = -cam.x % 36; x < this.world.width; x += 36) {
      ctx.fillRect(x, 0, 1, this.world.height);
    }

    // Pillars - more subtle, professional
    for (let d of this.decor) {
      let sx = d.x - cam.x;
      if (sx < -80 || sx > this.world.width+80) continue;
      // Pillar with subtle gradient
      let grad = ctx.createLinearGradient(sx, 0, sx+d.w, 0);
      grad.addColorStop(0, '#1e1a35');
      grad.addColorStop(0.5, '#2a2445');
      grad.addColorStop(1, '#1e1a35');
      ctx.fillStyle = grad;
      ctx.fillRect(sx, d.y - cam.y, d.w, d.h);
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fillRect(sx, d.y - cam.y, d.w, 3);
    }

    // Lights - warm, soft
    for (let l of this.lights) {
      let sx = l.x - cam.x;
      let sy = l.y - cam.y;
      let grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 50);
      grad.addColorStop(0, 'rgba(255,232,160,0.18)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, 50, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = l.color;
      ctx.beginPath();
      ctx.arc(sx, sy, 7, 0, Math.PI*2);
      ctx.fill();
      // Soft beam
      ctx.fillStyle = 'rgba(255,232,160,0.035)';
      ctx.beginPath();
      ctx.moveTo(sx-16, sy);
      ctx.lineTo(sx+16, sy);
      ctx.lineTo(sx+48, sy+410);
      ctx.lineTo(sx-48, sy+410);
      ctx.fill();
    }

    // Platforms - cleaner
    for (let p of this.platforms) {
      let sx = p.x - cam.x;
      let sy = p.y - cam.y;
      if (sx < -180 || sx > this.world.width+180) continue;
      if (p.type === 'ground') {
        ctx.fillStyle = '#1e1a35';
        ctx.fillRect(sx, sy, p.w, 18);
        ctx.fillStyle = 'rgba(138,92,255,0.5)';
        ctx.fillRect(sx, sy, p.w, 2);
        ctx.fillStyle = '#18142e';
        ctx.fillRect(sx, sy+18, p.w, p.h-18);
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        for (let tx = 0; tx < p.w; tx += 36) {
          ctx.strokeRect(sx+tx, sy+18, 36, 36);
        }
      } else {
        // One-way platforms - subtle pink, not neon
        ctx.fillStyle = 'rgba(255,120,150,0.7)';
        ctx.fillRect(sx, sy, p.w, p.h);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(sx+8, sy+4, p.w-16, 5);
      }
    }

    // Portals - professional, not overly neon
    for (let portal of this.portals) {
      let sx = portal.x - cam.x;
      let sy = portal.y - cam.y;
      if (sx < -180 || sx > this.world.width+180) continue;

      let isNear = this.nearPortal && this.nearPortal.id === portal.id;

      // Soft glow, not intense
      let glowGrad = ctx.createRadialGradient(sx+portal.w/2, sy+portal.h/2, 0, sx+portal.w/2, sy+portal.h/2, isNear?100:70);
      glowGrad.addColorStop(0, portal.color + (isNear?'35':'18'));
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(sx+portal.w/2, sy+portal.h/2, isNear?100:70, 0, Math.PI*2);
      ctx.fill();

      // Portal body - more muted, professional
      ctx.save();
      // Outer border
      ctx.strokeStyle = isNear ? portal.color : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = isNear ? 2 : 1;
      ctx.strokeRect(sx-1, sy-1, portal.w+2, portal.h+2);
      // Fill
      ctx.fillStyle = portal.color;
      ctx.globalAlpha = isNear ? 0.95 : 0.75;
      ctx.fillRect(sx, sy, portal.w, portal.h);
      ctx.globalAlpha = 1;
      // Subtle stripes - less intense
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let i = -portal.h; i < portal.w; i += 22) {
        ctx.moveTo(sx+i, sy);
        ctx.lineTo(sx+i+portal.h, sy+portal.h);
      }
      ctx.stroke();
      // Soft inner highlight
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(sx, sy, portal.w/3.5, portal.h);
      ctx.restore();

      // Label - clean, not neon yellow, professional
      let labelW = 132, labelH = 44;
      let lx = sx + portal.w/2 - labelW/2;
      let ly = sy + portal.h/2 - 18;

      ctx.fillStyle = isNear ? '#ffffff' : 'rgba(18,16,36,0.92)';
      ctx.strokeStyle = isNear ? portal.color : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = isNear ? 1.5 : 1;
      ctx.beginPath();
      ctx.roundRect(lx, ly, labelW, labelH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isNear ? '#0a0a1a' : 'white';
      ctx.font = '700 12px "Outfit"';
      ctx.textAlign = 'center';
      ctx.fillText(portal.label, sx+portal.w/2, ly+16);
      ctx.fillStyle = isNear ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
      ctx.font = '500 10px "Space Grotesk"';
      ctx.fillText(portal.sub, sx+portal.w/2, ly+30);

      // Key hint
      ctx.fillStyle = isNear ? portal.color : 'rgba(255,255,255,0.25)';
      ctx.font = '600 9px "Space Grotesk"';
      ctx.fillText(`[${portal.key}]`, sx+portal.w/2, ly-8);

      if (isNear) {
        // Clean enter prompt - not neon yellow
        ctx.fillStyle = 'rgba(18,16,36,0.92)';
        ctx.beginPath();
        ctx.roundRect(sx+portal.w/2-68, sy+portal.h+14, 136, 26, 20);
        ctx.fill();
        ctx.strokeStyle = portal.color;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '600 11px "Space Grotesk"';
        ctx.fillText('Press E to Enter', sx+portal.w/2, sy+portal.h+31);

        let bounce = Math.sin(this.time*0.08)*3;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '10px "Space Grotesk"';
        ctx.fillText('▼', sx+portal.w/2, sy+portal.h+48 + bounce);
      }
    }

    this.player.draw(ctx, cam);
    this.world.drawParticles();

    // Subtle vignette
    let vignette = ctx.createRadialGradient(this.world.width/2, this.world.height/2, 0, this.world.width/2, this.world.height/2, this.world.width*0.9);
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0,0,this.world.width,this.world.height);
  }
}
