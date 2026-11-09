/**
 * LetterBox.js
 * Entidad que representa cada bloque de letra en la parte superior de la pantalla.
 * Combina el sprite de fondo (`letter_tile`) con el texto de la letra generado por Phaser.
 */

import Phaser from 'phaser';
import {
  ASSET_KEYS,
  SPRITE_SIZES,
  COLORS,
  FONT_FAMILY
} from '../config/constants.js';

export class LetterBox extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene Escena actual
   * @param {number} x Posición horizontal
   * @param {number} y Posición vertical
   * @param {{id: number, char: string, isExtra: boolean, isSpace: boolean}} nodeData Datos lógicos de la letra
   */
  constructor(scene, x, y, nodeData) {
    super(scene, x, y);

    this.nodeId = nodeData.id;
    this.char = nodeData.char;
    this.isExtra = Boolean(nodeData.isExtra);
    this.isSpace = Boolean(nodeData.isSpace);
    this.isDestroyed = false;

    const { width, height } = SPRITE_SIZES.LETTER_TILE;

    // 1. Sprite de fondo del bloque de letra
    this.tileSprite = scene.add.sprite(0, 0, ASSET_KEYS.LETTER_TILE);
    this.add(this.tileSprite);

    // 2. Carácter de la letra centrado sobre el bloque
    this.letterText = scene.add
      .text(0, 0, this.char, {
        fontFamily: FONT_FAMILY,
        fontSize: '24px',
        fontStyle: 'bold',
        color: COLORS.WHITE_HEX
      })
      .setOrigin(0.5);
    this.add(this.letterText);

    // Definir tamaño del contenedor y habilitar colisión física en Arcade Physics
    this.setSize(width, height);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    if (this.body) {
      this.body.setAllowGravity(false);
      this.body.setImmovable(true);
    }
  }

  /**
   * Destruye individualmente este bloque de letra cuando es una letra sobrante.
   */
  destroyLetter() {
    if (this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;

    if (this.body) {
      this.body.enable = false;
    }

    this.destroy();
  }

  /**
   * Resalta el bloque en color verde cuando el jugador completa el nivel,
   * mostrando claramente la palabra correcta formada.
   */
  highlightAsCorrect() {
    if (this.isDestroyed || !this.active) {
      return;
    }
    this.tileSprite.setTint(COLORS.GREEN_NUM);
    this.letterText.setColor(COLORS.YELLOW_HEX);
  }

  /**
   * Resalta el bloque en color rojo cuando el jugador dispara por error a una letra correcta.
   */
  highlightAsError() {
    if (this.isDestroyed || !this.active) {
      return;
    }
    this.tileSprite.setTint(COLORS.RED_NUM);
    this.letterText.setColor(COLORS.RED_HEX);
  }
}
