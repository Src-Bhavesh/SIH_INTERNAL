import { Player } from '../engine/player.js';
import { World } from '../engine/world.js';
import { DISASTERS } from '../config.js';

export class EarthquakeLevel {
  constructor(canvas, onComplete, onQuiz) {
    this.canvas = canvas;
    this.world = new World(canvas);
    this.onComplete = onComplete;
    this.onQuiz = onQuiz;
    this.config = DISASTERS.earthquake;
    this.levelWidth = 5200;
    this.levelHeight = 700;
    this.player = new Player(120, 450);
    this.input = { left:false, right:false, up:false, down:false, jump:false, shift:false, interact:false };
    this.prevInteract = false;
    this.interactCooldown = 0;
    this.time = 0;
    this.phase = 0;
    this.phaseTime = 0;
    this.phaseDuration = this.config.phases[0].duration * 60;
    this.timer = 180;
    this.running = false;
    this.animationId = null;
    this.debris = [];
    this.badges = [];
    this.collected = 0;
    this.exitUnlocked = false;
    this.zone = 0;
    this.quizTriggered = [false,false,false,false];
    this.doors = [];
    this.npcs = [];
    this.cracks = [];
    this.bookshelves = [];
    this.holdTutorialShown = false;

    this.platforms = [
      { x:0, y:600, w:5200, h:100, type:'ground' },
      { x:200, y:480, w:120, h:15, type:'oneway' },
      { x:400, y:430, w:100, h:15, type:'oneway' },
      { x:1600, y:500, w:140, h:20, type:'oneway' },
      { x:1800, y:450, w:120, h:15, type:'oneway' },
      { x:2000, y:400, w:140, h:15, type:'oneway' },
      { x:2200, y:350, w:120, h:15, type:'oneway' },
      { x:3200, y:520, w:800, h:80, type:'ground' },
      { x:3600, y:420, w:140, h:15, type:'oneway' },
      { x:3900, y:370, w:120, h:15, type:'oneway' },
      { x:4200, y:320, w:160, h:15, type:'oneway' },
      { x:4600, y:500, w:200, h:15, type:'oneway' },
    ];

    this.covers = [
      { x:250, y:520, w:90, h:70, type:'school_desk', legs:[{x:5,w:8},{x:75,w:8}], topY:520 },
      { x:380, y:520, w:90, h:70, type:'school_desk', legs:[{x:5,w:8},{x:75,w:8}], topY:520 },
      { x:510, y:520, w:90, h:70, type:'school_desk', legs:[{x:5,w:8},{x:75,w:8}], topY:520 },
      { x:650, y:520, w:90, h:70, type:'school_desk', legs:[{x:5,w:8},{x:75,w:8}], topY:520 },
      { x:800, y:520, w:90, h:70, type:'school_desk', legs:[{x:5,w:8},{x:75,w:8}], topY:520 },
      { x:950, y:520, w:90, h:70, type:'school_desk', legs:[{x:5,w:8},{x:75,w:8}], topY:520 },
      { x:1150, y:500, w:140, h:90, type:'teacher_desk', legs:[{x:10,w:12},{x:118,w:12}], topY:500 },
      { x:1650, y:500, w:110, h:80, type:'library_table', legs:[{x:8,w:10},{x:92,w:10}], topY:500 },
      { x:1850, y:500, w:110, h:80, type:'library_table', legs:[{x:8,w:10},{x:92,w:10}], topY:500 },
      { x:2050, y:500, w:110, h:80, type:'library_table', legs:[{x:8,w:10},{x:92,w:10}], topY:500 },
      { x:2250, y:500, w:110, h:80, type:'library_table', legs:[{x:8,w:10},{x:92,w:10}], topY:500 },
      { x:2450, y:500, w:110, h:80, type:'library_table', legs:[{x:8,w:10},{x:92,w:10}], topY:500 },
      { x:2650, y:500, w:110, h:80, type:'library_table', legs:[{x:8,w:10},{x:92,w:10}], topY:500 },
      { x:3350, y:460, w:100, h:60, type:'theatre_table', legs:[{x:5,w:8},{x:87,w:8}], topY:460 },
      { x:3550, y:460, w:100, h:60, type:'theatre_table', legs:[{x:5,w:8},{x:87,w:8}], topY:460 },
      { x:3750, y:460, w:100, h:60, type:'theatre_table', legs:[{x:5,w:8},{x:87,w:8}], topY:460 },
    ];

    this.bookshelves = [
      { x:1550, y:300, w:30, h:300, fallen:false, fallTime:0 },
      { x:1750, y:300, w:30, h:300, fallen:false, fallTime:0 },
      { x:1950, y:300, w:30, h:300, fallen:false, fallTime:0 },
      { x:2150, y:300, w:30, h:300, fallen:false, fallTime:0 },
      { x:2350, y:300, w:30, h:300, fallen:false, fallTime:0 },
    ];

    this.exit = { x:4950, y:400, w:90, h:200, locked:true };
    this.doors = [
      { x:1450, y:400, w:60, h:200, locked:true, quizIndex:0, zone:1, label:'To Library' },
      { x:3050, y:400, w:60, h:200, locked:true, quizIndex:1, zone:2, label:'To Theatre' },
    ];

    this.badges = [
      { x:300, y:480, w:24, h:24, collected:false, type:'helmet', desc:'Safety Helmet' },
      { x:1180, y:460, w:24, h:24, collected:false, type:'firstaid', desc:'First Aid' },
      { x:2100, y:460, w:24, h:24, collected:false, type:'radio', desc:'Emergency Radio' },
      { x:3450, y:420, w:24, h:24, collected:false, type:'flashlight', desc:'Flashlight' },
    ];

    this.npcs = [
      { x:700, y:540, w:26, h:44, rescued:false, type:'student', message:'I\'m scared! What to do?' },
      { x:2400, y:540, w:26, h:44, rescued:false, type:'librarian', message:'Books falling! Help!' },
    ];

    this.cracks = [
      { x:1300, y:590, w:80, h:10 },
      { x:2900, y:590, w:120, h:10 },
      { x:4100, y:590, w:100, h:10 },
    ];

    this.eduQueue = [
      { t:1, text:"📚 CLASSROOM: Find DESK! Press S to SLIDE UNDER, then HOLD E to grip legs! (Hold E, don't just tap!)" },
      { t:8, text:"💡 TIP: Tables protect ONLY if you HOLD ON - shaking slides them away! Hold E continuously!" },
      { t:22, text:"⚠️ EARTHQUAKE! DROP! Press S to slide under, then HOLD E without releasing! Cover head!" },
      { t:38, text:"🚪 Door locked! Press E near door to trigger quiz!" },
      { t:45, text:"📖 LIBRARY: Bookshelves FALL! Stay under tables! Crawl (S) between covers!" },
      { t:60, text:"💥 AFTERSHOCK! Keep holding E! Don't let go!" },
      { t:75, text:"🏃 EVACUATE! Avoid cracks! Help others! EXIT!" },
    ];
    this.eduIndex = 0;

    // Mid-game quizzes - IN BETWEEN gameplay, not just doors
    this.midQuizzes = [
      { time: 12*60, quizIndex: 0, triggered: false, title: "Mid-Game Safety Check - Classroom" },
      { time: 38*60, quizIndex: 2, triggered: false, title: "Library Danger Quiz" },
      { time: 62*60, quizIndex: 3, triggered: false, title: "Evacuation Quiz" },
      { time: 78*60, quizIndex: 5, triggered: false, title: "Final Safety Check" },
    ];
    this.isQuizActive = false;
    this.quizScoreMid = 0;

    this.bindInput();
  }

