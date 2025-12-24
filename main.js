class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    // TODO: 이미지/사운드 에셋 로드는 여기서
  }

  create() {
    // 간단한 테스트용 텍스트 (나중에 제거 가능)
    const { width, height } = this.scale;
    this.add
      .text(width / 2, height / 2, "Hello Phaser!", {
        fontFamily: "Arial",
        fontSize: 32,
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  update(time, delta) {
    // 매 프레임마다 돌아가는 로직은 여기서
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#1d1d1d",

  // 기본 해상도 (세로형 모바일 기준) - 필요시 변경
  width: 360,
  height: 640,

  // 스케일 옵션: 화면 크기에 맞게 자동으로 맞춤 + 가운데 정렬
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  // 물리 엔진 (필요 없으면 나중에 끌 수 있음)
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  scene: [MainScene],
};

// 게임 시작
window.addEventListener("load", () => {
  new Phaser.Game(config);
});


