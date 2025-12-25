class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }

  preload() {
    
    this.load.image('background', 'assets/images/background.png');
    this.load.image('title_background', 'assets/images/background_clear.png');
    this.load.image('frame', 'assets/images/frame.png');
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

    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.add.image(cx, cy, 'title_background')
      .setOrigin(0.5, 0.5)
      .setScale(0.5);
    

    this.add.text(cx, cy - 40, 'Christmas Merge', {
      font: 'bold 34px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const startText = this.add.text(cx, cy + 12, 'Tap to Start', {
      font: '18px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.input.on('pointerdown', () => {
      this.scene.start('MainScene');
    });

    this.tweens.add({
      targets: startText,
      y: cy + 16,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}