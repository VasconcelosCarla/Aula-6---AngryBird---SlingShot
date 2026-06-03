class SlingShot {

  constructor(body, pointB, options) {

    options = options || {};

    this.body = body;
    this.pointB = pointB;

    // Elastico (Matter.js): puxa o passaro de volta para pointB quando esticado
    this.constraint = Constraint.create({
      bodyA: body,
      pointB: pointB,
      stiffness: options.stiffness || 0.04,
      length: options.length || 1,
      render: {
        visible: false
      }
    });

    this.scale = options.scale !== undefined ? options.scale : 1;

    // Canto superior esquerdo da madeira
    this.x = options.x !== undefined ? options.x : 150;
    this.y = options.y !== undefined ? options.y : 255;

    // Pontas do elastico visual — relativas a x,y, escalam junto
    var forkLeftOffsetX = options.forkLeftOffsetX !== undefined ? options.forkLeftOffsetX : 20;
    var forkLeftOffsetY = options.forkLeftOffsetY !== undefined ? options.forkLeftOffsetY : 30;
    var forkRightOffsetX = options.forkRightOffsetX !== undefined ? options.forkRightOffsetX : 60;
    var forkRightOffsetY = options.forkRightOffsetY !== undefined ? options.forkRightOffsetY : 30;

    this.forkLeft = {
      x: this.x + forkLeftOffsetX * this.scale,
      y: this.y + forkLeftOffsetY * this.scale
    };
    this.forkRight = {
      x: this.x + forkRightOffsetX * this.scale,
      y: this.y + forkRightOffsetY * this.scale
    };

    this.forkWidth = 79 * this.scale;
    this.forkHeight = 158 * this.scale;
    this.pouchWidth = 75 * this.scale;
    this.pouchHeight = 41 * this.scale;

    this.pouchOffsetX = (options.pouchOffsetX !== undefined ? options.pouchOffsetX : -37) * this.scale;
    this.pouchOffsetY = (options.pouchOffsetY !== undefined ? options.pouchOffsetY : 18) * this.scale;

    this.imageBack = new Image();
    this.imageBack.src = "assets/estilingue-tras.png";

    this.imageFront = new Image();
    this.imageFront.src = "assets/estilingue-frente.png";

    this.imageBase = new Image();
    this.imageBase.src = "assets/estilingue.png";

    this.attached = true;
    this.dragging = false;
    this.maxStretch = options.maxStretch || 180;
    this.launchPower = options.launchPower || 0.17;
    this.grabRadius = options.grabRadius || 55;
  }

  addToWorld(world) {
    Composite.add(world, this.constraint);
  }

  isAttached() {
    return this.attached;
  }

  isOnBird(mouseX, mouseY) {
    var dx = mouseX - this.body.position.x;
    var dy = mouseY - this.body.position.y;
    return dx * dx + dy * dy <= this.grabRadius * this.grabRadius;
  }

  tryStartDrag(mouseX, mouseY) {
    if (!this.attached || !this.isOnBird(mouseX, mouseY)) {
      return false;
    }
    this.dragging = true;
    Body.setVelocity(this.body, { x: 0, y: 0 });
    Body.setAngularVelocity(this.body, 0);
    this.dragTo(mouseX, mouseY);
    return true;
  }

  dragTo(mouseX, mouseY) {
    if (!this.dragging || !this.attached) {
      return;
    }

    var dx = mouseX - this.pointB.x;
    var dy = mouseY - this.pointB.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > this.maxStretch && dist > 0) {
      var scale = this.maxStretch / dist;
      dx *= scale;
      dy *= scale;
    }

    Body.setPosition(this.body, {
      x: this.pointB.x + dx,
      y: this.pointB.y + dy
    });
    Body.setVelocity(this.body, { x: 0, y: 0 });
    Body.setAngularVelocity(this.body, 0);
  }

  release(world) {
    if (!this.dragging || !this.attached) {
      this.dragging = false;
      return;
    }

    this.dragging = false;
    this.attached = false;

    var dx = this.pointB.x - this.body.position.x;
    var dy = this.pointB.y - this.body.position.y;

    Composite.remove(world, this.constraint);
    this.constraint = null;

    Body.setSleeping(this.body, false);
    Body.setVelocity(this.body, {
      x: dx * this.launchPower,
      y: dy * this.launchPower
    });
  }

  drawBack(ctx) {
    ctx.drawImage(this.imageBack, this.x, this.y, this.forkWidth, this.forkHeight);
  }

  drawFront(ctx) {
    ctx.drawImage(this.imageFront, this.x, this.y, this.forkWidth, this.forkHeight);
  }

  drawPouch(ctx) {
    if (!this.attached) {
      return;
    }

    var bx = this.body.position.x;
    var by = this.body.position.y;

    ctx.drawImage(
      this.imageBase,
      bx + this.pouchOffsetX,
      by + this.pouchOffsetY,
      this.pouchWidth,
      this.pouchHeight
    );
  }

  drawBands(ctx) {
    if (!this.attached) {
      return;
    }

    var birdX = this.body.position.x;
    var birdY = this.body.position.y;

    ctx.strokeStyle = "#4B3619";
    ctx.lineWidth = 6 * this.scale;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(this.forkLeft.x, this.forkLeft.y);
    ctx.lineTo(birdX, birdY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.forkRight.x, this.forkRight.y);
    ctx.lineTo(birdX, birdY);
    ctx.stroke();
  }

}
