import { Scene } from "phaser";
import { Snake } from "../models/Snake";

export class Game extends Scene {
  private snake!: Snake;
  private food!: Phaser.GameObjects.Rectangle;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private readonly BLOCK_SIZE = 16;

  constructor() {
    super("Game");
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    this.snake = new Snake(this, 512, 384);

    // Spawn initial food
    this.spawnFood();

    // Set up score text
    this.scoreText = this.add.text(16, 16, "Очки: 0", {
      fontSize: "32px",
      color: "#fff",
    });

    // Initialize game over text
    this.gameOverText = this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Игра окончена", {
        fontSize: "32px",
        color: "#fff",
      })
      .setOrigin(0.5);
    this.gameOverText.setVisible(false); // Make sure it's invisible initially

    // Set up game over text (initially invisible)
    if (this.input.keyboard) {
      this.input.keyboard.on("keydown-LEFT", () => {
        this.snake.setDirection(-1, 0);
      });
      this.input.keyboard.on("keydown-RIGHT", () => {
        this.snake.setDirection(1, 0);
      });
      this.input.keyboard.on("keydown-UP", () => {
        this.snake.setDirection(0, -1);
      });
      this.input.keyboard.on("keydown-DOWN", () => {
        this.snake.setDirection(0, 1);
      });
    }

    // Restart game on pointer down when game over
    this.input.on("pointerdown", () => {
      if (this.gameOverText.visible) {
        this.scene.restart();
      }
    });
  }

  update(time: number) {
    if (!this.gameOverText.visible) {
      this.snake.update(time);

      // Check collision with food
      if (this.snake.getHead().getBounds().contains(this.food.x, this.food.y)) {
        this.snake.grow();
        this.food.destroy(); // Destroy the current food object
        this.spawnFood(); // Spawn a new food object
        this.score++;
        this.scoreText.setText(`Очки: ${this.score}`);
      }

      // Check collision with walls
      const head = this.snake.getHead();
      if (
        head.x < 0 ||
        head.x >= +this.game.config.width ||
        head.y < 0 ||
        head.y >= +this.game.config.height
      ) {
        this.gameOver();
      }

      // Check collision with self
      const body = this.snake.getBody();
      for (let i = 1; i < body.length; i++) {
        if (head.getBounds().contains(body[i].x, body[i].y)) {
          this.gameOver();
          break;
        }
      }
    }
  }

  private spawnFood(): void {
    const x =
      Phaser.Math.Between(0, +this.game.config.width / this.BLOCK_SIZE - 1) *
      this.BLOCK_SIZE;

    const y =
      Phaser.Math.Between(0, +this.game.config.height / this.BLOCK_SIZE - 1) *
      this.BLOCK_SIZE;
    this.food = this.add.rectangle(
      x,
      y,
      this.BLOCK_SIZE,
      this.BLOCK_SIZE,
      0xff0000
    );
  }

  private gameOver(): void {
    // Stop the snake from moving further
    this.snake.setDirection(0, 0); // This effectively stops the snake by setting its direction to 0,0
    this.gameOverText.setVisible(true);
  }
}
