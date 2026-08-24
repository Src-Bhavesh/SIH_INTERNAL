export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.camera = { x: 0, y: 0, shake: 0, shakeDecay: 0.9 };
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
  }

  updateCamera(target, levelWidth, levelHeight) {
    // Follow player
    let desiredX = target.x + target.width/2 - this.width/2;
    let desiredY = target.y + target.height/2 - this.height/2;

    // Clamp
    desiredX = Math.max(0, Math.min(desiredX, levelWidth - this.width));
    desiredY = Math.max(0, Math.min(desiredY, levelHeight - this.height));

    // Smooth lerp
    this.camera.x += (desiredX - this.camera.x) * 0.12;
    this.camera.y += (desiredY - this.camera.y) * 0.12;

    if (this.camera.shake > 0.5) {
      this.camera.x += (Math.random() - 0.5) * this.camera.shake;
      this.camera.y += (Math.random() - 0.5) * this.camera.shake;
      this.camera.shake *= this.camera.shakeDecay;
    } else {
      this.camera.shake = 0;
    }
  }

  shake(amount) {
    this.camera.shake = Math.max(this.camera.shake, amount);
  }

  addParticle(p) {
    this.particles.push(p);
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0.2;
      p.life--;
      p.alpha = p.life / p.maxLife;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  drawParticles() {
    for (let p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(p.x - this.camera.x, p.y - this.camera.y, p.size, 0, Math.PI*2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(p.x - this.camera.x, p.y - this.camera.y, p.size, p.size);
      }
      this.ctx.restore();
    }
  }

  clear(bg) {
    this.ctx.fillStyle = bg || '#120e2a';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawBackground(levelType, time) {
    // Gradient sky
    let grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    if (levelType === 'earthquake') {
      grad.addColorStop(0, '#1a0f2e');
      grad.addColorStop(1, '#2a1a3a');
    } else if (levelType === 'fire') {
      grad.addColorStop(0, '#2a1510');
      grad.addColorStop(1, '#1a0a08');
    } else if (levelType === 'tsunami') {
      grad.addColorStop(0, '#0a1a3a');
      grad.addColorStop(1, '#102a5a');
    } else {
      grad.addColorStop(0, '#120e2a');
      grad.addColorStop(1, '#1e1440');
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Stars / subtle particles in background
    this.ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 80; i++) {
      let x = (i * 137.5 + time * 0.02) % this.width;
      let y = (Math.sin(i) * 0.5 + 0.5) * this.height * 0.6;
      let s = (Math.sin(i * 2.3) * 0.5 + 0.5) * 1.5;
      this.ctx.beginPath();
      this.ctx.arc(x, y, s, 0, Math.PI*2);
      this.ctx.fill();
    }
  }

  playSound(type) {
    // Simple Web Audio beeps
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      if (type === 'jump') { o.frequency.value = 440; g.gain.value = 0.1; o.type = 'sine'; }
      else if (type === 'hurt') { o.frequency.value = 120; g.gain.value = 0.2; o.type = 'sawtooth'; }
      else if (type === 'pickup') { o.frequency.value = 880; g.gain.value = 0.15; o.type = 'sine'; }
      else if (type === 'quake') { o.frequency.value = 40; g.gain.value = 0.3; o.type = 'sawtooth'; }
      else { o.frequency.value = 600; g.gain.value = 0.1; }
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      o.stop(ctx.currentTime + 0.3);
    } catch(e){}
  }
}
