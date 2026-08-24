import { DISASTERS } from './config.js';
import { HallLevel } from './levels/hall.js';
import { EarthquakeLevel } from './levels/earthquake.js';
import { FireLevel } from './levels/fire.js';
import { TsunamiLevel } from './levels/tsunami.js';

class GameApp {
  constructor() {
    this.currentHall = null;
    this.currentLevel = null;
    this.currentDisaster = null;
    this.initStarfield();
    this.bindUI();
    this.showScreen('startScreen');
  }

  initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio||1);
      canvas.height = window.innerHeight * (window.devicePixelRatio||1);
      canvas.style.width = window.innerWidth+'px';
      canvas.style.height = window.innerHeight+'px';
      ctx.setTransform(window.devicePixelRatio,0,0,window.devicePixelRatio,0,0);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = [];
    for (let i=0;i<220;i++) stars.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      size: Math.random()*1.6,
      speed: 0.2 + Math.random()*0.9,
      twinkle: Math.random()*Math.PI*2
    });

    const animate = () => {
      ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
      let grad = ctx.createRadialGradient(window.innerWidth/2, 0, 0, window.innerWidth/2, 0, window.innerHeight);
      grad.addColorStop(0, 'rgba(42,26,90,0.55)');
      grad.addColorStop(1, 'rgba(10,10,26,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
      for (let s of stars) {
        s.y += s.speed * 0.15;
        s.twinkle += 0.02;
        if (s.y > window.innerHeight) { s.y = 0; s.x = Math.random()*window.innerWidth; }
        let alpha = 0.3 + Math.sin(s.twinkle)*0.3 + 0.3;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
        ctx.fill();
        if (s.size > 1) {
          ctx.fillStyle = `rgba(255,255,255,${alpha*0.2})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size*3, 0, Math.PI*2);
          ctx.fill();
        }
      }
      requestAnimationFrame(animate);
    };
    animate();

    const skyline = document.getElementById('citySkyline');
    skyline.innerHTML = '';
    for (let i=0;i<42;i++) {
      let b = document.createElement('div');
      let w = 22 + Math.random()*62;
      let h = 22 + Math.random()*82;
      b.style.width = w+'px';
      b.style.height = h+'%';
      b.style.background = '#1a1430';
      b.style.display = 'inline-block';
      b.style.margin = '0 2px';
      b.style.position = 'relative';
      b.style.borderTop = '2px solid rgba(138,92,255,0.22)';
      let winCount = Math.floor(Math.random()*11);
      let inner = '';
      for (let j=0;j<winCount;j++) {
        inner += `<div style="position:absolute;left:${Math.random()*70}%;top:${Math.random()*70}%;width:4px;height:4px;background:#ffde59;opacity:${0.3+Math.random()*0.7};box-shadow:0 0 4px #ffde59"></div>`;
      }
      b.innerHTML = inner;
      skyline.appendChild(b);
    }
  }

  bindUI() {
    document.getElementById('playNowBtn').addEventListener('click', () => {
      this.showScreen('hallScreen');
      this.startHall();
    });
    document.getElementById('backToStart').addEventListener('click', () => {
      if (this.currentHall) { this.currentHall.stop(); this.currentHall=null; }
      this.showScreen('startScreen');
    });
    document.getElementById('exitGameBtn').addEventListener('click', () => {
      if (confirm('Exit to Hall? Progress will be lost.')) {
        if (this.currentLevel) { this.currentLevel.stop(); this.currentLevel=null; }
        this.showScreen('hallScreen');
        this.startHall();
      }
    });
    document.getElementById('pauseBtn').addEventListener('click', () => {
      alert('Game Paused\n\nENHANCED CONTROLS:\nWASD / Arrows = Move\nW / SPACE = Jump\nS = SLIDE UNDER table / CRAWL low\nSHIFT = Sprint\nE = HOLD table legs / Check doors / Climb ladder / Use extinguisher\n\nEarthquake: S to slide under desk, then HOLD E to grip!\nFire: S to crawl belly-low, E to check doors, HOLD E + A/D to spray!\nTsunami: E to climb ladders, avoid floating debris!\n\nStay safe, young hero!');
    });
  }

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  startHall() {
    const canvas = document.getElementById('hallCanvas');
    if (this.currentHall) this.currentHall.stop();
    this.currentHall = new HallLevel(canvas, (disasterId) => this.enterDisaster(disasterId));
    this.currentHall.start();
  }

  enterDisaster(id) {
    if (this.currentHall) { this.currentHall.stop(); this.currentHall=null; }
    this.currentDisaster = DISASTERS[id];
    this.showDrillIntro(this.currentDisaster);
  }

  showDrillIntro(disaster) {
    this.showScreen('drillIntro');
    const card = document.getElementById('drillCard');
    card.className = 'drill-card ' + disaster.id;
    card.innerHTML = `
      <div class="drill-icon">${disaster.icon}</div>
      <h1 class="drill-title ${disaster.id}">${disaster.name} DRILL</h1>
      <div class="drill-location">📍 ${disaster.location}</div>
      <p class="drill-desc">${disaster.description}</p>
      <div class="drill-instructions">
        ${disaster.objectives.map(o=>`<div>${o}</div>`).join('')}
      </div>
      <div style="background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.2);border-radius:10px;padding:10px;margin-top:14px;text-align:left;font-size:12px;line-height:1.5">
        <strong style="color:#00e5ff">🆕 NEW in PRO v2.1:</strong><br>
        • Multi-zone maps (3-4 zones per disaster)<br>
        • Real under-table sliding + HOLD mechanic<br>
        • Door temperature check + extinguisher aiming<br>
        • Floating debris + ladders + cracks<br>
        • 6 quizzes per disaster + 3-question final exam
      </div>
      <button class="drill-btn ${disaster.id}" id="startDrillBtn">▶ START DRILL!</button>
      <div style="margin-top:16px"><a href="#" id="backToHallLink" style="color:rgba(255,255,255,0.4);font-family:'JetBrains Mono';font-size:12px;text-decoration:none">← Back to Hall</a></div>
    `;
    document.getElementById('startDrillBtn').addEventListener('click', () => this.startGameplay(disaster.id));
    document.getElementById('backToHallLink').addEventListener('click', (e)=>{
      e.preventDefault();
      this.showScreen('hallScreen');
      this.startHall();
    });
  }

  startGameplay(id) {
    this.showScreen('gameScreen');
    document.getElementById('starCount').textContent='0';
    let badgeTotal = id==='earthquake'?4:id==='fire'?4:5;
    document.getElementById('badgeCount').textContent=`0 / ${badgeTotal}`;
    document.getElementById('healthFill').style.width='100%';
    document.getElementById('gameTimer').textContent= id==='tsunami'?'3:40':id==='fire'?'3:20':'3:00';
    document.getElementById('phaseIndicator').textContent='Phase 1: '+DISASTERS[id].phases[0].name;
    document.getElementById('gameFooter').textContent=DISASTERS[id].phases[0].message;
    document.getElementById('locationName').textContent=DISASTERS[id].location;
    document.getElementById('educationalPopup').classList.add('hidden');
    document.getElementById('gameMessage').classList.add('hidden');

    const canvas = document.getElementById('gameCanvas');
    const onComplete = (success, reason, stats) => this.showResult(success, reason, stats, DISASTERS[id]);
    const onQuiz = (disaster, stats) => this.startFinalQuiz(disaster, stats);

    if (id==='earthquake') {
      this.currentLevel = new EarthquakeLevel(canvas, onComplete, onQuiz);
    } else if (id==='fire') {
      this.currentLevel = new FireLevel(canvas, onComplete, onQuiz);
    } else if (id==='tsunami') {
      this.currentLevel = new TsunamiLevel(canvas, onComplete, onQuiz);
    }
    this.currentLevel.start();
  }

  startFinalQuiz(disaster, stats) {
    // 3-question final exam
    let questions = [...disaster.quizzes].sort(()=>0.5-Math.random()).slice(0,3);
    let current = 0;
    let score = 0;
    let totalBonus = 0;

    const showQuestion = () => {
      if (current >= questions.length) {
        document.getElementById('quizModal').classList.add('hidden');
        stats.quizBonus = totalBonus;
        stats.quizScore = `${score}/${questions.length}`;
        this.showResult(true, null, stats, disaster);
        return;
      }
      let quiz = questions[current];
      const modal = document.getElementById('quizModal');
      document.getElementById('quizQuestion').innerHTML = `<span style="color:#ffde59">Q${current+1}/3:</span> ${quiz.q}`;
      const optsDiv = document.getElementById('quizOptions');
      optsDiv.innerHTML='';
      document.getElementById('quizFeedback').textContent='';
      document.getElementById('quizFeedback').className='quiz-feedback';

      quiz.options.forEach((opt, idx)=>{
        let btn = document.createElement('div');
        btn.className='quiz-opt';
        btn.textContent = `${String.fromCharCode(65+idx)}. ${opt}`;
        btn.addEventListener('click', ()=>{
          document.querySelectorAll('.quiz-opt').forEach(b=>b.style.pointerEvents='none');
          if (idx===quiz.correct) {
            btn.classList.add('correct');
            document.getElementById('quizFeedback').textContent = '✅ Correct! ' + quiz.explain;
            document.getElementById('quizFeedback').className='quiz-feedback correct';
            score++;
            totalBonus += 150;
          } else {
            btn.classList.add('wrong');
            document.querySelectorAll('.quiz-opt')[quiz.correct].classList.add('correct');
            document.getElementById('quizFeedback').textContent = '❌ ' + quiz.explain;
            document.getElementById('quizFeedback').className='quiz-feedback wrong';
          }
          current++;
          setTimeout(showQuestion, 2800);
        });
        optsDiv.appendChild(btn);
      });
      modal.classList.remove('hidden');
    };
    showQuestion();
  }

  showResult(success, reason, stats, disaster) {
    this.showScreen('resultScreen');
    const card = document.getElementById('resultCard');
    if (success) {
      let total = (stats.total||0) + (stats.quizBonus||0);
      let stars = total > 2200 ? 3 : total > 1300 ? 2 : 1;
      let badgeTotal = disaster.id==='tsunami'?5:4;
      
      // Send completion score to Suraksha-OS
      window.parent.postMessage({
        type: 'SIMULATION_COMPLETE',
        score: Math.min(100, Math.max(0, Math.round((total / 2500) * 100))),
        scenarioId: 'scenario-resqverse-pro'
      }, '*');

      card.innerHTML = `
        <div style="font-size:56px;margin-bottom:8px">${stars===3?'🏆':stars===2?'🌟':'⭐'}</div>
        <h1 class="result-title" style="color:${disaster.color}">MISSION COMPLETE!</h1>
        <p class="result-subtitle">You survived ${disaster.name} across ${disaster.phases.length} phases at ${disaster.location}!</p>
        <div class="result-stats">
          <div class="stat"><div class="stat-value">${stats.timeLeft||0}s</div><div class="stat-label">Time Left</div></div>
          <div class="stat"><div class="stat-value">${stats.badges||0}/${badgeTotal}</div><div class="stat-label">Badges</div></div>
          <div class="stat"><div class="stat-value">${stats.health||0}%</div><div class="stat-label">Health</div></div>
        </div>
        <div class="result-stats">
          <div class="stat"><div class="stat-value">${stats.timeBonus||0}</div><div class="stat-label">Time Bonus</div></div>
          <div class="stat"><div class="stat-value">${stats.badgeBonus||0}</div><div class="stat-label">Safety Bonus</div></div>
          <div class="stat"><div class="stat-value">${(stats.midQuizBonus||0)+(stats.quizBonus||0)}</div><div class="stat-label">Quiz Bonus</div></div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap">
          <span style="background:rgba(90,124,255,0.15);border:1px solid rgba(90,124,255,0.3);padding:4px 10px;border-radius:999px;font-size:11px">🧠 Mid-Game Quizzes: ${stats.midQuizzes||0}/4 answered</span>
          <span style="background:rgba(255,222,89,0.15);border:1px solid rgba(255,222,89,0.3);padding:4px 10px;border-radius:999px;font-size:11px">📝 Final Exam: ${stats.quizScore||'0/3'}</span>
        </div>
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;margin:16px 0">
          <div style="font-size:11px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px">Total Score • In-Game + Final</div>
          <div style="font-size:32px;font-weight:800;color:white;font-family:'Outfit'">${total}</div>
          <div style="font-size:13px;margin-top:6px;color:rgba(255,255,255,0.6)">${'⭐'.repeat(stars)} ${stars===3?'LEGENDARY HERO!':stars===2?'Great Hero!':'Survivor!'}</div>
        </div>
        <div style="background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.2);border-radius:10px;padding:12px;text-align:left;font-size:13px;line-height:1.6">
          <strong style="color:#00e5ff">🎓 What You Mastered (v2.1 Enhanced):</strong><br>
          ${disaster.id==='earthquake'?`
            • Real under-table: SLIDE (S) + HOLD legs (E) so table doesn't slide away<br>
            • 3 zones: Classroom → Library (falling shelves) → Theatre<br>
            • Avoid floor cracks, help injured, aftershocks<br>
            • Quiz gates teach DROP COVER HOLD ON
          `:''}
          ${disaster.id==='fire'?`
            • Crawl belly-low (S) to breathe under smoke + cover mouth<br>
            • Door check: E to feel - RED=HOT don't open!<br>
            • Extinguisher: HOLD E + A/D aim at BASE (PASS method)<br>
            • 3 floors, ladders, rescue 3 people, never elevator
          `:''}
          ${disaster.id==='tsunami'?`
            • Natural warning: receding ocean = run NOW!<br>
            • 4 zones: Beach → Market → Hillside → Mountain Temple<br>
            • Avoid floating debris (logs, crates), use ladders (E)<br>
            • Need 30m+ high or 2km inland, first wave not biggest
          `:''}
        </div>
        <div class="result-actions">
          <button class="result-btn primary" id="playAgainBtn">🔄 Play Again</button>
          <button class="result-btn secondary" id="backHallBtn">🏛️ Hall</button>
          <button class="result-btn secondary" id="nextDisasterBtn">➡️ Next</button>
        </div>
      `;
      card.querySelector('#playAgainBtn').addEventListener('click', ()=> this.startGameplay(disaster.id));
      card.querySelector('#backHallBtn').addEventListener('click', ()=>{
        this.showScreen('hallScreen');
        this.startHall();
      });
      card.querySelector('#nextDisasterBtn').addEventListener('click', ()=>{
        let ids = Object.keys(DISASTERS);
        let idx = ids.indexOf(disaster.id);
        let next = ids[(idx+1)%ids.length];
        this.enterDisaster(next);
      });
    } else {
      card.innerHTML = `
        <div style="font-size:56px;margin-bottom:8px">💥</div>
        <h1 class="result-title" style="color:#ff3b3b">MISSION FAILED</h1>
        <p class="result-subtitle" style="color:#ff9a9a">${reason||'You didn\'t survive. Try again - learning saves lives!'}</p>
        <div style="background:rgba(255,59,59,0.1);border:1px solid rgba(255,59,59,0.3);border-radius:12px;padding:16px;margin:20px 0;text-align:left">
          <strong style="color:#ff6a6a">💡 Safety Reminder (Enhanced):</strong><br>
          <span style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.7)">
          ${disaster.id==='earthquake'?'You must SLIDE UNDER desk (S) then HOLD legs (E) until shaking stops! Tables slide away if not held! Avoid cracks!':' '}
          ${disaster.id==='fire'?'Crawl low! Check doors with back of hand - hot=don\'t open! Use extinguisher at base, aim with A/D while holding E!':' '}
          ${disaster.id==='tsunami'?'Water + debris deadly! Climb ladders (E), jump over logs, duck under beams! Go 30m+ high!':' '}
          Every failure teaches. Real heroes learn!
          </span>
        </div>
        <div class="result-actions">
          <button class="result-btn primary" id="retryBtn">🔄 Try Again</button>
          <button class="result-btn secondary" id="backHallBtn2">🏛️ Hall</button>
        </div>
      `;
      card.querySelector('#retryBtn').addEventListener('click', ()=> this.startGameplay(disaster.id));
      card.querySelector('#backHallBtn2').addEventListener('click', ()=>{
        this.showScreen('hallScreen');
        this.startHall();
      });
    }
  }
}

new GameApp();