  bindInput() {
    this.kd = (e)=>{
      if (e.code==='KeyA'||e.code==='ArrowLeft') this.input.left=true;
      if (e.code==='KeyD'||e.code==='ArrowRight') this.input.right=true;
      if (e.code==='KeyW'||e.code==='ArrowUp'||e.code==='Space') { this.input.jump=true; this.input.up=true; }
      if (e.code==='KeyS'||e.code==='ArrowDown') this.input.down=true;
      if (e.code==='ShiftLeft'||e.code==='ShiftRight') this.input.shift=true;
      if (e.code==='KeyE') this.input.interact=true;
    };
    this.ku = (e)=>{
      if (e.code==='KeyA'||e.code==='ArrowLeft') this.input.left=false;
      if (e.code==='KeyD'||e.code==='ArrowRight') this.input.right=false;
      if (e.code==='KeyW'||e.code==='ArrowUp'||e.code==='Space') { this.input.jump=false; this.input.up=false; }
      if (e.code==='KeyS'||e.code==='ArrowDown') this.input.down=false;
      if (e.code==='ShiftLeft'||e.code==='ShiftRight') this.input.shift=false;
      if (e.code==='KeyE') this.input.interact=false;
    };
  }

  start(){ this.running=true; window.addEventListener('keydown', this.kd); window.addEventListener('keyup', this.ku); this.loop(); }
  stop(){ this.running=false; window.removeEventListener('keydown', this.kd); window.removeEventListener('keyup', this.ku); if (this.animationId) cancelAnimationFrame(this.animationId); }
  loop(){ if (!this.running) return; this.animationId=requestAnimationFrame(()=>this.loop()); this.update(); this.draw(); }

