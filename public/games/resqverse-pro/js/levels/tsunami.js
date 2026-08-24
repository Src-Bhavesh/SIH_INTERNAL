import { Player } from '../engine/player.js';
import { World } from '../engine/world.js';
import { DISASTERS } from '../config.js';

export class TsunamiLevel {
  constructor(canvas, onComplete, onQuiz) {
    this.canvas = canvas;
    this.world = new World(canvas);
    this.onComplete = onComplete;
    this.onQuiz = onQuiz;
    this.config = DISASTERS.tsunami;
    this.levelWidth = 6200;
    this.levelHeight = 800;
    this.player = new Player(100, 500);
    this.input = { left:false, right:false, up:false, down:false, jump:false, shift:false, interact:false };
    this.prevInteract = false;
    this.interactCooldown = 0;
    this.time = 0;
    this.phase = 0;
    this.phaseTime = 0;
    this.phaseDuration = this.config.phases[0].duration * 60;
    this.timer = 220;
    this.running = false;
    this.animationId = null;
    this.waterLevel = 680;
    this.badges = [];
    this.collected = 0;
    this.exitUnlocked = false;
    this.debrisFloat = [];
    this.ladders = [];
    this.quizTriggers = [false,false,false];
    this.doors = [];
    this.zone = 0;

    this.platforms = [
      { x:0, y:600, w:6200, h:200, type:'ground' },
      { x:250, y:520, w:160, h:15, type:'oneway' },
      { x:480, y:480, w:150, h:15, type:'oneway' },
      { x:700, y:440, w:160, h:15, type:'oneway' },
      { x:920, y:400, w:150, h:15, type:'oneway' },
      { x:1200, y:500, w:180, h:15, type:'oneway' },
      { x:1450, y:460, w:160, h:15, type:'oneway' },
      { x:1680, y:420, w:180, h:15, type:'oneway' },
      { x:1920, y:380, w:160, h:15, type:'oneway' },
      { x:2150, y:340, w:180, h:15, type:'oneway' },
      { x:2400, y:300, w:160, h:15, type:'oneway' },
      { x:2650, y:480, w:150, h:15, type:'oneway' },
      { x:2850, y:440, w:160, h:15, type:'oneway' },
      { x:3080, y:400, w:160, h:15, type:'oneway' },
      { x:3300, y:360, w:180, h:15, type:'oneway' },
      { x:3550, y:320, w:160, h:15, type:'oneway' },
      { x:3780, y:280, w:180, h:15, type:'oneway' },
      { x:4020, y:240, w:160, h:15, type:'oneway' },
      { x:4300, y:400, w:150, h:15, type:'oneway' },
      { x:4500, y:350, w:160, h:15, type:'oneway' },
      { x:4720, y:300, w:160, h:15, type:'oneway' },
      { x:4940, y:250, w:180, h:15, type:'oneway' },
      { x:5180, y:200, w:160, h:15, type:'oneway' },
      { x:5420, y:150, w:180, h:15, type:'oneway' },
      { x:5680, y:100, w:160, h:15, type:'oneway' },
      { x:5900, y:60, w:200, h:15, type:'oneway' },
    ];

    this.ladders = [
      { x:1100, y:400, w:28, h:200 },
      { x:2600, y:300, w:28, h:300 },
      { x:4250, y:250, w:28, h:350 },
      { x:5150, y:100, w:28, h:300 },
    ];

    this.doors = [
      { x:1000, y:200, w:70, h:200, locked:true, quizIndex:0, label:'Market Gate' },
      { x:2500, y:100, w:70, h:200, locked:true, quizIndex:1, label:'Hillside Path' },
      { x:4150, y:100, w:70, h:300, locked:true, quizIndex:2, label:'Temple Gate' },
    ];

    this.exit = { x:5950, y:-40, w:100, h:100, locked:true };

    this.badges = [
      { x:300, y:480, w:24, h:24, collected:false, type:'radio', desc:'Battery Radio' },
      { x:1450, y:420, w:24, h:24, collected:false, type:'water', desc:'Drinking Water' },
      { x:2850, y:400, w:24, h:24, collected:false, type:'firstaid', desc:'First Aid Kit' },
      { x:4500, y:310, w:24, h:24, collected:false, type:'whistle', desc:'Whistle to signal' },
      { x:5420, y:110, w:24, h:24, collected:false, type:'flashlight', desc:'Flashlight' },
    ];

    this.debrisFloat = [
      { x:600, y:580, w:80, h:20, vx:-0.5, type:'log' },
      { x:1500, y:580, w:60, h:20, vx:-0.8, type:'crate' },
      { x:2300, y:580, w:100, h:25, vx:-1, type:'log' },
      { x:3200, y:580, w:70, h:20, vx:-1.2, type:'beam' },
    ];

    this.eduQueue = [
      { t:1, text:"🌊 BEACH: Ocean receding = TSUNAMI! RUN inland NOW!" },
      { t:12, text:"🪜 Use LADDERS (E) to climb! Jump over logs! Duck (S) under beams!" },
      { t:22, text:"📻 Collect kit! Radio, water, first-aid, whistle!" },
      { t:35, text:"🪵 Floating debris deadly! Avoid! Climb!" },
      { t:50, text:"⛰️ Hillside steep! Sprint (SHIFT) + jump! Water faster!" },
      { t:70, text:"🏔️ Mountain Temple: Need all kits! 30m+ high = safe!" },
    ];
    this.eduIndex=0;

    this.midQuizzes = [
      { time: 10*60, quizIndex: 0, triggered: false, title: "Natural Warning Quiz" },
      { time: 30*60, quizIndex: 1, triggered: false, title: "High Ground Quiz" },
      { time: 55*60, quizIndex: 3, triggered: false, title: "Wave Quiz" },
      { time: 80*60, quizIndex: 4, triggered: false, title: "Kit Quiz" },
    ];
    this.isQuizActive = false;
    this.quizScoreMid = 0;

    this.bindInput();
  }

