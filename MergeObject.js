
class MergeObject extends Phaser.Physics.Matter.Image {
  static textureByTier = ['gift', 'candy', 'cookie', 'bell', 'snowman', 'snowball', 'star'];
  constructor(scene, x, y, tier, frame, options) {

    const defaultOptions = {
      isStatic: true,
      ...options
    };

    super(scene.matter.world, x, y, MergeObject.textureByTier[tier - 1], frame, defaultOptions);

    scene.add.existing(this);
    this.scene = scene;
    
    this.setBounce(0.8);
    this.setMass(60);
    this.setScale(0.2 + (tier - 1) * 0.05);

    const fallbackRadius = Math.min(this.displayWidth, this.displayHeight) * 0.5;
    this.setCircle(fallbackRadius, { label: 'merge-circle' });
    
    if (defaultOptions.isStatic) {
      this.setStatic(true);
    }

    this.tier = tier;
    this.isReleased = false;
    this.isMerging = false;

    // collision helpers
    this._originalCollisionMask = null;
    this._collisionDisabled = false;
  }
  
  release() {
    this.isReleased = true;
    if (this.body && this.body.isStatic) {
      this.scene.matter.body.setPosition(this.body, { x: this.x, y: this.y });
      this.scene.matter.body.setStatic(this.body, false);
    }

    if (this._collisionDisabled) {
      this.enableCollision();
    }
  }

  disableCollision() {
    if (this.body && !this._collisionDisabled) {
      this._originalCollisionMask = (this.body.collisionFilter && this.body.collisionFilter.mask != null) ? this.body.collisionFilter.mask : 0xFFFFFFFF;
      this.body.collisionFilter.mask = 0;
      this._collisionDisabled = true;
    }
  }

  enableCollision() {
    if (this.body && this._collisionDisabled) {
      this.body.collisionFilter.mask = (this._originalCollisionMask != null) ? this._originalCollisionMask : 0xFFFFFFFF;
      this._collisionDisabled = false;
    }
  }

  setStatic(isStatic) {
    if (this.body) {
      this.scene.matter.body.setStatic(this.body, isStatic);
    }
  }

}