  update(){
    this.time++; this.phaseTime++;
    if (this.interactCooldown>0) this.interactCooldown--;

    // If quiz is active, pause game logic (but keep timer? pause timer too for fairness)
    if (this.isQuizActive) {
      // Still update camera and particles for visual
      this.world.updateCamera(this.player, this.levelWidth, this.levelHeight);
      this.world.updateParticles();
      this.prevInteract = this.input.interact;
      return;
    }

    if (this.time%60===0 && this.timer>0){
      this.timer--;
      document.getElementById('gameTimer').textContent=`${Math.floor(this.timer/60)}:${String(this.timer%60).padStart(2,'0')}`;
      if (this.timer<=0){ this.fail('Time ran out! Earthquake evacuation must be fast but safe!'); return; }
    }
    if (this.phaseTime > this.phaseDuration) this.nextPhase();

    let globalT=this.time/60;
    if (this.eduIndex < this.eduQueue.length && globalT >= this.eduQueue[this.eduIndex].t){
      this.showEdu(this.eduQueue[this.eduIndex].text);
      this.eduIndex++;
    }

    // Mid-game quizzes IN BETWEEN gameplay
    for (let mq of this.midQuizzes) {
      if (!mq.triggered && this.time >= mq.time) {
        mq.triggered = true;
        this.isQuizActive = true;
        this.showEdu(`🧠 QUIZ TIME! ${mq.title} - Answer to continue!`);
        this.triggerQuiz(mq.quizIndex, (correct)=>{
          this.isQuizActive = false;
          if (correct) {
            this.quizScoreMid += 100;
            this.showEdu("✅ Correct! +100 bonus! Keep going!");
          } else {
            this.showEdu("❌ Wrong, but keep going! Learn from mistake!");
          }
        }, true); // true = mid-game, not door
        break; // only one at a time
      }
    }

    if (this.player.x < 1450) this.zone = 0;
    else if (this.player.x < 3050) this.zone = 1;
    else this.zone = 2;

    // Detect just pressed for one-time actions
    let justPressed = this.input.interact && !this.prevInteract;

    // Check under cover BEFORE player update so holding works instantly
    let cover = this.player.checkUnderCover(this.covers);
    if (cover && !this.holdTutorialShown && this.phase===1){
      this.showEdu("✅ Under table! Now HOLD E (keep holding, don't tap!) to grip legs! Bar fills to 100%!");
      this.holdTutorialShown=true;
    }

    this.player.update(this.input, this.platforms, this.world);
    this.input.jump=false;

    // Re-check after movement for accurate visual
    this.player.checkUnderCover(this.covers);

    if (this.phase===1 || this.phase===3){
      let rate = this.phase===1 ? 8 : 15;
      if (this.time % rate ===0){
        let rx = this.player.x + (Math.random()-0.5)*700;
        rx = Math.max(0, Math.min(rx, this.levelWidth-20));
        this.debris.push({
          x: rx, y: -30 - Math.random()*300,
          w: 14+Math.random()*20, h: 14+Math.random()*20,
          vx: (Math.random()-0.5)*2, vy: 1+Math.random()*3,
          rot:0, rotSpeed:(Math.random()-0.5)*0.25,
          shadow:true, type: Math.random()>0.5 ? 'ceiling' : 'light'
        });
        if (this.phase===1) this.world.shake(9);
      }
    }

    if (this.phase>=2 && this.zone===1){
      for (let bs of this.bookshelves){
        if (!bs.fallen && Math.abs(this.player.x - bs.x) < 400 && Math.random()<0.02){
          bs.fallen=true; bs.fallTime=this.time;
          for (let i=0;i<5;i++){
            this.debris.push({
              x: bs.x + Math.random()*bs.w, y: bs.y + Math.random()*200,
              w:10+Math.random()*12, h:10+Math.random()*12,
              vx:(Math.random()-0.5)*4, vy:2+Math.random()*3,
              rot:0, rotSpeed:(Math.random()-0.5)*0.3,
              shadow:false, type:'book'
            });
          }
        }
      }
    }

    // Enhanced debris with table bounce logic
    for (let i=this.debris.length-1;i>=0;i--){
      let d=this.debris[i];
      // Store prev pos for collision
      let prevY = d.y;
      d.x+=d.vx; d.y+=d.vy; d.vy+=0.35; d.rot+=d.rotSpeed;

      // Check collision with table tops - BOUNCE OFF!
      let bounced = false;
      for (let cover of this.covers) {
        // Table top is at cover.y, thickness 10px, width cover.w
        // Debris hits table top if falling (vy>0) and overlapping horizontally and y crosses top
        if (d.vy > 0 && d.x + d.w > cover.x + 2 && d.x < cover.x + cover.w - 2) {
          let tableTop = cover.y;
          let tableBottom = cover.y + 12;
          // Was above table, now at or below top
          if (prevY + d.h <= tableTop + 4 && d.y + d.h >= tableTop && d.y <= tableBottom) {
            // Hit table!
            d.y = tableTop - d.h - 1; // place on top
            d.vy = -d.vy * 0.45 - Math.random()*1.5; // bounce up with dampening
            d.vx += (Math.random()-0.5)*4 + (cover.x + cover.w/2 - (d.x + d.w/2))*0.02; // scatter sideways
            d.bounces = (d.bounces||0)+1;
            
            // Check if player is under this specific table and protected
            let playerUnderThis = this.player.underCover === cover && this.player.isFullyProtected();
            let playerUnderThisButNotHolding = this.player.underCover === cover && !this.player.isFullyProtected();
            
            if (playerUnderThis) {
              // Perfect protection - rock bounces off, player safe
              this.world.addParticle({ x:d.x + d.w/2, y:tableTop, vx:(Math.random()-0.5)*3, vy:-2.5, size:7, color:'#00ff88', life:18, maxLife:18, alpha:1, gravity:0.12, shape:'circle' });
              this.world.addParticle({ x:d.x + d.w/2, y:tableTop, vx:(Math.random()-0.5)*4, vy:-1, size:4, color:'#ffde59', life:14, maxLife:14, alpha:1, gravity:0.15, shape:'circle' });
              this.world.shake(2);
              // Add table shake visual - we store shake in cover
              cover.shake = 8;
              if (d.bounces===1) this.showEdu(`✅ Rock bounced off ${cover.type}! Table protecting you! Keep holding E!`);
            } else if (playerUnderThisButNotHolding) {
              // Under but not holding - table slides! Debris still hits table but table moves, player gets hit after 2 bounces
              if (d.bounces >= 2) {
                // Table slid away, now debris hits player
                // Don't bounce again, let it fall to player
              } else {
                this.world.addParticle({ x:d.x + d.w/2, y:tableTop, vx:(Math.random()-0.5)*3, vy:-1.5, size:5, color:'#ffde59', life:12, maxLife:12, alpha:1, gravity:0.1, shape:'circle' });
                cover.shake = 12;
                if (d.bounces===1) this.showEdu("⚠️ Table sliding! HOLD E tightly or it moves away!");
              }
            } else {
              // No player under this table - just bounce visually
              this.world.addParticle({ x:d.x + d.w/2, y:tableTop, vx:(Math.random()-0.5)*2, vy:-1, size:3, color:'#8a5cff', life:10, maxLife:10, alpha:1, gravity:0.1, shape:'circle' });
              cover.shake = 5;
            }
            
            bounced = true;
            // If bounced more than 3 times, remove (settled)
            if (d.bounces > 3 || Math.abs(d.vy) < 0.8) {
              // Let it slide off table
              d.vy = 0.5;
              d.vx += (Math.random()>0.5?1:-1)*2;
            }
            break;
          }
        }
      }

      // If bounced off table and player is protected under that table, don't check player collision
      if (bounced && this.player.underCover && this.player.isFullyProtected()) {
        // Check if debris is still above table (bouncing), skip player hit
        let under = this.player.underCover;
        if (d.y + d.h < under.y + under.h) {
          // Debris is above table, player safe underneath
          if (d.y > this.levelHeight+120) this.debris.splice(i,1);
          continue;
        }
      }

      // Player collision - only if not protected by table above
      if (this.player.alive && d.x < this.player.x+this.player.width && d.x+d.w > this.player.x && d.y < this.player.y+this.player.height && d.y+d.h > this.player.y){
        // Double-check: is there a table between debris and player?
        let blockedByTable = false;
        if (this.player.underCover) {
          let c = this.player.underCover;
          // If debris is above table top and player is below table, blocked
          if (d.y + d.h <= c.y + 15 && this.player.y >= c.y) {
            blockedByTable = this.player.isFullyProtected();
          }
        }
        
        if (blockedByTable) {
          // Blocked by table - bounce off again
          d.vy = -Math.abs(d.vy)*0.5;
          d.vx += (Math.random()-0.5)*3;
          this.world.addParticle({ x:d.x + d.w/2, y:d.y, vx:(Math.random()-0.5)*3, vy:-2, size:6, color:'#00ff88', life:15, maxLife:15, alpha:1, gravity:0.1, shape:'circle' });
          this.world.shake(2);
          continue;
        }
        
        let protectedNow = this.player.isFullyProtected();
        if (!protectedNow){
          let died = this.player.takeDamage(28, this.world);
          this.world.addParticle({ x:d.x, y:d.y, vx:0, vy:-2, size:8, color:'#ff3b3b', life:18, maxLife:18, alpha:1, gravity:0, shape:'circle' });
          document.getElementById('healthFill').style.width=this.player.health+'%';
          document.getElementById('damageVignette').style.boxShadow=`inset 0 0 80px rgba(255,0,0,${0.3 + (100-this.player.health)/250})`;
          setTimeout(()=>{ document.getElementById('damageVignette').style.boxShadow='inset 0 0 100px rgba(255,0,0,0)'; }, 180);
          if (!this.player.underCover){
            this.showEdu("💥 Hit! NOT under table! Press S to SLIDE UNDER!");
          } else if (!this.player.holding){
            this.showEdu("💥 Hit! Under but NOT HOLDING! HOLD E continuously!");
          }
          if (died){ this.fail('Hit by debris! Remember: SLIDE UNDER (S) + HOLD ON (hold E)!'); return; }
        } else {
          this.world.addParticle({ x:d.x, y:d.y, vx:(Math.random()-0.5)*4, vy:-2, size:6, color:'#00ff88', life:15, maxLife:15, alpha:1, gravity:0.1, shape:'circle' });
          this.world.shake(3);
        }
        this.debris.splice(i,1);
        continue;
      }
      if (d.y > this.levelHeight+120) this.debris.splice(i,1);
    }

    for (let b of this.badges){
      if (!b.collected && this.player.x < b.x+b.w && this.player.x+this.player.width > b.x && this.player.y < b.y+b.h && this.player.y+this.player.height > b.y){
        b.collected=true; this.collected++; this.player.badges=this.collected;
        document.getElementById('badgeCount').textContent=`${this.collected} / 4`;
        this.world.playSound('pickup');
        this.showEdu(`🎖️ ${b.desc}: ${b.type==='helmet'?'Protects head!':b.type==='firstaid'?'For injuries!':b.type==='radio'?'Emergency info!':'See in dark!'}`);
      }
    }

    for (let npc of this.npcs){
      if (!npc.rescued && Math.abs(this.player.x - npc.x) < 65 && Math.abs(this.player.y - npc.y) < 65){
        if (justPressed && this.interactCooldown===0){
          npc.rescued=true;
          this.showEdu(`🙏 Rescued ${npc.type}! Great!`);
          this.interactCooldown=20;
        }
      }
    }

    for (let cr of this.cracks){
      if (this.player.x+this.player.width > cr.x && this.player.x < cr.x+cr.w && this.player.y+this.player.height > cr.y && this.player.y < cr.y+cr.h+20){
        if (this.time%20===0){
          let died=this.player.takeDamage(5, this.world);
          document.getElementById('healthFill').style.width=this.player.health+'%';
          this.showEdu("⚠️ Floor crack! Avoid! Structure weak!");
          if (died){ this.fail('Fell through cracked floor! Avoid cracks!'); return; }
        }
      }
    }

    for (let door of this.doors){
      if (Math.abs(this.player.x - door.x) < 85 && Math.abs(this.player.y - door.y) < 110){
        if (door.locked){
          if (justPressed && !this.quizTriggered[door.quizIndex] && this.interactCooldown===0){
            this.quizTriggered[door.quizIndex]=true;
            this.interactCooldown=30;
            this.triggerQuiz(door.quizIndex, ()=>{
              door.locked=false;
              this.showEdu(`🔓 ${door.label} unlocked! Go through!`);
            });
          }
        }
      }
    }

    if (this.player.x+this.player.width > this.exit.x && this.player.x < this.exit.x+this.exit.w && this.player.y+this.player.height > this.exit.y){
      if (this.exit.locked){
        if (this.phase>=4){
          this.exit.locked=false; this.exitUnlocked=true;
        } else {
          if (justPressed) this.showEdu("🚪 Exit locked! Complete all zones first!");
        }
      } else {
        this.complete();
      }
    }

    if (this.player.y > this.levelHeight+150) this.fail('Fell down! Stay on safe ground!');

    this.world.updateCamera(this.player, this.levelWidth, this.levelHeight);
    this.world.updateParticles();
    this.prevInteract = this.input.interact;
  }

