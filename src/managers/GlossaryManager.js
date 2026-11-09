/**
 * GlossaryManager.js
 * Administra la carga, validación y acceso a la lista de palabras del glosario.
 */

const DEFAULT_FALLBACK_GLOSSARY = [
  { es: 'PERRO', en: 'DOG' },
  { es: 'GATO', en: 'CAT' },
  { es: 'MANZANA', en: 'APPLE' },
  { es: 'LIBRO', en: 'BOOK' },
  { es: 'ÁRBOL', en: 'TREE' },
  { es: 'COMPUTADORA', en: 'COMPUTER' },
  { es: 'HOLA MUNDO', en: 'HELLO WORLD' }
];

export class GlossaryManager {
  /**
   * @param {Array<{es: string, en: string}>} rawData Datos leídos desde glossary.json
   */
  constructor(rawData = []) {
    this.words = this.validateAndClean(rawData);
  }

  /**
   * Valida que cada entrada del JSON tenga los campos "es" y "en" válidos.
   * Normaliza los textos a mayúsculas y limpia espacios múltiples.
   * @param {Array} data
   * @returns {Array<{es: string, en: string}>}
   */
  validateAndClean(data) {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('GlossaryManager: Glosario vacío o inválido. Usando glosario de respaldo.');
      return [...DEFAULT_FALLBACK_GLOSSARY];
    }

    const validEntries = [];

    for (const item of data) {
      if (item && typeof item.es === 'string' && typeof item.en === 'string') {
        const cleanEs = item.es.trim().replace(/\s+/g, ' ').toUpperCase();
        const cleanEn = item.en.trim().replace(/\s+/g, ' ').toUpperCase();

        // Solo permitimos letras A-Z y espacios en la palabra en inglés
        const isValidEn = /^[A-Z]+(\s[A-Z]+)*$/.test(cleanEn);

        if (cleanEs.length > 0 && cleanEn.length > 0 && isValidEn) {
          validEntries.push({ es: cleanEs, en: cleanEn });
        }
      }
    }

    if (validEntries.length === 0) {
      console.warn('GlossaryManager: Ninguna entrada superó la validación. Usando respaldo.');
      return [...DEFAULT_FALLBACK_GLOSSARY];
    }

    return validEntries;
  }

  /**
   * Devuelve todas las palabras validadas.
   * @returns {Array<{es: string, en: string}>}
   */
  getAllWords() {
    return this.words;
  }

  /**
   * Obtiene el par de palabras correspondiente a un índice de nivel.
   * @param {number} index
   * @returns {{es: string, en: string} | null}
   */
  getWordAt(index) {
    if (index < 0 || index >= this.words.length) {
      return null;
    }
    return this.words[index];
  }

  /**
   * Cantidad total de niveles disponibles en el glosario.
   * @returns {number}
   */
  getTotalWords() {
    return this.words.length;
  }
}
