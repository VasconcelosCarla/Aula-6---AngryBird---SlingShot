class Pig {

  constructor(x, y) {

    this.body = Bodies.circle(x, y, 28, {
      restitution: 0.3,
      render: {
        visible: false
      }
    });

    this.image = new Image();
    this.image.src = "assets/porco-animacao/porco.png";

    this.frame = 0;
  }

  addToWorld(world) {
    Composite.add(world, this.body);
  }

  draw(ctx) {

    var larguraFrame = 900;
    var alturaFrame = 900;

    // No porco, os frames estão um embaixo do outro.
    var xSprite = 0;
    var ySprite = this.frame * alturaFrame;

    ctx.save();

    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);

    ctx.drawImage(
      this.image,

      xSprite,
      ySprite,

      larguraFrame,
      alturaFrame,

      -45,
      -45,

      90,
      90
    );

    ctx.restore();
  }

  animate() {

    this.frame++;

    // Seu porco tem 2 frames: 0 e 1.
    if (this.frame > 1) {
      this.frame = 0;
    }
  }
}