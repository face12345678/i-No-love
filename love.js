
const SURPRISE_TEXT = [
  "ถึงคนที่ฉันรัก 💕\n",
  "วันนี้ฉันอยากบอกว่า:\n",
  "เธอคือคนที่ทำให้ฉันยิ้มได้ทุกวัน — ขอบคุณที่อยู่ด้วยกันนะ 🥹\n\n",
  "ขอให้วันนี้เป็นวันที่เต็มไปด้วยความสุขและความรักจากฉันนะ 💖"
];


const openBtn = document.getElementById('openBtn');
const mainContent = document.getElementById('mainContent');
const messageEl = document.getElementById('message');
const replayBtn = document.getElementById('replayBtn');
const editBtn = document.getElementById('editBtn');
const song = document.getElementById('song');
const confettiCanvas = document.getElementById('confettiCanvas');

const ctx = confettiCanvas.getContext('2d');
let W, H, particles = [];

function resize(){
  W = confettiCanvas.width = confettiCanvas.offsetWidth;
  H = confettiCanvas.height = confettiCanvas.offsetHeight;
}
window.addEventListener('resize', resize);

function rand(min,max){ return Math.random()*(max-min)+min }

function createParticles(amount=120){
  particles = [];
  for(let i=0;i<amount;i++){
    particles.push({
      x:rand(0,W), y:rand(-H,0),
      r:rand(6,12), d:rand(10,40),
      tilt:rand(-10,10),
      color:["#ff5c8a","#ffd166","#6ee7b7","#9ad0f5"][Math.floor(rand(0,4))]
    });
  }
}

function updateParticles(){
  for(let p of particles){
    p.y += Math.cos(p.d) + 2 + p.r/8;
    p.tilt += Math.sin(p.d);
    p.x += Math.sin(p.d);
    if(p.y > H+20){ p.y=-10; p.x=rand(0,W); }
  }
}

function drawParticles(){
  ctx.clearRect(0,0,W,H);
  for(let p of particles){
    ctx.beginPath();
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.tilt*0.02);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6);
    ctx.restore();
  }
}

let confettiAnim;
function startConfetti(){
  resize();
  createParticles(160);
  cancelAnimationFrame(confettiAnim);
  (function loop(){
    drawParticles();
    updateParticles();
    confettiAnim = requestAnimationFrame(loop);
  })();
  setTimeout(()=>{
    cancelAnimationFrame(confettiAnim);
    ctx.clearRect(0,0,W,H);
  },7000);
}

function typeText(lines, el, speed=30){
  el.innerHTML = '';
  let iLine=0, iChar=0;
  return new Promise(res=>{
    function step(){
      if(iLine>=lines.length){
        const cursor=document.createElement('span');
        cursor.className='cursor';
        el.appendChild(cursor);
        return res();
      }
      const line = lines[iLine];
      if(iChar < line.length){
        el.textContent += line.charAt(iChar);
        iChar++;
        setTimeout(step,speed);
      }else{
        el.textContent += '\n';
        iLine++; iChar=0;
        setTimeout(step,speed*4);
      }
    }
    step();
  });
}

async function reveal(){
  openBtn.disabled = true;
  startConfetti();
  mainContent.classList.remove('hidden');
  mainContent.setAttribute('aria-hidden','false');
  messageEl.textContent = '';

  await typeText(SURPRISE_TEXT, messageEl, 30);

  try{
    if(song) song.play().catch(()=>{});
  }catch(e){}
}

openBtn.addEventListener('click', reveal);

replayBtn.addEventListener('click', ()=>{
  startConfetti();
  messageEl.textContent='';
  typeText(SURPRISE_TEXT, messageEl, 25);
  if(song){ song.currentTime=0; song.play().catch(()=>{}); }
});

editBtn.addEventListener('click', ()=>{
  const newText = prompt('แก้ข้อความ (ใช้ \\n เพื่อขึ้นบรรทัดใหม่)', SURPRISE_TEXT.join('\n'));
  if(newText!==null){
    const arr = newText.split('\n');
    while(SURPRISE_TEXT.length) SURPRISE_TEXT.pop();
    arr.forEach(s=>SURPRISE_TEXT.push(s+'\n'));

    messageEl.textContent='';
    typeText(SURPRISE_TEXT, messageEl, 25);
  }
});

resize();