  bindInput(){
    this.kd=(e)=>{
      if (e.code==='KeyA'||e.code==='ArrowLeft') this.input.left=true;
      if (e.code==='KeyD'||e.code==='ArrowRight') this.input.right=true;
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
      if (this.timer<=0){ this.fail('Tsunami caught you! Move immediately!'); return; }
    }
    if (this.phaseTime > this.phaseDuration) this.nextPhase();

    let speed = 0.12 + this.phase*0.28 + (this.time/60)*0.012;
    this.waterLevel -= speed;

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
            this.showEdu("❌ Wrong, but continue!");
          }
        }, true);
        break;
      }
    }

    if (this.player.x < 1000) this.zone=0;
    else if (this.player.x < 2500) this.zone=1;
    else if (this.player.x < 4150) this.zone=2;
    else this.zone=3;

    this.world.nearLadder=false;
    for (let lad of this.ladders){
      if (Math.abs(this.player.x - lad.x) < 40 && this.player.y+this.player.height > lad.y && this.player.y < lad.y+lad.h){
        this.world.nearLadder=lad;
        break;
      }
    }

    let justPressed = this.input.interact && !this.prevInteract;

    this.player.update(this.input, this.platforms, this.world);
    this.input.jump=false;

    for (let d of this.debrisFloat){
      d.x += d.vx - speed*0.1;
      d.y = this.waterLevel - 10 + Math.sin(this.time*0.05 + d.x*0.01)*8;
      if (d.x < -200) d.x = this.levelWidth + Math.random()*500;
      if (this.player.alive && d.x < this.player.x+this.player.width && d.x+d.w > this.player.x && d.y < this.player.y+this.player.height && d.y+d.h > this.player.y){
        if (this.time%15===0){
          let died=this.player.takeDamage(12, this.world);
          document.getElementById('healthFill').style.width=this.player.health+'%';
          this.showEdu("🪵 Debris hit! Jump over or duck!");
          if (died){ this.fail('Hit by floating debris! Climb high!'); return; }
        }
      }
    }

    if (this.player.y + this.player.height > this.waterLevel - 8){
      let onHighPlatform=false;
      for (let p of this.platforms){
        if (p.y < this.waterLevel - 25 && this.player.x+this.player.width > p.x && this.player.x < p.x+p.w && Math.abs((this.player.y+this.player.height)-p.y)<12){
          onHighPlatform=true; break;
        }
      }
      if (!onHighPlatform){
        if (this.time%10===0){
          let died=this.player.takeDamage(14, this.world);
          document.getElementById('healthFill').style.width=this.player.health+'%';
          this.world.shake(5);
          this.showEdu("🌊 IN WATER! Climb NOW!");
          if (died){ this.fail('Swept by tsunami! Move to high ground!'); return; }
        }
        this.player.x -= 1.8;
      }
    }

    for (let b of this.badges) if (!b.collected && this.player.x < b.x+b.w && this.player.x+this.player.width > b.x && this.player.y < b.y+b.h && this.player.y+this.player.height > b.y){
      b.collected=true;
      this.collected++;
      document.getElementById('badgeCount').textContent=`${this.collected} / 5`;
      this.world.playSound('pickup');
      this.world.addParticle({ x:b.x, y:b.y, vx:0, vy:-2, size:6, color:'#2ab6ff', life:30, maxLife:30, alpha:1, gravity:-0.05, shape:'circle' });
      this.showEdu(`🎒 ${b.desc}! ${5-this.collected} left!`);
    }

    for (let door of this.doors){
      if (Math.abs(this.player.x - door.x) < 85 && Math.abs(this.player.y - door.y) < 160){
        if (door.locked && justPressed && !this.quizTriggers[door.quizIndex] && this.interactCooldown===0){
          this.quizTriggers[door.quizIndex]=true;
          this.interactCooldown=30;
          this.triggerQuiz(door.quizIndex, ()=>{
            door.locked=false;
            this.showEdu(`🔓 ${door.label} opened! Keep climbing!`);
          });
        }
      }
    }

    if (this.player.y < 180 && this.collected>=4 && !this.exitUnlocked){
      this.exitUnlocked=true;
      this.exit.locked=false;
      this.showEdu("🏔️ TEMPLE SAFE ZONE! All kits collected! Enter!");
    }

    if (this.exitUnlocked && this.player.x+this.player.width > this.exit.x && this.player.x < this.exit.x+this.exit.w && this.player.y+this.player.height > this.exit.y && this.player.y < this.exit.y+this.exit.h){
      this.complete();
    }

    if (this.player.y > this.levelHeight+150) this.fail('Fell into water! Keep jumping!');

    this.world.updateCamera(this.player, this.levelWidth, this.levelHeight);
    this.world.updateParticles();

    if (this.time%3===0){
      this.world.addParticle({
        x: Math.random()*this.world.width + this.world.camera.x,
        y: this.waterLevel + Math.random()*12,
        vx: (Math.random()-0.5)*2,
        vy: -1.5-Math.random()*2,
        size: 2+Math.random()*4,
        color: '#2ab6ff',
        life:32, maxLife:32, alpha:1, gravity:-0.02, shape:'circle'
      });
    }

    this.prevInteract = this.input.interact;
  }

  triggerQuiz(index, onSuccess, isMidGame=false){
    const quiz=this.config.quizzes[index];
    if (!quiz){ onSuccess(isMidGame?true:undefined); return; }
    this.isQuizActive=true;
    const modal=document.getElementById('quizModal');
    const titleEl = modal.querySelector('h2');
    if (titleEl) titleEl.textContent = isMidGame ? `🧠 In-Game Quiz - ${['Beach','Market','Hillside','Mountain'][this.zone]}` : '🧠 Safety Check!';
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
          setTimeout(()=>{ modal.classList.add('hidden'); this.isQuizActive=false; if (isMidGame) onSuccess(true); else onSuccess(); }, 2300);
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
            setTimeout(()=>{ modal.classList.add('hidden'); this.isQuizActive=false; this.quizTriggers[index]=false; }, 3000);
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
      if (this.phase===1) this.world.shake(10);
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
    let timeBonus=this.timer*12;
    let badgeBonus=this.collected*140;
    let healthBonus=this.player.health*3;
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

    this.world.clear('#0a1a3a');

    let skyGrad=ctx.createLinearGradient(0,0,0,450);
    skyGrad.addColorStop(0, '#0a1a4a');
    skyGrad.addColorStop(0.5, '#1a3a6a');
    skyGrad.addColorStop(1, '#2a4a7a');
    ctx.fillStyle=skyGrad;
    ctx.fillRect(0,0,this.world.width, 520);

    const zones = [
      { name:'BEACH', color:'#c2a87a', x:0, w:1100 },
      { name:'MARKET', color:'#3a2a1a', x:1100, w:1500 },
      { name:'HILLSIDE', color:'#2a4a2a', x:2600, w:1600 },
      { name:'MOUNTAIN', color:'#3a3a4a', x:4200, w:2000 },
    ];
    for (let z of zones){
      let sx=z.x-cam.x;
      if (sx>-1600 && sx<this.world.width){
        if (z.name==='BEACH'){
          ctx.fillStyle=z.color;
          ctx.fillRect(sx, 550-cam.y, z.w, 100);
        }
        ctx.fillStyle='rgba(255,255,255,0.06)';
        ctx.font='bold 36px Outfit';
        ctx.textAlign='center';
        ctx.fillText(z.name, sx+z.w/2, 100-cam.y);
      }
    }

    for (let x=0;x<this.levelWidth;x+=180){
      if (x-cam.x < -220 || x-cam.x > this.world.width+220) continue;
      let h= 40 + Math.sin(x*0.008)*30 + (x>4000 ? (x-4000)*0.05 : 0);
      ctx.fillStyle='#0f1a3a';
      ctx.fillRect(x-cam.x, 600-h-cam.y, 100, h);
      ctx.fillStyle='rgba(255,222,89,0.25)';
      for (let wy=0;wy<h;wy+=18){
        for (let wx=0;wx<80;wx+=18){
          if (Math.random()>0.6) ctx.fillRect(x-cam.x+10+wx, 600-h+10+wy-cam.y, 6,6);
        }
      }
    }

    for (let p of this.platforms){
      let sx=p.x-cam.x, sy=p.y-cam.y;
      if (sx<-300||sx>this.world.width+300) continue;
      if (p.type==='ground'){
        ctx.fillStyle='#3a2a1a';
        ctx.fillRect(sx,sy,p.w,p.h);
        ctx.fillStyle='#c2a87a';
        ctx.fillRect(sx,sy,p.w,10);
      } else {
        ctx.fillStyle= p.y<300 ? '#6a5a4a' : '#4a3a2a';
        ctx.fillRect(sx,sy,p.w,p.h);
        ctx.fillStyle='#7a6a5a';
        ctx.fillRect(sx,sy,p.w,4);
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.fillRect(sx,sy+p.h,p.w,3);
        if (p.y<220){
          ctx.fillStyle='#00ff88';
          ctx.font='bold 9px JetBrains Mono';
          ctx.textAlign='center';
          ctx.fillText('HIGH', sx+p.w/2, sy-8);
        }
      }
    }

    for (let lad of this.ladders){
      let sx=lad.x-cam.x, sy=lad.y-cam.y;
      ctx.fillStyle='#8a6a4a';
      ctx.fillRect(sx,sy,5,lad.h);
      ctx.fillRect(sx+lad.w-5,sy,5,lad.h);
      ctx.fillStyle='#6a4a2a';
      for (let y=0;y<lad.h;y+=18){
        ctx.fillRect(sx,sy+y,lad.w,4);
      }
      if (this.world.nearLadder===lad){
        ctx.fillStyle='#00ff88';
        ctx.font='10px JetBrains Mono';
        ctx.textAlign='center';
        ctx.fillText('[E] Climb Fast', sx+lad.w/2, sy-10);
      }
    }

    for (let door of this.doors){
      let sx=door.x-cam.x, sy=door.y-cam.y;
      if (sx<-120||sx>this.world.width+120) continue;
      ctx.fillStyle=door.locked?'#444':'#00aa66';
      ctx.fillRect(sx,sy,door.w,18);
      ctx.fillStyle=door.locked?'rgba(0,0,0,0.85)':'rgba(0,255,136,0.15)';
      ctx.fillRect(sx,sy+18,door.w,door.h-18);
      ctx.strokeStyle=door.locked?'#666':'#00ff88';
      ctx.lineWidth=3;
      ctx.strokeRect(sx,sy,door.w,door.h);
      ctx.fillStyle=door.locked?'#999':'black';
      ctx.font='bold 10px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText(door.label, sx+door.w/2, sy+11);
      if (door.locked){
        ctx.font='18px serif';
        ctx.fillText('🔒', sx+door.w/2, sy+door.h/2+8);
        if (Math.abs(this.player.x-door.x)<90){
          ctx.fillStyle='#ffde59';
          ctx.font='10px JetBrains Mono';
          ctx.fillText('[E] Quiz Unlock', sx+door.w/2, sy+door.h+14);
        }
      } else {
        ctx.fillStyle='#00ff88';
        ctx.font='10px JetBrains Mono';
        ctx.fillText('OPEN →', sx+door.w/2, sy+door.h/2+8);
      }
    }

    for (let d of this.debrisFloat){
      let sx=d.x-cam.x, sy=d.y-cam.y;
      if (sx<-150||sx>this.world.width+150) continue;
      ctx.fillStyle= d.type==='log' ? '#5a3a1a' : d.type==='crate' ? '#8a6a3a' : '#6a5a4a';
      ctx.fillRect(sx,sy,d.w,d.h);
      ctx.fillStyle='rgba(0,0,0,0.2)';
      ctx.fillRect(sx,sy,d.w,4);
      if (Math.abs(this.player.x - d.x) < 150){
        ctx.fillStyle='#ff3b3b';
        ctx.font='10px JetBrains Mono';
        ctx.textAlign='center';
        ctx.fillText('DEBRIS!', sx+d.w/2, sy-8);
      }
    }

    for (let b of this.badges) if (!b.collected){
      let sx=b.x-cam.x, sy=b.y-cam.y;
      let float=Math.sin(this.time*0.08+b.x)*5;
      ctx.fillStyle='#2ab6ff';
      ctx.beginPath();
      ctx.arc(sx+b.w/2, sy+b.h/2+float, 13,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle='white';
      ctx.font='13px serif';
      ctx.textAlign='center';
      ctx.fillText(b.type==='radio'?'📻':b.type==='water'?'💧':b.type==='firstaid'?'🩹':b.type==='whistle'?'📯':'🔦', sx+b.w/2, sy+b.h/2+float+4);
      ctx.fillStyle='#2ab6ff40';
      ctx.beginPath();
      ctx.arc(sx+b.w/2, sy+b.h/2+float, 20,0,Math.PI*2);
      ctx.fill();
    }

    {
      let sx=this.exit.x-cam.x, sy=this.exit.y-cam.y;
      ctx.fillStyle=this.exitUnlocked?'#00ff88':'#555';
      ctx.fillRect(sx,sy,this.exit.w,18);
      ctx.fillStyle=this.exitUnlocked?'rgba(0,255,136,0.18)':'rgba(0,0,0,0.6)';
      ctx.fillRect(sx,sy+18,this.exit.w,this.exit.h-18);
      ctx.strokeStyle=this.exitUnlocked?'#00ff88':'#555';
      ctx.lineWidth=3;
      ctx.strokeRect(sx,sy,this.exit.w,this.exit.h);
      ctx.fillStyle=this.exitUnlocked?'black':'#777';
      ctx.font='bold 11px JetBrains Mono';
      ctx.textAlign='center';
      ctx.fillText('SAFE', sx+this.exit.w/2, sy+11);
      if (this.exitUnlocked){
        let b=Math.sin(this.time*0.15)*4;
        ctx.fillStyle='#00ff88';
        ctx.font='20px serif';
        ctx.fillText('🏔️', sx+this.exit.w/2, sy+this.exit.h/2+20+b);
      } else {
        ctx.font='10px JetBrains Mono';
        ctx.fillStyle='#ffde59';
        ctx.fillText(`Need ${5-this.collected} kits`, sx+this.exit.w/2, sy+this.exit.h+14);
      }
    }

    {
      let waterScreenY=this.waterLevel-cam.y;
      if (waterScreenY < this.world.height){
        let waterGrad=ctx.createLinearGradient(0, waterScreenY, 0, this.world.height);
        waterGrad.addColorStop(0, 'rgba(42,182,255,0.88)');
        waterGrad.addColorStop(0.25, 'rgba(20,110,190,0.92)');
        waterGrad.addColorStop(1, 'rgba(10,50,120,0.96)');
        ctx.fillStyle=waterGrad;
        ctx.fillRect(0, waterScreenY, this.world.width, this.world.height-waterScreenY);
        ctx.strokeStyle='#6ad4ff';
        ctx.lineWidth=3;
        ctx.beginPath();
        ctx.moveTo(0, waterScreenY);
        for (let x=0;x<this.world.width;x+=18){
          let wy=waterScreenY + Math.sin((x+this.time*3)*0.025)*7;
          ctx.lineTo(x, wy);
        }
        ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,0.45)';
        for (let x=0;x<this.world.width;x+=38){
          let fx=x+Math.sin(this.time*0.06+x*0.01)*12;
          let fy=waterScreenY+Math.sin((x+this.time*2.5)*0.035)*5;
          ctx.beginPath();
          ctx.arc(fx,fy,2+Math.sin(x)*1.2,0,Math.PI*2);
          ctx.fill();
        }
        if (this.player.y+this.player.height > this.waterLevel-120){
          ctx.fillStyle='#ff3b3b';
          ctx.font='bold 14px JetBrains Mono';
          ctx.textAlign='center';
          ctx.fillText('↑↑ WATER RISING! CLIMB! ↑↑', this.world.width/2, waterScreenY-22);
        }
      }
    }

    this.player.draw(ctx, cam);
    this.world.drawParticles();

    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.fillRect(10, 10, 220, 28);
    ctx.fillStyle='#2ab6ff';
    ctx.font='bold 12px JetBrains Mono';
    ctx.textAlign='left';
    ctx.fillText(`ZONE ${this.zone+1}/4: ${['BEACH','MARKET','HILLSIDE','MOUNTAIN'][this.zone]}`, 18, 28);
  }
}
