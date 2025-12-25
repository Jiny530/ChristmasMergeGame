class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image('frame', 'assets/images/frame.png');
    this.load.image('background', 'assets/images/background.png');
    this.load.image('gift', 'assets/images/gift.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('socks', 'assets/images/socks.png');
    this.load.image('cookie', 'assets/images/cookie.png');
    this.load.image('bell', 'assets/images/bell.png');
    this.load.image('snowman', 'assets/images/snowman.png');
    this.load.image('santahat', 'assets/images/santahat.png');
    this.load.image('wreath', 'assets/images/wreath.png');
    this.load.image('snowball', 'assets/images/snowball.png');
    this.load.image('star', 'assets/images/star.png');
    
    this.load.audio('pop', ['assets/sounds/popSound.mp3']);
    this.load.audio('bgm', ['assets/sounds/christmasBGM.mp3']);

  }

  create() {

    const frameData = this.createFrame(this.scale.width, this.scale.height);
    
    this.setupPhysicsBounds(frameData);
    this.setupTouchControls(frameData);
    this.setupCollisionEvents();
    this.setupScoreDisplay();
    this.setupSounds()

    this.currentMaxTier = 1;
    this.isGameOver = false;
    this.GAME_OVER_HEIGHT = frameData.top - 20;

    this.createNewObject(frameData);
  }

  setupSounds() {
    this.mergeSound = this.sound.add('pop', { volume: 0.6 });
    this.bgm = this.sound.add('bgm', { volume: 0.5, loop: true });
    this.bgm.play();
  }

  checkIsGameOver(object) {
    if (!(object instanceof MergeObject)) return false;
    return object.y < this.GAME_OVER_HEIGHT;
  }

  OnGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true; 

    if (this.matter && this.matter.world) this.matter.world.enabled = false;

    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    // overlay
    const overlay = this.add.rectangle(cx, cy, 320, 180, 0x000000, 0.75);
    const title = this.add.text(cx, cy - 40, 'Game Over', { font: '24px Arial', fill: '#fff' }).setOrigin(0.5);
    const scoreText = this.add.text(cx, cy - 6, `Score: ${this.score || 0}`, { font: '16px Arial', fill: '#fff' }).setOrigin(0.5);

    // restart button
    const btn = this.add.rectangle(cx, cy + 34, 140, 40, 0x1e90ff).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const btnText = this.add.text(cx, cy + 34, 'Restart', { font: '16px Arial', fill: '#fff' }).setOrigin(0.5);

    btn.on('pointerdown', () => {
      this.scene.restart();
    });
    btn.on('pointerover', () => btn.setFillStyle(0x379bff));
    btn.on('pointerout', () => btn.setFillStyle(0x1e90ff));

    this.bgm.stop();
  }

  setupScoreDisplay() {
    this.score = 0;
    this.scoreText = this.add.text(12, 12, 'Score: 0', { 
      font: 'bold 22px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0, 0).setDepth(10);

    this.MAX_TIER = MergeObject.textureByTier.length;
    this.scoreByTier = Array.from({ length: this.MAX_TIER }, (_, i) => 1 * Math.pow(2, i));
  }

  setupCollisionEvents() {
  
    this.matter.world.on('collisionstart', (event) => {

      if (this.isGameOver) return;

      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        const objectA = bodyA.gameObject;
        const objectB = bodyB.gameObject;

        if (this.checkIsGameOver(objectA) || this.checkIsGameOver(objectB)) {
          this.OnGameOver();
          return;
        }
        
        if (objectA instanceof MergeObject && objectB instanceof MergeObject) {
          if (objectA.isReleased && objectB.isReleased &&
              objectA.tier === objectB.tier) 
              {
                this.merge(objectA, objectB);
              }
            }
          
      });
    });
  }

  merge(objectA, objectB) {

    if (objectA.isMerging || objectB.isMerging) {
      return;
    }
    
    this.mergeSound.play();

    objectA.isMerging = true;
    objectB.isMerging = true;

    const mergeX = (objectA.x + objectB.x) / 2;
    const mergeY = (objectA.y + objectB.y) / 2;
    
    const mergeTier = objectA.tier + 1;
    
    if (mergeTier > this.currentMaxTier) {
      this.currentMaxTier = mergeTier;
    }

    objectA.destroy();
    objectB.destroy();
    
    const mergedObject = new MergeObject(this, mergeX, mergeY, mergeTier, null, {
      isStatic: false
    });

    mergedObject.isReleased = true;

    this.addScore(mergeTier);

  }

  createFrame(ScreenWidth, ScreenHeight) {

    const middleX = ScreenWidth/2;
    const middleY = ScreenHeight/2;

    this.add.image(middleX, middleY, 'background')
      .setOrigin(0.5, 0.5)
      .setScale(0.5);

    const frame = this.add.image(middleX, middleY, 'frame')
      .setOrigin(0.5, 0.5)
      .setScale(0.3);
    
    const width = frame.displayWidth;
    const height = frame.displayHeight;
    const top = middleY - height/2;
    const bottom = middleY + height/2;
    const left = middleX - width/2;
    const right = middleX + width/2;
    
    return {
      frame,
      width,
      height,
      middleX,
      middleY,
      left,
      right,
      top,
      bottom
    };
  }

  setupPhysicsBounds(frameData) {
    this.matter.world.setBounds(frameData.left, 0, frameData.width, frameData.bottom);
  }

  createNewObject(frameData){
    const randomTier = Phaser.Math.Between(1, Math.max(this.currentMaxTier-2,1));
    this.newObject = new MergeObject(this, frameData.middleX, frameData.top, randomTier, null, {
      isStatic: true
    });
    this.newObject.disableCollision();
  }

  
  addScore(tier) {
    const points = this.scoreByTier[tier - 1];
    this.score += points;
    
    if (this.scoreText) 
      this.scoreText.setText(`Score: ${this.score}`);    
  }


  setupTouchControls(frameData) {
    this.isDragging = false;
    
    this.input.on('pointerdown', (pointer) => {
      if (this.isGameOver) return;
      if (this.newObject && !this.newObject.isReleased && this.newObject.body && this.newObject.body.isStatic) {
        this.isDragging = true;
        this.setObjectXPosition(pointer.x, frameData);
        }
    });

    this.input.on('pointermove', (pointer) => {  
      if (this.isGameOver) return;
      if (this.isDragging && this.newObject && pointer.isDown) {
        this.setObjectXPosition(pointer.x, frameData);
      }
    });

    this.input.on('pointerup', () => {
      if (this.isGameOver) return;
      if (this.isDragging && this.newObject && !this.newObject.isReleased) {
        this.isDragging = false;
        
        this.newObject.release();
        this.createNewObject(frameData);
      }
    });
    
    this.input.on('pointerupoutside', () => {
      if (this.isGameOver) return;
      if (this.isDragging && this.newObject && !this.newObject.isReleased) {
        this.isDragging = false;
        
        this.newObject.release();
        this.createNewObject(frameData);
      }
    });

  }

  setObjectXPosition(x, frameData) {
    const leftLimit = frameData.left + this.newObject.displayWidth/2;
    const rightLimit = frameData.right - this.newObject.displayWidth/2;

    this.newObject.x = Phaser.Math.Clamp(x, leftLimit, rightLimit);
  }

  update(time, delta) {
   
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#1d1d1d",
  width: 360,
  height: 640,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "matter",
  },
  scene: [MainScene],
};

// 게임 시작
window.addEventListener("load", () => {
  new Phaser.Game(config);
});


