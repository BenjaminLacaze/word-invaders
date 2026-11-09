/**
 * WordGenerator.js
 * Sistema lógico puro encargado de generar la secuencia de letras de cada nivel
 * y validar los impactos sin depender de Phaser.
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export class WordGenerator {
  /**
   * Calcula cuántas letras sobrantes agregar según la cantidad de letras de la traducción.
   * @param {number} letterCount Cantidad de letras (sin contar espacios)
   * @returns {number}
   */
  static calculateExtraCount(letterCount) {
    if (letterCount <= 4) {
      return 4; // Ej: DOG (3) + 4 = 7 letras en pantalla
    }
    if (letterCount <= 7) {
      return 4; // Ej: APPLE (5) + 4 = 9 letras en pantalla
    }
    return 3;   // Ej: COMPUTER (8) + 3 = 11 letras en pantalla
  }

  /**
   * Genera la secuencia de nodos de letras para una palabra o expresión en inglés.
   *
   * Garantías del algoritmo:
   * 1. Todas las letras necesarias de la traducción están presentes (isExtra: false).
   * 2. Las letras correctas respetan estrictamente su orden original de izquierda a derecha.
   * 3. Los espacios en expresiones compuestas (HELLO WORLD) se marcan con isSpace: true
   *    para actuar como separadores visuales no destruibles.
   * 4. Las letras sobrantes (isExtra: true) se intercalan entre las letras de cada palabra.
   * 5. Para evitar ambigüedad visual en palabras con letras repetidas (APPLE, BOOK, TREE),
   *    las letras sobrantes se eligen excluyendo las letras que ya forman la traducción.
   *
   * @param {string} targetEnglishWord Palabra o expresión en inglés (ej: "APPLE", "HELLO WORLD")
   * @param {number|null} customExtraCount Cantidad opcional de letras sobrantes
   * @returns {Array<{id: number, char: string, isExtra: boolean, isSpace: boolean, wordIndex: number}>}
   */
  static generateSequence(targetEnglishWord, customExtraCount = null) {
    const normalized = targetEnglishWord.trim().replace(/\s+/g, ' ').toUpperCase();
    const words = normalized.split(' ');

    // Letras únicas que forman parte de la traducción (para no usarlas como sobrantes)
    const usedChars = new Set(normalized.replace(/\s+/g, '').split(''));

    // Pool de letras candidatas para ser sobrantes (mezcladas para no repetir letras sobrantes entre sí)
    let candidatePool = WordGenerator.shuffleArray(
      ALPHABET.filter((char) => !usedChars.has(char))
    );
    if (candidatePool.length === 0) {
      candidatePool = WordGenerator.shuffleArray([...ALPHABET]);
    }
    let poolCursor = 0;
    const pickNextExtraChar = () => {
      const char = candidatePool[poolCursor % candidatePool.length];
      poolCursor++;
      return char;
    };

    const totalCorrectLetters = normalized.replace(/\s+/g, '').length;
    const totalExtras =
      customExtraCount !== null
        ? customExtraCount
        : WordGenerator.calculateExtraCount(totalCorrectLetters);

    // Repartir la cantidad de letras sobrantes proporcionalmente entre cada palabra
    // (Si es 1 sola palabra, recibe todas las letras sobrantes; si son 2, se reparten)
    const extrasPerWord = WordGenerator.distributeExtrasAcrossWords(words, totalExtras);

    const sequence = [];
    let nextId = 0;

    words.forEach((word, wordIndex) => {
      const chars = word.split('');
      const numSlots = chars.length + 1; // Ranuras: antes, entre letras y después
      const slots = Array.from({ length: numSlots }, () => []);

      const extrasForThisWord = extrasPerWord[wordIndex];

      // Distribuir las letras sobrantes en las ranuras (máximo 2 por ranura para evitar amontonamiento)
      let placed = 0;
      let attempts = 0;
      while (placed < extrasForThisWord && attempts < 100) {
        attempts++;
        const randomSlotIndex = Math.floor(Math.random() * numSlots);
        if (slots[randomSlotIndex].length < 2) {
          slots[randomSlotIndex].push(pickNextExtraChar());
          placed++;
        }
      }

      // Si por alguna razón aún faltan por colocar, ponerlas en cualquier ranura
      while (placed < extrasForThisWord) {
        const randomSlotIndex = Math.floor(Math.random() * numSlots);
        slots[randomSlotIndex].push(pickNextExtraChar());
        placed++;
      }

      // Construir la secuencia intercalando: Ranura[i] -> LetraCorrecta[i] ... -> Ranura[N]
      for (let i = 0; i < chars.length; i++) {
        // Primero las letras sobrantes de la ranura i
        for (const extraChar of slots[i]) {
          sequence.push({
            id: nextId++,
            char: extraChar,
            isExtra: true,
            isSpace: false,
            wordIndex
          });
        }

        // Luego la letra correcta en su orden original
        sequence.push({
          id: nextId++,
          char: chars[i],
          isExtra: false,
          isSpace: false,
          wordIndex
        });
      }

      // Letras sobrantes de la última ranura (después de la última letra de la palabra)
      for (const extraChar of slots[chars.length]) {
        sequence.push({
          id: nextId++,
          char: extraChar,
          isExtra: true,
          isSpace: false,
          wordIndex
        });
      }

      // Si hay otra palabra después (ej: HELLO -> WORLD), insertar el nodo separador de espacio
      if (wordIndex < words.length - 1) {
        sequence.push({
          id: nextId++,
          char: ' ',
          isExtra: false,
          isSpace: true,
          wordIndex
        });
      }
    });

    return sequence;
  }

  /**
   * Reparte el total de letras sobrantes entre las palabras de una expresión compuesta.
   * @param {string[]} words
   * @param {number} totalExtras
   * @returns {number[]}
   */
  static distributeExtrasAcrossWords(words, totalExtras) {
    if (words.length === 1) {
      return [totalExtras];
    }

    const counts = new Array(words.length).fill(0);
    for (let i = 0; i < totalExtras; i++) {
      counts[i % words.length]++;
    }
    return counts;
  }

  /**
   * Mezcla una copia de un arreglo usando el algoritmo Fisher-Yates.
   * @param {Array} array
   * @returns {Array}
   */
  static shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Crea una copia profunda de una secuencia para asegurar que los reinicios del nivel
   * no alteren la plantilla almacenada en caché.
   * @param {Array} sequence
   * @returns {Array}
   */
  static cloneSequence(sequence) {
    return sequence.map((node) => ({ ...node }));
  }

  /**
   * Verifica si la secuencia dada, al eliminar las letras sobrantes,
   * reconstruye exactamente la traducción esperada en el mismo orden.
   * @param {Array<{char: string, isExtra: boolean}>} sequence
   * @param {string} targetEnglishWord
   * @returns {boolean}
   */
  static verifySequenceIntegrity(sequence, targetEnglishWord) {
    const normalizedTarget = targetEnglishWord.trim().replace(/\s+/g, ' ').toUpperCase();
    const reconstructed = sequence
      .filter((node) => !node.isExtra)
      .map((node) => node.char)
      .join('');
    return reconstructed === normalizedTarget;
  }
}