  triggerQuiz(index, onSuccess, isMidGame=false){
    const quiz = this.config.quizzes[index];
    if (!quiz) { onSuccess(isMidGame ? true : undefined); return; }
    this.isQuizActive = true;
    const modal=document.getElementById('quizModal');
    // Update modal title for mid-game
    const titleEl = modal.querySelector('h2');
    if (titleEl) titleEl.textContent = isMidGame ? `🧠 In-Game Quiz - ${this.zone===0?'Classroom':this.zone===1?'Library':'Theatre'}` : '🧠 Safety Check! Door Unlock Quiz';
    
    document.getElementById('quizQuestion').textContent=quiz.q;
    const optsDiv=document.getElementById('quizOptions');
    optsDiv.innerHTML='';
    document.getElementById('quizFeedback').textContent='';
    document.getElementById('quizFeedback').className='quiz-feedback';
    quiz.options.forEach((opt, idx)=>{
      let btn=document.createElement('div');
      btn.className='quiz-opt';
      btn.textContent=`${String.fromCharCode(65+idx)}. ${opt}`;
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.quiz-opt').forEach(b=>b.style.pointerEvents='none');
        if (idx===quiz.correct){
          btn.classList.add('correct');
          document.getElementById('quizFeedback').textContent='✅ Correct! '+quiz.explain;
          document.getElementById('quizFeedback').className='quiz-feedback correct';
          setTimeout(()=>{ 
            modal.classList.add('hidden'); 
            this.isQuizActive = false;
            if (isMidGame) onSuccess(true);
            else onSuccess();
          }, 2200);
        } else {
          btn.classList.add('wrong');
          document.querySelectorAll('.quiz-opt')[quiz.correct].classList.add('correct');
          if (isMidGame) {
            document.getElementById('quizFeedback').textContent='❌ Wrong. '+quiz.explain+' Continuing...';
            document.getElementById('quizFeedback').className='quiz-feedback wrong';
            setTimeout(()=>{
              modal.classList.add('hidden');
              this.isQuizActive = false;
              onSuccess(false);
            }, 2800);
          } else {
            document.getElementById('quizFeedback').textContent='❌ Wrong. '+quiz.explain+' Try again in 3s';
            document.getElementById('quizFeedback').className='quiz-feedback wrong';
            setTimeout(()=>{
              modal.classList.add('hidden');
              this.isQuizActive = false;
              this.quizTriggered[index]=false;
            }, 2800);
          }
        }
      });
      optsDiv.appendChild(btn);
    });
    modal.classList.remove('hidden');
  }

  nextPhase(){
    this.phase++;
    this.phaseTime=0;
    if (this.phase < this.config.phases.length){
      this.phaseDuration=this.config.phases[this.phase].duration*60;
      document.getElementById('phaseIndicator').textContent=`Phase ${this.phase+1}: ${this.config.phases[this.phase].name}`;
      document.getElementById('gameFooter').textContent=this.config.phases[this.phase].message;
      if (this.phase===1 || this.phase===3){
        this.world.shake(14);
        this.world.playSound('quake');
      }
      if (this.phase===4){
        this.exit.locked=false;
        this.exitUnlocked=true;
        this.showEdu("🚪 FINAL EXIT UNLOCKED! Avoid cracks, help others, escape!");
      }
    }
  }

  showEdu(text){
    const p=document.getElementById('educationalPopup');
    p.textContent=text;
    p.classList.remove('hidden');
    clearTimeout(this.eduTimeout);
    this.eduTimeout=setTimeout(()=>p.classList.add('hidden'), 5000);
  }

  complete(){
    this.stop();
    let timeBonus=this.timer*10;
    let badgeBonus=this.collected*150;
    let healthBonus=this.player.health*2;
    let midQuizBonus=this.quizScoreMid||0;
    let total=timeBonus+badgeBonus+healthBonus+midQuizBonus;
    this.onQuiz(this.config, { timeBonus, badgeBonus, healthBonus, midQuizBonus, total, badges:this.collected, timeLeft:this.timer, health:this.player.health, midQuizzes: this.midQuizzes.filter(m=>m.triggered).length });
  }

  fail(reason){
    this.stop();
    this.onComplete(false, reason, { badges:this.collected, health:this.player.health });
  }

  draw(){
    let ctx=this.world.ctx;
    let cam=this.world.camera;

    this.world.clear('#1a1030');

    for (let zone=0; zone<3; zone++){
      let zx = zone*1733 - cam.x;
      let col = zone===0 ? '#2a1a3a' : zone===1 ? '#1a2a3a' : '#2a1a1a';
      if (zx > -1800 && zx < this.world.width){
        ctx.fillStyle=col;
        ctx.fillRect(zx, 0, 1733, 600 - cam.y);
        ctx.fillStyle='rgba(255,255,255,0.08)';
        ctx.font='bold 48px Outfit';
        ctx.textAlign='center';
        ctx.fillText(zone===0?'CLASSROOM':zone===1?'LIBRARY':'THEATRE', zx+866, 120 - cam.y);
      }
    }

    for (let p of this.platforms){
      let sx=p.x-cam.x, sy=p.y-cam.y;
      if (sx<-300||sx>this.world.width+300) continue;
      if (p.type==='ground'){
        ctx.fillStyle= p.y>550 ? '#3a2a1a' : '#5a3a2a';
        ctx.fillRect(sx,sy,p.w,p.h);
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.fillRect(sx,sy,p.w,6);
      } else {
        ctx.fillStyle='#ff7a9a';
        ctx.fillRect(sx,sy,p.w,p.h);
      }
    }

    for (let cr of this.cracks){
      let sx=cr.x-cam.x, sy=cr.y-cam.y;
      if (sx<-100||sx>this.world.width+100) continue;
      ctx.fillStyle='#1a0a00';
      ctx.fillRect(sx,sy,cr.w,cr.h);
      ctx.strokeStyle='#ff3b3b';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(sx,sy+cr.h/2);
      ctx.lineTo(sx+cr.w, sy+cr.h/2+ (Math.sin(cr.x)*4));
      ctx.stroke();
      ctx.fillStyle='#ff3b3b';
      ctx.font='10px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText('CRACK!', sx+cr.w/2, sy-6);
    }

    for (let bs of this.bookshelves){
      let sx=bs.x-cam.x, sy=bs.y-cam.y;
      if (sx<-100||sx>this.world.width+100) continue;
      ctx.save();
      if (bs.fallen){
        let fallProgress = Math.min(1, (this.time - bs.fallTime)/30);
        ctx.translate(sx+bs.w/2, sy+bs.h);
        ctx.rotate(fallProgress * (Math.PI/2.5));
        ctx.translate(-(sx+bs.w/2), -(sy+bs.h));
        ctx.globalAlpha=1-fallProgress*0.3;
      }
      ctx.fillStyle='#5a3a1a';
      ctx.fillRect(sx,sy,bs.w,bs.h);
      ctx.fillStyle='#3a2a1a';
      for (let y=0;y<bs.h;y+=30){
        ctx.fillRect(sx,sy+y,bs.w,4);
        ctx.fillStyle= y%60===0 ? '#ff6a3a' : '#6a8aff';
        ctx.fillRect(sx+4,sy+y+6, bs.w-8, 18);
      }
      ctx.restore();
    }

    for (let c of this.covers){
      // Apply shake decay
      if (c.shake) c.shake *= 0.85;
      if (c.shake && c.shake < 0.5) c.shake = 0;
      let shakeX = c.shake ? (Math.random()-0.5)*c.shake : 0;
      let shakeY = c.shake ? (Math.random()-0.5)*c.shake*0.5 : 0;

      let sx=c.x-cam.x + shakeX, sy=c.y-cam.y + shakeY;
      if (sx<-150||sx>this.world.width+150) continue;

      let isPlayerUnder = this.player.underCover===c;
      let isFullyProtected = isPlayerUnder && this.player.isFullyProtected();

      // Table top with bounce highlight
      ctx.fillStyle = isFullyProtected ? '#00ff88' : isPlayerUnder ? '#ffde59' : '#8a5a3a';
      ctx.fillRect(sx, sy, c.w, 10);
      // Impact flash if recently hit
      if (c.shake && c.shake > 3) {
        ctx.fillStyle = `rgba(255,255,255,${c.shake/20})`;
        ctx.fillRect(sx, sy, c.w, 10);
      }
      ctx.fillStyle='rgba(0,0,0,0.15)';
      ctx.fillRect(sx, sy+4, c.w, 3);

      ctx.fillStyle='#5a3a2a';
      for (let leg of c.legs){
        ctx.fillRect(sx+leg.x, sy+10, leg.w, c.h-10);
      }

      ctx.fillStyle = isPlayerUnder ? 'rgba(0,255,136,0.15)' : 'rgba(0,0,0,0.25)';
      ctx.fillRect(sx+4, sy+10, c.w-8, c.h-14);

      ctx.strokeStyle = isFullyProtected ? '#00ff88' : isPlayerUnder ? '#ffde59' : 'rgba(0,255,136,0.3)';
      ctx.lineWidth = isPlayerUnder ? 3 : 1;
      if (isPlayerUnder) ctx.setLineDash([6,3]);
      ctx.strokeRect(sx-2, sy-2, c.w+4, c.h+4);
      ctx.setLineDash([]);

      if (isPlayerUnder){
        ctx.fillStyle = isFullyProtected ? '#00ff88' : '#ffde59';
        ctx.font='bold 11px JetBrains Mono';
        ctx.textAlign='center';
        if (this.player.holding) ctx.fillText(`HOLDING! ${Math.floor(this.player.holdStrength)}% - KEEP HOLDING!`, sx+c.w/2, sy-18);
        else ctx.fillText('HOLD E (KEEP HOLDING!)', sx+c.w/2, sy-18);
        
        // Show protected shield
        if (isFullyProtected) {
          ctx.strokeStyle='rgba(0,255,136,0.4)';
          ctx.lineWidth=2;
          ctx.setLineDash([3,3]);
          ctx.beginPath();
          ctx.arc(sx+c.w/2, sy+c.h/2+5, c.w/2+8, 0, Math.PI*2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle='#00ff88';
          ctx.font='10px JetBrains Mono';
          ctx.fillText('🛡️ SHIELDED', sx+c.w/2, sy+c.h+12);
        }
      } else if (this.phase===1 || this.phase===3){
        if (Math.abs(this.player.x - c.x) < 200){
          let bounce=Math.sin(this.time*0.15)*4;
          ctx.fillStyle='#00ff88';
          ctx.font='11px JetBrains Mono';
          ctx.textAlign='center';
          ctx.fillText('▼ S TO SLIDE UNDER ▼', sx+c.w/2, sy-12+bounce);
        }
      }

      ctx.fillStyle='rgba(255,255,255,0.35)';
      ctx.font='9px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText(c.type.toUpperCase(), sx+c.w/2, sy+c.h-4);
    }

    for (let b of this.badges){
      if (b.collected) continue;
      let sx=b.x-cam.x, sy=b.y-cam.y;
      if (sx<-50||sx>this.world.width+50) continue;
      let float=Math.sin(this.time*0.08+b.x)*5;
      ctx.save();
      ctx.translate(sx+b.w/2, sy+b.h/2+float);
      ctx.rotate(Math.sin(this.time*0.05)*0.15);
      let col=b.type==='helmet'?'#ffde59':b.type==='firstaid'?'#ff3b3b':b.type==='radio'?'#00e5ff':'#ff8a00';
      ctx.fillStyle=col;
      ctx.beginPath(); ctx.arc(0,0,13,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='white';
      ctx.font='14px serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(b.type==='helmet'?'⛑️':b.type==='firstaid'?'🩹':b.type==='radio'?'📻':'🔦', 0,1);
      ctx.restore();
      ctx.fillStyle=col+'40';
      ctx.beginPath(); ctx.arc(sx+b.w/2, sy+b.h/2+float, 20,0,Math.PI*2); ctx.fill();
    }

    for (let npc of this.npcs){
      if (npc.rescued) continue;
      let sx=npc.x-cam.x, sy=npc.y-cam.y;
      if (sx<-80||sx>this.world.width+80) continue;
      ctx.fillStyle='#ffcf8a';
      ctx.fillRect(sx+5,sy,16,14);
      ctx.fillStyle=npc.type==='librarian'?'#8a5cff':'#ff6a6a';
      ctx.fillRect(sx+3,sy+14,20,18);
      ctx.fillStyle='#2a4a7a';
      ctx.fillRect(sx+5,sy+32,16,10);
      let bounce=Math.sin(this.time*0.12)*3;
      ctx.fillStyle='white';
      ctx.beginPath();
      ctx.roundRect(sx-20, sy-32+bounce, 66, 20, 8);
      ctx.fill();
      ctx.fillStyle='black';
      ctx.font='10px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText('HELP! E', sx+13, sy-18+bounce);
    }

    for (let door of this.doors){
      let sx=door.x-cam.x, sy=door.y-cam.y;
      if (sx<-100||sx>this.world.width+100) continue;
      ctx.fillStyle=door.locked?'#333':'#00ff88';
      ctx.fillRect(sx,sy,door.w,18);
      ctx.fillStyle=door.locked?'rgba(0,0,0,0.85)':'rgba(0,255,136,0.15)';
      ctx.fillRect(sx,sy+18,door.w,door.h-18);
      ctx.strokeStyle=door.locked?'#555':'#00ff88';
      ctx.lineWidth=3;
      ctx.strokeRect(sx,sy,door.w,door.h);
      ctx.fillStyle=door.locked?'#777':'black';
      ctx.font='bold 11px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText(door.label, sx+door.w/2, sy+11);
      if (door.locked){
        ctx.font='22px serif';
        ctx.fillText('🔒', sx+door.w/2, sy+door.h/2+10);
        ctx.font='10px JetBrains Mono';
        ctx.fillStyle='#ffde59';
        if (Math.abs(this.player.x-door.x)<90) ctx.fillText('[E] Quiz to Unlock', sx+door.w/2, sy+door.h+16);
      } else {
        ctx.fillStyle='#00ff88';
        ctx.font='bold 12px JetBrains Mono';
        ctx.fillText('OPEN →', sx+door.w/2, sy+door.h/2+10);
      }
    }

    {
      let sx=this.exit.x-cam.x, sy=this.exit.y-cam.y;
      if (sx>-100 && sx<this.world.width+100){
        ctx.fillStyle=this.exitUnlocked?'#00ff88':'#333';
        ctx.fillRect(sx,sy,this.exit.w,20);
        ctx.fillStyle=this.exitUnlocked?'rgba(0,255,136,0.18)':'rgba(0,0,0,0.8)';
        ctx.fillRect(sx,sy+20,this.exit.w,this.exit.h-20);
        ctx.strokeStyle=this.exitUnlocked?'#00ff88':'#555';
        ctx.lineWidth=3;
        ctx.strokeRect(sx,sy,this.exit.w,this.exit.h);
        ctx.fillStyle=this.exitUnlocked?'black':'#777';
        ctx.font='bold 14px JetBrains Mono';
        ctx.textAlign='center';
        ctx.fillText('EXIT', sx+this.exit.w/2, sy+12);
        if (!this.exitUnlocked){
          ctx.font='24px serif';
          ctx.fillText('🔒', sx+this.exit.w/2, sy+this.exit.h/2+20);
        } else {
          let b=Math.sin(this.time*0.15)*4;
          ctx.fillStyle='#00ff88';
          ctx.font='18px serif';
          ctx.fillText('→', sx+this.exit.w/2, sy+this.exit.h/2+20+b);
        }
      }
    }

    for (let d of this.debris){
      let sx=d.x-cam.x, sy=d.y-cam.y;
      if (sx<-50||sx>this.world.width+50) continue;
      if (d.shadow){
        let groundY = 600 - cam.y;
        ctx.fillStyle='rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(sx+d.w/2, groundY, d.w, 4, 0,0,Math.PI*2);
        ctx.fill();
        ctx.strokeStyle='rgba(255,59,59,0.5)';
        ctx.setLineDash([5,5]);
        ctx.beginPath();
        ctx.moveTo(sx+d.w/2, sy+d.h);
        ctx.lineTo(sx+d.w/2, groundY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.save();
      ctx.translate(sx+d.w/2, sy+d.h/2);
      ctx.rotate(d.rot);
      // Rock with more detail + bounce indicator
      if (d.type==='book') {
        ctx.fillStyle='#ff8a3a';
        ctx.fillRect(-d.w/2,-d.h/2,d.w,d.h);
        ctx.fillStyle='#ffcc8a';
        ctx.fillRect(-d.w/2+2,-d.h/2+2,d.w-4,3);
      } else if (d.type==='light') {
        ctx.fillStyle='#ffffaa';
        ctx.beginPath();
        ctx.arc(0,0,d.w/2,0,Math.PI*2);
        ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(-2,-2,d.w/4,0,Math.PI*2);
        ctx.fill();
      } else {
        // Rock - more realistic
        ctx.fillStyle= d.bounces ? '#9a8a7a' : '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(-d.w/2+2, -d.h/2);
        ctx.lineTo(d.w/2-1, -d.h/2+2);
        ctx.lineTo(d.w/2, d.h/2-2);
        ctx.lineTo(-d.w/2+3, d.h/2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle='rgba(0,0,0,0.3)';
        ctx.fillRect(-d.w/2+2,-d.h/2+2,d.w-6,3);
        // Bounce spark if recently bounced
        if (d.bounces && d.bounces>0 && Math.abs(d.vy) > 1) {
          ctx.fillStyle='rgba(255,222,89,0.6)';
          ctx.beginPath();
          ctx.arc(0, d.h/2+2, 3, 0, Math.PI*2);
          ctx.fill();
        }
      }
      ctx.restore();
      
      // Draw bounce trail for falling rocks
      if (d.vy > 2 && !d.bounces) {
        ctx.fillStyle='rgba(122,106,90,0.2)';
        ctx.fillRect(sx+d.w/2-1, sy-10, 2, 10);
      }
    }

    this.player.draw(ctx, cam);
    this.world.drawParticles();

    if (this.phase===1 || this.phase===3){
      ctx.fillStyle=`rgba(100,80,60,${0.08 + Math.sin(this.time*0.4)*0.04})`;
      ctx.fillRect(0,0,this.world.width,this.world.height);
      ctx.strokeStyle='rgba(255,255,255,0.12)';
      ctx.lineWidth=1;
      for (let i=0;i<25;i++){
        let x=(i*137+this.time*2.5)%this.world.width;
        let y=(i*67+this.time*3.2)%this.world.height;
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-3,y+12); ctx.stroke();
      }
    }

    if (this.phase>=1 && this.time%35 < 4){
      ctx.fillStyle='rgba(0,0,0,0.18)';
      ctx.fillRect(0,0,this.world.width,this.world.height);
    }

    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, 180, 28);
    ctx.fillStyle='#00ff88';
    ctx.font='bold 12px JetBrains Mono';
    ctx.textAlign='left';
    ctx.fillText(`ZONE ${this.zone+1}/3: ${['CLASSROOM','LIBRARY','THEATRE'][this.zone]}`, 18, 28);

    // HOLD indicator big at top center when under cover during quake
    if (this.player.underCover && (this.phase===1 || this.phase===3)) {
      let holdPct = Math.floor(this.player.holdStrength);
      ctx.fillStyle='rgba(0,0,0,0.7)';
      ctx.fillRect(this.world.width/2 - 110, 120, 220, 36);
      ctx.fillStyle = holdPct>50 ? '#00ff88' : '#ffde59';
      ctx.fillRect(this.world.width/2 - 106, 124, 212 * (holdPct/100), 14);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth=2;
      ctx.strokeRect(this.world.width/2 - 110, 120, 220, 36);
      ctx.fillStyle='white';
      ctx.font='bold 12px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText(holdPct>80 ? `HOLDING STRONG! ${holdPct}%` : `HOLD E! ${holdPct}% - KEEP HOLDING!`, this.world.width/2, 132);
      ctx.font='10px JetBrains Mono';
      ctx.fillStyle='#aaffcc';
      ctx.fillText(holdPct>50 ? 'Protected! Keep holding!' : 'Not holding enough! Debris will hit!', this.world.width/2, 146);
    }
  }
}
