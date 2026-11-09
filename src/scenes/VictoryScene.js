/**
 * VictoryScene.js
 * Escena final que se muestra cuando el jugador supera todas las palabras del glosario.
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

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super(SCENES.VICTORY);
  }

  create() {
    this.createBackground();

    const levelManager = this.registry.get('levelManager');
    const totalLevels = levelManager ? levelManager.getTotalLevels() : 0;
    const totalErrors = levelManager ? levelManager.getErrors() : 0;

    // Panel central
    const panel = this.add.graphics();
    panel.fillStyle(COLORS.HUD_BG_NUM, 0.95);
    panel.lineStyle(2, COLORS.GREEN_NUM, 1);
    panel.fillRect(140, 130, 520, 330);
    panel.strokeRect(140, 130, 520, 330);

    this.add
      .text(GAME_WIDTH / 2, 190, '¡MISIÓN COMPLETADA!', {
        fontFamily: FONT_FAMILY,
        fontSize: '36px',
        fontStyle: 'bold',
        color: COLORS.GREEN_HEX
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        245,
        'Has traducido correctamente todo el glosario.',
        {
          fontFamily: FONT_FAMILY,
          fontSize: '16px',
          color: COLORS.WHITE_HEX
        }
      )
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 305, `PALABRAS COMPLETADAS: ${totalLevels}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
        fontStyle: 'bold',
        color: COLORS.CYAN_HEX
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 345, `ERRORES COMETIDOS: ${totalErrors}`, {
        fontFamily: FONT_FAMILY,
        fontSize: '20px',
        fontStyle: 'bold',
        color: totalErrors === 0 ? COLORS.GREEN_HEX : COLORS.YELLOW_HEX
      })
      .setOrigin(0.5);

    const victoryShip = this.add.sprite(GAME_WIDTH / 2, 410, ASSET_KEYS.PLAYER);
    if (this.anims.exists(ANIM_KEYS.PLAYER_IDLE)) {
      victoryShip.play(ANIM_KEYS.PLAYER_IDLE);
    }

    const replayText = this.add
      .text(
        GAME_WIDTH / 2,
        510,
        'PRESIONA [ESPACIO] O [ENTER] PARA VOLVER A JUGAR',
        {
          fontFamily: FONT_FAMILY,
          fontSize: '18px',
          fontStyle: 'bold',
          color: COLORS.YELLOW_HEX
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: replayText,
      alpha: 0.25,
      duration: 650,
      yoyo: true,
      repeat: -1
    });

    const restartAll = () => {
      if (levelManager) {
        levelManager.resetGame();
      }
      this.scene.start(SCENES.MENU);
    };

    this.input.keyboard.once('keydown-SPACE', restartAll);
    this.input.keyboard.once('keydown-ENTER', restartAll);
    this.input.once('pointerdown', restartAll);
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
}
