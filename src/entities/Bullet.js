/**
 * Bullet.js
 * Representa un proyectil disparado verticalmente hacia arriba desde la nave del jugador.
 */

import Phaser from 'phaser';
import { ASSET_KEYS, GAMEPLAY } from '../config/constants.js';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene Escena donde se crea el proyectil
   * @param {number} x Posición X inicial
   * @param {number} y Posición Y inicial
   */
  constructor(scene, x, y) {
    super(scene, x, y, ASSET_KEYS.BULLET);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Ajustar velocidad vertical hacia arriba
    this.body.setAllowGravity(false);
    this.setVelocityY(-GAMEPLAY.BULLET_SPEED);
  }

  /**
   * Se ejecuta automáticamente en cada fotograma.
   * Si el proyectil sale por la parte superior de la pantalla, se destruye para liberar memoria.
   */
  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y < -20) {
      this.destroy();
    }
  }
}
