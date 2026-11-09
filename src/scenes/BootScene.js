/**
 * BootScene.js
 * Escena encargada de cargar el glosario JSON y los recursos gráficos desde public/assets/images/.
 * Si un sprite aún no ha sido colocado en la carpeta de imágenes, genera automáticamente
 * un gráfico provisional pixel art con la misma clave para que el juego funcione siempre
 * y permita reemplazar recursos simplemente copiando los archivos PNG.
 */

import Phaser from 'phaser';
import {
  SCENES,
  ASSET_KEYS,
  ANIM_KEYS,
  AUDIO_KEYS,
  SPRITE_SIZES,
  GAMEPLAY,
  COLORS
} from '../config/constants.js';
import { GlossaryManager } from '../managers/GlossaryManager.js';
import { LevelManager } from '../managers/LevelManager.js';
import { SoundManager } from '../managers/SoundManager.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENES.BOOT);
    this.missingAssets = new Set();
  }

  preload() {
    // Registrar cualquier archivo que aún no exista en public/assets/images/
    this.load.on('loaderror', (fileObj) => {
      this.missingAssets.add(fileObj.key);
    });

    // 1. Cargar el archivo de glosario JSON
    this.load.json(ASSET_KEYS.GLOSSARY, 'data/glossary.json');

    // 2. Intentar cargar los sprites personalizados desde public/assets/images/
    // Si el usuario coloca sus propios archivos PNG con estos nombres, se usarán automáticamente.
    this.load.image(ASSET_KEYS.PLAYER, 'assets/images/player.png');
    this.load.image(ASSET_KEYS.PLAYER_2, 'assets/images/player_2.png');
    this.load.image(ASSET_KEYS.BULLET, 'assets/images/bullet.png');
    this.load.image(ASSET_KEYS.LETTER_TILE, 'assets/images/letter_tile.png');
    this.load.image(ASSET_KEYS.BACKGROUND, 'assets/images/background.png');
    this.load.image(ASSET_KEYS.BACKGROUND_2, 'assets/images/background_2.png');
    this.load.image(ASSET_KEYS.LOGO, 'assets/images/logo.png');

    // 3. Intentar cargar la música y efectos de sonido desde public/assets/audio/
    // Soporta formatos .mp3, .ogg y .wav. Si aún no están en la carpeta, el juego funciona en silencio sin errores.
    this.load.audio(AUDIO_KEYS.BGM, [
      'assets/audio/bgm.mp3',
      'assets/audio/bgm.ogg',
      'assets/audio/bgm.wav'
    ]);
    this.load.audio(AUDIO_KEYS.SHOOT, [
      'assets/audio/shoot.mp3',
      'assets/audio/shoot.ogg',
      'assets/audio/shoot.wav'
    ]);
    this.load.audio(AUDIO_KEYS.DESTROY, [
      'assets/audio/destroy.mp3',
      'assets/audio/destroy.ogg',
      'assets/audio/destroy.wav'
    ]);
    this.load.audio(AUDIO_KEYS.ERROR, [
      'assets/audio/error.mp3',
      'assets/audio/error.ogg',
      'assets/audio/error.wav'
    ]);
    this.load.audio(AUDIO_KEYS.WORD_COMPLETE, [
      'assets/audio/word_complete.mp3',
      'assets/audio/word_complete.ogg',
      'assets/audio/word_complete.wav'
    ]);
  }

  create() {
    // Generar texturas provisionales para cualquier recurso que no exista como archivo físico
    this.ensureProvisionalTextures();

    // Crear la animación en bucle para los motores de la nave alternando entre los 2 fotogramas
    this.createGlobalAnimations();

    // Inicializar GlossaryManager, LevelManager y SoundManager en el registro global de Phaser
    const rawGlossary = this.cache.json.get(ASSET_KEYS.GLOSSARY);
    const glossaryManager = new GlossaryManager(rawGlossary);
    const levelManager = new LevelManager(glossaryManager);
    const soundManager = new SoundManager(this);

    this.registry.set('glossaryManager', glossaryManager);
    this.registry.set('levelManager', levelManager);
    this.registry.set('soundManager', soundManager);

    // Iniciar la escena del menú principal
    this.scene.start(SCENES.MENU);
  }

  /**
   * Comprueba qué texturas no fueron cargadas desde archivos PNG y las genera
   * mediante gráficos vectoriales/pixel art de Phaser.
   */
  ensureProvisionalTextures() {
    // 1. Nave del jugador provisional (32x32 px, estilo arcade pixel art)
    if (!this.hasValidTexture(ASSET_KEYS.PLAYER)) {
      const { width, height } = SPRITE_SIZES.PLAYER;
      const g = this.make.graphics({ x: 0, y: 0, add: false });

      // Cañón central superior
      g.fillStyle(COLORS.YELLOW_NUM, 1);
      g.fillRect(14, 2, 4, 6);

      // Cabina y fuselaje principal
      g.fillStyle(COLORS.CYAN_NUM, 1);
      g.fillRect(12, 8, 8, 16);
      g.fillRect(8, 14, 16, 10);
      g.fillRect(4, 20, 24, 6);
      g.fillRect(2, 24, 6, 6);
      g.fillRect(24, 24, 6, 6);

      // Visor de cabina
      g.fillStyle(COLORS.WHITE_NUM, 1);
      g.fillRect(14, 10, 4, 6);

      // Propulsores inferiores (Fotograma 1)
      g.fillStyle(COLORS.RED_NUM, 1);
      g.fillRect(10, 26, 4, 4);
      g.fillRect(18, 26, 4, 4);

      g.generateTexture(ASSET_KEYS.PLAYER, width, height);
      g.destroy();
    }

    // 1b. Nave del jugador fotograma 2 provisional (32x32 px, motores extendidos)
    if (!this.hasValidTexture(ASSET_KEYS.PLAYER_2)) {
      const { width, height } = SPRITE_SIZES.PLAYER;
      const g = this.make.graphics({ x: 0, y: 0, add: false });

      g.fillStyle(COLORS.YELLOW_NUM, 1);
      g.fillRect(14, 2, 4, 6);

      g.fillStyle(COLORS.CYAN_NUM, 1);
      g.fillRect(12, 8, 8, 16);
      g.fillRect(8, 14, 16, 10);
      g.fillRect(4, 20, 24, 6);
      g.fillRect(2, 24, 6, 6);
      g.fillRect(24, 24, 6, 6);

      g.fillStyle(COLORS.WHITE_NUM, 1);
      g.fillRect(14, 10, 4, 6);

      // Propulsores inferiores encendidos (Fotograma 2)
      g.fillStyle(COLORS.RED_NUM, 1);
      g.fillRect(10, 26, 4, 6);
      g.fillRect(18, 26, 4, 6);
      g.fillStyle(COLORS.YELLOW_NUM, 1);
      g.fillRect(11, 26, 2, 4);
      g.fillRect(19, 26, 2, 4);

      g.generateTexture(ASSET_KEYS.PLAYER_2, width, height);
      g.destroy();
    }

    // 2. Proyectil provisional (8x16 px)
    if (!this.hasValidTexture(ASSET_KEYS.BULLET)) {
      const { width, height } = SPRITE_SIZES.BULLET;
      const g = this.make.graphics({ x: 0, y: 0, add: false });

      g.fillStyle(COLORS.YELLOW_NUM, 1);
      g.fillRect(2, 0, 4, 16);
      g.fillStyle(COLORS.WHITE_NUM, 1);
      g.fillRect(3, 2, 2, 10);

      g.generateTexture(ASSET_KEYS.BULLET, width, height);
      g.destroy();
    }

    // 3. Marco de letra provisional (40x40 px)
    if (!this.hasValidTexture(ASSET_KEYS.LETTER_TILE)) {
      const { width, height } = SPRITE_SIZES.LETTER_TILE;
      const g = this.make.graphics({ x: 0, y: 0, add: false });

      // Borde exterior estilo pixel art
      g.fillStyle(COLORS.TILE_BORDER_NUM, 1);
      g.fillRect(0, 0, width, height);

      // Fondo interior oscuro de alto contraste para la letra
      g.fillStyle(COLORS.TILE_BG_NUM, 1);
      g.fillRect(3, 3, width - 6, height - 6);

      // Detalles en las esquinas
      g.fillStyle(COLORS.CYAN_NUM, 1);
      g.fillRect(3, 3, 3, 3);
      g.fillRect(width - 6, 3, 3, 3);
      g.fillRect(3, height - 6, 3, 3);
      g.fillRect(width - 6, height - 6, 3, 3);

      g.generateTexture(ASSET_KEYS.LETTER_TILE, width, height);
      g.destroy();
    }

    // 4. Partícula cuadrada para efectos de explosión (4x4 px)
    if (!this.hasValidTexture(ASSET_KEYS.PARTICLE)) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(COLORS.WHITE_NUM, 1);
      g.fillRect(0, 0, 4, 4);
      g.generateTexture(ASSET_KEYS.PARTICLE, 4, 4);
      g.destroy();
    }

    // 5. Fondos espaciales provisionales con estrellas tenues (64x64 px) si no existen los PNG
    if (!this.hasValidTexture(ASSET_KEYS.BACKGROUND)) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(COLORS.BACKGROUND_NUM, 1);
      g.fillRect(0, 0, 64, 64);
      g.fillStyle(COLORS.WHITE_NUM, 0.18);
      g.fillRect(18, 12, 1, 1);
      g.fillRect(8, 28, 1, 1);
      g.fillRect(50, 45, 1, 1);
      g.fillRect(24, 56, 1, 1);
      g.generateTexture(ASSET_KEYS.BACKGROUND, 64, 64);
      g.destroy();
    }

    if (!this.hasValidTexture(ASSET_KEYS.BACKGROUND_2)) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(COLORS.BACKGROUND_NUM, 1);
      g.fillRect(0, 0, 64, 64);
      g.fillStyle(COLORS.WHITE_NUM, 0.18);
      g.fillRect(18, 16, 1, 1);
      g.fillRect(8, 32, 1, 1);
      g.fillRect(50, 49, 1, 1);
      g.fillRect(24, 60, 1, 1);
      g.generateTexture(ASSET_KEYS.BACKGROUND_2, 64, 64);
      g.destroy();
    }
  }

  /**
   * Registra la animación de la nave alternando en bucle entre `player` y `player_2`.
   */
  createGlobalAnimations() {
    if (!this.anims.exists(ANIM_KEYS.PLAYER_IDLE)) {
      this.anims.create({
        key: ANIM_KEYS.PLAYER_IDLE,
        frames: [
          { key: ASSET_KEYS.PLAYER },
          { key: ASSET_KEYS.PLAYER_2 }
        ],
        frameRate: GAMEPLAY.PLAYER_ANIM_FPS,
        repeat: -1
      });
    }
  }

  /**
   * Verifica si una textura se cargó correctamente desde archivo y no es la textura __MISSING.
   * @param {string} key
   * @returns {boolean}
   */
  hasValidTexture(key) {
    if (this.missingAssets.has(key) || !this.textures.exists(key)) {
      return false;
    }
    const tex = this.textures.get(key);
    return tex && tex.key !== '__MISSING';
  }
}
