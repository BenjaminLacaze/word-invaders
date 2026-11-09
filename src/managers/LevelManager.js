/**
 * LevelManager.js
 * Controla el progreso de niveles, el contador de errores y la caché de la secuencia
 * actual para garantizar que al reiniciar un nivel por error se mantenga
 * exactamente la misma secuencia de letras.
 */

import { WordGenerator } from '../systems/WordGenerator.js';

export class LevelManager {
  /**
   * @param {import('./GlossaryManager.js').GlossaryManager} glossaryManager
   */
  constructor(glossaryManager) {
    this.glossaryManager = glossaryManager;
    this.currentLevelIndex = 0;
    this.errorCount = 0;
    this.currentSequenceCache = null;
  }

  /**
   * Reinicia toda la partida desde el nivel 1 con 0 errores.
   */
  resetGame() {
    this.currentLevelIndex = 0;
    this.errorCount = 0;
    this.currentSequenceCache = null;
  }

  /**
   * Obtiene la información del nivel actual (números, palabras y secuencia de letras).
   * Si el nivel ya tiene una secuencia en caché (por ejemplo, tras un reinicio),
   * devuelve un clon exacto de dicha secuencia sin generar una nueva.
   *
   * @returns {{
   *   levelNumber: number,
   *   totalLevels: number,
   *   wordEs: string,
   *   wordEn: string,
   *   sequence: Array<{id: number, char: string, isExtra: boolean, isSpace: boolean, wordIndex: number}>
   * } | null}
   */
  getCurrentLevelData() {
    const wordPair = this.glossaryManager.getWordAt(this.currentLevelIndex);
    if (!wordPair) {
      return null;
    }

    if (!this.currentSequenceCache) {
      this.currentSequenceCache = WordGenerator.generateSequence(wordPair.en);
    }

    return {
      levelNumber: this.currentLevelIndex + 1,
      totalLevels: this.glossaryManager.getTotalWords(),
      wordEs: wordPair.es,
      wordEn: wordPair.en,
      sequence: WordGenerator.cloneSequence(this.currentSequenceCache)
    };
  }

  /**
   * Registra un error cuando el jugador destruye una letra correcta.
   * No borra `currentSequenceCache`, garantizando que el reinicio del nivel
   * mantenga exactamente las mismas letras en las mismas posiciones.
   * @returns {number} Nuevo total de errores
   */
  registerError() {
    this.errorCount += 1;
    return this.errorCount;
  }

  /**
   * Avanza al siguiente nivel y limpia la caché para que el nuevo nivel
   * genere su propia secuencia de letras.
   * @returns {boolean} true si todavía quedan niveles por jugar, false si completó todos
   */
  advanceToNextLevel() {
    this.currentLevelIndex += 1;
    this.currentSequenceCache = null;
    return this.currentLevelIndex < this.glossaryManager.getTotalWords();
  }

  /**
   * Devuelve el número total de errores cometidos en la partida.
   * @returns {number}
   */
  getErrors() {
    return this.errorCount;
  }

  /**
   * Devuelve el total de niveles del glosario.
   * @returns {number}
   */
  getTotalLevels() {
    return this.glossaryManager.getTotalWords();
  }
}
