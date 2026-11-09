/**
 * SoundManager.js
 * Administra la reproducción de música de fondo y efectos de sonido en WORD INVADERS.
 * Si algún archivo de audio aún no ha sido agregado en `public/assets/audio/`,
 * el sistema lo detecta de forma segura y continúa funcionando sin lanzar errores.
 */

import { AUDIO_KEYS, AUDIO_VOLUMES } from '../config/constants.js';

export class SoundManager {
  /**
   * @param {Phaser.Scene} scene Escena de Phaser desde donde se accede al sistema de audio
   */
  constructor(scene) {
    this.scene = scene;
    this.bgmInstance = null;
  }

  /**
   * Actualiza la referencia de escena activa cuando se cambia entre escenas.
   * @param {Phaser.Scene} scene
   */
  setScene(scene) {
    this.scene = scene;
  }

  /**
   * Verifica si un recurso de audio fue cargado realmente en la caché de Phaser.
   * @param {string} key Clave del audio en AUDIO_KEYS
   * @returns {boolean}
   */
  hasAudio(key) {
    return Boolean(
      this.scene &&
        this.scene.cache &&
        this.scene.cache.audio &&
        this.scene.cache.audio.exists(key)
    );
  }

  /**
   * Inicia la música de fondo en bucle (loop).
   * Si ya está sonando, no la reinicia ni la duplica.
   */
  playBackgroundMusic() {
    if (!this.hasAudio(AUDIO_KEYS.BGM)) {
      return;
    }

    if (this.bgmInstance && this.bgmInstance.isPlaying) {
      return;
    }

    if (!this.bgmInstance) {
      this.bgmInstance = this.scene.sound.add(AUDIO_KEYS.BGM, {
        loop: true,
        volume: AUDIO_VOLUMES.BGM
      });
    }

    this.bgmInstance.play();
  }

  /**
   * Detiene la música de fondo si está en reproducción.
   */
  stopBackgroundMusic() {
    if (this.bgmInstance && this.bgmInstance.isPlaying) {
      this.bgmInstance.stop();
    }
  }

  /**
   * Reproduce el sonido de disparo de la nave.
   */
  playShoot() {
    this.playEffect(AUDIO_KEYS.SHOOT, AUDIO_VOLUMES.SHOOT);
  }

  /**
   * Reproduce el sonido al destruir una letra sobrante.
   */
  playLetterDestroy() {
    this.playEffect(AUDIO_KEYS.DESTROY, AUDIO_VOLUMES.DESTROY);
  }

  /**
   * Reproduce el sonido de error al destruir una letra correcta.
   */
  playError() {
    this.playEffect(AUDIO_KEYS.ERROR, AUDIO_VOLUMES.ERROR);
  }

  /**
   * Reproduce el sonido de éxito al completar una palabra/nivel.
   */
  playWordComplete() {
    this.playEffect(AUDIO_KEYS.WORD_COMPLETE, AUDIO_VOLUMES.WORD_COMPLETE);
  }

  /**
   * Reproduce un efecto de sonido puntual si el archivo existe en caché.
   * @param {string} key
   * @param {number} volume
   */
  playEffect(key, volume = 0.7) {
    if (!this.hasAudio(key)) {
      return;
    }
    this.scene.sound.play(key, { volume });
  }

  /**
   * Alterna el silencio global (Mute / Unmute) del juego.
   * @returns {boolean} Nuevo estado de silencio (true = silenciado)
   */
  toggleMute() {
    if (!this.scene || !this.scene.sound) {
      return false;
    }
    this.scene.sound.mute = !this.scene.sound.mute;
    return this.scene.sound.mute;
  }
}
