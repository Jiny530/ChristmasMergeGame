class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image('gift', 'assets/images/gift.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('cookie', 'assets/images/cookie.png');
    this.load.image('bell', 'assets/images/bell.png');
    this.load.image('snowman', 'assets/images/snowman.png');
    this.load.image('snowball', 'assets/images/snowball.png');
    this.load.image('star', 'assets/images/star.png');
    this.load.image('frame', 'assets/images/frame.png');
  }

  create() {

    const frameData = this.createFrame(this.scale.width, this.scale.height);
    
    this.setupPhysicsBounds(frameData);
    this.setupTouchControls(frameData);
    this.setupMergeEvents();
    
    this.createNewObject(frameData);
  }

  setupMergeEvents() {
  
    this.matter.world.on('collisionstart', (event) => {
      event.pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;

        const objectA = bodyA.gameObject;
        const objectB = bodyB.gameObject;

        if (objectA instanceof MergeObject && objectB instanceof MergeObject) {
          if (objectA.isReleased && objectB.isReleased &&
              objectA.level === objectB.level) 
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
    
    objectA.isMerging = true;
    objectB.isMerging = true;

    const mergeX = (objectA.x + objectB.x) / 2;
    const mergeY = (objectA.y + objectB.y) / 2;
    
    const newLevel = objectA.level + 1;

    objectA.destroy();
    objectB.destroy();
    
    const newObject = new MergeObject(this, mergeX, mergeY, 'gift', null, {
      isStatic: false
    });
    
    newObject.level = newLevel;
    newObject.isReleased = true;
    
    newObject.setScale(0.2 + (newLevel - 1) * 0.05);
  }

  createFrame(ScreenWidth, ScreenHeight) {

    const middleX = ScreenWidth/2;
    const middleY = ScreenHeight/2;

    const frame = this.add.image(middleX, middleY, 'frame')
      .setOrigin(0.5, 0.5)
      .setScale(0.8);
    
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
    this.newObject = new MergeObject(this, frameData.middleX, frameData.top - 50, 'gift', null, {
      isStatic: true
    });

    this.newObject.disableCollision();
  }

  setupTouchControls(frameData) {
    this.isDragging = false;
    this.startTouchX = 0;
    this.startGiftX = 0;
    
    this.input.on('pointerdown', (pointer) => {
      if (this.newObject && !this.newObject.isReleased && this.newObject.body && this.newObject.body.isStatic) {
        this.isDragging = true;
        this.startTouchX = pointer.x;
        this.startGiftX = this.newObject.x;
      }
    });

    this.input.on('pointermove', (pointer) => {  
      if (this.isDragging && this.newObject && pointer.isDown) {
        const deltaX = pointer.x - this.startTouchX;
        const leftLimit = frameData.left + this.newObject.displayWidth/2;
        const rightLimit = frameData.right - this.newObject.displayWidth/2;

        this.newObject.x = Phaser.Math.Clamp(this.startGiftX + deltaX, leftLimit, rightLimit);
      }
    });

    this.input.on('pointerup', () => {
      if (this.isDragging && this.newObject && !this.newObject.isReleased) {
        this.isDragging = false;
        
        this.newObject.release();
        this.createNewObject(frameData);
      }
    });
    
    this.input.on('pointerupoutside', () => {
      if (this.isDragging && this.newObject && !this.newObject.isReleased) {
        this.isDragging = false;
        
        this.newObject.release();
        this.createNewObject(frameData);
      }
    });

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


