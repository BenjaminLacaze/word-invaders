/**
 * GameScene.js
 * Escena principal del juego WORD INVADERS.
 * Coordina el HUD, la ubicación de las letras, la nave del jugador,
 * los disparos, las colisiones y las condiciones de victoria o reinicio de nivel.
 */

import Phaser from 'phaser';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  SCENES,
  ASSET_KEYS,
  GAMEPLAY,
  COLORS,
  FONT_FAMILY
} from '../config/constants.js';
import { Player } from '../entities/Player.js';
import { Bullet } from '../entities/Bullet.js';
import { LetterBox } from '../entities/LetterBox.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENES.GAME);
  }

  create() {
    this.levelManager = this.registry.get('levelManager');
    this.soundManager = this.registry.get('soundManager');
    this.isTransitioning = false;

    if (this.soundManager) {
      this.soundManager.setScene(this);
      this.soundManager.playBackgroundMusic();
    }

    // Tecla M para silenciar o activar el sonido en cualquier momento
    this.input.keyboard.on('keydown-M', () => {
      if (this.soundManager) {
        this.soundManager.toggleMute();
      }
    });

    // Tecla P como atajo opcional para el botón de pista
    this.input.keyboard.on('keydown-P', () => {
      this.revealHint();
    });

    // 1. Fondo espacial
    this.createBackground();

    // 2. Interfaz superior (HUD)
    this.createHUD();

    // 3. Grupos de físicas para proyectiles y letras
    this.bulletsGroup = this.physics.add.group({
      runChildUpdate: true
    });
    this.lettersGroup = this.physics.add.group();
    this.spaceMarkers = [];

    // 4. Instanciar la nave del jugador en el centro inferior
    this.player = new Player(this, GAME_WIDTH / 2, GAMEPLAY.PLAYER_Y);

    // 5. Detectar colisiones entre proyectiles y bloques de letras
    this.physics.add.overlap(
      this.bulletsGroup,
      this.lettersGroup,
      this.onBulletHitLetter,
      null,
      this
    );

    // 6. Cargar los datos y letras del nivel actual
    this.setupCurrentLevel();
  }

  update(time, delta) {
    if (this.bgTile) {
      this.bgTile.tilePositionY -= (GAMEPLAY.BG_SCROLL_SPEED * delta) / 1000;
    }

    if (this.isTransitioning) {
      return;
    }

    this.player.update();

    if (this.player.wantsToFire(time)) {
      this.fireBullet();
    }
  }

  /**
   * Crea un proyectil en la posición actual del cañón de la nave.
   */
  fireBullet() {
    const bullet = new Bullet(this, this.player.x, this.player.y - 22);
    this.bulletsGroup.add(bullet);
    bullet.body.setAllowGravity(false);
    bullet.setVelocityY(-GAMEPLAY.BULLET_SPEED);

    if (this.soundManager) {
      this.soundManager.playShoot();
    }
  }

  /**
   * Configura el escenario con la palabra y secuencia del nivel actual.
   * Si se llama tras un error, reconstruye exactamente la misma secuencia desde la caché.
   */
  setupCurrentLevel() {
    this.isTransitioning = false;
    this.player.setControlsEnabled(true);

    // Limpiar proyectiles y letras previas
    this.bulletsGroup.clear(true, true);
    this.lettersGroup.clear(true, true);
    this.spaceMarkers.forEach((m) => m.destroy());
    this.spaceMarkers = [];

    const levelData = this.levelManager.getCurrentLevelData();
    if (!levelData) {
      this.scene.start(SCENES.VICTORY);
      return;
    }

    this.currentLevelData = levelData;

    // Actualizar textos del HUD
    this.levelText.setText(
      `NIVEL: ${levelData.levelNumber} / ${levelData.totalLevels}`
    );
    this.errorText.setText(`ERRORES: ${this.levelManager.getErrors()}`);
    this.spanishWordText.setText(`TRADUCE: "${levelData.wordEs}"`);
    this.statusMessageText.setText(
      'Dispara únicamente a las letras sobrantes'
    );
    this.statusMessageText.setColor(COLORS.MUTED_HEX);

    // Reiniciar el estado del botón de pista al cargar el nivel
    this.resetHintButton();

    // Renderizar la fila de letras centrada
    this.spawnLetterSequence(levelData.sequence);
  }

  /**
   * Posiciona todas las letras de la secuencia en una fila horizontal centrada,
   * garantizando que cada letra tenga una línea de tiro vertical despejada.
   * @param {Array<{id: number, char: string, isExtra: boolean, isSpace: boolean}>} sequence
   */
  spawnLetterSequence(sequence) {
    const count = sequence.length;
    const maxUsableWidth = GAME_WIDTH - 70; // 730 px disponibles

    // Espaciado adaptable según la cantidad total de elementos en la secuencia
    const spacingX = Math.min(
      GAMEPLAY.LETTER_SPACING_X,
      Math.floor(maxUsableWidth / Math.max(count, 1))
    );

    // Escala adaptable si la expresión es muy larga
    const tileScale = spacingX < 44 ? spacingX / 44 : 1;

    const totalRowWidth = (count - 1) * spacingX;
    const startX = GAME_WIDTH / 2 - totalRowWidth / 2;
    const rowY = GAMEPLAY.LETTER_ROW_1_Y;

    sequence.forEach((node, index) => {
      const x = Math.round(startX + index * spacingX);

      // Si es un espacio separador entre palabras (ej. HELLO WORLD), no es destruible
      if (node.isSpace) {
        const spaceMarker = this.add
          .text(x, rowY + 12, '_', {
            fontFamily: FONT_FAMILY,
            fontSize: '20px',
            color: COLORS.MUTED_HEX
          })
          .setOrigin(0.5);
        this.spaceMarkers.push(spaceMarker);
        return;
      }

      const letterBox = new LetterBox(this, x, rowY, node);
      if (tileScale < 1) {
        letterBox.setScale(tileScale);
      }
      this.lettersGroup.add(letterBox);

      if (letterBox.body) {
        letterBox.body.setAllowGravity(false);
        letterBox.body.setImmovable(true);
      }
    });
  }

  /**
   * Callback ejecutado cuando un proyectil impacta en un bloque de letra.
   * @param {Bullet} bullet
   * @param {LetterBox} letterBox
   */
  onBulletHitLetter(bullet, letterBox) {
    // Evitar colisiones múltiples en el mismo fotograma
    if (
      this.isTransitioning ||
      !bullet.active ||
      !letterBox.active ||
      letterBox.isDestroyed
    ) {
      return;
    }

    // Destruir el proyectil inmediatamente al primer contacto
    bullet.disableBody(true, true);
    bullet.destroy();

    if (letterBox.isExtra) {
      // Caso 1: Letra sobrante destruida correctamente
      if (this.soundManager) {
        this.soundManager.playLetterDestroy();
      }
      this.spawnExplosion(letterBox.x, letterBox.y, COLORS.CYAN_NUM);
      letterBox.destroyLetter();

      // Verificar si aún quedan letras sobrantes en el escenario
      const remainingExtras = this.lettersGroup
        .getChildren()
        .filter((item) => item.active && !item.isDestroyed && item.isExtra);

      if (remainingExtras.length === 0) {
        this.handleLevelComplete();
      }
    } else {
      // Caso 2: Error -> El jugador disparó a una letra necesaria de la traducción
      this.handleMistake(letterBox);
    }
  }

  /**
   * Se ejecuta cuando el jugador destruye por error una letra correcta.
   * Incrementa el contador de errores y reinicia el nivel con la misma secuencia.
   * @param {LetterBox} hitLetterBox
   */
  handleMistake(hitLetterBox) {
    this.isTransitioning = true;
    this.player.setControlsEnabled(false);
    this.bulletsGroup.clear(true, true);

    if (this.soundManager) {
      this.soundManager.playError();
    }

    hitLetterBox.highlightAsError();
    this.spawnExplosion(hitLetterBox.x, hitLetterBox.y, COLORS.RED_NUM);

    const totalErrors = this.levelManager.registerError();
    this.errorText.setText(`ERRORES: ${totalErrors}`);

    this.statusMessageText.setText(
      `¡CUIDADO! "${hitLetterBox.char}" ERA CORRECTA. REINICIANDO NIVEL...`
    );
    this.statusMessageText.setColor(COLORS.RED_HEX);

    this.cameras.main.shake(180, 0.006);

    this.time.delayedCall(GAMEPLAY.ERROR_RESET_DELAY, () => {
      // Al no borrar la caché en LevelManager, se restaura exactamente la misma secuencia
      this.setupCurrentLevel();
    });
  }

  /**
   * Se ejecuta únicamente cuando desaparecen todas las letras sobrantes del nivel.
   */
  handleLevelComplete() {
    this.isTransitioning = true;
    this.player.setControlsEnabled(false);
    this.bulletsGroup.clear(true, true);

    if (this.soundManager) {
      this.soundManager.playWordComplete();
    }

    // Resaltar y juntar en el centro las letras correctas para reforzar el aprendizaje visual
    const remainingCorrect = this.lettersGroup
      .getChildren()
      .filter((item) => item.active && !item.isDestroyed && !item.isExtra);

    remainingCorrect.forEach((letterBox) => {
      letterBox.highlightAsCorrect();
    });

    this.compactCorrectWord(remainingCorrect);

    this.statusMessageText.setText(
      `¡EXCELENTE! ${this.currentLevelData.wordEs} = ${this.currentLevelData.wordEn}`
    );
    this.statusMessageText.setColor(COLORS.GREEN_HEX);

    this.time.delayedCall(GAMEPLAY.LEVEL_CLEAR_DELAY, () => {
      const hasMoreLevels = this.levelManager.advanceToNextLevel();
      if (hasMoreLevels) {
        this.setupCurrentLevel();
      } else {
        this.scene.start(SCENES.VICTORY);
      }
    });
  }

  /**
   * Anima suavemente las letras correctas restantes hacia el centro para mostrar
   * la palabra limpia en inglés al completar el nivel.
   * @param {LetterBox[]} correctLetters
   */
  compactCorrectWord(correctLetters) {
    this.spaceMarkers.forEach((m) => m.setVisible(false));

    const targetWord = this.currentLevelData.wordEn;
    const chars = targetWord.split('');
    const spacing = 46;
    const totalWidth = (chars.length - 1) * spacing;
    const startX = GAME_WIDTH / 2 - totalWidth / 2;

    let letterCursor = 0;
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ' ') {
        continue;
      }
      const box = correctLetters[letterCursor];
      if (box) {
        this.tweens.add({
          targets: box,
          x: Math.round(startX + i * spacing),
          scaleX: 1,
          scaleY: 1,
          duration: 380,
          ease: 'Cubic.easeOut'
        });
        letterCursor++;
      }
    }
  }

  /**
   * Pequeño efecto de partículas pixel art al destruir un bloque de letra.
   * @param {number} x
   * @param {number} y
   * @param {number} tintColor
   */
  spawnExplosion(x, y, tintColor) {
    const emitter = this.add.particles(x, y, ASSET_KEYS.PARTICLE, {
      speed: { min: 40, max: 140 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.2, end: 0 },
      lifespan: 350,
      tint: tintColor,
      quantity: 12,
      emitting: false
    });
    emitter.explode(12);
    this.time.delayedCall(400, () => {
      emitter.destroy();
    });
  }

  /**
   * Crea la barra de información superior (HUD).
   */
  createHUD() {
    const hudPanel = this.add.graphics();
    hudPanel.fillStyle(COLORS.HUD_BG_NUM, 0.95);
    hudPanel.lineStyle(2, COLORS.HUD_BORDER_NUM, 1);
    hudPanel.fillRect(16, 12, GAME_WIDTH - 32, 92);
    hudPanel.strokeRect(16, 12, GAME_WIDTH - 32, 92);

    // Línea divisoria inferior cerca de la nave
    hudPanel.lineStyle(1, COLORS.HUD_BORDER_NUM, 0.6);
    hudPanel.lineBetween(24, 572, GAME_WIDTH - 24, 572);

    this.levelText = this.add.text(34, 24, 'NIVEL: 1 / 1', {
      fontFamily: FONT_FAMILY,
      fontSize: '16px',
      fontStyle: 'bold',
      color: COLORS.CYAN_HEX
    });

    this.errorText = this.add
      .text(GAME_WIDTH - 34, 24, 'ERRORES: 0', {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        fontStyle: 'bold',
        color: COLORS.RED_HEX
      })
      .setOrigin(1, 0);

    this.spanishWordText = this.add
      .text(GAME_WIDTH / 2, 50, 'TRADUCE: "..."', {
        fontFamily: FONT_FAMILY,
        fontSize: '26px',
        fontStyle: 'bold',
        color: COLORS.YELLOW_HEX
      })
      .setOrigin(0.5, 0.5);

    this.statusMessageText = this.add
      .text(GAME_WIDTH / 2, 84, '', {
        fontFamily: FONT_FAMILY,
        fontSize: '14px',
        color: COLORS.MUTED_HEX
      })
      .setOrigin(0.5, 0.5);

    // Botón interactivo de PISTA al costado derecho del panel
    this.createHintButton();

    // Guía de controles en el pie de pantalla
    this.add
      .text(
        GAME_WIDTH / 2,
        585,
        '[FLECHAS / A-D] Mover  |  [ESPACIO] Disparar  |  [CLIC / P] Pista',
        {
          fontFamily: FONT_FAMILY,
          fontSize: '13px',
          color: COLORS.MUTED_HEX
        }
      )
      .setOrigin(0.5);
  }

  /**
   * Crea un botón interactivo al costado derecho para revelar la palabra en inglés.
   */
  createHintButton() {
    this.hintRevealed = false;

    const btnX = GAME_WIDTH - 92;
    const btnY = 68;
    const btnWidth = 116;
    const btnHeight = 32;

    this.hintBtnBg = this.add
      .rectangle(btnX, btnY, btnWidth, btnHeight, COLORS.TILE_BG_NUM, 1)
      .setStrokeStyle(2, COLORS.CYAN_NUM)
      .setInteractive({ useHandCursor: true });

    this.hintBtnText = this.add
      .text(btnX, btnY, '? PISTA', {
        fontFamily: FONT_FAMILY,
        fontSize: '15px',
        fontStyle: 'bold',
        color: COLORS.CYAN_HEX
      })
      .setOrigin(0.5);

    // Texto donde se muestra la palabra revelada debajo del panel al costado derecho
    this.hintRevealText = this.add
      .text(GAME_WIDTH - 24, 118, '', {
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        fontStyle: 'bold',
        color: COLORS.GREEN_HEX,
        backgroundColor: '#16162b',
        padding: { x: 10, y: 5 }
      })
      .setOrigin(1, 0)
      .setVisible(false);

    this.hintBtnBg.on('pointerover', () => {
      if (!this.hintRevealed) {
        this.hintBtnBg.setFillStyle(0x2a3158, 1);
        this.hintBtnBg.setStrokeStyle(2, COLORS.YELLOW_NUM);
        this.hintBtnText.setColor(COLORS.YELLOW_HEX);
      }
    });

    this.hintBtnBg.on('pointerout', () => {
      if (!this.hintRevealed) {
        this.hintBtnBg.setFillStyle(COLORS.TILE_BG_NUM, 1);
        this.hintBtnBg.setStrokeStyle(2, COLORS.CYAN_NUM);
        this.hintBtnText.setColor(COLORS.CYAN_HEX);
      }
    });

    this.hintBtnBg.on('pointerdown', () => {
      this.revealHint();
    });
  }

  /**
   * Revela la traducción en inglés del nivel actual al presionar el botón de pista.
   */
  revealHint() {
    if (!this.currentLevelData || this.isTransitioning) {
      return;
    }

    this.hintRevealed = true;
    this.hintBtnBg.setFillStyle(0x1b3b2b, 1);
    this.hintBtnBg.setStrokeStyle(2, COLORS.GREEN_NUM);
    this.hintBtnText.setText('PISTA ACTIVA');
    this.hintBtnText.setColor(COLORS.GREEN_HEX);
    this.hintBtnText.setFontSize('12px');

    this.hintRevealText.setText(`INGLÉS: ${this.currentLevelData.wordEn}`);
    this.hintRevealText.setVisible(true);
  }

  /**
   * Restaura el botón de pista y oculta la traducción revelada al cambiar de nivel.
   */
  resetHintButton() {
    if (!this.hintBtnBg) {
      return;
    }
    this.hintRevealed = false;
    this.hintBtnBg.setFillStyle(COLORS.TILE_BG_NUM, 1);
    this.hintBtnBg.setStrokeStyle(2, COLORS.CYAN_NUM);
    this.hintBtnText.setText('? PISTA');
    this.hintBtnText.setColor(COLORS.CYAN_HEX);
    this.hintBtnText.setFontSize('15px');
    this.hintRevealText.setText('');
    this.hintRevealText.setVisible(false);
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
