// Represents the snake in the game
export class Snake {
  private head: Phaser.GameObjects.Rectangle;
  private body: Phaser.GameObjects.Rectangle[] = [];
  private direction: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0);
  private readonly BLOCK_SIZE = 16; // Size of each block in pixels
  private speed: number = 100; // Speed in milliseconds
  private lastMoveTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.head = scene.add.rectangle(
      x,
      y,
      this.BLOCK_SIZE,
      this.BLOCK_SIZE,
      0x00ff00
    );
    this.body.push(this.head);
  }

  public getHead(): Phaser.GameObjects.Rectangle {
    return this.head;
  }

  public getBody(): Phaser.GameObjects.Rectangle[] {
    return this.body;
  }

  public setDirection(x: number, y: number): void {
    this.direction.set(x, y);
  }

  public update(time: number): void {
    if (time - this.lastMoveTime > this.speed) {
      this.lastMoveTime = time;
      // Move body segments
      for (let i = this.body.length - 1; i > 0; i--) {
        this.body[i].x = this.body[i - 1].x;
        this.body[i].y = this.body[i - 1].y;
      }

      // Move head
      this.head.x += this.direction.x * this.BLOCK_SIZE;
      this.head.y += this.direction.y * this.BLOCK_SIZE;
    }
  }

  public grow(): void {
    const tail = this.body[this.body.length - 1];
    const newPart = this.head.scene.add.rectangle(
      tail.x - this.direction.x * this.BLOCK_SIZE,
      tail.y - this.direction.y * this.BLOCK_SIZE,
      this.BLOCK_SIZE,
      this.BLOCK_SIZE,
      0x00ff00
    );
    this.body.push(newPart);
  }
}
