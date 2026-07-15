/* ============ ANIMACIÓN DE FONDO (partículas conectadas) ============ */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = {x:null,y:null,radius:120};

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize',()=>{resize();init()});
window.addEventListener('mousemove',e=>{mouse.x=e.x;mouse.y=e.y});
window.addEventListener('mouseout',()=>{mouse.x=null;mouse.y=null});

class Particle{
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.vx = (Math.random()-0.5)*0.5;
    this.vy = (Math.random()-0.5)*0.5;
    this.size = Math.random()*2+1;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x<0||this.x>canvas.width) this.vx*=-1;
    if(this.y<0||this.y>canvas.height) this.vy*=-1;
    // Interacción con mouse
    if(mouse.x!=null){
      const dx = this.x-mouse.x, dy = this.y-mouse.y;
      const dist = Math.hypot(dx,dy);
      if(dist<mouse.radius){
        const f = (mouse.radius-dist)/mouse.radius;
        this.x += dx/dist*f*1.5;
        this.y += dy/dist*f*1.5;
      }
    }
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle = 'rgba(0,229,199,0.7)';
    ctx.fill();
  }
}

function init(){
  particles = [];
  const count = Math.min(90, Math.floor(canvas.width*canvas.height/15000));
  for(let i=0;i<count;i++) particles.push(new Particle());
}
init();

function connect(){
  for(let a=0;a<particles.length;a++){
    for(let b=a+1;b<particles.length;b++){
      const dx = particles[a].x-particles[b].x;
      const dy = particles[a].y-particles[b].y;
      const dist = Math.hypot(dx,dy);
      if(dist<130){
        const op = 1-dist/130;
        ctx.strokeStyle = `rgba(0,229,199,${op*0.25})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[a].x,particles[a].y);
        ctx.lineTo(particles[b].x,particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{p.update();p.draw()});
  connect();
  requestAnimationFrame(animate);
}
animate();

/* ============ EFECTO TYPING ============ */
const palabras = ['tecnológicas.','web increíbles.','a tu medida.','que venden.'];
const typedEl = document.getElementById('typed');
let pi=0,ci=0,deleting=false;
function type(){
  const actual = palabras[pi];
  if(!deleting){
    typedEl.textContent = actual.substring(0,ci+1);
    ci++;
    if(ci===actual.length){deleting=true;setTimeout(type,1800);return}
  }else{
    typedEl.textContent = actual.substring(0,ci-1);
    ci--;
    if(ci===0){deleting=false;pi=(pi+1)%palabras.length}
  }
  setTimeout(type, deleting?50:110);
}
type();

/* ============ MENÚ MÓVIL ============ */
const toggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click',()=>navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));

/* ============ ANIMACIÓN AL HACER SCROLL ============ */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('active');
  });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ============ FORMULARIO → WhatsApp ============ */
document.getElementById('contactForm').addEventListener('submit',e=>{
  e.preventDefault();
  const n = document.getElementById('nombre').value;
  const em = document.getElementById('email').value;
  const p = document.getElementById('presupuesto').value;
  const m = document.getElementById('mensaje').value;
  const txt = `¡Hola Medevs! 👋%0A%0A*Nombre:* ${n}%0A*Email:* ${em}%0A*Presupuesto:* ${p}%0A%0A*Mensaje:*%0A${m}`;
  window.open(`https://wa.me/573001234567?text=${txt}`,'_blank');
});
