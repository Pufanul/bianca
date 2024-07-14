export class Obstacle {
    constructor(ctx, canvasWidth, canvasHeight, speed, obstacleImages, xOffset = 0) {
        this.ctx = ctx;
        this.x = canvasWidth + xOffset;
        this.y = canvasHeight - 200;
        this.width = 50;
        this.height = 50;
        this.image = new Image();
        this.image.src = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
        this.speed = speed;
    }

    draw() {
        if (this.image.complete) {
            const aspectRatio = this.image.width / this.image.height;
            let drawWidth = this.height * aspectRatio;
            this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, drawWidth, this.height);
        }
    }

    update() {
        this.x -= this.speed;
        this.draw();
    }
}