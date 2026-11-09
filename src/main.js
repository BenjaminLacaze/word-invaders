/**
 * main.js
 * Punto de entrada principal que inicializa el videojuego WORD INVADERS.
 */

import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig.js';

function initGame() {
  new Phaser.Game(gameConfig);
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
