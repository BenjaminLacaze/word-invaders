/**
 * MenuScene.js
 * Pantalla de inicio de WORD INVADERS.
 * Muestra el título, las instrucciones básicas y permite iniciar la partida.
 */

import Phaser from 'phaser';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  SCENES,
  ASSET_KEYS,
  ANIM_KEYS,
  GAMEPLAY,
  COLORS,
  FONT_FAMILY
} from '../config/constants.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENES.MENU);
  }

  create() {
    // 1. Fondo espacial (usa background.png si existe o dibuja estrellas pixel art)
    this.createBackground();

    // 2. Título o Logo principal
    if (this.hasCustomLogo()) {
      this.add.image(GAME_WIDTH / 2, 135, ASSET_KEYS.LOGO).setOrigin(0.5);
    } else {
      this.add
        .text(GAME_WIDTH / 2, 115, 'WORD INVADERS', {
          fontFamily: FONT_FAMILY,
          fontSize: '48px',
          fontStyle: 'bold',
          color: COLORS.CYAN_HEX
        })
        .setOrigin(0.5);

      this.add
        .text(GAME_WIDTH / 2, 165, 'ARCADE DE VOCABULARIO EN INGLÉS', {
          fontFamily: FONT_FAMILY,
          fontSize: '16px',
          color: COLORS.YELLOW_HEX
        })
        .setOrigin(0.5);
    }

    // 3. Panel de instrucciones claras para el estudiante
    const panel = this.add.graphics();
    panel.fillStyle(COLORS.HUD_BG_NUM, 0.9);
    panel.lineStyle(2, COLORS.HUD_BORDER_NUM, 1);
    panel.fillRect(130, 215, 540, 220);
    panel.strokeRect(130, 215, 540, 220);

    const instructions = [
      '¿CÓMO JUGAR?',
      '',
      '1. Observa la palabra en ESPAÑOL arriba.',
      '2. En pantalla verás su traducción al INGLÉS',
      '   mezclada con LETRAS SOBRANTES.',
      '3. Dispara SOLAMENTE a las letras sobrantes.',
      '4. Si destruyes una letra correcta, se suma',
      '   1 error y el nivel se reinicia.',
      '',
      'CONTROLES: [FLECHAS / A-D] Mover | [ESPACIO] Disparar'
    ];

    this.add
      .text(GAME_WIDTH / 2, 325, instructions.join('\n'), {
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        color: COLORS.WHITE_HEX,
        align: 'center',
        lineSpacing: 5
      })
      .setOrigin(0.5);

    // 4. Muestra decorativa del sprite de la nave con animación de motores
    const menuShip = this.add.sprite(GAME_WIDTH / 2, 475, ASSET_KEYS.PLAYER);
    if (this.anims.exists(ANIM_KEYS.PLAYER_IDLE)) {
      menuShip.play(ANIM_KEYS.PLAYER_IDLE);
    }

    // 5. Texto parpadeante para iniciar
    const startText = this.add
      .text(GAME_WIDTH / 2, 535, 'PRESIONA [ESPACIO] O [ENTER] PARA JUGAR', {
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
        fontStyle: 'bold',
        color: COLORS.GREEN_HEX
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.25,
      duration: 650,
      yoyo: true,
      repeat: -1
    });

    // 6. Eventos de teclado y clic para comenzar la partida
    const soundManager = this.registry.get('soundManager');
    if (soundManager) {
      soundManager.setScene(this);
    }

    const startGame = () => {
      const levelManager = this.registry.get('levelManager');
      if (levelManager) {
        levelManager.resetGame();
      }
      if (soundManager) {
        soundManager.playBackgroundMusic();
      }
      this.scene.start(SCENES.GAME);
    };

    this.input.keyboard.once('keydown-SPACE', startGame);
    this.input.keyboard.once('keydown-ENTER', startGame);
    this.input.once('pointerdown', startGame);
  }

  update(time, delta) {
    if (this.bgTile) {
      this.bgTile.tilePositionY -= (GAMEPLAY.BG_SCROLL_SPEED * delta) / 1000;
    }
  }

  /**
   * Dibuja el fondo espacial preparado para desplazamiento vertical continuo.
   */
  createBackground() {
    this.bgTile = this.add
      .tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, ASSET_KEYS.BACKGROUND)
      .setOrigin(0, 0);
  }

  hasCustomLogo() {
    if (!this.textures.exists(ASSET_KEYS.LOGO)) {
      return false;
    }
    const tex = this.textures.get(ASSET_KEYS.LOGO);
    return tex && tex.key !== '__MISSING';
  }
}
