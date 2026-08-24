import { Player } from '../engine/player.js';
import { World } from '../engine/world.js';
import { DISASTERS } from '../config.js';

export class FireLevel {
  constructor(canvas, onComplete, onQuiz) {
    this.canvas = canvas;
    this.world = new World(canvas);
    this.onComplete = onComplete;
    this.onQuiz = onQuiz;
    this.config = DISASTERS.fire;
    this.levelWidth = 5600;
    this.levelHeight = 700;
    this.player = new Player(100, 500);
    this.input = { left:false, right:false, up:false, down:false, jump:false, shift:false, interact:false };
    this.prevInteract = false;
    this.interactCooldown = 0;
    this.time = 0;
    this.phase = 0;
    this.phaseTime = 0;
    this.phaseDuration = this.config.phases[0].duration * 60;
    this.timer = 200;
    this.running = false;
    this.animationId = null;
    this.smokeLevel = 0;
    this.fires = [];
    this.extinguishers = [];
    this.npcs = [];
    this.rescued = 0;
    this.badges = [];
    this.collected = 0;
    this.exitUnlocked = false;
    this.doors = [];
    this.quizTriggers = [false,false,false];
    this.ladders = [];

    this.platforms = [
      { x:0, y:600, w:5600, h:100, type:'ground' },
      { x:200, y:500, w:180, h:15, type:'oneway' },
      { x:450, y:450, w:160, h:15, type:'oneway' },
      { x:700, y:400, w:180, h:15, type:'oneway' },
      { x:950, y:350, w:160, h:15, type:'oneway' },
      { x:1200, y:500, w:120, h:15, type:'oneway' },
      { x:1320, y:450, w:120, h:15, type:'oneway' },
      { x:1440, y:400, w:120, h:15, type:'oneway' },
      { x:1600, y:500, w:200, h:15, type:'oneway' },
      { x:1850, y:450, w:180, h:15, type:'oneway' },
      { x:2100, y:400, w:180, h:15, type:'oneway' },
      { x:2350, y:350, w:180, h:15, type:'oneway' },
      { x:2600, y:500, w:120, h:15, type:'oneway' },
      { x:2720, y:450, w:120, h:15, type:'oneway' },
      { x:2840, y:400, w:120, h:15, type:'oneway' },
      { x:3100, y:500, w:200, h:15, type:'oneway' },
      { x:3350, y:450, w:180, h:15, type:'oneway' },
      { x:3600, y:400, w:200, h:15, type:'oneway' },
      { x:3850, y:350, w:180, h:15, type:'oneway' },
      { x:4100, y:300, w:200, h:15, type:'oneway' },
      { x:4400, y:450, w:180, h:15, type:'oneway' },
      { x:4700, y:500, w:200, h:15, type:'oneway' },
    ];

    this.fires = [
      { x:380, y:560, w:70, h:40, active:true, intensity:1 },
      { x:750, y:360, w:90, h:40, active:true, intensity:1.2 },
      { x:1680, y:460, w:80, h:40, active:true, intensity:1 },
      { x:2140, y:360, w:100, h:50, active:true, intensity:1.5 },
      { x:2680, y:460, w:70, h:40, active:true, intensity:1 },
      { x:3200, y:460, w:80, h:40, active:true, intensity:1 },
      { x:3680, y:360, w:90, h:50, active:true, intensity:1.3 },
      { x:4180, y:260, w:100, h:50, active:true, intensity:1.5 },
      { x:4750, y:460, w:80, h:40, active:true, intensity:1 },
    ];

    this.extinguishers = [
      { x:250, y:550, w:22, h:32, used:false, uses:3 },
      { x:1200, y:550, w:22, h:32, used:false, uses:3 },
      { x:2000, y:550, w:22, h:32, used:false, uses:3 },
      { x:3400, y:550, w:22, h:32, used:false, uses:3 },
    ];

    this.npcs = [
      { x:600, y:410, w:26, h:42, rescued:false, type:'student', panic:0 },
      { x:1900, y:410, w:26, h:42, rescued:false, type:'student', panic:0 },
      { x:3500, y:410, w:26, h:42, rescued:false, type:'teacher', panic:0 },
    ];

    this.doors = [
      { x:1100, y:200, w:70, h:200, hot:true, checked:false, locked:false, label:'FLOOR 1' },
      { x:1500, y:400, w:60, h:200, hot:false, checked:false, locked:true, quizIndex:0, label:'Classroom' },
      { x:2500, y:200, w:70, h:400, hot:true, checked:false, locked:false, label:'GROUND' },
      { x:3000, y:400, w:60, h:200, hot:false, checked:false, locked:true, quizIndex:1, label:'Lab' },
      { x:4300, y:200, w:70, h:300, hot:false, checked:false, locked:true, quizIndex:2, label:'EXIT Hall' },
    ];

    this.ladders = [
      { x:1250, y:400, w:30, h:200 },
      { x:2650, y:400, w:30, h:200 },
    ];

    this.exit = { x:5350, y:400, w:90, h:200, locked:true };

    this.badges = [
      { x:500, y:410, w:24, h:24, collected:false, type:'mask', desc:'Smoke Mask' },
      { x:1800, y:410, w:24, h:24, collected:false, type:'blanket', desc:'Fire Blanket' },
      { x:3200, y:460, w:24, h:24, collected:false, type:'water', desc:'Water Bucket' },
      { x:4000, y:310, w:24, h:24, collected:false, type:'phone', desc:'Phone to call 101' },
    ];

    this.eduQueue = [
      { t:1, text:"🔥 FLOOR 2: Fire alarm! CRAWL on belly (hold S) - cover mouth!" },
      { t:10, text:"🚪 DOOR CHECK: Press E near door - RED=HOT! Don't open!" },
      { t:18, text:"🧯 EXTINGUISHER: Pick with E, then HOLD E + A/D to aim! Don't tap, HOLD!" },
      { t:30, text:"🧑‍🤝‍🧑 Rescue students! Press E near them!" },
      { t:45, text:"💨 Smoke thick! Only crawling keeps you alive!" },
      { t:60, text:"🚒 Ground floor! Final stretch! EXIT!" },
    ];
    this.eduIndex=0;

    this.midQuizzes = [
      { time: 14*60, quizIndex: 0, triggered: false, title: "Smoke Safety Quiz" },
      { time: 32*60, quizIndex: 1, triggered: false, title: "Door Check Quiz" },
      { time: 52*60, quizIndex: 2, triggered: false, title: "Extinguisher Quiz" },
      { time: 75*60, quizIndex: 4, triggered: false, title: "Clothes on Fire Quiz" },
    ];
    this.isQuizActive = false;
    this.quizScoreMid = 0;

    this.hasExtinguisher = false;
    this.extinguisherUses = 0;
    this.spraying = false;
    this.sprayDir = 1;

    this.bindInput();
  }

