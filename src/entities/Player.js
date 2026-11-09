/**
 * Player.js
 * Representa la nave espacial controlada por el jugador.
 * Solamente se desplaza de forma horizontal en la parte inferior de la pantalla.
 */

import Phaser from 'phaser';
import { ASSET_KEYS, ANIM_KEYS, GAMEPLAY } from '../config/constants.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene Escena a la que pertenece la nave
   * @param {number} x Posición horizontal inicial
   * @param {number} y Posición vertical fija
   */
  constructor(scene, x, y = GAMEPLAY.PLAYER_Y) {
    super(scene, x, y, ASSET_KEYS.PLAYER);

    // Agregar el sprite a la escena y habilitar su cuerpo físico
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Iniciar la animación en bucle de los motores de la nave
    if (scene.anims.exists(ANIM_KEYS.PLAYER_IDLE)) {
      this.play(ANIM_KEYS.PLAYER_IDLE);
    }

    // Impedir que la nave salga por los bordes izquierdo o derecho de la pantalla
    this.setCollideWorldBounds(true);

    // Configurar controles del teclado: Flechas y teclas A / D
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.lastFiredTime = 0;
    this.canControl = true;
  }

  /**
   * Actualiza el movimiento horizontal de la nave en cada fotograma.
   */
  update() {
    if (!this.canControl || !this.body) {
      this.setVelocityX(0);
      return;
    }

    const moveLeft = this.cursors.left.isDown || this.keyA.isDown;
    const moveRight = this.cursors.right.isDown || this.keyD.isDown;

    if (moveLeft && !moveRight) {
      this.setVelocityX(-GAMEPLAY.PLAYER_SPEED);
    } else if (moveRight && !moveLeft) {
      this.setVelocityX(GAMEPLAY.PLAYER_SPEED);
    } else {
      this.setVelocityX(0);
    }
  }

  /**
   * Verifica si el jugador presionó la tecla de disparo y si se cumplió el tiempo de recarga.
   * @param {number} currentTime Tiempo actual de la escena (time)
   * @returns {boolean}
   */
  wantsToFire(currentTime) {
    if (!this.canControl) {
      return false;
    }

    const spacePressed = Phaser.Input.Keyboard.JustDown(this.keySpace);
    if (spacePressed && currentTime > this.lastFiredTime + GAMEPLAY.FIRE_COOLDOWN) {
      this.lastFiredTime = currentTime;
      return true;
    }
    return false;
  }

  /**
   * Activa o desactiva el control del jugador (por ejemplo, durante pausas de victoria/error).
   * @param {boolean} enabled
   */
  setControlsEnabled(enabled) {
    this.canControl = enabled;
    if (!enabled && this.body) {
      this.setVelocityX(0);
    }
  }
}
