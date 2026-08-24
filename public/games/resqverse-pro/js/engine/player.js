import { PLAYER_CONFIG } from '../config.js';

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.width = PLAYER_CONFIG.width;
    this.height = PLAYER_CONFIG.height;
    this.originalHeight = PLAYER_CONFIG.height;
    this.crouchHeight = PLAYER_CONFIG.crouchHeight;
    this.crawlHeight = PLAYER_CONFIG.crawlHeight;
    this.onGround = false;
    this.crouching = false;
    this.crawling = false;
    this.slidingUnder = false;
    this.holding = false;
    this.climbing = false;
    this.sprinting = false;
    this.facing = 1;
    this.health = 100;
    this.alive = true;
    this.animFrame = 0;
    this.animTimer = 0;
    this.state = 'idle';
    this.invulnerable = 0;
    this.badges = 0;
    this.stars = 0;
    this.underCover = null;
    this.holdStrength = 0; // for earthquake hold mechanic
    this.coverMouth = false; // for fire
  }

  update(input, platforms, world) {
    if (!this.alive) return;

    const cfg = PLAYER_CONFIG;
    let speed = input.shift ? cfg.sprintSpeed : cfg.speed;
    if (this.crawling) speed *= 0.6;
    if (this.holding) speed *= 0.2;
    this.sprinting = input.shift && input.left !== input.right && !this.crouching;

    // Horizontal
    this.vx = 0;
    if (!this.holding) {
      if (input.left) { this.vx = -speed; this.facing = -1; }
      if (input.right) { this.vx = speed; this.facing = 1; }
    }

    // Crouch / Crawl / Slide under
    let wantCrouch = input.down;
    let wasCrouching = this.crouching;

    if (wantCrouch && this.onGround) {
      if (!this.crouching) {
        // start crouching
        this.crouching = true;
        this.height = this.crouchHeight;
        this.y += this.originalHeight - this.crouchHeight;
      }
      // Check if crawling (hold down + moving) vs crouching
      if (Math.abs(this.vx) > 0.5 && input.down) {
        this.crawling = true;
        this.coverMouth = true;
        // extra low for crawling under smoke
        if (this.height !== this.crawlHeight) {
          let diff = this.height - this.crawlHeight;
          this.y += diff;
          this.height = this.crawlHeight;
        }
        this.state = 'crawl';
      } else {
        this.crawling = false;
        this.state = 'crouch';
        if (this.height !== this.crouchHeight) {
          // restore from crawl
          this.y -= this.crouchHeight - this.crawlHeight;
          this.height = this.crouchHeight;
        }
      }
    } else {
      if (this.crouching) {
        // try stand
        let canStand = true;
        let testY = this.y - (this.originalHeight - this.height);
        for (let p of platforms) {
          if (this.checkCollision(this.x, testY, this.originalHeight, p)) { canStand = false; break; }
        }
        if (canStand) {
          this.crouching = false;
          this.crawling = false;
          this.coverMouth = false;
          this.y = testY;
          this.height = this.originalHeight;
        }
      }
    }

    // Hold mechanic for earthquake - HOLD E continuously
    if (input.interact && this.underCover) {
      this.holding = true;
      this.holdStrength = Math.min(100, this.holdStrength + 4.5); // faster fill
    } else {
      if (this.holding) {
        this.holdStrength = Math.max(0, this.holdStrength - 1.2); // slower decay
        if (this.holdStrength <= 0.5) {
          this.holding = false;
          this.holdStrength = 0;
        }
      } else {
        this.holdStrength = Math.max(0, this.holdStrength - 2);
      }
    }

    // Climbing
    this.climbing = false;
    if (input.interact && world?.nearLadder) {
      this.climbing = true;
      this.vy = -3; // climb up
      this.vx = 0;
    }

    // Jump
    if (input.jump && this.onGround && !this.crouching && !this.holding) {
      this.vy = -cfg.jumpForce;
      this.onGround = false;
      world?.playSound?.('jump');
    }

    // Gravity (not when climbing)
    if (!this.climbing) {
      this.vy += cfg.gravity;
      if (this.vy > cfg.maxFall) this.vy = cfg.maxFall;
    }

    this.moveAndCollide(platforms);

    // Animation
    this.animTimer++;
    if (this.animTimer > 5) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 6;
    }
    if (this.climbing) this.state = 'climb';
    else if (!this.onGround) this.state = 'jump';
    else if (this.crawling) this.state = 'crawl';
    else if (this.crouching) this.state = this.holding ? 'hold' : 'crouch';
    else if (Math.abs(this.vx) > 0.5) this.state = this.sprinting ? 'sprint' : 'run';
    else this.state = 'idle';

    if (this.invulnerable > 0) this.invulnerable--;
  }

  moveAndCollide(platforms) {
    let nextX = this.x + this.vx;
    for (let p of platforms) {
      if (this.checkCollision(nextX, this.y, this.height, p)) {
        if (p.type === 'platform' || p.type === 'ground' || p.type === 'wall') {
          if (this.vx > 0) nextX = p.x - this.width;
          else if (this.vx < 0) nextX = p.x + p.w;
          this.vx = 0;
        }
      }
    }
    this.x = nextX;

    let nextY = this.y + this.vy;
    this.onGround = false;
    for (let p of platforms) {
      if (this.checkCollision(this.x, nextY, this.height, p)) {
        if (p.type === 'platform' || p.type === 'ground' || p.type === 'wall') {
          if (this.vy > 0) {
            nextY = p.y - this.height;
            this.vy = 0;
            this.onGround = true;
          } else if (this.vy < 0) {
            nextY = p.y + p.h;
            this.vy = 0;
          }
        } else if (p.type === 'oneway' && this.vy > 0 && this.y + this.height <= p.y + 8) {
          nextY = p.y - this.height;
          this.vy = 0;
          this.onGround = true;
        }
      }
    }
    this.y = nextY;
  }

  checkCollision(x, y, h, p) {
    return x < p.x + p.w && x + this.width > p.x && y < p.y + p.h && y + h > p.y;
  }

  checkUnderCover(covers) {
    this.underCover = null;
    this.slidingUnder = false;
    if (!this.crouching) return null;
    // More forgiving detection - if crouching and overlapping table area
    for (let c of covers) {
      // Horizontal overlap - player must be overlapping table (even partially)
      let overlapX = this.x + this.width > c.x + 2 && this.x < c.x + c.w - 2;
      // Vertical - player bottom near ground, top below table top, and inside table height
      // Table top at c.y, legs from c.y+10 to c.y+h
      // Player should be under table top, so player y should be > c.y (below top) but < c.y + h
      let underTop = this.y > c.y - 5 && this.y < c.y + c.h - 5;
      let bottomNearGround = this.y + this.height >= c.y + 8;
      
      if (overlapX && underTop && bottomNearGround) {
        // Extra check: center should be reasonably inside
        let centerX = this.x + this.width/2;
        if (centerX > c.x - 10 && centerX < c.x + c.w + 10) {
          this.underCover = c;
          this.slidingUnder = true;
          // Auto-snap slightly to center under table for better feel
          if (Math.abs(centerX - (c.x + c.w/2)) < 30) {
            // gentle snap
            this.x += (c.x + c.w/2 - centerX) * 0.08;
          }
          return c;
        }
      }
    }
    return null;
  }

  isFullyProtected() {
    return this.underCover && this.crouching && (this.holding || this.holdStrength > 18);
  }

  takeDamage(amount, world) {
    if (this.invulnerable > 0 || !this.alive) return false;
    // If fully protected under cover and holding, no damage
    if (this.isFullyProtected()) {
      world?.addParticle?.({ x:this.x, y:this.y, vx:0, vy:-1, size:5, color:'#00ff88', life:10, maxLife:10, alpha:1, gravity:0, shape:'circle' });
      return false;
    }
    this.health -= amount;
    this.invulnerable = 35;
    world?.shake?.(6);
    world?.playSound?.('hurt');
    if (this.health <= 0) { this.health = 0; this.alive = false; return true; }
    return false;
  }

  draw(ctx, camera) {
    let sx = this.x - camera.x;
    let sy = this.y - camera.y;

    if (this.invulnerable > 0 && Math.floor(this.invulnerable / 3) % 2 === 0) return;

    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(sx + this.width/2, sy + this.height + 4, this.width/2.2, 4, 0, 0, Math.PI*2);
    ctx.fill();

    let bob = (this.state === 'run' || this.state === 'sprint') ? Math.sin(this.animFrame*1.2)*1.5 : 0;
    let drawY = sy + bob;

    let skin = '#ffcf8a';
    let shirt = '#4da3ff';
    let pants = '#2a4a7a';
    let hair = '#3a2317';

    if (this.state === 'crawl') {
      // Belly crawl - very low, covering mouth
      ctx.fillStyle = pants;
      ctx.fillRect(sx+2, drawY+8, this.width-4, 8);
      ctx.fillStyle = shirt;
      ctx.fillRect(sx+4, drawY+4, this.width-8, 10);
      ctx.fillStyle = skin;
      ctx.fillRect(sx+2, drawY+2, 10, 8); // head low
      ctx.fillRect(sx+this.width-12, drawY+6, 10, 6); // hand covering mouth
      // mouth cover
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(sx+6, drawY+6, 6, 4);
      // eyes
      ctx.fillStyle = 'white';
      ctx.fillRect(sx+3, drawY+3, 3, 3);
      ctx.fillStyle = 'black';
      ctx.fillRect(sx+4, drawY+4, 1, 1);
    } else if (this.state === 'crouch' || this.state === 'hold') {
      // Under table crouch - knees up, holding legs
      let holdOffset = this.holding ? Math.sin(this.animFrame*0.5)*1 : 0;
      // Legs folded
      ctx.fillStyle = pants;
      ctx.fillRect(sx+4, drawY+14, 18, 6);
      ctx.fillRect(sx+6, drawY+18, 6, 6);
      // Body
      ctx.fillStyle = shirt;
      ctx.fillRect(sx+4, drawY+8, 18, 12);
      // Head
      ctx.fillStyle = skin;
      ctx.fillRect(sx+6, drawY+2, 14, 12);
      ctx.fillStyle = hair;
      ctx.fillRect(sx+5, drawY+1, 16, 5);
      // Arms holding table leg if holding
      ctx.fillStyle = skin;
      if (this.holding) {
        ctx.fillRect(sx+2, drawY+10+holdOffset, 5, 10);
        ctx.fillRect(sx+19, drawY+10-holdOffset, 5, 12);
        // grip indicator
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(sx+1, drawY+8, 4, 4);
        ctx.fillRect(sx+21, drawY+8, 4, 4);
      } else {
        ctx.fillRect(sx+2, drawY+12, 5, 8);
        // covering head
        ctx.fillRect(sx+8, drawY, 8, 4);
      }
      // Eyes scared
      ctx.fillStyle = 'white';
      ctx.fillRect(sx+8, drawY+5, 3, 3);
      ctx.fillRect(sx+15, drawY+5, 3, 3);
      ctx.fillStyle = 'black';
      ctx.fillRect(sx+9, drawY+6, 1, 1);
      ctx.fillRect(sx+16, drawY+6, 1, 1);
      // Hold strength bar
      if (this.underCover) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(sx-4, drawY-10, 34, 5);
        ctx.fillStyle = this.holdStrength > 50 ? '#00ff88' : '#ffde59';
        ctx.fillRect(sx-4, drawY-10, 34*(this.holdStrength/100), 5);
      }
    } else if (this.state === 'climb') {
      // Climbing ladder
      let legOff = (this.animFrame%2===0)?2:-2;
      ctx.fillStyle = pants;
      ctx.fillRect(sx+6, drawY+26+legOff, 6, 12);
      ctx.fillRect(sx+14, drawY+26-legOff, 6, 12);
      ctx.fillStyle = shirt;
      ctx.fillRect(sx+4, drawY+12, 18, 16);
      ctx.fillStyle = skin;
      ctx.fillRect(sx+6, drawY, 14, 14);
      ctx.fillStyle = hair;
      ctx.fillRect(sx+5, drawY-1, 16, 6);
      // arms up
      ctx.fillRect(sx+1, drawY+8, 5, 12);
      ctx.fillRect(sx+20, drawY+8, 5, 12);
    } else {
      // Normal standing/running/jumping
      let legOffset = (this.state==='run'||this.state==='sprint') ? (this.animFrame%2===0?3:-3) : 0;
      ctx.fillStyle = pants;
      ctx.fillRect(sx+5, drawY+26+legOffset, 6, 14);
      ctx.fillRect(sx+15, drawY+26-legOffset, 6, 14);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(sx+3, drawY+38+legOffset, 10, 5);
      ctx.fillRect(sx+13, drawY+38-legOffset, 10, 5);
      ctx.fillStyle = shirt;
      ctx.fillRect(sx+3, drawY+12, 20, 16);
      ctx.fillStyle = skin;
      if (this.state==='run') {
        ctx.fillRect(sx+0, drawY+14-legOffset, 5, 10);
        ctx.fillRect(sx+21, drawY+14+legOffset, 5, 10);
      } else {
        ctx.fillRect(sx+0, drawY+14, 5, 12);
        ctx.fillRect(sx+21, drawY+14, 5, 12);
      }
      ctx.fillStyle = skin;
      ctx.fillRect(sx+5, drawY, 16, 15);
      ctx.fillStyle = hair;
      ctx.fillRect(sx+4, drawY-1, 18, 7);
      ctx.fillRect(sx+3, drawY+2, 3, 8);
      ctx.fillRect(sx+20, drawY+2, 3, 8);
      ctx.fillStyle = 'white';
      ctx.fillRect(sx+7, drawY+5, 4, 4);
      ctx.fillRect(sx+15, drawY+5, 4, 4);
      ctx.fillStyle = 'black';
      let eyeX = this.facing===1?1:-1;
      ctx.fillRect(sx+8+eyeX, drawY+7, 2,2);
      ctx.fillRect(sx+16+eyeX, drawY+7, 2,2);
      ctx.fillStyle = '#7a3a1a';
      if (this.state==='jump') ctx.fillRect(sx+10, drawY+11, 6,3);
      else ctx.fillRect(sx+10, drawY+12, 6,2);
    }

    // Protected glow
    if (this.underCover && this.crouching) {
      ctx.strokeStyle = this.isFullyProtected() ? '#00ff88' : '#ffde59';
      ctx.lineWidth = 2;
      ctx.setLineDash([4,3]);
      ctx.strokeRect(sx-2, sy-2, this.width+4, this.height+4);
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  getCenter() { return { x: this.x + this.width/2, y: this.y + this.height/2 }; }
}