  bindInput(){
    this.kd=(e)=>{
      if (e.code==='KeyA'||e.code==='ArrowLeft'){ this.input.left=true; this.sprayDir=-1; }
      if (e.code==='KeyD'||e.code==='ArrowRight'){ this.input.right=true; this.sprayDir=1; }
      if (e.code==='KeyW'||e.code==='ArrowUp'||e.code==='Space'){ this.input.jump=true; this.input.up=true; }
      if (e.code==='KeyS'||e.code==='ArrowDown') this.input.down=true;
      if (e.code==='ShiftLeft'||e.code==='ShiftRight') this.input.shift=true;
      if (e.code==='KeyE') this.input.interact=true;
    };
    this.ku=(e)=>{
      if (e.code==='KeyA'||e.code==='ArrowLeft') this.input.left=false;
      if (e.code==='KeyD'||e.code==='ArrowRight') this.input.right=false;
      if (e.code==='KeyW'||e.code==='ArrowUp'||e.code==='Space'){ this.input.jump=false; this.input.up=false; }
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

    if (this.isQuizActive) {
      this.world.updateCamera(this.player, this.levelWidth, this.levelHeight);
      this.world.updateParticles();
      this.prevInteract = this.input.interact;
      return;
    }

    if (this.time%60===0 && this.timer>0){
      this.timer--;
      document.getElementById('gameTimer').textContent=`${Math.floor(this.timer/60)}:${String(this.timer%60).padStart(2,'0')}`;
      if (this.timer<=0){ this.fail('Time out! Fire spreads fast!'); return; }
    }
    if (this.phaseTime > this.phaseDuration) this.nextPhase();
    if (this.phase>=1) this.smokeLevel = Math.min(420, this.smokeLevel + 0.18 + this.phase*0.06);

    let globalT=this.time/60;
    if (this.eduIndex < this.eduQueue.length && globalT >= this.eduQueue[this.eduIndex].t){
      this.showEdu(this.eduQueue[this.eduIndex].text);
      this.eduIndex++;
    }

    for (let mq of this.midQuizzes) {
      if (!mq.triggered && this.time >= mq.time) {
        mq.triggered = true;
        this.isQuizActive = true;
        this.showEdu(`🧠 QUIZ! ${mq.title} - Answer to continue!`);
        this.triggerQuiz(mq.quizIndex, (correct)=>{
          this.isQuizActive = false;
          if (correct) {
            this.quizScoreMid += 100;
            this.showEdu("✅ Correct! +100 bonus!");
          } else {
            this.showEdu("❌ Wrong, but continue! Learn!");
          }
        }, true);
        break;
      }
    }

    this.world.nearLadder = false;
    for (let lad of this.ladders){
      if (Math.abs(this.player.x - lad.x) < 40 && this.player.y+this.player.height > lad.y && this.player.y < lad.y+lad.h){
        this.world.nearLadder = lad;
        break;
      }
    }

    let justPressed = this.input.interact && !this.prevInteract;

    this.player.update(this.input, this.platforms, this.world);
    this.input.jump=false;

    let smokeBottom = this.smokeLevel;
    let playerHeadY = this.player.y;
    let inSmoke = playerHeadY < smokeBottom - 20;
    if (inSmoke && !this.player.crawling){
      if (this.time%18===0){
        let died=this.player.takeDamage(9, this.world);
        document.getElementById('healthFill').style.width=this.player.health+'%';
        this.showEdu("💨 SMOKE! CRAWL! Hold S, belly on floor!");
        if (died){ this.fail('Smoke inhalation! Always crawl low!'); return; }
      }
    }

    for (let f of this.fires){
      if (!f.active) continue;
      if (this.player.x < f.x+f.w && this.player.x+this.player.width > f.x && this.player.y < f.y+f.h && this.player.y+this.player.height > f.y){
        if (this.time%14===0){
          let died=this.player.takeDamage(14, this.world);
          document.getElementById('healthFill').style.width=this.player.health+'%';
          if (died){ this.fail('Burned! Avoid flames, use extinguisher!'); return; }
        }
      }
    }

    // Pick extinguisher - just pressed
    if (justPressed && this.interactCooldown===0){
      for (let ex of this.extinguishers){
        if (!ex.used && Math.abs(this.player.x - ex.x) < 60 && Math.abs(this.player.y - ex.y) < 60){
          ex.used=true;
          this.hasExtinguisher=true;
          this.extinguisherUses=3;
          this.collected++;
          document.getElementById('badgeCount').textContent=`${this.collected} / 4`;
          this.showEdu("🧯 Got extinguisher! HOLD E (keep holding!) + A/D to aim!");
          this.world.playSound('pickup');
          this.interactCooldown=15;
          break;
        }
      }
    }

    // Spraying - HOLD E
    if (this.input.interact && this.hasExtinguisher && this.extinguisherUses>0){
      this.spraying=true;
      for (let i=0;i<2;i++){
        this.world.addParticle({
          x: this.player.x + this.player.width/2 + this.sprayDir*20,
          y: this.player.y + this.player.height/2,
          vx: this.sprayDir*(5+Math.random()*3),
          vy: (Math.random()-0.5)*2,
          size: 3+Math.random()*3,
          color: 'rgba(200,230,255,0.8)',
          life:15, maxLife:15, alpha:1, gravity:0, shape:'circle'
        });
      }
      for (let f of this.fires){
        if (!f.active) continue;
        let inDir = (this.sprayDir===1 && f.x > this.player.x) || (this.sprayDir===-1 && f.x < this.player.x);
        let dist = Math.abs(f.x - this.player.x);
        if (inDir && dist < 280 && Math.abs(f.y - this.player.y) < 110){
          f.intensity -= 0.035;
          if (f.intensity <=0){
            f.active=false;
            this.showEdu("✅ Fire out! Great aim!");
            this.world.playSound('pickup');
          }
        }
      }
      if (this.time%28===0){
        this.extinguisherUses--;
        if (this.extinguisherUses<=0){
          this.hasExtinguisher=false;
          this.showEdu("🧯 Empty! Find another!");
        }
      }
    } else {
      this.spraying=false;
    }

    // Doors - just pressed
    for (let door of this.doors){
      if (Math.abs(this.player.x - door.x) < 75 && Math.abs(this.player.y - door.y) < 125){
        if (justPressed && this.interactCooldown===0){
          if (!door.checked){
            door.checked=true;
            if (door.hot){
              this.showEdu("🔥 Door HOT! RED glow! Don't open!");
              this.player.takeDamage(15, this.world);
              document.getElementById('healthFill').style.width=this.player.health+'%';
            } else {
              this.showEdu("✅ Door cool - safe!");
            }
            this.interactCooldown=20;
          } else if (door.locked){
            if (!this.quizTriggers[door.quizIndex]){
              this.quizTriggers[door.quizIndex]=true;
              this.interactCooldown=30;
              this.triggerQuiz(door.quizIndex, ()=>{
                door.locked=false;
                this.showEdu(`🔓 ${door.label} unlocked!`);
              });
            }
          }
        }
      }
    }

    for (let npc of this.npcs){
      if (!npc.rescued && Math.abs(this.player.x - npc.x) < 60 && Math.abs(this.player.y - npc.y) < 65){
        npc.panic = Math.min(100, npc.panic+0.8);
        if (justPressed && this.interactCooldown===0){
          npc.rescued=true;
          this.rescued++;
          this.showEdu(`🙏 Rescued ${npc.type}! ${this.rescued}/3`);
          this.interactCooldown=20;
        }
      }
    }

    for (let b of this.badges){
      if (!b.collected && this.player.x < b.x+b.w && this.player.x+this.player.width > b.x && this.player.y < b.y+b.h && this.player.y+this.player.height > b.y){
        b.collected=true;
        this.collected++;
        document.getElementById('badgeCount').textContent=`${this.collected} / 4`;
        this.world.playSound('pickup');
        this.showEdu(`🎒 ${b.desc}!`);
      }
    }

    let firesLeft = this.fires.filter(f=>f.active).length;
    if (this.rescued>=2 && firesLeft <=3 && !this.exitUnlocked){
      this.exitUnlocked=true;
      this.exit.locked=false;
      this.showEdu("🚪 EXIT UNLOCKED! Get out! Stay low!");
    }

    if (this.exitUnlocked && this.player.x+this.player.width > this.exit.x && this.player.x < this.exit.x+this.exit.w && this.player.y+this.player.height > this.exit.y){
      this.complete();
    }

    if (this.player.y > this.levelHeight+150) this.fail('Fell! Stay on path!');

    this.world.updateCamera(this.player, this.levelWidth, this.levelHeight);
    this.world.updateParticles();

    if (this.time%2===0){
      for (let f of this.fires) if (f.active){
        this.world.addParticle({
          x: f.x+Math.random()*f.w,
          y: f.y,
          vx: (Math.random()-0.5)*1.2,
          vy: -2.5-Math.random()*2,
          size: 3+Math.random()*4*f.intensity,
          color: Math.random()>0.5?'#ff6a00':'#ffcc00',
          life:22, maxLife:22, alpha:1, gravity:-0.06, shape:'circle'
        });
      }
    }

    this.prevInteract = this.input.interact;
  }

  triggerQuiz(index, onSuccess, isMidGame=false){
    const quiz=this.config.quizzes[index];
    if (!quiz){ onSuccess(isMidGame?true:undefined); return; }
    this.isQuizActive=true;
    const modal=document.getElementById('quizModal');
    const titleEl = modal.querySelector('h2');
    if (titleEl) titleEl.textContent = isMidGame ? `🧠 In-Game Quiz - Floor ${this.phase+1}` : '🧠 Safety Check! Door Unlock';
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
          setTimeout(()=>{ modal.classList.add('hidden'); this.isQuizActive=false; if (isMidGame) onSuccess(true); else onSuccess(); }, 2200);
        } else {
          btn.classList.add('wrong');
          document.querySelectorAll('.quiz-opt')[quiz.correct].classList.add('correct');
          if (isMidGame){
            document.getElementById('quizFeedback').textContent='❌ Wrong. '+quiz.explain+' Continuing...';
            document.getElementById('quizFeedback').className='quiz-feedback wrong';
            setTimeout(()=>{ modal.classList.add('hidden'); this.isQuizActive=false; onSuccess(false); }, 2800);
          } else {
            document.getElementById('quizFeedback').textContent='❌ Wrong. '+quiz.explain;
            document.getElementById('quizFeedback').className='quiz-feedback wrong';
            setTimeout(()=>{ modal.classList.add('hidden'); this.isQuizActive=false; this.quizTriggers[index]=false; }, 2800);
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
    let badgeBonus=this.collected*100 + this.rescued*150;
    let healthBonus=this.player.health*2;
    let midQuizBonus=this.quizScoreMid||0;
    let total=timeBonus+badgeBonus+healthBonus+midQuizBonus;
    this.onQuiz(this.config, { timeBonus, badgeBonus, healthBonus, midQuizBonus, total, badges:this.collected, rescued:this.rescued, timeLeft:this.timer, health:this.player.health, midQuizzes: this.midQuizzes.filter(m=>m.triggered).length });
  }
  fail(reason){
    this.stop();
    this.onComplete(false, reason, { badges:this.collected, rescued:this.rescued, health:this.player.health });
  }

  draw(){
    let ctx=this.world.ctx;
    let cam=this.world.camera;

    this.world.clear('#1a0a08');
    ctx.fillStyle='#2a1a14';
    ctx.fillRect(0,0,this.world.width,this.world.height);
    for (let x=0;x<this.levelWidth;x+=130){
      if (x-cam.x < -160 || x-cam.x > this.world.width+160) continue;
      ctx.fillStyle = (Math.floor(x/130)%2===0)?'#3a2a1a':'#4a3a2a';
      ctx.fillRect(x-cam.x, 300-cam.y, 110, 300);
      ctx.strokeStyle='rgba(0,0,0,0.25)';
      ctx.strokeRect(x-cam.x, 300-cam.y, 110, 300);
      if (x%500===0){
        ctx.fillStyle='#ff0000';
        ctx.beginPath();
        ctx.arc(x-cam.x+55, 320-cam.y, 6,0,Math.PI*2);
        ctx.fill();
        if (this.time%20<10){
          ctx.fillStyle='rgba(255,0,0,0.4)';
          ctx.beginPath();
          ctx.arc(x-cam.x+55, 320-cam.y, 12,0,Math.PI*2);
          ctx.fill();
        }
      }
    }

    for (let p of this.platforms){
      let sx=p.x-cam.x, sy=p.y-cam.y;
      if (sx<-300||sx>this.world.width+300) continue;
      if (p.type==='ground'){
        ctx.fillStyle='#4a3a2a';
        ctx.fillRect(sx,sy,p.w,p.h);
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.fillRect(sx,sy,p.w,6);
      } else {
        ctx.fillStyle='#6a4a3a';
        ctx.fillRect(sx,sy,p.w,p.h);
        ctx.fillStyle='rgba(0,0,0,0.15)';
        ctx.fillRect(sx,sy+p.h-3,p.w,3);
      }
    }

    for (let lad of this.ladders){
      let sx=lad.x-cam.x, sy=lad.y-cam.y;
      ctx.fillStyle='#8a6a4a';
      ctx.fillRect(sx,sy,6,lad.h);
      ctx.fillRect(sx+lad.w-6,sy,6,lad.h);
      ctx.fillStyle='#6a4a2a';
      for (let y=0;y<lad.h;y+=20){
        ctx.fillRect(sx,sy+y,lad.w,4);
      }
      if (this.world.nearLadder===lad){
        ctx.fillStyle='#00ff88';
        ctx.font='10px JetBrains Mono';
        ctx.textAlign='center';
        ctx.fillText('[E] Climb', sx+lad.w/2, sy-8);
      }
    }

    for (let f of this.fires) if (f.active){
      let sx=f.x-cam.x, sy=f.y-cam.y;
      if (sx<-120||sx>this.world.width+120) continue;
      ctx.fillStyle='#ff3b00';
      ctx.beginPath();
      ctx.moveTo(sx+f.w/2, sy-20*f.intensity);
      ctx.lineTo(sx, sy+f.h);
      ctx.lineTo(sx+f.w, sy+f.h);
      ctx.fill();
      ctx.fillStyle='#ffcc00';
      ctx.beginPath();
      ctx.moveTo(sx+f.w/2, sy-10*f.intensity);
      ctx.lineTo(sx+12, sy+f.h-12);
      ctx.lineTo(sx+f.w-12, sy+f.h-12);
      ctx.fill();
      ctx.fillStyle=`rgba(255,100,0,${0.15*f.intensity})`;
      ctx.beginPath();
      ctx.arc(sx+f.w/2, sy+f.h/2, 40*f.intensity,0,Math.PI*2);
      ctx.fill();
    }

    for (let ex of this.extinguishers) if (!ex.used){
      let sx=ex.x-cam.x, sy=ex.y-cam.y;
      ctx.fillStyle='#ff1a1a';
      ctx.fillRect(sx,sy,ex.w,ex.h);
      ctx.fillStyle='#222';
      ctx.fillRect(sx+5,sy-8,12,8);
      ctx.fillStyle='rgba(255,0,0,0.25)';
      ctx.beginPath();
      ctx.arc(sx+ex.w/2, sy+ex.h/2, 28,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle='white';
      ctx.font='8px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText('EXT', sx+ex.w/2, sy+ex.h/2+3);
    }

    for (let door of this.doors){
      let sx=door.x-cam.x, sy=door.y-cam.y;
      if (sx<-120||sx>this.world.width+120) continue;
      if (door.hot && !door.checked){
        ctx.fillStyle='rgba(255,0,0,0.25)';
        ctx.fillRect(sx-10,sy-10,door.w+20,door.h+20);
      } else if (!door.hot){
        ctx.fillStyle='rgba(0,255,136,0.15)';
        ctx.fillRect(sx-6,sy-6,door.w+12,door.h+12);
      }
      ctx.fillStyle= door.locked ? '#444' : door.hot ? '#ff4444' : '#00aa66';
      ctx.fillRect(sx,sy,door.w,18);
      ctx.fillStyle= door.locked ? 'rgba(0,0,0,0.85)' : door.hot ? 'rgba(255,60,60,0.3)' : 'rgba(0,255,136,0.15)';
      ctx.fillRect(sx,sy+18,door.w,door.h-18);
      ctx.strokeStyle= door.locked ? '#666' : door.hot ? '#ff6666' : '#00ff88';
      ctx.lineWidth=3;
      ctx.strokeRect(sx,sy,door.w,door.h);
      ctx.fillStyle= door.locked ? '#999' : 'black';
      ctx.font='bold 10px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText(door.label, sx+door.w/2, sy+11);
      if (door.locked){
        ctx.font='18px serif';
        ctx.fillText('🔒', sx+door.w/2, sy+door.h/2+10);
      } else if (door.hot){
        ctx.font='14px serif';
        ctx.fillText('🔥 HOT!', sx+door.w/2, sy+door.h/2+10);
      } else {
        ctx.fillStyle='#00ff88';
        ctx.font='10px JetBrains Mono';
        ctx.fillText('COOL ✓', sx+door.w/2, sy+door.h/2+10);
      }
      if (Math.abs(this.player.x-door.x)<80){
        ctx.fillStyle='#ffde59';
        ctx.font='10px JetBrains Mono';
        if (!door.checked) ctx.fillText('[E] Check Door', sx+door.w/2, sy+door.h+14);
        else if (door.locked) ctx.fillText('[E] Quiz Unlock', sx+door.w/2, sy+door.h+14);
        else ctx.fillText('Go Through →', sx+door.w/2, sy+door.h+14);
      }
    }

    for (let npc of this.npcs) if (!npc.rescued){
      let sx=npc.x-cam.x, sy=npc.y-cam.y;
      if (sx<-80||sx>this.world.width+80) continue;
      ctx.fillStyle='#ffcf8a';
      ctx.fillRect(sx+5,sy,16,14);
      ctx.fillStyle=npc.type==='teacher'?'#8a5cff':'#ff6a6a';
      ctx.fillRect(sx+3,sy+14,20,18);
      ctx.fillStyle='#2a4a7a';
      ctx.fillRect(sx+5,sy+32,16,10);
      let bounce=Math.sin(this.time*0.14)*3;
      ctx.fillStyle='white';
      ctx.beginPath();
      ctx.roundRect(sx-18, sy-36+bounce, 62, 20, 8);
      ctx.fill();
      ctx.fillStyle='black';
      ctx.font='10px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText('HELP! E', sx+13, sy-22+bounce);
      ctx.fillStyle='rgba(0,0,0,0.5)';
      ctx.fillRect(sx-10, sy-8, 46, 5);
      ctx.fillStyle=npc.panic>70?'#ff3b3b':'#ffde59';
      ctx.fillRect(sx-10, sy-8, 46*(npc.panic/100), 5);
    }

    for (let b of this.badges) if (!b.collected){
      let sx=b.x-cam.x, sy=b.y-cam.y;
      let float=Math.sin(this.time*0.08+b.x)*5;
      ctx.fillStyle='#00e5ff';
      ctx.beginPath();
      ctx.arc(sx+b.w/2, sy+b.h/2+float, 13,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle='white';
      ctx.font='13px serif';
      ctx.textAlign='center';
      ctx.fillText(b.type==='mask'?'😷':b.type==='blanket'?'🧣':b.type==='water'?'💧':'📱', sx+b.w/2, sy+b.h/2+float+4);
      ctx.fillStyle='#00e5ff40';
      ctx.beginPath();
      ctx.arc(sx+b.w/2, sy+b.h/2+float, 20,0,Math.PI*2);
      ctx.fill();
    }

    {
      let sx=this.exit.x-cam.x, sy=this.exit.y-cam.y;
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
        ctx.font='22px serif';
        ctx.fillText('🔒', sx+this.exit.w/2, sy+this.exit.h/2+20);
      } else {
        let b=Math.sin(this.time*0.15)*4;
        ctx.fillStyle='#00ff88';
        ctx.font='16px serif';
        ctx.fillText('→', sx+this.exit.w/2, sy+this.exit.h/2+20+b);
      }
    }

    if (this.smokeLevel>0){
      let grad=ctx.createLinearGradient(0,0,0,this.smokeLevel);
      grad.addColorStop(0, `rgba(50,50,50,${0.88})`);
      grad.addColorStop(0.6, `rgba(60,60,60,${0.5})`);
      grad.addColorStop(1, `rgba(60,60,60,0)`);
      ctx.fillStyle=grad;
      ctx.fillRect(0,0,this.world.width,this.smokeLevel);
      if (this.smokeLevel>90){
        ctx.fillStyle='rgba(255,255,255,0.65)';
        ctx.font='11px JetBrains Mono';
        ctx.textAlign='center';
        ctx.fillText('↑ SMOKE - CRAWL LOW (Hold S) + Cover Mouth ↑', this.world.width/2, this.smokeLevel-12);
      }
    }

    if (this.hasExtinguisher){
      ctx.fillStyle='rgba(0,0,0,0.6)';
      ctx.fillRect(this.world.width-140, 10, 130, 30);
      ctx.fillStyle='#00e5ff';
      ctx.font='11px JetBrains Mono';
      ctx.textAlign='left';
      ctx.fillText(`🧯 Uses: ${this.extinguisherUses}`, this.world.width-130, 28);
      if (this.spraying){
        ctx.fillStyle='#00ff88';
        ctx.fillText('HOLDING SPRAY!', this.world.width-130, 42);
      }
    }

    this.player.draw(ctx, cam);
    this.world.drawParticles();

    if (this.fires.some(f=>f.active)){
      ctx.fillStyle='rgba(255,80,0,0.07)';
      ctx.fillRect(0,0,this.world.width,this.world.height);
    }
  }
}
