// Pegando as ferramentas do Matter.js
var Engine = Matter.Engine;
var Render = Matter.Render;
var Runner = Matter.Runner;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Constraint = Matter.Constraint;
var Body = Matter.Body;
var Events = Matter.Events;

// Criando o motor de física
var engine = Engine.create();

// Pegando o mundo do motor
var world = engine.world;

// Criando o renderizador
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 900,
    height: 500,
    wireframes: false,
    background: "url('assets/bg.webp')"
  }
});

// Criando o chão
var ground = Bodies.rectangle(450, 480, 900, 40, {
  isStatic: true,
  render: {
    fillStyle: "#6b4f2a"
  }
});

// ------------------------------------------------
// POSIÇÃO DO PÁSSARO
// ------------------------------------------------

var slingY = 350;
var birdBack = 25;
var slingX = 150 - birdBack;

var bird = new Bird(slingX, slingY);
var slingPoint = { x: slingX, y: slingY };

// ------------------------------------------------
// ESTILINGUE
// ------------------------------------------------

var slingshot = new SlingShot(bird.body, slingPoint, {
  scale: 1.5,
  x: 150,
  y: 255,
  forkLeftOffsetX: 20,
  forkLeftOffsetY: 30,
  forkRightOffsetX: 60,
  forkRightOffsetY: 30
});

// ------------------------------------------------
// OBJETOS DO JOGO
// ------------------------------------------------

var pig = new Pig(700, 250);

var box1 = new Box(650, 430, 50, 80, "assets/madeira1.png");
var box2 = new Box(750, 430, 50, 80, "assets/madeira1.png");
var box3 = new Box(700, 370, 160, 30, "assets/madeira2.png");

// ------------------------------------------------
// ADICIONANDO AO MUNDO
// ------------------------------------------------

Composite.add(world, ground);

bird.addToWorld(world);
slingshot.addToWorld(world);
pig.addToWorld(world);
box1.addToWorld(world);
box2.addToWorld(world);
box3.addToWorld(world);

// ------------------------------------------------
// DESENHO DAS CAMADAS
// ------------------------------------------------

Events.on(render, "afterRender", function() {
  var ctx = render.context;

  slingshot.drawBack(ctx);
  if (slingshot.isAttached()) {
    slingshot.drawBands(ctx);
  }
  bird.draw(ctx);
  if (slingshot.isAttached()) {
    slingshot.drawPouch(ctx);
  }
  slingshot.drawFront(ctx);
  pig.draw(ctx);
});

// ------------------------------------------------
// ANIMAÇÕES
// ------------------------------------------------

setInterval(function() {
  bird.animate();
  pig.animate();
}, 300);

// ------------------------------------------------
// ARRASTAR E LANÇAR O PÁSSARO
// ------------------------------------------------

var canvas = render.canvas;

function getMousePos(event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

canvas.addEventListener("mousedown", function(event) {
  var pos = getMousePos(event);
  slingshot.tryStartDrag(pos.x, pos.y);
});

canvas.addEventListener("mousemove", function(event) {
  if (!slingshot.dragging) {
    return;
  }
  var pos = getMousePos(event);
  slingshot.dragTo(pos.x, pos.y);
});

function onMouseRelease() {
  slingshot.release(world);
}

canvas.addEventListener("mouseup", onMouseRelease);
canvas.addEventListener("mouseleave", onMouseRelease);
window.addEventListener("mouseup", onMouseRelease);

// ------------------------------------------------
// INICIANDO O JOGO
// ------------------------------------------------

Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);
