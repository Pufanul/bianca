export class Character {
  constructor(ctx, canvas, jumpSound) {
      this.ctx = ctx;
      this.canvas = canvas;
      this.x = 50;
      this.y = canvas.height - 200;
      this.width = 50;
      this.height = 50;
      this.image = new Image();
      this.image.src = 'resources/images/woman.png';
      this.dy = 0;
      this.gravity = 0.6;
      this.jumpHeight = -19;
      this.jumping = false;
      this.jumpSound = jumpSound;
  }

  draw() {
      if (this.image.complete) {
          const aspectRatio = this.image.width / this.image.height;
          let drawWidth = this.height * aspectRatio;
          this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, drawWidth, this.height);
      }
  }

  update() {
      if (this.jumping) {
          this.dy += this.gravity;
          this.y += this.dy;
          if (this.y > this.canvas.height - 200) {
              this.y = this.canvas.height - 200;
              this.dy = 0;
              this.jumping = false;
          }
      }
      this.draw();
  }

  jump() {
      if (!this.jumping) {
          this.dy = this.jumpHeight;
          this.jumping = true;
          this.jumpSound.play();
      }
  }
}